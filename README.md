# Native HLS Plugin #

A wrapper for browsers that supports natively HLS that adds additional control and configuration over default native playback.

### How do I get set up? ###

When initializing the player add `NativeHls` with it's own configuration to the configuration object.

``` JavaScript
var meisterPlayer = new Meister("#player", {
    NativeHls: {
        filterAudioOnly: true,
    },
});

meisterPlayer.setItem({
    src: 'INSERT_HLS_M3U8_HERE',
    type: 'm3u8',
});
```

### Configuration ###

Options are required unless marked as [optional].

* [optional] [**filterAudioOnly**](#filteraudioonly-boolean-default-false)
* [optional] [**dvrEnabled**](#dvrenabled-boolean-default-true)
* [optional] [**dvrThreshold**](#dvrthreshold-number-default-300)
* [optional] [**safariDesktopDisabled**](#safaridesktopdisabled-boolean-default-false)

Config options
-------

#### filterAudioOnly *[Boolean]* (default: false) ####

When set to true the player will filter out stream that only contain audio. This means they will not be visible in the ui to select.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        filterAudioOnly: true,
    }
});
```

#### dvrEnabled *[Boolean]* (default: true) ####

Setting this flag to true will treat a HLS stream with DVR window as a livestream.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        dvrEnabled: false,
    }
});
```

#### dvrThreshold *[Number]* (default: 300) ####

This value in seconds is used to determine whether a HLS stream is considered to have a DVR window or not. By default streams that have a window of less than 5 minutes are considered 'just' live.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        dvrThreshold: 50,
    }
});
```

#### safariDesktopDisabled *[Boolean]* (default: false) ####

This flag can be used to disable the plugin in Safari on macOS. This can be useful when you do want to use it for mobile playback, but have a more feature rich HLS plugin for macOS.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        safariDesktopDisabled: true,
    }
});
```
