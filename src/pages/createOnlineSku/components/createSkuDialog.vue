<template lang="html">
  <el-dialog
    title="生成在线SKU"
    width="60%"
    class="create-sku-dialog"
    :visible.sync="visible"
  >
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
          <el-form-item label="识别码">
            <el-input placeholder="识别码" v-model="searchData.identificationCode"></el-input>
          </el-form-item>
          <el-form-item label="本地SKU">
            <el-input placeholder="本地SKU" v-model="searchData.originSku"></el-input>
          </el-form-item>
        </el-form>
        <div class="fr">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </div>
    </div>
    <div class="">选择本地商品</div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      highlight-current-row
      @row-click="selectRow"
    >
      <el-table-column
        label="本地图片和本地SKU"
        align="center"
      >
        <template slot-scope="props">
          <div class="img">
            <img :src="props.row.mainImg" alt=""/>
          </div>
          <div>
            {{props.row.originSku}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="识别码"
          prop="identificationCode"
          width="100"
        >
      </el-table-column>
      <el-table-column
          label="本地名称"
          prop="name"
        >
      </el-table-column>
      <el-table-column
          label="进货价"
          prop="purchasePrice"
          width="150"
        >
      </el-table-column>
    </el-table>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10, 25]"
        :page-size="searchData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
    <div class="sku-online-channel">
      <div class="title">上线渠道</div>
      <el-radio v-model="onlineChannel" label="1" disabled>亚马逊</el-radio>
    </div>
    <div class="sku-content">
      <div class="title">请补全在线SKU名</div>
      <ul class="sku">
        <li><el-input placeholder="品牌简称，小于等于5位" v-model="onlineSku.one"></el-input></li>
        <li class="connect"></li>
        <li><el-input placeholder="自定义，小于等于8位" v-model="onlineSku.two"></el-input></li>
        <li class="connect"></li>
        <li><el-input placeholder=""  v-model="onlineSku.three" disabled></el-input></li>
        <li class="connect"></li>
        <li><el-input placeholder="运营人简称 ，小于等于5位" v-model="onlineSku.four"></el-input></li>
      </ul>
      <el-input
      class="textarea"
        type="textarea"
        :rows="2"
        placeholder="备注"
        v-model="remark">
      </el-input>
    </div>
    <div class="submit">
      <el-button type="primary" @click="createOnlineSku">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ajax from '@/lib/ajax';
export default {
  data() {
    return {
      visible: false,
      tableLoading:false,
      searchData:{
        identificationCode:"",
        originSku:"",
        pageNumber:1,
        pageSize:5
      },
      tableData:[],
      totalRecord:0,
      onlineSku:{
        one:"",
        two:"",
        three:"",
        four:""
      },
      row:"",
      remark:"",
      onlineChannel:'1'
    };
  },
  methods: {
    show(){
      this.searchData={
        identificationCode:"",
        originSku:"",
        pageNumber:1,
        pageSize:5
      }
      this.remark="";
      this.visible=true;
      this.tableData=[];
      this.totalRecord=0;
      this.onlineSku={
        one:"",
        two:"",
        three:"",
        four:""
      };
      this.remark="";
    },
    onSearch(){
      let params=this.searchData;
      ajax.post("/products/product_sku_info",params).then(response=>{
        if(response.data.code==200){
          this.tableData=response.data.data.data;
          this.totalRecord=response.data.data.totalRecord;
        }
      })
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    selectRow(row, event, column){
      this.onlineSku.three=row.identificationCode;
      this.row=row;
    },
    createOnlineSku(){
      if(!this.onlineSku.three){
        this.$message.error('请先选择商品');
        return;
      }
      if(!(this.onlineSku.one&&this.onlineSku.two&&this.onlineSku.four)){
        this.$message.error('请补全在线SKU');
        return;
      }
      if(this.onlineSku.one.length>5){
        this.$message.error('品牌简称必须小于等于5位');
        return;
      }
      if(this.onlineSku.two.length>8){
        this.$message.error('自定义必须小于等于8位');
        return;
      }
      if(this.onlineSku.four.length>5){
        this.$message.error('运营人简称必须小于等于5位');
        return;
      }
      let params={
        originSkuId:this.row.originSkuId,
        originSku:this.row.originSku,
        mainImg:this.row.mainImg,
        identificationCode:this.row.identificationCode,
        onlineSkuGenerate:this.onlineSku.one+"-"+this.onlineSku.two+"-"+this.onlineSku.three+"-"+this.onlineSku.four,
        onlineChannel:"亚马逊",
        remark:this.remark
      }
      ajax.post("/products/add_online_sku_generate",params).then(response=>{
        if(response.data.code==200){
          this.visible=false;
          this.$emit("list");
        }else{

        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sku-content{
  margin-top:20px;
  .sku{
    display: flex;
    justify-content: space-between;
    li{
      flex:none;
      width: 20%;
      &.connect{
        display: block;
        width: 3%;
        height: 2px;
        background: #ccc;
        margin-top:20px;
      }
    }
    
  }
  .textarea{
    margin-top:10px;
  }
}
.submit{
  margin:20px auto;
  width: 80px;
}
.img{
  max-width: 60px;
  max-height: 60px;
  margin:auto;
  margin-bottom: 5px;
  img{
    width: 100%;
    height: 100%;
  }
}

</style>
<style lang="less">
.create-sku-dialog{
  .el-dialog{
    margin-top:50px !important;
  }
}
</style>