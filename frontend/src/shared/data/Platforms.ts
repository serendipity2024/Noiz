/* eslint-disable import/no-default-export */
import DeviceViewportSizes from './DeviceViewportSizes';
import { Device } from './Devices';

const Platforms = ['custom', 'ios', 'android', 'tablet', 'desktop'] as const;

export type Platform = typeof Platforms[number];

export const PlatformToDeviceMap = Object.entries(DeviceViewportSizes)
  .map(([key, value]) => ({ key: key as Device, ...value }))
  .reduce((obj, e) => {
    // eslint-disable-next-line no-param-reassign
    obj[e.platform as Platform] = { ...obj[e.platform as Platform], [e.key]: e };
    return obj;
  }, {} as Record<Platform, Record<Device, typeof DeviceViewportSizes[Device]>>);

export default Platforms;
