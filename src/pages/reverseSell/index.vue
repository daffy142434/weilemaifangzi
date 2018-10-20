<template lang="html">
  <div>
    <div class="page-title">
      反跟卖行动
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公司名称">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
        <el-form-item label="店铺">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="searchData.date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-tabs type="border-card" :active-name="activeName" @tab-click="handleTabsChange">
      <el-tab-pane label="当前" name="now">
        <reverse-sell-table :loading="tabs.now.loading" :data="tabs.now.data"></reverse-sell-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.tabs.now.pageSize"
            :current-page.sync="this.tabs.now.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.tabs.now.totalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="history">
        <reverse-sell-table type="history" :loading="tabs.history.loading" :data="tabs.history.data"></reverse-sell-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.tabs.history.pageSize"
            :current-page.sync="this.tabs.history.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.tabs.history.totalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import moment from 'moment';
  import extend from 'extend';
  import ajax from '@/lib/ajax';
  import format from '@/lib/format';
  import CompanySelect from '@/components/company-select';
  import ShopSelect from '@/components/shop-select';
  import ReverseSell from './services';
  import Table from './components/reverse-sell-table';

  const reverseSell = new ReverseSell();

  export default {
    components: {
      'company-select': CompanySelect,
      'shop-select': ShopSelect,
      'reverse-sell-table': Table
    },
    data() {
      let activeName;

      // switch(true) {
      //   case this.$store.state.powers.includes('online_product_outlier:manage_wait_process'):
      //     activeName = 'now';
      //     break;
      //   case this.$store.state.powers.includes('online_product_outlier:manage_processed'):
      //     activeName = 'history';
      //     break;
      //   default:
      //     activeName = '';
      // }
      activeName = 'now';

      return {
        format: format,
        activeName,
        shops: [],
        searchData: {
          companyId: '',
          shopId: '',
          sku: '',
          date: ''
        },
        tabs: {
          now: {
            loading: false,
            data: [],
            pageSize: 10,
            pageNumber: 1,
            totalRecord: 0,
            searchData: {
              companyId: '',
              shopId: '',
              sku: '',
              date: ''
            },
          },
          history: {
            loading: false,
            data: [],
            pageSize: 10,
            pageNumber: 1,
            totalRecord: 0,
            searchData: {
              companyId: '',
              shopId: '',
              sku: '',
              date: ''
            },
          },
        },
      }
    },
    computed: {
      isOperation: {
        get() {
          if (this.activeName === 'now') {
            if (!this.$store.state.powers.includes('online_product_outlier:process')) {
              return false;
            }
          }
          return true;
        },
      }
    },
    created() {
      this.onSearch();
    },
    methods: {
      handleSizeChange(val) {
        this.tabs[this.activeName].pageSize = val;
        this.beforeSearch();
      },
      handleCurrentChange(val) {
        this.tabs[this.activeName].pageNumber = val;
        this.onSearch();
      },
      handleTabsChange(tab) {
        const oldTabInfo = this.tabs[this.activeName];
        const newTabInfo = this.tabs[tab.name];
        oldTabInfo['searchData'] = extend(true, {}, this.searchData);
        this['searchData'] = extend(true, {}, newTabInfo.searchData);
        this.activeName = tab.name;
        this.onSearch();
      },
      handleReset() {
        this.searchData = {
          companyId: '',
          shopId: '',
          sku: '',
          date: ''
        };
        this.onSearch();
      },
      onOperation([rowData]) {
        this.$refs.operationDialog.show(rowData);
      },
      beforeSearch(){
        this.tabs[this.activeName].pageNumber=1;
        this.onSearch();
      },
      onSearch() {
        const tabInfo = this.tabs[this.activeName];

        let params = this.searchData;
        params.pageNumber = tabInfo.pageNumber;
        params.pageSize = tabInfo.pageSize;

        tabInfo.loading = true;

        const ajaxMap = {
          now: reverseSell.getNowList,
          history: reverseSell.getHistoryList
        };
        const ajaxFn = ajaxMap[this.activeName];
        ajaxFn.call(reverseSell, params)
          .then((res) => {
            if(res.data.code == 200) {
              tabInfo.data = res.data.data.data || [];
              tabInfo.totalRecord = res.data.data.totalRecord;
            }
            tabInfo.loading = false;
          })
          .catch((error) => {
            tabInfo.loading = false;
          });
      },
    }
  }
</script>

<style lang="css">
</style>
