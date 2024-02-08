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
    key: 'audioSource',
    label: 'Audio source',
    type: ESetting.TEXT_FIELD,
    defaultValue: "",
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
