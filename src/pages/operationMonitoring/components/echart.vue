<template lang="html">
  <div ref="chart1" class="chart"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/gauge';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
let option = {
    title: {
        text: '北美电商选品分析进程',
        left: 'center',
        bottom: 100,
        textStyle: {
            color: '#555'
        },
        z: 200
    },
    tooltip : {
        formatter: "{a} <br/>{c} {b}"
    },
    toolbox: {
        show: true,
        feature: {
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    series : [
        {
            name: '平均分析商品速率',
            type: 'gauge',
            z: 3,
            min: 0,
            max: 1000,
            splitNumber: 10,
            radius: '50%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222'
            },
            title : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic'
            },
            detail : {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                // formatter: function (value) {
                //     value = (value + '').split('.');
                //     value.length < 2 && (value.push('00'));
                //     return ('00' + value[0]).slice(-2)
                //         + '.' + (value[1] + '00').slice(0, 2);
                // },
                fontWeight: 'bolder',
                borderRadius: 3,
                backgroundColor: '#444',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 100,
                color: '#eee',
                rich: {}
            },
            data:[{value: 40, name: '平均分析商品速率 单位:个'}]
        },
        {
            name: '等待分析商品队列数',
            type: 'gauge',
            center: ['20%', '55%'],    // 默认全局居中
            radius: '35%',
            min:0,
            max:2200,
            endAngle:45,
            splitNumber:10,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                length:12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length:20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5
            },
            title: {
                offsetCenter: [0, '-30%'],       // x, y，单位px
            },
            detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
            },
            data:[{value: 50, name: '等待分析商品队列数'}]
        },
        {
            name: '命中商品迭代模型',
            type: 'gauge',
            center: ['77%', '50%'],    // 默认全局居中
            radius: '25%',
            min: 0,
            max: 2,
            startAngle: 135,
            endAngle: 45,
            splitNumber: 2,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 5,
                length: 10,        // 属性length控制线长
                lineStyle: {        // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                distance:10,
                formatter:function(v,i){
                    switch (v + '') {
                        case '0' : return 'H';
                        case '1' : return '命中商品迭代模型';
                        case '2' : return 'L';
                    }
                }

            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:2
            },
            title : {
                show: false
            },
            detail : {
                show: false
            },
            data:[{value: 1.5, name: 'Goods'}]
        },
        {
            name: '命中销量预测模型',
            type: 'gauge',
            center : ['77%', '50%'],    // 默认全局居中
            radius : '25%',
            min: 0,
            max: 2,
            startAngle: 315,
            endAngle: 225,
            splitNumber: 2,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                show: false
            },
            axisLabel: {
                distance:10,
                formatter:function(v,i){
                    switch (v + '') {
                        case '0' : return 'H';
                        case '1' : return '命中销量预测模型';
                        case '2' : return 'L';
                    }
                }
            },
            splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:2
            },
            title: {
                show: false
            },
            detail: {
                show: false
            },
            data:[{value: 1, name: 'Sales'}]
        }
    ]
};
export default {
  
  data() {
    return {
      option:Object.assign({},option),
      chart1:""
    }
  },
  props:['title','data'],
  components:{
    
  },
  mounted() {
    this.chart1=echarts.init(this.$refs.chart1);
    option.title.text=this.title;
    this.chart1.setOption(option);
    // window.addEventListener("resize", this.$refs.chart.resize);
    // this.handleRandom();
    
  },
  methods: {
    handleRandom(data){
        option.title.text=this.title;
        option.series[0].data[0].value = data[1];
        option.series[1].data[0].value = data[0];
        option.series[2].data[0].value = data[2];
        option.series[3].data[0].value = data[3];
        this.chart1.setOption(option,true);
    }
    
  }
}
</script>

<style lang="less" scoped>
  .chart{
    min-height: 800px;
    max-width: 1100px;
  }
</style>
