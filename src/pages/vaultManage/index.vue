<template lang="html">
  <div class="">
    <div class="page-title">
      小金库管理
    </div>
    <div class="tab-box-container" ref="boxContainer">
      <div class="tab-box-item prev" @click="prev" v-if="prevShow"><i class="el-icon-arrow-left"></i></div>
      <div class="tab-box-wrap" ref="tabBoxWrap">
        <ul class="tab-box" ref="tabBox" :style="{transform:'translateX('+transtionWidth+'px)'}">
          <li v-for="item in vaultData" :key="item.id" @click="searchData.warehouseId=searchData.warehouseId==item.id?'':item.id" :style="{'border-color':searchData.warehouseId==item.id?'#3a8ee6':'#eee'}">
            <div class="name">{{item.warehouseName}}</div>
            <div class="money">余额（{{item.warehouseBalance}}）</div>
            <div class="opera"><el-button type="text" size="small" @click="trunOver(item.id)" v-if="permissions('financial_warehouse:add')">新增交易</el-button></div>
          </li>
          
        </ul>
      </div>
      <div class="tab-box-item next" @click="next" v-if="nextShow"><i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="创建人">
              <el-input placeholder="创建人" v-model="searchData.operator"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="复核员">
              <el-input placeholder="复核员" v-model="searchData.rechechor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用途">
              <el-select v-model="searchData.transactionType">
                <el-option label="请选择" value=""></el-option>
                <el-option label="样品费" value="0"></el-option>
                <el-option label="红单成本" value="1"></el-option>
                <el-option label="翻译费" value="2"></el-option>
                <el-option label="购买资源" value="3"></el-option>
                <el-option label="其他" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="searchData.transactionStatus">
                <el-option label="请选择" value=""></el-option>
                <!-- <el-option label="删除" value="0"></el-option> -->
                <el-option label="待复核" value="1"></el-option>
                <el-option label="待出纳" value="2"></el-option>
                <el-option label="已出纳" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="流水号">
              <el-input placeholder="流水号" v-model="searchData.transactionNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              label='创建时间'
            >
              <el-date-picker
                v-model="time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDaterangeChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="permissions('financial_warehouse:list')">
            <div class="fr">
              <el-button type="text" @click="handleReset">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
            </div>
          </el-col>
        </el-row>
        
      </el-form>
      
    </div>
    
    <div v-if="permissions('financial_warehouse:list')">
      <el-table
        v-loading.body="loading"
        :data="data"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="金库名"
          prop="warehouseName"
          width=""
        >
        </el-table-column>
        <el-table-column
          label="用途"
          prop="transactionType"
          :formatter="formatTransactionType"
          width="100"
        >
        </el-table-column>
        
        <el-table-column
          label="金额"
          prop="amount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="交易编号"
          prop="transactionNo"
          width=""
        >
        </el-table-column>
        <el-table-column
          label="创建人和创建时间 复核员和复核时间"
          width="300"
        >
          <template slot-scope="props">
            <div>{{props.row.creator}} <span v-datetime="props.row.createTime"></span></div>
            <div v-if="props.row.rechechor">{{props.row.rechechor}} <span v-datetime="props.row.rechechorTime"></span></div>
          </template>
        </el-table-column>
        <el-table-column
          label="出纳员和出纳时间"
          prop="cashier"
          width=""
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.cashier}}</div>
              <div v-show="props.row.cashierTime" v-datetime="props.row.cashierTime"></div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="出纳时间"
          prop=""
          width=""
        >
        <template slot-scope="props">
          <span v-show="props.row.cashierTime" v-date="props.row.cashierTime"></span>
        </template>
        </el-table-column> -->
        <el-table-column
          label="状态"
          prop="transactionStatus"
          :formatter="formatTransactionStatus"
          width="120"
        >
        </el-table-column>
        
        <el-table-column
          label="操作"
          prop="operateNo"
          width=""
          align="center"
        >
          <template slot-scope="props">
            <div><el-button type="text" @click="rechecked(props.row.id)" v-if="props.row.transactionStatus==1 &&permissions('financial_warehouse:rechecked')">复核</el-button></div>
            <div><el-button type="text" @click="cashier(props.row.id)" v-if="props.row.transactionStatus==2 &&permissions('financial_warehouse:cashier')">出纳</el-button></div>
            <div><el-button type="text" @click="handleDelete(props.row.id)" v-if="props.row.transactionStatus<=2 &&permissions('financial_warehouse:delete')">删除</el-button></div>
            <div><el-button type="text" @click="getDetails(props.row)">查看明细</el-button></div>
          </template>
        </el-table-column>
        
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <turnover-dialog ref="turnoverDialog" @search="onSearch"></turnover-dialog>
    <detail-dialog ref="detailDialog"></detail-dialog>
  </div>
</template>

<script>

import services from './services';
import turnoverDialog from './components/turnoverDialog';
import detailDialog from './components/detailDialog';
const service = new services();

