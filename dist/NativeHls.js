var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * @class httpModule
 * @type {{getPageByURL, handleResponse, parseCookie, queryStringToJsonObject, jsonObjectToQuerystring}}
 */

var _totalMillisecondsDelta = 0;
var _noop = function _noop() {};
var _activeXHRs = [];
var _totalBytesDelta = 0;
var _maximumHistorySize = 7;
var _totalBytesDeltaHistory = [];
var _totalMillisecondsDeltaHistory = [];
var _isObjLiteral = function _isObjLiteral(_obj) {
    var _test = _obj;
    return (typeof _obj === 'undefined' ? 'undefined' : _typeof(_obj)) !== 'object' || _obj === null ? false : function () {
        while (!false) {
            if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                break;
            }
        }
        return Object.getPrototypeOf(_obj) === _test;
    }();
};
var _verifiedOptions = function _verifiedOptions(options) {
    if (!_isObjLiteral(options)) {
        console.error('Cannot construct http request, the options parameter is not an object literal.', options);
        return false;
    }

    if (!('method' in options)) {
        console.error('Cannot construct http request, the method was not specified.', options);
        return false;
    }

    if (!('url' in options)) {
        console.error('Cannot construct http request, the url was not specified.', options);
        return false;
    }

    return true;
};
var _objectToQueryString = function _objectToQueryString(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
    }
    return parts.join('&');
};
var _updateProgress = function _updateProgress(event) {
    // Make sure to reset the bytes downloaded (can happen after an abort).
    if (event.loaded < this.bytesDownloaded) {
        this.bytesDownloaded = 0;
    }

    // Get the number of new bytes downloaded.
    var bytesDelta = event.loaded - this.bytesDownloaded,
        millisecondsDelta = event.timeStamp - this.timestamp;

    // Update the total values.
    _totalMillisecondsDelta += millisecondsDelta;
    _totalBytesDelta += bytesDelta;
    Http.totalBytesDownloaded += bytesDelta;

    // Store local values.
    this.bytesDownloaded = event.loaded;
    this.totalSizeInBytes = event.total;
    this.timestamp = event.timeStamp;

    // Update the progress.
    this.downloadProgress = this.bytesDownloaded / this.totalSizeInBytes;

    Http.resetStatistics();
};

