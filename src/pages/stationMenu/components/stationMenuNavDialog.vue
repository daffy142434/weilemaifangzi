<template lang="html">
  <el-dialog
    title="友情链接"
    width="40%"
    :visible.sync="visible"
    @close="close"
  >
    <el-tabs type="border-card">
      <el-form ref="detailForm" :model="detailForm" :rules="rules" label-width="86px">
        <el-form-item label="排序" prop="sort">
          <el-input placeholder="排序" v-model.trim="detailForm.sort"></el-input>
        </el-form-item>
          <el-form-item label="是否显示" prop="display">
          <el-select v-model="detailForm.display" placeholder="是否显示">
              <el-option key="1" label="是" value="1">是</el-option>
              <el-option key="0" label="是" value="0">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扩展字段" prop="extend">
          <el-input placeholder="扩展字段" v-model.trim="detailForm.extend"></el-input>
        </el-form-item>
      </el-form>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="fl_submit">确定</el-button>
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
      detailForm: {
        id:'',
        navId:'',
        sort:'',
        display:'',
        extend:'',
      },
      rules: {
        sort: [{
          required: true,
          message: '排序不能为空',
          trigger: 'blur'
        }],
        display: [{
          required: true,
          message: '显示不能为空',
          trigger: 'blur'
        }],
        extend: [{
          required: true,
          message: '扩展字段不能为空',
          trigger: 'blur'
        }]
      },
      siteId:null,
      id:null,
      navId:null,
      isAdd:true
    }
  },
  created(){
    
  },
  methods: {
    modify(id,navId){
      this.id=id;
      this.navId=navId;
      this.visible = true;
    },
    fl_submit(){
      this.$refs.detailForm.validate((valid) => {
        if(valid){
            this.detailForm.navId=this.navId;
            this.detailForm.id=this.id;
            service.mn_modify(this.detailForm).then((res) => {
                if(res.data.code==200){
                    this.$message.success('修改成功');
                    this.visible = false;
                }else{
                    this.$message.error('修改失败');
                }
            }).catch(() => {
                
            });
        }else{
          console.log('error submit');
        }
      })
    },
    close() {
      this.detailForm = {};
      this.visible = false;
    },
  }
}
</script>

<style lang="less">
</style>
