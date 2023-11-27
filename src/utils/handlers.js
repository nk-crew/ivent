/* eslint-disable no-restricted-syntax */

// eslint-disable-next-line import/no-cycle
import off from '../methods/off';

import hydrateObj from './hydrate-obj';
import makeEventUid from './make-event-uid';
import getElementEvents from './get-element-events';
import normalizeParameters from './normalize-parameters';

function iventHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, { delegateTarget: element });

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

    for (let { target } = event; target && target !== this; target = target.parentNode) {
      // eslint-disable-next-line no-restricted-syntax
      for (const domElement of domElements) {
        if (domElement !== target) {
          // eslint-disable-next-line no-continue
          continue;
        }

        hydrateObj(event, { delegateTarget: target });

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

export function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(
    (event) => event.callable === callable && event.delegationSelector === delegationSelector
  );
}

export function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  // eslint-disable-next-line prefer-const
  let [isDelegated, callable, typeEvent, parsedEvent] = normalizeParameters(
    originalTypeEvent,
    handler,
    delegationFunction
  );

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (parsedEvent.event !== parsedEvent.originalEvent) {
    const wrapFunction = (fn) => {
      return function (event) {
        if (
          !event.relatedTarget ||
          (event.relatedTarget !== event.delegateTarget &&
            !event.delegateTarget.contains(event.relatedTarget))
        ) {
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
  const fn = isDelegated
    ? iventDelegationHandler(element, handler, callable)
    : iventHandler(element, callable);

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

export function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

export function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
