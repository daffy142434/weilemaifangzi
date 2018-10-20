<template lang="html">
  <el-select :value="value" @input="handleInput" :multiple="multiple" filterable clearable placeholder="请选择">
    <el-option
      v-for="(item, index) in list"
      :key="item.userNo"
      :label="`${item.loginName}(${item.name})`"
      :value="item.userNo">
    </el-option>
  </el-select>
</template>

<script>
import Member from '@/pages/member/services';

const member = new Member();
let p = member.getAllMember();
let start = Date.now();

export default {
  props: {
    value: [String, Array],
    multiple: {
      type: Boolean,
      default: false,
    },
    handleChange: [Function],
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    if (Date.now() - start > 3000) {
      p = member.getAllMember();
      start = Date.now();
    }
    p.then((res) => {
      this.list = res.data.data;
      this.$emit('afterInit', this.list);
    });
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  }
}
</script>

<style lang="css">
</style>
