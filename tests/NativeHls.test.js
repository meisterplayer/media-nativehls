import '@meisterplayer/meister-mock';
import NativeHls from '../src/js/NativeHls';

const PLUGIN_NAME = 'NativeHls';
const SUPPORTED_TYPES = ['m3u8', 'm3u'];

describe('Hls class', () => {
    test(`pluginName should be ${PLUGIN_NAME}`, () => {
        expect(NativeHls.pluginName).toBe(PLUGIN_NAME);
    });

    test('pluginVersion should return a version string', () => {
        // Version should match the SemVer pattern (e.g. 2.11.9)
        expect(NativeHls.pluginVersion).toMatch(/\d+\.\d+\.\d+/);
    });
});
