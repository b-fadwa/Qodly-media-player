import config, { IAudioPlayerProps } from './AudioPlayer.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './AudioPlayer.build';
import Render from './AudioPlayer.render';

const AudioPlayer: T4DComponent<IAudioPlayerProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

AudioPlayer.craft = config.craft;
AudioPlayer.info = config.info;
AudioPlayer.defaultProps = config.defaultProps;

export default AudioPlayer;
