Promise.prototype.done = function done(fn) {
  return this.then(fn).catch(fn);
}
