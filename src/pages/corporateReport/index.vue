<template lang="html">
  <div class="corporate-report-index">
    <div class="page-title">
      公司经营报告
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" label-width="100px">
        <el-form-item label="店铺">
          <el-input placeholder="店铺" v-model="searchData.shopName"></el-input>
        </el-form-item>
        <el-form-item label="公司" v-loading="loading">
          <el-select v-model="searchData.companyId" placeholder="请选择">
            <el-option
              v-for="item in companys"
              :key="item.id"
              :label="item.companyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="searchData.currencyCode" clearable placeholder="请选择">
            <el-option
              v-for="item in currency"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-checkbox v-model="searchData.reportFlag" true-label="1" false-label="0">过滤未结案的报告</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
        
      </div>
    </div>
    <div class="export">
      <el-button type="primary" @click="exportTable" size="small">导出报表</el-button>
      <el-button type="primary" @click="count" size="small">计算应收款</el-button>
    </div>
    <div v-if="$store.state.powers.includes('corporate_performance_data:list')">
      <el-table
        v-loading="tableLoading"
        :data="data"
        border
        class="table-index"
        :cell-class-name="setCellClassName"
        :header-cell-class-name="setCellClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="店铺名"
          width="140"
          align="center"
          
        >
          <template slot-scope="scope">
            <div><el-tag type="warning" size="small" v-if="scope.row.calibrationFlag">已校准</el-tag><el-tag type="danger" size="small" v-else>校准有误</el-tag></div>
            <div>{{scope.row.shopName}}</div>
            <!-- <div><el-button type="text" @click="showHistoryDialog(scope.row)">历史账单</el-button></div> -->
            <div><el-button v-if="$store.state.powers.includes('corporate_performance_data:show')" type="text" @click="showDetailDialog(scope.row)">查看明细</el-button></div>
            <div><el-button type="text" @click="exportList(scope.row)">导出清单</el-button></div>
          </template>
        </el-table-column>
        <el-table-column
          label="报告周期"
          width="110"
          align="center"
        >
          <template slot-scope="props">
            <!-- <div v-html="props.row.reportRangeText"></div> -->
            <div style="color:#acacac;" v-date="props.row.startDate"></div>
            <div style="color:#67C23A;" v-if="props.row.endDate" v-date="props.row.endDate"></div><div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesIncome}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="广告成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.advertisementCost}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.advertisementCostCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="退货金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.returnAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.returnAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="其他"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.otherAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.otherAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售毛利"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.maoriAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="货物成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.costAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="头程成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.shippingAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="初期费用"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.brushesAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="回款金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.reimbursementAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.reimbursementAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="上期尾款"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.remittanceAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.remittanceAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesIncome}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="预留金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.reservedAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.reservedAmountCny}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100]"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <detail-dialog ref="detailDialog"></detail-dialog>
    <!-- <history-dialog ref="historyDialog" @showDetail="showDetailDialog" @set-classname="setCellClassName" @export-list="exportList"></history-dialog> -->
    <el-dialog
      title="计算应收款"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" label-width="100px">
        <el-form-item label="回款总金额">
          <span>{{reimbursementAmountCount}}</span>
        </el-form-item>
        <el-form-item label="期初应收金额"
          prop="firstCount"
          :rules="[{ required:false,validator:(rules, value, callback)=>{
            if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(firstCount)) {
              return callback('只能为最多保留两位小数的正数');
            }
          }}]"
        >
          <el-input v-model="firstCount" type="number" min="0" placeholder="请输入所选财报同币种金额" @input="handleCount"></el-input>
        </el-form-item>
        <el-form-item label="期末应收金额">
          <span>{{countResult}}</span>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import CorporateReport from './services';
import Member from '@/pages/member/services';
import Shops from '@/pages/shops/services';
import DetailDialog from './components/detailDialog';
// import HistoryDialog from './components/historyDialog';
import queryString from 'query-string';
import constData from '@/lib/const';

const corporateReport = new CorporateReport();
const member = new Member();
const shops = new Shops();

