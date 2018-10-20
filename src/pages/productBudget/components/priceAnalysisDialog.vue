<template lang="html">
  <!-- <el-dialog
    title="定价分析"
    :visible.sync="visible"
    class="heavy-form"
    width="90%"
  > -->
    <div id="priceAnalysis" v-loading="loading">
      <bar-chart ref="barChart" :options="priceChartOptions">
      </bar-chart>
      <div class="product-budget-cluster-text-wrap">
        <div>
          <pie-chart ref="pieChart" :options="clusterChartOptions">
          </pie-chart>
        </div>
      </div>
    </div>
  <!-- </el-dialog> -->
</template>

<script>
import BarChart from '@/components/chart/barChart';
import PieChart from '@/components/chart/pieChart';
import getAsinLink from '@/lib/getAsinLink';
import ProductBudget from '../services.js';

const productBudget = new ProductBudget

export default {
  data() {
    return {
      visible: false,
      loading: false,
      priceChartOptions: {
        title: {
          text: '头五页商品价格分布'
        },
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {
            type : 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'',
            type:'bar',
            barWidth: '60%',
            data:[]
          }
        ]
      },
      clusterChartOptions: {
        title : {
          text: '所有商品价格区间与分布',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            data:[],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    show(id) {
      this.visible = true;
      this.loading = true;
      Promise.all([
        productBudget.getPriceAnalysisData(id),
        productBudget.getPriceAnalysisClusterText(id)
      ]).then(([priceAnalysisRes, clusterRes]) => {
        this.renderPriceChart(priceAnalysisRes.data.data || []);
        this.renderClusterChart(clusterRes.data.data);
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    renderPriceChart(datas) {
      const values = [];
      const price = [];
      let unit;
      this.datas = datas;
      datas.map((d) => {
        values.push(d.value);
        price.push({
          value: `${d.price}`,
          stationCode: d.stationCode,
          asin: d.asin
        });
        unit = d.priceUnit;
      });
      this.priceChartOptions.xAxis[0].data = values;
      this.priceChartOptions.yAxis = {
        axisLabel: {
          formatter: `{value}(${unit})`
        }
      }
      this.priceChartOptions.series[0].data = price;
      this.$refs.barChart.render();
      if (!this.isAddChartEvent) {
        this.isAddChartEvent = true;
        this.$refs.barChart.chart.on('click', (e) => {
          const data = this.datas[e.dataIndex];
          window.open(getAsinLink(data.stationCode, data.asin));
        });
      }
    },
    renderClusterChart(clusterRes) {
      const legend = [];
      const data = [];
      const other = {
        value: 0,
        name: '其他',
        label: {
          normal: {
            formatter: '{b}({d}%)'
          }
        }
      };
      clusterRes.map((item) => {
        let v = +item.percent.replace('%', '');

        if (v < 3) {
          other.value += v;
        } else {
          data.push({
            value: v,
            name: item.range,
            label: {
              normal: {
                formatter: '{b}({d}%)'
              }
            }
          });
        }
      });
      if (other.value > 0) {
        legend.push('其他');
        data.push(other);
      }
      this.clusterChartOptions.series[0].data = data;
      this.$refs.pieChart.render();
    }
  },
  components: {
    'bar-chart': BarChart,
    'pie-chart': PieChart
  }
}
</script>

<style lang="less">
   #priceAnalysis {
     .chart {
       height: 400px;
     }
   }
</style>
