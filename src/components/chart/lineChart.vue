<template lang="html">
  <div class="chart"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
import extend from 'extend';
import 'echarts/lib/chart/line';

export default {
  props: ['options'],
  mounted() {
    this.$emit('mounted', this);
    this.chart = echarts.init(this.$el);
  },
  methods: {
    render() {
      let options = this.options;
      options.grid={
        left:'70px'
      };
      this.chart.setOption(options);
    }
  }
}
</script>

<style lang="less">
  .chart {
    min-height: 200px;
  }
</style>
