<template lang="html">
  <div>
    <div class="search-bar">
      <el-button type="success" size="small" @click="addSupplier">新增供应商</el-button>
    </div>
    <el-table
      ref="singleTable"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="loginName"
        label="操作"
        width="150">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="是否默认"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="供应商"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最小起订量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="备货天数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="价格（元）"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="联系人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="联系方式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="备注"
        width="180">
      </el-table-column>
    </el-table>
    <supplierDialog :visible="visible" @close="hideSkuManager">
    </supplierDialog>
  </div>
</template>

<script>
import supplierDialog from './supplierDialog';
export default {
  data() {
    return {
      visible: false
    }
  },
  components: {
    supplierDialog
  },
  methods: {
    addSupplier() {
      this.visible = true;
    },
    hideSkuManager() {
      this.visible = false;
    }
  }
}
</script>

<style lang="less">
</style>
