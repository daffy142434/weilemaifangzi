<template lang="html">
  <div class="goods-index">
    <div class="page-title">
      库存核销异常处理
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="店铺名称">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="亚马逊订单号">
          <el-input placeholder="亚马逊订单号" v-model="searchData.amaOrderId"></el-input>
        </el-form-item>
        <el-form-item label="异常类型">
          <el-select v-model="searchData.exceptionStatus" placeholder="请选择">
            <el-option
              label="请选择"
              value=""
            >
            </el-option>
            <el-option
              v-for="item in exceptionStatusList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
          
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="searchData.exceptionAll" label="只看未处理完成的订单" true-label="1" false-label="0"></el-checkbox>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="batch">
      <el-button type="primary" @click="handleBatch" :loading="bathLoading" size="small">批量处理</el-button>
      <div class="handle-tips">tips:自发货订单不能批量处理</div>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props" v-if="props.row.exceptionStatus!==0">
            <el-table :data="props.row.amaOrderCancellationExceptionProducts" border>
              <el-table-column
                prop="asin"
                label="ASIN"
                >
              </el-table-column>
              <el-table-column
                prop="sku"
                label="SKU"
                >
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="涉及数量"
                >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="操作人/操作时间"
          >
          <template slot-scope="props">
            <div>
              <div>{{props.row.modifier}}</div>
              <div v-datetime="props.row.modifyTime"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="店铺名称"
          >
        </el-table-column>
        <el-table-column
          prop="amaOrderId"
          label="亚马逊订单号">
        </el-table-column>
        <el-table-column
          prop="targetStorageName"
          label="目标仓库">
        </el-table-column>
        <el-table-column
          width="170"
          label="异常类型">
          <template slot-scope="props">
            {{changeStatus(props.row.exceptionStatus)}}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          width="100"
          label="操作">
          <template slot-scope="props">
            <el-button type="text" @click="handleData(props.row)" :disabled="props.row.exceptionStatus==0">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchData.pageNumber"
        :page-sizes="[ 50, 100]"
        :page-size="searchData.pageSize"
        :current-page.sync="searchData.pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
    <el-dialog
      title="处理"
      :visible.sync="dialogVisible"
      width="60%"
      >
      <div class="tips">请确保库存充足，否则将由于库存不足导致处理失败!</div>
      <div>
        <el-table :data="dialogTable" border>
          <el-table-column
          prop="amaOrderId"
          label="亚马逊订单号">
        </el-table-column>
        <el-table-column
          prop="targetStorageName"
          label="目标仓库">
        </el-table-column>
          <el-table-column
            prop="asin"
            label="ASIN"
            >
          </el-table-column>
          <el-table-column
            prop="sku"
            label="SKU"
            >
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="涉及数量"
            >
          </el-table-column>
        </el-table>
      </div>
      
      <div class="storage" v-if="storageShow">
        <div>目的仓库</div>
        <div><el-button type="primary"
                size="small"
                @click="handleShowWarehouseSelect">{{storageName || '请选择'}}</el-button></div>
        <div><el-button type="success" size="small" @click="getInfo">快速选中店铺所绑定仓库</el-button></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSingle">确 定</el-button>
      </span>
    </el-dialog>
    <warehouse-select-dialog
      ref="warehouseSelectDialog"
      @select="handleSelect"
    >
    </warehouse-select-dialog>
  </div>
</template>

