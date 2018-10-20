<template lang="html">
  <el-select :value="value" @input="handleInput" filterable clearable placeholder="请选择">
    <el-option
      v-for="item in list"
      :label="item.storageName"
      :key="item.id"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import StorageAnalyze from '@/pages/storageAnalyze/services';

const storageAnalyze = new StorageAnalyze();
let p = storageAnalyze.getAllStorage();
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
      p = storageAnalyze.getAllStorage();
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
