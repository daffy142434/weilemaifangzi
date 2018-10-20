<template lang="html">
  <div>
    <div class="page-title">
      变体维护
      <a @click="back">返回到店铺列表</a>
      <el-popover
        placement="right"
        trigger="hover"
      >
        拖动或点击SKU图片，可查看和设置变体关系
        <span slot="reference" class="el-icon-info primary"></span>
      </el-popover>
    </div>

    <div class="search-bar">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="商品SKU">
          <el-input v-model="searchData.sku" placeholder="商品SKU"></el-input>
        </el-form-item>
        <el-form-item label="ASIN">
          <el-input v-model="searchData.asin" placeholder="ASIN"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button @click="onSearch" type="primary">查询</el-button>
      </div>
    </div>
    <div class="variant-drag" v-loading="loading">
      <div class="product-list" @mousedown="handleProductMousedown">
        <sortable-tree :data="list" childrenAttr="childVariantList">
          <template slot-scope="{item}">
            <div class="variant-drag-handler">
              <div v-if="item.depth === 0">
                <span>{{item.sku}}</span>
                <span class="gray">（FBA：{{item.fba}}）</span>
                <el-button type="text" @click="addStock(item.id, item)">加入暂存</el-button>
              </div>
              <div v-if="item.depth !== 0">
                <div>
                  <img :src="item.mainPic" />
                </div>
                <span>{{item.sku}}</span>
                <div>
                  FBA：{{item.fba}}
                </div>
              </div>
            </div>
          </template>
        </sortable-tree>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="searchData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
      <div class="stock-list" v-loading="dropLoading">
        <sortable-tree :data="dragList" childrenAttr="childVariantList" @changePosition="handleChange">
          <template slot-scope="{item}">
            <div class="variant-drag-handler" @mousedown="handleMousedown($event, item)">
              <div v-if="item.depth === 0">
                <span>{{item.sku}}</span>
                <span class="gray">（FBA：{{item.fba}}）</span>
                <el-button type="text" @click="removeStock(item.id, item)">移除暂存</el-button>
              </div>
              <div v-if="item.depth !== 0">
                <div>
                  <img :src="item.mainPic" />
                </div>
                <span>{{item.sku}}</span>
                <div>
                  FBA：{{item.fba}}
                </div>
              </div>
            </div>
          </template>
        </sortable-tree>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import extend from 'extend';
import ajax from '@/lib/ajax';
import draggable from 'vuedraggable';
import VariantList from './services';
import SortableTree from 'vue-sortable-tree';

const variantList = new VariantList();

