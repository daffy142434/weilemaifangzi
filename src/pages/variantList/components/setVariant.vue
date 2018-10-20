<template lang="html">
  <el-dialog title="变体维护" :visible="visible" @close="close" width="640px">
    <el-form label-width="120px" v-loading="loading">
      <el-form-item label="操作类型：">
        <el-radio-group v-model="form.execType">
          <el-radio :label="EXEC_TYPE.MAKE_CHILD_NODE">作为子SKU</el-radio>
          <el-radio :label="EXEC_TYPE.MAKE_SINGLE_NODE" v-if="data.nodeType === 'child'">作为独立SKU</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.execType === EXEC_TYPE.MAKE_CHILD_NODE" label="选择父SKU：">
        <el-form :inline="true">
          <el-form-item label="sku">
            <el-input type="text" size="mini" v-model="searchData.sku"></el-input>
          </el-form-item>
          <el-form-item label="asin">
            <el-input type="text" size="mini" v-model="searchData.asin"></el-input>
          </el-form-item>
          <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        </el-form>
        已选：{{selectedSku}}
        <div class="variant-tag-list">
          <span
            v-for="item in list"
            @click="handleSelectSku(item)"
          >
            <el-tag
              size="small"
              :type="item.id === form.parentProductId ? 'primary' : 'info'"
              :class="item.id === form.parentProductId ? 'tag-fill' : ''"
            >
              {{item.sku}}
            </el-tag>
          </span>
        </div>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="searchData.pageNumber"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="searchData.pageSize"
            layout="pager"
            :total="totalRecord"
          >
          </el-pagination>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import VariantList from '../services';

const variantList = new VariantList();

const EXEC_TYPE = {
  MAKE_CHILD_NODE: 1,
  MAKE_SINGLE_NODE: 2
};

export default {
  data() {
    return {
      visible: false,
      loading: false,
      EXEC_TYPE,
      data: {},
      list: [],
      totalRecord: 0,
      searchData: {
        sku: '',
        asin: '',
        pageNumber: 1,
        pageSize: 10,
      },
      selectedSku: '',
      form: {
        execType: EXEC_TYPE.MAKE_CHILD_NODE,
        parentProductId: null,
      },
      rules: {
        parentProductId: [
          {
            required: true,
            message: '请选择父SKU'
          }
        ]
      }
    }
  },
  methods: {
    show(data) {
      this.visible = true;
      this.data = data;
      this.onSearch();
    },
    close() {
      this.visible = false;
      this.loading = false;
      this.selectedSku = null;
      this.totalRecord = 0;
      this.searchData = {
        sku: '',
        asin: '',
        pageNumber: 1,
        pageSize: 10
      };
      this.form = {
        execType: EXEC_TYPE.MAKE_CHILD_NODE,
        parentProductId: ''
      };
    },
    submit() {
      let tansferProductId, parentProductId;

      tansferProductId = this.data.id;
      if (this.execType === EXEC_TYPE.MAKE_SINGLE_NODE) {
        parentProductId = this.form.parentProductId;
      } else {
        parentProductId = null;
      }
      this.loading = true;
      variantList.variantChange(tansferProductId, parentProductId).then(() => {
        this.loading = false;
        this.$message({
          message: '编辑变体成功',
          type: 'success'
        });
        this.close();
        this.$emit('variantSuccess');
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
    handleSelectSku({id, sku}) {
      if (this.selectedSku === sku) {
        this.selectedSku = null;
      } else {
        this.selectedSku = sku;
      }
      if (this.form.parentProductId === id) {
        this.form.parentProductId = null;
      } else {
        this.form.parentProductId = id;
      }
    },
    onSearch() {
      this.loading = true;
      variantList.getList(this.searchData).then((res) => {
        this.list = res.data.data.data || [];
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
        this.$forceUpdate();
      }).catch(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="less">
  .variant-tag-list {
    .el-tag {
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
