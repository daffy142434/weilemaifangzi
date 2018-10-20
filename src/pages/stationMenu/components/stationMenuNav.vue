<template lang="html">
  <div class="station-menu-nav-index">
    <div class="page-title">
      菜单导航信息
      <a @click="back">返回站点菜单管理</a>
    </div>
    <div>
      <el-table v-loading="Loading" :data="tableData" border>
          <el-table-column label="显示" prop="display"></el-table-column>  
          <el-table-column label="扩展字段" prop="extend"></el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <el-table-column label="标识" prop="nav.code"></el-table-column>
          <el-table-column label="是否为栏目" prop="nav.isColumn"></el-table-column>
          <el-table-column label="描述"prop="nav.navDesc"></el-table-column>       
          <el-table-column label="导航排序"prop="nav.sort"></el-table-column>       
          <el-table-column label="标题"prop="nav.title"></el-table-column>       
          <el-table-column label="英文标题"prop="nav.titleEn"></el-table-column>       
          <el-table-column label="打开方式"prop="nav.targetType"></el-table-column>       
          <el-table-column label="链接地址"prop="nav.url"></el-table-column>       
          <el-table-column label="操作" align="center">
            <template slot-scope="props">
              <div>
                <el-button type="text" @click="handleModify(props.row.id,props.row.navId)">修改</el-button>
                <el-button type="text" @click="handleDelete(props.row.id,props.row.navId)">删除</el-button>
              </div>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <nav-dialog ref="flDialog"></nav-dialog>
  </div>
</template>
<script>
import Service from '../services';
import NavDialog from './stationMenuNavDialog'
const service=new Service();
export default {
   components: {
    'nav-dialog': NavDialog,
  },
  data() {
    return {
      Loading: false,
      tableData: [],
      title:'站点友情链接',
      id:'',
      backHref:''
    }
  },
  created(){
    this.backHref = this.$router.currentRoute.params.backHref;
    this.id=this.$route.params.id;
    this.onSearch(this.id);
  },
  methods: {
    back() {
      this.$router.push({
        name: 'stationMenu',
        params: {

        }
      });
    },
    onSearch(id){
      this.tableData = [
          {
           "display": 0,
            "extend": "string",
            "id": 0,
            "menuId": 0,
            "nav": {
                "code": "string",
                "id": 0,
                "isColumn": 0,
                "navDesc": "string",
                "siteId": 0,
                "sort": 0,
                "targetType": "string",
                "title": "string",
                "titleEn": "string",
                "url": "string"
            },
            "navId": 0,
            "sort": 0
            }
        ]
      return;
      this.Loading = true;
      let params = {id};
      service.mn_detail(params).then((res) => {
        const data = res.data.data || {};
        this.tableData = data;
        this.Loading = false;
      }).catch(() => {
        this.Loading = false;
      });
    },
    handleDelete(id,navId){
      this.$confirm('确定删除该友情链接吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {id,navId};
          service.mn_delete(params).then(response=>{
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
    handleModify(id,navId){
      this.$refs.flDialog.modify(id,navId);
    },
  }
}
</script>

<style lang="less" scoped>

</style>
