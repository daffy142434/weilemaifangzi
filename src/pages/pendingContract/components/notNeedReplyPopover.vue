<template lang="html">
  <span>
    <el-popover
      ref="popover-form"
      placement="right"
      title="标记红单"
      width="300"
      v-model="visible"
      trigger="click">
      <p>此处为忽略ERP中对邮件的提示。如果需要标记客户邮件无需回复，任需要进亚马逊后台操作</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="submit">确定</el-button>
      </div>
    </el-popover>
    <el-button type="text" v-popover:popover-form>忽略</el-button>
  </span>
</template>

<script>
import CustomerQuesition from '@/pages/customerQuesition/services';

const customerQuesition = new CustomerQuesition();

export default {
  props: ['data'],
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true;
      customerQuesition.setNotNeedReply(this.data.id, '').then((res) => {
        this.$emit('setNotNeedReplySuccess');
        this.close();
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="css">
</style>
