/*!
 * ivent v0.2.0 (https://github.com/nk-crew/ivent)
 * Copyright 2023 nK <https://nkdev.info>
 * Licensed under MIT (https://github.com/nk-crew/ivent/blob/master/LICENSE)
 */

let uidEvent = 1;
function makeEventUid(element, uid) {
  // eslint-disable-next-line no-plusplus
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}

const eventRegistry = {}; // Events storage

function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

const nativeEvents = /*#__PURE__*/new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
  pointerenter: 'pointerover',
  pointerleave: 'pointerout'
};
function parseEventName(name) {
  // Get the native events from namespaced events ('click.ghostkit.button' --> 'click')
  const eventName = name.replace(stripNameRegex, '');
  return {
    event: customEvents[eventName] || eventName,
    originalEvent: eventName,
    namespace: name.replace(namespaceRegex, '') || false,
    isNative: nativeEvents.has(eventName)
  };
}

function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: Bootstrap tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  const parsedEvent = parseEventName(originalTypeEvent);
  let typeEvent = parsedEvent.event;
  if (!parsedEvent.isNative) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent, parsedEvent];
}

/* eslint-disable no-restricted-syntax */
const stripUidRegex = /::\d+$/;
function off(element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }
  event.split(' ').forEach(originalTypeEvent => {
    const [isDelegated, callable, typeEvent, parsedEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, evt] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!parsedEvent.namespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, evt.callable, evt.delegationSelector);
      }
    }
  });
}

function hydrateObj(obj, meta = {}) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/* eslint-disable no-restricted-syntax */

function iventHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      // eslint-disable-next-line no-use-before-define
      off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function iventDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      // eslint-disable-next-line no-restricted-syntax
      for (const domElement of domElements) {
        if (domElement !== target) {
          // eslint-disable-next-line no-continue
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          // eslint-disable-next-line no-use-before-define
          off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
    return false;
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  // eslint-disable-next-line prefer-const
  let [isDelegated, callable, typeEvent, parsedEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (parsedEvent.event !== parsedEvent.originalEvent) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
        return false;
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, parsedEvent.namespace);
  const fn = isDelegated ? iventDelegationHandler(element, handler, callable) : iventHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;

  // Add support for custom event handler `ready` for DOMContentLoaded.
  if (element === document && typeEvent === 'ready' && !isDelegated) {
    typeEvent = 'DOMContentLoaded';
    if (document.readyState !== 'loading') {
      fn(new CustomEvent('ready'));
      return;
    }
  }
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}

function on(element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }
  event.split(' ').forEach(originalTypeEvent => {
    addHandler(element, originalTypeEvent, handler, delegationFunction, false);
  });
}

function one(element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }
  event.split(' ').forEach(originalTypeEvent => {
    addHandler(element, originalTypeEvent, handler, delegationFunction, true);
  });
}

function getjQuery() {
  if (window.jQuery) {
    return window.jQuery;
  }
  return null;
}

function trigger(element, event, args) {
  if (typeof event !== 'string' || !element) {
    return null;
  }
  const $ = getjQuery();
  const parsedEvent = parseEventName(event);
  let jQueryEvent = null;
  let bubbles = true;
  let nativeDispatch = true;
  let defaultPrevented = false;
  if (parsedEvent.namespace && $) {
    jQueryEvent = $.Event(event, args);
    $(element).trigger(jQueryEvent);
    bubbles = !jQueryEvent.isPropagationStopped();
    nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
    defaultPrevented = jQueryEvent.isDefaultPrevented();
  }
  const evt = hydrateObj(new Event(event, {
    bubbles,
    cancelable: true
  }), args);
  if (defaultPrevented) {
    evt.preventDefault();
  }
  if (nativeDispatch) {
    element.dispatchEvent(evt);
  }
  if (evt.defaultPrevented && jQueryEvent) {
    jQueryEvent.preventDefault();
  }
  return evt;
}

export { off, on, one, trigger };
//# sourceMappingURL=ivent.esm.js.map
