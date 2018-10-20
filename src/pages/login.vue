<template lang="html">
  <div class="auth-form login-container">
    <el-row>
      <el-col :span="12">
        <img class="logo" src="../img/logo.jpg" />
      </el-col>
      <el-col :span="12">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="0px">
          <el-form-item label="">
            <h3 class="title">ERP</h3>
          </el-form-item>
          <el-form-item label="" prop="loginName">
            <el-input v-model.trim="formData.loginName"  placeholder="登录名" @keyup.enter.native="login('formData')">
              <!-- <el-button slot="prepend" icon="el-icon-search"></el-button> -->
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="pwd">
            <el-input type="password" v-model.trim="formData.pwd"  placeholder="密码" @keyup.enter.native="login('formData')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="long" type="primary" @click="login('formData')" :loading="loading">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="footer">XXXX有限公司 版权所有</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ajax from '../lib/ajax';
import queryString from 'query-string';
import 'lib/promiseExt';
import Member from '@/pages/member/services';

const member = new Member();

export default {
  data() {
    return {
      loading: false,
      formData: {
        loginName: '',
        pwd: '',
      },
      rules: {
        loginName: [{
          required: true,
          message: '登录名不能为空',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }]
      }
    }
  },

  created() {
    this.$store.dispatch('getToken');
  },

  methods: {
    login(name) {
      this.$refs[name].validate((valid) => {
        let loginName = this.formData.loginName;
        if (valid) {
          this.loading = true;
          ajax.post(
            '/security/login',
            Object.assign({token: this.$store.state.token}, this.formData)
          ).then(() => {
            this.$store.commit('setUser', {loginName});           
            this.$router.push({name: 'station'});
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
          
          // .then((response) => {
          //   return member.saveMember();
          // }).then(({powers, userInfo}) => {
          //   const {loginName} = userInfo;
          //   window.userType = userInfo.userType;
          //   this.$store.commit('setUser', {loginName});
          //   this.$store.commit('setUserInfo', userInfo);
          //   this.$store.commit('setPowers', powers);
          //   this.$router.push({name: 'station-manage'});
          //   this.loading = false;
          // }).catch(() => {
          //   this.loading = false;
          // });
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
  .auth-form{
    padding-top: 130px;
    width: 300px;
    margin: 0 auto;
  }
  .long {
    width: 100%;
  }
  .login-title {
    margin: 0;
    text-align: center;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 150px auto;
    width: 480px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 15px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .footer {
    margin: 25px 0 15px 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #ccc;
    bottom: 45px;
  }
  .logo {
    width: 223px;
    padding-top: 20px;
  }
</style>
