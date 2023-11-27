import parseEventName from './parse-event-name';

export default function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
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
