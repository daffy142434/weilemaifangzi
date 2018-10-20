<template lang="html">
  <el-popover
    placement="top"
    width="160"
    v-model="visible">
    <div class="confirm-popover-text">
      <slot name="content"></slot>
    </div>
    <div class="confirm-popover-footer">
      <el-button size="mini" type="text" @click="hide">取消</el-button>
      <el-button type="primary" size="mini" @click="submit" :loading="loading">确定</el-button>
    </div>
    <span slot="reference">
      <span>
        <slot name="entry"></slot>
      </span>
    </span>
  </el-popover>
</template>

<script>
export default {
  props: ['data', 'onSubmit'],
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  methods: {
    hide() {
      this.visible = false;
      this.loading = false;
    },
    submit() {
      if (!this.onSubmit) {
        return;
      }
      this.loading = true;
      this.onSubmit(this.data, () => {
        this.visible = false;
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="less">
.confirm-popover {
  &-text {
    line-height: 23px;
    padding: 10px 0;
  }
  &-footer {
    text-align: right;
  }
}
</style>
