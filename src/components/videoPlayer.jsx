import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Video, { VideoRef } from 'react-native-video';

// Within your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if you like.

const VideoPlayer = () => {
  const videoRef = useRef < VideoRef > null;
  const background = require('./background.mp4');

  const onBuffer = () => {
    //TODO
  };
  const onError = () => {
    //TODO
  };

  return (
    <Video
      // Can be a URL or a local file.
      source={background}
      // Store reference
      ref={videoRef}
      // Callback when remote video is buffering
      onBuffer={onBuffer}
      // Callback when video cannot be loaded
      onError={onError}
      style={styles.backgroundVideo}
    />
  );
};

export default VideoPlayer;

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
