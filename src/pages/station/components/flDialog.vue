<template lang="html">
  <el-dialog
    title="友情链接"
    width="40%"
    :visible.sync="visible"
    @close="close"
  >
    <el-tabs type="border-card">
      <el-form ref="flDetailForm" :model="flDetailForm" :rules="rules" label-width="86px">
        <el-form-item label="名称" prop="name">
          <el-input placeholder="名称" v-model.trim="flDetailForm.name"></el-input>
        </el-form-item>
        <el-form-item label="logo地址" prop="logo">
          <el-input placeholder="logo地址" v-model.trim="flDetailForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="linkUrl">
          <el-input placeholder="链接" v-model.trim="flDetailForm.linkUrl"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input placeholder="描述" v-model.trim="flDetailForm.description"></el-input>
        </el-form-item>
          <el-form-item label="是否显示" prop="display">
          <el-select v-model="flDetailForm.display" placeholder="是否显示">
              <el-option key="1" label="是" value="1">是</el-option>
              <el-option key="0" label="是" value="0">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input placeholder="排序" v-model.trim="flDetailForm.sort"></el-input>
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
      flDetailForm: {
        siteId:'',
        name:'',
        logo:'',
        linkUrl:'',
        description:'',
        display:'',
        sort:'',
      },
      rules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        logo: [{
          required: true,
          message: 'logo地址不能为空',
          trigger: 'blur'
        }],
        linkUrl: [{
          required: true,
          message: '链接不能为空',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '描述不能为空',
          trigger: 'blur'
        }],
        display: [{
          required: true,
          message: '请选择是否显示',
          trigger: 'blur'
        }],
        sort: [{
          required: true,
          message: '排序不能为空',
          trigger: 'blur'
        }]
      },
      siteId:null,
      id:null,
      title:'新增友情链接',
      isAdd:true
    }
  },
  methods: {
   add(siteId) {
      this.isAdd=true;
      this.title='新增友情链接';
      this.siteId=siteId;
      this.visible = true;
    },
    modify(id){
      this.isAdd=false;
      this.title='修改友情链接';
      this.id=id;
      this.visible = true;
    },
    fl_submit(){
      this.$refs.flDetailForm.validate((valid) => {
        if(valid){
          // 新增友情链接
          if(this.isAdd){
            this.flDetailForm.siteId=this.siteId;
            service.fl_add(this.flDetailForm).then((res) => {
              if(res.data.code==200){
                this.$message.success('新增成功');
                this.visible = false;
              }else{
                this.$message.error('新增失败');
              }
            }).catch(() => {
              
            });
          }else{
            // 修改友情链接

          }
          
        }else{
          console.log('error submit');
        }
      })
    },
    close() {
      this.flDetailForm = {};
      this.visible = false;
    },
  }
}
</script>

<style lang="less">
</style>
