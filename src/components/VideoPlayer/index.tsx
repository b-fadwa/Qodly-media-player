import config, { IVideoPlayerProps } from './VideoPlayer.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './VideoPlayer.build';
import Render from './VideoPlayer.render';

const VideoPlayer: T4DComponent<IVideoPlayerProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

VideoPlayer.craft = config.craft;
VideoPlayer.info = config.info;
VideoPlayer.defaultProps = config.defaultProps;

export default VideoPlayer;
