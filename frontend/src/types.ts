import { ReactEventHandler } from 'react';

export type Fn = (...args: any[]) => any;

export type Vector2 = [number, number];
export type Tuple<T = any, L extends number = 0> = [T, ...T[]] & { length: L };

export interface GenericOptions {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null;
  eventOptions?: {
    capture?: boolean;
    passive?: boolean;
  };
  window?: EventTarget;
  enabled?: boolean;
}

export interface InternalGenericOptions {
  domTarget?: EventTarget | null;
  window?: EventTarget;
  eventOptions: {
    capture?: boolean;
    passive?: boolean;
  };
  enabled?: boolean;
}

export interface DragConfig {
  filterTaps?: boolean;
  delay?: number;
  swipeVelocity?: number;
  swipeDistance?: number;
  swipeDirection?: Vector2;
}

export interface InternalDragOptions extends DragConfig {
  delay: number;
  swipeVelocity: number;
  swipeDistance: number;
}

export interface CoordinatesConfig {
  axis?: 'x' | 'y';
  lockDirection?: boolean;
  bounds?: any;
  rubberband?: boolean | number | Vector2;
}

export interface CoordinatesOptions extends CoordinatesConfig {
  threshold?: number | Vector2;
}

export interface InternalCoordinatesOptions extends CoordinatesConfig {
  threshold: Vector2;
  rubberband: Vector2;
}

export interface DistanceAngleConfig {
  lockDirection?: boolean;
  bounds?: any;
  rubberband?: boolean | number | Vector2;
}

export interface InternalDistanceAngleOptions extends DistanceAngleConfig {
  threshold: Vector2;
  rubberband: Vector2;
}

export interface GestureOptions<T = any> {
  enabled?: boolean;
  initial?: Vector2 | ((state: T) => Vector2);
  threshold?: number | Vector2;
  triggerAllEvents?: boolean;
  transform?: (v: Vector2) => Vector2;
}

export interface InternalGestureOptions extends GestureOptions {
  threshold: Vector2;
  transform?: (v: Vector2) => Vector2;
}

export type HandlerKey =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onPinch'
  | 'onPinchStart'
  | 'onPinchEnd'
  | 'onWheel'
  | 'onWheelStart'
  | 'onWheelEnd'
  | 'onMove'
  | 'onMoveStart'
  | 'onMoveEnd'
  | 'onScroll'
  | 'onScrollStart'
  | 'onScrollEnd'
  | 'onHover';

export interface UseGestureConfig {
  drag?: boolean | DragConfig;
  wheel?: boolean | CoordinatesOptions;
  scroll?: boolean | CoordinatesOptions;
  move?: boolean | CoordinatesOptions;
  pinch?: boolean | DistanceAngleConfig;
  hover?: boolean | GestureOptions;
}