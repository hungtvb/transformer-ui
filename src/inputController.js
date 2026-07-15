export function createInputController() {
  const disposers = [];

  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    const dispose = () => target.removeEventListener(type, handler, options);
    disposers.push(dispose);
    return dispose;
  };

  const capturePointer = (element, event) => {
    if (event?.pointerId == null) return;
    element.setPointerCapture?.(event.pointerId);
  };

  const releasePointer = (element, event) => {
    if (event?.pointerId == null) return;
    if (element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId);
  };

  return Object.freeze({
    listen,
    capturePointer,
    releasePointer,

    bindPointerPosition(onMove) {
      return listen(window, 'pointermove', (event) => {
        onMove({
          x: event.clientX / innerWidth * 2 - 1,
          y: -(event.clientY / innerHeight) * 2 + 1,
          event,
        });
      });
    },

    bindVisibility(onChange) {
      return listen(document, 'visibilitychange', () => onChange(document.hidden));
    },

    dispose() {
      while (disposers.length) disposers.pop()?.();
    },
  });
}
