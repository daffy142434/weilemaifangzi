<template lang="html">
  <el-select :value="value" @input="handleInput" :multiple="multiple" :disabled="disabled" filterable clearable placeholder="请选择本地SKU" @change="$emit('change')">
    <el-option
      v-for="(sku, index) in list"
      :key="index"
      :label="sku"
      :value="sku">
    </el-option>
  </el-select>
</template>

<script>
import Warehouse from '@/pages/warehouse/services';

const warehouse = new Warehouse();
let p = warehouse.getLocalSkus();
let start = Date.now();

export default {
  props: {
    value: [String, Array],
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    if (Date.now() - start > 3000) {
      p = warehouse.getLocalSkus();
      start = Date.now();
    }
    p.then((res) => {
      this.list = res.data.data;
    });
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    }
  }
}
</script>

<style lang="css">
</style>
