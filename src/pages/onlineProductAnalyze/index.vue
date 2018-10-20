<template lang="html">
  <div>
    <div class="page-title">
      在线商品性能
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="ASIN">
          <el-input v-model="searchData.asin" placeholder="请输入ASIN"></el-input>
        </el-form-item>
        <div class="tag-area">
          <el-form-item style="width:100%;">
            <el-tag
              :class="{ 'active-shop': shop.isActive }"
              style="margin-right: 10px;"
              v-for="shop in shops"
              :key="shop.id"
              checkable
              >
              <a @click="clickShop(shop)">{{shop.shopName}}</a>
            </el-tag>
          </el-form-item>
        </div>
        
        
        <!--<el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="请输入SKU"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="searchData.status">
            <el-radio :label="1">在售</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>-->
         
        
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div  v-if="$store.state.powers.includes('product_analyze_data:list')">
      <el-table
        v-loading.body="tableLoading"
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="asin"
          label="图片/ASIN"
          class-name="sku-column"
          fixed="left"
          align="center"
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
              <el-button type="text" @click="goProductUrl(scope.row.productUrl)">
                {{scope.row.asin}}
              </el-button>
            </div>
            <div>
              <el-tag class="tag-fill" v-if="scope.row.status=='1'" type="success">在售</el-tag>
              <el-tag class="tag-fill" v-if="scope.row.status=='2'" type="danger">下架</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="reportDate"
          min-width="170"
          :formatter="formatReportDate"
          label="数据日期 / 更新时间">
        </el-table-column>
        <el-table-column
          prop="buyerViewNum"
          width="120"
          label="30天UV">
        </el-table-column>
        <el-table-column
          prop="purchaseNum"
          width="120"
          label="30天销量">
        </el-table-column>
        <el-table-column
          prop="conversionRate"
          :formatter="formatPercente"
          width="110"
          label="30天转化率">
        </el-table-column>
        <el-table-column
          prop="returnRate"
          :formatter="formatPercente"
          width="110"
          label="60天退货率">
        </el-table-column>
        <el-table-column
          prop="customerServiceRate"
          :formatter="formatPercente"
          width="110"
          label="60天客服率">
        </el-table-column>
        <!--<el-table-column
          prop="salePrice"
          width="110"
          label="当前折后价">
        </el-table-column>
        <el-table-column
          prop="stock"
          width="120"
          label="可售库存">
        </el-table-column>
        <el-table-column
          prop="saleableDays"
          width="80"
          label="可售天数">
        </el-table-column>-->
        <el-table-column
          prop="reviewScore"
          width="80"
          label="星级">
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
  import moment from 'moment';
  import ajax from '@/lib/ajax';
  import format from '@/lib/format';
  import Service from './services';
  import Shop from '@/pages/shops/services';
  const shop = new Shop();
  const service = new Service();

  export default {
    components: {

    },
    data() {
      return {
        shops: [],
        shopBarWidth: 600,
        searchData: {
          shopId: '',
          asin: '',
          sku: '',
          status: "",
          pageSize: 10,
          pageNumber: 1,
        },
        tableData: [],
        totalRecord: 0,
        tableLoading: false,
      }
    },
    computed: {

    },
    beforeCreate(){
    },
    created() {
      shop.getAllShops().then((res) => {
        this.shops = res.data.data;
        for(let shop of this.shops) {
          this.$set(shop, 'isActive', false);
        }
      });
    },
    mounted() {
      this.shopBarWidth = this.$el.querySelector('.el-form').offsetWidth;
    },
    methods: {
      goProductUrl(productUrl) {
        productUrl && window.open(productUrl);
      },
      clickShop(data) {
        this.searchData.shopId = '';
        for(let shop of this.shops) {
          if(shop.id == data.id) {
            shop.isActive = !shop.isActive;
          }else {
            shop.isActive = false;
          }
          if(shop.isActive) {
            this.searchData.shopId = shop.id;
          }
        }
        if(this.searchData.shopId) {
          this.onSearch();
        }

      },
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.beforeSearch();
      },
      handleCurrentChange(val) {
        this.searchData.pageNumber = val;
        this.onSearch({pageNumber: val});
      },
      formatReportDate(row, col, value) {
        let reportDate = row.reportDate;
        let modifyTime = row.modifyTime;
        let reportDateStr = reportDate ? moment(reportDate).format('YYYY-MM-DD HH:mm:ss') : '';
        let modifyTimeStr = modifyTime ? moment(modifyTime).format('YYYY-MM-DD HH:mm:ss') : '';

        return (reportDateStr ? reportDateStr.split(' ')[0] : '') + ' / ' + (modifyTimeStr ? modifyTimeStr.split(' ')[1] : '');
      },
      formatPercente(row, col, value) {
        return value ? ((value * 100).toFixed(2) + ' %') : '';
      },
      handleReset() {
        this.searchData = {
          shopId: '',
          asin: '',
          sku: '',
          status: 1,
          pageNumber: 1,
          pageSize: 10
        };
      },
      beforeSearch(){
        this.searchData.pageNumber=1;
        this.onSearch();
      },
      onSearch() {
        if(!this.searchData.shopId && !this.searchData.asin && !this.searchData.sku) {
          this.$message({
            showClose: true,
            message: 'ASSIN、SKU、店铺至少请选择一个条件',
            type: 'warning'
          });
          return;
        }
        this.tableLoading = true;
        service.getOnlineProductPerformance(this.searchData)
          .then((response) => {
            const tableData = response.data.data.data || [];
            this.tableData = tableData.map((d) => {
              d.emailTime = format.toDateTime(d.emailTime);
              return d;
            });
            this.totalRecord = response.data.data.totalRecord;
            this.tableLoading = false;
          })
          .catch(() => {
            this.tableLoading = false;
          });
      },
    },
  }
</script>

<style lang="less" scoped>
  .active-shop {
    background: #409EFF;
    color: #fff;
  }
  .big-pic {
    max-width: 650px;max-height: 650px;
  }
  .small-pic {
    margin-top:7px;cursor:pointer;width: 50px;height: 50px;
  }
  .cq-exec {
    .el-button {
      margin: 0 6px;
    }
  }
  .multi-row-search .el-form-item{
    height:initial;
  }
</style>
