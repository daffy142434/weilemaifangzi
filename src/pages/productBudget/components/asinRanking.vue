<template lang="html">
  <div>
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      size="mini"
      style="width: 100%">
      <el-table-column
        label="ASIN"
        prop="asin"
      >
      </el-table-column>
      <el-table-column
        label="查询亚马逊"
      >
        <template slot-scope="props">
          <asin-link :stationCode="props.row.stationCode" :asin="props.row.asin" :text="'查看'"></asin-link>
        </template>
      </el-table-column>
      <el-table-column
        label="查询keepa"
      >
        <template slot-scope="props">
          <keepa-link :stationCode="props.row.stationCode" :asin="props.row.asin" :text="'查看'"></keepa-link>
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
  </div>
</template>

<script>
import AsinLink from '@/components/asin-link';
import KeepaLink from '@/components/keepa-link';
import ProductBudget from '../services.js';

const productBudget = new ProductBudget();

export default {
  props: ['id', 'num', 'stationCode'],
  components: {
    'asin-link': AsinLink,
    'keepa-link': KeepaLink
  },
  created() {
    this.onSearch();
  },
  data() {
    return {
      loading: false,
      totalRecord: 0,
      data: [],
      searchData: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    onSearch() {
      const params = {
        id: this.id,
        num: this.num,
        pageNumber: this.searchData.pageNumber,
        pageSize: this.searchData.pageSize
      };
      this.loading = true;
      productBudget.getAsinRanking(params).then((res) => {
        this.data = res.data.data.data;
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="css">
</style>
