<template lang="html">
  <div class="chart">
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props: ['options'],
  mounted() {
    this.$emit('mounted', this);
    this.chart = echarts.init(this.$el);
    setTimeout(() => {
      this.render();
    })
  },
  updated() {
    if (this.chart) {
      this.render();
    }
  },
  methods: {
    render() {
      this.chart.setOption(this.options);
    }
  }
}
</script>

<style lang="less">
  .chart {
    min-height: 200px;
  }
</style>
