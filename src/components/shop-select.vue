<template lang="html">
  <el-select :value="value" @input="handleInput">
    <el-option label="请选择" value=""></el-option>
    <el-option v-for="item in list" :label="item.shopName" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>

<script>
import Shop from '@/pages/shops/services';

const shop = new Shop();
let p = shop.getAllShops();
let start = Date.now();

export default {
  props: ['value'],
  data() {
    return {
      list: []
    }
  },
  mounted() {
    if (Date.now() - start > 3000) {
      p = shop.getAllShops();
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
