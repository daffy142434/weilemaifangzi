<template lang="html">
  <div class="station-menu-index">
    <div class="page-title">
      站点菜单管理
    </div>
    <div class="search-bar multi-row-search">
      <!-- <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="公司名称">
          <el-input placeholder="公司名称" v-model.trim="searchData.companyName" size="small"></el-input>
        </el-form-item>
      </el-form> -->
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" size="small">新增站点菜单</el-button>
      <div class="fr">
        <!-- <el-button type="text" @click="handleReset">重置</el-button> -->
        <!-- <el-button type="primary" icon="el-icon-search" @click="beforeSearch" size="small">查询</el-button> -->
      </div>
    </div>
    <div>
      <el-row :gutter="20" v-loading.body="loading">
        <template v-if="tableData.length > 0">
          <template v-for="item in tableData">
            <el-col :span="6" style="margin-bottom:15px;">
              <el-card class="box-card online-shop-card">
                <div slot="header" class="clearfix" style="overflow:hidden;">
                  <el-button type="text" @click="handleShow(item.id)" >{{item.name}}</el-button>
                  <div class="more-info">
                    数量：{{item.showSum}}
                  </div>
                </div>
                <div class="text item">
                  {{'标识：' + item.code }}
                </div>
                <div class="shop-card-footer">
                  <div class="fr">
                    <el-button type="text" class="button" @click="handleModify(item.id)">修改</el-button>
                    <el-button type="text" class="button" @click="handleDelete(item.id)">删除</el-button>
                  </div>        
                </div>
              </el-card>
            </el-col>
          </template>
        </template>
        <template v-else>
          <el-col :span="24" style="margin-bottom:15px;">
            <el-alert
              show-icon
              title="没有查询到站点菜单列表"
              type="warning"
              :closable="false">
            </el-alert>
          </el-col>
        </template>
      </el-row>

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
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    //获得站点菜单数据
    onSearch(){
      this.tableData = [
        {
          "code": "string",
          "fieldManage": "string",
          "id": 0,
          "name": "string",
          "showSum": 0,
          "siteId": 0
        },
        {
          "code": "string",
          "fieldManage": "string",
          "id": 1,
          "name": "string",
          "showSum": 0,
          "siteId": 0
        },
        {
          "code": "string",
          "fieldManage": "string",
          "id": 2,
          "name": "string",
          "showSum": 0,
          "siteId": 0
        },
        {
          "code": "string",
          "fieldManage": "string",
          "id": 3,
          "name": "string",
          "showSum": 0,
          "siteId": 0
        },
        {
          "code": "string",
          "fieldManage": "string",
          "id": 4,
          "name": "string",
          "showSum": 0,
          "siteId": 0
        },
      ]
      return;
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
      this.$confirm('确定删除该站点菜单吗?', '提示', {
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
    handleAdd(){
      this.$refs.stationDialog.show();
    },
    //打开友情链接详情
    handleShow(id){
      this.$router.push({path:`/station-menu-nav/${id}` })
    },
  }
}
</script>

<style lang="less" scoped>

</style>
