/* eslint-disable import/no-default-export */
import SvgPhoneActive from '../assets/icons/phone-active.svg';
import SvgPhone from '../assets/icons/phone.svg';
import SvgTabletActive from '../assets/icons/tablet-active.svg';
import SvgTablet from '../assets/icons/tablet.svg';

// TODO: FZM-1244 - move this config to server

// size unit in pt (ios) or dp (android)
const DeviceViewportSizes = {
  // ios
  iphone11ProMax: {
    width: 414,
    height: 896,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  iphone11Pro: {
    width: 375,
    height: 812,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  iphone11: {
    width: 414,
    height: 896,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  iphone8Plus: {
    width: 414,
    height: 736,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  iphone8: {
    width: 375,
    height: 667,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  iphoneSE: {
    width: 375,
    height: 667,
    platform: 'ios',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },

  // android
  onePlus3: {
    width: 480,
    height: 853,
    platform: 'android',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  pixelXL: {
    width: 411,
    height: 823,
    platform: 'android',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  pixel: {
    width: 411,
    height: 731,
    platform: 'android',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },
  samsungGalaxyS9: {
    width: 360,
    height: 740,
    platform: 'android',
    icon: SvgPhone,
    iconActive: SvgPhoneActive,
  },

  // tablet
  ipadPro: {
    width: 1366,
    height: 1024,
    platform: 'tablet',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  ipad: {
    width: 1024,
    height: 768,
    platform: 'tablet',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },

  // desktop
  '1024x768': {
    width: 1024,
    height: 768,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  '1280x800': {
    width: 1280,
    height: 800,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  '1366x768': {
    width: 1366,
    height: 768,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  '1440x900': {
    width: 1440,
    height: 900,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  '1600x900': {
    width: 1600,
    height: 900,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  '1920x1080': {
    width: 1920,
    height: 1080,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
  ultrawide: {
    width: 3440,
    height: 1440,
    platform: 'desktop',
    icon: SvgTablet,
    iconActive: SvgTabletActive,
  },
};

export default DeviceViewportSizes;
