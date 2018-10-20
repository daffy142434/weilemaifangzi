<template lang="html">
  <el-dialog
    title="出库"
    :visible.sync="visible"
    width="90%"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      v-loading="loading"
      v-if="!isPreview"
    >
      <div class="inbound-goods-item" :key="`goods_${index}`" v-for="(goods, index) in form.goodsList">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label='本地SKU'
              :prop="`goodsList[${index}].sku`"
              :rules="{
                required: 'true',
                message: '请选择本地SKU',
              }"
            >
              <local-sku-select v-model="goods.sku">
              </local-sku-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="单个流转价格"
              :prop="`goodsList[${index}].shippingPrice`"
              :rules="{
                required: true,
                validator: (rules, value, cb) => {
                  if (!goods.shippingPrice) {
                    cb('请输入单个流转价格');
                  }
                  if (!goods.shippingPriceCurrency) {
                    cb('请选择单个流转价格币种');
                  }
                }
              }"
            >
              <el-input v-model="goods.shippingPrice" placeholder="单个流转价格">
                <template slot="append">
                  <currency-select v-model="goods.shippingPriceCurrency">
                  </currency-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="数量"
              :prop="`goodsList[${index}].quantity`"
              :rules="{
                required: true,
                message: '请输入数量',
              }"
            >
              <el-input-number v-model="goods.quantity" placeholder="数量" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="货品状态"
              :prop="`goodsList[${index}].goodsStatus`"
              :rules="{
                required: true,
                message: '请选择货品状态'
              }"
            >
              <el-select v-model="goods.goodsStatus">
                <el-option label="请选择" value=""></el-option>
                <el-option label="新品" :value="1"></el-option>
                <el-option label="类新品" :value="2"></el-option>
                <el-option label="二手" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单号" :prop="`goodsList[${index}].businessNo`">
              <el-input v-model="goods.businessNo" placeholder="单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="目的仓库"
              :prop="`goodsList[${index}].targetStorageId`"
              :rules="{
                required: true,
                message: '请选择出库仓库'
              }"
            >
              <el-button
                type="primary"
                size="small"
                @click="handleShowWarehouseSelect(index)"
              >
                {{goods.storageName || '选择仓库' }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="店铺"
              :prop="`goodsList[${index}].shopId`"
              :rules="{
                required:goods.shipmentId || goods.onlineSku?true:false,
                message: '请选择店铺'
              }"
            >
              <!-- <shop-select v-model="goods.shopId"></shop-select> -->
              <el-select v-model="goods.shopId" placeholder="请选择店铺">
                <el-option label="请选择" value=""></el-option>
                <el-option :label="item.shopName" :value="item.shopId" v-for="item in goods.shopList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="亚马逊货件编号"
              :prop="`goodsList[${index}].shipmentId`"
              :rules="{
                required:goods.shopId || goods.onlineSku?true:false,
                message: '请填写亚马逊货件编号'
              }"
            >
              <el-input v-model="goods.shipmentId" placeholder="亚马逊货件编号"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="在线SKU" 
            :prop="`goodsList[${index}].onlineSku`"
              :rules="{
                required:goods.shopId || goods.shipmentId?true:false,
                message: '请选择在线SKU'
              }"
            >
              <el-select v-model="goods.onlineSku" placeholder="请选择在线SKU">
                <el-option label="请选择" value=""></el-option>
                <el-option :label="item.sku" :value="item.sku" v-for="item in goods.onlineSkuList" :key="item.sku"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          
          <el-col :span="24">
            <el-form-item label="备注" :prop="`goodsList[${index}].remark`">
              <el-input v-model="goods.remark" type="textarea" :rows="4" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-button
        type="success"
        size="small"
        @click="add"
        style="margin-left:140px;"
      >添加商品</el-button>
    </el-form>
    <div v-if="isPreview">
      <el-table
        :data="form.goodsList"
        v-loading="loading"
        border
      >
        <el-table-column
          label="本地SKU"
          prop="sku"
        >
        </el-table-column>
        <el-table-column
          label="流转价格"
        >
          <template slot-scope="props">
            {{props.row.shippingPrice}}（{{props.row.shippingPriceCurrency}}）
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="quantity"
        >
        </el-table-column>
        <el-table-column
          label="货品状态"
        >
          <template slot-scope="props">
            {{GOODS_STATUS[props.row.goodsStatus]}}
          </template>
        </el-table-column>
        <el-table-column
          label="出库仓库"
          prop="storageName"
        >
        </el-table-column>
        <el-table-column
          label="单号"
          prop="businessNo"
        >
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          width="240"
        >
          <template slot-scope="props">
            <remark-column :text="props.row.remark">
            </remark-column>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" v-if="!isPreview">取 消</el-button>
      <el-button @click="isPreview = false;" v-if="isPreview">返回</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
    <warehouse-select-dialog
      ref="warehouseSelectDialog"
      @select="handleSelect"
    >
    </warehouse-select-dialog>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixin/dialog';
import loadingMixin from '@/mixin/loading';
import WarehouseSelectDialog from './warehouseSelectDialog';
import RemarkColumn from './remarkColumn';
import Warehouse from '../services';
import WAREHOUSE from '../const';
import LocalSkuSelect from '@/components/local-sku-select';
import ShopSelect from '@/components/shop-select';

const warehouse = new Warehouse();

const { GOODS_STATUS } = WAREHOUSE;