/**
 * Makes an HTTP request and serves as an advanced HTTP Api
 *
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function Http(options, callback) {

    if (!_verifiedOptions(options)) {
        return;
    }

    this.instID = this.constructor.name + '.' + Math.random() * new Date().getTime();

    var method = options.method,
        url = options.url,
        data = '',
        timeout = 'timeout' in options ? options.timeout : 3000,
        xhr;

    this.timestamp = 0;
    this.method = method;
    this.url = url;

    this.status = 0;
    this.bytesDownloaded = 0;
    this.totalSizeInBytes = 0;
    this.downloadProgress = 0;
    this.bandwidth = null;
    this.timeOfRequest = null;
    this.timeOfResponse = null;
    this.roundTripTime = null;
    this.onReady = null;
    this.onProgress = null;
    this.onLoadStart = null;
    this.onError = null;
    this.onSuccess = callback;

    xhr = new XMLHttpRequest();

    if ('data' in options) {
        data = _objectToQueryString(options.data);
    }

    xhr.onreadystatechange = function (event) {
        this.status = xhr.status;

        if (this.onReady !== null) {
            this.onReady();
        }
    }.bind(this);

    xhr.onprogress = function (event) {
        _updateProgress.call(this, event);

        if (this.onProgress !== null) {
            this.onProgress();
        }
    }.bind(this);

    xhr.onloadstart = function (event) {
        this.timestamp = event.timeStamp;

        if (this.onLoadStart !== null) {
            this.onLoadStart();
        }
    }.bind(this);

    xhr.onerror = function (event) {
        Http.downloadingRequests -= 1;

        if (this.onError !== null) {
            (this.onError || _noop)(xhr);
        } else {
            this.onSuccess(null);
        }
    }.bind(this);

    xhr.onload = function (event) {
        _updateProgress.call(this, event);

        Http.downloadingRequests -= 1;

        // Remove the active XHR from active XHRs
        for (var i = 0; i < _activeXHRs.length; i++) {
            var activeXHR = _activeXHRs[i];

            if (activeXHR.id == this.instID) {
                _activeXHRs.splice(i, 1);
            }
        }

        this.timeOfResponse = new Date().getTime();
        this.roundTripTime = this.timeOfResponse - this.timeOfRequest;
        xhr.bandwidth = Math.floor(this.bytesDownloaded / this.roundTripTime * 8 * 1000);
        this.bandwidth = xhr.bandwidth;
        this.onSuccess(xhr);
    }.bind(this);

    // GET requests should have the data in the URL instead of the body
    if (method === 'GET') {
        url += data;
    }

    // Open the asynchronous request
    xhr.open(method, url, true);

    this.timeOfRequest = new Date().getTime();
    Http.downloadingRequests += 1;

    //Set the responseType
    if ('responseType' in options) {
        xhr.responseType = options.responseType;
    }

    // Add headers, must be done after open but before send (see mdn docs)
    if ('headers' in options) {
        for (var key in options.headers) {
            if (options.headers.hasOwnProperty(key)) {
                console.log('Setting header', key, 'with', options.headers[key]);
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
    }

    _activeXHRs.push({
        id: this.instID,
        inst: this
    });

    try {
        xhr.send(data);
    } catch (ex) {
        console.error('HTTP Request aborted due: ', ex);
        (this.onError || _noop)(xhr);
    }

    // Listen to timeouts.
    this.timeout = setTimeout(function () {
        if (this.bytesDownloaded === 0) {
            this.abort();

            if (this.onError !== null) {
                this.onError(xhr);
            } else {
                this.onSuccess(null);
            }
        }

        clearTimeout(this.timeout);
    }.bind(this), timeout);

    this.xhr = xhr;
}

Http.downloadingRequests = 0;
Http.totalBytesDownloaded = 0;
Http.averagedBandwidth = 0;

Http.get = function (url, callback) {
    var options = {
        url: url,
        method: 'GET',
        data: {}
    };

    return new Http(options, callback);
};

Http.post = function (url, data, callback) {
    var options = {
        url: url,
        method: 'POST',
        data: data
    };

    return new Http(options, callback);
};

Http.abortAll = function () {
    for (var i = 0; i < _activeXHRs.length; i++) {
        var activeXHR = _activeXHRs[i];
        activeXHR.inst.abort();
    }
};

Http.resetStatistics = function () {
    var milliseconds = 0.0,
        bytes = 0.0,
        avgBandwidth = null,
        i;

    // Push the total milliseconds delta if there is data.
    if (_totalMillisecondsDelta > 0) {
        _totalMillisecondsDeltaHistory.push(_totalMillisecondsDelta);
        _totalMillisecondsDelta = 0;

        if (_totalMillisecondsDeltaHistory.length > _maximumHistorySize) {
            _totalMillisecondsDeltaHistory.shift();
        }
    }

    // Push the total bytes delta if there is data.
    if (_totalBytesDelta > 0) {
        _totalBytesDeltaHistory.push(_totalBytesDelta);
        _totalBytesDelta = 0;
        if (_totalBytesDeltaHistory.length > _maximumHistorySize) {
            _totalBytesDeltaHistory.shift();
        }
    }

    // Calculate the total of milliseconds.
    for (i = 0; i < _totalMillisecondsDeltaHistory.length; i++) {
        milliseconds += _totalMillisecondsDeltaHistory[i];
    }

    // Calculate the total of bytes.
    for (i = 0; i < _totalBytesDeltaHistory.length; i++) {
        bytes += _totalBytesDeltaHistory[i];
    }

    // Calculate the average bandwidth.
    if (milliseconds > 0) {
        avgBandwidth = bytes * 1000 / milliseconds;
    }

    Http.averagedBandwidth = Http.averagedBandwidth === 0 ? avgBandwidth : (Http.averagedBandwidth + avgBandwidth) / 2;

    // Reset all values.
    _totalMillisecondsDelta = 0;
    _totalBytesDelta = 0;
    //Http.totalBytesDownloaded = 0;
};

Http.prototype.abort = function () {
    var xhr = this.xhr;
    xhr.onerror = null;

    // Abort the download.
    xhr.abort();

    // Update the number of active requests.
    Http.downloadingRequests -= 1;
};

/**
 * Sugar syntax for when a request is done
 *
 * @param  {Function} callback [description]
 * @return {Function}          [description]
 */
Http.prototype.done = function (callback) {
    this.onSuccess = callback;
    return this;
};

