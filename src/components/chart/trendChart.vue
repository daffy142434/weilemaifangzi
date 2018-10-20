<template lang="html">
  <div class="trend-chart" v-loading="loading">
    <line-chart ref="chart" :options="options"></line-chart>
  </div>
</template>

<script>
import extend from 'extend';
import lineChart from '@/components/chart/lineChart';

const Y_AXIS_SIDE = {
  LEFT: 'left',
  RIGHT: 'right',
};

export default {
  props: ['id', 'shopId', 'title', 'sku', 'data', 'transferData'],
  components: {
    'line-chart': lineChart
  },
  mounted() {
    this.$emit('createTrend', {
      id: this.id,
      shopId: this.shopId,
      sku: this.sku,
      transferData: this.transferData,
      vm: this
    });
    this.$refs.chart.chart.on('legendselectchanged', (e) => {
      const yAxisName = this.getYAxisNameByListName(e.name);
      const value = e.selected[e.name];
      let reRender;
      this.data.data.map((d, index) => {
        if (index < 1) {
          return;
        }
        if (d.yAxis.position && d.yAxis.position === Y_AXIS_SIDE.LEFT) {
          return;
        }
        if (value && yAxisName === d.yAxis.name) {
          reRender = true;
          this.currentRightYAxis = d.yAxis.name;
        }
      });
      if (reRender) {
        setTimeout(() => {
          // this.render();
        });
      }
    });
  },
  data() {
    return {
      loading: false,
      options: {},
      leftYAxis: [],
      rightYAxis: [],
      currentLeftYAxis: null,
      currentRightYAxis: null
    }
  },
  methods: {
    render(fn) {
      let options = this.getDefaultOptions();
      let passYAxisCount = 0;
      const legendData = [];
      const legendSelected = {};

      if (fn) {
        this.callback = fn;
      }

      const data = extend(true, {}, this.data);
      options.xAxis[0].data = data.xAxis;
      data.data.map((d, yAxisIndex) => {
        let yAxisSide;

        if (!d.yAxis.position) {
          switch(yAxisIndex) {
            case 0:
              yAxisSide = Y_AXIS_SIDE.LEFT;
              break;
            default:
              yAxisSide = Y_AXIS_SIDE.RIGHT;
          }
        } else {
          yAxisSide = d.yAxis.position;
        }
        if (!this.currentLeftYAxis && yAxisSide === Y_AXIS_SIDE.LEFT) {
          this.currentLeftYAxis = d.yAxis.name;
        }
        if (!this.currentRightYAxis && yAxisSide === Y_AXIS_SIDE.RIGHT) {
          this.currentRightYAxis = d.yAxis.name
        }
        options.yAxis.push(d.yAxis);
        if (this.checkCurrentYAxis(yAxisSide, d.yAxis.name)) {
        } else {
          passYAxisCount++;
        }
        d.lists.map((list) => {
          const legendItem = {
          };
          legendItem.name = list.name;
          list.yAxisIndex = yAxisIndex; // - passYAxisCount;
          if (!this.checkCurrentYAxis(yAxisSide, d.yAxis.name)) {
            // list.data = [];
            legendSelected[list.name] = false;
          } else {
            legendSelected[list.name] = true;
          }
          options.series.push(list);
          legendData.push(legendItem);
        });
      });
      if (this.callback) {
        try {
          options.legend.data = legendData;
          options.legend.selected = legendSelected;
          options = this.callback(options);
        } catch(e) {
        }
      }
      this.options = options;
      setTimeout(() => {
        this.$refs.chart.render();
      });
    },
    getYAxisNameByListName(name) {
      let yAxisName;

      this.data.data.map((d) => {
        d.lists.map((list) => {
          if (list.name === name) {
            yAxisName = d.yAxis.name;
          }
        });
      });

      return yAxisName;
    },
    checkCurrentYAxis(yAxisSide, name) {
      if (yAxisSide === Y_AXIS_SIDE.RIGHT && this.currentRightYAxis === name) {
        return true;
      } else if (yAxisSide === Y_AXIS_SIDE.LEFT && this.currentLeftYAxis === name) {
        return true;
      }
      return false;
    },
    getDefaultOptions() {
      return {
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data:[]
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : []
          }
        ],
        yAxis : [],
        series : []
      }
    }
  }
}
</script>

<style lang="css">
</style>
