<template lang="html">
  <div>
    <div class="page-title">
      {{pageTitle}}
    </div>
    <div :class="{'search-bar':true, 'multi-row-search': showSkuSearch}">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="公司名称">
          <el-input v-model="searchData.companyName" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="平台站点">
          <el-select v-model="searchData.station_code" placeholder="请选择" style="width: 100%;">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="item in markets"
              :key="item.id"
              :label="item.marketName"
              :value="item.marketId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="searchData.shopName" placeholder="店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="SKU" v-if="showSkuSearch">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="ASIN" v-if="showSkuSearch">
          <el-input v-model="searchData.asin" placeholder="ASIN"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <el-button type="primary" size="small" @click="exportResult" class="export-result" v-if="pageTitle=='亚马逊库存'">导出库存校验结果</el-button>
    <el-row :gutter="20" v-loading.body="loading">
      <template v-if="shops.length > 0">
        <template v-for="shop in shops">
          <el-col :span="6" style="margin-bottom:15px;">
            <el-card class="box-card online-shop-card">
              <div slot="header" class="clearfix" style="overflow:hidden;">
                <el-button
                  type="text"
                  @click="handleShowOnlineProduct(shop.id, shop, {})"
                >
                  {{shop.shopName}}
                </el-button>
                <div class="more-info">
                  业绩归属部门@人：{{shop.pmDepartmentName}}@{{shop.pmUserName}}
                </div>
              </div>
              <div class="text item">
                {{'在售SKU：' + shop.activeSkuNum }}
              </div>
              <div class="text item">
                {{'下架SKU：' + shop.inactiveSkuNum }}
              </div>
              <div class="text item">
                {{'已删除SKU：' + shop.deletedSkuNum }}
              </div>
              <div class="shop-card-footer">
                <div class="fl">
                  <el-tooltip
                    placement="top"
                  >
                    <div slot="content">亚马逊店铺首页</div>
                    <a class="icon-amazon" :href="shop.amazonLink" target="_blank"></a>
                  </el-tooltip>
                </div>
                <div class="fr">
                  <el-tooltip
                    placement="top"
                    v-if="shop.hasUnRelate"
                  >
                    <div slot="content">
                      存在未关联的SKU，请建立本地产品并关联
                    </div>
                    <a
                      @click="openProductList(shop)"
                    >
                      <el-tag
                        type="warning"
                        size="mini"
                        class="tag-fill"
                      >
                        存在设置问题
                      </el-tag>
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    placement="top"
                  >
                    <div slot="content">清除所有库存预警</div>
                    <a class="icon-clear" @click="handleCleanStockWarn(shop)"></a>
                  </el-tooltip>
                </div>
              </div>
            </el-card>
          </el-col>
        </template>
      </template>
      <template v-else>
        <el-col :span="24" style="margin-bottom:15px;">
          <el-alert
            show-icon
            title="没有查询到在线产品相关店铺信息"
            type="warning"
            :closable="false">
          </el-alert>
        </el-col>
      </template>
    </el-row>
    <sku-select ref="skuSelect"></sku-select>
  </div>
</template>
<script>
import ajax from '@/lib/ajax';
import qs from 'query-string';
import getDomainSuffixByStationCode from '@/lib/getDomainSuffixByStationCode';
import SkuSelect from '@/pages/sku.select.component';
import OnlineGoodsList from '@/pages/onlineGoodsList/services';
import FbaList from '@/pages/fbaList/services';
import Services from './index.services';

const onlineGoodsList = new OnlineGoodsList();
const fbaList = new FbaList();
const services = new Services();

function getPageTitleByRouter(router) {
  switch(router.currentRoute.name) {
    case 'onlineGoods':
      return '亚马逊在线产品';
    case 'fbaShopsList':
      return '亚马逊库存';
    case 'variant':
      return '变体维护';
  }
  if(router.currentRoute.path == '/onlineShopsList/fba') {
    return '亚马逊库存';
  }else {
    return '亚马逊在线产品';
  }
}

