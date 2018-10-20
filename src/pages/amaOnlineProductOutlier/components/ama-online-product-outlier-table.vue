<template lang="html">
  <el-table
    v-loading.body="loading"
    :data="data"
    border
    highlight-current-row
    style="width: 100%">
    <el-table-column
      label="店铺"
      prop="shopName"
      width="200"
    >
    </el-table-column>
    <el-table-column
      label="运营归属部门"
      prop="pmDepartmentName"
      width="140"
    >
    </el-table-column>
    <el-table-column
      label="运营归属人"
      prop="pmUserName"
      width="120"
    >
    </el-table-column>
    <el-table-column
      label="异常类型"
      prop="exceptionType"
      width="120"
      :formatter="formatExceptionType"
    >
    </el-table-column>
    <el-table-column
      label="异常明细"
      prop="exceptionDesc"
      width="300"
    >
    </el-table-column>
    <el-table-column
      label="发生时间"
      width="180"
    >
      <template slot-scope="scope">
        <span v-datetime="scope.row.createTime"></span>
      </template>
    </el-table-column>
    <el-table-column
      label="SKU"
      prop="sku"
      width="240"
    >
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
      label="处理状态"
      prop="processStatus"
      width="100"
      :formatter="formatProcessStatus"
    >
    </el-table-column>
    <el-table-column
      label="操作员"
      prop="modifier"
      width="100"
    >
    </el-table-column>
    <el-table-column
      label="操作时间"
      width="180"
    >
      <template slot-scope="scope">
        <span v-datetime="scope.row.modifyTime"></span>
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      fixed="right"
      v-if="isOperation"
    >
      <template slot-scope="scope">
        <el-button type="text" @click="operation(scope.row)">{{type === 'exception' ? '处理' : '查看备注'}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    data: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    isOperation: {
      type: Boolean
    }
  },
  methods: {
    operation(rowData) {
      this.$emit('onOperation', [rowData]);
    },
    formatExceptionType(row, col, val) {
      return ['', '疑似被下架'][val] || '';
    },
    formatProcessStatus(row, col, val) {
      return ['', '待处理', '处理中', '已处理'][val] || '';
    },
  }
}
</script>

<style lang="css">
</style>
