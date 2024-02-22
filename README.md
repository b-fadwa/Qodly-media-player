# Overview

This pack provides two main components, a custom audio player and a custom video player. By using them, you'll have the possibility to play videos and audios links. Standard audio and video controls are available in these components, as well as the css customization through the different proposed classes.

## Audio player component

![audioPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/audioPlayer.png)

### Properties

| Name              | Type    | Default | Description                                                                                                                |
| ----------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| Loop              | boolean | false   | if set to true, then the audio will loop or repeat playback once it reaches the end.                                       |
| Muted             | boolean | false   | if set to true, then the audio sound will be muted by default.                                                             |
| Autoplay          | boolean | false   | if set to true, then the audio will automatically play at tha page opening.                                                |
| Fast back/forward | boolean | false   | if set to true, then two rewinding buttons will appear, thus the audio can be rewinded either forward or backwards by 10s. |
| Audio source      | string  | ""      | if provided, then the audio will play the given url.                                                                       |

### Datasource

| Name       | Type   | Required | Description                 |
| ---------- | ------ | -------- | --------------------------- |
| datasource | string | Yes      | Will contain the audio link |

### Custom css

When customizing the appearance of the audio player, you have access to the following classes within the component:

![audioPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/customAudio.png)

Here's a basic example:
```css
/*to customize the audio player container*/
self .player-container {
  background-color: black;
  border-radius: 0px;
}
/*to customize the start/pause button*/
self .player-start {
  background-color: gray;
}
/*to customize the rewind buttons*/
self .player-fast {
  background-color: gray;
}
/*to customize the duration part*/
self .player-duration-container {
  color: gray;
}
/*to customize the volume container*/
self .player-volume-container {
  color: gray;
}
/*to customize the volume button*/
self .player-volume-button {
  color: white;
}
```

## Video player component

![videoPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/videoPlayer.png)

### Properties

| Name               | Type    | Default | Description                                                                                                                |
| ------------------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| Loop               | boolean | false   | if set to true, the video will automatically start over from the beginning once it has reached the end.                    |
| Muted              | boolean | false   | if set to true, then the audio will be muted by default when the video is played.                                          |
| Autoplay           | boolean | false   | if set to true, then the video will start playing automatically when the page is loaded without any interruptions.         |
| Picture in picture | boolean | false   | if set to true, then the video player can be minimized to a smaller size while still playing the video content.            |
| Full screen        | boolean | false   | if set to true, then the video will go into full screen mode, and it will occupy the entire screen.                        |
| Fast back/forward  | boolean | false   | if set to true, then two rewinding buttons will appear, thus the video can be rewinded either forward or backwards by 10s. |
| Video source       | string  | ""      | if provided, then the video will play the provided link                                                                    |

### Datasource

| Name       | Type   | Required | Description                 |
| ---------- | ------ | -------- | --------------------------- |
| datasource | string | Yes      | Will contain the video link |

### Custom CSS

For the video player, you have access to the following classes within the component:

![videoPlayer](https://github.com/b-fadwa/audio-player/blob/develop/public/customVideo.png)

Here's a basic example:
```css
/*To customize the fullscreen button*/
self .player-fullscreen {
  background-color: gray;
}
/*To customize the picture to picture button*/
self .player-miniPlayer {
  background-color: gray;
}
/*To customize the speed button*/
self .player-speed {
  background-color: gray;
}
/*To customize the spped options card*/
self .player-speed-options {
  background-color: gray;
  color: white;
}
/*To customize the audio container of the video*/
self .video-container {
  border-radius: 0px;
  background-color: #0d387eff;
}
/*To customize the rewind buttons*/
self .player-fast {
  background-color: gray;
}
```

### Video player shortcuts

| Shortcut name     | Role |                                                                                                     
| ----------------- | ---- | 
| Spacebar          | Play/pause the video| 
| F                 | Enter/exit full screen mode|   
| M                 | Mute/unmute the video|   
| Arrow keys        | Forward or rewind the video by 10 seconds|   
| Escape            | Quit fullscreen mode|