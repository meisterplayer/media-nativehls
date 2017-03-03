# Native HLS Plugin #

### How do I get set up? ###

When initializing the player add `nativehls` with it's own configuration to the configuration object.

``` JavaScript
var player = new Meister("#querySelector", {
    nativehls: {
        filterAudioOnly: true,
    },
});
```

### Configuration ###

Options are required unless marked as [optional].

* [optional] **filterAudioOnly** :: *Boolean*  
    When set to true the player will filter out stream that only contain audio. This means they will not be visible in the ui to select.
