<template lang="html">
  <div>
    <div class="page-title">
      Feedback监控
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="公司">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset" style="margin-left: 10px;">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
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
        <template slot-scope="props">
          <a v-if="props.row.amazonLink" :href="props.row.amazonLink" target="_blank" style="color: #409EFF; text-decoration: none;">{{props.row.shopName}}</a>
          <span v-if="!props.row.amazonLink">{{props.row.shopName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="店铺归属人"
        prop="pmUserName">
      </el-table-column>
      <el-table-column
        label="店铺评分"
        width="95"
        prop="feedbackScore">
      </el-table-column>
      <el-table-column
        label="30天内好评率"
        :formatter="format.formatPercent"
        width="125"
        prop="positiveRate30Days">
      </el-table-column>
      <el-table-column
        label="90天内好评率"
        :formatter="format.formatPercent"
        width="125"
        prop="positiveRate90Days">
      </el-table-column>
      <el-table-column
        label="120天内好评率"
        :formatter="format.formatPercent"
        width="135"
        prop="positiveRate120Days">
      </el-table-column>
      <el-table-column
        label="lifetime比例"
        :formatter="format.formatPercent"
        width="125"
        prop="positiveRateLifeTime">
      </el-table-column>
      <el-table-column
        label="30天内反馈总数"
        prop="feedbackCount30Days">
      </el-table-column>
      <el-table-column
        label="90天内反馈总数"
        prop="feedbackCount90Days">
      </el-table-column>
      <el-table-column
        label="120天内反馈总数"
        prop="feedbackCount120Days">
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
        :current-page.sync="pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import ajax from '../lib/ajax';
import moment from 'moment';
import format from '../lib/format';
import CompanySelect from '@/components/company-select';
import ShopSelect from '@/components/shop-select';
import getDomainSuffixByStationCode from '@/lib/getDomainSuffixByStationCode';

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
        companyId: '',
        startDate: '',
        endDate: '',
      },
      totalRecord: 0,
      pageSize: 10,
      pageNumber:1,
      tableLoading: false,
      tableData: [],
      shops: [],
    }
  },
  created() {
    this.onSearch();
  },
  methods: {
    shopFormat(row, column, cellValue) {
      let shop = this.shops.filter((item) => item.id == cellValue)[0];

      return shop ? shop.shopName : '';
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val});
    },
    handleReset() {
      this.searchData = {
        shopId: '',
        companyId: '',
        startDate: '',
        endDate: '',
      };
      this.onSearch();
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      let params = Object.assign({pageNumber, pageSize}, this.searchData);
      params.startDate = params.startDate ? moment(params.startDate).format('YYYY-MM-DD') : '';
      params.endDate = params.endDate ? moment(params.endDate).format('YYYY-MM-DD') : '';
      ajax.post('/monitor/feedback/list', params)
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          const tableData = response.data.data.data || [];
          this.tableData = tableData.map((d) => {
            if (d.shopAuthParam) {
              d.shopAuthParam = JSON.parse(d.shopAuthParam);
              const {marketId, sellerId} = d.shopAuthParam;
              const domainSuffix = getDomainSuffixByStationCode(d.stationCode);
              d.amazonLink = `https://www.amazon.${domainSuffix}/sp?marketplaceID=${marketId}&seller=${sellerId}`;
            }
            return d;
          });
          this.totalRecord = response.data.data.totalRecord;
          if(pageNumber==1) this.pageNumber=1;
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
