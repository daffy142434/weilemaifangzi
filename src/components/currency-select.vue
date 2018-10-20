<template lang="html">
  <el-select :value="value" @input="handleInput" :disabled="disabled">
    <el-option label="请选择" value=""></el-option>
    <el-option label="USD" value="USD"></el-option>
    <el-option label="EUR" value="EUR"></el-option>
    <el-option label="GBP" value="GBP"></el-option>
    <el-option label="CAD" value="CAD"></el-option>
    <el-option label="JPY" value="JPY"></el-option>
    <el-option label="CNY" value="CNY"></el-option>
    <el-option label="HKD" value="HKD"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: [String],
    disabled:[Boolean]
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
