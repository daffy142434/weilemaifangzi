<template lang="html">
  <div>
    <div class="page-title">
      商品建模画像
    </div>
    <div v-if="permissions('product_devp_estimate:main_list')">
      <el-row>
        <el-col
          :span="8"
          v-for="(item, index) in list"
          :key="`word_${index}`"
        >
          <main-word-item
            :data="item"
            @success="onSearch"
          >
          </main-word-item>
        </el-col>
      </el-row>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[15, 25, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

import MainWordItem from './components/mainWordItem';
import ProductBudget from './services';

const productBudget = new ProductBudget();

export default {
  components: {
    'main-word-item': MainWordItem
  },
  data() {
    return {
      list: [],
      totalRecord: 0,
      searchData: {
        pageNumber: 1,
        pageSize: 15,
      }
    };
  },
  created() {
    this.onSearch();
  },
  methods: {
    onSearch() {
      productBudget.getList(this.searchData).then((res) => {
        this.totalRecord = res.data.data.totalRecord;
        this.list = res.data.data.data || [];
      });
    },
    handleSizeChange(v) {
      this.searchData.pageSize = v;
      this.onSearch();
    },
    handleCurrentChange(v) {
      this.searchData.pageNumber = v;
      this.onSearch();
    },
  }
};

</script>

<style lang="less">
@import "./style";
</style>
