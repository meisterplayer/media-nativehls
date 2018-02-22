module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NativeHls = __webpack_require__(1);

var _NativeHls2 = _interopRequireDefault(_NativeHls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _NativeHls2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _M3u8Parser = __webpack_require__(3);

var _M3u8Parser2 = _interopRequireDefault(_M3u8Parser);

var _package = __webpack_require__(5);

var _package2 = _interopRequireDefault(_package);

var _isAdItem = __webpack_require__(4);

var _isAdItem2 = _interopRequireDefault(_isAdItem);

var _Id3Tag = __webpack_require__(2);

var _Id3Tag2 = _interopRequireDefault(_Id3Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var POLL_INTERVAL = 1000;

var NativeHls = function (_Meister$MediaPlugin) {
    _inherits(NativeHls, _Meister$MediaPlugin);

    function NativeHls(config, meister, next) {
        _classCallCheck(this, NativeHls);

        var _this = _possibleConstructorReturn(this, (NativeHls.__proto__ || Object.getPrototypeOf(NativeHls)).call(this, config, meister));

        _this.manifestParsed = false;

        _this.audioMode = false;

        // Middleware promise chain.
        _this.next = next;

        // -1 for automatic quality selection
        _this.previousLevel = -1;
        _this.lowestLevel = 0;

        _this.dvrThreshold = _this.config.dvrThreshold;

        if (typeof _this.dvrThreshold === 'undefined') {
            _this.dvrThreshold = 300;
        }

        // new
        _this.mediaDuration = 0;
        _this.endTime = 0;
        _this.beginTime = 0;
        _this.mediaSequence = 0;
        _this.lastMediaSequence = 0;
        _this.childManifest = null;
        _this.qualityStreams = [];
        _this.masterPlaylist = null;

        _this.baseEndTime = 0;

        _this.manifestTimeoutId = null;

        // Keep track of the current playback quality.
        _this.pollResolutionId = null;
        _this.currentResolution = {
            width: 0,
            height: 0
        };

        _this.name = 'nativeHLS';
        _this.events = [];
        return _this;
    }

    _createClass(NativeHls, [{
        key: 'isItemSupported',
        value: function isItemSupported(item) {
            var _this2 = this;

            return new Promise(function (resolve) {
                if (item.type !== 'm3u8' && item.type !== 'm3u') {
                    resolve({
                        supported: false,
                        errorCode: Meister.ErrorCodes.WRONG_TYPE
                    });
                }

                // Non Safari browsers are not supported.
                if (!_this2.meister.browser.isSafari ||
                // When safariDesktopDisabled is true and it's not iOS disable it.
                !_this2.meister.browser.isiOS && _this2.config.safariDesktopDisabled) {
                    // Make sure we are not in Facebook mode. Where the User agent is modified.
                    // This means we are Safari on iOS but no indication of it in the user agent.
                    // Allow these browsers to pass.
                    if (!_this2.meister.browser.isFacebook && !_this2.meister.browser.isiOS) {
                        resolve({
                            supported: false,
                            errorCode: Meister.ErrorCodes.NOT_SUPPORTED
                        });
                    }
                }

                if (item.drm || item.drmConfig) {
                    _this2.meister.one('drmKeySystemSupport', function (supportedDRMSystems) {
                        var supported = false;
                        Object.keys(supportedDRMSystems).forEach(function (key) {
                            if (key === 'com.apple.fps' && supportedDRMSystems[key] || key === 'com.apple.fps.1_0' && supportedDRMSystems[key] || key === 'com.apple.fps.2_0' && supportedDRMSystems[key]) {
                                supported = true;
                            }
                        });
                        resolve({
                            supported: supported,
                            errorCode: supported ? null : Meister.ErrorCodes.NO_DRM
                        });
                    });

                    _this2.meister.trigger('requestDrmKeySystemSupport', {});
                } else {
                    resolve({
                        supported: true
                    });
                }
            });
        }
    }, {
        key: 'resetPrivates',
        value: function resetPrivates() {
            this.previousMetadata = null;

            this.manifestParsed = false;

            this.previousLevel = -1;
            this.lowestLevel = 0;
            this.mediaDuration = 0;
            this.item = null;
        }
    }, {
        key: 'process',
        value: function process(item) {
            var _this3 = this;

            return this.next(item).then(function (newItem) {
                _this3.player = _this3.meister.getPlayerByType('html5', newItem);
                if (_this3.meister.config.audioOnly || newItem.mediaType === 'audio') {
                    _this3.audioMode = true;
                } else {
                    _this3.audioMode = false;
                }

                return newItem;
            }).catch(function (err) {
                console.error('Something went wrong while processing middlewares. ' + err);
            });
        }
    }, {
        key: 'load',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item) {
                var _this4 = this;

                var currentPlaylistItem, manifest, drmServerUrl, lastMediaSequence, hasDVR;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'load', this).call(this, item);
                                this.item = item;

                                this.mediaElement = this.player.mediaElement;

                                // // The current playlist item
                                currentPlaylistItem = this.meister.playlist.list[this.meister.playlist.index];
                                // PLEASE NOTE:
                                // This is NOT the same as is done in DASH or HLS.
                                // If the event is handled on Safari MAC (with livestreams and ADS) it won't start playback after the preroll
                                // However; safari on iOS won't start if the event isn't handled, so.. nice going Apple :(

                                if ((0, _isAdItem2.default)(currentPlaylistItem) && this.meister.browser.isMobile && this.meister.browser.isSafari) {
                                    this.one('GoogleIma:initialUserActionCompleted', function () {
                                        _this4.mediaElement.src = item.src;
                                    });
                                } else {
                                    this.mediaElement.src = item.src;
                                }

                                this.masterPlaylist = item.src;

                                // Listen to control events.
                                this.on('requestBitrate', this.onRequestBitrate.bind(this));
                                this.on('requestGoLive', function () {
                                    return _this4.onRequestGoLive();
                                });

                                this.mediaElement.textTracks.addEventListener('addtrack', this.onAddTextTrack.bind(this));

                                this.pollResolutionId = setInterval(this.pollResolution.bind(this), POLL_INTERVAL);

                                // Trigger this to make it look pretty.
                                // Loading the first playlist.
                                _context.next = 12;
                                return this.loadManifest(item.src);

                            case 12:
                                manifest = _context.sent;


                                if (manifest.keyInfo) {
                                    if (manifest.keyInfo.URI) {
                                        drmServerUrl = manifest.keyInfo.URI.replace('skd:', 'https:');


                                        this.meister.trigger('drmLicenseInfoAvailable', {
                                            fairplay: {
                                                drmServerUrl: drmServerUrl
                                            }
                                        });
                                    }
                                }

                                this.endTime = manifest.duration;
                                this.baseEndTime = this.endTime;
                                this.mediaDuration = manifest.duration;
                                this.mediaSequence = manifest.mediaSequence;

                                this.beginTime = this.endTime - this.mediaDuration;

                                // Kinda weird, but let's roll with it for now..
                                lastMediaSequence = Object.keys(manifest.segments)[Object.keys(manifest.segments).length - 1];

                                this.lastMediaSequence = lastMediaSequence;

                                hasDVR = manifest.duration > this.dvrThreshold && manifest.isLive;


                                if (this.config.dvrEnabled === false) {
                                    hasDVR = false;
                                }

                                this.meister.trigger('itemTimeInfo', {
                                    isLive: manifest.isLive,
                                    hasDVR: hasDVR,
                                    duration: this.mediaDuration,
                                    modifiedDuration: this.mediaDuration,
                                    endTime: this.endTime
                                });

                                // We don't want to request live when we want to start from the beginning.
                                if (!item.startFromBeginning) {
                                    // this.onMasterPlaylistLoaded(manifest);
                                    if (manifest.isLive) this.onRequestGoLive();
                                } else if (_typeof(item.startFromBeginning) === 'object') {
                                    this.onRequestSeek({
                                        relativePosition: item.startFromBeginning.offset / this.duration
                                    });
                                } else if (isNaN(this.meister.duration)) {
                                    this.meister.one('playerCanPlay', function () {
                                        _this4.meister.currentTime = 0;
                                    });
                                } else {
                                    this.meister.currentTime = 0;
                                }

                                this.manifestTimeoutId = setTimeout(function () {
                                    _this4.getNewManifest();
                                }, 5000); // Amount of seconds should be dynamic (By using the manifest)

                            case 26:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function load(_x) {
                return _ref.apply(this, arguments);
            }

            return load;
        }()
    }, {
        key: '_onPlayerTimeUpdate',
        value: function _onPlayerTimeUpdate() {
            var playOffset = this.endTime - this.mediaDuration;

            this.meister.trigger('playerTimeUpdate', {
                currentTime: this.player.currentTime - playOffset,
                duration: this.mediaDuration
            });
        }
    }, {
        key: '_onPlayerSeek',
        value: function _onPlayerSeek() {
            var playOffset = this.endTime - this.mediaDuration;

            var currentTime = this.player.currentTime - playOffset;
            var duration = this.mediaDuration;
            var relativePosition = currentTime / duration;

            this.meister.trigger('playerSeek', {
                relativePosition: relativePosition,
                currentTime: currentTime,
                duration: duration
            });
        }
    }, {
        key: 'onRequestSeek',
        value: function onRequestSeek(e) {
            var targetTime = void 0;

            if (Number.isFinite(e.relativePosition)) {
                var playOffset = this.endTime - this.mediaDuration;
                targetTime = this.mediaDuration * e.relativePosition + playOffset;
            } else if (Number.isFinite(e.timeOffset)) {
                targetTime = this.player.currentTime + e.timeOffset;
            } else if (Number.isFinite(e.targetTime)) {
                var _playOffset = this.endTime - this.mediaDuration;
                targetTime = e.targetTime + _playOffset;
            }

            // Check whether we are allowed to seek forward.
            if (!e.forcedStart && this.blockSeekForward && targetTime > this.player.currentTime) {
                return;
            }

            if (Number.isFinite(targetTime)) {
                this.player.currentTime = targetTime;
            }
        }

        /**
         * Event handler for addtrack
         *
         * @param {TrackEvent} event
         * @memberof NativeHls
         */

    }, {
        key: 'onAddTextTrack',
        value: function onAddTextTrack(event) {
            var _this5 = this;

            var track = event.track;
            track.mode = 'hidden';

            track.addEventListener('cuechange', function (cueChangeEvent) {
                /** @type {TextTrack} */
                var target = cueChangeEvent.target;
                var activeCues = Array.from(target.activeCues).filter(function (cue) {
                    return cue.type === 'org.id3';
                });
                var id3Tags = activeCues.map(function (cue) {
                    return new _Id3Tag2.default(cue.value.key, cue.value.data, cue.startTime, cue.endTime);
                });

                _this5.meister.trigger('id3Tags', id3Tags);
            });
        }
    }, {
        key: 'onRequestGoLive',
        value: function onRequestGoLive() {
            var _this6 = this;

            if (isNaN(this.player.duration)) {
                this.meister.one('playerLoadedMetadata', function () {
                    _this6.onRequestGoLive();
                });
            } else {
                this.player.currentTime = this.endTime - 30;
            }
        }
    }, {
        key: 'onRequestBitrate',
        value: function onRequestBitrate(e) {
            var _this7 = this;

            var previousCurrentTime = this.player.currentTime;
            var wasPlaying = this.meister.playing;

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

            this.meister.one('playerLoadedMetadata', function () {
                _this7.player.currentTime = previousCurrentTime;

                if (wasPlaying) {
                    _this7.meister.play();
                } else {
                    _this7.meister.pause();
                }
            });
        }
    }, {
        key: 'onError',
        value: function onError(e, data) {
            console.warn('Error in ' + this.name + ', type: ' + data.details + ', will attempt to recover.');
            if (data.fatal) {
                console.error('Can not recover from ' + data.type + ': ' + data.details + '.');
            }
        }
    }, {
        key: 'pollResolution',
        value: function pollResolution() {
            var height = this.mediaElement.videoHeight;
            var width = this.mediaElement.videoWidth;

            if (this.currentResolution.width === width && this.currentResolution.height === height) {
                return;
            }

            var newBitrate = this.qualityStreams.find(function (stream) {
                return stream.resolution && stream.resolution.width === width && stream.resolution.height === height;
            });

            // This can happen while switching streams, no need to notify the player.
            if (!newBitrate) {
                return;
            }

            var newBitrateIndex = this.qualityStreams.indexOf(newBitrate);

            this.meister.trigger('playerAutoSwitchBitrate', {
                newBitrate: parseInt(newBitrate.bandwith, 10),
                newBitrateIndex: newBitrateIndex
            });

            this.currentResolution = newBitrate.resolution;
        }

        // copypaste from native-hls

    }, {
        key: 'getNewManifest',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var _this8 = this;

                var manifest, lastMediaSequence, amountOfNewSegments, i, hasDVR;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return this.loadManifest(this.childManifest);

                            case 3:
                                manifest = _context2.sent;
                                lastMediaSequence = Object.keys(manifest.segments)[Object.keys(manifest.segments).length - 1];
                                amountOfNewSegments = lastMediaSequence - this.lastMediaSequence;


                                for (i = 0; i < amountOfNewSegments; i += 1) {
                                    this.endTime += manifest.segments[Object.keys(manifest.segments)[i]];
                                }

                                // Just for testing purposes:
                                this.mediaDuration = manifest.duration;
                                this.beginTime = this.endTime - manifest.duration;
                                this.lastMediaSequence = lastMediaSequence;

                                hasDVR = manifest.duration > this.dvrThreshold && manifest.isLive;


                                if (this.config.dvrEnabled === false) {
                                    hasDVR = false;
                                }

                                this.meister.trigger('itemTimeInfo', {
                                    isLive: manifest.isLive,
                                    hasDVR: hasDVR,
                                    duration: this.mediaDuration,
                                    modifiedDuration: this.mediaDuration,
                                    endTime: this.endTime
                                });

                                this.manifestTimeoutId = setTimeout(function () {
                                    _this8.getNewManifest();
                                }, 5000);
                                _context2.next = 20;
                                break;

                            case 16:
                                _context2.prev = 16;
                                _context2.t0 = _context2['catch'](0);

                                console.warn('WARNING: Could not load manifest, retrying loading manifest.', _context2.t0);
                                this.manifestTimeoutId = setTimeout(function () {
                                    _this8.getNewManifest();
                                }, 5000);

                            case 20:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 16]]);
            }));

            function getNewManifest() {
                return _ref2.apply(this, arguments);
            }

            return getNewManifest;
        }()

        // copypaste from native-hls

    }, {
        key: 'loadManifest',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(src) {
                var response, text, m3u8, manifest;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return fetch(src);

                            case 2:
                                response = _context3.sent;
                                _context3.next = 5;
                                return response.text();

                            case 5:
                                text = _context3.sent;
                                m3u8 = new _M3u8Parser2.default(text);
                                manifest = m3u8.parse();

                                if (!manifest.streams.length) {
                                    _context3.next = 13;
                                    break;
                                }

                                if (this.config.filterAudioOnly) {
                                    this.qualityStreams = manifest.streams.filter(function (stream) {
                                        return stream.resolution;
                                    });
                                } else {
                                    this.qualityStreams = manifest.streams;
                                }

                                this.onQualitysAvailable();

                                this.childManifest = this.meister.utils.resolveUrl(src, manifest.streams[0].url);
                                // This is the master playlist we need to parse the sub playlist.
                                return _context3.abrupt('return', this.loadManifest(this.meister.utils.resolveUrl(src, manifest.streams[0].url)));

                            case 13:
                                return _context3.abrupt('return', manifest);

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadManifest(_x2) {
                return _ref3.apply(this, arguments);
            }

            return loadManifest;
        }()

        // copypaste from native-hls

    }, {
        key: 'onQualitysAvailable',
        value: function onQualitysAvailable() {
            var bitrates = this.qualityStreams.map(function (bitrate, index) {
                return {
                    bitrate: parseInt(bitrate.bandwith, 10),
                    index: index
                };
            });

            // Bitrate 0 means auto quality.
            bitrates.unshift({
                bitrate: 0,
                index: -1
            });

            // Trigger auto bitrate by default.
            this.meister.trigger('itemBitrates', {
                bitrates: bitrates,
                currentIndex: -1
            });
        }
    }, {
        key: 'unload',
        value: function unload() {
            _get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'unload', this).call(this);

            if (this.manifestTimeoutId) {
                clearTimeout(this.manifestTimeoutId);
            }

            if (this.pollResolutionId) {
                clearInterval(this.pollResolutionId);
            }

            this.meister.remove(this.events);

            this.mediaDuration = 0;
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
                height: 0
            };
            this.mediaElement = null;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'duration',
        get: function get() {
            return this.mediaDuration;
        }
    }, {
        key: 'currentTime',
        get: function get() {
            if (!this.player) {
                return NaN;
            }

            var playOffset = this.endTime - this.mediaDuration;
            return this.player.currentTime - playOffset;
        },
        set: function set(time) {
            if (!this.player) {
                return;
            }

            var playOffset = this.endTime - this.mediaDuration;
            this.player.currentTime = time + playOffset;
        }
    }], [{
        key: 'pluginName',
        get: function get() {
            return 'NativeHls';
        }
    }, {
        key: 'pluginVersion',
        get: function get() {
            return _package2.default.version;
        }
    }]);

    return NativeHls;
}(Meister.MediaPlugin);

