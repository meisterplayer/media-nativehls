/**
 * @class httpModule
 * @type {{getPageByURL, handleResponse, parseCookie, queryStringToJsonObject, jsonObjectToQuerystring}}
 */

var _totalMillisecondsDelta = 0,
    _noop = function () {},
    _activeXHRs = [],
    _totalBytesDelta = 0,
    _maximumHistorySize = 7,
    _totalBytesDeltaHistory = [],
    _totalMillisecondsDeltaHistory = [],
    _isObjLiteral = function (_obj) {
        var _test = _obj;
        return (typeof _obj !== 'object' || _obj === null ?
            false :
            (
                (function () {
                    while (!false) {
                        if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
                            break;
                        }
                    }
                    return Object.getPrototypeOf(_obj) === _test;
                })()
            )
        );
    },
    _verifiedOptions = function (options) {
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
    },
    _objectToQueryString = function (obj) {
        var parts = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return parts.join('&');
    },
    _updateProgress = function (event) {
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

    if (!(_verifiedOptions(options))) {
        return;
    }

    this.instID = this.constructor.name + '.' + (Math.random() * (new Date().getTime()));

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

        this.timeOfResponse = (new Date()).getTime();
        this.roundTripTime = this.timeOfResponse - this.timeOfRequest;
        xhr.bandwidth = Math.floor((this.bytesDownloaded / this.roundTripTime) * 8 * 1000);
        this.bandwidth = xhr.bandwidth;
        this.onSuccess(xhr);
    }.bind(this);

    // GET requests should have the data in the URL instead of the body
    if (method === 'GET') {
        url += data;
    }

    // Open the asynchronous request
    xhr.open(method, url, true);

    this.timeOfRequest = (new Date()).getTime();
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
        avgBandwidth = (bytes * 1000) / milliseconds;
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

module.exports = Http;
