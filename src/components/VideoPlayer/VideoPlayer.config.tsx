import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { BsCameraVideo } from 'react-icons/bs';

import VideoPlayerSettings, { BasicSettings } from './VideoPlayer.settings';

export default {
  craft: {
    displayName: 'VideoPlayer',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(VideoPlayerSettings, BasicSettings),
    },
  },
  info: {
    displayName: 'VideoPlayer',
    exposed: true,
    icon: BsCameraVideo,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    autoPlay: false,
    muted: false,
    loop: false,
    speed: false,
    fullScreen: false,
    miniPlayer: false,
    fastBackForward: false,
    style: {
      width: '900px',
    },
  },
} as T4DComponentConfig<IVideoPlayerProps>;

export interface IVideoPlayerProps extends webforms.ComponentProps {
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  videoSource: string;
  fullScreen: boolean;
  speed: boolean;
  miniPlayer: boolean;
  fastBackForward: boolean;
}
