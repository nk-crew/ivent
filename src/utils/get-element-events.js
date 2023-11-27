import makeEventUid from './make-event-uid';

const eventRegistry = {}; // Events storage

export default function getElementEvents(element) {
  const uid = makeEventUid(element);

  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};

  return eventRegistry[uid];
}
