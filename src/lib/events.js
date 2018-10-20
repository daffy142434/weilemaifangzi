const listener = {
};

export default {
  addEventListener(type, handler) {
    if (!listener[type]) {
      listener[type] = [];
    }
    listener[type].push(handler);
  },
  removeEventListener(type, removeHandler) {
    if (arguments.length === 1) {
      delete listener[type];
      return;
    }
    listener[type] = listener[type].filter(handler => handler != removeHandler);
  },
  emit(type, ...args) {
    listener[type].forEach((handler) => {
      handler(...args);
    });
  }
};
