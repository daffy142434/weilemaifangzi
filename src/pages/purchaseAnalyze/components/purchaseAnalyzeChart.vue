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
    clickChart: Function,
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
        this.chartOption = getChartDefaultOption(this.chartType, this.$router);
        let index = 0;
        newVal.map((item) => {
          if (item === null) {
            return
          }
          if(this.chartType == 'waitDeliveryNum') {
            this.chartOption.xAxis[0].data.push(item.sku);
            this.chartOption.series[0].data.push(item.waitDeliveryNum);
          }else if(this.chartType == 'waitDeliveryAmount') {
            this.chartOption.xAxis[0].data.push(item.sku);
            this.chartOption.series[0].data.push(item.waitDeliveryAmount);
          }else if(this.chartType == 'purchaseOrderTrend') {
            this.chartOption.xAxis[0].data.push(item.monthStr);
            this.chartOption.title.text = `累计采购单金额 ${this.totalMoney.purchaseAmountAll} 元 累计结清金额 ${this.totalMoney.settledAmountAll} 元 当前未结清金额 ${this.totalMoney.restAmountAll} 元`;
            this.chartOption.series[0].data.push(item.restAmount);
            this.chartOption.series[1].data.push(item.settledAmount);
          }else if(this.chartType == 'deliveryTrend') {
            this.chartOption.xAxis[0].data.push(item.monthStr);
            this.chartOption.series[0].data.push(item.waitDeliveryAmount);
            this.chartOption.series[1].data.push(item.deliveredAmount);
          }else if(this.chartType == 'restAmountByPlanSettleDateTrend') {
            this.chartOption.xAxis[0].data.push(item.monthStr);
            this.chartOption.series[0].data.push(item.restAmountByPlanSettleDate);
          }else if(this.chartType == 'waitSettleAmountTrend') {
            this.chartOption.xAxis[0].data.push(item.monthStr);
            this.chartOption.series[0].data.push(item.waitSettleAmount);
          }else if(this.chartType == 'purchaseUnitPrice') {
            this.chartOption.xAxis[0].data.push(item.monthStr);
            this.chartOption.series[0].data.push(item.purchaseUnitPrice);
          }
        });
        setTimeout(() => {
          this.$refs.chart.render();
          window.addEventListener("resize", this.$refs.chart.chart.resize);
        });
      }
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
