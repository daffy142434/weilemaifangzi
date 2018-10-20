<template lang="html">
  <el-tooltip
    placement="left"
  >
    <div slot="content">{{text}}</div>
    <div class="remark-column">
      {{text}}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>

<style lang="less">
.remark-column {
  width: 200px;
  height: 22px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
