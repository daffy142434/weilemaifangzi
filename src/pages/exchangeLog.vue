<template lang="html">
  <div>
    <div class="page-title">
      汇率维护历史
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" label-width="100px">
        <el-form-item label="币种">
          <el-select v-model="searchData.currency" placeholder="请选择" style="width: 100%;">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="(name, code) in currencys"
              :key="code"
              :label="name"
              :value="code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护时间">
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期" v-model="searchData.startDate" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center;">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择结束日期" v-model="searchData.endDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset" style="margin-left: 10px;">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div v-if="$store.state.powers.includes('exchange_rate_history:list')">
      <el-table
        v-loading.body="tableLoading"
        ref="currencyTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          label="原始币种名称"
          prop="originalCurrencyName">
        </el-table-column>
        <el-table-column
          label="原始币种编码"
          prop="originalCurrency">
        </el-table-column>
        <el-table-column
          label="人民币兑换率"
          prop="cnyExchangeRate">
        </el-table-column>
        <el-table-column
          label="美元兑换率"
          prop="usdExchangeRate">
        </el-table-column>
        <el-table-column
          label="上次人民币兑换率"
          prop="lastCnyExchangeRate">
        </el-table-column>
        <el-table-column
          label="上次美元兑换率"
          prop="lastUsdExchangeRate">
        </el-table-column>
        <el-table-column
          label="维护人"
          prop="creator">
        </el-table-column>
        <el-table-column
          label="维护时间"
          :formatter="format.toDateTime"
          prop="createTime">
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
  </div>
</template>
<script>
import ajax from '../lib/ajax';
import moment from 'moment';
import format from '../lib/format';
export default {
  data() {
    return {
      format: format,
      searchData: {
        currency: '',
        startDate: '',
        endDate: '',
      },
      currencys: {
        'USD': '美元',
        'GBP': '英镑',
        'EUR': '欧元',
        'JPY': '日元',
        'CAD': '加币',
        'CNY': '人民币',
      },
      totalRecord: 0,
      pageSize: 10,
      pageNumber:1,
      tableLoading: false,
      tableData: [],
    }
  },
  created() {
    this.onSearch();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val});
    },
    handleReset() {
      this.searchData = {
        currency: '',
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
      ajax.post('/exchange_rate/log/list', params)
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = response.data.data.data || [];
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
