<template lang="html">
  <el-dialog
    title="站点详细信息"
    width="90%"
    :visible.sync="visible"
    @close="close"
  >
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane :label="title">
        <el-form ref="stationDetailForm" :rules="rules" :model="stationDetailForm" label-width="86px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="公司名称" prop="companyName">
                <el-input placeholder="公司名称" v-model.trim="stationDetailForm.companyName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司地址" prop="companyAddress">
                <el-input placeholder="公司地址" v-model.trim="stationDetailForm.companyAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人" prop="contact">
                <el-input placeholder="联系人" v-model.trim="stationDetailForm.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系邮箱" prop="contactEmail">
                 <el-input placeholder="联系邮箱" v-model.trim="stationDetailForm.contactEmail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="联系电话" prop="contactNumber">
                <el-input placeholder="联系电话" v-model.trim="stationDetailForm.contactNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="版权" prop="copyright">
                <el-input placeholder="版权" v-model.trim="stationDetailForm.copyright"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="域名" prop="domain">
                <el-input placeholder="域名" v-model.trim="stationDetailForm.domain"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备案" prop="filing">
                <el-input placeholder="备案" v-model.trim="stationDetailForm.filing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="logo" prop="logo">
                <el-input placeholder="logo" v-model.trim="stationDetailForm.logo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标识" prop="name">
                <el-input placeholder="标识" v-model.trim="stationDetailForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="名称" prop="title">
                <el-input placeholder="名称" v-model.trim="stationDetailForm.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row v-for="(item,index) in stationDetailForm.settingsList" :key="item.id">
            <el-col :span="4">
              <el-form-item label="配置名称">
                <el-input placeholder="配置名称" v-model.trim="item.settingsTitle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="配置标识">
                <el-input placeholder="配置标识" v-model.trim="item.settingsCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="配置类型">
                <el-input placeholder="配置类型" v-model.trim="item.settingsType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="配置值">
                <el-select v-model.trim="item.settingsValue" placeholder="请选择">
                  <el-option :key="'text'" label="text" :value="'text'"></el-option>
                  <el-option :key="'file'" label="file" :value="'file'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用途描述">
                <el-input placeholder="用途描述" v-model.trim="item.settingsDesc"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="2">
              <div style="margin:3px 0 0 2px;">
                <el-button icon="el-icon-minus" size="small" v-if="index > 0" @click="settingListReduce(item,index)" circle></el-button>
                <el-button icon="el-icon-plus" size="small" v-if="(index+1) == stationDetailForm.settingsList.length" @click="settingListAdd" circle></el-button>
              </div>
            </el-col>
          </el-row>
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
        companyName:'',
        title:'',
        name:'',
        domain:'',
        logo:'',
        filing:'',
        copyright:'',
        contactEmail:'',
        contact:'',
        contactNumber:'',
        companyAddress:'',
        settingsList :[
          {
            settingsTitle:'',
            settingsCode:'',
            settingsType:'',
            settingsDesc:'',
            settingsValue:'',
          },
        ]
      },
      rules: {
        companyName: [{
          required: true,
          message: '公司名称不能为空',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '标识不能为空',
          trigger: 'blur'
        }],
        domain: [{
          required: true,
          message: '域名不能为空',
          trigger: 'blur'
        }],
        logo: [{
          required: true,
          message: 'logo不能为空',
          trigger: 'blur'
        }],
        filing: [{
          required: true,
          message: '备案不能为空',
          trigger: 'blur'
        }],
        copyright: [{
          required: true,
          message: '版权不能为空',
          trigger: 'blur'
        }],
        contactEmail: [{
          required: true,
          message: '联系邮箱不能为空',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '联系人不能为空',
          trigger: 'blur'
        }],
        contactNumber: [{
          required: true,
          message: '联系电话不能为空',
          trigger: 'blur'
        }],
        companyAddress: [{
          required: true,
          message: '公司地址不能为空',
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
        this.title='修改站点信息';
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
        this.title='新增站点信息';
        this.visible = true;
      }
    },
    modify(){
      this.$refs.stationDetailForm.validate((valid) => {
        if(valid){
          console.log(this.stationDetailForm);
          if(this.id != undefined){
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
