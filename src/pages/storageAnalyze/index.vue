<template lang="html">
  <div>
    <div class="page-title">
      库存报告
    </div>
    <div v-show="activeName=='tableInfo'" class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="仓库">
          <storage-select v-model="searchData.storageId"></storage-select>
        </el-form-item>
        <el-form-item label="本地SKU">
          <local-sku-select v-model="searchData.sku"></local-sku-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-tabs type="border-card" :active-name="activeName" @tab-click="handleTabsChange">
      <el-tab-pane label="概览" name="chartInfo">
        <div class="workbench-chart-list">
          <storage-analyze-chart
            title="可售商品货值分布"
            chartType="1"
            :chartData="goodsValueDistribution"
            :totalMoney = "totalMoney"
          ></storage-analyze-chart>
        </div>
        <div class="workbench-chart-list">
          <storage-analyze-chart
            title="可售商品库存件数分布"
            chartType="2"
            :chartData="stocksNumberDistribution"
            :totalMoney = "totalMoney"
          ></storage-analyze-chart>
        </div>
        <div class="workbench-chart-list">
          <storage-analyze-chart
            title="当月货物特殊状态分布"
            chartType="3"
            :chartData="goodsSpecialStateDistribution"
            :totalMoney = "totalMoney"
          ></storage-analyze-chart>
        </div>
      </el-tab-pane>
      <el-tab-pane label="明细" name="tableInfo">
        <div class="table-info-title">
          <el-button type="success" size="small" style="margin-right:20px;" @click="exportDetail">导出库存报告明细</el-button>
          <span>合计可售总成本：{{storageGoods.currentCostAmount||0}}</span>
          <span>合计可售总流转成本：{{storageGoods.shippingPriceAll||0}}</span>
          <span>合计可售作总件数：{{storageGoods.saleAvailableQuantity||0}}</span>
          <span>平均货单价：{{storageGoods.averagePrice||0}}</span>
          <span>合计在途总成本：{{storageGoods.wayAmount||0}}</span>
        </div>
        <el-table
          v-loading.body="tableLoading"
          ref="detailTable"
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column
            prop="sku"
            label="图片/SKU/仓库"
            min-width="180"
            class-name="sku-column"
            fixed="left"
            align="center"
          >
            <template slot-scope="scope">
              <el-popover
                ref="popover1"
                placement="right-start"
                title=""
                width="650"
                border
                trigger="click">
                <img :src="scope.row.mainImg" class="big-pic"></img>
              </el-popover>
              <img :src="scope.row.mainImg" v-popover:popover1></img>
              <div>
                {{scope.row.sku}}
              </div>
              <div>
                {{scope.row.storageName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="可售总成本"
            prop="saleAvailableAmount"
            label-class-name="sale-class-title"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="可售总件数"
            prop="saleAvailableQuantity"
            label-class-name="sale-class-title"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="平均成本"
            prop="averageCost"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="近30天销售数"
            prop="salesCancellationQuantity"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="可售天数"
            prop="availableDays"
            width="80"
          >
          </el-table-column>
          <el-table-column
            label="累计毛利润"
            prop="saleCancellationMaoriAmount"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="平均毛利润"
            prop="averageMaori"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="平均毛利率"
            :formatter="formatPercente"
            prop="averageMaoriRate"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="货本 | 件数"
            prop="companyName"
            min-width="200"
          >
            <template slot-scope="scope">
              <div>
                近30天客户损毁：{{scope.row.customerDamageAmount}} | {{scope.row.customerDamageQuantity}}
              </div>
              <div>
                近30天差项核销：{{scope.row.differenceCancellationAmount}} | {{scope.row.differenceCancellationQuantity}}
              </div>
              <div>
                近30天销毁核销：{{scope.row.destructionCancellationAmount}} | {{scope.row.destructionCancellationQuantity}}
              </div>
              <div>
                近30天在途锁定：{{scope.row.wayAmount}} | {{scope.row.wayQuantity}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.searchData.pageSize"
            :current-page.sync="searchData.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.totalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="display:none">
      <el-tooltip ref="toolTip" class="tooltip tooltip-wrap" effect="dark" content="包含在途锁定" placement="top">
        <i class="el-icon-question"></i>
      </el-tooltip>
      <el-tooltip ref="toolTip" class="tooltip tooltip-wrap" effect="dark" content="包含在途锁定" placement="top">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
  import StorageAnalyze from './services';
  import LocalSkuSelect from '@/components/local-sku-select';
  import StorageSelect from '@/components/storage-select';
  import StorageAnalyzeChart from './components/storageAnalyzeChart';

  const storageAnalyze = new StorageAnalyze();

  export default {
    components: {
      'local-sku-select': LocalSkuSelect,
      'storage-select': StorageSelect,
      'storage-analyze-chart': StorageAnalyzeChart,
    },
    data() {
      return {
        totalMoney: {
          currentCostAmountAll: 0,
          shippingPriceCnyAll: 0,
          costPriceCnyAll: 0,
          damageCurrentCostAmountAll: 0,
          destructionCurrentCostAmountAll: 0,
          differenceCurrentCostAmountAll: 0,
          wayCurrentCostAmountAll: 0,
        },
        // 货值分布
        goodsValueDistribution: [],
        // 库存件数分布
        stocksNumberDistribution: [],
        // 当月货物特殊状态分布
        goodsSpecialStateDistribution: [],
        tableLoading: false,
        tableData: [],
        activeName: 'chartInfo',
        shops: [],
        searchData: {
          storageId: '',
          sku: '',
          pageSize: 10,
          pageNumber: 1,
        },
        totalRecord: 0,
        storageGoods:{
          currentCostAmount:0,
          shippingPriceAll:0,
          saleAvailableQuantity:0,
          averagePrice:0,
          wayAmount:0
        }
      }
    },
    computed: {
    },
    beforeCreate(){
      
    },
    created() {
      this.onSearch();
    },
    mounted(){
      
    },
    methods: {
      exportDetail(){
        window.open("/stock_report/export_stock_detail");
      },
      formatPercente(row, col, value) {
        return value!==null ? (value?(value * 100).toFixed(2) + ' %':0) : '--';
      },
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        if(this.activeName == 'tableInfo') {
          this.beforeSearch();
        }
      },
      handleCurrentChange(val) {
        this.searchData.pageNumber = val;
        if(this.activeName == 'tableInfo' ) {
          this.onSearch();
        }
      },
      handleTabsChange(tab) {
        this.activeName = tab.name;
        if(this.activeName == 'chartInfo' || (this.searchData.storageId || this.searchData.sku)) {
          this.onSearch();
          
        }
        if(this.activeName == 'tableInfo'){
          this.$nextTick(()=>{
            setTimeout(()=>{
              document.getElementsByClassName("sale-class-title")[1].appendChild(document.getElementsByClassName("tooltip-wrap")[0]);
              document.getElementsByClassName("sale-class-title")[3].appendChild(document.getElementsByClassName("tooltip-wrap")[1]);
            },100)
          })
        }
        
      },
      detailSummary(){
        storageAnalyze.detailSummary(this.searchData).then((res)=>{
          this.storageGoods=res.data.data;
        })
      },
      beforeSearch(){
        this.searchData.pageNumber=1;
        this.onSearch();
      },
      onSearch() {
        // if(this.activeName == 'tableInfo' && (!this.searchData.storageId && !this.searchData.sku)) {
        //   this.$message({
        //     showClose: true,
        //     message: '请至少选择仓库、SKU其中一项进行查询',
        //     type: 'warning'
        //   });
        //   return;
        // }
        if(this.activeName == 'tableInfo') {
          this.detailSummary();
          this.tableLoading = true;
          storageAnalyze.getDetailList(this.searchData).then((res) => {
            const data = res.data.data.data || [];
            const totalRecord = res.data.data.totalRecord;
  
            this.tableData = data;
            this.totalRecord = totalRecord;
            this.tableLoading = false;
          }).catch(() => {
            this.tableLoading = false;
          });
        }else if(this.activeName == 'chartInfo') {
          storageAnalyze.getOverview().then((res) => {
            const data = res.data.data || {};
            // 货值分布
            this.goodsValueDistribution = data.goodsValueDistribution || [];
            // 库存件数分布
            this.stocksNumberDistribution = data.stocksNumberDistribution || [];
            // 当月货物特殊状态分布
            this.goodsSpecialStateDistribution = data.goodsSpecialStateDistribution || []; 
            for(let key of Object.keys(this.totalMoney)) {
              this.totalMoney[key] = data[key];
            }          
          })
        }
      },
    }
  }
</script>
<style lang="less">
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
  .table-info-title{
    margin: 10px 0;
    font-weight: bold;
    >span{
      display:inline-block;
      margin-right: 20px;
    }
  }
</style>
<style scoped>
.tooltip{
  margin-left:5px;
}
</style>
