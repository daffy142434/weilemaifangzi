<template lang="html">
  <div class="nav">
  <div class="nav-search">
    <el-autocomplete
      class="inline-input"
      v-model="inputVal"
      :fetch-suggestions="querySearch"
      placeholder=""
      @select="inputSelect"
    >
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
    </el-autocomplete>
  </div>
  <el-menu
    default-active="$store.state.activeMenuIndex"
    class="el-menu-vertical-demo"
    theme="dark"
    @select="handleSelect"
    @open="handleOpen"
    ref="menu"
  >
    <el-submenu index="1">
      <template slot="title"><i class="icon-menu el-icon-1"></i>CMS内容管理</template>
      <el-menu-item index="todo">文章管理</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title"><i class="icon-menu el-icon-1"></i>CMS客户管理</template>
      <el-menu-item index="customlist">客户总览</el-menu-item>
      <el-menu-item index="customcontracted">已签约客户</el-menu-item>
      <el-menu-item index="followremind">跟进提醒</el-menu-item>
      <el-menu-item index="followrecord">跟进记录</el-menu-item>
      <el-menu-item index="custompool">客户池</el-menu-item>
      <el-menu-item index="pendingcontract">待审核合同</el-menu-item>
    </el-submenu>
    <el-submenu index="1">
      <template slot="title"><i class="icon-menu el-icon-1"></i>系统设置</template>
      <el-menu-item index="department">部门管理</el-menu-item>
      <el-menu-item index="post">岗位管理</el-menu-item>
      <el-menu-item index="employee">员工管理</el-menu-item>
    </el-submenu>
    
    <el-submenu index="2">
      <template slot="title"><i class="icon-menu el-icon-1"></i>站点管理</template>
      <el-menu-item index="station">站点管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title"><i class="icon-menu el-icon-1"></i>站点菜单管理</template>
      <el-menu-item index="stationMenu">站点菜单管理</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title"><i class="icon-menu el-icon-1"></i>站点导航管理</template>
      <el-menu-item index="stationNavigation">站点导航管理</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title"><i class="icon-menu el-icon-1"></i>站点广告管理</template>
      <el-menu-item index="stationAd">站点广告管理</el-menu-item>
    </el-submenu>
    <!-- <el-submenu index="1" v-if="$store.state.powers.includes('workbench:manage')">
      <template slot="title"><i class="icon-menu el-icon-1"></i>我的工作台</template>
      <el-menu-item index="workbench" >XXX</el-menu-item>
    </el-submenu> -->
    <!-- <el-submenu index="2" v-if="$store.state.powers.includes('product_center:manage')">
      <template slot="title"><div><i class="icon-menu el-icon-2"></i><span>产品中心</span></div></template>
      <el-menu-item index="goods" v-if="$store.state.powers.includes('product:manage')">本地产品库</el-menu-item>
      <el-menu-item index="onlineGoods" v-if="$store.state.powers.includes('online_product:manage')">在线产品库</el-menu-item>
      <el-menu-item index="variant" v-if="$store.state.powers.includes('product_variant:manage')">变体维护</el-menu-item>
      <el-menu-item index="22" v-if="$store.state.powers.includes('online_product_log:manage')">在线商品日志</el-menu-item>
      <el-menu-item index="createOnlineSku" v-if="$store.state.powers.includes('generate_online_sku:manage')">生成在线SKU</el-menu-item>
    </el-submenu>
    <el-submenu index="3" v-if="$store.state.powers.includes('order_center:manage')">
      <template slot="title"><i class="icon-menu el-icon-3"></i>订单中心</template>
      <el-menu-item index="amaOrder" v-if="$store.state.powers.includes('order:ama_manage')">订单查询</el-menu-item>
    </el-submenu>
    <el-submenu index="4" v-if="$store.state.powers.includes('storage_center:manage')">
      <template slot="title"><i class="icon-menu el-icon-4"></i>仓储物流中心</template>
      <el-menu-item index="warehouse" v-if="$store.state.powers.includes('local_storage:manage')">中央仓库管理</el-menu-item>
      <el-menu-item index="fbaShopsList" v-if="$store.state.powers.includes('fba_storage:manage')">亚马逊库存</el-menu-item>
      <el-menu-item index="purchaseManage" v-if="$store.state.powers.includes('purchase_manage:manage')">采购管理</el-menu-item>
      <el-menu-item index="operateLog" v-if="$store.state.powers.includes('storage_operation_log:manage')">仓库操作日志</el-menu-item>
      <el-menu-item index="43" v-if="$store.state.powers.includes('inventory_file:manage')">备货档案</el-menu-item>
      <el-menu-item index="44" v-if="$store.state.powers.includes('purchase:manage')">采购日记</el-menu-item>
      <el-menu-item index="45" v-if="$store.state.powers.includes('fba_first_leg:manage')">FBA头程</el-menu-item>
      <el-menu-item index="purchaseAnalyze" v-if="$store.state.powers.includes('purchase_analyze_data:manage')">采购报表</el-menu-item>
      <el-menu-item index="storageAnalyze" v-if="$store.state.powers.includes('storage_analyze_data:manage')">库存报告</el-menu-item>
      <el-menu-item index="amazonCargo" v-if="$store.state.powers.includes('ama_cargo:manage')">亚马逊库件</el-menu-item>
      <el-menu-item index="exceptionHanding" v-if="$store.state.powers.includes('storage_exception_data:manage')">库存核销异常处理</el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="$store.state.powers.includes('product_devp_center:manage')">
      <template slot="title"><i class="icon-menu el-icon-5"></i>产品开发中心</template>
      <el-menu-item index="51" v-if="$store.state.powers.includes('product_devp_file:manage')">产品开发档案</el-menu-item>
      
      <el-submenu index="511" v-if="$store.state.powers.includes('product_devp_center:manage')">
        <template slot="title">产品测算</template>
        <el-menu-item index="budget" v-if="$store.state.powers.includes('product_devp_estimate:manage')">初始化</el-menu-item>
        
        <el-menu-item index="budgetMain" v-if="$store.state.powers.includes('product_devp_estimate:main_manage')">商品建模画像</el-menu-item>
        <el-menu-item index="budgetAgain" v-if="$store.state.powers.includes('product_devp_estimate:second_manage')">二次探索</el-menu-item>
        <el-menu-item index="iterativePrediction" v-if="$store.state.powers.includes('product_iterative_prediction:manage')">商品迭代预测</el-menu-item>
        <el-menu-item index="priceModel" v-if="$store.state.powers.includes('pricing_model:manage')">定价模型</el-menu-item>
      </el-submenu>
      <el-submenu index="512">
        <template slot="title">选品集群监控</template>
        <el-menu-item index="operationMonitoring" v-if="$store.state.powers.includes('product_monitoring_model:manage')">模型运算监控</el-menu-item>
      </el-submenu>
      <el-submenu index="513">
        <template slot="title">潜力预测</template>
        <el-menu-item index="newProductionAll" v-if="$store.state.powers.includes('product_appraisal_new:manage')">新品</el-menu-item>
        <el-menu-item index="newProductionBetter" v-if="$store.state.powers.includes('product_appraisal_excellent:manage')">优品</el-menu-item>
      </el-submenu>
      
      <el-menu-item index="modelDraft" v-if="$store.state.powers.includes('modeling_process_draft:manage')">建模过程草稿</el-menu-item>
      <el-menu-item index="" v-if="$store.state.powers.includes('one_key_grab:manage')"><a class="out-url" href="http://cc.co.cinbos.com:9000" target="_blank">一键抓取评论</a></el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="$store.state.powers.includes('customer_service_center:manage')">
      <template slot="title"><i class="icon-menu el-icon-6"></i>客户服务中心</template>
      <el-menu-item index="officialList" v-if="$store.state.powers.includes('ama_gov_mail:manage')">官方邮件</el-menu-item>
      <el-menu-item index="61" v-if="$store.state.powers.includes('customer_batch_mail:manage')">群发客户邮件</el-menu-item>
      <el-menu-item index="customerQuesition" v-if="$store.state.powers.includes('customer_mail_log:manage')">客户往来记录</el-menu-item>
      <el-menu-item index="63" v-if="$store.state.powers.includes('customer_service_param:manage')">客服参数设置</el-menu-item>
      <el-menu-item index="shopServiceMail" v-if="$store.state.powers.includes('shop_service_mail:manage')">店铺客服邮箱设置</el-menu-item>
    </el-submenu>
    <el-submenu index="7" v-if="$store.state.powers.includes('operate_center:manage')">
      <template slot="title"><i class="icon-menu el-icon-7"></i>运营支持中心</template>
      <el-menu-item index="productAds" v-if="$store.state.powers.includes('advertisement:manage')">广告投放</el-menu-item>
      <el-menu-item index="reverseSell" v-if="$store.state.powers.includes('listing_follow:manage')">反跟卖行动</el-menu-item>
      <el-menu-item index="review" v-if="$store.state.powers.includes('review_monitor:manage')">Review监控</el-menu-item>
      <el-menu-item index="feedback" v-if="$store.state.powers.includes('feedback_monitor:manage')">Feedback监控</el-menu-item>
      <el-menu-item index="76" v-if="$store.state.powers.includes('qa_monitor:manage')">QA监控</el-menu-item>
      <el-menu-item index="amaOnlineProductOutlier" v-if="$store.state.powers.includes('online_product_outlier:manage')">异常商品</el-menu-item>
      <el-menu-item index="exploreKeyword" v-if="$store.state.powers.includes('explore_keyword:manage')">SearchTerm编排</el-menu-item>
      <el-submenu index="77" v-if="$store.state.powers.includes('exchange_rate:manage')">
        <template slot="title">汇率维护</template>
        <el-menu-item index="currentExchange" v-if="$store.state.powers.includes('exchange_rate_current:manage')">当前汇率</el-menu-item>
        <el-menu-item index="exchangeLog" v-if="$store.state.powers.includes('exchange_rate_history:manage')">维护历史</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-submenu index="8" v-if="$store.state.powers.includes('data_support:manage')">
      <template slot="title"><i class="icon-menu el-icon-8"></i>数据分析中心</template>
      <el-menu-item index="realtimeSales" v-if="$store.state.powers.includes('shop_prduce_salse:manage')">实时销量</el-menu-item>
      <el-menu-item index="orderMap" v-if="$store.state.powers.includes('order_analyze_data:manage')">订单地图</el-menu-item>
      <el-menu-item index="onlineProductAnalyze" v-if="$store.state.powers.includes('product_analyze_data:manage')">在线商品性能</el-menu-item>
      
      <el-menu-item index="84" v-if="$store.state.powers.includes('shop_analyze_data:manage')">店铺报告</el-menu-item>
      <el-menu-item index="85" v-if="$store.state.powers.includes('sales_performance_data:manage')">人员业绩报告</el-menu-item>
      <el-menu-item index="corporateReport" v-if="$store.state.powers.includes('corporate_performance_data:manage')">亚马逊财报</el-menu-item>
      <el-menu-item index="returnOrder" v-if="$store.state.powers.includes('return_order:ama_manage')">退货情况</el-menu-item>
      <el-menu-item index="amazonProfit" v-if="$store.state.powers.includes('ama_product_profit:manage')">亚马逊商品利润</el-menu-item>
    </el-submenu>
    <el-submenu index="9" v-if="$store.state.powers.includes('message_center:manage')">
      <template slot="title"><i class="el-icon-menu"></i>通知平台</template>
      <el-menu-item index="91" v-if="$store.state.powers.includes('voice_service_param:manage')">语音总控参数</el-menu-item>
      <el-menu-item index="92" v-if="$store.state.powers.includes('message_service_param:manage')">发件服务器设置</el-menu-item>
    </el-submenu>
    <el-submenu index="10" v-if="$store.state.powers.includes('wiki:manage')">
      <template slot="title"><i class="el-icon-menu"></i>知识库</template>
      <el-menu-item index="101">知识库管理</el-menu-item>
    </el-submenu>
    <el-submenu index="12" v-if="$store.state.powers.includes('financial_warehouse:all')">
      <template slot="title"><i class="icon-menu el-icon-9"></i>小金库</template>
      <el-menu-item index="vaultManage" v-if="$store.state.powers.includes('financial_warehouse:manage')">小金库管理</el-menu-item>
    </el-submenu>
    <el-submenu index="11">
      <template slot="title"><i class="icon-menu el-icon-10"></i>系统设置</template>
      <el-menu-item index="111" v-if="$store.state.powers.includes('crawler:manage')">爬虫总控</el-menu-item>
      <el-menu-item index="112" v-if="$store.state.powers.includes('big_data:manage')">大数据总控</el-menu-item>
      <el-submenu index="113">
        <template slot="title">ERP总控</template>
        <el-menu-item index="developer" v-if="$store.state.powers.includes('ama_devp:manage')">开发者账号管理</el-menu-item>
        <el-menu-item index="member" v-if="$store.state.powers.includes('member:main_manage')">主用户管理</el-menu-item>
        <el-menu-item index="submember" v-if="$store.state.powers.includes('member:sub_manage')">子用户管理</el-menu-item>
        <el-menu-item index="power" v-if="$store.state.powers.includes('member:role_manage')">角色管理</el-menu-item>
        <el-menu-item index="company" v-if="$store.state.powers.includes('member:company_manage')">公司管理</el-menu-item>
        <el-menu-item index="modifyPwd">修改密码</el-menu-item>
        <el-menu-item index="systemBulletin" v-if="$store.state.powers.includes('system:bulletin')">系统公告</el-menu-item>
      </el-submenu>
    </el-submenu> -->
    <!-- <el-menu-item index="member" v-if="$store.state.powers.includes('member:main_manage') && false"><i class="el-icon-star-on"></i>海捷紫华总控</el-menu-item>
    <el-submenu index="order" v-if="$store.state.powers.includes('order:manage') && false">
      <template slot="title"><i class="el-icon-menu"></i>订单管理</template>
      <el-menu-item index="amaOrder" v-if="$store.state.powers.includes('order:ama_manage')">亚马逊订单</el-menu-item>
    </el-submenu>
    <el-submenu index="onlineGoods" v-if="$store.state.powers.includes('online_product:manage') && false">
      <template slot="title"><i class="el-icon-menu"></i>在线产品</template>
      <el-menu-item index="onlineGoods" v-if="$store.state.powers.includes('online_product:ama_manage')">亚马逊产品</el-menu-item>
    </el-submenu>
    <el-submenu index="myGoods" v-if="$store.state.powers.includes('product:all') && false">
      <template slot="title"><i class="el-icon-menu"></i>我的产品库</template>
      <el-menu-item index="goods" v-if="$store.state.powers.includes('product:manage')">产品维护</el-menu-item>
      <el-menu-item index="sku" v-if="$store.state.powers.includes('product:sku')">SKU认领</el-menu-item>
    </el-submenu>
    
    <el-submenu index="system" v-if="$store.state.powers.includes('system_setting:all') && false">
      <template slot="title"><i class="el-icon-menu"></i>系统设置</template>
      <el-menu-item index="power" v-if="$store.state.powers.includes('member:role_manage')">角色权限管理</el-menu-item>
      <el-menu-item index="company" v-if="$store.state.powers.includes('member:company_manage')">公司管理</el-menu-item>
      <el-menu-item index="submember" v-if="$store.state.powers.includes('member:sub_manage')">子用户管理</el-menu-item>
      <el-menu-item index="modifyPwd">修改密码</el-menu-item>
    </el-submenu> -->
  </el-menu>
  </div>
