import { ReactNode } from 'react';

export interface WheelProps {
  step?: number;
  wheelEnabled?: boolean;
  touchPadEnabled?: boolean;
  limitsOnWheel?: boolean;
  smoothStep?: boolean;
  disabled?: boolean;
  wheelScaleMode?: boolean;
}

export interface PanProps {
  disabled?: boolean;
  lockAxisX?: boolean;
  lockAxisY?: boolean;
  panningEnabled?: boolean;
  panningStarted?: boolean;
  padding?: boolean;
  paddingSize?: number;
  velocityEqualToMove?: boolean;
  velocityDisabled?: boolean;
  velocity?: boolean;
  velocitySensitivity?: number;
  velocityActiveScale?: number;
  velocityMinSpeed?: number;
  velocityBaseTime?: number;
  velocityAnimationType?: string;
}

export interface PinchProps {
  disabled?: boolean;
  step?: number;
  pinchEnabled?: boolean;
}

export interface DoubleClickProps {
  disabled?: boolean;
  step?: number;
  mode?: string;
  animationTime?: number;
  animationType?: string;
}

export interface ZoomProps {
  disabled?: boolean;
  step?: number;
  animationTime?: number;
  animationType?: string;
  maxScale?: number;
  minScale?: number;
  zoomAnimation?: {
    disabled?: boolean;
    animationTime?: number;
    animationType?: string;
  };
}

export interface OptionsProps {
  limitToBounds?: boolean;
  limitToWrapper?: boolean;
  centerContent?: boolean;
  centerZoomedOut?: boolean;
  disabled?: boolean;
  minScale?: number;
  maxScale?: number;
}

export interface PropsList {
  children?: ReactNode;
  defaultPositionX?: number;
  defaultPositionY?: number;
  defaultScale?: number;
  positionX?: number;
  positionY?: number;
  scale?: number;
  previousScale?: number;
  options?: OptionsProps;
  pan?: PanProps;
  pinch?: PinchProps;
  wheel?: WheelProps;
  zoomIn?: ZoomProps;
  zoomOut?: ZoomProps;
  doubleClick?: DoubleClickProps;
  reset?: ZoomProps;
  scalePadding?: number;
  onWheelStart?: (ref: any, event: any) => void;
  onWheel?: (ref: any, event: any) => void;
  onWheelStop?: (ref: any, event: any) => void;
  onPanningStart?: (ref: any, event: any) => void;
  onPanning?: (ref: any, event: any) => void;
  onPanningStop?: (ref: any, event: any) => void;
  onPinchingStart?: (ref: any, event: any) => void;
  onPinching?: (ref: any, event: any) => void;
  onPinchingStop?: (ref: any, event: any) => void;
  onZoomChange?: (ref: any, event: any) => void;
  dynamicValues?: any;
  defaultValues?: any;
  transition?: boolean;
}