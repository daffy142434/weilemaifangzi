<template lang="html">
  <el-dialog
    title="入库"
    :visible.sync="visible"
    width="90%"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      v-loading="loading"
      v-if="!isPreview"
    >
      <div class="inbound-goods-item" :key="`goods_${index}`" v-for="(goods, index) in form.goodsList">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产地" :prop="`goodsList[${index}].madeIn`">
              <el-input v-model="goods.madeIn" placeholder="产地"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产时间" :prop="`goodsList[${index}].productionTime`">
              <el-date-picker
                v-model="goods.productionTime"
                placeholder="生产时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产批次" :prop="`goodsList[${index}].productionNo`">
              <el-input v-model="goods.productionNo" placeholder="生产批次"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂家" :prop="`goodsList[${index}].manufacturer`">
              <el-input v-model="goods.manufacturer" placeholder="厂家"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="条码"
              :prop="`goodsList[${index}].barcode`"
              :rules="{
                required: true,
                validator: (rule, value, cb) => {
                  if (!goods.barcode) {
                    cb('请输入条码');
                    return;
                  }
                  if (!goods.barcodeType) {
                    cb('请输选择码类型');
                    return;
                  }
                  cb();
                }
              }"
            >
              <el-input v-model="goods.barcode" placeholder="条码">
                <template slot="append">
                  <el-select v-model="goods.barcodeType">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="UPC" value="UPC"></el-option>
                    <el-option label="EAU" value="EAU"></el-option>
                    <el-option label="GDID" value="GDID"></el-option>
                    <el-option label="中国条码" value="中国条码"></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label='本地SKU'
              :prop="`goodsList[${index}].sku`"
              :rules="{
                required: 'true',
                message: '请选择本地SKU'
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
                    return;
                  }
                  if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(goods.shippingPrice)) {
                    cb('单个流转价格只能为最多保留两位小数的数字');
                    return;
                  }
                  if (!goods.shippingPriceCurrency) {
                    cb('请选择单个流转价格币种');
                    return;
                  }
                  cb();
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
              <el-input-number v-model="goods.quantity" placeholder="数量"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="单个成本价"
              :prop="`goodsList[${index}].costPrice`"
              :rules="{
                required: true,
                validator: (rules, value, cb) => {
                  if (!goods.costPrice) {
                    cb('请输入单个成本价');
                    return;
                  }
                  if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(goods.costPrice)) {
                    cb('单个成本价只能为最多保留两位小数的数字');
                    return;
                  }
                  if (!goods.costPriceCurrency) {
                    cb('请选择单个成本价币种');
                    return;
                  }
                  cb();
                }
              }"
            >
              <el-input v-model="goods.costPrice" placeholder="单个成本价">
                <template slot="append">
                  <currency-select v-model="goods.costPriceCurrency">
                  </currency-select>
                </template>
              </el-input>
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
            <el-form-item
              label="盘点状态"
              :prop="`goodsList[${index}].inventoryStatus`"
              :rules="{
                required: true,
                message: '请选择盘点状态'
              }"
            >
              <el-select v-model="goods.inventoryStatus" disabled>
                <el-option label="可售" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单号" :prop="`goodsList[${index}].businessNo`">
              <el-input v-model="goods.businessNo" placeholder="单号"></el-input>
            </el-form-item>
          </el-col>
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
        style="margin-left:120px;"
      >添加商品</el-button>
      <el-button
        v-show="form.goodsList.length > 1"
        type="danger"
        size="small"
        @click="deleteGoods"
        style="margin-left:20px;"
      >删除商品</el-button>
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
          width="160"
        >
        </el-table-column>
        <el-table-column
          label="条码"
          width="200"
        >
          <template slot-scope="props">
            {{props.row.barcode}}（{{props.row.barcodeType}}）
          </template>
        </el-table-column>
        <el-table-column
          label="单个流转价格"
          width="160"
        >
          <template slot-scope="props">
            {{props.row.shippingPrice}}（{{props.row.shippingPriceCurrency}}）
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="quantity"
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="单个成本价"
          width="160"
        >
          <template slot-scope="props">
            {{props.row.costPrice}}（{{props.row.costPriceCurrency}}）
          </template>
        </el-table-column>
        <el-table-column
          label="货品状态"
          width="80"
        >
          <template slot-scope="props">
            {{GOODS_STATUS[props.row.goodsStatus]}}
          </template>
        </el-table-column>
        <el-table-column
          label="盘点状态"
          width="80"
        >
          <template slot-scope="props">
            {{INVENTORY_STATUS[props.row.inventoryStatus]}}
          </template>
        </el-table-column>
        <el-table-column
          label="单号"
          prop="businessNo"
          width="160"
        >
        </el-table-column>
        <el-table-column
          label="产地"
          prop="madeIn"
          width="60"
        >
        </el-table-column>
        <el-table-column
          label="生产时间"
          width="120"
        >
          <template slot-scope="props">
            <span v-date="props.row.productionTime"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="生产批次"
          prop="productionNo"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="厂家"
          prop="manufacturer"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="备注"
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
  </el-dialog>
</template>

<script>
import RemarkColumn from './remarkColumn';
import Warehouse from '../services';
import WAREHOUSE from '../const';
import LocalSkuSelect from '@/components/local-sku-select';

const warehouse = new Warehouse();
const { GOODS_STATUS, INVENTORY_STATUS } = WAREHOUSE;

export default {
  components: {
    RemarkColumn,
    'local-sku-select': LocalSkuSelect,
  },
  data() {
    return {
      GOODS_STATUS,
      INVENTORY_STATUS,
      visible: false,
      loading: false,
      isPreview: false,
      id: '',
      form: {
        goodsList: [
        ],
      }
    };
  },
  created() {
  },
  methods: {
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
        inventoryStatus: 1,
        remark: '',
      });
    },
    deleteGoods() {
      this.form.goodsList.splice(this.form.goodsList.length-1, 1);
    },
    show(id) {
      this.visible = true;
      this.id = id;
      setTimeout(() => {
        this.add();
      });
    },
    close() {
      this.visible = false;
      this.id = '';
      this.form.goodsList = [];
    },
    submit() {
      if (!this.isPreview) {
        let isPass = true;
        this.$refs.form.validate((error) => {
          isPass = error;
        });
        if (!isPass) {
          return;
        }
        this.isPreview = true;
        return;
      }

      const params = {};
      this.form.goodsList.forEach((goods, index) => {
        Object.keys(goods).forEach((key) => {
          params[`goodsList[${index}].${key}`] = goods[key];
        });
      });
      this.loading = true;
      warehouse.inbound(this.id, params).then((res) => {
        this.loading = false;
        this.$message({
          type: 'success',
          message: '入库成功'
        });
        this.close();
      }).catch(() => {
        this.loading = false;
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
