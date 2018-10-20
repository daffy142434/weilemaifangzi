<template lang="html">
  <div class="amazon-profit-index">
    <div class="page-title">
      生成在线SKU
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="识别码">
          <el-input placeholder="识别码" v-model="searchData.identificationCode"></el-input>
        </el-form-item>
        <el-form-item label="在线SKU">
          <el-input placeholder="在线SKU" v-model="searchData.onlineSkuGenerate"></el-input>
        </el-form-item>
        <el-form-item label="本地SKU">
          <el-input placeholder="本地SKU" v-model="searchData.originSku"></el-input>
        </el-form-item>
        <el-form-item label="上线渠道">
          <el-input placeholder="上线渠道" v-model="searchData.onlineChannel" disabled></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="export">
      <el-button type="success" icon="el-icon-plus" size="small" @click="showSkuDialog">生成在线SKU</el-button>
    </div>
    <div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
      >
        <el-table-column
          label="识别码"
          prop="identificationCode"
        >
        </el-table-column>
        <el-table-column
          label="在线SKU"
          prop="onlineSkuGenerate"
        >
        </el-table-column>
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
          label="上线渠道"
          prop="onlineChannel"
        >
        </el-table-column>
        <el-table-column
          label="申请人和申请时间"
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.creator}}</div>
              <div><span v-datetime="props.row.createTime"></span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
        >
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="props">
            <el-button type="text" @click="handleDelete(props.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="searchData.pageNumber"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <create-sku-dialog ref="createSkuDialog" @list="onSearch"></create-sku-dialog>
  </div>
</template>

<script>
import format from '../../lib/format';
import ajax from '../../lib/ajax';
import CreateSkuDialog from './components/createSkuDialog';
export default {
  components: {
    CreateSkuDialog
  },
  data() {
    return {
      visible: false,
      tableLoading:false,
      searchData:{
        originSku:"",
        identificationCode:"",
        onlineSkuGenerate:"",
        onlineChannel:"",
        pageNumber:1,
        pageSize:10
      },
      totalRecord:0,
      tableData:[
        
      ],
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.onSearch();
  },
  methods: {
    showSkuDialog(){
      this.$refs.createSkuDialog.show();
    },
    handleReset(){
      this.searchData={originSku:"",
        identificationCode:"",
        onlineSkuGenerate:"",
        onlineChannel:"",
        pageNumber:1,
        pageSize:10}
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch(){
      let params=this.searchData;
      ajax.post("/products/online_sku_generate",params).then(response=>{
        if(response.data.code==200){
          this.tableData=response.data.data.data;
          this.totalRecord=response.data.data.totalRecord;
        }
      })
    },
    handleDelete(id){
      this.$confirm('确定删除该在线SKU?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url="/products/"+id+"/online_sku_generate/delete";
          ajax.post(url).then(response=>{
            if(response.data.code==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.onSearch();
            }
          })
          
        })
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
  }
}
</script>

<style scoped lang="less">
.export{
  margin-bottom: 10px;
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