<template lang="html">
  <el-dialog
    title="仓库管理"
    :visible.sync="visible"
    width="400px"
    @close="close"
  >
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      v-loading="loading"
    >
      <el-form-item label="仓库状态" prop="status">
        <el-select v-model="form.status">
          <el-option value="">请选择</el-option>
          <el-option :value="0" label="停用"></el-option>
          <el-option :value="1" label="启用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库名称" prop="storageName">
        <el-input v-model="form.storageName" placeholder="仓库名称"></el-input>
      </el-form-item>
      <el-form-item label="仓库地址" prop="storageAddress">
        <el-input v-model="form.storageAddress" placeholder="仓库地址"></el-input>
      </el-form-item>
      <el-form-item label="建库时间" prop="storageCreateDate">
        <el-date-picker v-model="form.storageCreateDate" v-if="type !== 'edit'" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        <span v-date="form.storageCreateDate" v-if="type === 'edit'"></span>
      </el-form-item>
      <el-form-item label="国家" prop="countryCode">
        <contries-select v-model="form.countryCode"></contries-select>
      </el-form-item>
      <el-form-item label="仓库类型" prop="storageType">
        <el-select v-model="form.storageType">
          <el-option value="">请选择</el-option>
          <el-option :value="1" label="虚拟库"></el-option>
          <el-option :value="2" label="实体库"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import extend from 'extend';
import getCountryNameByStationCode from '@/lib/getCountryNameByStationCode';
import Warehouse from '../services';

const warehouse = new Warehouse();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      type: 'add',
      id: '',
      form: {
        status: '',
        storageName: '',
        storageAddress: '',
        storageCreateDate: '',
        countryCode: '',
        countryName: '',
        storageType: '',
      },
      rules: {
        status: {
          required: true,
          message: '请选择仓库状态',
        },
        storageName: {
          required: true,
          message: '请填写仓库名称',
        },
        storageAddress: {
          required: true,
          message: '请选择仓库地址',
        },
        storageCreateDate: {
          required: true,
          message: '请选择建库时间',
        },
        countryCode: {
          required: true,
          message: '请选国家',
        },
        storageType: {
          required: true,
          message: '请选择仓库类型',
        },
      },
    };
  },
  methods: {
    submit() {
      
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = extend(true, {}, this.form);
          let p;

          // params.storageCreateDate = moment(params.storageCreateDate).format('YYYY-MM-DD');
          params.countryName = getCountryNameByStationCode(params.countryCode);
          switch(this.type) {
            case 'edit':
              p = warehouse.edit(this.id, params);
              delete params.storageCreateDate;
              break;
            default:
              p = warehouse.add(params);
          }
          this.loading = true;
          p.then((res) => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.$emit('success');
            this.close();
          }).catch(() => {
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    show(type, data) {
      this.type = type;
      this.visible = true;
      setTimeout(() => {
        if (type === 'edit') {
          this.id = data.id;
          this.form.status = data.status;
          this.form.storageName = data.storageName;
          this.form.storageAddress = data.storageAddress;
          this.form.countryCode = data.countryCode;
          this.form.countryName = data.countryName;
          this.form.storageType = data.storageType;
          this.form.storageCreateDate = new Date(data.storageCreateDate);
        }
      });
    },
    close() {
      this.visible = false;

      this.id = '';
      this.form.status = '';
      this.form.storageName = '';
      this.form.storageAddress = '';
      this.form.storageCreateDate = '';
      this.form.countryCode = '';
      this.form.countryName = '';
      this.form.storageType = '';

      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="less">
</style>
