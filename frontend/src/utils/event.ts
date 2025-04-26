import { Fn, EventOptions, UseGestureEvent, Vector2, WebKitGestureEvent } from '../types'

const isBrowser = typeof window !== 'undefined'

export const supportsTouchEvents = () => isBrowser && window.ontouchstart === null

const setListeners = (add: boolean) => (el: EventTarget, listeners: [string, Fn][], options: EventOptions): void => {
  const action = add ? 'addEventListener' : 'removeEventListener'
  listeners.forEach(([eventName, fn]) => el[action](eventName, fn, options))
}

/**
 * Whether the browser supports GestureEvent (ie Safari)
 * @returns true if the browser supports gesture event
 */
export function supportsGestureEvents(): boolean {
  try {
    // TODO [TS] possibly find GestureEvent definitions?
    // @ts-ignore: no type definitions for webkit GestureEvents
    return 'constructor' in GestureEvent
  } catch (e) {
    return false
  }
}

export const addListeners = setListeners(true)
export const removeListeners = setListeners(false)

interface ModifierKeys {
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  ctrlKey: boolean
}

/**
 * Gets modifier keys from event
 * @param event
 * @returns modifier keys
 */
export function getModifierKeys(event: UseGestureEvent): ModifierKeys {
  const { shiftKey, altKey, metaKey, ctrlKey } = event
  return { shiftKey, altKey, metaKey, ctrlKey }
}

function getTouchEvents(event: UseGestureEvent) {
  if ('touches' in event) {
    const { touches, changedTouches } = event
    return touches.length > 0 ? touches : changedTouches
  }
  return null
}

export function getGenericEventData(event: React.MouseEvent | React.TouchEvent | React.PointerEvent) {
  const buttons = 'buttons' in event ? event.buttons : 0
  const touchEvents = getTouchEvents(event)
  const touches = (touchEvents && touchEvents.length) || 0
  const down = touches > 0 || buttons > 0
  return { touches, down, buttons, ...getModifierKeys(event) }
}

type Values = { values: Vector2 }

/**
 * Gets scroll event values
 * @param event
 * @returns scroll event values
 */
export function getScrollEventValues(event: UseGestureEvent): Values {
  // If the currentTarget is the window then we return the scrollX/Y position.
  // If not (ie the currentTarget is a DOM element), then we return scrollLeft/Top
  const { scrollX, scrollY, scrollLeft, scrollTop } = event.currentTarget as Element & Window
  return { values: [scrollX || scrollLeft || 0, scrollY || scrollTop || 0] }
}

/**
 * Gets wheel event values.
 * @param event
 * @returns wheel event values
 */
export function getWheelEventValues(event: UseGestureEvent<React.WheelEvent>): Values {
  const { deltaX, deltaY } = event
  //TODO implement polyfill ?
  // https://developer.mozilla.org/en-US/docs/Web/Events/wheel#Polyfill
  return { values: [deltaX, deltaY] }
}

/**
 * Gets pointer event values.
 * @param event
 * @returns pointer event values
 */
export function getPointerEventValues(event: React.MouseEvent | React.TouchEvent | React.PointerEvent): Values {
  const touchEvents = getTouchEvents(event)
  const { clientX, clientY } = touchEvents ? touchEvents[0] : (event as React.PointerEvent)
  return { values: [clientX, clientY] }
}

const WEBKIT_DISTANCE_SCALE_FACTOR = 260

/**
 * Gets webkit gesture event values.
 * @param event
 * @returns webkit gesture event values
 */
export function getWebkitGestureEventValues(event: WebKitGestureEvent): Values {
  return { values: [event.scale * WEBKIT_DISTANCE_SCALE_FACTOR, event.rotation] as Vector2 }
}

/**
 * Gets two touches event data
 * @param event
 * @returns two touches event data
 */
export function getTwoTouchesEventData(event: React.TouchEvent) {
  const { touches } = event
  const dx = touches[1].clientX - touches[0].clientX
  const dy = touches[1].clientY - touches[0].clientY

  const values: Vector2 = [Math.hypot(dx, dy), -(Math.atan2(dx, dy) * 180) / Math.PI]
  const origin: Vector2 = [(touches[1].clientX + touches[0].clientX) / 2, (touches[1].clientY + touches[0].clientY) / 2]

  return { values, origin }
}
