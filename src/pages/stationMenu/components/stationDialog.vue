<template lang="html">
  <el-dialog
    title="站点菜单信息"
    width="40%"
    :visible.sync="visible"
    @close="close"
  >
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane :label="title">
        <el-form ref="stationDetailForm" :rules="rules" :model="stationDetailForm" label-width="86px">
           <el-form-item label="名称" prop="name">
              <el-input placeholder="名称" v-model.trim="stationDetailForm.name"></el-input>
           </el-form-item>
           <el-form-item label="标识" prop="code">
              <el-input placeholder="标识" v-model.trim="stationDetailForm.code"></el-input>
           </el-form-item>
           <el-form-item label="显示数量" prop="showSum">
              <el-input placeholder="显示数量" v-model.trim="stationDetailForm.showSum"></el-input>
           </el-form-item>
           <el-form-item label="字段管理" prop="fieldManage">
              <el-input placeholder="字段管理" v-model.trim="stationDetailForm.fieldManage"></el-input>
           </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="modify">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Service from '../services';
const service=new Service();
export default {
  data() {
    return {
      visible: false,
      loading: false,
      stationDetailForm: {
        code:'',
        name:'',
        showSum:'',
        fieldManage:'',
      },
      rules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '标识不能为空',
          trigger: 'blur'
        }],
        showSum: [{
          required: true,
          message: '显示数量不能为空',
          trigger: 'blur'
        }],
        fieldManage: [{
          required: true,
          message: '字段管理不能为空',
          trigger: 'blur'
        }]
      },
      id:null,
      title:'新增站点信息'
    }
  },
  created() {
    
  },
  methods: {
   show(id) {
      if(id != undefined){
        this.title='修改站点菜单';
        this.id=id;
        this.visible = true;
        this.loading = true;
        let params = {id};
        service.s_detail(params).then((res) => {
          const data = res.data.data || {};
          this.stationDetailForm = data;
          this.settingsList = this.stationDetailForm.settingsList;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      }else{
        this.title='新增站点菜单';
        this.visible = true;
      }
    },
    modify(){
      this.$refs.stationDetailForm.validate((valid) => {
        if(valid){
          console.log(this.stationDetailForm);
          if(this.id != undefined){
            this.stationDetailForm.siteId=this.id;
            service.s_modify(this.stationDetailForm).then((res) => {
              if(res.data.code==0){
                this.$message.success('修改成功');
                this.$emit("stationList");
                this.visible = false;
              }else{
                this.$message.error('修改失败');
              }
            }).catch(() => {
              
            });
          }else{
            service.s_add(this.stationDetailForm).then((res) => {
              if(res.data.code==0){
                this.$message.success('新增成功');
                this.$emit("stationList");
                this.visible = false;
              }else{
                this.$message.error('新增失败');
              }
            }).catch(() => {
              
            });
          }
        }else{
          console.log('error submit');
        }
      })
    },
    close() {
      this.stationDetailForm = {};
      this.visible = false;
    },
    settingListAdd(){
      let obj =  {
        settingsTitle:'',
        settingsCode:'',
        settingsType:'',
        settingsDesc:'',
        settingsValue:'',
      };
      this.stationDetailForm.settingsList.push(obj);
    },
    settingListReduce(item,index){
      this.$confirm('该操作会导致'+item.settingsTitle+'的数据丢失,请谨慎操作', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.stationDetailForm.settingsList.splice(index,1)
      }).catch(()=>{

      })
  
    }
  }
}
</script>

<style lang="less">
.fl{
  float: left;
}
</style>
