import Http from './utils/Http';
import M3u8Parser from './utils/M3u8Parser';

const POLL_INTERVAL = 1000;

class NativeHls extends Meister.MediaPlugin {
    constructor(config, meister, next) {
        super(config, meister);

        this.manifestParsed = false;

        this.audioMode = false;

        this.metadata = [];
        this.previousMetadata = null;

        // Middleware promise chain.
        this.next = next;

        // -1 for automatic quality selection
        this.previousLevel = -1;
        this.lowestLevel = 0;

        this.dvrThreshold = this.config.dvrThreshold || 300;

        // new
        this.duration = 0;
        this.endTime = 0;
        this.beginTime = 0;
        this.mediaSequence = 0;
        this.lastMediaSequence = 0;
        this.childManifest = null;
        this.qualityStreams = [];
        this.masterPlaylist = null;

        this.baseEndTime = 0;

        this.manifestTimeoutId = null;

        // Keep track of the current playback quality.
        this.pollResolutionId = null;
        this.currentResolution = {
            width: 0,
            height: 0,
        };

        this.name = 'nativeHLS';
        this.events = [];
    }

    static get pluginName() {
        return 'NativeHls';
    }

    isItemSupported(item) {
        return new Promise((resolve) => {
            if (item.type !== 'm3u8' && item.type !== 'm3u') {
                return resolve({
                    supported: false,
                    errorCode: Meister.ErrorCodes.WRONG_TYPE,
                });
            }
            // Exception for safari.
            if ((!this.meister.browser.isSafari)
                || (!this.meister.browser.isiOS && this.config.safariDesktopDisabled)
            ) {
                return resolve({
                    supported: false,
                    errorCode: Meister.ErrorCodes.NOT_SUPPORTED,
                });
            }

            if (item.drm || item.drmConfig) {
                this.meister.one('drmKeySystemSupport', (supportedDRMSystems) => {
                    let supported = false;
                    Object.keys(supportedDRMSystems).forEach((key) => {
                        if ((key === 'com.apple.fps' && supportedDRMSystems[key]) ||
                            (key === 'com.apple.fps.1_0' && supportedDRMSystems[key]) ||
                            (key === 'com.apple.fps.2_0' && supportedDRMSystems[key])) {
                            supported = true;
                        }
                    });
                    return resolve({
                        supported,
                        errorCode: supported ? null : Meister.ErrorCodes.NO_DRM,
                    });
                });

                this.meister.trigger('requestDrmKeySystemSupport', {});
            } else {
                return resolve({
                    supported: true,
                });
            }
        });
    }

    resetPrivates() {
        this.metadata = [];
        this.previousMetadata = null;

        this.manifestParsed = false;

        this.previousLevel = -1;
        this.lowestLevel = 0;
        this.duration = 0;
        this.item = null;
    }

    process(item) {
        return this.next(item).then((newItem) => {
            this.player = this.meister.getPlayerByType('html5', newItem);
            if (this.meister.config.audioOnly || newItem.mediaType === 'audio') {
                this.audioMode = true;
            } else {
                this.audioMode = false;
            }

            return newItem;
        }).catch((err) => {
            console.error(`Something went wrong while processing middlewares. ${err}`);
        });
    }

    load(item) {
        super.load(item);
        this.item = item;

        return new Promise((resolve) => {
            this.mediaElement = this.player.mediaElement;
            this.mediaElement.src = item.src;
            this.masterPlaylist = item.src;

            // Display the correct title.
            this.on('_playerTimeUpdate', this._onPlayerTimeUpdate.bind(this));
            this.on('_playerSeek', this._onPlayerSeek.bind(this));
            this.on('requestSeek', this.onRequestSeek.bind(this));

            // Listen to control events.
            this.on('requestBitrate', this.onRequestBitrate.bind(this));
            this.on('requestGoLive', () => this.onRequestGoLive());

            this.pollResolutionId = setInterval(this.pollResolution.bind(this), POLL_INTERVAL);

            // Trigger this to make it look pretty.
            // Loading the first playlist.
            this.loadManifest(item.src).then((manifest) => {
                this.endTime = manifest.duration;
                this.baseEndTime = this.endTime;
                this.duration = manifest.duration;
                this.mediaSequence = manifest.mediaSequence;

                this.beginTime = this.endTime - this.duration;

                // Kinda weird, but let's roll with it for now..
                const lastMediaSequence = Object.keys(manifest.segments)[(Object.keys(manifest.segments).length - 1)];
                this.lastMediaSequence = lastMediaSequence;

                let hasDVR = ((manifest.duration > this.dvrThreshold) && manifest.isLive);

                if (this.config.dvrEnabled === false) {
                    hasDVR = false;
                }

                this.meister.trigger('itemTimeInfo', {
                    isLive: manifest.isLive,
                    hasDVR,
                    duration: this.duration,
                    modifiedDuration: this.duration,
                    endTime: this.endTime,
                });

                // this.onMasterPlaylistLoaded(manifest);
                if (manifest.isLive) this.onRequestGoLive();

                this.manifestTimeoutId = setTimeout(() => {
                    this.getNewManifest();
                }, 5000); // Amount of seconds should be dynamic (By using the manifest)
            });

            resolve();
        });
    }

