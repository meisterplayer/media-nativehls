# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [5.6.4](https://github.com/meisterplayer/media-nativehls/compare/v5.6.3...v5.6.4) (2019-06-24)


### Bug Fixes

* **seek:** Fix seeking to the start of a DVR window on load ([25245c0](https://github.com/meisterplayer/media-nativehls/commit/25245c0))



### [5.6.3](https://github.com/meisterplayer/media-nativehls/compare/v5.6.2...v5.6.3) (2019-06-04)


### Bug Fixes

* **live:** Remove arbitrary 30 second buffer when seeking to live ([013abea](https://github.com/meisterplayer/media-nativehls/commit/013abea))



<a name="5.6.2"></a>
## [5.6.2](https://github.com/meisterplayer/media-nativehls/compare/v5.6.1...v5.6.2) (2019-02-06)


### Bug Fixes

* **bitrates:** Fix issue with bitrate availability ([1206879](https://github.com/meisterplayer/media-nativehls/commit/1206879))



<a name="5.6.1"></a>
## [5.6.1](https://github.com/meisterplayer/media-nativehls/compare/v5.6.0...v5.6.1) (2018-02-22)


### Bug Fixes

* **autoplay:** Start playback correctly when an ad ends ([7b77bfa](https://github.com/meisterplayer/media-nativehls/commit/7b77bfa))
* **hls-ads-drm:** fix for Safari Mac and Safari iOS not playing live hls stream after preroll ([c33fa05](https://github.com/meisterplayer/media-nativehls/commit/c33fa05))



<a name="5.6.0"></a>
# [5.6.0](https://github.com/meisterplayer/media-nativehls/compare/v5.5.1...v5.6.0) (2018-02-05)


### Features

* **drm:** Extract DRM information from manifest ([2cc6004](https://github.com/meisterplayer/media-nativehls/commit/2cc6004))



<a name="5.5.1"></a>
## [5.5.1](https://github.com/meisterplayer/media-nativehls/compare/v5.5.0...v5.5.1) (2017-09-05)


### Bug Fixes

* **events:** Fix event names for id3Tags ([31c24e6](https://github.com/meisterplayer/media-nativehls/commit/31c24e6))



<a name="5.5.0"></a>
# [5.5.0](https://github.com/meisterplayer/media-nativehls/compare/v5.4.0...v5.5.0) (2017-09-04)


### Features

* **track:** Add support for reading id3 tags ([3759fbe](https://github.com/meisterplayer/media-nativehls/commit/3759fbe))



<a name="5.4.0"></a>
# [5.4.0](https://github.com/meisterplayer/media-nativehls/compare/v5.3.0...v5.4.0) (2017-08-21)


### Features

* **startFromBeginning:** Add offset support ([9576478](https://github.com/meisterplayer/media-nativehls/commit/9576478))



<a name="5.3.0"></a>
# [5.3.0](https://github.com/meisterplayer/media-nativehls/compare/v5.2.0...v5.3.0) (2017-07-13)


### Features

* **time:** Add duration and currentTime property accessors ([8cbf113](https://github.com/meisterplayer/media-nativehls/commit/8cbf113))



<a name="5.2.0"></a>
# [5.2.0](https://github.com/meisterplayer/media-nativehls/compare/v5.1.0...v5.2.0) (2017-06-27)


### Features

* **pluginVersion:** Add pluginVersion to class ([799ce7e](https://github.com/meisterplayer/media-nativehls/commit/799ce7e))



<a name="5.1.0"></a>
# [5.1.0](https://github.com/meisterplayer/media-nativehls/compare/v5.0.2...v5.1.0) (2017-06-21)


### Features

* **startFromBeginning:** Add option to startFromBeginning ([04d5d51](https://github.com/meisterplayer/media-nativehls/commit/04d5d51))



<a name="5.0.2"></a>
## 5.0.2 (2017-05-09)


### Bug Fixes

* **dvrThreshold:** Fix issue where a 0 threshold was not set ([bfadf5a](https://github.com/meisterplayer/media-nativehls/commit/bfadf5a))
* **userAgent:** Fix issue where Facebook inline browser would not play HLS on iOS ([9a88d0b](https://github.com/meisterplayer/media-nativehls/commit/9a88d0b))
