<template lang="html">
  <div class="variant-drag-handler">
    <div v-if="item.depth === 0">
      <span>{{item.sku}}</span>
      <span class="gray">（FBA：{{item.fba}}）</span>
      <slot></slot>
    </div>
    <div v-if="item.depth !== 0" class="drag-img-product-item">
      <div class="drag-img-product-item-img" :style="item.style"></div>
      <div class="drag-img-product-item-info">
        <span>{{item.sku}}</span>
        <br />
        FBA：{{item.fba}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item']
}
</script>

<style lang="less">
  .drag-img-product-item {
    display: flex;
    &-img {
      width: 68px;
      height: 68px;
    }
    &-info {
      margin-left: 10px;
      line-height: 32px;
      padding: 2px 0;
    }
  }
</style>