    _onPlayerTimeUpdate() {
        const playOffset = this.endTime - this.duration;

        this.meister.trigger('playerTimeUpdate', {
            currentTime: this.meister.currentTime - playOffset,
            duration: this.duration,
        });

        this.broadcastTitle();
    }

    _onPlayerSeek() {
        const playOffset = this.endTime - this.duration;

        const currentTime = this.meister.currentTime - playOffset;
        const duration = this.duration;
        const relativePosition = currentTime / duration;

        this.meister.trigger('playerSeek', {
            relativePosition,
            currentTime,
            duration,
        });
    }

    onRequestSeek(e) {
        let targetTime;

        if (Number.isFinite(e.relativePosition)) {
            const playOffset = this.endTime - this.duration;
            targetTime = (this.duration * e.relativePosition) + playOffset;
        } else if (Number.isFinite(e.timeOffset)) {
            targetTime = this.meister.currentTime + e.timeOffset;
        } else if (Number.isFinite(e.targetTime)) {
            const playOffset = this.endTime - this.duration;
            targetTime = e.targetTime + playOffset;
        }

        // Check whether we are allowed to seek forward.
        if (!e.forcedStart && this.blockSeekForward && targetTime > this.meister.currentTime) { return; }

        if (Number.isFinite(targetTime)) {
            this.meister.currentTime = targetTime;
        }
    }

    onRequestGoLive() {
        if (isNaN(this.meister.duration)) {
            this.meister.one('playerLoadedMetadata', () => {
                this.onRequestGoLive();
            });
        } else {
            this.meister.currentTime = this.endTime - 30;
        }
    }

    broadcastTitle() {
        const time = this.meister.currentTime;
        // No need to spam events.
        if (this.previousMetadata &&
                (this.previousMetadata.start < time && time < this.previousMetadata.end)
            ) {
            return;
        }

        // Still playing the same item.
        const currentMetadata = this.currentlyPlaying;
        if (this.previousMetadata &&
                (currentMetadata.title === this.previousMetadata.title)
            ) {
            return;
        }

        // Remember the current metadata for the next call.
        this.previousMetadata = currentMetadata;

        // Broadcast event for the ui.
        this.meister.trigger('itemMetadata', {
            title: currentMetadata.title,
        });
    }


    onRequestBitrate(e) {
        const previousCurrentTime = this.meister.currentTime;
        const wasPlaying = this.meister.playing;

        // Since we're setting a new source we could need updated drm settings.
        if (e.drmConfig) {
            this.meister.trigger('drmConfig', e.drmConfig);
        }

        this.meister.playerPlugin.mediaElement.src = '';
        if (e.bitrateIndex === -1) {
            this.meister.playerPlugin.mediaElement.src = this.masterPlaylist;
        } else {
            this.meister.playerPlugin.mediaElement.src = this.meister.utils.resolveUrl(this.masterPlaylist, this.qualityStreams[e.bitrateIndex].url);
        }

        // Reset playoffset and endtime, since we cleared the source.
        this.playOffset = 0;
        this.endTime = this.baseEndTime;

        this.meister.one('playerLoadedMetadata', () => {
            this.meister.currentTime = previousCurrentTime;

            if (wasPlaying) {
                this.meister.play();
            } else {
                this.meister.pause();
            }
        });
    }

    onError(e, data) {
        console.warn(`Error in ${this.name}, type: ${data.details}, will attempt to recover.`);
        if (data.fatal) {
            console.error(`Can not recover from ${data.type}: ${data.details}.`);
        }
    }

    // copypaste from native-hls
    pollResolution() {
        const height = this.mediaElement.videoHeight;
        const width = this.mediaElement.videoWidth;

        if (this.currentResolution.width === width && this.currentResolution.height === height) return;

        const newBitrate = this.qualityStreams.find((stream) =>
            stream.resolution && stream.resolution.width === width && stream.resolution.height === height
        );

        // This can happen while switching streams, no need to notify the player.
        if (!newBitrate) return;

        const newBitrateIndex = this.qualityStreams.indexOf(newBitrate);

        this.meister.trigger('playerAutoSwitchBitrate', {
            newBitrate: parseInt(newBitrate.bandwith, 10),
            newBitrateIndex,
        });

        this.currentResolution = newBitrate.resolution;
    }

