<template lang="html">
  <span>
    <el-popover
      ref="popover-form"
      placement="right"
      title="标记红单"
      width="300"
      v-model="visible"
      trigger="click">
      <el-form ref="form" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="当地币种" prop="clickFarmingCurrency"><currency-select v-model="form.clickFarmingCurrency" :disabled="true"></currency-select></el-form-item>
        <el-form-item label="红单成本" prop="clickFarmingAmount">
          <el-input v-model="form.clickFarmingAmount" disabled></el-input>
        </el-form-item>
        <div class="oprea">
          <el-button size="small" type="default" v-loading="loading" @click="farmingNew(0)">取消标记</el-button>
          <el-button size="small" type="primary" v-loading="loading" @click="farmingNew(1)">标记红单</el-button>
        </div>
      </el-form>
    </el-popover>
    <el-button type="text" size="small" v-popover:popover-form>标记红单</el-button>
  </span>
</template>

<script>
import CurrencySelect from '@/components/currency-select';
import AmaOrder from '../services';

const amaOrder = new AmaOrder();

export default {
  props: ['order'],
  components: {
    'currency-select': CurrencySelect,
  },
  data() {
    // let clickFarmingAmount;

    // if (this.order.clickFarmingAmount !== 0 && !this.order.clickFarmingAmount) {
    //   clickFarmingAmount = order.orderAmount;
    // } else {
    //   clickFarmingAmount = this.order.clickFarmingAmount;
    // }

    const {clickFarmingCurrency,clickFarmingAmount} = this.order;
    return {
      loading: false,
      visibleFlag: false,
      form: {
        clickFarmingAmount:clickFarmingAmount,
        clickFarmingCurrency: clickFarmingCurrency
      },
      rules: {
        clickFarmingAmount: {required: true, message: '请输入成本'},
        clickFarmingCurrency: {required: true, message: '币种不能为空'},
      }
    }
  },
  computed: {
    visible: {
      set(v) {
        // if (v && !this.order.clickFarmingFlag) {
        //   this.form.clickFarmingAmount = this.order.orderAmount;
        // } else {
        //   this.form.clickFarmingAmount = this.order.clickFarmingAmount;
        // }
        this.visibleFlag = v;
      },
      get(v) {
        return this.visibleFlag;
      }
    }
  },
  mounted(){
  },
  methods: {
    farmingNew(status){
      amaOrder.farmingNew(this.order.id,{status:status}).then(res=>{
        this.$message({
          message: res.data.msg,
          type: 'success'
        });
        this.visible = false;
      })
    },
    doClickFarming() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        const { clickFarmingAmount, clickFarmingCurrency } = this.form;
        amaOrder.setClickFarmingFlag(this.order.id, clickFarmingAmount, clickFarmingCurrency)
          .then((res) => {
            this.$emit('onClickFraming');
            this.visible = false;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          })
      });
    }
  }
}
</script>

<style lang="less" scoped>
.oprea{
  padding-left: 105px;
}
</style>
