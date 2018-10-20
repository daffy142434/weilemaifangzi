<template lang="html">
  <el-dialog
    title="入库"
    :visible.sync="visible"
    width="90%"
    @close="close"
  >
    <el-form
      ref="storageForm"
      :model="form"
      label-width="110px"
      v-loading="loading"
    >
      <el-form-item 
        label="仓库"
        label-width="80px"
        prop="storageId"
        :rules="{
          required: 'true',
          message: '请选择仓库'
        }"
      >
        <el-select v-model="form.storageId" style="width: 100%;" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in storages"
            :label="item.storageName"
            :key="item.id"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-table 
        ref="infoTable"
        :data="form.itemList"
        border 
        highlight-current-row
        class="table"
      >
        <el-table-column property="sku" width="250" label="本地SKU" fixed="left"></el-table-column>
         <el-table-column width="130" property="purchaseNum" label="采购数量">
          <template slot-scope="scope">
            {{scope.row.purchaseNum}} {{scope.row.purchaseUnit || ''}}
          </template>
        </el-table-column>
        <el-table-column width="130" property="waitDeliveryNum" label="待交货数量">
          <template slot-scope="scope">
            {{scope.row.waitDeliveryNum}} {{scope.row.purchaseUnit || ''}}
          </template>
        </el-table-column>
        <el-table-column width="230" label="入库数量">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
            >
              <el-input-number v-model="scope.row.quantity" @change="" :min="0" :max="scope.row.waitDeliveryNum" label="请输入入库数量"></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="300" property="waitDeliveryNum" label="单个流转成本">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              :prop="`itemList[${scope.$index}].shippingPrice`"
              :rules="{
                required: true,
                validator: (rules, value, cb) => {
                  if(scope.row.quantity!=0){
                    if (scope.row.shippingPrice==='') {
                      cb('请输入单个流转成本');
                      return;
                    }
                    if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(scope.row.shippingPrice)) {
                      cb('单个流转成本只能为最多保留两位小数的数字');
                      return;
                    }
                    if (!scope.row.shippingPriceCurrency) {
                      cb('请选择单个流转成本币种');
                      return;
                    }
                  }
                  
                  cb();
                }
              }"
            >
              <el-input v-model="scope.row.shippingPrice" placeholder="单个流转成本">
                <template slot="append">
                  <currency-select :disabled="true" v-model="scope.row.shippingPriceCurrency">
                  </currency-select>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="120" property="waitDeliveryNum" label="货品状态">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              :prop="`itemList[${scope.$index}].goodsStatus`"
              :rules="{
                required: true,
                message: '请选择货品状态',
              }"
            >
              <el-select v-model="scope.row.goodsStatus" clearable>
                <el-option label="新品" :value="1"></el-option>
                <el-option label="类新品" :value="2"></el-option>
                <el-option label="二手" :value="3"></el-option>
              </el-select>  
            </el-form-item>        
          </template>
        </el-table-column>
        <el-table-column width="400" property="remark" label="入库备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" style="width: 100%;" placeholder="请输入入库备注"></el-input>
          </template>
        </el-table-column>
        <el-table-column width="130" property="deliveredNum" label="已入库数量">
          <template slot-scope="scope">
            {{scope.row.deliveredNum}} {{scope.row.purchaseUnit || ''}}
          </template>
        </el-table-column>
        <el-table-column width="130" label="单个采购成本">
          <template slot-scope="scope">
            {{scope.row.unitPrice}} {{currencyMap[scope.row.currency] || ''}}
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PurchaseManage from '../services';
import Warehouse from '@/pages/warehouse/services';
import StorageSelect from '@/components/storage-select';

const warehouse = new Warehouse();
const purchaseManage = new PurchaseManage();
export default {
  components: {
    'storage-select': StorageSelect,
  },
  data() {
    return {
      visible: false,
      loading: false,
      currencyMap: {
        'USD': '美元',
        'GBP': '英镑',
        'EUR': '欧元',
        'JPY': '日元',
        'CAD': '加币',
        'CNY': '人民币',
      },
      storages: [],
      item: {
        quantity: 0,
        shippingPrice: 0,
        shippingPriceCurrency: 'CNY',
        goodsStatus: 1,
        remark: '',
      },
      // item: {
      //   sku: '',
      //   quantity: 0,
      //   costPrice: 0,
      //   costPriceCurrency: '',
      //   shippingPrice: 0,
      //   shippingPriceCurrency: '',
      //   goodsStatus: 1,
      //   remark: '',
      // },
      form: {
        id: '',
        storageId: '',
        itemList: [

        ],
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      
      warehouse.search().then((res) => {
        this.storages = res.data.data;
      });
    },
    show(data) {
      this.form.storageId="";
      this.visible = true;
      this.form.id = data.id;
      for(let item of data.itemList) {
        let tmp = Object.assign({}, this.item, item);
        this.form.itemList.push(tmp);
      }
    },
    close() {
      this.visible = false;
      this.loading = false;
      this.id = '';
      this.storageId = '';
      this.form.itemList = [];
    },
    submit() {      
      this.$refs.storageForm.validate((valid) => {
        if (!valid) {
          return;
        }
        const params = {
          id: this.form.id,
          storageId: this.form.storageId,
        };
        let flag=true;//入库数量都为空
        this.form.itemList.forEach((item, index) => {
          Object.keys(item).forEach((key) => {
            if(key == 'unitPrice') {
              params[`itemList[${index}].costPrice`] = item['unitPrice'];
            }else if(key == 'currency') {
              params[`itemList[${index}].costPriceCurrency`] = item['currency'];
            }else {
              params[`itemList[${index}].${key}`] = item[key];
            }
            if(item.quantity!=0) flag=false;
          });
        });
        if(flag){
          this.$message({
            type: 'error',
            message:"入库数量不能都为空"
          });
          return;
        }
        this.loading=true;
        purchaseManage.inboudPurchase(params).then((res) => {
          this.visible = false;
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.$emit('addOrModifySuccess');
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.inbound-goods-item {
  padding-top: 20px;
  border-top: #efefef 1px solid;
  &:first-child {
    border: 0;
    padding-top: 0;
  }
}
.el-form-item{
  margin-bottom: 0;
}
.table{
  margin-top:22px;
}
</style>
