<template lang="html">
  <div class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
export default {
  props: ['options'],
  mounted() {
    this.$emit('mounted', this);
    this.chart = echarts.init(this.$el);
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