<script>
import Service from './services';
import ShopSelect from '@/components/shop-select';
import WarehouseSelectDialog from '../warehouse/components/warehouseSelectDialog';
const service=new Service();
export default {
  data() {
    return {
      searchData:{
        shopId:"",
        amaOrderId:"",
        exceptionStatus:'',
        exceptionAll:"",
        pageNumber:1,
        pageSize:50
      },
      totalRecord:0,
      exceptionStatusList:[
        {
          key:0,
          value:'处理完成'
        },
        {
          key:1,
          value:'自发货订单'
        },
        {
          key:2,
          value:'店铺未关联仓库'
        },
        {
          key:3,
          value:'库存不足'
        },
        {
          key:6,
          value:'退货店铺未关联仓库'
        },
        {
          key:7,
          value:'退货但未关联本地SKU'
        },
      ],
      tableData:[
        
      ],
      dialogVisible:false,
      dialogTable:[],
      patchParam:"",
      storageName:"",
      targetStorageId:"",
      storageShow:false,
      bathLoading:false
    }
  },
  components: {
    WarehouseSelectDialog,
    'shop-select': ShopSelect,
  },
  filters: {
    changeStatus(value) {
      if (!value) return ''
    }
  },
  created() {
    this.onSearch();
  },
  methods: {
    getInfo(){
      service.storageInfo({shopId:this.patchParam.shopId}).then(res=>{
        let data=res.data.data;
        this.patchParam.storageId = data.id;
        this.storageName = data.storageName;
      })
    },
    handleSelect(data) {
      this.patchParam.storageId = data.id;
      this.storageName = data.storageName;
    },
    handleShowWarehouseSelect() {
      this.$refs.warehouseSelectDialog.show();
    },
    handleBatch(){
      let state=this.searchData.exceptionStatus;
      if(state===0){
        this.$message({
          message: '已处理订单不可重复处理',
          type: 'warning'
        });
        return;
      }
      if(state==1){
        this.$message({
          message: '自发货订单不能批量处理',
          type: 'warning'
        });
        return;
      }
      let msg="确定批量处理所查询订单";
      // if(state===""){
      //   msg="确定批量处理所查询订单";
      // }
      // if(state==2){
      //   msg="确定批量处理 店铺未关联仓库 订单";
      // }
      // if(state==3){
      //   msg="确定批量处理 库存不足 订单";
      // }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.bathLoading=true;
        let {shopId,amaOrderId,exceptionStatus}=this.searchData;
        let params={shopId,amaOrderId,exceptionStatus};
        service.orderCancellationSolveBatch(params).then(response=>{
          if(response.data.code===200){
            this.$message({
              message: response.data.data,
              type: 'success',
              duration:4000
            });
            this.onSearch();
          }
          this.bathLoading=false;
        })
      })
      
    },
    handleSingle(){
      
      if(this.storageShow&&!this.patchParam.storageId){
        this.$message({
          message: '请选择目的仓库',
          type: 'info'
        });
        return;
      }
      service.orderCancellationSolve(this.patchParam).then(response=>{
        if(response.data.code===200){
          let status=response.data.data;
          if(status=="处理成功"){
            this.$message({
              message: status,
              type: 'success'
            });
            this.dialogVisible=false;
            this.searchData.pageNumber = 1;
            this.onSearch();
          }else{
            this.$message({
              message: status,
              type: 'error'
            });
          }
          
          
        }
        
      })
    },
    handleData(row){
      this.dialogTable=row.amaOrderCancellationExceptionProducts.map(item=>{
        item.amaOrderId=row.amaOrderId;
        item.targetStorageName=row.targetStorageName;
        return item;
      });
      this.dialogVisible=true;
      this.storageShow=row.exceptionStatus==1?true:false;
      
      const {shopId,amaOrderId,exceptionStatus}=row;
      this.patchParam={shopId,amaOrderId,exceptionStatus};
      this.patchParam.exceptionId=row.id;

      if(this.storageShow){
        this.patchParam.storageId = "";
        this.storageName = "";
      }
    },
    changeStatus(val){
      let item="";
      for(let exceptionStatus of this.exceptionStatusList){
        if(exceptionStatus.key==val){
          item=exceptionStatus.value
        } 
      }
      return item;
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch(){
      service.orderCancellation(this.searchData).then(response=>{
        const data = response.data.data.data || [];
        this.totalRecord=response.data.data.totalRecord || 0;
        this.tableData=data;
        // this.tableData=data.map(item=>{
        //   for(let exceptionStatus of this.exceptionStatusList){
        //     if(exceptionStatus.key==item.exceptionStatus){
        //       item.exceptionStatus=exceptionStatus.value
        //     } 
        //   }
        //   return item;
        // });
      })
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.searchData.pageNumber = 1;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val
      this.onSearch();
    },
    handleReset(){
      this.searchData={
        shopId:"",
        amaOrderId:"",
        exceptionStatus:'',
        pageNumber:1,
        pageSize:10
      }
    }
  },
}
</script>

<style lang="less" scoped>
  .tips{
    margin-bottom: 10px;
    color: red;
  }
  .storage{
    padding: 10px 0;
    >div{
      display: inline-block;
      margin-right: 10px;
    }
  }
  .batch{
    margin-bottom: 10px;
  }
  .handle-tips{
    display:inline-block;
    margin-left:20px;
    font-size:14px;
    color:#409EFF;
  }
</style>
