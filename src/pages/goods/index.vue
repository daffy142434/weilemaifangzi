<template lang="html">
  <div class="goods-index">
    <div class="page-title">
      产品维护
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="类目" style="width: 300px;">
          <el-cascader
            v-model="categoryCodes"
            :props="props"
            :options="categoryOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="产品名">
          <el-input placeholder="产品名" v-model="searchData.name" @keyup.enter.native="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input placeholder="SKU" v-model="searchData.sku" @keyup.enter.native="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="关联SKU">
          <el-input placeholder="关联SKU" v-model="searchData.relationSku" @keyup.enter.native="onSearch"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchData.skuStatus" placeholder="请选择">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="(name, code) in statusMap"
              :key="code"
              :label="name"
              :value="code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发人">
          <el-select v-model="searchData.developer" placeholder="请选择" style="width: 90%;">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="item in developers"
              :key="item.userNo"
              :label="item.loginName+'( '+item.name+' )'"
              :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="识别码" >
          <el-input placeholder="识别码" v-model="searchData.identificationCode"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar" v-if="$store.state.powers.includes('product:add')">
      <el-button v-if="$store.state.powers.includes('product:add')" type="success" icon="el-icon-plus" size="small" @click="handleAddProduct">添加产品</el-button>
      <el-button type="text" @click="handleExport(0)">导出</el-button>
      <el-button type="text" @click="handleExport(1)">导出关联关系及速算验证</el-button>
    </div>
    <div v-if="$store.state.powers.includes('product:list')">
      <el-table
        v-loading.body="tableLoading"
        :data="tableData"
        ref="singleTable"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="originSku"
          label="SKU"
          width="180"
          class-name="sku-column"
        >
          <template slot-scope="scope">
            <el-popover
              ref="popover1"
              placement="right-start"
              title=""
              width="650"
              border
              trigger="click">
              <img :src="scope.row.mainImg" class="big-pic"></img>
            </el-popover>
            <img :src="scope.row.mainImg" v-popover:popover1></img>
            <div class="sku-column-text">{{scope.row.originSku}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="identificationCode"
          label="识别码"
          width="80">
        </el-table-column>
        <el-table-column
          prop="developer"
          label="开发人"
          :formatter="developerFormatter">
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="purchasePrice"
          label="采购价CNY"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="brand"
          label="品牌"
          width="150">
        </el-table-column>
        <el-table-column
          label="在库数"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleSkuNo(scope.row.originSku)">{{scope.row.storageNum}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="待交货数/合计待交货总成本"
          width="150">
          <template slot-scope="scope">
            <div>{{scope.row.waitDeliveryNum}}</div>
            <div>{{scope.row.waitDeliveryAmount}}</div>
          </template>
          
        </el-table-column>
        <el-table-column
          prop="skuStatus"
          :formatter="skuStatusFormatter"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.skuStatus==1">{{skuStatusFormatter(scope.row.skuStatus)}}</el-tag>
            <el-tag size="small" v-if="scope.row.skuStatus==0" type="danger">{{skuStatusFormatter(scope.row.skuStatus)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="完成状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <div :class="{'complete':true,'green':scope.row.completeFlag==1,'red':scope.row.completeFlag==0}"></div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="left"
          align="center"
          width="150">
          <template slot-scope="scope">
            <el-button v-if="$store.state.powers.includes('product:modify')" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="$store.state.powers.includes('member:main_add')" type="text" size="small" @click="handleClone(scope.$index, scope.row)">克隆</el-button>
            <div><el-tag size="small" @click.native="showProducts(scope.row.originSku)">已关联 <span class="tag-num">{{scope.row.onlineProductNum || 0}}</span> 个商品</el-tag></div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100]"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="在库数"
      :visible.sync="skuNoVisible"
      width="60%"
      @close=""
    >
        <el-table
          :data="skuTableData"
          border
          style="width: 100%">
          <el-table-column
            prop="storageName"
            label="仓库名称">
          </el-table-column>
          <el-table-column
            prop="saleAvailableQuantityAll"
            label="合计在库数">
          </el-table-column>
          <el-table-column
            prop="currentCostAmount"
            label="合计在库总成本">
          </el-table-column>
          <el-table-column
            prop="saleAvailableQuantity"
            label="合计可售数">
          </el-table-column>
          <el-table-column
            prop="saleAvailableAmount"
            label="合计可售数总成本">
          </el-table-column>
          <el-table-column
            prop="wayQuantity"
            label="合计在途数">
          </el-table-column>
          <el-table-column
            prop="wayAmount"
            label="合计在途总成本">
          </el-table-column>
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChangeSku"
            @current-change="handleCurrentChangeSku"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.skuParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.skuTotalRecord">
          </el-pagination>
        </div>
    </el-dialog>
    <el-dialog
      title="已关联商品"
      :visible.sync="productsVisible"
      width="60%"
      @close=""
    >
        <el-table
          :data="productTableData"
          border
          style="width: 100%">
          <el-table-column
            label="SKU">
            <template slot-scope="scope">
              <el-button type="text" @click.native="gotoOnlineGoods(scope.row)">{{scope.row.sku}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopName"
            label="店铺名">
          </el-table-column>
          <el-table-column
            prop="salePrice"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="stationCode"
            :formatter="getCountry"
            label="国家">
          </el-table-column>
          <el-table-column
            prop="status"
            :formatter="getStatus"
            label="状态">
          </el-table-column>
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            @size-change="handleSizeChangeProducts"
            @current-change="handleCurrentChangeProducts"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="this.producParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.producTotalRecord">
          </el-pagination>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import getCountryNameByStationCode from '@/lib/getCountryNameByStationCode';
import status from '@/lib/const';
import ajax from '../../lib/ajax';
import queryString from 'query-string';
export default {
  data() {
    return {
      visible: false,
      skuNoVisible:false,
      productsVisible:false,
      categoryCodes: [],
      statusMap: {
        "0": "已删除",
        "1": "正常",
      },
      completeFlagMap: {
        "0": "未完成",
        "1": "已完成",
      },
      categoryOptions:[],
      props: {
        "value": "categoryCode",
        "label": "originCategoryName",
        "children": "childCategories",
      },
      developers: [],
      totalRecord: 0,
      pageSize: 50,
      tableLoading: false,
      searchData: {
        categoryCode: '',
        name: '',
        sku: '',
        relationSku: '',
        developer: '',
        skuStatus: '1',
        identificationCode:""
      },
      tableData: [],
      skuTableData:[],
      pageNumber:1,
      skuParams:{
        pageNumber:1,
        pageSize:10,
        sku:""
      },
      skuTotalRecord:0,
      productTableData:[],
      producParams:{
        sku:"",
        pageNumber:1,
        pageSize:10
      },
      producTotalRecord:0,
      originSku:""
    }
  },
  beforeCreate() {
    // 查询所有会员
    ajax.post('/members/list_all')
    .then((response) => {
      if(response.data.code == 200) {
        this.developers = response.data.data || [];
      }
    });
    // 查询类目
    ajax.post('/products/self_category')
    .then((response) => {
      if(response.data.code == 200) {
        const data = response.data.data || [];
        data.unshift({label: '全部', value: ''});
        this.categoryOptions = data;
      }
    });
  },
  created() {
    this.onSearch();
  },
  methods: {
    gotoOnlineGoods(row){
      this.productsVisible=false;
      let query={
        shopName:row.shopName,
        stationCode:row.stationCode,
        pmUserName:row.pmUserName,
        pmDepartmentName:row.pmDepartmentName || "暂无人",
        shopId:row.shopId
      }
      this.$router.push({name:'onlineGoodsList',query,params:{backHref: location.href,sku:row.sku}});
    },
    showProducts(sku){
      this.productsVisible=true;
      this.producParams.sku=sku || this.producParams.sku;
      ajax.post('/products/sku_relation_product',this.producParams)
      .then((res) => {
        if(res.data.code == 200) {
          this.productTableData=res.data.data.data || [];
          this.producTotalRecord=res.data.data.totalRecord;
        }
      });
    },
    getCountry(row, column, cellValue){
      return getCountryNameByStationCode(cellValue);
    },
    getStatus(row, column, cellValue){
      let statusMap={
        "1": "在售",
        "2": "下架",
        "3": "已删除",
      }
      return statusMap[cellValue] || "";
    },
    handleSkuNo(originSku){
      this.skuNoVisible=true;
      this.originSku=originSku;
      this.skuParams.sku=originSku;
      ajax.post('/storages/sku_storage_info',this.skuParams)
      .then((response) => {
        if(response.data.code == 200) {
          this.skuTableData = response.data.data.data || [];
          this.skuTotalRecord=response.data.data.totalRecord;
        }
      });
    },
    handleSizeChangeSku(val) {
      this.skuParams.pageSize = val;
      this.handleSkuNo(this.originSku);
    },
    handleCurrentChangeSku(val) {
      this.skuParams.pageNumber=val;
      this.handleSkuNo(this.originSku);
    },
    handleSizeChangeProducts(val) {
      this.producParams.pageSize = val;
      this.showProducts();
    },
    handleCurrentChangeProducts(val) {
      this.producParams.pageNumber=val;
      this.showProducts();
    },
    categoryChange(val) {
      this.searchData.categoryCode = val.pop();
    },
    developerFormatter(row, column, cellValue) {
      let developer = this.developers.filter((item) => item.userNo == cellValue)[0];
      if(!developer) {
        return "";
      }else {
        return developer['loginName']+'( '+developer['name']+' )';
      }
    },
    skuStatusFormatter(cellValue) {
      return this.statusMap[cellValue] || '';
    },
    completeFlagFormatter(row, column, cellValue) {
      return this.completeFlagMap[cellValue] || '';
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val});
    },
    handleReset() {
      this.searchData = {
        categoryCode: '',
        name: '',
        sku: '',
        relationSku: '',
        developer: '',
        skuStatus: '',
      };
      this.onSearch();
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      this.searchData.categoryCode = this.categoryCodes.pop();
      ajax.post('/products/list', Object.assign({pageNumber, pageSize}, this.searchData))
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = response.data.data.data || [];
          this.totalRecord = response.data.data.totalRecord;
          if(pageNumber==1) this.pageNumber=1;
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },
    handleAddProduct() {
      this.$router.push({name: 'goodsAdd', params: {action: 'add', backHref: location.href}});
    },
    handleExport(val) {
      let baseurl=val?'/products/export_relation?':"/products/export?";
      let url = baseurl+ queryString.stringify(this.searchData);
      window.open(url);
    },
    handleEdit(index, row) {
      this.$router.push({name: 'goodsEdit', params: {action: 'edit', skuId: row.id, backHref: location.href }});
    },
    handleClone(index, row) {
      this.$router.push({name: 'goodsClone', params: {action: 'clone', skuId: row.id, backHref: location.href }});
    },
  },
}
</script>

<style lang="less">
  .big-pic {
    max-width: 650px;max-height: 650px;
  }
  .small-pic {
    margin-top:7px;cursor:pointer;width: 50px;height: 50px;
  }
  .goods-index .el-tag{
    cursor: pointer;
  }
@import './style.less';
</style>
<style lang="less" scoped>
.tag-num{
  color:#333;
}
.complete{
  margin:0 auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  &.green{
    background: #67C23A;
  }
  &.red{
    background:#e63c3f;
  }
}
</style>