export default {
  components: {
    SkuSelect
  },
  
  data() {
    const searchData = this.$router.currentRoute.params.searchData || {};
    let showSkuSearch;
    switch(this.$router.currentRoute.name) {
      case 'onlineGoods':
      case 'fbaShopsList':
        showSkuSearch = true;
        break;
      case 'variant':
        showSkuSearch = false;
        break;
    }
    return {
      loading: false,
      showSkuSearch,
      pageTitle: getPageTitleByRouter(this.$router),
      skuList: [],
      searchData: {
        companyName: '',
        station_code: '',
        shopName: '',
        sku: '',
        asin: '',
        tag: 'online_product',
        ...searchData
      },
      markets: [],
      shops: [],
      fileList: [],
    }
  },
  beforeCreate() {
    ajax.post('/shops/ama_market/list').then((res) => {
      this.markets = res.data.data;
    });
  },
  created() {
    this.onSearch();
  },
  methods: {
    exportResult(){
      window.open("/online_product/export_stock_check");
    },
    getUrlParams() {
      return qs.parse(location.hash.split('?')[1] || '');
    },
    submitUpload() {
      this.$refs.upload.submit();
    },

    handleReset() {
      const searchData = this.getUrlParams();
      this.searchData = {
        ...searchData,
        companyName: '',
        station_code: '',
        shopName: '',
        sku: '',
        asin: '',
        tag: 'online_product',
      };
      this.onSearch();
    },

    onSearch() {
      this.loading = true;
      if (this.searchData.sku || this.searchData.asin) {
        this.searchSku();
      } else {
        this.searchShop();
      }
    },
    searchSku() {
      const {sku, asin} = this.searchData
      let p;
      const params = {
        sku,
        asin,
        pageSize: 10,
        pageNumber: 1
      };
      switch(this.$router.currentRoute.name) {
        case 'onlineGoods':
          p = new onlineGoodsList.getList(params);
          break;
        case 'fbaShopsList':
          p = new fbaList.getList(params);
          break;
      }
      p.then((res) => {
        const list = res.data.data.data || [];
        const shopSet = new Set();
        list.map(item => shopSet.add(item.shopName));
        if (shopSet.size === 0) {
          this.shops = [];
          this.loading = false;
        }
        else if (shopSet.size === 1){
          const [data] = list;
          ajax.post('/shops/list_all', {shopName: data.shopName}).then((res) => {
            this.loading = false;
            const shop = res.data.data[0];
            this.handleShowOnlineProduct(shop.id, shop, {
              sku: this.searchData.sku,
              asin: this.searchData.asin,
            });
          }).catch(() => {
            this.loading = false;
          });
        } else {
          this.loading = false;
          this.skuList = list;
          this.$refs.skuSelect.show(this.skuList, {...this.searchData, totalRecord: res.data.data.totalRecord});
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    searchShop() {
      ajax.post('/shops/list_all', this.searchData)
      .then((response) => {
        this.loading = false;
        const shopss = response.data.data || [];
        this.shops = shopss.map((shop) => {
          shop.shopAuthParam = JSON.parse(shop.shopAuthParam);
          shop.hasUnRelate = false;
          const {marketId, sellerId} = shop.shopAuthParam;
          const domainSuffix = getDomainSuffixByStationCode(shop.stationCode);
          shop.amazonLink = `https://www.amazon.${domainSuffix}/sp?marketplaceID=${marketId}&seller=${sellerId}`;
          return shop;
        });
        if (this.$router.currentRoute.name === 'onlineGoods') {
          services.getSolveShops().then((res) => {
            const shopIds = res.data.data;
            this.shops = this.shops.map((shop) => {
              shopIds.forEach((shopId) => {
                if (shopId === shop.id) {
                  shop.hasUnRelate = true;
                }
              });
              return shop;
            });
          });
        }
      })
      .catch((error) => {
        this.loading = false;
      });
    },
    handleShowOnlineProduct(shopId, shop, data) {
      const listType = this.$route.params.listType;
      const query = {
        shopId: shopId,
        shopName: shop.shopName,
        stationCode: shop.stationCode,
        pmDepartmentName: shop.pmDepartmentName,
        pmUserName: shop.pmUserName,
        searchCompanyName: this.searchData.companyName,
        searchShopName: this.searchData.shopName,
        searchStationCode: this.searchData.station_code,
      };
      const params = {
        backHref: location.href,
        ...data,
      }
      let name;
      switch(this.$router.currentRoute.name) {
        case 'onlineGoods':
          name = 'onlineGoodsList';
          break;
        case 'fbaShopsList':
          name = 'fbaList';
          break;
        case 'variant':
          name = 'variantList';
          break;
      }
      this.$router.push({
        name,
        query,
        params
      });
    },
    openProductList(shop) {
      shop.shopId = shop.id;
      this.handleShowOnlineProduct(shop.shopId, shop, {
        searchData: {
          relationSkuFlag: '0',
        },
        formDetection: true,
      });
    },
    handleCleanStockWarn(shop) {
      this.$confirm('是否清除库存预警', '清除库存预警', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        return ajax.post(`/online_stock/${shop.id}/clean_warn`);
      }).then(() => {
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    }
  },
}
</script>
<style scoped>
.export-result{
  margin-bottom: 10px;
}
</style>
<style lang="less">
  .box-card {
    .box-card-title {
      line-height: 36px;
      float: left;
      text-overflow: ellipsis;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
    }
    .more-info {
      margin-top: 5px;
      font-size: 13px;
      color: #999;
      height: 18px;
      overflow: hidden;
    }
  }
  .online-shop-card {
    .el-card__header {
      position: relative;
    }
    .el-card__header > .clearfix {
      margin: -18px -20px;
      padding: 18px 20px;
    }
    .el-button--text {
      padding: 0;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 18px 20px;
      width: 100%;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        position: absolute;
        left: 20px;
        right: 20px;
        top: 18px;
        line-height: 16px;
      }
    }
    .more-info {
      margin-top: 20px;
    }
    .shop-card-footer {
      margin-top: 20px;
      height: 20px;
      line-height: 20px;
    }
    .el-tag {
      display: inline-block;
      vertical-align: 5px;
    }
  }
</style>
