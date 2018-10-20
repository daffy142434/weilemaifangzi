<template lang="html">
  <el-select :value="value" @input="handleInput">
    <el-option label="请选择" value=""></el-option>
    <el-option v-for="item in list" :label="item.departmentName" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>

<script>
import Member from '@/pages/member/services';

const member = new Member();
const p = member.getDepartmentList();

export default {
  props: {
    value: [String]
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
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
