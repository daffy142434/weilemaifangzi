<template lang="html">
  <div>
    <el-dialog
      :title="title"
      ref="dialog"
      width="95%"
      :visible.sync="visible"
      @close="close"
    >
      <div>
        <el-form
          ref="form"
          label-width="110px"
        >
          <el-row>
            
            <el-col :span="6">
              <el-form-item 
                label="已结算金额"
              >
                <el-input disabled v-model="form.settledAmount" placeholder="已结算金额"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="尾款金额" :prop="planSettleDate">
                <el-input v-model="form.planSettleDate" placeholder="尾款金额"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item 
                label="预计交货时间" 
              >
                <el-input disabled v-model="form.planDeliveryDate" placeholder="已结算金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预计结算时间">
                <el-input disabled v-model="form.planSettleDate" placeholder="已结算金额"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="总采购价" :prop="planSettleDate">
                <el-input v-model="form.planSettleDate" placeholder="总采购价"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="是否含税">
                <el-input disabled v-model="yesOrNoMap[form.taxFlag]"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item 
                label="厂家名称" 
              >
                <el-input disabled v-model="form.manufacturer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item 
                label="厂家联系人" 
              >
                <el-input disabled v-model="form.manufacturerContactName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item 
                label="联系电话"
              >
                <el-input disabled v-model="form.manufacturerContactMobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否拟报关退税">
                <el-input disabled v-model="yesOrNoMap[form.taxRebateFlag]"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产地">
                <el-input disabled v-model="form.madeIn"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="采购人"
              >
                <el-input disabled v-model="form.purchaserName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input resize="none" disabled type="textarea" :rows="3" :maxlength=500 v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="" :key="`sku_${index}`" v-for="(sku, index) in form.skuList">
            <el-row>
              <el-col :span="6">
                <el-form-item 
                  label="本地SKU"
                >
                  <el-input disabled v-model="sku.sku"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="采购数量"
                >
                  <el-input disabled v-model="sku.purchaseNum + ' ' + sku.purchaseUnit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="入库数量"
                > <div class="btn-container">
                    <el-button type="text" @click="showInboundRecords(form.id, sku.id, sku.sku)">{{sku.deliveredNum}} {{sku.purchaseUnit}}</el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="采购价格"
                >
                  <el-input disabled v-model="sku.unitPrice + ' ' + sku.currency"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                purchaseUnit
                <el-form-item label="已交货数量" :prop="`form.skuList[${index}].sku`">
                  <el-input v-model="form.madeIn" placeholder="产地"></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </el-dialog>
    <inbound-records-dialog ref="inboundRecordsDialog">
    </inbound-records-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import PurchaseManage from '../services';
import InboundRecordsDialog from './inbound-records-dialog';

const purchaseManage = new PurchaseManage();
const yesOrNoMap = {
  "1": "是",
  "0": "否",
};
export default {
  components: {
    'inbound-records-dialog': InboundRecordsDialog,
  },
  props: ['type'],
  data() {
    return {
      yesOrNoMap: yesOrNoMap,
      visible: false,
      loading: false,
      title: '新增采购订单',
      form: {
        id: '',
        skuList: [],
        purchaserNo: '',
        purchaserName: '',
        settledAmount: '',
        planDeliveryDate: '',
        planSettleDate: '',
        taxFlag: 1,
        manufacturer: '',
        manufacturerContactName: '',
        manufacturerContactMobile: '',
        taxRebateFlag: 1,
        madeIn: '',
        remark: ''
      },
    }
  },
  updated() {
  },
  methods: {
    showInboundRecords(orderId, skuId, sku) {
      this.$refs.inboundRecordsDialog.show({
        orderId,
        skuId,
        sku,
      });
    },
    show(data) {
      this.visible = true;
      this.title = '采购单详情';
      for(let key of Object.keys(this.form)) {
        if(key == 'planDeliveryDate' || key == 'planSettleDate') {
          this.form[key] = (moment(data[key]).format('YYYY-MM-DD') || '');
        }else {
          this.form[key] = data[key];
        }
      }
      this.form.skuList = [...data.itemList];
    },
    close() {
      this.visible = false;
      this.loading = false;
      this.form.skuList = [];
      for(let key of Object.keys(this.form)) {
        if(key == 'taxFlag' || key == 'taxRebateFlag') {
          this.form[key] = 1;
        }else {
          this.form[key] = '';
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.add-btn {
  margin-top: 10px;
  text-align: center;
}
.btn-container {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
}
.el-input.is-disabled .el-input__inner, .el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
  // cursor: not-allowed; 
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
}
.outlier-operation-list-form {
  .dialog-list {
    min-width: 700px;
    max-width: 100%;
  }
  .outlier-remark {
    max-height: 48px;
    overflow: hidden;
  }
}
</style>
