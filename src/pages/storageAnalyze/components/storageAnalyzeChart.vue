<template lang="html">
  <div class="workbench-chart-wrap">
    <div class="workbench-title"><span>{{title}}</span></div>
    <bar-chart ref="chart" :options="chartOption" v-loading="loading"></bar-chart>
    <div class="no-data" v-if="!(chartData&&chartData.length)">无对应数据</div>
  </div>
</template>

<script>
import BarChart from '@/components/chart/barChart';
import getChartDefaultOption from '../lib/getChartDefaultOption';

export default {
  components: {
    'bar-chart': BarChart,
  },
  props: {
    chartType: String,
    title: String,
    chartData: Array,
    totalMoney: Object,
  },
  data() {
    return {
      active: '',
      loading: true,
      chartOption: getChartDefaultOption(this.chartType)
    };
  },
  created() {

  },
  methods: {

  },
  watch: {
    chartData(newVal, oldVal) {
      if (newVal.length > 0) {
        this.loading = false;
        this.chartOption = getChartDefaultOption(this.chartType);
        newVal.map((item) => {
          this.chartOption.xAxis[0].data.push(item.storageName);
          if(this.chartType == 1) {
            this.chartOption.title.text = `合计总成本 ${this.totalMoney.currentCostAmountAll} 元 合计总流转成本 ${this.totalMoney.shippingPriceCnyAll} 元 合计总货本 ${this.totalMoney.costPriceCnyAll} 元`;
            this.chartOption.series[0].data.push(item.costPriceCny);
            this.chartOption.series[1].data.push(item.shippingPriceCny);
          }else if(this.chartType == 2) {
            this.chartOption.series[0].data.push(item.stocksNumber);
          }else if(this.chartType == 3) {
            this.chartOption.title.text = `合计客户损毁 ${this.totalMoney.damageCurrentCostAmountAll} 元 合计销毁核销 ${this.totalMoney.destructionCurrentCostAmountAll} 元 合计差项核销 ${this.totalMoney.differenceCurrentCostAmountAll} 元 合计在途锁定 ${this.totalMoney.wayCurrentCostAmountAll} 元`;
            this.chartOption.series[0].data.push(item.damageCurrentCostAmount);
            this.chartOption.series[1].data.push(item.destructionCurrentCostAmount);
            this.chartOption.series[2].data.push(item.differenceCurrentCostAmount);
            this.chartOption.series[3].data.push(item.wayCurrentCostAmount);
          }
        });
        
      }
      setTimeout(() => {
        this.$refs.chart.render();
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="css">
.no-data{
  position: absolute;
  top:50%;
  left: 45%;
}
</style>
