# Overview

This pack provides two main components, a custom audio player and a custom video player. By using them, you'll have the possibility to play videos and audios links. Standard audio and video controls are available in these components, as well as the css customization through the different proposed classes.

## Audio player component 

![audioPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/audioPlayer.png)

### Properties

| Name       | Type          | Default   | Description                                       |
| ---------- | ----------------|------------------------ | ------------------------------------------------- |
| Loop       | boolean      |false     | if set to true, then the audio will loop or repeat playback once it reaches the end. |
| Muted       | boolean      |false     | if set to true, then the audio sound will be muted by default. |
| Autoplay      | boolean      |false     | if set to true, then the audio will automatically play at tha page opening.  |
| Audio source      | string     |""     | if provided, then the audio will play the given url.|


| Name       | Type          | Required   | Description                                       |
| ---------- | ---------------- |--------------------- |-------------------------------------------------|
| datasource       |string      |No     | Will contain the audio link|

### Custom css

When customizing the appearance of the audio player, you have access to the following classes within the component:

![audioPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/audioCustomCss.png)


## Video player component 

![videoPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/videoPlayer.png)

### Properties

| Name       | Type          | Default   | Description                                       |
| ---------- | ----------------|------------------------ | ------------------------------------------------- |
| Loop       | boolean      |false     | if set to true, the video will automatically start over from the beginning once it has reached the end.|
| Muted       | boolean      |false     | if set to true, then the audio will be muted by default when the video is played. |
| Autoplay      | boolean      |false     | if set to true, then the video will start playing automatically when the page is loaded without any interruptions.|
| Mini Player      | boolean      |false     | if set to true, then the video player can be minimized to a smaller size while still playing the video content. |
| Full screen    | boolean      |false     | if set to true, then the video will go into full screen mode, and it will occupy the entire screen.|
| Video source      | string     |""     | if provided, then the video will play the provided link |


### Datasource

| Name       | Type          | Required   | Description                                       |
| ---------- | ---------------- |--------------------- |-------------------------------------------------|
| datasource       |string      |No     | Will contain the video link|


### Custom CSS

For the video player, you have access to the following classes within the component:

![videoPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/videoCustomCss.png)
