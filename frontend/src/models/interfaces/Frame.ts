/* eslint-disable import/no-default-export */

export interface ZPosition {
  x: number;
  y: number;
}

export interface ZSize {
  width: number;
  height: number;
}

export default interface ZFrame {
  position: ZPosition;
  size: ZSize;
}