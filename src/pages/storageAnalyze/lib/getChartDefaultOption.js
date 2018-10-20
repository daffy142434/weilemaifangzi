export default function getChartDefaultOption(chartType) {
  const base = {
    title : {
      text: '',
    },
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        // boundaryGap : false,
        data : []
      }
    ],
    yAxis : [{type: 'value'}],
  };

  // 货值分布
  if(chartType == '1') {
    return Object.assign(base, {
      series : [
        {name: '货本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
        {name: '流转成本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
      ]
    });
  // 库存件数分布
  }else if(chartType == '2') {
    return Object.assign(base, {
      series : [
        {name: '总件数', type: 'bar', barWidth : 45, data: []}, 
      ]
    });
  // 当月货物特殊状态分布
  }else if(chartType == '3') {
    return Object.assign(base, {
      series : [
        {name: '客户损毁总货本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
        {name: '销毁核销的总货本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
        {name: '差项核销总货本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
        {name: '在途锁定总货本', type: 'bar', barWidth : 45, stack: '成本', data: []}, 
      ]
    });
  }
}
