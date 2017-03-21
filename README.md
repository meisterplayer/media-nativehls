# Native HLS Plugin #

A wrapper for browsers that supports natively HLS.

### How do I get set up? ###

When initializing the player add `NativeHls` with it's own configuration to the configuration object.

``` JavaScript
var meisterPlayer = new Meister("#player", {
    NativeHls: {
        filterAudioOnly: true,
    },
});
```

### Configuration ###

Options are required unless marked as [optional].

* [optional] [**filterAudioOnly**](#filterAudioOnly)
* [optional] [**dvrEnabled**](#dvrEnabled)
* [optional] [**dvrThreshold**](#dvrThreshold)
* [optional] [**safariDesktopDisabled**](#safariDesktopDisabled)

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

This enables/disables DVR capabilities in HLS if it is supported by the stream.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        dvrEnabled: false,
    }
});
```

#### dvrThreshold *[Number]* (default: 300) ####

This value determines if a live stream is a DVR stream yes or no. If the live stream has added up more seconds then the dvrThreshold it is considered a DVR stream else not.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        dvrThreshold: 50,
    }
});
```

#### safariDesktopDisabled *[Boolean]* (default: false) ####

This disables native HLS playback on safari browsers. This can be done for example when you have another plugin that allows HLS playback but with more features. This config option is only affected on the current instance.

Example:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    NativeHls: {
        safariDesktopDisabled: true,
    }
});
```
