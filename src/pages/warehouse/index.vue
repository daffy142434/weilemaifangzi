<template lang="html">
  <div>
    <div class="page-title">
      中央仓库管理
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="仓库名称">
          <el-input v-model="searchData.storageName" placeholder="请输入仓库名称"></el-input>
        </el-form-item>
        <el-form-item label="国家">
          <contries-select v-model="searchData.countryCode"></contries-select>
        </el-form-item>
        <el-form-item label="仓库状态">
          <el-select v-model="searchData.status">
            <el-option value="">请选择</el-option>
            <el-option :value="0" label="停用"></el-option>
            <el-option :value="1" label="启用"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="small"
        @click="handleShowStorageManagerDialog"
        v-if="permissions('local_storage:add')"
      >添加仓库</el-button>
    </div>
    <div v-if="permissions('local_storage:list')">
      <el-table
        v-loading="loading"
        :data="data"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="仓库名称"
        >
          <template slot-scope="props">
            <div>
            <el-button
              type="text"
              @click="handleGoWarehouseProductList(props.row)"
              v-if="permissions('local_storage:goods_list')"
            >{{props.row.storageName}}</el-button>
            <span
              v-if="!permissions('local_storage:goods_list')"
            >
              {{props.row.storageName}}
            </span>
            </div>
            <div>
              <el-tag size="small" v-if="props.row.status==1">{{STATUS[props.row.status]}}</el-tag>
              <el-tag size="small" v-else type="info">{{STATUS[props.row.status]}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="仓库编号"
          prop="storageNo"
        >
        </el-table-column>
        <el-table-column
          label="仓库地址"
        >
          <template slot-scope="props">
            <div>
              <div><national-flag :stationCode="props.row.countryCode" :key="props.row.id"></national-flag></div>
              <div>{{props.row.storageAddress}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="已绑定的店铺"
          min-width='100'
        >
          <template slot-scope="props">
            <div>
              <div v-if="permissions('local_storage:relate_shop')"><el-button type="text" @click="handleShowShops(props.row)">绑定店铺</el-button></div>
              <div><el-tag size="small" class="item-tag" v-for="item in props.row.storageShops">{{item.shopName}}</el-tag></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="建库时间"
          width="110"
        >
          <template slot-scope="props">
            <span v-date="props.row.storageCreateDate"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="仓库所在国"
          prop="countryName"
          width="100"
        >
        </el-table-column> -->
        <el-table-column
          label="仓库类型"
          width="100"
        >
          <template slot-scope="props">
            {{STORAGE_TYPE[props.row.storageType]}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="仓库状态"
          prop="status"
          width="100"
          align="center"
        >
          <template slot-scope="props">
            
            <el-tag size="small" v-if="props.row.status==1">{{STATUS[props.row.status]}}</el-tag>
            <el-tag size="small" v-else type="info">{{STATUS[props.row.status]}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
        >
          <template slot-scope="props">
            <!-- <el-dropdown @command="command => handleCommand(command, props.row)">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="handleEditWarehouse"
                  v-if="permissions('local_storage:modify')"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  command="handleShowShops"
                  v-if="permissions('local_storage:relate_shop')"
                >绑定店铺</el-dropdown-item>
                <el-dropdown-item
                  command="handleReceive"
                  v-if="permissions('local_storage:goods_list_wait_receive')"
                >接收货物</el-dropdown-item>
                <el-dropdown-item
                  command="handleOutbound"
                  v-if="permissions('local_storage:goods_outbound')"
                >出库</el-dropdown-item>
                <el-dropdown-item
                  command="handleInbound"
                  v-if="permissions('local_storage:goods_inbound')"
                >入库</el-dropdown-item>
                <el-dropdown-item
                  command="handleVerification"
                >核销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-button type="text" @click="handleEditWarehouse(props.row)" v-if="permissions('local_storage:modify')">编辑</el-button>
            <el-button type="text" @click="handleReceive(props.row)" v-if="permissions('local_storage:goods_list_wait_receive')">接收货物</el-button>
            <el-button type="text" @click="handleOutbound(props.row)" v-if="permissions('local_storage:goods_outbound')">出库</el-button>
            <el-button type="text" @click="handleInbound(props.row)" v-if="permissions('local_storage:goods_inbound')">入库</el-button>
            <el-button type="text" @click="handleVerification(props.row)" v-if="permissions('local_storage:goods_cancellation')">核销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <warehouse-manager-dialog
      ref="warehouseManagerDialog"
      @success="onSearch"
    >
    </warehouse-manager-dialog>
    <warehouse-shop-dialog
      ref="warehouseShopDialog"
    >
    </warehouse-shop-dialog>
    <inbound-dialog
      ref="inboundDialog"
    >
    </inbound-dialog>
    <outbound-dialog
      ref="outboundDialog"
    >
    </outbound-dialog>
    <receive-list-dialog
      ref="receiveListDialog"
    >
    </receive-list-dialog>
    <verification-dialog ref="verificationDialog"></verification-dialog>
  </div>
</template>

<script>
import loadingMixin from '@/mixin/loading';
import WarehouseManagerDialog from './components/warehouseManagerDialog';
import WarehouseShopDialog from './components/warehouseShopDialog';
import InboundDialog from './components/inboundDialog';
import OutboundDialog from './components/outboundDialog';
import ReceiveListDialog from './components/receiveListDialog';
import VerificationDialog from './components/verificationDialog';
import Warehouse from './services';
import WAREHOUSE from './const';
import NationalFlag from '@/components/national-flag';

const warehouse = new Warehouse();

const { STORAGE_TYPE, STATUS } = WAREHOUSE;

export default {
  mixins: [loadingMixin],
  components: {
    WarehouseManagerDialog,
    WarehouseShopDialog,
    InboundDialog,
    OutboundDialog,
    ReceiveListDialog,
    VerificationDialog,
    NationalFlag
  },
  mounted() {
    this.onSearch();
  },
  data() {
    return {
      STORAGE_TYPE,
      STATUS,
      loading: false,
      totalRecord: 0,
      data: [],
      searchData: {
        pageNumber: 1,
        pageSize: 50,
        storageName: '',
        countryCode: '',
        status: 1,
      },
    };
  },
  methods: {
    handleSizeChange(v) {
      this.searchData.pageSize = v;
      this.beforeSearch();
    },
    handleCurrentChange(v) {
      this.searchData.pageNumber = v;
      this.onSearch();
    },
    handleShowStorageManagerDialog() {
      this.$refs.warehouseManagerDialog.show();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      const p = warehouse.getList(this.searchData);
      this.checkLoadingByPromise(p).then((res) => {
        this.data = res.data.data.data;
        this.totalRecord = res.data.data.totalRecord;
      });
    },
    handleReset() {
      this.searchData.storageName = '';
      this.searchData.countryCode = '';
      this.searchData.status = '';
    },
    handleGoWarehouseProductList(data) {
      this.$router.push({
        name: 'warehouseGoodsList',
        params: {
          id: data.id,
        },
      });
    },
    handleCommand(methodName, data) {
      this[methodName](data);
    },
    handleEditWarehouse(data) {
      this.$refs.warehouseManagerDialog.show('edit', data);
    },
    handleShowShops(data) {
      this.$refs.warehouseShopDialog.show(data.id, data);
    },
    handleReceive(data) {
      this.$refs.receiveListDialog.show(data);
    },
    handleInbound(data) {
      this.$refs.inboundDialog.show(data.id);
    },
    handleVerification(data){
      this.$refs.verificationDialog.show(data.id);
    },
    handleOutbound(data) {
      this.$refs.outboundDialog.show(data.id);
    },
  },
};
</script>

<style lang="less">
</style>
<style scoped>
.item-tag{
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
