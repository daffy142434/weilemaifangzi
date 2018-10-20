<template lang="html">
  <div>
    <div class="page-title">
      实时销量
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公司">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
        <el-form-item label="国家">
          <constries-select v-model="searchData.stationCode"></constries-select>
        </el-form-item>
        <el-form-item>
          数据更新于北京时间：<span v-if="!updateDate" class="el-icon-loading"></span><span v-if="updateDate">{{updateDate}}</span>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="export" style="margin-bottom:10px;">
      <el-button type="primary" size="small" @click="exportData">导出90天在线SKU销量<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <div v-if="$store.state.powers.includes('shop_prduce_salse:list')">
      <el-table
        v-loading="loading"
        :data="data"
        border
        highlight-current-row
        style="width: 100%"
        ref="table"
        row-key="shopId"
        @expand-change="handleExpand"
      >
        <el-table-column type="expand" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">
          <template slot-scope="scope">
            <trend-chart
              @createTrend="handleCreateTrend"
              title="店铺产品实时销量"
              :loading="scope.row.loading"
              :id="scope.row.id"
              :data="scope.row.chartData"
              :shopId="scope.row.shopId"
            ></trend-chart>
          </template>
        </el-table-column>
        <el-table-column
          label="公司"
        >
          <template slot-scope="props">
            <div>
              <national-flag :stationCode="props.row.stationCode"></national-flag>
              <br />
              {{props.row.companyName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="店铺"
        >
          <template slot-scope="props">
            <div v-if="props.row.timeSection">
              <el-tag :type="props.row.timeSectionTagType" size="mini">{{props.row.timeSectionText}}</el-tag>
            </div>
            <amazon-link
              :marketId="props.row.marketId"
              :sellerId="props.row.sellerId"
              :stationCode="props.row.stationCode"
              :text="props.row.shopName"
            >
            </amazon-link>
          </template>
        </el-table-column>
        <el-table-column
          label="T日销售额"
          width="120"
        >
          <template slot-scope="scope">
            <div>
              <div>{{scope.row.salesAmountT}}</div>
              <div>数量：{{scope.row.salesQuantityT}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="T-1日销售额"
          width="120"
        >
          <template slot-scope="scope">
            <tread-column :arrow-up="scope.row.salesAmountTrendT1">{{scope.row.salesAmountT1}}</tread-column>
            <div>数量：{{scope.row.salesQuantityT1}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="T-2日销售额"
          width="120"
        >
          <template slot-scope="scope">
            <div>
              <div>{{scope.row.salesAmountT2}}</div>
              <div>数量：{{scope.row.salesQuantityT2}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="T-3日销售额"
          width="120"
        >
          <template slot-scope="scope">
            <div>
              <div>{{scope.row.salesAmountT3}}</div>
              <div>数量：{{scope.row.salesQuantityT3}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="预测本月销售额"
          prop="salesAmountPredict"
          width="160"
        >
          <template slot-scope="scope">
            <tread-column :arrow-up="scope.row.salesAmountPredictTrend">{{scope.row.salesAmountPredict}}</tread-column>
            <br />
            已售：{{scope.row.salesAmountAlready}}
          </template>
        </el-table-column>
        <el-table-column
          label="上月销售额"
          prop="salesAmountLast"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="Feedback"
          prop="feedBackScore"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)" v-if="$store.state.powers.includes('shop_prduce_salse:show')">详情</el-button>
            <el-button type="text" @click="showTrend($event, scope.row)" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">趋势</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[ 50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <product-sales-dialog ref="productSalesDialog"></product-sales-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import CompanySelect from '@/components/company-select';
import ContriesSelect from '@/components/contries-select';
import AmazonLink from '@/components/amazon-link';
import TrendChart from '@/components/chart/trendChart';
import NationalFlag from '@/components/national-flag';
import RealtimeSales from './services';
import ProductSalesDialog from './components/productSalesDialog';
import TreadColumn from './components/treadColumn';

const realtimeSales = new RealtimeSales();
const timeSectionMap = {
  '1': '当地零点至起床',
  '2': '当地销售好时段',
  '3': '当地即将到凌晨'
};
const timeSectionTagTypeMap = {
  '1': 'danger',
  '2': 'success',
  '3': 'warning'
};

export default {
  components: {
    'company-select': CompanySelect,
    'constries-select': ContriesSelect,
    'trend-chart': TrendChart,
    'product-sales-dialog': ProductSalesDialog,
    'tread-column': TreadColumn,
    'amazon-link': AmazonLink,
    'national-flag': NationalFlag
  },
  data() {
    return {
      format: format,
      updateDate: '',
      searchData: {
        companyId: '',
        stationCode: '',
        pageNumber: 1,
        pageSize: 50,
      },
      totalRecord: 0,
      loading: false,
      data: [],
    }
  },
  created() {
    try {
      this.onSearch();
    } catch (e) {}
    realtimeSales.getUpdateDate().then((res) => {
      this.updateDate = res.data.data;
    })
  },
  updated() {
  },
  methods: {
    exportData(){
      window.open("/data_analysis/export_produce_sales");
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        companyId: '',
        stationCode: '',
        pageNumber: 1,
        pageSize: 10,
      };
      this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.loading = true;

      realtimeSales.getList(this.searchData).then((res) => {
        this.data = (res.data.data.data || []).map((d, index) => {
          d.loading = false;
          d.isLoad = false;
          d.chartData = [];
          d.timeSectionText = timeSectionMap[d.timeSection] || '';
          d.timeSectionTagType = timeSectionTagTypeMap[d.timeSection] || '';
          return d;
        });
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleExpand(row, isExpand) {
      if (!isExpand) {
        return;
      }
      const newData = this.data.filter((d) => {
        if (d.id === row.id) {
          d.loading = true;
        }
        return d;
      });
      this['data'] = newData;
    },
    handleCreateTrend({id, shopId, vm}) {
      if (vm.loading) {
        return;
      }
      vm.loading = true;
      this.loadingTrend(id, shopId, vm);
    },
    loadingTrend(id, shopId, chartVM) {
      realtimeSales.getShopTrendByShopId(shopId).then((res) => {
        let chartData;
        const newData = this.data.map((d) => {
          if (id === d.id) {
            chartData = this.getChartData(res.data.data || []);
            d.chartData = chartData;
          }
          return d;
        });
        if (chartData) {
          setTimeout(() => {
            chartVM.render(chartData);
          });
        }
        this.data = newData;
        chartVM.loading = false;
      }).catch(() => {
        chartVM.loading = false;
      });
    },
    hideLoading() {
      const newData = this.data.map((d) => {
        d.loading = false;
        return d;
      });
      this.data = newData;
    },
    getChartDefaultData() {
      return {
        xAxis: [],
        data:[
          {
            yAxis: {
              name: '金额',
              type: 'value',
            },
            lists: [
              {
                name: '销售额',
                type: 'line',
                data: []
              },
              {
                name: '30天日均销售额',
                type: 'line',
                data: []
              }
            ]
          },
          {
            yAxis: {
              name: 'feedback',
              type: 'value',
            },
            lists: [
              {
                name: 'feedback',
                type: 'line',
                data: []
              }
            ]
          },
        ]
      };
    },
    getChartData(data) {
      const chartData = this.getChartDefaultData();
      data.map((d) => {
        chartData.data[0].lists[0].data.push(d.salesAmount);
        chartData.data[0].lists[1].data.push(d.averagDailySalesAmount);
        chartData.data[1].lists[0].data.push(d.feedBackScore);
        chartData.xAxis.push(format.toDate(d.dateTime));
      });
      return chartData;
    },
    showDetail(rowData) {
      this.$refs.productSalesDialog.show(rowData.shopId);
    },
    showTrend(e, rowData) {
      let td;

      td = e.target;
      while(td.tagName !== 'TD') {
        td = td.parentNode;
      }
      const firstTd = td.parentNode.children[0];
      firstTd.children[0].children[0].click();
    }
  }
}
</script>

<style lang="less">
.trend-chart {
  width: 800px;
  height: 300px;
  .chart {
    height: 300px;
  }
}
</style>
