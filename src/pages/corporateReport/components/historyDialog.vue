<template lang="html">
  <el-dialog width="90%" title="历史账单" :visible="visible" @close="close">
    <el-table
      size="mini"
      v-loading="loading"
      :data="data"
      :cell-class-name="setCellClassName"
      :header-cell-class-name="setCellClassName"
      class="table-index"
      border
    >
        <el-table-column
          label="报告周期"
          width="120"
          align="center"
        >
          <template slot-scope="props">
            <!-- <div v-html="props.row.reportRangeText"></div> -->
            <div v-date="props.row.startDate"></div>
            <div v-if="props.row.endDate" v-date="props.row.endDate"></div><div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesIncome}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="广告成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.advertisementCost}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.advertisementCostCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="退货金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.returnAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.returnAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="其他"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.otherAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.otherAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售毛利"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.maoriAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="货物成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.costAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="头程成本"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.shippingAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="初期费用"
          align="center"
        >
          <template slot-scope="scope">
            <div>CNY</div>
            <div class="space">{{scope.row.brushesAmount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="回款金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.reimbursementAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.reimbursementAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="上期尾款"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.remittanceAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.remittanceAmountCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售收入"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.salesIncome}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.salesIncomeCny}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="预留金额"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row.currencyCode}}</div>
            <div class="space">{{scope.row.reservedAmount}}</div>
            <div>CNY</div>
            <div class="space">{{scope.row.reservedAmountCny}}</div>
          </template>
        </el-table-column>
      <el-table-column label="详细" width="125" fixed="left" align="center">
        <template slot-scope="scope">
          <div><el-tag type="warning" size="small" v-if="scope.row.calibrationFlag">已校准</el-tag><el-tag type="danger" size="small" v-else>校准有误</el-tag></div>
          <div class="detail-button"><el-button type="text" @click="showDetailDialog(scope.row)">查看</el-button></div>
          <div class="detail-button"><el-button type="text" @click="exportList(scope.row)">导出清单</el-button></div>
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
import CorporateReport from '../services';

const corporateReport = new CorporateReport();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        pageSize: 5,
        pageNumber: 1,
      }
    }
  },
  methods: {
    exportList(row){
      this.$emit('export-list',row);
    },
    setCellClassName({row, column, rowIndex, columnIndex}){
      if(columnIndex===2){
        return 'column1 column12';
      }else if(columnIndex>=3&&columnIndex<=6){
        return 'column1';
      }else if(columnIndex===7){
        return 'column2 column22';
      }else if(columnIndex>=8&&columnIndex<=11){
        return 'column2';
      }else if(columnIndex===12){
        return 'column3 column32';
      }else if(columnIndex>=13&&columnIndex<=15){
        return 'column3';
      }
      return '';
    },
    loadData(shopId) {
      this.shopId = shopId;
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      corporateReport.getNewReportListByShopId(this.shopId, this.searchData).then((res) => {
        const data = res.data.data.data || [];
        this.data = data.map(corporateReport.formatData);
        this.totalRecord = res.data.data.totalRecord;
      }).then(() => {
        this.loading = false;
      });
    },
    show(data) {
      this.visible = true;
      this.loadData(data.shopId);
    },
    close() {
      this.visible = false;
      this.loading = false;
      this.totalRecord = 0;
      this.data = [];
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    showDetailDialog(data) {
      this.$emit('showDetail', data);
    }
  }
}
</script>

<style lang="css" scoped>
.detail-button{
  margin-top: 5px;
}
</style>
