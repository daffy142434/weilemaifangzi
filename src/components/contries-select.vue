<template lang="html">
  <el-select :value="value" @input="handleInput">
    <el-option label="请选择" value=""></el-option>
    <el-option label="中国" value="cn"></el-option>
    <el-option label="美国" value="us"></el-option>
    <el-option label="加拿大" value="ca"></el-option>
    <el-option label="日本" value="jp"></el-option>
    <el-option label="英国" value="uk"></el-option>
    <el-option label="德国" value="de"></el-option>
    <el-option label="西班牙" value="es"></el-option>
    <el-option label="法国" value="fr"></el-option>
    <el-option label="意大利" value="it"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: [String]
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
