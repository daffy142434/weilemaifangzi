<template lang="html">
  <span class="tread-column">
    <slot></slot>
    <span v-if="arrow !== ''" :class="'icon el-icon-' + arrow"></span>
  </span>
</template>

<script>
export default {
  props: ['arrow-up'],
  computed: {
    arrow: {
      get() {
        switch(this.arrowUp) {
          case '0': return 'sort-down';
          case '1': return 'sort-up';
          default: return '';
        }
      }
    }
  }
}
</script>

<style lang="less">
.tread-column {
  .el-icon-sort-down {
    color: #67C23A;
  }
  .el-icon-sort-up {
    color: #F56C6C;
    margin-left: -10px;
  }
  .icon {
    font-size: 18px;
    display: inline-block;
    vertical-align: -2px;
  }
}
</style>
