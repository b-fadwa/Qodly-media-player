import { ESetting, TSetting } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load } from '@ws-ui/webform-editor';

const commonSettings: TSetting[] = [
  {
    key: 'muted',
    label: 'Muted',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
  {
    key: 'loop',
    label: 'Loop',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
  {
    key: 'autoPlay',
    label: 'Auto play',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
  {
    key: 'videoSource',
    label: 'Video source',
    type: ESetting.TEXT_FIELD,
    defaultValue: '',
  },
  {
    key: 'fullScreen',
    label: 'Fullscreen mode',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },  {
    key: 'miniPlayer',
    label: 'Picture in picture mode',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
    {
    key: 'speed',
    label: 'Show speed',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
  {
    key: 'fastBackForward',
    label: 'Fast back/forward',
    type: ESetting.CHECKBOX,
    defaultValue: false,
  },
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  ...DEFAULT_SETTINGS,
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter('style.overflow'),
];

export default Settings;
