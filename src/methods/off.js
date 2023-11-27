/* eslint-disable no-restricted-syntax */
import getElementEvents from '../utils/get-element-events';
import normalizeParameters from '../utils/normalize-parameters';
// eslint-disable-next-line import/no-cycle
import { removeHandler, removeNamespacedHandlers } from '../utils/handlers';

const stripUidRegex = /::\d+$/;

export default function off(element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }

  event.split(' ').forEach((originalTypeEvent) => {
    const [isDelegated, callable, typeEvent, parsedEvent] = normalizeParameters(
      originalTypeEvent,
      handler,
      delegationFunction
    );
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
