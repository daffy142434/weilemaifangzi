<template lang="html">
  <div class="">
    <div class="page-title">
      一键抓取评论
    </div>
    
    <div class="search-bar">
      <el-form :inline="true" class="fl" label-width="100px">
        <el-form-item label="ASIN">
            <el-input type="text" v-model="asin"></el-input>
        </el-form-item>
        <el-form-item label="国家">
            <contries-select v-model="country"></contries-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="fr" @click="add">添加采集内容</el-button>
    </div>
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        border
      >
        <el-table-column
          label="ASIN"
          prop=""
        >
        </el-table-column>
        <el-table-column
          label="国家"
          prop=""
        >
        </el-table-column>
        <el-table-column
          label="状态"
          prop=""
        >
        </el-table-column>
        <el-table-column
          label="添加时间"
          prop=""
        >
        </el-table-column>
        <el-table-column
          label="下载链接"
          prop=""
        >
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import ajax from '../../lib/ajax';
export default {
  data() {
    return {
      visible: false,
      tableData:[],
      pageSize:10,
      country:"",
      asin:""
    }
  },
  filters: {
    
  },
  beforeCreate() {
    
  },
  created() {
    
  },
  mounted(){
    
  },
  methods: {
    add(){
      ajax.post("http://192.168.11.166:6666/review_qa",{asin:this.asin,country:this.country}).then(res=>{

      })
    },
    onSearch(){
      ajax.post("")
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
  }
}
</script>
<style scoped>
.add{
  margin-bottom: 10px;
}
</style>
