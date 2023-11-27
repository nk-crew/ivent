import { addHandler } from '../utils/handlers';

export default function one(element, event, handler, delegationFunction) {
  if (typeof event !== 'string' || !element) {
    return;
  }

  event.split(' ').forEach((originalTypeEvent) => {
    addHandler(element, originalTypeEvent, handler, delegationFunction, true);
  });
}
