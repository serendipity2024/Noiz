import { ReactEventHandler } from 'react'

export type Vector2 = [number, number]
export type FalseOrNumber = false | number

export type ReactEventHandlers = {
  [key in ReactEventHandlerKey]?: ReactEventHandler
}

export type ReactEventHandlerKey =
  | 'onClick'
  | 'onContextMenu'
  | 'onDoubleClick'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDragStart'
  | 'onDrop'
  | 'onMouseDown'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onMouseMove'
  | 'onMouseOut'
  | 'onMouseOver'
  | 'onMouseUp'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onGotPointerCapture'
  | 'onLostPointerCapture'
  | 'onPointerEnter'
  | 'onPointerLeave'
  | 'onPointerOver'
  | 'onPointerOut'
  | 'onTouchCancel'
  | 'onTouchEnd'
  | 'onTouchMove'
  | 'onTouchStart'
  | 'onWheel'

export type IngKey = 'hovering' | 'scrolling' | 'wheeling' | 'dragging' | 'moving' | 'pinching'
export type CoordinatesKey = 'drag' | 'wheel' | 'move' | 'scroll'
export type DistanceAngleKey = 'pinch'
export type GestureKey = CoordinatesKey | DistanceAngleKey | 'hover'
export type StateKey<T extends GestureKey = GestureKey> = T extends 'hover' ? 'move' : T

export type UseGestureEvent = UIEvent | React.UIEvent | PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent

export interface WebKitGestureEvent extends UIEvent {
  scale: number
  rotation: number
}

export interface SharedGestureState {
  [ingKey: string]: boolean
  touches: number
  down: boolean
  buttons: number
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
  locked: boolean
}

export interface CommonGestureState {
  _active: boolean
  _blocked: boolean
  _intentional: [false | number, false | number]
  _movement: Vector2
  _initial: Vector2
  _bounds: [Vector2, Vector2]
  _threshold: Vector2
  _lastEventType?: string
  _dragTarget?: EventTarget | (EventTarget & Element) | null
  _dragPointerId?: number | null
  _dragStarted: boolean
  _dragPreventScroll: boolean
  _dragIsTap: boolean
  _dragDelayed: boolean
  event?: React.UIEvent | UIEvent
  intentional: boolean
  values: Vector2
  velocities: Vector2
  delta: Vector2
  movement: Vector2
  offset: Vector2
  lastOffset: Vector2
  initial: Vector2
  previous: Vector2
  direction: Vector2
  first: boolean
  last: boolean
  active: boolean
  startTime: number
  timeStamp: number
  elapsedTime: number
  cancel(): void
  canceled: boolean
  memo?: any
  args?: any
}

export interface Coordinates {
  axis?: 'x' | 'y'
  xy: Vector2
  velocity: number
  vxvy: Vector2
  distance: number
}

export interface DragState {
  _pointerId?: number
  tap: boolean
  swipe: Vector2
}

export interface PinchState {
  _pointerIds: [number, number]
}

export interface DistanceAngle {
  da: Vector2
  vdva: Vector2
  origin: Vector2
  turns: number
}

export type State = {
  shared: SharedGestureState
  drag: CommonGestureState & Coordinates & DragState
  wheel: CommonGestureState & Coordinates
  scroll: CommonGestureState & Coordinates
  move: CommonGestureState & Coordinates
  pinch: CommonGestureState & DistanceAngle & PinchState
}

export type GestureState<T extends StateKey> = State[T]
export type PartialGestureState<T extends StateKey> = Partial<GestureState<T>>
export type FullGestureState<T extends StateKey> = GestureState<T> & SharedGestureState

export type Fn = (...args: any[]) => any

export type Handler<Key extends StateKey, EventType = UIEvent> = (
  state: FullGestureState<Key> & { event: EventType },
  ...args: any[]
) => any | void

export interface InternalHandlers {
  drag: Handler<'drag'>
  wheel: Handler<'wheel'>
  scroll: Handler<'scroll'>
  move: Handler<'move'>
  pinch: Handler<'pinch'>
  hover: Handler<'move'>
}

export interface UserHandlersPartial {
  onDrag?: Handler<'drag'>
  onDragStart?: Handler<'drag'>
  onDragEnd?: Handler<'drag'>
  onWheel?: Handler<'wheel'>
  onWheelStart?: Handler<'wheel'>
  onWheelEnd?: Handler<'wheel'>
  onScroll?: Handler<'scroll'>
  onScrollStart?: Handler<'scroll'>
  onScrollEnd?: Handler<'scroll'>
  onMove?: Handler<'move'>
  onMoveStart?: Handler<'move'>
  onMoveEnd?: Handler<'move'>
  onPinch?: Handler<'pinch'>
  onPinchStart?: Handler<'pinch'>
  onPinchEnd?: Handler<'pinch'>
  onHover?: Handler<'move'>
}

export type UserHandlers = Required<UserHandlersPartial>

export type EventTypes = {
  drag: UIEvent
  wheel: WheelEvent
  scroll: UIEvent
  move: MouseEvent | PointerEvent | TouchEvent
  pinch: TouchEvent | WebKitGestureEvent
  hover: MouseEvent
}

export type NativeHandlersPartial = {
  [key in ReactEventHandlerKey]?: (state: SharedGestureState & { event: UIEvent; args: any }, ...args: any) => void
}

export interface InternalConfig {
  domTarget?: EventTarget | null
  window?: EventTarget
  eventOptions: {
    capture?: boolean
    passive?: boolean
  }
  transform?: (v: Vector2) => Vector2
  threshold?: number | Vector2
  rubberband?: boolean | number | Vector2
  enabled?: boolean
  triggerAllEvents?: boolean
  initial?: Vector2 | ((state: State['shared']) => Vector2)
  bounds?: any
  preventScroll?: boolean
  lockDirection?: boolean
  axis?: 'x' | 'y'
}

export interface GenericOptions {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
  eventOptions?: {
    capture?: boolean
    passive?: boolean
  }
  window?: EventTarget
  enabled?: boolean
}

export interface RecognizerClasses {
  drag?: typeof import('./DragRecognizer').default
  wheel?: typeof import('./WheelRecognizer').default
  scroll?: typeof import('./ScrollRecognizer').default
  move?: typeof import('./MoveRecognizer').default
  pinch?: typeof import('./PinchRecognizer').default
}

export type HookReturnType<T extends { domTarget?: any }> = T['domTarget'] extends object
  ? void | undefined
  : ReactEventHandlers