<template lang="html">
  <div>
    <el-popover
      v-if="!isAllDetectionPass"
      v-model="visible"
      class="detection-popover"
      trigger="hover"
    >
      <ul class="list detection-list">
        <li v-if="!isOrderDetectionPass">
          <div class="detection-list-title">
            已下订单SKU未存在本地SKU
          </div>
          <div class="detection-list-aside">
            <el-button type="text" @click="handleOrderSolve">解决</el-button>
          </div>
          <div class="detection-list-des">
            您的部分订单所涉及的SKU没有关联到本地商品，因此导致ERP无法计算您的利润表。
          </div>
        </li>
        <li v-if="!isOnlineDetectionPass">
          <div class="detection-list-title">
            在线SKU未存在本地SKU
          </div>
          <div class="detection-list-aside">
            <el-button type="text" @click="handleShopSolve">解决</el-button>
          </div>
          <div class="detection-list-des">
            您的部分在售亚马逊在线商品没有关联到本地商品，因此导致ERP无法对在线商品进行更科学的管理。
          </div>
        </li>
        <li v-if="!isShopDetectionPass">
          <div class="detection-list-title">
            有{{companyCount}}个店铺连线异常
          </div>
          <div class="detection-list-aside">
            <el-button type="text" @click="handleCompanySolve">解决</el-button>
          </div>
          <div class="detection-list-des">
          </div>
        </li>
        <li v-if="!isEmailDetectionPass">
          <div class="detection-list-title">
            有{{emailCount}}个客服邮箱设置出现连线异常
          </div>
          <div class="detection-list-aside">
            <el-button type="text" @click="handleEmailSolve">解决</el-button>
          </div>
          <div class="detection-list-des">
            您的部分客服邮箱设置错误，因此导致ERP无法扫描获取您邮箱中的亚马逊相关信件。
          </div>
        </li>
      </ul>
      <div slot="reference" class="detection">
        <el-tag class="tag-fill" type="warning" size="small">
          <span class="el-icon-warning"></span>
          您的相关业务设置需要完善
        </el-tag>
      </div>
    </el-popover>
  </div>
</template>

<script>
import events from '@/lib/events';
import Services from './index.services';

const services = new Services();

export default {
  mounted() {
    if (window.userType !== 1) {
      return;
    }
    setInterval(() => {
      this.loadData();
    }, 180000);
    this.loadData();
  },
  data() {
    return {
      visible: false,
      companyCount: 0,
      emailCount: 0,
      isShopDetectionPass: true,
      isEmailDetectionPass: true,
      isOnlineDetectionPass: true,
      isOrderDetectionPass: true,
    };
  },
  computed: {
    isAllDetectionPass() {
      const {
        isShopDetectionPass,
        isEmailDetectionPass,
        isOnlineDetectionPass,
        isOrderDetectionPass,
      } = this;

      return (
        isShopDetectionPass
        && isEmailDetectionPass
        && isOnlineDetectionPass
        && isOrderDetectionPass
      )
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
    loadData() {
      services.allDetection().then((res) => {
        const data = res.data.data;


        this.isShopDetectionPass = !data.shopDetection;
        this.companyCount = data.shopDetection;

        this.isEmailDetectionPass = !data.emailDetection;
        this.emailCount = data.emailDetection;

        this.isOnlineDetectionPass = !data.onlineProductsDetection;

        this.isOrderDetectionPass = !data.orderSkuDetection;
      });
    },
    handleOrderSolve() {
      if (this.$router.currentRoute.name !== 'amaOrder') {
        events.emit('addPageTab', {
          name: 'amaOrder',
          params: {
            searchData: {
              orderExceptionStatus: '1',
            },
          },
        });
      }
      events.emit('searchOrder', {
        orderExceptionStatus: '1',
      });
      this.visible = false;
    },
    handleShopSolve() {
      events.emit('addPageTab', {
        name: 'onlineGoods',
      });
      this.visible = false;
    },
    handleCompanySolve() {
      events.emit('addPageTab', {
        name: 'company',
      });
      this.visible = false;
    },
    handleEmailSolve() {
      events.emit('addPageTab', {
        name: 'shopServiceMail',
      });
      this.visible = false;
    },
  }
};
</script>

<style lang="less">
.list {
  border: #DCDFE6 1px solid;
  border-bottom: 0;
  li {
    border-bottom: #DCDFE6 1px solid;
    line-height: 26px;
    padding: 7px 10px;
    &.active {
      background: #409EFF;
      color: #fff;
      margin: 0 -1px;
      padding: 7px 11px;
    }
  }
}
.detection-list {
  li {
    padding: 0 10px;
    line-height: 28px;
    padding: 10px;
  }
  &-title {
    float: left;
  }
  &-aside {
    float: right;
    width: 100px;
    text-align: right;
    button {
      padding: 0;
    }
  }
  &-des {
    clear: both;
    color: #999;
    font-size: 14px;
  }
}
.detection {
  color: #E6A23C;
}
</style>
