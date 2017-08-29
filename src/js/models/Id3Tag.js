export default class Id3Tag {
        /**
     * Creates an instance of Id3Tag.
     *
     * @param {string} key
     * @param {ArrayBuffer} data
     * @param {number} [startTime=0]
     * @param {number} [endTime=0]
     * @memberof Id3Tag
     */
    constructor(key, data, startTime = 0, endTime = 0) {
        this.data = data;
        this.key = key;
        this.type = 'org.id3';
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
