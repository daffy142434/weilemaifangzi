<template lang="html">
  <el-dialog
    title="库查询"
    :visible.sync="visible"
    width="90%"
    @close="close"
    append-to-body
  >
    <div class="search-bar">
      <el-form
        ref="form"
        label-width="80px"
        class="fl"
        inline
      >
        <el-form-item label="国家">
          <contries-select v-model="searchData.countryCode">
          </contries-select>
        </el-form-item>
        <el-form-item label="库名">
          <el-input v-model="searchData.storageName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchData.status">
            <el-option label="请输入" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="库名称"
        prop="storageName"
      >
      </el-table-column>
      <el-table-column
        label="库编号"
        width="180"
        prop="storageNo"
      >
      </el-table-column>
      <el-table-column
        label="库地址"
        width="240"
        prop="storageAddress"
      >
      </el-table-column>
      <el-table-column
        label="建库时间"
        width="100"
      >
        <template slot-scope="props">
          <span v-date="props.row.storageCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="库国家"
        prop="countryName"
      >
      </el-table-column>
      <el-table-column
        label="仓库类型"
      >
        <template slot-scope="props">
          {{STORAGE_TYPE[props.row.storageType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="库状态"
        prop="status"
      >
        <template slot-scope="props">
          {{STATUS[props.row.status]}}
        </template>
      </el-table-column>
      <el-table-column
        label="库状态"
      >
        <template slot-scope="props">
          <el-button type="text" @click="handleSelect(props.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

</template>

<script>
import Warehouse from '../services';
import WAREHOUSE from '../const';

const warehouse = new Warehouse();

const { STORAGE_TYPE, STATUS } = WAREHOUSE;

export default {
  data() {
    return {
      STORAGE_TYPE,
      STATUS,
      loading: false,
      visible: false,
      data: [],
      searchData: {
        pageNumber: 1,
        pageSize: 10,
        countryCode: '',
        storageName: '',
        status: '',
      }
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.onSearch();
    },
    close () {
      this.visible = false;
      this.searchData.countryCode = '';
      this.searchData.storageName = '';
      this.searchData.status = '';
    },
    handleSizeChange(v) {
      this.pageSize = v;
    },
    handleCurrentChange(v) {
      this.pageNumber = v;
    },
    onSearch() {
      this.loading = true;
      warehouse.search(this.searchData).then((res) => {
        this.loading = false;
        this.data = res.data.data;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleSelect(data) {
      this.$emit('select', data);
      this.close();
    }
  },
};
</script>

<style lang="less">
.warehouse-search-list {

}
</style>
