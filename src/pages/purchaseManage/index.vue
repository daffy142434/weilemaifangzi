<template lang="html">
  <div class="purchase-manage-index">
    <div class="page-title">
      采购管理
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="本地SKU">
          <local-sku-select v-model="searchData.sku"></local-sku-select>
        </el-form-item>
        <el-form-item label="采购时间" style="width: 460px;">
          <el-date-picker
            v-model="purchaseDateRange"
            type="daterange"
            placeholder="选择日期范围"
            @change="handlePurchaseDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否结清">
          <el-select clearable v-model="searchData.settleFlag">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计结款时间" style="width: 460px;">
          <el-date-picker
            v-model="planSettleDateRange"
            type="daterange"
            placeholder="选择日期范围"
            @change="handlePlanSettleDateRange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否出货完毕">
          <el-select clearable v-model="searchData.finishFlag">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家">
          <el-input v-model="searchData.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="查询空生产厂家">
          <el-radio-group v-model="searchData.queryNullManufacturer">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预计交货时间" style="width: 460px;">
          <el-date-picker
            v-model="planDeliveryDateRange"
            type="daterange"
            placeholder="选择日期范围"
            @change="handlePlanDeliveryDateChange"
          >
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button type="success" v-if="permissions('purchase_manage:add')" icon="el-icon-plus" size="small" @click="addOrModify()">新增采购订单</el-button>
    </div>
    <div v-if="permissions('purchase_manage:list')">
      <div class="tabe-title"><span class="white">白色底为未入库</span> <span class="yellow">黄色底为部分入库</span> <span class="grey">灰色底为全部入库</span></div>
      <el-table
        v-loading.body="tableLoading"
        ref="infoTable"
        :data="tableData"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">详情</el-button>
            <el-button type="text" size="small" v-if="permissions('purchase_manage:modify')" @click="addOrModify(scope.row)">编辑</el-button>
            <el-button type="text" size="small" v-if="permissions('purchase_manage:inbound')" @click="putInStorage(scope.row)">入库</el-button>
            <el-button type="text" size="small" v-if="permissions('purchase_manage:delete')" @click="deleteOrder(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="采购商品"
          min-width="100"
        >
          <template slot-scope="scope">
            <div>
              <el-popover
                v-for="item in scope.row.itemList"
                :key="item.id"
                ref="`popover_${index}`"
                placement="top"
                title=""
                width="850"
                border
                trigger="hover">
                <el-table :data="[item]">
                  <el-table-column property="sku" width="250" label="本地SKU"></el-table-column>
                  <el-table-column width="150" label="单个采购成本">
                    <template slot-scope="scope">
                      {{item.unitPrice}} {{currencyMap[item.currency] || ''}}
                    </template>
                  </el-table-column>
                  <el-table-column width="150" property="purchaseNum" label="采购数量">
                    <template slot-scope="scope">
                      {{item.purchaseNum}} {{item.purchaseUnit || ''}}
                    </template>
                  </el-table-column>
                  <el-table-column width="150" property="deliveredNum" label="已入库数量">
                    <template slot-scope="scope">
                      {{item.deliveredNum}} {{item.purchaseUnit || ''}}
                    </template>
                  </el-table-column>
                  <el-table-column width="150" property="waitDeliveryNum" label="待交货数量">
                    <template slot-scope="scope">
                      {{item.waitDeliveryNum}} {{item.purchaseUnit || ''}}
                    </template>
                  </el-table-column>
                </el-table>
                <img slot="reference" style="display: inline-block;margin-right: 5px;height: 37px;width: 37px;cursor: pointer;" :src="item.mainImg"/>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="采购信息"
          min-width="300"
        >
          <template slot-scope="scope">
            <div>
              采购单编号：{{scope.row.orderNo}}
            </div>
            <div>
              采购人：{{scope.row.purchaserName}}
            </div>
            <div>
              采购时间：{{scope.row.purchaseDate ? moment(scope.row.purchaseDate).format('YYYY-MM-DD') : ''}}
              <!-- {{scope.row.purchaseDate ? moment(scope.row.purchaseDate).format('YYYY-MM-DD HH:mm:ss') : ''}} -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="采购单金额"
          prop="totalAmount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="已结清金额"
          prop="settledAmount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="未结清金额"
          prop="restAmount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="已入库货值"
          prop="deliveredAmount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="未入库货值"
          prop="waitDeliveryAmount"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="时间信息"
          min-width="250"
        >
          <template slot-scope="scope">
            <div>
              预计结款时间：{{scope.row.planSettleDate ? moment(scope.row.planSettleDate).format('YYYY-MM-DD') : ''}}
            </div>
            <div>
              预计交货时间：{{scope.row.planDeliveryDate ? moment(scope.row.planDeliveryDate).format('YYYY-MM-DD') : ''}}
            </div>
            <div>
              交货完毕时间：{{scope.row.deliveryDate ? moment(scope.row.deliveryDate).format('YYYY-MM-DD') : ''}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[ 50, 100]"
        :page-size="this.searchData.pageSize"
        :current-page.sync="searchData.pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.totalRecord">
      </el-pagination>
    </div>
    <add-or-modify-dialog
      ref="addOrModifyDialog"
      @addOrModifySuccess="onSearch()"
    >
    </add-or-modify-dialog>
    <detail-dialog
      ref="detailDialog"
    >
    </detail-dialog>
    <put-in-storage-dialog
      ref="putInStorageDialog"
      @addOrModifySuccess="onSearch()"
    ></put-in-storage-dialog>
  </div>
</template>
<script>
  import moment from 'moment';
  import format from '@/lib/format';
  import PurchaseManage from './services';
  import LocalSkuSelect from '@/components/local-sku-select';
  import AddOrModifyDialog from './components/add-or-modify-dialog';
  import DetailDialog from './components/detail-dialog';
  import PutInStorageDialog from './components/put-in-storage-dialog';

  const purchaseManage = new PurchaseManage();

  export default {
    components: {
      'local-sku-select': LocalSkuSelect,
      'add-or-modify-dialog': AddOrModifyDialog,
      'detail-dialog': DetailDialog,
      'put-in-storage-dialog': PutInStorageDialog,
    },
    data() {
      let searchData = this.$router.currentRoute.params || {};
      let activeName;

      switch(true) {
        case this.$store.state.powers.includes('online_product_outlier:manage_wait_process'):
          activeName = 'chartInfo';
          break;
        case this.$store.state.powers.includes('online_product_outlier:manage_processed'):
          activeName = 'tableInfo';
          break;
        default:
          activeName = '';
      }

      return {
        currencyMap: {
          'USD': '美元',
          'GBP': '英镑',
          'EUR': '欧元',
          'JPY': '日元',
          'CAD': '加币',
          'CNY': '人民币',
        },
        moment: moment,
        purchaseDateRange: '',
        planDeliveryDateRange: '',
        planSettleDateRange: '',
        tableLoading: false,
        tableData: [],
        format: format,
        activeName,
        shops: [],
        searchData: {
          sku: '',
          settleFlag: '',
          finishFlag: '',
          manufacturer: '',
          queryNullManufacturer: '',
          purchaseDateStart: '',
          purchaseDateEnd: '',
          planDeliveryDateStart: '',
          planDeliveryDateEnd: '',
          planSettleDateStart: '',
          planSettleDateEnd: '',
          pageSize: 50,
          pageNumber: 1,
          ...searchData
        },
        totalRecord: 0,
      }
    },
    computed: {
    },
    beforeCreate(){

    },
    created() {
      this.onSearch();
    },
    methods: {
      handleReset(){
        this.searchData= {
          sku: '',
          settleFlag: '',
          finishFlag: '',
          manufacturer: '',
          queryNullManufacturer: '',
          purchaseDateStart: '',
          purchaseDateEnd: '',
          planDeliveryDateStart: '',
          planDeliveryDateEnd: '',
          planSettleDateStart: '',
          planSettleDateEnd: '',
          pageSize: 10,
          pageNumber: 1
        };
        this.purchaseDateRange="";
        this.planDeliveryDateRange='';
        this.planSettleDateRange='';
      },
      tableRowClassName({row, rowIndex}) {
        if (row.status === 20) {//部分入库
          return 'warning-row';
        } else if (row.status === 21) {//全部入库
          return 'success-row';
        }
        return '';
      },
      handlePurchaseDateChange(values) {
        if (!values) {
          this.searchData.purchaseDateStart = '';
          this.searchData.purchaseDateEnd = '';
          return;
        }
        const [purchaseDateStart, purchaseDateEnd] = values;
        this.searchData.purchaseDateStart = format.toDate(purchaseDateStart);
        this.searchData.purchaseDateEnd = format.toDate(purchaseDateEnd);
      },
      handlePlanDeliveryDateChange(values) {
        if (!values) {
          this.searchData.planDeliveryDateStart = '';
          this.searchData.planDeliveryDateEnd = '';
          return;
        }
        const [planDeliveryDateStart, planDeliveryDateEnd] = values;
        this.searchData.planDeliveryDateStart = format.toDate(planDeliveryDateStart);
        this.searchData.planDeliveryDateEnd = format.toDate(planDeliveryDateEnd);
      },
      handlePlanSettleDateRange(values) {
        if (!values) {
          this.searchData.planSettleDateStart = '';
          this.searchData.planSettleDateEnd = '';
          return;
        }
        const [planSettleDateStart, planSettleDateEnd] = values;
        this.searchData.planSettleDateStart = format.toDate(planSettleDateStart);
        this.searchData.planSettleDateEnd = format.toDate(planSettleDateEnd);
      },
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.beforeSearch();
      },
      handleCurrentChange(val) {
        this.searchData.pageNumber = val;
        this.onSearch();
      },
      beforeSearch(){
        this.searchData.pageNumber=1;
        this.onSearch();
      },
      onSearch() {
        this.tableLoading = true;
        purchaseManage.getPurchaseList(this.searchData).then((res) => {
          const data = res.data.data.data || [];
          const totalRecord = res.data.data.totalRecord;

          this.tableData = data;
          this.totalRecord = totalRecord;
          this.tableLoading = false;
        }).catch(() => {
          this.tableLoading = false;
        });
      },
      showDetail(rowData={}) {
        this.$refs.detailDialog.show(rowData);
      },
      addOrModify(rowData={}) {
        this.$refs.addOrModifyDialog.show(rowData);
      },
      putInStorage(rowData={}) {
        this.$refs.putInStorageDialog.show(rowData);
      },
      deleteOrder(index, row) {
        let self = this;
        let confirmMsg = '确认删除该采购订单？';
        this.$confirm(confirmMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          purchaseManage.deletePurchase(row).then((res) => {
            self.$message({
              type: 'success',
              message: res.data.msg
            });
            self.onSearch();
          });
        });
      }
    }
  }
</script>

<style lang="less" scoped>

.tabe-title{
  margin-bottom: 10px;
  font-size: 14px;
  color:#555;
  span{
    padding: 4px 15px;
    border:1px solid #eee;
    &.white{
      background: #fff;
    }
    &.yellow{
      background: #ecce96;
    }
    &.grey{
      background:#d6d5d5; 
    }
  }

}
</style>
<style lang="less">
.purchase-manage-index{
  .el-table .warning-row{
    background: #ecce96;
  }
  .el-table .success-row{
    background: #d6d5d5;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: initial;
  }
}

</style>
