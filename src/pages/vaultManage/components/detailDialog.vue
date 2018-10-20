<template lang="html">
<div>
  
  <el-dialog
    title="查看明细"
    :visible.sync="dialogVisible"
    width="80%"
    >
    <el-form :inline="true" label-width="100px">
    <el-row>
      <el-col :span="12">
          <el-form-item label="金额">
            <el-input placeholder="金额" type="number" :min="0" :value="searchData.amount" disabled>
              <template slot="append">CNY</template>
            </el-input>
          </el-form-item>
          <el-form-item label="" v-if="permissions('financial_warehouse:recharge')"><el-checkbox true-label="1" false-label="0" :value="checkinput" disabled>是否充值</el-checkbox></el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="店铺" v-show="searchData.rechargeFlag==0">
          <el-input placeholder="" v-model="searchData.shopName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="部门" v-show="searchData.rechargeFlag==0">
          <el-select v-model="searchData.departmentId" disabled>
            <el-option label="无相关" value=""></el-option>
            <el-option label="运营部" :value="1"></el-option>
            <el-option label="行政人事部" :value="2"></el-option>
            <el-option label="技术部" :value="3"></el-option>
            <el-option label="总裁办" :value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="在线SKU" v-show="searchData.rechargeFlag==0">
          <el-input placeholder="" v-model="searchData.onlineSku" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用途" v-show="searchData.rechargeFlag==0">
          <el-select v-model="searchData.transactionType" disabled>
            <el-option label="请选择" value=""></el-option>
            <el-option label="样品费" :value="0"></el-option>
            <el-option label="红单成本" :value="1"></el-option>
            <el-option label="翻译费" :value="2"></el-option>
            <el-option label="购买资源" :value="3"></el-option>
            <el-option label="其他" :value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="订单号" v-show="searchData.rechargeFlag==0">
          <el-input placeholder="" v-model="searchData.orderNo" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="说明" class="trunover-dialog-textarea">
          <el-input type="textarea"  placeholder="" v-model="searchData.remark" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="图片">
          <ul class="images">
            <li v-if="searchData.mainImg"><img :src="searchData.mainImg" alt=""/>
              <div class="img"><img :src="searchData.mainImg" alt=""/></div>
            </li>
            <li v-for="item in searchData.imgs"><img :src="item" alt=""/>
              <div class="img"><img :src="item" alt=""/></div>
            </li>
          </ul>
          
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="文件">
          <ul class="file">
            <li v-for="item in searchData.accessoryList"><a :href="'/financial_warehouse/download_file?fileName='+item.accessoryName+'&url='+item.accessoryPath" target="_blank">{{item.accessoryName}}</a></li>
          </ul>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="operator"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operationAmount"
        label="操作金额">
      </el-table-column>
      <el-table-column
        prop="beforeOperationAmount"
        label="操作前金库余额">
      </el-table-column>
      <el-table-column
        prop="afterOperationAmount"
        label="操作后金库余额">
      </el-table-column>
      <el-table-column
        prop="transactionType"
        :formatter="formatTransactionType"
        label="用途">
      </el-table-column>
      <el-table-column
        label="操作时间">
        <template slot-scope="props">
          <span v-datetime="props.row.operationTime"></span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  
</div>
</template>

<script>
import services from '../services';
const service = new services();
export default {
  props:[],
  data() {
    return {
      dialogVisible: false,
      tableData:[],
      searchData:{},
      checkinput:""
    }
  },
  computed: {
    
  },
  components: {
    
  },
  methods: {
    formatTransactionType(row, column, cellValue, index){
      if(cellValue==1){
        return "新增";
      }else if(cellValue==2){
        return "复核";
      }else if(cellValue==3){
        return "出纳";
      }
    },
    show(row){
      this.dialogVisible=true;
      this.searchData=row;
      this.searchData.imgs=JSON.parse(this.searchData.imgs);
      this.tableData=row.financialWarehouseBillList.sort(this.compare('transactionType'));
      if(this.searchData.rechargeFlag==1){
        this.checkinput="1";
      }else{
        this.checkinput="0";
      }
    },
    compare(property){
      return (a,b)=>{
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
      }
    },
    getDetails(id){
      service.details(id).then(res=>{
        if(res.data.code==200){
          this.tableData=res.data.data;
        }
      })
    },
    downLoadFile(file){
      service.downloadFile({fileName:file.accessoryName,url:file.accessoryUrl}).then(res=>{

      })
    }

  }
}
</script>
<style lang="less" scoped>
.images{
  li{
    display:inline-block;
    position: relative;
    >img{
      width:146px;
      height: 146px;
      border-radius: 5px;
    }
    .img{
      display: none;
      position: fixed;
      top:0;
      left:25%;
      width: 50%;
      height: 450px;
      margin:10px auto;
      text-align: center;
      z-index: 999;
      img{
        max-width: 100%;
        max-height: 100%;
      }
    }
    &:hover{
      .img{
        display: block;
      }
    }
  }
}
.file{
  li{
    float:left;
    margin-right: 20px;
  }
  &::after{
    display: block;
    content: " ";
    clear: both;
  }
}
</style>
