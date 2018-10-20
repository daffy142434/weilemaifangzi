<template lang="html">
  <div class="page">
    <div class="page-hd">
      <div class="page-hd-l">
        未  来  方  舟
        <span style="font-size: 14px;"> v1.0 BETA</span>
      </div>
      <detection></detection>
      <div class="page-hd-c">
        <div class="exchange-content" v-show="isExchangeOpen"><div class="arrow"></div><div class="exchange-content-inner">
          <div class="item" v-for="item in exchangeList" v-if="item.originalCurrency!='CNY'"><span class="num" >1</span> {{item.originalCurrencyName}}（{{item.originalCurrency}}）=<span class="num">{{item.cnyExchangeRate}}</span> 人民币</div>
          </div>
        </div>
        <div class="exchange" @click="exchangeOpen">
          <!-- <i :class="[isExchangeOpen?'el-icon-arrow-left':'el-icon-arrow-right']"></i>  -->
          <i class="icon-exchange"></i></div>
      </div>
      
      <div class="page-hd-r">
        <el-dropdown trigger="hover" class="userinfo">
					<span class="el-dropdown-link userinfo-inner">您好，{{$store.state.userInfo && $store.state.userInfo.name}}( {{$store.state.userInfo && $store.state.userInfo.mainUserName}} )<i class="el-icon-caret-bottom el-icon--right"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="modifyPwd">修改密码</el-dropdown-item>
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
      </div>
    </div>
    <div class="page-bd">
      <div class="page-sider">
        <sider
          @select="handleSelect"
          @loadMenuData="handleLoadMenuData"
          @loadRouterMap="handleLoadRouterMap"
        ></sider>
      </div>
      <div class="page-main">
        <!-- <router-view></router-view> -->
        <page-tabs ref="pageTabs"></page-tabs>
      </div>
    </div>
    <bulletin-dialog ref="bulletinDialog"></bulletin-dialog>
  </div>
</template>

<script>
import BulletinDialog from '@/components/bulletin-dialog';
import events from '@/lib/events';
import Sider from './index.sider.component';
import PageTabs from './index.page.tabs.component';
import Detection from './index.detection.component';
import ajax from '../lib/ajax';

export default {
  components: {
    Sider,
    PageTabs,
    BulletinDialog,
    Detection,
  },
  data() {
    return {
      userType: window.userType,
      isExchangeOpen:false,
      exchangeList:[],
      exchangeVal:""
    };
  },
  mounted() {
    let echarts = require('echarts');
    events.addEventListener('global', () => {
    });
    this.$refs.bulletinDialog.load();
    this.getExchange();
  },
  methods: {
    exchangeOpen(){
      this.isExchangeOpen=!this.isExchangeOpen;
    },
    getExchange(){
      ajax.post('/exchange_rate/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.exchangeList=response.data.data;

          sessionStorage.setItem('exchange',JSON.stringify(this.exchangeList));
        }
      })
    },
    handleSelect(name) {
      this.$refs.pageTabs.addTab(name);
    },
    modifyPwd() {
      this.$router.push({name: 'modifyPwd'});
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      location.href = '/security/logout';
    },
    handleLoadMenuData(routerNameMap) {
      this.$refs.pageTabs.setRouterNameMap(routerNameMap);
    },
    handleLoadRouterMap(routerComponentMap) {
      this.$refs.pageTabs.setRouterComponentMap(routerComponentMap);
    }
  }
}
</script>

<style lang="less">
  @headerHeight: 50px;
  .page {
    width: 100%;
    height: 100%;
    &-hd {
      height: @headerHeight;
      line-height: @headerHeight;
      background: #4f6586 !important;
      color: #fff;
      display: flex;
      // overflow: hidden;
      position: relative;
      &-l {
        font-size: 20px;
        width: 230px;
        text-align: center;
        padding: 0 24px;
      }
      &-c {
        flex: 1;
      }
      &-r {
        // width: 350px;
        text-align: right;
        padding-right: 30px;
        a {
          margin-left: 10px;
          color: #FF4949;
          cursor: pointer;
        }
      }
    }
    &-bd {
      position: absolute;
      left: 0;
      right: 0;
      top: @headerHeight;
      bottom: 0;
      display: flex;
    }
    &-sider {
      overflow-y: scroll;
      width: 218px;
      background: #1f2d3d;
      position: relative;
      .el-submenu {
        padding: 0;
      }
    }
    &-main {
      flex: 1;
      overflow: auto;
    }
    .userinfo {
      text-align: right;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color:#fff;
      }
    }
  }
</style>
<style scoped lang="less">
.page-hd-c{
  position:relative;
  padding-right: 80px;
  color: #ff0;
}
.exchange-content{
  position: absolute;
  top:45px;
  left:90%;
  width:210px;
  padding:5px;
  z-index:999;
  background: rgba(31, 45, 61,0.5);
  .arrow{
    position: absolute;
    top:-8px;
    left: 80px;
    width:22px;
    height: 15px;
    background:url(../img/arrow-up.png) 0 0 no-repeat;
    z-index: 2;
  }
}
.exchange-content-inner{
  transition:width .2s;
  position: relative;
  z-index: 1;
}
.exchange-content-inner>.item{
  width:100%;
  padding-left:10px;
  background:#0b1837;
  color:#fff;
  line-height:35px;
  box-sizing:border-box;
  font-size:14px;
  border:1px solid #fff;
  border-bottom:none;
  &:last-child{
    border-bottom:1px solid #fff;
  }
}
.exchange-content-inner>.item>.num{
  color: #fff000;
}
.exchange{
  
  cursor: pointer;
  width: 100px;
  text-align: left;
  position: absolute;
  top:0;
  right: 0;
  
}
.icon-exchange{
  display: inline-block;
  width: 80px;
  height: 20px;
  background:url(../img/exchange.png) no-repeat 0 0;
  background-size: 100% 100%;
  vertical-align: middle;
  margin-top:-3px;
  margin-right: 3px;
  margin-left:3px;
}
</style>