export default {
  mixins: [dialogMixin, loadingMixin],
  components: {
    WarehouseSelectDialog,
    RemarkColumn,
    'local-sku-select': LocalSkuSelect,
    'shop-select': ShopSelect
  },
  data() {
    return {
      GOODS_STATUS,
      visible: false,
      loading: false,
      isPreview: false,
      id: '',
      form: {
        goodsList: [
        ],
      },
      
    };
  },
  created() {
  },
  methods: {
    handleLocalSku(goods){
      goods.onlineSku="";
      let params={
        pageNumber: 1,
        pageSize: 10000,
        sku: goods.sku
      }
      warehouse.getOnlineSku(params).then(res=>{
        if(res.data.code===200){
          goods.onlineSkuList=res.data.data.data;
        }
      })
    },
    add() {
      this.form.goodsList.push({
        madeIn: '',
        productionTime: '',
        productionNo: '',
        manufacturer: '',
        barcodeType: '',
        barcode: '',
        sku: '',
        businessNo: '',
        quantity: '',
        costPrice: '',
        costPriceCurrency: 'CNY',
        shippingPrice: '',
        shippingPriceCurrency: 'CNY',
        goodsStatus: '',
        inventoryStatus: '',
        remark: '',
        storageName: '',
        shopId:"",
        shipmentId:"",
        onlineSku:"",
        onlineSkuList:[],
        shopList:[]
      });
    },
    afterShow(id) {
      this.id = id;
      setTimeout(() => {
        this.add();
      });
    },
    afterClose() {
      this.id = '';
      this.isPreview = false;
      this.form.goodsList = [];
    },
    handleShowWarehouseSelect(index) {
      this.currentIndex = index;
      this.$refs.warehouseSelectDialog.show();
    },
    handleSelect(data) {
      this.form.goodsList[this.currentIndex].targetStorageId = data.id;
      this.form.goodsList[this.currentIndex].storageName = data.storageName;
      this.form.goodsList[this.currentIndex].shopId='';
      this.getShopList(data.id);
      
    },
    getShopList(id){
      warehouse.getShopList(id).then(res=>{
        if(res.data.code==200){
          this.form.goodsList[this.currentIndex].shopList=res.data.data;
        }
      })
    },
    submit() {
      if (!this.isPreview) {
        let isPass = true;
        
        for(let i=0;i<this.form.goodsList.length;i++){
          if(!this.form.goodsList[i].sku){
            this.$message.error('请选择本地SKU');
            isPass=false;
            return;
          }
          if(!this.form.goodsList[i].shippingPrice){
            this.$message.error('请输入单个流转价格');
            isPass=false;
            return;
          }
          if(!this.form.goodsList[i].quantity){
            this.$message.error('请输入数量');
            isPass=false;
            return;
          }
          if(!this.form.goodsList[i].goodsStatus){
            this.$message.error('请选择货品状态');
            isPass=false;
            return;
          }
          if(!this.form.goodsList[i].targetStorageId){
            this.$message.error('请选择目的仓库');
            isPass=false;
            return;
          }
          if(this.form.goodsList[i].shopId&&!this.form.goodsList[i].shipmentId){
            this.$message.error('请填写亚马逊货件编号');
            isPass=false;
            return;
          }
          if(!this.form.goodsList[i].shopId&&this.form.goodsList[i].shipmentId){
            this.$message.error('请选择店铺');
            isPass=false;
            return;
          }
          // if(this.form.goodsList[i].shopId){
          //   if(!this.form.goodsList[i].shipmentId){
          //     this.$message.error('请填写亚马逊货件编号');
          //     isPass=false;
          //     return;
          //   }
          //   if(!this.form.goodsList[i].onlineSku){
          //     this.$message.error('请选择在线SKU');
          //     isPass=false;
          //     return;
          //   }
          // }
          // if(this.form.goodsList[i].shipmentId){
          //   if(!this.form.goodsList[i].shopId){
          //     this.$message.error('请选择店铺');
          //     isPass=false;
          //     return;
          //   }
          //   if(!this.form.goodsList[i].onlineSku){
          //     this.$message.error('请选择在线SKU');
          //     isPass=false;
          //     return;
          //   }
          // }
          // if(this.form.goodsList[i].onlineSku){
          //   if(!this.form.goodsList[i].shopId){
          //     this.$message.error('请选择店铺');
          //     isPass=false;
          //     return;
          //   }
          //   if(!this.form.goodsList[i].shipmentId){
          //     this.$message.error('请填写亚马逊货件编号');
          //     isPass=false;
          //     return;
          //   }
          // }
          
        }
        if (!isPass) {
          return;
        }
        this.isPreview = true;
        return;
      }

      const params = {};
      this.form.goodsList.forEach((goods, index) => {
        Object.keys(goods).forEach((key) => {
          if (key === 'storageName') {
            return;
          }
          if(key==='onlineSkuList'){
            return;
          }
          if(key==='shopList'){
            return;
          }
          params[`goodsList[${index}].${key}`] = goods[key];
        });
      });
      const p = warehouse.outbound(this.id, params);
      this.checkLoadingByPromise(p).then((res) => {
        this.$message({
          type: 'success',
          message: '出库成功'
        });
        this.close();
      });
    }
  }
}
</script>

<style lang="less">
.inbound-goods-item {
  padding-top: 20px;
  border-top: #efefef 1px solid;
  &:first-child {
    border: 0;
    padding-top: 0;
  }
}
</style>
