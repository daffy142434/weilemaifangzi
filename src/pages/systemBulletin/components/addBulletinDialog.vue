<template lang="html">
  <el-dialog
    title="添加公告"
    width="60%"
    :visible.sync="visible"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="标题" prop="bulletinTitle">
        <el-input type="text" v-model="form.bulletinTitle"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="bulletinContent">
        <el-input type="textarea" :rows="6" v-model="form.bulletinContent"></el-input>
      </el-form-item>
      <el-form-item label="公告时间" prop="bulletinTime">
        <el-date-picker
          type="datetime"
          v-model="form.bulletinTime"
          value-format="yyyy-MM-dd hh:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="通知子用户：">
        <el-radio-group v-model="form.subBulletinStatus">
          <el-radio :label="0">通知</el-radio>
          <el-radio :label="1">不通知</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import SystemBulletin from '../services';

const systemBulletin = new SystemBulletin();
export default {
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        bulletinTitle: '',
        bulletinContent: '',
        bulletinTime: '',
        subBulletinStatus: 0
      },
      rules: {
        bulletinTitle: [
          {
            required: true,
            message: '请输入公告标题'
          }
        ],
        bulletinContent: [
          {
            required: true,
            message: '请输入公告内容'
          }
        ],
        bulletinTime: [
          {
            required: true,
            message: '请选择公告时间'
          }
        ]
      }
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        systemBulletin.doAdd(this.form).then((res) => {
          this.visible = false;
          this.$emit('addSuccess');
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    close() {
      this.visible = false;
      this.loading = false;
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style lang="css">
</style>
