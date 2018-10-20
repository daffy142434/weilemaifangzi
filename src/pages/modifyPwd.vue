<template lang="html">
  <el-row style="margin-top: 20px;">
    <el-col :span="12" :offset="1">
      <el-form :model="formData" :rules="rules" ref="modifyPwdForm" label-width="80px">
        <el-form-item label="原密码" prop="pwd">
          <el-input type="password" v-model="formData.pwd"  placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="formData.newPwd"  placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input type="password" v-model="formData.confirmPwd"  placeholder="请再次输入新密码确认"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="long" type="primary" @click="modifyPwd" :loading="loading">确 认</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import ajax from '../lib/ajax';
import queryString from 'query-string';

export default {
  data() {
    return {
      loading: false,
      formData: {
        pwd: '',
        newPwd: '',
      },
      rules: {
        pwd: [{
          required: true,
          message: '原密码不能为空',
          trigger: 'blur'
        }],
        confirmPwd: [{
          required: true,
          message: '确认新密码不能为空',
          trigger: 'blur'
        }],
        newPwd: [{
          required: true,
          message: '新密码不能为空',
          trigger: 'blur'
        }]
      }
    }
  },

  created() {
    this.$store.dispatch('getToken');
  },

  methods: {
    modifyPwd() {
      this.$refs.modifyPwdForm.validate((valid) => {
        if (valid) {
          if(this.formData.newPwd != this.formData.confirmPwd) {
            this.$message({
              showClose: true,
              message: '两次输入的新密码不一致，请重新输入',
              type: 'warning'
            });
            return;
          }
          this.loading = true;
          ajax.post('/members/edit_pwd', Object.assign({token: this.$store.state.token}, this.formData))
          .then((response) => {
            this.loading = false;
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              localStorage.clear();
              setTimeout(function() {
                location.hash = '/login';
              }, 1200);
            }
          })
          .catch(() => {
            this.loading = false;
          });
        }
      })
    },
  }
}
</script>
<style lang="less">
  body {
    background-color: #f9f9f9;
  }

</style>
