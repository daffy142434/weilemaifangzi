<template lang="html">
  <div class="chart">
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
export default {
  props: ['options'],
  mounted() {
    this.$emit('mounted', this);
    this.chart = echarts.init(this.$el);
    if(typeof this.options.clickFunction == 'function') {
      this.chart.on('click', (params)=> {
        this.options.clickFunction(params);
      });
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
