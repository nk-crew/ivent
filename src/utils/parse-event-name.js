const nativeEvents = new Set([
  'click',
  'dblclick',
  'mouseup',
  'mousedown',
  'contextmenu',
  'mousewheel',
  'DOMMouseScroll',
  'mouseover',
  'mouseout',
  'mousemove',
  'selectstart',
  'selectend',
  'keydown',
  'keypress',
  'keyup',
  'orientationchange',
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerleave',
  'pointercancel',
  'gesturestart',
  'gesturechange',
  'gestureend',
  'focus',
  'blur',
  'change',
  'reset',
  'select',
  'submit',
  'focusin',
  'focusout',
  'load',
  'unload',
  'beforeunload',
  'resize',
  'move',
  'DOMContentLoaded',
  'readystatechange',
  'error',
  'abort',
  'scroll',
]);
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
};

export default function parseEventName(name) {
  // Get the native events from namespaced events ('click.ghostkit.button' --> 'click')
  const eventName = name.replace(stripNameRegex, '');

  return {
    event: customEvents[eventName] || eventName,
    originalEvent: eventName,
    namespace: name.replace(namespaceRegex, '') || false,
    isNative: nativeEvents.has(eventName),
  };
}
