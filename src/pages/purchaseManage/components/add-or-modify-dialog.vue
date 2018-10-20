<template lang="html">
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
        :model="form"
        label-width="110px"
        v-loading="loading"
      >
        <el-row>
          
          <el-col :span="8">
            <el-form-item 
              label="已结算金额" 
              prop="settledAmount"
              :rules="{
                required: true,
                validator: (rules, value, cb) => {
                  if (value==='') {
                    cb('请输入已结算金额');
                    return;
                  }
                  if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(form.settledAmount) && value != 0) {
                    cb('已结算金额只能为最多保留两位小数的数字');
                    return;
                  }
                  cb();
                }
              }"
            >
              <el-input v-model="form.settledAmount" placeholder="请输人民币"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="尾款金额" :prop="planSettleDate">
              <el-input v-model="form.planSettleDate" placeholder="尾款金额"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item 
              label="预计交货时间" 
              prop="planDeliveryDate"
            >
              <el-date-picker
                style="width: 100%;"
                v-model="form.planDeliveryDate"
                placeholder="预计交货时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计结算时间" prop="planSettleDate">
              <el-date-picker
                style="width: 100%;"
                v-model="form.planSettleDate"
                placeholder="预计结算时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="总采购价" :prop="planSettleDate">
              <el-input v-model="form.planSettleDate" placeholder="总采购价"></el-input>
            </el-form-item>
          </el-col> -->
          
          <el-col :span="8">
            <el-form-item 
              label="厂家名称" 
              prop="manufacturer"
              :rules="{
                required: true,
                message: '请输入厂家名称'
              }"
            >
              <el-input v-model="form.manufacturer" placeholder="厂家名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item 
              label="厂家联系人" 
              prop="manufacturerContactName"
              :rules="{
                required: true,
                message: '请输入厂家联系人'
              }"
            >
              <el-input v-model="form.manufacturerContactName" placeholder="厂家联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item 
              label="联系电话" 
              prop="manufacturerContactMobile"
              :rules="{
                required: true,
                message: '请输入联系电话'
              }"
            >
              <el-input v-model="form.manufacturerContactMobile" placeholder="联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产地" prop="madeIn">
              <el-input v-model="form.madeIn" placeholder="产地"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item 
              label="采购人" 
              prop="purchaserNo"
              :rules="{
                required: true,
                message: '请选择采购人'
              }"
            >
              <member-select v-model="form.purchaserNo" @afterInit="getMembers" style="width: 100%;"></member-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否含税" prop="taxFlag">
              <el-radio-group v-model="form.taxFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否拟报关退税" prop="taxRebateFlag">
              <el-radio-group v-model="form.taxRebateFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="3" :maxlength=500 v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="" :key="`sku_${index}`" v-for="(sku, index) in form.skuList">
          <el-row>
            <el-col :span="4">
              <el-form-item 
                label="本地SKU"
                :prop="`skuList[${index}].sku`"
                :rules="{
                  required: 'true',
                  message: '请选择本地SKU'
                }"
              >
                <!-- <local-sku-select v-model="sku.sku" :disabled="editable"></local-sku-select> -->
                <el-select v-model="sku.sku" @change="handleChange(sku)" placeholder="请选择本地SKU">
                  <el-option
                    v-for="(item, index) in skuListProduct"
                    :key="index"
                    :label="item.originSku"
                    :value="item.originSku">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="采购数量"
                :prop="`skuList[${index}].purchaseNum`"
                :rules="{
                  required: true,
                  message: '请输入采购数量',
                }"
              >
                <el-input-number v-model="sku.purchaseNum" style="width: 100%;" placeholder="采购数量" :disabled="form.status==21" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="采购单位" :prop="`skuList[${index}].purchaseNum`">
                <el-input v-model="sku.purchaseUnit" placeholder="采购单位" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="单个采购价格"
                :prop="`skuList[${index}].unitPrice`"
                label-width="120px"
                :rules="{
                  required: true,
                  validator: (rules, value, cb) => {
                    if (!sku.unitPrice) {
                      cb('请输入单个采购价格');
                      return;
                    }
                    if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(sku.unitPrice)) {
                      cb('采购价格只能为最多保留两位小数的数字');
                      return;
                    }
                    if (!sku.currency) {
                      cb('请选择单个采购价格币种');
                      return;
                    }
                    cb();
                  }
                }"
              >
                <el-input v-model="sku.unitPrice" placeholder="单个采购价格" class="unit-input" :disabled="editable">
                  <template slot="append">
                    <currency-select v-model="sku.currency" :disabled="true">
                    </currency-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label-width="10px">
                <el-checkbox v-model="sku.modifyPurchasePrice" true-label="1" false-label="0">以此价更新本地产品进价</el-checkbox>
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
        <div class="add-btn">
          <el-button type="success" size="small" @click="addSku" :disabled="form.id?true:false">新增SKU信息</el-button>
          <el-button 
            v-show="form.skuList.length > 1"
            type="danger"
            size="small"
            style="margin-left:20px;"
            disabled
            @click="deleteSku"
          >
            删除SKU信息
          </el-button>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import PurchaseManage from '../services';
