let uidEvent = 1;

export default function makeEventUid(element, uid) {
  // eslint-disable-next-line no-plusplus
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}
