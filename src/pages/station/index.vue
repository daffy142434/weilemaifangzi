<template lang="html">
  <div class="station-index">
    <div class="page-title">
      站点管理
    </div>
    <div class="search-bar multi-row-search">
      <!-- <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="公司名称">
          <el-input placeholder="公司名称" v-model.trim="searchData.companyName" size="small"></el-input>
        </el-form-item>
      </el-form> -->
      <el-button type="primary" icon="el-icon-plus" @click="handleStateAdd" size="small">新增站点信息</el-button>
      <div class="fr">
        <!-- <el-button type="text" @click="handleReset">重置</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-search" @click="beforeSearch" size="small">查询</el-button> -->
      </div>
    </div>
    <div>
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column label="名称" prop="title"></el-table-column>  
        <el-table-column label="公司地址" prop="companyAddress"></el-table-column>
        <el-table-column label="公司名称" prop="companyName"></el-table-column>
        <el-table-column label="联系人" prop="contact"></el-table-column>
        <el-table-column label="联系邮箱" prop="contactEmail"></el-table-column>
        <el-table-column label="联系电话" prop="contactNumber"></el-table-column>
        <el-table-column label="版权" prop="copyright"></el-table-column>
        <el-table-column label="域名" prop="domain"></el-table-column>
        <el-table-column label="备案" prop="filing"></el-table-column>  
        <el-table-column label="logo" prop="logo"></el-table-column>
        <el-table-column label="标识" prop="name"></el-table-column>
        <el-table-column label="站点配置信息" prop="settingsList"></el-table-column>          
        <el-table-column label="操作" align="center">
          <template slot-scope="props">
            <div>
              <el-button type="text" @click="handleModify(props.row.id)">修改</el-button>
              <el-button type="text" @click="handleDelete(props.row.id)">删除</el-button>  
              <el-button type="text" @click="handleFlShow(props.row.id)">站点友情链接</el-button>  
              <!-- <el-button type="text" @click="handleFlAdd(props.row.id)">新增友情链接</el-button>   -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="searchData.pageNumber"
          :total="totalRecord">
        </el-pagination>
      </div> -->
    </div>
    <station-dialog ref="stationDialog" @stationList="onSearch"></station-dialog>
  </div>
</template>
<script>
import Service from './services';
import StationDialog from './components/stationDialog';

const service=new Service();
export default { 
  components: {
    'station-dialog': StationDialog,
  },
  data() {
    return {
      visible: false,
      loading:false,
      // searchData:{
      //   companyName :"",
      //   pageNumber:1,
      //   pageSize:10
      // },
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
    // handleReset(){
    //   this.searchData={
    //     companyName :"",
    //     pageNumber:1,
    //     pageSize:10}
    // },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    //获得站点信息数据
    onSearch(){
      // let params=this.searchData;
      this.loading=true;
      service.s_list().then( (res) => {
          const data = res.data.data || [];
          this.tableData = data;
          this.loading = false;
      }).catch((err)=>{
        this.loading=false;
      })
    },
    handleDelete(id){
      this.$confirm('确定删除该站点信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id};
          service.s_delete(params).then(response=>{
            if(response.data.code==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.onSearch();
            }
          })        
        }).catch(()=>{

        })
    },
    //打开站点详情
    handleModify(id){
      this.$refs.stationDialog.show(id);
    },
    //新增站点
    handleStateAdd(){
      this.$refs.stationDialog.show();
    },
    //打开友情链接详情
    handleFlShow(siteId){
      this.$router.push({path:`/fl/${siteId}` })
    },
    // //新增友情链接
    // handleFlAdd(siteId){
    //   this.$refs.flAdd.add(siteId);
    // },
    // //修改友情链接
    // handleFlModify(id){
    //   this.$router.push({
    //       path: `/fl/${id}`,
    //     })
    //   // this.$refs.flAdd.modify(id);
    // }
    // handleSizeChange(val) {
    //   this.searchData.pageSize = val;
    //   this.beforeSearch();
    // },
    // handleCurrentChange(val) {
    //   this.searchData.pageNumber = val;
    //   this.onSearch();
    // },
  }
}
</script>

<style lang="less" scoped>

</style>
