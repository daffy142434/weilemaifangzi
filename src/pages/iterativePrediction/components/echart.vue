<template lang="html">
  <div ref="chart" class="chart"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/radar';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';

let option = {
    title: {
        text: '',
        left:'center'
    },
    tooltip: {
        trigger: 'item',
        backgroundColor : 'rgba(0,0,250,0.2)'
    },
    legend: {
        bottom: 10,
        data: ['01.15','01.30','02.15','02.30','03.15','03.30','04.15','04.30','05.15']
    },
    visualMap: {
        top: 'middle',
        max:400,
        right: -10,
        color: ['red','yellow' ],
        calculable: true
    },
    radar: {
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
           }
        },
        indicator: [
           
        ]
    },
    series: [{
        name: '',
        type: 'radar',
        symbol: 'none',
        lineStyle: {
            width: 1
        },
        emphasis: {
            areaStyle: {
                color: 'rgba(0,250,0,0.3)'
            }
        },
        data : [
            
        ],
        
    }]
};
export default {
  
  data() {
    return {
      option:option,
      chart:""
    }
  },
  props:['title','data',"subtext","indicator"],
  components:{
    
  },
  mounted() {
    this.chart=echarts.init(this.$refs.chart);
    this.option.title.text=this.title;
    this.option.title.subtext=this.subtext;
    this.option.series[0].data=this.data;
    this.option.radar.indicator=this.indicator;
    this.chart.setOption(this.option);
  },
  methods: {
    
    
  }
}
</script>

<style lang="less" scoped>
  .chart{
    min-height: 800px;
    margin-top:50px;
  }
</style>
