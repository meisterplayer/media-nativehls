function extractKeyInfo(keyLine) {
    const keyInfo = keyLine.replace('#EXT-X-KEY:', '')
    // All key value pairs are split with a ,
    .split(',')
    .reduce((result, keyValString) => {
        // We only use the first equal sign per string
        // Otherwise we might split something in an URL.
        const firstEqualIndex = keyValString.indexOf('=');

        // Retrieve key value pairs.
        const key = keyValString.substring(0, firstEqualIndex);
        const val = keyValString.substring(firstEqualIndex + 1);

        // The values are displayed like: ""value"", so we remove the extra pair of "".
        // eslint-disable-next-line no-param-reassign
        result[key] = val.replace(/"/g, '');

        return result;
    }, {});

    return keyInfo;
}

class M3u8Parser {
    constructor(text) {
        this.text = text;
    }

    parse() {
        const lines = this.text.split('\n');
        const result = {
            streams: [],
            segments: {},
            mediaSequence: 0,
            duration: 0,
            isLive: true,
        };

        let nextLineIsStream = false;
        let previousMediaNumber = result.mediaSequence;
        let streamInfo = {};

        lines.forEach((line) => {
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
            const matchBandwith = (/^#EXT-X-STREAM-INF:.*BANDWIDTH=(\d*)?/).exec(line);
            if (matchBandwith && matchBandwith[1]) {
                const bandwith = matchBandwith[1];
                streamInfo.bandwith = bandwith;
            }

            const matchResolution = (/^#EXT-X-STREAM-INF:.*RESOLUTION=(\d*x\d*)?/).exec(line);
            if (matchResolution && matchResolution[1]) {
                const resolutions = matchResolution[1].split('x');
                if (resolutions.length < 2) {
                    streamInfo.resolution = {
                        width: 0,
                        height: 0,
                    };
                } else {
                    const resolutionInfo = {
                        width: parseInt(resolutions[0], 10),
                        height: parseInt(resolutions[1], 10),
                    };

                    streamInfo.resolution = resolutionInfo;
                }
            }

            const matchInfo = (/^#EXTINF:?([0-9.]*)?,?(.*)?/).exec(line);
            if (matchInfo && matchInfo[1]) {
                result.segments[previousMediaNumber] = parseFloat(matchInfo[1]);
                previousMediaNumber += 1;
                result.duration += parseFloat(matchInfo[1]);
            }

            const matchMediaSequence = (/^#EXT-X-MEDIA-SEQUENCE:?(-?[0-9.]*)?/).exec(line);
            if (matchMediaSequence && matchMediaSequence[1]) {
                result.mediaSequence = parseInt(matchMediaSequence[1], 10);
                previousMediaNumber = parseInt(matchMediaSequence[1], 10);
            }
        });

        return result;
    }
}

export default M3u8Parser;
