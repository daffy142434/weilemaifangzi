<template lang="html">
  <el-dialog
    width="80%"
    title="所有商品"
    :visible.sync="visible"
    @close="handleClose"
  >
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="mainPic"
        label="缩略图"
        width="90">
        <template slot-scope="scope">
          <el-popover
            ref="popover1"
            placement="right-start"
            title=""
            width="650"
            border
            trigger="click">
            <img :src="scope.row.mainPic" class="big-pic"></img>
          </el-popover>
          <img :src="scope.row.mainPic" class="small-pic" v-popover:popover1></img>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        :show-overflow-tooltip="true"
        width="150"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="originPrice"
        label="原价"
        width="110">
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="折后价"
        width="110">
      </el-table-column>
      <el-table-column
        :formatter="formatWeight"
        prop="packageWeight"
        label="重量"
        width="120">
      </el-table-column>
      <el-table-column
        label="尺寸"
        width="100">
        <template slot-scope="props">
          <span v-if="props.row.packageSize">{{props.row.packageSize}} <span v-if="props.row.sizeUnit">({{props.row.sizeUnit}})</span></span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        prop="asin"
        label="ASIN">
        <template slot-scope="scope">
          <asin-link :asin="scope.row.asin" :stationCode="scope.row.stationCode"></asin-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="upc"
        label="UPC"
        width="110">
      </el-table-column>
      <el-table-column
        prop="ean"
        label="EAN"
        width="110">
      </el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="sku"
        label="SKU">
      </el-table-column>
      <el-table-column
        prop=""
        label="别名"
        width="110">
      </el-table-column>
      <el-table-column
        prop="relationSkuFlag"
        label="关联产品库"
        :formatter="formatRelationSku"
        width="110">
      </el-table-column>
      <el-table-column
        prop="shippingFlag"
        label="FBA"
        :formatter="fbaFormat"
        width="95">
      </el-table-column>
      <el-table-column
        prop="offerSubmitStatus"
        label="报价状态"
        :formatter="formatOfferSubmitStatus"
        width="110">
      </el-table-column>
      <el-table-column
        prop="status"
        label="销售状态"
        :formatter="formatStatus"
        width="110">
      </el-table-column>
      <el-table-column
        prop="markStatus"
        label="库外状态"
        :formatter="formatMarkStatus"
        width="110">
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
import AsinLink from '@/components/asin-link';
import OnlineGoodsList from '@/pages/onlineGoodsList/services';

const onlineGoodsList = new OnlineGoodsList();

export default {
  components: {
    'asin-link': AsinLink
  },
  data() {
    return {
      loading: false,
      visible: false,
      productStatusForSelect: {
        "1": "在售",
        "2": "下架",
        "3": "上架处理中",
        "4": "下架处理中",
      },
      relationSkuMap: {
        "0": "未关联",
        "1": "已关联",
      },
      statusMap: {
        "1": "在售",
        "2": "下架",
        "3": "上架处理中",
        "4": "下架处理中",
      },
      offerSubmitStatusMap: {
        "0": "处理中",
        "1": "处理成功",
        "2": "处理失败",
        "3": "暂无报价",
      },
      markStatusMap: {
        '0': "无标记",
        '1': "库外",
        '2': "下架",
      },
      searchData: {
        pageSize: 10,
        pageNumber: 1,
        status: 1,
      },
      data: [],
      totalRecord: 0
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
      onlineGoodsList.getList(this.searchData).then((res) => {
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
    formatWeight(row, column, cellValue) {
      return (cellValue && row.weightUnit) ? (cellValue+' '+row.weightUnit) : '';
    },
    formatRelationSku(row, column, cellValue) {
      return this.relationSkuMap[cellValue] || "";
    },
    fbaFormat(row, column, cellValue) {
      if(cellValue || cellValue == '0') {
        return {'1': '是', '2': '否'}[cellValue];
      }else  {
        return '';
      }
    },
    formatOfferSubmitStatus(row, column, cellValue) {
      return this.offerSubmitStatusMap[cellValue] || "";
    },
    formatStatus(row, column, cellValue) {
      return this.statusMap[cellValue] || "";
    },
    formatMarkStatus(row, column, cellValue) {
      return this.markStatusMap[cellValue] || "";
    },
  }
}
</script>

<style lang="css">
</style>
