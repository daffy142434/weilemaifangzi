<template lang="html">
  <ul :class="className">
    <slot name="prepend"></slot>
    <li
      v-for="(item, index) in list"
      :class="{active: active === index}"
      @click="handleClick(item, index)"
    >
      <slot :item="item" :index="index"></slot>
    </li>
    <slot name="append"></slot>
  </ul>
</template>

<script>
export default {
  props: {
    list: Array,
    class: {
      type: String,
      require: false,
      default: ''
    },
    defaultActive: {
      type: Number,
      require: false,
      default: 0
    }
  },
  data() {
    return {
      active: this.defaultActive
    }
  },
  computed: {
    className: () => {
      return `list ${this.class || ''}`;
    }
  },
  methods: {
    handleClick(item, index) {
      this.$emit('change', item, index);
      this.setActive(index);
    },
    setActive(index) {
      this.active = index;
    }
  }
}
</script>

<style lang="less">
.list {
  border: #DCDFE6 1px solid;
  border-bottom: 0;
  li {
    border-bottom: #DCDFE6 1px solid;
    line-height: 26px;
    padding: 7px 10px;
    &.active {
      background: #409EFF;
      color: #fff;
      margin: 0 -1px;
      padding: 7px 11px;
    }
  }
}
</style>
