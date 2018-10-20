export default function getChartDefaultOption(chartType, $router) {
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

  // 采购单趋势
  if(chartType == 'purchaseOrderTrend') {
    return Object.assign(base, {
      series : [
        {name: '尾款金额', type: 'bar', barWidth : 45, stack: '采购单趋势', data: []}, 
        {name: '已结款金额', type: 'bar', barWidth : 45, stack: '采购单趋势', data: []}, 
      ]
    });
  // 出货趋势
  }else if(chartType == 'deliveryTrend') {
    return Object.assign(base, {
      series : [
        {name: '未出货货值', type: 'bar', barWidth : 45, stack: '出货趋势', data: []}, 
        {name: '已出货货值', type: 'bar', barWidth : 45, stack: '出货趋势', data: []}, 
      ]
    });
  // 应付款趋势
  }else if(chartType == 'restAmountByPlanSettleDateTrend') {
    return Object.assign(base, {
      series : [
        {name: '尾款金额', type: 'bar', barWidth : 45, data: []}, 
      ]
    });
  // 议价能力趋势
  }else if(chartType == 'waitSettleAmountTrend') {
    return Object.assign(base, {
      series : [
        {name: '已出货未结清金额', type: 'bar', barWidth : 45, data: []}, 
      ]
    });
  // 未出货SKU数量
  }else if(chartType == 'waitDeliveryNum') {
    return Object.assign(base, {
      series : [
        {name: '未出货数量', type: 'bar', barWidth : 45, data: []}, 
      ],
      clickFunction: (params) => {
        let sku = params.name;
        $router.push({
          name: 'purchaseManage',
          params: {
            toNewTab: 'YES',
            sku: params.name,
            settleFlag: '0',
          },
        });
      },
    });
  // 未出货SKU货值
  }else if(chartType == 'waitDeliveryAmount') {
    return Object.assign(base, {
      series : [
        {name: '未出货货值', type: 'bar', barWidth : 45, data: []}, 
      ],
      clickFunction: (params) => {
        let sku = params.name;
        $router.push({
          name: 'purchaseManage',
          params: {
            toNewTab: 'YES',
            sku: params.name,
            settleFlag: '0',
          },
        });
      },
    });
  // 平均货单价
  }else if(chartType == 'purchaseUnitPrice') {
    return Object.assign(base, {
      series : [
        {name: '平均货单价', type: 'bar', barWidth : 45, data: []}, 
      ]
    });
  }
}
