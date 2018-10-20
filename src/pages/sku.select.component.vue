<template lang="html">
  <el-dialog :visible="visible" @close="close" width="800px">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="SKU">
          <el-input size="small" v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="ASIN">
          <el-input size="small" v-model="searchData.asin" placeholder="ASIN"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <el-table
      title="店铺商品查询"
      size="mini"
      v-loading="loading"
      :data="data"
    >
      <el-table-column
        label="SKU"
        width="180"
        class-name="sku-column"
        fixed="left"
      >
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
          <img :src="scope.row.mainPic" v-popover:popover1></img>
          <div>
            {{scope.row.sku}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="ASIN"
      >
        <template slot-scope="props">
          <asin-link :stationCode="props.row.stationCode" :asin="props.row.asin"></asin-link>
        </template>
      </el-table-column>
      <el-table-column
        label="店铺名称"
        prop="shopName"
      >
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toList(scope.row)">查看</el-button>
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
import ajax from '@/lib/ajax';
import AsinLink from '@/components/asin-link';
import OnlineGoodsList from '@/pages/onlineGoodsList/services';
import FbaList from '@/pages/fbaList/services';

const onlineGoodsList = new OnlineGoodsList();
const fbaList = new FbaList();

export default {
  components: {
    'asin-link': AsinLink
  },
  data() {
    return {
      visible: false,
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        sku: '',
        asin: '',
        pageSize: 10,
        pageNumber: 1
      }
    }
  },
  methods: {
    show(data, searchData) {
      this.visible = true;
      this.data = data;
      this.searchData.sku = searchData.sku;
      this.searchData.asin = searchData.asin;
      this.totalRecord = searchData.totalRecord;
    },
    close() {
      this.visible = false;
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    onSearch() {
      let p;

      switch(this.$router.currentRoute.name) {
        case 'onlineGoods':
          p = new onlineGoodsList.getList(this.searchData);
          break;
        case 'fbaShopsList':
          p = new fbaList.getList(this.searchData);
          break;
      }

      this.loading = true;
      p.then((res) => {
        this.loading = false;
        this.totalRecord = res.data.data.totalRecord;
        this.data = res.data.data.data || [];
      }).catch(() => {
        this.loading = false;
      });
    },
    toList(data) {
      this.loading = true;
      ajax.post('/shops/list_all', {shopName: data.shopName}).then((res) => {
        this.loading = false;
        this.visible = false;
        this.showOnlineProduct(res.data.data[0], data);
      }).catch(() => {
        this.loading = false;
      });
    },
    showOnlineProduct(shop, data) {
      const query = {
        shopId: shop.id,
        shopName: shop.shopName,
        stationCode: shop.stationCode,
        pmDepartmentName: shop.pmDepartmentName,
        pmUserName: shop.pmUserName
      };
      const params = {
        backHref: location.href,
        searchData: {
          sku: data.sku,
          asin: data.asin
        }
      }
      let name;
      switch(this.$router.currentRoute.name) {
        case 'onlineGoods':
          name = 'onlineGoodsList';
          break;
        case 'fbaShopsList':
          name = 'fbaList';
          break;
        case 'variant':
          name = 'variantList';
          break;
      }
      this.$router.push({
        name,
        query,
        params
      });
    },
  }
}
</script>

<style lang="css">
</style>
