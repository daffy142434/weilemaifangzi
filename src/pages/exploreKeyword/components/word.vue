<template lang="html">
  <span>
    <el-tooltip
      v-if="stList.length"
      placement="top"
      :enterable="false"
    >
      <div slot="content">
        此关键词已添加到 <span style="color: #F56C6C;">{{stList.join(', ')}}</span>
      </div>
      <el-checkbox
        class="already-select"
        :label="word"
      ></el-checkbox>
    </el-tooltip>
    <el-checkbox
      v-if="!stList.length"
      :label="word"
    ></el-checkbox>
  </span>
</template>

<script>
export default {
  props: {
    data: Object,
    word: String,
  },
  computed: {
    stList() {
      const stList = [];
      for(let i = 1; i <= 5; i++) {
        const key = `st${i}`;
        const wordList = `,${this.data[key]},`;
        if (wordList.indexOf(`,${this.word},`) !== -1) {
          stList.push(`卖点${i}`);
        }
      }
      return stList;
    },
  }
}
</script>

<style lang="less">
</style>
