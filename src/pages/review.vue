<template lang="html">
  <div>
    <div class="page-title">
      Review监控
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公司">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
        <el-form-item label="店铺">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="ASIN">
          <el-input v-model="searchData.asin" placeholder="ASIN"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-checkbox @change="handleNotStandard($event)">仅看不达标SKU</el-checkbox>
        <el-button type="text" @click="handleReset" style="margin-left: 10px;">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="tableLoading"
      ref="currencyTable"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="店铺"
        prop="shopName">
      </el-table-column>
      <el-table-column
        label="店铺归属人"
        prop="pmUserName">
      </el-table-column>
      <el-table-column
        label="SKU"
        prop="sku">
      </el-table-column>
      <el-table-column
        label="ASIN"
        prop="asin"
        width="160"
      >
        <template slot-scope="scope">
          <asin-link :asin="scope.row.asin" :stationCode="scope.row.stationCode"></asin-link>
        </template>
      </el-table-column>
      <el-table-column
        label="中文名"
        :show-overflow-tooltip="true"
        width="150"
        prop="nameCn">
      </el-table-column>
      <el-table-column
        label="评分"
        width="65"
        prop="reviewScore">
      </el-table-column>
      <el-table-column
        label="评论总数"
        width="95"
        prop="reviewTotalNum">
      </el-table-column>
      <el-table-column
        label="好评率"
        :formatter="format.formatPercent"
        width="120"
        prop="positiveReviewRate">
      </el-table-column>
      <el-table-column
        label="未达标时间"
        width="180"
        :formatter="format.toDateTime"
        prop="notStandardTime">
      </el-table-column>
      <el-table-column
        label="七天内差评数"
        width="110"
        prop="weekIncNegativeReveiwNum">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.weekIncNegativeReveiwNum==0">{{scope.row.weekIncNegativeReveiwNum}}</span>
            <span v-else style="font-weight:bold;color:#F56C6C">{{scope.row.weekIncNegativeReveiwNum}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="监控时间"
        width="180"
        :formatter="format.toDateTime"
        prop="monitorTime">
      </el-table-column>
    </el-table>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageSize"
        :current-page.sync="searchData.pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import CompanySelect from '@/components/company-select';
import ShopSelect from '@/components/shop-select';

export default {
  components: {
    'company-select': CompanySelect,
    'shop-select': ShopSelect
  },
  data() {
    return {
      format: format,
      searchData: {
        shopId: '',
        sku: '',
        asin: '',
        companyId: '',
        skuStatus: 1,
        notStandardFlag: 0,
        pageNumber:1
      },
      totalRecord: 0,
      pageSize: 10,
      tableLoading: false,
      tableData: [],
      shops: [],
      
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    handleNotStandard(e) {
      if (e.target.checked) {
        this.searchData.notStandardFlag = 1;
      } else {
        this.searchData.notStandardFlag = 0;
      }
      this.onSearch();
    },
    shopFormat(row, column, cellValue) {
      let shop = this.shops.filter((item) => item.id == cellValue)[0];

      return shop ? shop.shopName : '';
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber=val;
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        shopId: '',
        sku: '',
        asin: '',
        companyId: '',
        skuStatus: 1,
        notStandardFlag: 0
      };
      this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      let params = Object.assign({pageSize}, this.searchData);
      ajax.post('/monitor/review/list', params)
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
  }
}
</script>

<style lang="css">
</style>