/**
 * Sugar syntax for when a request throws an error
 *
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Http.prototype.error = function (callback) {
    this.onError = callback;
    return this;
};

/**
 * Sugar syntax for when a request has progress
 *
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Http.prototype.progress = function (callback) {
    this.onProgress = callback;
    return this;
};

var Http_1 = Http;

var M3u8Parser = function () {
    function M3u8Parser(text) {
        classCallCheck(this, M3u8Parser);

        this.text = text;
    }

    createClass(M3u8Parser, [{
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

                var matchInfo = /^#EXTINF:?([0-9\.]*)?,?(.*)?/.exec(line);
                if (matchInfo && matchInfo[1]) {
                    result.segments[previousMediaNumber] = parseFloat(matchInfo[1]);
                    previousMediaNumber++;
                    result.duration += parseFloat(matchInfo[1]);
                }

                var matchMediaSequence = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(line);
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

var POLL_INTERVAL = 1000;

var NativeHls$1 = function (_Meister$MediaPlugin) {
    inherits(NativeHls, _Meister$MediaPlugin);

    function NativeHls(config, meister, next) {
        classCallCheck(this, NativeHls);

        var _this = possibleConstructorReturn(this, (NativeHls.__proto__ || Object.getPrototypeOf(NativeHls)).call(this, config, meister));

        _this.manifestParsed = false;

        _this.audioMode = false;

        _this.metadata = [];
        _this.previousMetadata = null;

        // Middleware promise chain.
        _this.next = next;

        // -1 for automatic quality selection
        _this.previousLevel = -1;
        _this.lowestLevel = 0;

        _this.dvrThreshold = _this.config.dvrThreshold || 300;

        // new
        _this.duration = 0;
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

    createClass(NativeHls, [{
        key: 'isItemSupported',
        value: function isItemSupported(item) {
            var _this2 = this;

            return new Promise(function (resolve) {
                if (item.type !== 'm3u8' && item.type !== 'm3u') {
                    return resolve({
                        supported: false,
                        errorCode: Meister.ErrorCodes.WRONG_TYPE
                    });
                }
                // Exception for safari.
                if (!_this2.meister.browser.isSafari || !_this2.meister.browser.isiOS && _this2.config.safariDesktopDisabled) {
                    return resolve({
                        supported: false,
                        errorCode: Meister.ErrorCodes.NOT_SUPPORTED
                    });
                }

                if (item.drm || item.drmConfig) {
                    _this2.meister.one('drmKeySystemSupport', function (supportedDRMSystems) {
                        var supported = false;
                        Object.keys(supportedDRMSystems).forEach(function (key) {
                            if (key === 'com.apple.fps' && supportedDRMSystems[key] || key === 'com.apple.fps.1_0' && supportedDRMSystems[key] || key === 'com.apple.fps.2_0' && supportedDRMSystems[key]) {
                                supported = true;
                            }
                        });
                        return resolve({
                            supported: supported,
                            errorCode: supported ? null : Meister.ErrorCodes.NO_DRM
                        });
                    });

                    _this2.meister.trigger('requestDrmKeySystemSupport', {});
                } else {
                    return resolve({
                        supported: true
                    });
                }
            });
        }
    }, {
        key: 'resetPrivates',
        value: function resetPrivates() {
            this.metadata = [];
            this.previousMetadata = null;

            this.manifestParsed = false;

            this.previousLevel = -1;
            this.lowestLevel = 0;
            this.duration = 0;
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
        value: function load(item) {
            var _this4 = this;

            get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'load', this).call(this, item);
            this.item = item;

            return new Promise(function (resolve) {
                _this4.mediaElement = _this4.player.mediaElement;
                _this4.mediaElement.src = item.src;
                _this4.masterPlaylist = item.src;

                // Display the correct title.
                _this4.on('_playerTimeUpdate', _this4._onPlayerTimeUpdate.bind(_this4));
                _this4.on('_playerSeek', _this4._onPlayerSeek.bind(_this4));
                _this4.on('requestSeek', _this4.onRequestSeek.bind(_this4));

                // Listen to control events.
                _this4.on('requestBitrate', _this4.onRequestBitrate.bind(_this4));
                _this4.on('requestGoLive', function () {
                    return _this4.onRequestGoLive();
                });

                _this4.pollResolutionId = setInterval(_this4.pollResolution.bind(_this4), POLL_INTERVAL);

                // Trigger this to make it look pretty.
                // Loading the first playlist.
                _this4.loadManifest(item.src).then(function (manifest) {
                    _this4.endTime = manifest.duration;
                    _this4.baseEndTime = _this4.endTime;
                    _this4.duration = manifest.duration;
                    _this4.mediaSequence = manifest.mediaSequence;

                    _this4.beginTime = _this4.endTime - _this4.duration;

                    // Kinda weird, but let's roll with it for now..
                    var lastMediaSequence = Object.keys(manifest.segments)[Object.keys(manifest.segments).length - 1];
                    _this4.lastMediaSequence = lastMediaSequence;

                    var hasDVR = manifest.duration > _this4.dvrThreshold && manifest.isLive;

                    if (_this4.config.dvrEnabled === false) {
                        hasDVR = false;
                    }

                    _this4.meister.trigger('itemTimeInfo', {
                        isLive: manifest.isLive,
                        hasDVR: hasDVR,
                        duration: _this4.duration,
                        modifiedDuration: _this4.duration,
                        endTime: _this4.endTime
                    });

                    // this.onMasterPlaylistLoaded(manifest);
                    if (manifest.isLive) _this4.onRequestGoLive();

                    _this4.manifestTimeoutId = setTimeout(function () {
                        _this4.getNewManifest();
                    }, 5000); // Amount of seconds should be dynamic (By using the manifest)
                });

                resolve();
            });
        }
    }, {
        key: '_onPlayerTimeUpdate',
        value: function _onPlayerTimeUpdate() {
            var playOffset = this.endTime - this.duration;

            this.meister.trigger('playerTimeUpdate', {
                currentTime: this.meister.currentTime - playOffset,
                duration: this.duration
            });

            this.broadcastTitle();
        }
    }, {
        key: '_onPlayerSeek',
        value: function _onPlayerSeek() {
            var playOffset = this.endTime - this.duration;

            var currentTime = this.meister.currentTime - playOffset;
            var duration = this.duration;
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
                var playOffset = this.endTime - this.duration;
                targetTime = this.duration * e.relativePosition + playOffset;
            } else if (Number.isFinite(e.timeOffset)) {
                targetTime = this.meister.currentTime + e.timeOffset;
            } else if (Number.isFinite(e.targetTime)) {
                var _playOffset = this.endTime - this.duration;
                targetTime = e.targetTime + _playOffset;
            }

            // Check whether we are allowed to seek forward.
            if (!e.forcedStart && this.blockSeekForward && targetTime > this.meister.currentTime) {
                return;
            }

            if (Number.isFinite(targetTime)) {
                this.meister.currentTime = targetTime;
            }
        }
    }, {
        key: 'onRequestGoLive',
        value: function onRequestGoLive() {
            var _this5 = this;

            if (isNaN(this.meister.duration)) {
                this.meister.one('playerLoadedMetadata', function () {
                    _this5.onRequestGoLive();
                });
            } else {
                this.meister.currentTime = this.endTime - 30;
            }
        }
    }, {
        key: 'broadcastTitle',
        value: function broadcastTitle() {
            var time = this.meister.currentTime;
            // No need to spam events.
            if (this.previousMetadata && this.previousMetadata.start < time && time < this.previousMetadata.end) {
                return;
            }

            // Still playing the same item.
            var currentMetadata = this.currentlyPlaying;
            if (this.previousMetadata && currentMetadata.title === this.previousMetadata.title) {
                return;
            }

            // Remember the current metadata for the next call.
            this.previousMetadata = currentMetadata;

            // Broadcast event for the ui.
            this.meister.trigger('itemMetadata', {
                title: currentMetadata.title
            });
        }
    }, {
        key: 'onRequestBitrate',
        value: function onRequestBitrate(e) {
            var _this6 = this;

            var previousCurrentTime = this.meister.currentTime;
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
                _this6.meister.currentTime = previousCurrentTime;

                if (wasPlaying) {
                    _this6.meister.play();
                } else {
                    _this6.meister.pause();
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

        // copypaste from native-hls

    }, {
        key: 'pollResolution',
        value: function pollResolution() {
            var height = this.mediaElement.videoHeight;
            var width = this.mediaElement.videoWidth;

            if (this.currentResolution.width === width && this.currentResolution.height === height) return;

            var newBitrate = this.qualityStreams.find(function (stream) {
                return stream.resolution && stream.resolution.width === width && stream.resolution.height === height;
            });

            // This can happen while switching streams, no need to notify the player.
            if (!newBitrate) return;

            var newBitrateIndex = this.qualityStreams.indexOf(newBitrate);

            this.meister.trigger('playerAutoSwitchBitrate', {
                newBitrate: parseInt(newBitrate.bandwith, 10),
                newBitrateIndex: newBitrateIndex
            });

            this.currentResolution = newBitrate.resolution;
        }
    }, {
        key: 'getNewManifest',


        // copypaste from native-hls
        value: function getNewManifest() {
            var _this7 = this;

            this.loadManifest(this.childManifest).then(function (manifest) {
                var lastMediaSequence = Object.keys(manifest.segments)[Object.keys(manifest.segments).length - 1];
                var amountOfNewSegments = lastMediaSequence - _this7.lastMediaSequence;

                for (var i = 0; i < amountOfNewSegments; i++) {
                    _this7.endTime += manifest.segments[Object.keys(manifest.segments)[i]];
                }

                // Just for testing purposes:
                _this7.duration = manifest.duration;
                _this7.beginTime = _this7.endTime - manifest.duration;
                _this7.lastMediaSequence = lastMediaSequence;

                var hasDVR = manifest.duration > _this7.dvrThreshold && manifest.isLive;

                if (_this7.config.dvrEnabled === false) {
                    hasDVR = false;
                }

                _this7.meister.trigger('itemTimeInfo', {
                    isLive: manifest.isLive,
                    hasDVR: hasDVR,
                    duration: _this7.duration,
                    modifiedDuration: _this7.duration,
                    endTime: _this7.endTime
                });

                _this7.manifestTimeoutId = setTimeout(function () {
                    _this7.getNewManifest();
                }, 5000);
            }, function () {
                console.warn('WARNING: Could not load manifest, retrying loading manifest.');
                _this7.manifestTimeoutId = setTimeout(function () {
                    _this7.getNewManifest();
                }, 5000);
            });
        }

        // copypaste from native-hls

    }, {
        key: 'loadManifest',
        value: function loadManifest(src) {
            var _this8 = this;

            return new Promise(function (resolve) {
                Http_1.get(src, function (res) {
                    var m3u8 = new M3u8Parser(res.responseText);
                    var manifest = m3u8.parse();

                    if (manifest.streams.length) {
                        if (_this8.config.filterAudioOnly) {
                            _this8.qualityStreams = manifest.streams.filter(function (stream) {
                                return stream.resolution;
                            });
                        } else {
                            _this8.qualityStreams = manifest.streams;
                        }

                        _this8.onQualitysAvailable();

                        _this8.childManifest = _this8.meister.utils.resolveUrl(src, manifest.streams[0].url);
                        // This is the master playlist we need to parse the sub playlist.
                        _this8.loadManifest(_this8.meister.utils.resolveUrl(src, manifest.streams[0].url)).then(function (childManifest) {
                            resolve(childManifest);
                        });
                    } else {
                        resolve(manifest);
                    }
                });
            });
        }

        // copypaste from native-hls

    }, {
        key: 'onQualitysAvailable',
        value: function onQualitysAvailable() {
            var bitrates = [];

            // Bitrate 0 means auto quality.
            bitrates.push({
                bitrate: 0,
                index: -1
            });

            for (var i = 0; i < this.qualityStreams.length; i++) {
                var bitrate = this.qualityStreams[i];
                bitrates.push({
                    bitrate: parseInt(bitrate.bandwith, 10),
                    index: i
                });
            }

            // Trigger auto bitrate by default.
            this.meister.trigger('itemBitrates', {
                bitrates: bitrates,
                currentIndex: -1
            });
        }
    }, {
        key: 'unload',
        value: function unload() {
            get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'unload', this).call(this);
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
                height: 0
            };
            this.mediaElement = null;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            get(NativeHls.prototype.__proto__ || Object.getPrototypeOf(NativeHls.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'currentItem',
        get: function get$$1() {
            var metadata = this.currentlyPlaying;

            var currentItem = {
                src: this.item.src,
                type: this.item.type,
                title: metadata.title,
                bitrate: metadata.bitrate
            };

            return currentItem;
        }
    }, {
        key: 'currentlyPlaying',
        get: function get$$1() {
            // Prepare return object.
            var metadata = {
                bitrate: 0,
                title: ''
            };

            // Traverse backwards since it is more likely that the player is near the end
            var data = null;
            var time = this.meister.currentTime;
            for (var i = this.metadata.length - 1; i >= 0; i--) {
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
    }], [{
        key: 'pluginName',
        get: function get$$1() {
            return 'NativeHls';
        }
    }]);
    return NativeHls;
}(Meister.MediaPlugin);

Meister.registerPlugin(NativeHls$1.pluginName, NativeHls$1);

export default NativeHls$1;
//# sourceMappingURL=NativeHls.js.map