    get currentItem() {
        const metadata = this.currentlyPlaying;

        const currentItem = {
            src: this.item.src,
            type: this.item.type,
            title: metadata.title,
            bitrate: metadata.bitrate,
        };

        return currentItem;
    }

    get currentlyPlaying() {
        // Prepare return object.
        const metadata = {
            bitrate: 0,
            title: '',
        };

        // Traverse backwards since it is more likely that the player is near the end
        let data = null;
        const time = this.meister.currentTime;
        for (let i = this.metadata.length - 1; i >= 0; i--) {
            if (this.metadata[i].start < time && time < this.metadata[i].end) {
                data = this.metadata[i];
                break;
            }
        }

        if (data) {
            metadata.title = data.title;
            metadata.start = data.start;
            metadata.end = data.end;
            metadata.duration = data.end - data.start;
        }

        return metadata;
    }

    // copypaste from native-hls
    getNewManifest() {
        this.loadManifest(this.childManifest).then((manifest) => {
            const lastMediaSequence = Object.keys(manifest.segments)[(Object.keys(manifest.segments).length - 1)];
            const amountOfNewSegments = lastMediaSequence - this.lastMediaSequence;

            for (let i = 0; i < amountOfNewSegments; i++) {
                this.endTime += manifest.segments[Object.keys(manifest.segments)[i]];
            }

            // Just for testing purposes:
            this.duration = manifest.duration;
            this.beginTime = this.endTime - manifest.duration;
            this.lastMediaSequence = lastMediaSequence;

            let hasDVR = ((manifest.duration > this.dvrThreshold) && manifest.isLive);

            if (this.config.dvrEnabled === false) {
                hasDVR = false;
            }

            this.meister.trigger('itemTimeInfo', {
                isLive: manifest.isLive,
                hasDVR,
                duration: this.duration,
                modifiedDuration: this.duration,
                endTime: this.endTime,
            });

            this.manifestTimeoutId = setTimeout(() => {
                this.getNewManifest();
            }, 5000);
        }, () => {
            console.warn('WARNING: Could not load manifest, retrying loading manifest.');
            this.manifestTimeoutId = setTimeout(() => {
                this.getNewManifest();
            }, 5000);
        });
    }

    // copypaste from native-hls
    loadManifest(src) {
        return new Promise((resolve) => {
            Http.get(src, (res) => {
                const m3u8 = new M3u8Parser(res.responseText);
                const manifest = m3u8.parse();

                if (manifest.streams.length) {
                    if (this.config.filterAudioOnly) {
                        this.qualityStreams = manifest.streams.filter((stream) => stream.resolution);
                    } else {
                        this.qualityStreams = manifest.streams;
                    }

                    this.onQualitysAvailable();

                    this.childManifest = this.meister.utils.resolveUrl(src, manifest.streams[0].url);
                    // This is the master playlist we need to parse the sub playlist.
                    this.loadManifest(this.meister.utils.resolveUrl(src, manifest.streams[0].url)).then((childManifest) => {
                        resolve(childManifest);
                    });
                } else {
                    resolve(manifest);
                }
            });
        });
    }

    // copypaste from native-hls
    onQualitysAvailable() {
        const bitrates = [];

        // Bitrate 0 means auto quality.
        bitrates.push({
            bitrate: 0,
            index: -1,
        });

        for (let i = 0; i < this.qualityStreams.length; i++) {
            const bitrate = this.qualityStreams[i];
            bitrates.push({
                bitrate: parseInt(bitrate.bandwith, 10),
                index: i,
            });
        }

        // Trigger auto bitrate by default.
        this.meister.trigger('itemBitrates', {
            bitrates,
            currentIndex: -1,
        });
    }

    unload() {
        super.unload();
        if (this.manifestTimeoutId) clearTimeout(this.manifestTimeoutId);
        if (this.pollResolutionId) clearInterval(this.pollResolutionId);

        this.meister.remove(this.events);

        this.duration = 0;
        this.endTime = 0;
        this.baseEndTime = 0;
        this.beginTime = 0;
        this.mediaSequence = 0;
        this.lastMediaSequence = 0;
        this.childManifest = null;
        this.qualityStreams = [];
        this.masterPlaylist = null;
        this.manifestTimeoutId = null;
        this.pollResolutionId = null;
        this.currentResolution = {
            width: 0,
            height: 0,
        };
        this.mediaElement = null;
    }

    destroy() {
        super.destroy();
    }
}

Meister.registerPlugin(NativeHls.pluginName, NativeHls);
export default NativeHls;