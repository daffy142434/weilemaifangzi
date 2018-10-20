<template lang="html">
  <el-button type="text" size="small" @click="handleMailConnectTest" :loading="loading">连接测试</el-button>
</template>

<script>
import ShopServiceMail from '../services';

const shopServiceMail = new ShopServiceMail();

export default {
  props: ['data'],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleMailConnectTest() {
      this.loading = true;
      shopServiceMail.mailConnectTest(this.data.id).then((res) => {
        const data = res.data.data;
        const map = {
          '0': '连线失败',
          '1': '连线成功',
        };
        this.$alert(
          [
            `<div>收件配置 <span style="color: #${data.receiveActiveStatus === 1 ? '67C23A' : 'F56C6C'}">${map[data.receiveActiveStatus]}<span></div>`,
            `<div>发件配置 <span style="color: #${data.sendActiveStatus === 1 ? '67C23A' : 'F56C6C'}">${map[data.sendActiveStatus]}<span></div>`
          ].join(''),
          '邮箱连线状态',
          {
            dangerouslyUseHTMLString: true
          }
        );
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
