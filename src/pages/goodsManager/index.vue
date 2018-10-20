<template lang="html">
  <div class="goods-manager" v-loading="goodsInfo.loading">
    <div class="page-title">
      {{title}}
      <a @click="back">返回到产品列表</a>
    </div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="goodsInfo">
        <goodsInfo :data="goodsInfo"></goodsInfo>
      </el-tab-pane>
      <el-tab-pane label="关联SKU" name="connectSku">
        <connectSku :data="goodsInfo" :shops="shops"></connectSku>
      </el-tab-pane>
      <el-tab-pane label="商品描述" name="goodsDescription">
        <goodsDes :data="goodsInfo"></goodsDes>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import goodsInfo from './components/goodsInfo';
import connectSku from './components/connectSku';
import goodsDes from './components/goodsDes';
import store from './store';
import {mapState} from 'vuex';
import ajax from 'lib/ajax';
export default {
  data() {
    return {
      activeName: 'goodsInfo',
      action: 'goodsAdd',
      shops: []
    }
  },
  components: {
    goodsInfo,
    connectSku,
    goodsDes
  },
  computed: {
    title() {
      let result = '';
      switch(this.$router.currentRoute.name) {
        case 'goodsAddWithRelate': return '添加产品并关联SKU';
        case 'goodsAdd': return '添加产品';
        case 'goodsEdit': return '编辑产品';
        case 'goodsClone': return '克隆产品';
        default: return '添加产品';
      }
    },
    ...mapState({
      goodsInfo: (state) => {
        const {goodsManager} = state;
        if (goodsManager.goodsAction === 'goodsAddWithRelate') {
          if (goodsManager.relateGoodsInfo.isRelate) {
            return goodsManager.goodsInfo;
          }
          return goodsManager.relateGoodsInfo;
        } else {
          return goodsManager.goodsInfo;
        }
      }
    })
  },
  mounted() {
    if (this.$router.currentRoute.name === 'goodsAddWithRelate') {
      this.$store.commit('resetRelateGoodsInfo');
    } else {
      this.$store.commit('resetGoodsInfo');
    }
    this.$store.commit('setAction', {action: this.$router.currentRoute.name});
    if (this.$router.currentRoute.name === 'goodsAddWithRelate') {
      this.action = 'goodsAddWithRelate';
    }
    ajax.post('/shops/list_all')
      .then((res) => {
        this.shops = res.data.data;
        return res;
      }).then((res) => {
        let skuId;

        switch(this.$router.currentRoute.name) {
          case 'goodsEdit': case 'goodsClone':
            skuId = this.$route.params.skuId;
            this.$store.dispatch('getGoodsInfo', {skuId});
            break;
          case 'goodsAddWithRelate':
            skuId = this.$route.params.relateSkuId;
            const shops = this.shops;
            this.$store.dispatch('getOnlineGoodsInfo', {skuId, shops});
            break;
        }
      });
    this.$router.afterEach((to, form, next) => {
      let action;

      action = to.name;
      this.action = action;
      if (action) {
        this.$store.commit('setAction', {action: action});
      }
      this.goodsInfo;

      // next();
    });

    this.$store.dispatch('getCategoriesList');
  },
  methods: {
    back() {
      const {backHref} = this;
      location.href = this.$route.params.backHref;
    },
    handleTabClick(tab) {
      if(tab.name == 'goodsDescription') {
        for(let item of document.getElementsByClassName('quill-editor')) {
          item.style.height = (document.body.clientHeight * 0.6)+'px';
        }
        for(let item of document.getElementsByClassName('ql-container')) {
          item.style.height = (document.body.clientHeight * 0.53)+'px';
        }
      }
    },
  }
};
</script>

<style lang="less">
@import './style.less';
</style>
