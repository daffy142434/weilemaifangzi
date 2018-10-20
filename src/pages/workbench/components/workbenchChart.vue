<template lang="html">
  <div class="workbench-chart-wrap">
    <div class="workbench-title"><span>{{title}}</span></div>
    <el-radio-group v-model="active" size="mini" @change="handleChange">
      <el-radio-button v-for="stationCode in stationCodeList" :label="stationCode.label" :key="stationCode.label">{{stationCode.text}}</el-radio-button>
    </el-radio-group>
    <line-chart ref="chart" :options="chartOption" v-loading="loading"></line-chart>
  </div>
</template>

<script>
import LineChart from '@/components/chart/lineChart';
import getChartDefaultOption from '../lib/getChartDefaultOption';

const map = {
  uk: '英',
  de: '德',
  fr: '法',
  it: '意',
  es: '西',
  us: '美',
  ca: '加',
  jp: '日'
};

export default {
  components: {
    'line-chart': LineChart,
  },
  props: {
    title: String,
    load: Function,
    receiveStationCodeList: {
      type: Array,
      required: false,
      default: () => {
        return [
          'uk',
          'de',
          'fr',
          'it',
          'es',
          'us',
          'ca',
          'jp'
        ]
      }
    }
  },
  data() {
    const stationCodeList = this.receiveStationCodeList.map((stationCode) => {
      return {
        label: stationCode,
        text: map[stationCode]
      };
    });
    stationCodeList.unshift({
      label: '',
      text: '全部'
    })
    return {
      active: '',
      loading: false,
      stationCodeList,
      chartOption: getChartDefaultOption()
    };
  },
  created() {
    if (typeof this.active === 'string') {
      this.loadData(this.active);
    }
  },
  methods: {
    handleChange(v) {
      this.loadData(v);
    },
    loadData(v) {
      if (this.load) {
        this.loading = true;
        this.load(v).then((option) => {
          this.loading = false;
          this.chartOption = option;
          setTimeout(() => {
            this.$refs.chart.render();
          });
        }).catch(() => {
          this.loading = false;
        });
      }
    }
  }
}
</script>

<style lang="css">
</style>
