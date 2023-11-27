import getjQuery from '../utils/get-jquery';
import hydrateObj from '../utils/hydrate-obj';
import parseEventName from '../utils/parse-event-name';

export default function trigger(element, event, args) {
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

  const evt = hydrateObj(new Event(event, { bubbles, cancelable: true }), args);

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
