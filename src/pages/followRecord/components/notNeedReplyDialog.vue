<template lang="html">
  <el-dialog
    title="不需回复"
    :visible.sync="visible"
    @close="close"
  >
    <el-form label-width="80px" :label-position="'right'">
      <el-form-item label="备注">
        <el-input type="textarea" :rows="6" v-model="remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CustomerQuesition from '../services';

const customerQuesition = new CustomerQuesition();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      id: '',
      remark: '',
    }
  },
  methods: {
    show(data) {
      this.visible = true;
      this.id = data.id;
    },
    close() {
      this.visible = false;
    },
    submit() {
      const {id, remark} = this;
      this.loading = true;
      customerQuesition.setNotNeedReply(id, remark).then((res) => {
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

<style lang="less">
</style>
