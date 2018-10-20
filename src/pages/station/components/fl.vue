<template lang="html">
  <div class="station-fl-index">
    <div class="page-title">
      站点友情链接管理
       <a @click="back">返回站点管理</a>
    </div>
    <div class="search-bar multi-row-search">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" size="small">新增友情链接</el-button>
    </div>
    <div>
      <el-table v-loading="loading" :data="tableData" border>
          <el-table-column label="名称" prop="name"></el-table-column>  
          <el-table-column label="排序" prop="sort"></el-table-column>
          <el-table-column label="logo地址" prop="logo"></el-table-column>
          <el-table-column label="链接" prop="linkUrl"></el-table-column>
          <el-table-column label="显示" prop="display"></el-table-column>
          <el-table-column label="描述"prop="description"></el-table-column>       
          <el-table-column label="操作" align="center">
            <template slot-scope="props">
              <div>
                <el-button type="text" @click="handleModify(props.row.id)">修改</el-button>
                <el-button type="text" @click="handleDelete(props.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <fl-dialog ref="flDialog"></fl-dialog>
  </div>
</template>
<script>
import Service from '../services';
import FlDialog from './flDialog'
const service=new Service();
export default {
   components: {
    'fl-dialog': FlDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      title:'站点友情链接',
      siteId:'',
      backHref:''
    }
  },
  created(){
    this.backHref = this.$router.currentRoute.params.backHref;
    this.siteId=this.$route.params.siteId;
    this.onSearch(this.siteId);
  },
  methods: {
    back() {
      this.$router.push({
        name: 'station',
        params: {

        }
      });
    },
    onSearch(siteId){
      this.tableData = [
          {
            "description": "string",
            "display": 0,
            "id": 0,
            "linkUrl": "string",
            "logo": "string",
            "name": "string",
            "siteId": 0,
            "sort": 0
          }
        ]
      return;
      this.loading = true;
      let params = {siteId};
      service.s_detail(params).then((res) => {
        const data = res.data.data || {};
        this.tableData = data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleDelete(id){
      this.$confirm('确定删除该友情链接吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id};
          service.fl_delete(params).then(response=>{
            if(response.data.code==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.onSearch(this.siteId);
            }
          })          
        }).catch(()=>{

      })
    },
    handleModify(id){
      this.$refs.flDialog.modify(id);
    },
    handleAdd(){
      this.$refs.flDialog.add(this.siteId);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
