import { ReactNode } from 'react';
import { PropsList } from './propsInterface';

export interface StateContextState {
  wrapperComponent: HTMLElement | undefined;
  contentComponent: HTMLElement | undefined;
}

export interface StateContextProps {
  children: ReactNode | ((props: any) => ReactNode);
  defaultValues: any;
  dynamicValues: any;
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
}

export interface StateContextValue {
  loaded: boolean;
  state: PropsList;
  dispatch: {
    setScale: (scale: number) => void;
    setPositionX: (positionX: number) => void;
    setPositionY: (positionY: number) => void;
    zoomIn: (scale?: number) => void;
    zoomOut: (scale?: number) => void;
    setTransform: (positionX: number, positionY: number, scale: number) => void;
    resetTransform: () => void;
    setDefaultState: () => void;
  };
  nodes: {
    setWrapperComponent: (wrapperComponent: HTMLElement) => void;
    setContentComponent: (contentComponent: HTMLElement) => void;
  };
}