Meister.registerPlugin(NativeHls.pluginName, NativeHls);
Meister.registerPlugin('nativehls', NativeHls);

exports.default = NativeHls;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Id3Tag =
/**
* Creates an instance of Id3Tag.
*
* @param {string} key
* @param {ArrayBuffer} data
* @param {number} [startTime=0]
* @param {number} [endTime=0]
* @memberof Id3Tag
*/
function Id3Tag(key, data) {
    var startTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var endTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, Id3Tag);

    this.data = data;
    this.key = key;
    this.type = 'org.id3';
    this.startTime = startTime;
    this.endTime = endTime;
};

exports.default = Id3Tag;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function extractKeyInfo(keyLine) {
    var keyInfo = keyLine.replace('#EXT-X-KEY:', '')
    // All key value pairs are split with a ,
    .split(',').reduce(function (result, keyValString) {
        // We only use the first equal sign per string
        // Otherwise we might split something in an URL.
        var firstEqualIndex = keyValString.indexOf('=');

        // Retrieve key value pairs.
        var key = keyValString.substring(0, firstEqualIndex);
        var val = keyValString.substring(firstEqualIndex + 1);

        // The values are displayed like: ""value"", so we remove the extra pair of "".
        // eslint-disable-next-line no-param-reassign
        result[key] = val.replace(/"/g, '');

        return result;
    }, {});

    return keyInfo;
}

var M3u8Parser = function () {
    function M3u8Parser(text) {
        _classCallCheck(this, M3u8Parser);

        this.text = text;
    }

    _createClass(M3u8Parser, [{
        key: 'parse',
        value: function parse() {
            var lines = this.text.split('\n');
            var result = {
                streams: [],
                segments: {},
                mediaSequence: 0,
                duration: 0,
                isLive: true
            };

            var nextLineIsStream = false;
            var previousMediaNumber = result.mediaSequence;
            var streamInfo = {};

            lines.forEach(function (line) {
                if (nextLineIsStream) {
                    streamInfo.url = line;
                    result.streams.push(streamInfo);
                    streamInfo = {};
                    nextLineIsStream = false;
                }

                if (line.startsWith('#EXT-X-STREAM-INF')) {
                    nextLineIsStream = true;
                }

                if (line.startsWith('#EXT-X-ENDLIST')) {
                    result.isLive = false;
                }

                if (line.startsWith('#EXT-X-KEY')) {
                    // Extracting the URI out of the key section
                    result.keyInfo = extractKeyInfo(line);
                }

                // #EXT-X-STREAM-INF:PROGRAM-ID=1,RESOLUTION=600x338,BANDWIDTH=712704
                var matchBandwith = /^#EXT-X-STREAM-INF:.*BANDWIDTH=(\d*)?/.exec(line);
                if (matchBandwith && matchBandwith[1]) {
                    var bandwith = matchBandwith[1];
                    streamInfo.bandwith = bandwith;
                }

                var matchResolution = /^#EXT-X-STREAM-INF:.*RESOLUTION=(\d*x\d*)?/.exec(line);
                if (matchResolution && matchResolution[1]) {
                    var resolutions = matchResolution[1].split('x');
                    if (resolutions.length < 2) {
                        streamInfo.resolution = {
                            width: 0,
                            height: 0
                        };
                    } else {
                        var resolutionInfo = {
                            width: parseInt(resolutions[0], 10),
                            height: parseInt(resolutions[1], 10)
                        };

                        streamInfo.resolution = resolutionInfo;
                    }
                }

                var matchInfo = /^#EXTINF:?([0-9.]*)?,?(.*)?/.exec(line);
                if (matchInfo && matchInfo[1]) {
                    result.segments[previousMediaNumber] = parseFloat(matchInfo[1]);
                    previousMediaNumber += 1;
                    result.duration += parseFloat(matchInfo[1]);
                }

                var matchMediaSequence = /^#EXT-X-MEDIA-SEQUENCE:?(-?[0-9.]*)?/.exec(line);
                if (matchMediaSequence && matchMediaSequence[1]) {
                    result.mediaSequence = parseInt(matchMediaSequence[1], 10);
                    previousMediaNumber = parseInt(matchMediaSequence[1], 10);
                }
            });

            return result;
        }
    }]);

    return M3u8Parser;
}();

exports.default = M3u8Parser;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isAdItem;
/**
 * Checks whether the item is an ad item or not.
 *
 * @export
 * @param {Object} item
 * @returns {boolean}
 */
function isAdItem(item) {
    // Non media items are certenly not ad items.
    if (item.type !== 'media' || !item.parallel) {
        return false;
    }

    // Search for a vast item.
    return !!item.parallel.find(function (parallelItem) {
        return parallelItem.type === 'vmap';
    });
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {"name":"@meisterplayer/plugin-nativehls","version":"5.6.1","description":"Meister plugin for playback of HLS in browsers that support it natively (ex. Safari)","main":"dist/NativeHls.js","keywords":["meister","video","plugin","hls"],"repository":{"type":"git","url":"https://github.com/meisterplayer/media-nativehls.git"},"scripts":{"lint":"eslint ./src/js","test":"jest","test:coverage":"jest --coverage","build":"gulp build","dist":"gulp build:min && gulp build:dist"},"author":"Triple","license":"Apache-2.0","dependencies":{},"devDependencies":{"@meisterplayer/meister-mock":"1.0.0","babel-preset-es2015":"6.24.0","babel-preset-es2017":"6.22.0","gulp":"3.9.1","jest":"20.0.4","meister-gulp-webpack-tasks":"1.0.6","meister-js-dev":"3.1.0"},"peerDependencies":{"@meisterplayer/meisterplayer":">= 5.1.0"}}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=NativeHls.js.map