export default {
  components: {
    draggable,
    [SortableTree.name]: SortableTree
  },
  data() {
    return {
      loading: false,
      dropLoading: false,
      markets: [],
      list: {},
      bakList: {},
      dragList: {
        root: true,
        childVariantList: []
      },
      dragItemMap: {
      },
      searchData: {
        shopId: this.$route.query.shopId,
        sku: '',
        asin: '',
        shippingType: '',
        pageSize: 10,
        pageNumber: 1,
      },
      data: [],
      totalRecord: 0,
      pageNumber: 1,
      loading: false,
    }
  },
  computed: {
    stationName: function() {
      let market = this.markets.filter((item) => {
        if(item.stationCode) {
          return item.stationCode == this.$route.query.stationCode;
        }
      });
      return market.length > 0 ? market[0].marketName : '';
    }
  },
  beforeCreate(){
    ajax.post('/shops/ama_market/list')
    .then((response) => {
      if(response.data.code == 200) {
        this.markets = response.data.data;
      }
    });
  },
  created() {
    this.backHref = this.$router.currentRoute.params.backHref;
    this.onSearch();
  },
  methods: {
    back() {
      this.$router.push({
        name: 'variant',
        params: {
          searchData: {
            companyName: this.$router.currentRoute.query.searchCompanyName,
            shopName: this.$router.currentRoute.query.searchShopName,
            station_code: this.$router.currentRoute.query.searchStationCode,
          }
        }
      });
    },
    addStock(id, product) {
      if (this.dragItemMap[id]) {
        return;
      }
      this.dragList.childVariantList.push(extend(true, {}, product));
      this.dragItemMap[id] = product;
      this.dragList = this.addTreeData(this.dragList);
      this.list = this.list;
      this.$forceUpdate();
    },
    removeStock(id) {
      delete this.dragItemMap[id];
      this.dragList.childVariantList = this.dragList.childVariantList.filter(d => d.id !== id);
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.searchData.pageNumber = 1;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val
      this.onSearch();
    },
    handleProductMousedown(e) {
      e.preventDefault();
    },
    handleMousedown(e, data) {
      if (data.depth === 1 && data.siblingCount === 0) {
        e.preventDefault();
        return;
      } else if (data.depth === 0 && data.childCount > 0) {
        e.preventDefault();
        return;
      }
      this.bakList = extend(true, {}, this.dragList);
    },
    handleChange(e) {
      if (!this.checkList(this.dragList)) {
        this.dragList = extend(true, {}, this.bakList);
        return;
      }
      this.dragList = this.addTreeData(this.dragList);
      const tansferProductId = e.data.id;
      let parentProductId;
      if (e.afterParent.isRoot) {
        parentProductId = null;
      } else {
        parentProductId = e.afterParent.id;
      }
      this.dropLoading = true;
      variantList.variantChange(tansferProductId, parentProductId).then(() => {
        this.dropLoading = false;
        this.onSearch();
      }).catch(() => {
        this.dropLoading = false;
      });
    },
    onSearch() {
      this.loading = true;
      variantList.getList(this.searchData).then((res) => {
        const data = res.data.data.data || [];
        this.list = this.addTreeData({
          childVariantList: data
        });
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    checkList(list) {
      let isPass;

      isPass = true;
      list.childVariantList.map((d) => {
        if (d.childVariantList && d.childVariantList.length) {
          d.childVariantList.map((child) => {
            if (child.childVariantList && child.childVariantList.length) {
              isPass = false;
            }
          });
        }
      });
      return isPass;
    },
    addTreeData(list, depth = 0) {
      if (list.childVariantList && list.childVariantList.length) {
        list.childVariantList.map((d) => {
          d.depth = depth;
          d.siblingCount = list.childVariantList.length - 1;
          if (d.childVariantList) {
            d.childCount = d.childVariantList.length;
          } else {
            d.childCount = 0;
            d.childVariantList = [];
          }
          d = this.addTreeData(d, depth + 1);
        });
        return list;
      }
      return {};
    }
  }
}
</script>

<style lang="less">
  .variant-drag {
    display: flex;
    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .product-list, .stock-list {
      flex: 1;
      &>.sortable-tree {
        &>.content {
          display: none;
        }
        &>ul {
          .blank-li:first-child {
            display: none;
          }
          ul {
            padding-bottom: 15px;
          }
        }
      }
    }
    .product-list {
      margin-right: 5px;
    }
    .el-button--text {
      padding: 0;
    }
    .stock-list {
      margin-left: 5px;
    }
    div.sortable-tree {
      font-size: 14px;
      ul {
        li {
          &.exist-li {
            padding: 0;
            border: #999 1px solid;
            border-radius: 6px;
            background: #eee;
            line-height: 18px;
            &:before, &:after {
              display: none;
            }
            .content {
              height: auto;
              line-height: 18px;
            }
            .variant-drag-handler {
              padding: 10px;
            }
            .exist-li {
              margin: 0 10px 0 60px;
              padding-bottom: 0;
              background: #ddd;
              width: 200px;
              text-align: center;
              &:before, &:after {
                display: block;
              }
              &:before {
                left: -20px;
                top: 0px;
              }
              &:after {
                left: -20px;
                width: 15px;
              }
              img {
                width: 160px;
              }
            }
            .blank-li {
              &:before, &:after {
                display: block;
              }
              &:before {
                left: 41px;
                top: -1px;
                height: 17px;
              }
            }
          }
          &.blank-li {
            height: 15px;
            &:before, &:after {
              display: none;
            }
            .sortable-tree {
              padding: 0;
              min-height: 15px;
            }
          }
        }
      }
      .sortable-tree {
        .droper {
          background: none;
        }
      }
    }
    .sortable-tree.droper {
      background: #ddd;
    }
  }
</style>