export default {
  
  data() {
    return {
      loading: false,
      totalRecord: 0,
      id:"",
      searchData: {
        pageSize: 10,
        pageNumber: 1,
        warehouseId:"",
        transactionNo:"",
        transactionStatus:"",
        transactionType:"",
        operator:"",
        rechechor:"",
        startDate:"",
        endDate:""
      },
      time:"",
      width:210,
      transtionWidth:0,
      prevShow:true,
      nextShow:true,
      vaultData:[],
      data:[],
      
    }
  },
  components:{
    turnoverDialog,
    detailDialog
  },
  mounted() {
    // this.onSearch();
    this.getVaultData();
    this.onSearch();
    setTimeout(()=>{
      this.countShow();
    },1000)
  },
  methods: {
    getDetails(row){
      this.$refs.detailDialog.show(row);
    },
    handleDelete(id){
      this.$confirm('是否删除该记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.delete({warehouseTransactionId:id}).then(res=>{
          if(res.data.code==200){
            this.$message({
              message: "删除成功",
              type: 'success'
            });
            this.onSearch();
          }
        });
      })
      
    },
    rechecked(id){
      this.$confirm('是否复核该记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.rechecked({warehouseTransactionId:id}).then(res=>{
          if(res.data.code==200){
            this.$message({
              message: "复核成功",
              type: 'success'
            });
            this.onSearch();
          }
        });
      })
      
    },
    cashier(id){
      this.$confirm('是否出纳该记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.cashier({warehouseTransactionId:id}).then(res=>{
          if(res.data.code==200){
            this.$message({
              message: "出纳成功",
              type: 'success'
            });
            this.onSearch();
            this.getVaultData();
          }
        });
      })
      
    },
    formatTransactionType(row, column, cellValue, index){
      switch(cellValue){
        case 0: return "样品费";
        case 1: return "红单成本";
        case 2: return "翻译费";
        case 3: return "购买资源";
        case 4: return "其他"; 
      }
      if(row.rechargeFlag==1){
        return "充值";
      }
    },
    formatTransactionStatus(row, column, cellValue, index){
      switch(cellValue){
        case 0: return '删除';
        case 1: return "待复核";
        case 2: return "待出纳";
        case 3: return "已出纳";
        
      }
    },
    getVaultData(){
      service.warehouseList().then(res=>{
        if(res.data.code==200){
          this.vaultData=res.data.data;
        }
      })
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch(){

      service.list(this.searchData).then(res=>{
        if(res.data.code==200){
          this.data=res.data.data.data;
          this.totalRecord=res.data.data.totalRecord;
          
          for(let j=0;j<this.data.length;j++){
            let billList=this.data[j].financialWarehouseBillList;
            let type=0;
            for(let i=0;i<billList.length;i++){
              if(billList[i].transactionType>=type){
                this.data[j].amount=billList[i].operationAmount;
                type=billList[i].transactionType;
              }
              if(billList[i].transactionType==1){
                this.data[j].operator=billList[i].operator;
                this.data[j].operationTime=billList[i].operationTime;
              }
              if(billList[i].transactionType==2){
                this.data[j].rechechor=billList[i].operator;
                this.data[j].rechechorTime=billList[i].operationTime;
              }
              if(billList[i].transactionType==3){
                this.data[j].cashier=billList[i].operator;
                this.data[j].cashierTime=billList[i].operationTime;
              }
              
            }
          }
        }
      })
    },
    prev(){
      this.transtionWidth=-this.width+this.transtionWidth;
      
      this.countShow();
    },
    next(){
      this.transtionWidth=this.width+this.transtionWidth;
      this.countShow();
    },
    countShow(){
      if(this.transtionWidth>=0){
        this.nextShow=false;
      }else{
        this.nextShow=true;
      }
      if(this.$refs.tabBox.offsetWidth+this.transtionWidth<=this.$refs.tabBoxWrap.offsetWidth){
        this.prevShow=false;
      }else{
        this.prevShow=true;
      }
      if(this.$refs.tabBox.offsetWidth<=this.$refs.tabBoxWrap.offsetWidth){
        this.nextShow=false;
        this.prevShow=false;
      }
    },
    trunOver(id){
      this.$refs.turnoverDialog.show(id);
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleReset() {
      this.searchData =  {
        pageSize: 10,
        pageNumber: 1,
        warehouseId:"",
        transactionNo:"",
        transactionStatus:"",
        transactionType:"",
        operator:"",
        rechechor:"",
        startDate:"",
        endDate:""
      };
      this.time="";
      this.searchData.startDate="";
      this.searchData.endDate="";
      this.onSearch();
    },
    handleDaterangeChange(val){
      if(!val){
        this.searchData.startDate="";
        this.searchData.endDate="";
      }else{
        this.searchData.startDate=val[0];
        this.searchData.endDate=val[1];
      }
    },
  }
}
</script>

<style lang="less" scoped>
.search-bar .el-form{
  width: 100%;
}
.el-row:nth-child(1){
  margin-bottom:10px;
}
@height:100px;
.tab-box-container{
  position: relative;
  padding: 0 50px;
  .tab-box-item{
    display:inline-block;
    position: absolute;
    top:0;
    width: 40px;
    height: @height;
    line-height: @height;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #eee;
    
    &.prev{
      left:0;
    }
    &.next{
      right:0;
    }
  }
}
.tab-box-wrap{
  overflow: hidden;
}
.tab-box{
  margin-bottom: 10px;
  white-space: nowrap;
  transition: transform 0.3s;
  float:left;
  &::after{
    display: block;
    content:" ";
    clear: both;
  }
  li{
    box-sizing: border-box;
    width: 200px;
    height: @height;
    border: 1px solid #eee;
    display:inline-block;
    margin-right: 10px;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    .name{
      
    }
    .money{
      margin:10px 0;
    }
  }
}
</style>
