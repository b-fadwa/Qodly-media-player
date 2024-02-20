import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { BsSoundwave } from 'react-icons/bs';

import AudioPlayerSettings, { BasicSettings } from './AudioPlayer.settings';

export default {
  craft: {
    displayName: 'AudioPlayer',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(AudioPlayerSettings, BasicSettings),
    },
  },
  info: {
    displayName: 'AudioPlayer',
    exposed: true,
    icon: BsSoundwave,
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
    loop: false,
    muted: false,
    autoPlay: false,
    fastBackForward:false,
  },
} as T4DComponentConfig<IAudioPlayerProps>;

export interface IAudioPlayerProps extends webforms.ComponentProps {
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  audioSource: string;
  fastBackForward: boolean;
}
