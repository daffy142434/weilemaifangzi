<template lang="html">
  <el-dialog
    ref="dialog"
    :title="title"
    :visible="visible"
  >
    <div class="tip">
      提示：您在添加关联SKU之后将会把系统中的SKU和销售平台的SKU相关联，从而在订单（使用平台SKU）扣减库存操作中可以准确扣减产品库存（使用系统的SKU）。
    </div>
    <el-form ref="skuForm" :rules="skuFormRules" :model="skuForm" label-width="80px">
      <el-form-item label="店铺" prop="shopId">
        <el-select v-model="skuForm.shopId" placeholder="请选择" style="width: 100%;" @change="handleChange">
          <el-option
            v-for="item in shops"
            :key="item.id"
            :label="item.shopName"
            :value="item.id">
          </el-option>          
        </el-select>        
      </el-form-item>
      <el-form-item label="关联SKU" prop="relationSku">
        <!-- <el-input v-model="skuForm.relationSku" style="width: 100%;"></el-input> -->
        <online-sku-autocomplete v-model="skuForm.relationSku" :shop-id="skuForm.shopId" @cleanVal="skuForm.relationSku=''"></online-sku-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关闭</el-button>
      <el-button type="primary" size="small" @click="dialogSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import OnlineSkuAutocomplete from '@/components/online-sku-autocomplete'
import ajax from 'lib/ajax';
export default {
  props: ['visible', 'data', 'shops'],
  mounted() {
    this.$refs.dialog.$el.querySelector('.el-icon-close').addEventListener('click', () => {
      this.handleClose();
    });
  },
  data() {
    return {
      title: "添加SKU关联信息",
      skuForm: {
        originSku: '',
        shopId: '',
        shopName: '',
        ecPlatformCode:'',
        relationSku: '',
      },
      skuFormRules: {
        shopId: [{
          type: 'number',
          required: true,
          message: '请选择店铺',
          trigger: 'change'
        }],
        relationSku: [{
          required: true,
          message: '请输入关联SKU',
          trigger: 'change'
        }],        
      },
    }
  },
  components: {
    OnlineSkuAutocomplete
  },
  methods: {
    handleChange(){
      this.skuForm.relationSku="";
    },
    handleClose() {
      this.$refs.skuForm.resetFields();
      this.$emit('close');
    },
    dialogSubmit() {
      let self = this;
      this.$refs.skuForm.validate((valid) => {
        if (valid) {     
          let shop = self.shops.filter((item) => item.id == self.skuForm.shopId)[0];
          self.skuForm.originSku = self.data.originSku;
          self.skuForm.ecPlatformCode = shop.shopPlatform;
          self.skuForm.shopName = shop.shopName; 
          let skuInfo = Object.assign({}, self.skuForm);

          let valid2 = true;
          for(let item of this.data.skuInfos) {            
            if(item.shopId == skuInfo.shopId
              && item.originSku == skuInfo.originSku
              && item.ecPlatformCode == skuInfo.ecPlatformCode
              && item.relationSku == skuInfo.relationSku) {
                valid2 = false;
                break;
            }
          }
          if(!valid2) {
            self.$message({
              showClose: true,
              message: '关联SKU信息重复，请修改后重新添加',
              type: 'warning'
            });
            return;
          }else {
            self.data.skuInfos.push(skuInfo);
            self.$emit('close');
          } 
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .tip {
    font-size: 14px;
    color: #FA5555;
    border: #D8DCE5 1px dashed;
    line-height: 26px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .el-autocomplete.inline-input{
    width: 100%;
  }
</style>
