export default function getChartDefaultOption() {
  return {
    height: 200,
    tooltip : {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : []
      }
    ],
    yAxis : [{type: 'value'}],
    series : [{
      type: 'line',
      itemStyle: {
        normal: {}
      },
      lineStyle: {
        normal: {}
      },
      data: []
    }]
  }
}