import LocalSkuSelect from '@/components/product-sku-select';
import MemberSelect from '@/components/member-select';
import ajax from '@/lib/ajax';

const purchaseManage = new PurchaseManage();

export default {
  components: {
    'local-sku-select': LocalSkuSelect,
    'member-select': MemberSelect,
  },
  props: ['type'],
  data() {
    return {
      members: [],
      visible: false,
      loading: false,
      title: '新增采购订单',
      skuListProduct:[],
      form: {
        id: '',
        skuList: [],
        purchaserName: '',
        purchaserNo: '',
        settledAmount: '',
        planDeliveryDate: '',
        planSettleDate: '',
        taxFlag: 1,
        manufacturer: '',
        manufacturerContactName: '',
        manufacturerContactMobile: '',
        taxRebateFlag: 1,
        madeIn: '',
        remark: '',
        editable:true,
        status:'',
       
        
      },
    }
  },
  updated() {
  },
  methods: {
    getMembers(members) {
      this.members = members;
    },
    show(data) {
      this.visible = true;
      this.title = data.id ? '编辑采购订单':'新增采购订单';
      this.editable=data.id?true:false;
      if(!data.id) {
        setTimeout(() => {
          this.addSku();
        });
      }else {
        for(let key of Object.keys(this.form)) {
          if(key == 'planDeliveryDate' || key == 'planSettleDate') {
            this.form[key] = data[key]?moment(data[key]).format('YYYY-MM-DD') : '';
          }else {
            this.form[key] = data[key];
          }
        }
        this.form.skuList = JSON.parse(JSON.stringify(data.itemList));
      }
      this.getSkuList();
    },
    getSkuList(){
      purchaseManage.getSkuList().then((res) => {
        this.skuListProduct = res.data.data;
      });
    },
    handleChange(sku){
      this.skuListProduct.forEach(item=>{
        if(sku.sku==item.originSku){
          sku.unitPrice=item.purchasePrice;
          sku.productId=item.id;
        }
      })
    },
    close() {
      this.visible = false;
      this.loading = false;
      
      for(let key of Object.keys(this.form)) {
        if(key == 'taxFlag' || key == 'taxRebateFlag') {
          this.form[key] = 1;
        }else {
          this.form[key] = '';
        }
      }
      this.form.skuList = [];
    },
    addSku() {
      this.form.skuList.push({
        sku: '',
        purchaseNum: '',
        unitPrice: '',
        currency: 'CNY',
        purchaseNum: '',
        purchaseUnit: '件',
        saledNum: '',
        modifyPurchasePrice:'',
        productId:''
      });
    },
    deleteSku() {
      this.form.skuList.splice(this.form.skuList.length-1, 1);
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let params = {
          id: '',
          purchaserNo: '',
          purchaserName: '',
          settledAmount: '',
          planDeliveryDate: '',
          planSettleDate: '',
          taxFlag: '',
          manufacturer: '',
          manufacturerContactName: '',
          manufacturerContactMobile: '',
          taxRebateFlag: '',
          madeIn: '',
          remark: ''
        };
        Object.assign(params, this.form);
        this.form.skuList.forEach((sku, index) => {
          Object.keys(sku).forEach((key) => {
            params[`itemList[${index}].${key}`] = sku[key];
          });
        });
        let member = this.members.filter((item) => {
          return item.userNo == params.purchaserNo;
        })[0];
        if(member) {
          params.purchaserName = `${member.loginName}(${member.name})`;
        }
        
        this.loading = true;
        if(this.form.id) {
          let param=Object.assign({}, this.form, params);
          delete param.skuList;
          purchaseManage.modifyPurchase(param).then((res) => {
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
        }else {
          purchaseManage.addPurchase(Object.assign({}, this.form, params)).then((res) => {
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
        }
      });
    }
  }
}
</script>

<style lang="less">
.add-btn {
  margin-top: 10px;
  text-align: center;
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
<style scoped>
.el-input-group.unit-input{
  width: 90%;
}
</style>
