<template lang="html">
  <div>
    <div class="page-title">
      异常商品
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公司名称">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
        <el-form-item label="店铺">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="归属人">
          <member-select v-model="searchData.pmUserNo"></member-select>
        </el-form-item>
        <el-form-item label="归属部门">
          <department-select v-model="searchData.pmDepartmentId"></department-select>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="异常类型">
          <el-select v-model="searchData.exceptionType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="疑似被下架" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchData.processStatus">
            <el-option label="请选择" value=""></el-option>
            <el-option label="待处理" value="1"></el-option>
            <el-option label="处理中" value="2"></el-option>
            <el-option label="已处理" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-tabs type="border-card" :active-name="activeName" @tab-click="handleTabsChange">
      <el-tab-pane label="异常中" name="exception" v-if="$store.state.powers.includes('online_product_outlier:manage_wait_process') && $store.state.powers.includes('online_product_outlier:list_wait_process')">
        <operation-table
          :loading="this.tabs.exception.loading"
          :data="this.tabs.exception.data"
          :type="activeName"
          :isOperation="isOperation"
          border
          highlight-current-row
          @onOperation="onOperation"
          style="width: 100%"
        >
        </operation-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.tabs.exception.pageSize"
            :current-page.sync="this.tabs.exception.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.tabs.exception.totalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="restore" v-if="$store.state.powers.includes('online_product_outlier:manage_processed') && $store.state.powers.includes('online_product_outlier:list_processed')">
        <operation-table
          :loading="this.tabs.restore.loading"
          :data="this.tabs.restore.data"
          :type="activeName"
          :isOperation="isOperation"
          border
          highlight-current-row
          @onOperation="onOperation"
          style="width: 100%"
        >
        </operation-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.tabs.restore.pageSize"
            :current-page.sync="this.tabs.restore.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.tabs.restore.totalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <operation-dialog
      ref="operationDialog"
      :type="activeName"
      @operationSuccess="onSearch()"
    ></operation-dialog>
  </div>
</template>
<script>
  import moment from 'moment';
  import extend from 'extend';
  import ajax from '@/lib/ajax';
  import format from '@/lib/format';
  import CompanySelect from '@/components/company-select';
  import DepartmentSelect from '@/components/department-select';
  import MemberSelect from '@/components/member-select';
  import ShopList from '@/components/shop-select';
  import AmaOnlineProductOutlier from './services';
  import OperationDialog from './components/operation-dialog';
  import OperationTable from './components/ama-online-product-outlier-table';

  const amaOnlineProductOutlier = new AmaOnlineProductOutlier();

  export default {
    components: {
      'company-select': CompanySelect,
      'shop-select': ShopList,
      'department-select': DepartmentSelect,
      'member-select': MemberSelect,
      'operation-dialog': OperationDialog,
      'operation-table': OperationTable
    },
    data() {
      let activeName;

      switch(true) {
        case this.$store.state.powers.includes('online_product_outlier:manage_wait_process'):
          activeName = 'exception';
          break;
        case this.$store.state.powers.includes('online_product_outlier:manage_processed'):
          activeName = 'restore';
          break;
        default:
          activeName = '';
      }

      return {
        format: format,
        activeName,
        shops: [],
        searchData: {
          companyId: '',
          shopId: '',
          pmUserNo: '',
          pmDepartmentId: '',
          sku: '',
          exceptionType: '1',
          processStatus: '1'
        },
        tabs: {
          exception: {
            loading: false,
            data: [],
            pageSize: 10,
            pageNumber: 1,
            totalRecord: 0,
            searchData: {
              companyId: '',
              shopId: '',
              pmUserNo: '',
              pmDepartmentId: '',
              sku: '',
              exceptionType: '1',
              processStatus: '1'
            },
          },
          restore: {
            loading: false,
            data: [],
            pageSize: 10,
            pageNumber: 1,
            totalRecord: 0,
            searchData: {
              companyId: '',
              shopId: '',
              pmUserNo: '',
              pmDepartmentId: '',
              sku: '',
              exceptionType: '',
              processStatus: ''
            },
          },
        },
      }
    },
    computed: {
      isOperation: {
        get() {
          if (this.activeName === 'exception') {
            if (!this.$store.state.powers.includes('online_product_outlier:process')) {
              return false;
            }
          }
          return true;
        },
      }
    },
    beforeCreate(){
      ajax.post('/shops/list_all')
      .then((response) => {
        if(response.data.code == 200) {
          this.shops = response.data.data;
        }
      });
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
          exception: amaOnlineProductOutlier.getExceptionList,
          restore: amaOnlineProductOutlier.getRestoreList
        };
        const ajaxFn = ajaxMap[this.activeName];
        ajaxFn.call(amaOnlineProductOutlier, params)
          .then((res) => {
            this.tableLoading = false;
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
