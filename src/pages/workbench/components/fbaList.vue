<template lang="html">
  <el-dialog
    width="80%"
    title="预警商品"
    :visible.sync="visible"
    @close="handleClose"
  >
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        prop="mainPic"
        label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.mainPic" height="68" />
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="店铺名">
        <template slot-scope="scope">
          <amazon-link
            :marketId="scope.row.marketId"
            :sellerId="scope.row.sellerId"
            :stationCode="scope.row.stationCode"
            :text="scope.row.shopName"
          ></amazon-link>
        </template>
      </el-table-column>
      <el-table-column
        label="sku"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div>库存不足，请及时补充</div>
            <span slot="reference" class="icon-alarm" v-if="scope.row.warnStatus === 1"></span>
          </el-popover>
          <el-popover trigger="hover" placement="top">
            <div>此商品监控中</div>
            <span slot="reference" class="icon-monitoring" v-if="scope.row.warnType !== 0"></span>
          </el-popover>
          <asin-link
            :asin="scope.row.asin"
            :stationCode="scope.row.stationCode"
            :text="scope.row.sku"
          ></asin-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="amaStcokNum"
        label="当前库存">
      </el-table-column>
      <el-table-column
        prop="salesVolumePer30"
        label="30天日均销量">
      </el-table-column>
      <el-table-column
        prop="saleableDays"
        label="可售天数">
      </el-table-column>
      <el-table-column
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
import FbaList from '@/pages/fbaList/services';

const fbaList = new FbaList();

export default {
  components: {
    'amazon-link': AmazonLink,
    'asin-link': AsinLink
  },
  data() {
    return {
      loading: false,
      visible: false,
      data: [],
      totalRecord: 0,
      searchData: {
        sku: '',
        asin: '',
        shippingType: '',
        pageSize: 10,
        pageNumber: 1,
        warnStatus: 1,
      },
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.onSearch();
    },
    handleClose() {
      this.visible = false;
      this.loading = false;
      this.data = [];
      this.searchData.pageNumber = 1;
    },
    onSearch() {
      this.loading = true;
      fbaList.getList(this.searchData).then((res) => {
        this.data = res.data.data.data || [];
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleStockWarnDialog(data) {
      this.$emit('showStockWarnDialog', data);
    }
  }
}
</script>

<style lang="css">
</style>
