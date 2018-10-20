export default class Delay {
  constuctor() {
    this.timestamp = null;
  }
  start() {
    this.timestamp = Date.now();
  }
  end(delay, fn) {
    setTimeout(() => {
      fn && fn();
    }, delay - (Date.now() - this.timestamp));
  }
}
