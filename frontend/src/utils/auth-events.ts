type Listener = () => void;

const listeners = new Set<Listener>();

export const subscribeAuthChange = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const emitAuthChange = () => listeners.forEach((fn) => fn());
