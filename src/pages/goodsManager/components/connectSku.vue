<template lang="html">
  <div>
    <div class="search-bar">
      <el-button type="success" size="small" @click="addSKU">新增SKU</el-button>
    </div>
    <el-table
      ref="singleTable"
      border
      :data="data.skuInfos"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="originSku"
        label="主SKU"
        width="250">
      </el-table-column>
      <el-table-column
        prop="relationSku"
        label="关联SKU"
        width="200">
      </el-table-column>
      <el-table-column
        prop="ecPlatformCode"
        :formatter="platFormFormatter"
        label="平台"
        width="180">
      </el-table-column>
      <el-table-column
        prop="shopId"
        :formatter="shopNameFormatter"
        label="店铺">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="80">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;text-align: center;">
      <el-button v-if="data.action !='edit' && false" type="primary" icon="el-icon-upload" @click="saveRelationSku">保存信息</el-button>
      <el-button type="primary" icon="el-icon-check" @click="submitRelationSku">提交信息</el-button>
    </div>
    <skuManagerDialog :data="data" :shops="shops" :visible="visible" @close="hideSkuManager">
    </skuManagerDialog>
  </div>
</template>

<script>
import ajax from 'lib/ajax';
import skuManagerDialog from './skuManagerDialog';
export default {
  props: ['data', 'title', 'shops'],
  data() {
    return {
      ecPlatformMap: {
				'ama':'亚马逊',
				'cdi':'Cdiscount',
				'aliep':'速卖通',
				'pm':'Priceminister',
				'other': '其它平台'
      },
      // shops: [],
      visible: false,
    }
  },
  components: {
    skuManagerDialog
  },
  methods: {
    shopNameFormatter(row, column, cellValue) {
      let shop = this.shops.filter((item) => item.id == cellValue)[0];

      return shop ? shop.shopName : '';
    },
    platFormFormatter(row, column, cellValue) {
      return this.ecPlatformMap[cellValue] || "";
    },
    addSKU() {
      if(!this.data.originSku) {
        this.$message({
          showClose: true,
          message: '请先在基本信息中填写主SKU',
          type: 'warning'
        });
        return;
      }
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },

    hideSkuManager() {
      this.visible = false;
    },
    handleDelete(index, row) {
      let self = this;
      let confirmMsg = '确认删除该关联SKU？';
      this.$confirm(confirmMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function(){
        self.data.skuInfos.splice(index, 1);
      });
    },
    saveRelationSku() {
      this.$store.dispatch('saveGoods');
    },
    submitRelationSku() {
      this.$store.dispatch('submitGoods');
    },
  }
}
</script>

<style lang="less">
</style>