</template>

<script>

import menuExt from './index.menu.ext.data';
import navData from '@/lib/navData';
function findSubmenu(submenus, index, fn) {
  const keys = Object.keys(submenus);
  if (keys.length) {
    if (submenus[index]) {
      fn(true);
    } else if (submenus.submenus) {
      findSubmenu(submenus.submenus, index, fn);
    } else {
      fn(false);
    }
  } else {
    fn(false);
  }
}

function serializeRouterComponent(router, fn) {
  let routerMap = {};

  function routerEach(route) {
    if (route.component) {
      routerMap[route.name] = route.component;
    }
    if (route.children) {
      serializeRouterComponent(route.children, (ret) => {
        routerMap = {...routerMap, ...ret};
      });
    }
  }
  router.forEach(routerEach);
  fn && fn(routerMap);
};

export default {
  data() {
    return {
      inputVal:"",
      navData:[]
    };
  },
  mounted() {
    let routeName = this.$route.name;

    serializeRouterComponent(this.$router.options.routes, (routerMap) => {
      this.$emit('loadRouterMap', routerMap);
    });
    this.loadMenuData();

    this.setActiveMenu(this.$route.name);
    this.$router.beforeEach((to, form, next) => {
      this.handleOpen(to.name);
      this.setActiveMenu(to.name);
      next();
    });

    for(let i=0;i<navData.length;i++){
      if(navData[i].index&&this.$store.state.powers.includes(navData[i].power)){
        this.navData.push({value:navData[i].name,index:navData[i].index})
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var results = queryString ? this.navData.filter(this.createFilter(queryString)) : this.navData;
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    inputSelect(item){
      this.$emit('select', item.index);
      // this.$router.push({name:item.index});
    },
    setActiveMenu(index) {
      this.$refs.menu.activeIndex = this.findParent(index);
      this.$refs.menu.initOpenedMenu();
    },
    loadMenuData() {
      const menu = this.$refs.menu;
      const items = menu.items;
      const routerNameMap = {};
      Object.keys(items).map((key) => {
        routerNameMap[key] = {
          label: items[key].$el.innerHTML
        };
      });
      this.menuMap = {
        ...routerNameMap,
        ...menuExt
      }
      this.$emit('loadMenuData', routerNameMap);
    },
    findParent(name) {
      let parentName = name;
      let tmpParentName;
      const {menuMap} = this;

      while((tmpParentName = menuMap[parentName].parent)) {
        parentName = tmpParentName;
      }
      return parentName;
    },
    handleSelect(index, indexPath, item) {
      if(Number.isInteger(+index)) {
        return;
      }
      this.$emit('select', index);
    },
    handleOpen(index) {
      let isSubMenu;
      let submenus = this.$refs.menu.submenus;

      Object.keys(submenus).forEach((key) => {
        findSubmenu(submenus[key].submenus, index, (isFindSubMenu) => {
          if (isFindSubMenu) {
            isSubMenu = true;
          }
        });
      });
      if (!isSubMenu) {
        if (this.menuMap[index] && this.menuMap[index].parent) {
          index = this.menuMap[index].parent;
        }
        this.$refs.menu.openedMenus = [index];
      }
    },
  }
}
</script>
<style lang="less">
.el-menu {
  background: #364761;
  .el-menu {
    background: #2c374a;
  }
  .el-submenu__title, .el-menu-item {
    color: #fff;
  }
  .el-submenu__title {
    &:hover {
      background: #627898;
    }
    i {
      color: #fff;
    }
  }
  .el-menu-item {
    &:hover {
      background: #313d52;
    }
    &:focus, &.is-active {
      color: #409EFF;
      background: none;
    }
    &.is-active {
      &:hover {
        background: #313d52;
      }
    }
  }
}
</style>
<style scoped>
.icon-menu{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.el-icon-1{
  background: url(../img/sprite.png) no-repeat -120px 0;
}
.el-icon-2{
  background: url(../img/sprite.png) no-repeat -40px 0;
}
.el-icon-3{
  background: url(../img/sprite.png) no-repeat -60px 0;
}
.el-icon-4{
  background: url(../img/sprite.png) no-repeat 0 0;
}
.el-icon-5{
  background: url(../img/sprite.png) no-repeat -20px 0;
}
.el-icon-6{
  background: url(../img/sprite.png) no-repeat -80px 0;
}
.el-icon-7{
  background: url(../img/sprite.png) no-repeat -180px 0;
}
.el-icon-8{
  background: url(../img/sprite.png) no-repeat -100px 0;
}
.el-icon-9{
  background: url(../img/sprite.png) no-repeat -160px 0;
}
.el-icon-10{
  background: url(../img/sprite.png) no-repeat -140px 0;
}
.inline-input{
  margin:10px 11px;
}
.nav{
  padding-top: 60px;
  position: relative;
}
.nav-search{
  height: 60px;
  background: #fff;
  position: fixed;
  z-index: 999;
  width: 212px;
  top:50px;
  left:0;
  box-sizing: border-box;
  background: #1f2d3d;
}
.out-url{
  color: #fff;
  text-decoration: none;
}

</style>