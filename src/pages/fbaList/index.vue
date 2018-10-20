<template lang="html">
  <div>
    <div class="page-title">
      亚马逊库存
      <a @click="back">返回到店铺列表</a>
      <span class="fr" style="margin-left: 15px;">业绩归属部门@人：<span style="color:#FA5555;">{{pmDepartmentName}}@{{pmUserName}}</span></span>
      <span class="fr" style="margin-left: 15px;">店铺名：<span style="color:#FA5555;">【{{stationName}}】{{shopName}}</span></span>
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
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-dropdown
          split-button
          type="primary"
          @click="onSearch"
          @command="searchByShippingType"
        >
          <span class="el-icon-search" style="margin-right: 6px;"></span>
          {{searchBtnText}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">所有库存</el-dropdown-item>
            <el-dropdown-item command="1">亚马逊库存</el-dropdown-item>
            <el-dropdown-item command="2">自发货库存</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-if="$store.state.powers.includes('fba_storage:list')">
      <el-table
        v-loading.body="tableLoading"
        @select="handleSelect"
        @select-all="handleSelect"
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="originSku"
          label="SKU"
          min-width="180"
          class-name="sku-column"
          fixed="left"
        >
          <template slot-scope="scope">
            <el-popover
              ref="popover1"
              placement="right-start"
              title=""
              width="650"
              border
              trigger="click">
              <img :src="scope.row.mainPic" class="big-pic"></img>
            </el-popover>
            <img :src="scope.row.mainPic" v-popover:popover1></img>
            <div class="sku-column-text">
              <el-popover trigger="hover" placement="top">
                <div>库存不足，请及时补充</div>
                <span slot="reference" class="icon-alarm" v-if="scope.row.warnStatus === 1"></span>
              </el-popover>
              <el-popover trigger="hover" placement="top">
                <div>此商品监控中</div>
                <span slot="reference" class="icon-monitoring" v-if="scope.row.warnType !== 0"></span>
              </el-popover>
              {{scope.row.sku}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="130"
          prop="asin"
          label="ASIN">
          <template slot-scope="scope">
            <asin-link :asin="scope.row.asin" :stationCode="scope.row.stationCode"></asin-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="amaStcokNum"
          label="在亚数"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="amaSaleableNum"
          label="可售数"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="amaTransferNum"
          label="转运数"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="fisrtLegNum"
          label="头程数"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="salesVolumePer30"
          min-width="150"
          label="30天日均销量">
        </el-table-column>
        <el-table-column
          prop="saleableDays"
          label="可售天数">
        </el-table-column>
        <el-table-column
          min-width="160"
          prop="fullmentChannel"
          label="是否是FBA商品">
        </el-table-column>
        <el-table-column
          width="80"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleStockWarnDialog(scope.row)">库存预警</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <stock-warn-dialog ref="stockWarnDialog" @setStockWarnSuccess="onSearch"></stock-warn-dialog>
  </div>
</template>
<script>
import ajax from '@/lib/ajax';
import moment from 'moment';
import StockWarnDialog from './components/stockWarnDialog';
import FbaList from './services';

const fbaList = new FbaList();

export default {
  components: {
    'stock-warn-dialog': StockWarnDialog
  },
  data() {
    return {
      markets: [],
      markStatusMap: {
        "0": "无标记",
        "1": "库外",
        "2": "下架",
      },
      searchData: {
        shopId: this.$route.query.shopId,
        sku: '',
        asin: '',
        shippingType: '',
        ...this.$router.currentRoute.params.searchData || {}
      },
      searchBtnText: '查询所有库存',
      tableData: [],
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 10,
      tableLoading: false,

      urlDialogVisible: false,
      urlDialogTitle: '',

      changeMarkStatusDialogVisible: false,
      changeMarkStatusForm: {
        skuId: '',
        markStauts: '',
      },
      changeMarkStatusRules: {
        markStauts: [{
          type: 'number',
          required: true,
          message: '请选择库外状态',
          trigger: 'change'
        }],
      },

      selection: [],
      relateSkuDialogVisible: false,
      searchSkuParam: '',
      relateSkuGoods: [],



      urlData: {
        id: '',
        productUrl: '',
      },
      urlRules: {
        productUrl: [{
          required: true,
          message: 'URL不能为空',
          trigger: 'blur'
        }],
      },

      importDialogVisible: false,
      uploadData: {
        shopId: this.$route.query.shopId,
      },
      shopName: this.$route.query.shopName,
      pmDepartmentName: this.$route.query.pmDepartmentName,
      pmUserName: this.$route.query.pmUserName,

      goodsTableLoading: false,
      relateSkuData: {
        id: '',
        relationSkuId: '',
      },

      batchDialogTitle: '部分失败',
      batchDialogVisible: false,
      batchForm: {
        errorMsg: '',
        errorList: [],
      },
    }
  },
  computed: {
    addWithRelateShowFlag: function() {
      return this.relateSkuGoods.length <= 0;
    },
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
        name: 'fbaShopsList',
        params: {
          searchData: {
            companyName: this.$router.currentRoute.query.searchCompanyName,
            shopName: this.$router.currentRoute.query.searchShopName,
            station_code: this.$router.currentRoute.query.searchStationCode,
          }
        }
      });
    },
    formatWeight(row, column, cellValue) {
      return (cellValue && row.weightUnit) ? (cellValue+' '+row.weightUnit) : '';
    },
    formatRelationSku(row, column, cellValue) {
      return this.relationSkuMap[cellValue] || "";
    },
    formatStatus(row, column, cellValue) {
      return this.statusMap[cellValue] || "";
    },
    formatOfferSubmitStatus(row, column, cellValue) {
      return this.offerSubmitStatusMap[cellValue] || "";
    },
    formatMarkStatus(row, column, cellValue) {
      return this.markStatusMap[cellValue] || "";
    },
    onUrlDialogClose() {
      this.$refs.dataForm.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNumber = 1;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        shopId: this.$route.query.shopId,
        sku: '',
        asin: '',
        shippingType: ''
      };
      this.onSearch();
    },

    onSearch() {
      this.tableLoading = true;
      const {pageSize, pageNumber} = this;
      fbaList.getList({pageNumber, pageSize, ...this.searchData})
        .then((response) => {
          this.tableLoading = false;
          if(response.data.code == 200) {
            this.tableData = response.data.data.data || [];
            this.totalRecord = response.data.data.totalRecord;
          }
        })
        .catch((error) => {
          this.tableLoading = false;
        });
    },

    searchByShippingType(shippingType) {
      const map = ['所有库存', '亚马逊库存', '自发货库存'];
      this.searchBtnText = `查询${map[shippingType]}`;
      this.searchData.shippingType = +(shippingType) || '';
      this.onSearch();
    },

    handleSelect(selection, row) {
      this.selection = selection;
    },
    handleStockWarnDialog(data) {
      this.$refs.stockWarnDialog.show(data);
    }
  }
}
</script>

<style lang="css">
  .big-pic {
    max-width: 650px;max-height: 650px;
  }
  .small-pic {
    margin-top:7px;cursor:pointer;width: 50px;height: 50px;
  }
</style>
