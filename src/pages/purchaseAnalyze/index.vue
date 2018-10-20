<template lang="html">
  <div class="purchass-analyze-index">
    <div class="page-title">
      采购报表
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        ref="abc"
        title="采购单趋势(横轴以采购单时间为基准)"
        chartType="purchaseOrderTrend"
        :chartData="purchaseOrderTrend"
        :totalMoney="totalMoney"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="出货趋势(横轴以采购单时间为基准)"
        chartType="deliveryTrend"
        :chartData="deliveryTrend"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="应付款趋势(横轴以结尾款时间为基准)"
        chartType="restAmountByPlanSettleDateTrend"
        :chartData="restAmountByPlanSettleDateTrend"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="议价能力趋势(横轴以采购单时间为基准)"
        chartType="waitSettleAmountTrend"
        :chartData="waitSettleAmountTrend"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="未出货SKU数量(横轴以采购单时间为基准)"
        chartType="waitDeliveryNum"
        :chartData="waitDeliveryNum"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="未出货SKU货值(横轴以采购单时间为基准)"
        chartType="waitDeliveryAmount"
        :chartData="waitDeliveryAmount"
      ></purchase-analyze-chart>
    </div>
    <div class="workbench-chart-list">
      <purchase-analyze-chart
        title="平均货单价(横轴以采购单时间为基准)"
        chartType="purchaseUnitPrice"
        :chartData="purchaseUnitPrice"
      ></purchase-analyze-chart>
    </div>
  </div>
</template>
<script>
  import PurchaseAnalyze from './services';
  import PurchaseAnalyzeChart from './components/purchaseAnalyzeChart';

  const purchaseAnalyze = new PurchaseAnalyze();

  export default {
    components: {
      'purchase-analyze-chart': PurchaseAnalyzeChart,
    },
    data() {
      return {
        totalMoney: {
          // 累计采购单金额
          purchaseAmountAll: 0,
          // 累计未结清金额
          restAmountAll: 0,
          // 累计结清金额
          settledAmountAll: 0,
        },
        // 未出货SKU数量报表数据
        waitDeliveryNum: [],
        // 未出货SKU货值报表数据
        waitDeliveryAmount: [],
        // 采购单趋势报表数据
        purchaseOrderTrend:[],
        // 出货趋势报表数据
        deliveryTrend: [],
        // 应付款趋势报表数据
        restAmountByPlanSettleDateTrend: [],
        // 议价能力趋势报表数据
        waitSettleAmountTrend: [],
        // 平均货单价
        purchaseUnitPrice: [],
        tableLoading: false,
        tableData: [],
        shops: [],
        searchData: {
          storageId: '',
          sku: '',
          pageSize: 10,
          pageNumber: 1,
        },
        totalRecord: 0,
      }
    },
    computed: {
    },
    beforeCreate(){
      
    },
    created() {
      this.onSearch();
      
    },
    methods: {
      aaa(a,b,c,d){
        debugger;
      },
      formatPercente(row, col, value) {
        return value ? ((value * 100).toFixed(2) + ' %') : '';
      },
      onSearch() {
        this.purchaseOrderTrend = [];
        this.deliveryTrend = [];
        this.restAmountByPlanSettleDateTrend = [];
        this.waitSettleAmountTrend = [];
        this.purchaseUnitPrice = [];
        purchaseAnalyze.getOrders().then((res) => {
          const data = res.data.data || {};
          for(let item of data) {
            this.totalMoney.purchaseAmountAll = this.totalMoney.purchaseAmountAll + item.restAmount + item.settledAmount;
            this.totalMoney.restAmountAll = this.totalMoney.restAmountAll + item.restAmount;
            this.totalMoney.settledAmountAll = this.totalMoney.settledAmountAll + item.settledAmount;
            this.purchaseOrderTrend.push({monthStr: item.monthStr, restAmount: item.restAmount, settledAmount: item.settledAmount});
            this.deliveryTrend.push({monthStr: item.monthStr, waitDeliveryAmount: item.waitDeliveryAmount, deliveredAmount: item.deliveredAmount});
            
            this.waitSettleAmountTrend.push({monthStr: item.monthStr, waitSettleAmount: item.waitSettleAmount});
            this.purchaseUnitPrice.push({monthStr: item.monthStr, purchaseUnitPrice: item.purchaseUnitPrice});
          }   
          this.totalMoney.purchaseAmountAll=this.totalMoney.purchaseAmountAll.toFixed(2);  
          this.totalMoney.restAmountAll=this.totalMoney.restAmountAll.toFixed(2);
          this.totalMoney.settledAmountAll=this.totalMoney.settledAmountAll.toFixed(2);
        })
        purchaseAnalyze.getSkus().then((res) => {
          const data = res.data.data || {};
          for(let item of data) {
            this.waitDeliveryNum.push({sku: item.sku, waitDeliveryNum: item.waitDeliveryNum});
            this.waitDeliveryAmount.push({sku: item.sku, waitDeliveryAmount: item.waitDeliveryAmount});
          }
          // 用户给chart插件判断loading状态
          this.waitDeliveryNum.push(null);
          this.waitDeliveryAmount.push(null);
        });
        purchaseAnalyze.ordersPlanSettle().then((res)=>{
          const data = res.data.data || {};
          for(let item of data) {
            this.restAmountByPlanSettleDateTrend.push({monthStr: item.monthStr, restAmountByPlanSettleDate: item.restAmountByPlanSettleDate});
          }
        });
      },
    }
  }
