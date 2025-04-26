/* eslint-disable import/no-default-export */
import DeviceViewportSizes from './DeviceViewportSizes';

export type Device = keyof typeof DeviceViewportSizes;

export const Devices = Object.keys(DeviceViewportSizes) as Device[];

export default Devices;