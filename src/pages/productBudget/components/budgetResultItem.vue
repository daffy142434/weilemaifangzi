<template lang="html">
  <el-card :class="{'budget-result': true, 'first-result': index === 0}">
    <div slot="header" v-if="data.keyWord">
      {{data.keyWord}}
      <span :class="notionalFlagClass"></span>
      <span>
        相关结果产品数（无噪点）：{{data.itemCount - data.itemCountNoise}}
      </span>
    </div>
    <div class="budget-result-body" v-if="data.keyWord">
      <chart ref="ratePieChart" :options="ratePieOptions" v-if="ratePieOptions"></chart>
      <div class="chart" v-if="!ratePieOptions">无对应数据</div>
      <chart ref="pricePieChart" :options="pricePieOptions" v-if="ratePieOptions"></chart>
      <div class="chart" v-if="!pricePieOptions">无对应数据</div>
      <chart ref="rateBarChart" :options="rateBarOptions" v-if="ratePieOptions"></chart>
      <div class="chart" v-if="!rateBarOptions">无对应数据</div>
    </div>
    <div class="budget-result-body" v-else>
      <strong v-if="index" style="margin-right: 10px;">探索词{{index}}</strong> 没有相关数据
    </div>
  </el-card>
</template>

<script>
import chart from '@/components/chart/index';
import getAsinLink from '@/lib/getAsinLink';

export default {
  props: {
    data: Object,
    index: Number,
  },
  components: {
    chart,
  },
  computed: {
    notionalFlagClass() {
      return `national-flag national-flag-${this.data.stationCode}`;
    },
  },
  mounted() {
    this.$refs.rateBarChart.chart.on('click', (e) => {
      const data = this.data.itemRank[e.dataIndex];
      if (data.stationCode === null) {
        this.$message({
          message: '站点数据为空，无法跳转亚马逊',
          type: 'error',
        });
      } else if (data.asin === null) {
        this.$message({
          message: 'asin为空，无法跳转亚马逊',
          type: 'error',
        });
      }
      window.open(getAsinLink(data.stationCode, data.asin));
    });
  },
  data() {
    const ratePieOptions = this.getPieOptions('排名区间分布', this.data.clusterRankClusters);
    const pricePieOptions = this.getPieOptions('价格区间分布', this.data.clusterPriceClusters);
    const rateBarOptions = this.getBarOptions(this.data.itemRank);
    return {
      ratePieOptions,
      pricePieOptions,
      rateBarOptions,
    };
  },
  methods: {
    getPieOptions(title, data) {
      const seriesData = [];
      data.forEach((item) => {
        seriesData.push({
          name: item.range,
          value: item.percent.replace('%', ''),
        });
      });
      return {
        title: {
          text: title,
          left: 'center',
        },
        tooltip: {
          formatter: "{b} : {c} ({d}%)",
        },
        series: [
          {
            type:'pie',
            radius: '55%',
            center: ['50%', '50%'],
            selectedMode:'single',
            data: seriesData,
          },
        ],
      };
    },
    getBarOptions(data) {
      const xData = [];
      const seriesData = [];
      data.forEach((item, index) => {
        xData.push(item.value || index);
        seriesData.push(item.count || index);
      });
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: xData,
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
    }
  }
};
</script>

<style lang="less">
.budget-result {
  margin: 0 20px 20px;
  overflow: visible;
  &.first-result {
    margin: 0 0 80px;
    &:after {
      background: #ccc;
      height: 3px;
      overflow: hidden;
      content: ' ';
      position: relative;
      top: 45px;
      display: block;
    }
  }
  .notional-flag {
    margin-right: 30px;
  }
  &-body {
    display: flex;
    .chart {
      flex: 1;
      margin: 0 10px;
      min-height: 300px;
      line-height: 300px;
      text-align: center;
      font-size: 18px;
      font-weight: 900;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
