<template lang="html">
  <el-dialog
    title="店铺商品实时销量"
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
      <el-table-column type="expand" fixed="left" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">
        <template slot-scope="scope">
          <trend-chart
            @createTrend="handleCreateTrend"
            title="店铺产品实时销量"
            :loading="scope.row.loading"
            :transferData="scope.row"
            :data="scope.row.chartData"
          ></trend-chart>
        </template>
      </el-table-column>
      <el-table-column
        label="SKU"
        width="180"
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
            <img :src="scope.row.imageUrl" class="big-pic"></img>
          </el-popover>
          <img :src="scope.row.imageUrl" v-popover:popover1></img>
          <div class="sku-column-text">
            <el-popover trigger="hover" placement="top">
              <div>库存不足，请及时补充</div>
              <span slot="reference" class="icon-alarm" v-if="scope.row.stockWarnStatus === 1"></span>
            </el-popover>
            <asin-link
              :asin="scope.row.asin"
              :stationCode="scope.row.stationCode"
              :text="scope.row.sku"
            ></asin-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="折后价"
        prop="unitPrice"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            {{scope.row.unitPrice}}
          </div>
          <el-tag size="small" :color="getColor(scope.row.saleableDays)" style="color: #fff;">可售天数{{scope.row.saleableDays}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="T日销售量"
        prop="salesVolumeT"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="T-1日销售量"
        width="120"
      >
        <template slot-scope="scope">
          <tread-column :arrow-up="scope.row.salesVolumeTrendT1">{{scope.row.salesVolumeT1}}</tread-column>
        </template>
      </el-table-column>
      <el-table-column
        label="T-2日销售量"
        prop="salesVolumeT2"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="T-3日销售量"
        prop="salesVolumeT3"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="30天日均"
        prop="salesVolumePer30"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="本月红单"
        prop="clickFarmingAmount"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="预测本月销售量"
        prop="salesAmountPredict"
        width="160"
      >
        <template slot-scope="scope">
          <tread-column :arrow-up="scope.row.salesVolumePredictTrend">{{scope.row.salesVolumePredict}}</tread-column>
          <br />
          已售：{{scope.row.salesVolumeAlready}}
        </template>
      </el-table-column>
      <el-table-column
        label="上月销售量"
        prop="salesVolumeLast"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="可售库存"
        prop="amaSaleableNum"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="FBA头程数"
        prop="fisrtLegNum"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="可售天数"
        prop="saleableDays"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="星级评分"
        prop="productScore"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="评论数"
        prop="productCommentNum"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
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
        :page-sizes="[50, 100]"
        :page-size="searchData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import AmazonLink from '@/components/amazon-link';
import AsinLink from '@/components/asin-link';
import TrendChart from '@/components/chart/trendChart';
import format from '@/lib/format';
import RealtimeSales from '../services';
import TreadColumn from '../components/treadColumn';

const realtimeSales = new RealtimeSales();

export default {
  components: {
    'trend-chart': TrendChart,
    'tread-column': TreadColumn,
    'amazon-link': AmazonLink,
    'asin-link': AsinLink
  },
  data() {
    return {
      visible: false,
      loading: false,
      shopId: 3,
      data: [],
      totalRecord: 0,
      searchData: {
        pageSize: 50,
        pageNumber: 1
      }
    }
  },
  methods: {
    getColor(amaSaleableNum) {
      if(amaSaleableNum == 0) {
        return '#F56C6C';
      }else if(amaSaleableNum <= 45) {
        return '#E6A23C';
      }else if(amaSaleableNum <= 120) {
        return '#67C23A';
      }else if(amaSaleableNum < 9999) {
        return '#909399';
      }else if(amaSaleableNum == 9999) {
        return '#DCDFE6';
      }
    },
    show(shopId) {
      this.visible = true;
      this.loading = true;
      this.shopId = shopId;
      this.onSearch();
    },
    onSearch() {
      realtimeSales.getProductListByShopId(this.shopId, this.searchData).then((res) => {
        this.data = (res.data.data.data || []).map((d, index) => {
          d.loading = false;
          d.isLoad = false;
          d.shopId = this.shopId;
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
      realtimeSales.getProductTrend(sku, shopId).then((res) => {
        const newData = this.data.map((d) => {
          if (id === d.id) {
            const chartData = this.getChartData(res.data.data || []);
            d.chartData = chartData;
            setTimeout(() => {
              chartVM.render((options) => {
                options.grid = {
                  right: '180'
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
              name: '单价',
              type: 'value',
              position: 'left',
              axisLine: {
                  lineStyle: {
                      color: '#c23531'
                  }
              },
            },
            lists: [
              {
                name: '单价',
                type: 'line',
                data: []
              },
            ]
          },
          {
            yAxis: {
              name: '销售量',
              type: 'value',
              position: 'right',
              axisLine: {
                  lineStyle: {
                      color: '#2f4554'
                  }
              },
            },
            lists: [
              {
                name: '销售量',
                type: 'line',
                data: []
              },
              {
                name: '30天日均销售量',
                type: 'line',
                data: []
              },
            ]
          },
          {
            yAxis: {
              name: '评论数',
              type: 'value',
              position: 'right',
              offset: 60,
              axisLine: {
                  lineStyle: {
                      color: '#d48265'
                  }
              },
            },
            lists: [
              {
                name: '评论数',
                type: 'line',
                data: []
              }
            ]
          },
          {
            yAxis: {
              name: '评分',
              type: 'value',
              position: 'right',
              offset: 120,
              axisLine: {
                  lineStyle: {
                      color: '#91c7ae'
                  }
              }
            },
            lists: [
              {
                name: '评分',
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
        chartData.data[0].lists[0].data.push(d.unitPrice);
        chartData.data[1].lists[0].data.push(d.salesVolume);
        chartData.data[1].lists[1].data.push(d.salesVolumePer30);
        chartData.data[2].lists[0].data.push(d.productCommentNum);
        chartData.data[3].lists[0].data.push(d.productScore);
        chartData.xAxis.push(format.toDate(d.dateTime));
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