</script>
<style lang="less">
.purchass-analyze-index{
  .workbench-title {
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    border-bottom: #ddd 2px solid;
    color: #666;
    margin-bottom: 20px;
    span {
      display: inline-block;
      height: 40px;
      color: #20A0FF;
      border-bottom: #20A0FF 2px solid;
    }
  }
  .workbench-list {
    padding: 10px 30px;
    display: flex;
  }
  .workbench-top {
    display: flex;
    .workbench-top-left {
      width: 70%;
      padding: 0 30px;
      &-cont {
        display: flex;
      }
    }
    .workbench-top-right {
      padding-top: 40px;
      .workbench-tag-item {
        margin-bottom: 20px;
        cursor: pointer;
      }
      .el-tag {
        height: 30px;
        font-size: 16px;
        line-height: 30px;
        text-align: right;
        margin-right: 10px;
      }
    }
  }
  .workbench-round-item {
    flex: 1;
    text-align: center;
    .workbench-num {
      cursor: pointer;
      width: 120px;
      height: 120px;
      line-height: 120px;
      border: #DDD 8px solid;
      border-radius: 50%;
      text-align: center;
      font-size: 32px;
      display: inline-block;
      &.workbench-round-primary {
        border-color: #83c9fd;
      }
      &.workbench-round-success {
        border-color: #76d6a1;
      }
      &.workbench-round-warning {
        border-color: #fdda86;
      }
      &.workbench-round-danger {
        border-color: #fd9797;
      }
    }
    em {
      font-style: normal;
      display: block;
      margin-top: 10px;
    }
  }
  .workbench-split {
    background: #EEE;
    height: 1px;
    overflow: hidden;
    margin: 30px 0;
  }
  .workbench-chart-list {
    display: flex;
    .workbench-chart-wrap {
      flex: 1;
      padding: 0 30px;
      overflow: hidden;
      .chart {
        height: 300px;
      }
      .workbench-num {
        width: 200px;
        height: 200px;
        line-height: 200px;
        font-size: 72px;
        border-color: #4f6486;
        background: #344869;
        color: #fff;
      }
    }
  }
  .shop-count {
    font-size: 200px;
    text-align: center;
    color: #f35e5e;
    font-weight: 900;
    small {
      font-size: 72px;
      font-weight: 200;
    }
  }
}
</style>
