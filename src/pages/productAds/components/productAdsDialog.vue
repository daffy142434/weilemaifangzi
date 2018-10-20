<template lang="html">
  <el-dialog
    title="店铺广告投放报表"
    width="90%"
    :visible.sync="visible"
    @close="close"
  >
    <el-table
      v-loading="loading"
      size="mini"
      :data="data"
      border
      highlight-current-row
      style="width: 100%"
      ref="table"
      row-key="sku"
      @expand-change="handleExpand"
    >
      <el-table-column
        type="expand"
        fixed="left"
        v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')"
      >
        <template slot-scope="scope">
          <trend-chart
            @createTrend="handleCreateTrend"
            title="店铺产品实时销量"
            :loading="scope.row.loading"
            :data="scope.row.chartData"
            :transferData="scope.row"
          ></trend-chart>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        min-width="180"
        class-name="sku-column"
        fixed="left"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <el-popover
              ref="popover1"
              placement="right-start"
              title=""
              width="650"
              border
              trigger="click">
              <img :src="scope.row.imageUrl" class="big-pic"/>
            </el-popover>
            <img :src="scope.row.imageUrl" v-popover:popover1/>
            <div class="sku-column-text">{{scope.row.sku}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
      >
        <template slot-scope="scope">
          <span v-date="scope.row.startDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="展示量"
        prop="impressions"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="点击量"
        prop="clicks"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="点击率"
        width="120"
      >
        <template slot-scope="props">
          <span v-percent="props.row.ctr"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="花销"
        width="160"
      >
        <template slot-scope="scope">
          {{scope.row.totalSpend}} ({{scope.row.currency}})
        </template>
      </el-table-column>
      <el-table-column
        label="点击成本"
        width="120"
      >
        <template slot-scope="scope">
          {{scope.row.avgCpc}} ({{scope.row.currency}})
        </template>
      </el-table-column>
      <el-table-column
        label="平均ACOS"
        width="120"
      >
        <template slot-scope="props">
          <span v-percent="props.row.avgAcos"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showTrend($event, scope.row)" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">趋势</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  </el-dialog>
</template>

<script>
import RealtimeSales from '../services';
import TrendChart from '@/components/chart/trendChart';
import format from '@/lib/format';
import TreadColumn from '../components/treadColumn';
import listFormat from '../lib/listFormat';

const realtimeSales = new RealtimeSales();

export default {
  components: {
    'trend-chart': TrendChart,
    'tread-column': TreadColumn
  },
  data() {
    return {
      visible: false,
      loading: false,
      shopId: 3,
      data: [],
      totalRecord: 0,
      searchData: {
        pageSize: 10,
        pageNumber: 1,
        date: ''
      }
    }
  },
  methods: {
    show(data) {
      this.visible = true;
      this.loading = true;
      this.shopId = data.shopId;
      this.searchData.date = format.toDate(data.createDate);
      this.onSearch();
    },
    onSearch() {
      realtimeSales.getShopAdsReport(this.shopId, this.searchData).then((res) => {
        this.data = (res.data.data.data || []).map((d, index) => {
          d.loading = false;
          d.isLoad = false;
          d.chartData = {};
          return d;
        });
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    close() {
      this.visible = false;
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
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
    handleCreateTrend({transferData, vm}) {
      if (vm.loading) {
        return;
      }
      const {id, sku, shopId} = transferData;
      vm.loading = true;
      this.loadingTrend(id, sku, shopId, vm);
    },
    loadingTrend(id, sku, shopId, chartVM) {
      realtimeSales.getShopTrendBySku(sku, shopId).then((res) => {
        const newData = this.data.map((d) => {
          if (id === d.id) {
            const chartData = this.getChartData(res.data.data || []);
            d.chartData = chartData;
            setTimeout(() => {
              chartVM.render((options) => {
                options.grid = {
                  right: '20%'
                }
                return options;
              });
            });
          }
          return d;
        });
        this.data = newData;
        chartVM.loading = false;
      }).catch(() => {
        chartVM.loading = false;
      });
    },
    getChartDefaultData() {
      return {
        xAxis: [],
        data:[
          {
            yAxis: {
              name: '花销',
              type: 'value',
            },
            lists: [
              {
                name: '花销',
                type: 'line',
                data: []
              }
            ]
          },
          {
            yAxis: {
              name: '平均ACOS',
              type: 'value',
            },
            lists: [
              {
                name: '平均ACOS',
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
        chartData.data[0].lists[0].data.push(d.totalSpend);
        chartData.data[1].lists[0].data.push(d.avgAcos);
        chartData.xAxis.push(format.toDate(d.startDate));
      });
      return chartData;
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
</style>
