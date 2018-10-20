<template lang="html">
  <div>
    <div class="page-title">
      退货情况
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="店铺">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchData.amaOrderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="异常情况">
          <el-select v-model="searchData.exceptionReturnFlag">
            <el-option label="请选择" value=""></el-option>
            <el-option label="异常" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div v-if="$store.state.powers.includes('return_order:ama_list')">
      <el-table
        v-loading.body="loading"
        ref="currencyTable"
        :data="data"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="异常情况"
          width="100"
          align="center"
        >
          <template slot-scope="props">
            <span
              class="icon-point icon-point-success"
              v-if="props.row.exceptionFlag === 0"
            ></span>
            <el-tooltip
              v-if="props.row.exceptionFlag !== 0"
              placement="top"
              :content="props.row.exceptionTypeDesc"
            >
              <span class="el-icon-warning" style="font-size: 20px; color: #E6A23C;"></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="公司名称"
          prop="companyName"
        >
        </el-table-column>
        <el-table-column
          label="店铺名称"
          prop="shopName"
        >
        </el-table-column>
        <el-table-column
          label="退货时间(当地)"
          min-width="165"
        >
          <template slot-scope="props">
            <span v-datetime="props.row.returnDateTz"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="退货时间(格林威治)"
          min-width="165"
        >
          <template slot-scope="props">
            <span v-datetime="props.row.returnDateUtc"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          prop="amaOrderId"
          min-width="180"
        >
        </el-table-column>
        <el-table-column
          label="退货商品"
        >
          <template slot-scope="props">
            <el-popover trigger="hover" placement="left">
              <el-table :data="props.row.itemList">
                <el-table-column
                  label="sku"
                  prop="sku"
                  width="170"
                >
                </el-table-column>
                <el-table-column
                  label="数量"
                  prop="returnQuantity"
                  width="80"
                >
                </el-table-column>
                <el-table-column
                  label="货物处理结果"
                  prop="returnResult"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  label="退货原因"
                  prop="returnReason"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  label="货物去向"
                  prop="returnGoodsStatus"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  label="退货情况"
                  prop="returnComment"
                  width="180"
                >
                </el-table-column>
              </el-table>
              <span slot="reference">
                <el-button type="text">
                  共{{props.row.itemList ? props.row.itemList.length : 0}}件
                </el-button>
              </span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ReturnOrder from './services';
import ShopSelect from '@/components/shop-select';

const returnOrder = new ReturnOrder();

export default {
  components: {
    'shop-select': ShopSelect
  },
  data() {
    return {
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        pageSize: 10,
        pageNumber: 1,
        shopId: '',
        sku: '',
        amaOrderId: '',
        exceptionReturnFlag: '',
      }
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        pageSize: 10,
        pageNumber: 1,
        shopId: '',
        sku: '',
        amaOrderId: '',
        exceptionReturnFlag: '',
      };
      this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      returnOrder.getList(this.searchData).then((res) => {
        const data = res.data.data.data || [];
        const totalRecord = res.data.data.totalRecord;

        this.data = data;
        this.totalRecord = totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="css">
</style>