export default {
  data() {
    
    return {
      loading: true,
      tableLoading: true,
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 50,
      companys: [],
      shopLoading: false,
      shopDisabled: true,
      shopSelectPlaceholder: '请选择',
      shops: [],
      detailLoading: false,
      searchData: {
        companyId: '',
        shopName: '',
        currencyCode:"",
        reportFlag:"1"
      },
      data: [],
      income: {},
      expenses: {},
      transfer: {},
      salesTax: {},
      currency:constData.CURRENCY,
      countItems:[],
      dialogVisible:false,
      firstCount:"",
      countResult:0,
      reimbursementAmountCount:0,
      remittanceAmountCount:0,
      reservedAmountCount:0,
      
    }
  },
  created(){
    member.getCompanyListByCurrentMember().then((response) => {
      if(response.data.code == 200) {
        const companys = response.data.data;
        companys.unshift({id: '', companyName: '请选择'});
        this.companys = companys;
      }
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
    this.onSearch();
  },
  components: {
    'detail-dialog': DetailDialog,
    // 'history-dialog': HistoryDialog
  },
  methods: {
    handleSelectionChange(val){
      this.countItems=val;
    },
    count(){
      if(!this.countItems.length){
        this.$message({
          message: "请先选择报表",
          type: 'warning'
        });
        return;
      }
      let flagArray=[];
      
      for(let i=0;i<this.countItems.length;i++){
        flagArray.push(this.countItems[i].currencyCode);
      }
      if(new Set(flagArray).size>1){
        this.$message({
          message: "所选财报并非同币种",
          type: 'warning'
        });
        return;
      }
      
      this.firstCount="";

      this.reimbursementAmountCount=0;
      this.remittanceAmountCount=0;
      this.reservedAmountCount=0;
      for(let i=0;i<this.countItems.length;i++){
        this.reimbursementAmountCount+=parseFloat(this.countItems[i].reimbursementAmount);
        this.remittanceAmountCount+=parseFloat(this.countItems[i].remittanceAmount);
        this.reservedAmountCount+=parseFloat(this.countItems[i].reservedAmount);
      }
      this.reimbursementAmountCount=this.reimbursementAmountCount.toFixed(2);
      this.remittanceAmountCount=this.remittanceAmountCount.toFixed(2);
      this.reservedAmountCount=this.reservedAmountCount.toFixed(2);
      this.handleCount();
      this.dialogVisible=true;
    },
    handleCount(){
      
      //期末应收金额 = -1*（-1*期初应收金额+所选中财报的“上期尾款”合计值+所选中财报的“预留金额”）
      this.countResult=-1*(-1*parseFloat(this.firstCount || 0)+parseFloat(this.remittanceAmountCount)+parseFloat(this.reservedAmountCount));
      this.countResult=this.countResult.toFixed(2);
    },
    exportTable(){
      window.open("/data_analysis/export");
    },
    exportList(row){
      const url=queryString.stringify({financialEventGroupId:row.financialEventGroupId,shopId:row.shopId});
      window.open("/data_analysis/export_detail"+"?"+url);
    },
    setCellClassName({row, column, rowIndex, columnIndex}){
      let num=3;
      if(columnIndex===num){
        return 'column1 column12';
      }else if(columnIndex>=num+1&&columnIndex<=num+4){
        return 'column1';
      }else if(columnIndex===num+5){
        return 'column2 column22';
      }else if(columnIndex>=num+6&&columnIndex<=num+9){
        return 'column2';
      }else if(columnIndex===num+10){
        return 'column3 column32';
      }else if(columnIndex>=num+11&&columnIndex<=num+13){
        return 'column3';
      }
      return '';
      
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.onSearch();
    },
    showDetailDialog(data) {
      const {shopId, financialEventGroupId} = data;
      this.$refs.detailDialog.show(shopId, financialEventGroupId);
    },
    showHistoryDialog(data) {
      this.$refs.historyDialog.show(data);
    },
    handleReset() {
      this.searchData = {
        companyId: '',
        shopName: '',
        currencyCode:"",
        reportFlag:"1"
      };
      this.onSearch();
    },
    beforeSearch(){
      this.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      const {companyId,shopName,currencyCode,reportFlag} = this.searchData;
      const {pageNumber, pageSize} = this;
      let p;

      this.tableLoading = true;
      p = corporateReport.getNewReportList({companyId,shopName,currencyCode, reportFlag,pageNumber, pageSize});
      p.then((res) => {
        const data = res.data.data.data || [];
        this.data=data;
        // this.data = data.map(corporateReport.formatData);
        this.totalRecord = res.data.data.totalRecord;
        this.tableLoading = false;
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    toDateTime(row, column, cellValue) {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  }
}
</script>

<style lang="less">
.corporate-report-index .space{
  white-space: nowrap;
}
.corporate-report-original {
  &-num {
    font-size: 18px;
    font-weight: 900;
  }
}
.corporate-report-index .table-index{
  th.column1{
    background-color: #5f7f3f;
    color: #fff;
  }
  td.column1{
    background-color: #cbdfb8;
  }
  
  th.column2{
    background-color: #ba5f29;
    color: #fff;
  }
  td.column2{
    background-color: #ecb28b;
  }
  th.column3{
    background-color: #b88f2f;
    color: #fff;
  }
  td.column3{
    background-color: #fad977;
  }
  .column12,.column22,.column32{
    color: #409eff;
    font-weight: bold;
  }
  td.column12{
    background-color: #b8e192;
  }
  td.column22{
    background-color: #e9a273;
  }
  td.column32{
    background-color: #f4c63f;
  }
  
}
.corporate-report-index{
  .el-table--enable-row-hover .el-table__body tr:hover{
    &>td{
      background-color: initial;
    }
    &>td.column1{
      background-color: #cbdfb8;
    }
    &>td.column2{
      background-color: #ecb28b;
    }
    &>td.column3{
      background-color: #fad977;
    }
    &>td.column12{
      background-color: #b8e192;
    }
    &>td.column22{
      background-color: #e9a273;
    }
    &>td.column32{
      background-color: #f4c63f;
    }
  }
}
</style>
<style scoped>
.export{
  margin-bottom: 10px;
}
</style>
