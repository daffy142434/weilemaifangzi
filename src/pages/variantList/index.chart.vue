<template lang="html">
  <div class="variant-list">
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
        <el-button type="text" @click="handleReset" style="margin-left: 10px;">重置</el-button>
        <el-button @click="onSearch" type="primary">查询</el-button>
      </div>
    </div>
    <div v-loading="loading" class="variant-chart">
      <graph-chart ref="chart" :options="chartOptions"></graph-chart>
    </div>
    <set-variant ref="setVariant" @variantSuccess="handleVariantSuccess"></set-variant>
  </div>
</template>
<script>
import moment from 'moment';
import extend from 'extend';
import GraphChart from '@/components/chart/graphChart';
import ajax from '@/lib/ajax';
import draggable from 'vuedraggable';
import VariantList from './services';
import SortableTree from 'vue-sortable-tree';
import ProductItem from './components/productItem';
import SetVariant from './components/setVariant';

const variantList = new VariantList();

export default {
  components: {
    draggable,
    [SortableTree.name]: SortableTree,
    'product-item': ProductItem,
    'graph-chart': GraphChart,
    'set-variant': SetVariant
  },
  data() {
    return {
      loading: false,
      dropLoading: false,
      markets: [],
      list: {},
      bakList: {},
      pmDepartmentName: this.$route.query.pmDepartmentName,
      pmUserName: this.$route.query.pmUserName,
      dragList: {
        root: true,
        childVariantList: []
      },
      dragItemMap: {
      },
      shopName: this.$route.query.shopName,
      searchData: {
        shopId: this.$route.query.shopId,
        sku: '',
        asin: '',
        shippingType: '',
        pageSize: 999999,
        pageNumber: 1,
      },
      data: [],
      totalRecord: 0,
      pageNumber: 1,
      loading: false,
      chartOptions: {
        title: {
          text: '下图可拖动平移，滚动可缩放'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        legend: {
          x: "center",
          show: true,
          data: [] // 此处不显示根节点学生
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            symbolSize: function(size) {
              return size;
            },
            // edgeSymbol: ['arrow'],
            // edgeSymbolSize: [4, 10],
            // edgeLabel: {
            //   normal: {
            //     show: true,
            //     textStyle: {
            //       fontSize: 10
            //     },
            //     formatter: "{c}"
            //   }
            // },
            // force: {
            //   repulsion: 2500,
            //   edgeLength: [10, 50]
            // },
            focusNodeAdjacency: true,
            roam: true,
            categories: [],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12
                },
              }
            },
            force: {
              repulsion: 2000
            },
            tooltip: {
              formatter: (node) => {
                if (node.dataType !== 'node') {
                  return;
                }
                if (node.data.isShopNode) {
                  return [
                    `店铺：${node.data.name}`,
                    `地区：${this.stationName}`,
                    `市场部@sedricd：${this.pmDepartmentName}@${this.pmUserName}`
                  ].join('<br />');
                } else {
                  return [
                    `SKU：${node.data.sku}`,
                    `是否FBA：${node.data.fba}`,
                    `ASIN: ${node.data.asin}`,
                    `评分：${node.data.skuScore || '无'}`,
                    `大类排名：${node.data.topCategorySort || '无'}`,
                    `小类排名：${node.data.bottomCategorySort || '无'}`,
                  ].join('<br />');
                }
              },
            },
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 1,
                curveness: 0.3
              }
            },
            data: [],
            links: []
          }
        ]
      }
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
  mounted() {
    this.$refs.chart.chart.on('click', (e) => {
      if (e.dataType !== 'node') {
        return;
      }
      if (e.data.nodeType === 'single' || e.data.nodeType === 'child') {
        this.handleShowSetVariantDialog(e.data);
      }
    });
  },
  beforeCreate(){
    ajax.post('/shops/ama_market/list')
    .then((response) => {
      this.markets = response.data.data;
      this.onSearch();
    });
  },
  created() {
    this.backHref = this.$router.currentRoute.params.backHref;
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
    handleReset() {
      this.searchData.sku = '';
      this.searchData.asin = '';
      this.onSearch();
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
    handleShowSetVariantDialog(data) {
      this.$refs.setVariant.show(data);
    },
    handleVariantSuccess() {
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      variantList.getList(this.searchData).then((res) => {
        const categories = [{
          name: '店铺',
        }];
        const data = [
          {
            name: this.shopName,
            category: 0,
            symbol: 'circle',
            symbolSize: 100,
            isShopNode: true
          }
        ];
        const links = [];
        let curIndex = 0;
        let curParentIndex = 0;
        let category = 0;
        let map = {};

        function addData(d) {
          let symbol;
          if (d.mainPic) {
            symbol = `image://${d.mainPic}`;
          } else {
            symbol = 'circle';
          }
          data.push({
            id: d.id,
            name: d.sku,
            symbol,
            symbolSize: 60,
            category,
            nodeType: d.nodeType,
            sku: d.sku,
            fba: d.fba,
            asin: d.asin,
            skuScore: d.skuScore,
            topCategorySort: d.topCategorySort,
            bottomCategorySort: d.bottomCategorySort
          });
        };
        (res.data.data.data || []).map(eachParent);
        function eachParent(d) {
          if (map[d.sku]) {
            return d;
          } else {
            map[d.sku] = true;
          }
          curIndex++;
          category++;
          curParentIndex = curIndex;
          if (d.childVariantList && d.childVariantList.length) {
            d.nodeType = 'parent';
          } else {
            d.nodeType = 'single';
          }
          addData(d);
          categories.push({
            name: d.sku
          });
          links.push({
            source: 0,
            target: curIndex,
            value: ''
          });
          d.childVariantList.map(eachChild(d));
          return d;
        }
        function eachChild(d) {
          const childCount = d.childVariantList.length;
          return (child) => {
            if (map[child.sku]) {
              return child;
            } else {
              map[child.sku] = true;
            }
            if (childCount > 1) {
              child.nodeType = 'child';
            } else {
              child.nodeType = 'singleChild';
            }
            addData(child);
            curIndex++;
            links.push({
              source: curParentIndex,
              target: curIndex,
              value: ''
            });
          }
        }
        this.chartOptions.series[0].categories = categories;
        this.chartOptions.series[0].data = data;
        this.chartOptions.series[0].links = links;
        this.$refs.chart.render();
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
.variant-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.variant-chart {
  flex: 1;
  .chart {
    min-height: 100%;
  }
}
</style>
