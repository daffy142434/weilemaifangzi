<template lang="html">
  <div>
    <div class="page-title">
      仓库中商品实例 <el-button type="text" @click="back">返回仓库列表</el-button>
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="SKU">
              <el-input v-model="searchData.sku" placeholder="请输入SKU"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点状态">
              <el-select v-model="searchData.inventoryStatus">
                <el-option label="请选择" value=""></el-option>
                <el-option label="可售" :value="1"></el-option>
                <el-option label="在途锁定" :value="2"></el-option>
                <el-option label="差项核销" :value="3"></el-option>
                <el-option label="销售核销" :value="4"></el-option>
                <el-option label="销毁核销" :value="5"></el-option>
                <el-option label="客户损毁" :value="6"></el-option>
                <el-option label="操作失误核销" :value="7"></el-option>
                <el-option label="销售锁定" :value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态">
              <el-select v-model="searchData.goodsStatus">
                <el-option label="请选择" value=""></el-option>
                <el-option label="新品" :value="1"></el-option>
                <el-option label="类新品" :value="2"></el-option>
                <el-option label="二手" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作编号">
              <el-input v-model="searchData.operateNo" placeholder="请输入操作编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单号">
              <el-input v-model="paramData.businessNo.value" :disabled="!paramData.businessNo.checked" placeholder="请输入单号"></el-input>
              <el-checkbox v-model="paramData.businessNo.checked" @change="cleanVal('businessNo')">使用本筛选项</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产批次">
              <el-input v-model="paramData.productionNo.value" :disabled="!paramData.productionNo.checked" placeholder="请输入生产批次"></el-input>
              <el-checkbox v-model="paramData.productionNo.checked" @change="cleanVal('productionNo')">使用本筛选项</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="last-row">
          <el-col :span="12">
            <el-form-item
              label='上次操作时间'
            >
              <el-date-picker
                v-model="dateTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDaterangeChange"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实时成本">
              <el-input v-model="paramData.currentCostAmount.value" :disabled="!paramData.currentCostAmount.checked" placeholder="请输入实时成本">
                <template slot="append">
                  <currency-select v-model="CNY" :disabled="true">
                  </currency-select>
                </template>
              </el-input>
              <el-checkbox v-model="paramData.currentCostAmount.checked" @change="cleanVal('currentCostAmount')">使用本筛选项</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="SKU"
        prop="sku"
        width="160"
      >
      </el-table-column>
      <el-table-column
        label="实时毛利（CNY）"
        prop="currentMaoriAmount"
        width="140"
      >
      </el-table-column>
      <el-table-column
        label="实时成本（CNY）"
        prop="currentCostAmount"
        width="140"
      >
      </el-table-column>
      <el-table-column
        label="实时收入额（CNY）"
        prop="currentIncomeAmount"
        width="160"
      >
      </el-table-column>
      <!-- <el-table-column
        label="盘点状态"
      >
        <template slot-scope="props">
          {{INVENTORY_TYPE[props.row.inventoryType]}}
        </template>
      </el-table-column> -->
      <el-table-column
        label="货品状态"
      >
        <template slot-scope="props">
          {{GOODS_STATUS[props.row.goodsStatus]}}
        </template>
      </el-table-column>
      <el-table-column
        label="生产批次"
        width="240"
        prop="productionNo"
      >
        <template  slot-scope="props">
          <div>
            {{props.row.productionNo}}
          </div>
          <el-tag v-if="props.row.inventoryStatus" size="small" :color="INVENTORY_COLOR_TYPE[props.row.inventoryStatus]" style="color: #fff;">{{INVENTORY_TYPE[props.row.inventoryStatus]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="生产时间"
        width="100"
      >
        <template slot-scope="props">
          <span v-date="props.row.productionTime"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="产地"
        prop="madeIn"
      >
      </el-table-column>
      <el-table-column
        label="厂家"
        prop="manufacturer"
      >
      </el-table-column>
      <el-table-column
        label="条码类型"
        prop="barcodeType"
      >
      </el-table-column>
      <el-table-column
        label="条码编号"
        prop="barcode"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="180"
      >
        <template slot-scope="props">
          <el-button
            type="text"
            @click="handleShowBillDialog(props.row)"
            v-if="permissions('local_storage:goods_bill_list')"
          >收支记录</el-button>
          /
          <el-button
            type="text"
            @click="handleShowInventoryDialog(props.row)"
            v-if="permissions('local_storage:goods_inventory_list')"
          >流转记录</el-button>
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
    <bill-dialog
      ref="billDialog"
    >
    </bill-dialog>
    <inventory-dialog
      ref="inventoryDialog"
    >
    </inventory-dialog>
  </div>
</template>

<script>
import Warehouse from './services';
import BillDialog from './components/billDialog';
import InventoryDialog from './components/inventoryDialog';

const warehouse = new Warehouse();

const INVENTORY_TYPE = {
  '1': '可售',
  '2': '在途锁定',
  '3': '差项核销',
  '4': '销售核销',
  '5': '销毁核销',
  '6': '客户损毁',
  '7': '操作失误核销',
  '8': '销售锁定'
};

const INVENTORY_COLOR_TYPE = {
  '1': '#67C23A',
  '2': '#909399',
  '3': '#E6A23C',
  '4': '#E6A23C',
  '5': '#E6A23C',
  '6': '#F56C6C',
  '7': '#E6A23C',
  '8': '#E09EFF'
};

const GOODS_STATUS = {
  '1': '新品',
  '2': '类新品',
  '3': '二手',
};

export default {
  components: {
    BillDialog,
    InventoryDialog,
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.onSearch();
  },
  data() {
    return {
      INVENTORY_TYPE,
      INVENTORY_COLOR_TYPE,
      GOODS_STATUS,
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        pageNumber: 1,
        pageSize: 10,
        sku: '',
        inventoryStatus: '',
        goodsStatus: '',
        operateNo:"",
        lastOperateDateStart:"",
        lastOperateDateEnd:""
      },
      paramData:{
        businessNo:{
          value:"",
          key:"queryNullBusinessNo",
          checked:false
        },
        productionNo:{
          value:"",
          key:"queryNullProductionNo",
          checked:false
        },
        currentCostAmount:{
          value:"",
          key:"queryNullCurrentIncomeAmount",
          checked:false
        },
      },
      dateTime:"",
      CNY:"CNY"
    }
  },
  methods: {
    handleSizeChange (v) {
      this.searchData.pageSize = v;
      this.beforeSearch(); 
    },
    handleCurrentChange (v) {
      this.searchData.pageNumber = v;
      this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      for(let item in this.paramData){
        if(this.paramData[item].checked){
          this.searchData[item]=this.paramData[item].value;
          if(this.paramData[item].value){
            this.searchData[this.paramData[item].key]=0;
          }else{
            this.searchData[this.paramData[item].key]=1;
          }
          
        }else{
          this.searchData[this.paramData[item].key]="";
        }
      }
      this.loading = true;
      warehouse.getGoodsList(this.id, this.searchData).then((res) => {
        this.loading = false;
        this.data = res.data.data.data;
        this.totalRecord = res.data.data.totalRecord;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleReset() {
      this.searchData.sku = '';
      this.searchData.inventoryStatus = '';
      this.searchData.goodsStatus = '';
    },
    back() {
      this.$router.push({
        name: 'warehouse',
      });
    },
    handleShowBillDialog(data) {
      this.$refs.billDialog.show(data);
    },
    handleShowInventoryDialog(data) {
      this.$refs.inventoryDialog.show(data);
    },
    handleDaterangeChange(val){
      if(val){
        this.searchData.lastOperateDateStart=val[0];
        this.searchData.lastOperateDateEnd=val[1];
      }else{
        this.searchData.lastOperateDateStart="";
        this.searchData.lastOperateDateEnd="";
      }
    },
    cleanVal(val){
      if(!this.paramData[val].checked){
        this.paramData[val].value="";
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .el-row {
    margin: 10px 0;
  }
  .last-row .el-input{
    width: 70%;
  }
  .search-bar .el-form{
    min-width: 1250px;
    overflow: auto;
  }
</style>
