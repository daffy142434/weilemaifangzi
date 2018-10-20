<template lang="html">
  <span>{{text}}<span style="display: none;">{{count}}</span></span>
</template>

<script>
export default {
  props: ['count'],
  updated() {
    if (this.count != this.value) {
      this.setValue();
    }
  },
  data() {
    return {
      text: 0,
      value: 0,
      tempValue: 0,
      timer: null
    }
  },
  methods: {
    setValue() {
      const subValue = this.count - this.tempValue;
      const absSubValue = Math.abs(subValue);
      const sleepCount = 20;
      const sleep = 1000 / sleepCount >> 0;
      let step = (subValue / sleepCount >> 0);
      let index = 0;

      if (step % 10 === 0) {
        step -= 1;
      }

      clearInterval(this.timer);
      this.value = this.count;
      this.timer = setInterval(() => {
        if (index >= sleepCount) {
          clearInterval(this.timer);
          this.tempValue += this.value;
          this.text = this.value;
          return;
        }
        this.tempValue += step;
        this.text = this.tempValue;
        index++;
      }, sleep);
    }
  }
}
</script>

<style lang="less">
</style>
