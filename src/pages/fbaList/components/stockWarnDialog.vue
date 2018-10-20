<template lang="html">
  <el-dialog title="库存预警" :visible="visible" @close="close" width="320px">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules" v-loading="loading">
      <el-form-item prop="warnType" label="预警类型">
        <el-select v-model="form.warnType">
          <el-option label="不预警" :value="0"></el-option>
          <el-option label="定额预警" :value="1"></el-option>
          <el-option label="周转天数预警" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="warnNum" label="预警定额" v-if="form.warnType === 1">
        <el-input v-model="form.warnNum"></el-input>
      </el-form-item>
      <el-form-item prop="warnNum" label="预警天数" v-if="form.warnType === 2">
        <el-input v-model="form.warnNum"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FbaList from '../services';

const fbaList = new FbaList();

export default {
  props: ['data'],
  data() {
    const valid = (rule, value, callback) => {
      if (this.form.warnType !== 0 && this.form.warnNum === '') {
        switch(this.form.warnType) {
          case 1:
            callback(new Error('请输入预警定额'));
            break;
          case 2:
            callback(new Error('请输入预警天数'));
            break;
        }
      }
    };
    return {
      visible: false,
      loading: false,
      id: '',
      form: {
        warnType: 0,
        warnNum: ''
      },
      rules: {
        warnNum:[{required: true, message: '此项必须填写'}]
      }
    }
  },
  methods: {
    show(data) {
      this.visible = true;
      this.id = data.id;
      this.form.warnType = data.warnType;
      if (data.warnNum === 0) {
        this.form.warnNum = 0;
      } else {
        this.form.warnNum = data.warnNum || '';
      }
    },
    close() {
      this.visible = false;
      this.id = '';
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form.validate((valid) => {
        const {id, form} = this;
        if (!valid) {
          return;
        }
        this.loading = true;
        fbaList.setWarnType(id, form).then((res) => {
          this.$emit('setStockWarnSuccess');
          this.close();
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      });
    }
  }
}
</script>

<style lang="less">
</style>
