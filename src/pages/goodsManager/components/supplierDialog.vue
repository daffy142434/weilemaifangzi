<template lang="html">
  <el-dialog
    ref="dialog"
    :title="title"
    :visible="visible"
    class="v-center-dialog"
    @close="handleClick"
  >
    <el-form label-width="100px">
      <el-form-item label="供应商">
        <el-select v-model="supplier" style="width: 100%;">
          <el-option value="" label="请选择"></el-option>
          <el-option value="custom" label="自定义新的供应商信息"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品链接">
        <el-input v-model="supplyProductUrl" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="是否默认">
        <el-radio-group v-model="defaultFlag">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="supplierArea" v-if="isCustom">
        <el-form-item label="供应商名称">
          <el-input v-model="name" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="开发人">
          <el-select v-model="developer" style="width: 100%;"></el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="defaultFlag">
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="供应商链接">
          <el-input v-model="supplierUrl" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="contactName" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="contactPhone" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="address" type="textarea" style="width: 100%;"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="采购价格">
        <el-input v-model="purchasePrice" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="采购单位">
        <el-select v-model="purchaseUnit" multiple style="width: 100%;"></el-select>
      </el-form-item>
      <el-form-item label="最小起订量">
        <el-input v-model="minOrderNum" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="备货天数">
        <el-input
          v-model="prepareDays"
          style="width: 100%;"
          placeholder="备货天数,预计从订货到入仓时间"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="prepareDays" type="textarea" style="width: 100%;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关闭</el-button>
      <el-button type="primary" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  mounted() {
    this.$refs.dialog.$el.querySelector('.el-icon-close').addEventListener('click', () => {
      this.handleClose();
    });
  },
  data() {
    return {
      title: "添加供应商信息",
      supplier: ""
    }
  },
  computed: {
    isCustom() {
      return this.supplier === 'custom'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="less">
  .supplierArea {
    background: #FCFCFC;
    border: #EEE 1px solid;
    padding: 15px 15px 0 0;
    margin-bottom: 15px;
  }
  .v-center-dialog {
    .el-dialog {
      top: 10% !important;
      height: 80%;
      display: flex;
      flex-direction: column;
      .el-dialog__header {
        height: 22px;
        border-bottom: #CCC 1px solid;
        padding: 10px 20px;
      }
      .el-dialog__body {
        flex: 1;
        overflow: auto;
      }
      .el-dialog__footer {
        height: 53px;
        border-top: #CCC 1px solid;
      }
    }
  }
</style>
