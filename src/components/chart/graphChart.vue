<template lang="html">
  <div class="chart">
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props: ['options'],
  mounted() {
    this.chart = echarts.init(this.$el);
  },
  methods: {
    render() {
      setTimeout(() => {
        this.chart.setOption(this.options);
      });
    }
  }
}
</script>

<style lang="less">
  .chart {
    min-height: 200px;
  }
</style>
