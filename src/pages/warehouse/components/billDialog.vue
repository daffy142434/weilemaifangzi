<template lang="html">
  <el-dialog
    title="收支记录"
    :visible.sync="visible"
    width="90%"
    @close="close"
  >
    <el-table
      v-loading="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="类型"
      >
        <template slot-scope="props">
          {{BILL_TYPE[props.row.billType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="单号"
        prop="businessNo"
      >
      </el-table-column>
      <el-table-column
        label="操作编号"
        prop="operateNo"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="金额"
        prop="billAmount"
      >
      </el-table-column>
      <el-table-column
        label="币种"
        prop="currency"
      >
      </el-table-column>
      <el-table-column
        label="人民币金额"
      >
        <template slot-scope="props">
          <strong class="primary" style="font-size: 18px; font-weight: 900;">{{props.row.cnyAmount}}</strong>
        </template>
      </el-table-column>
      <el-table-column
        label="北京时间"
      >
        <template slot-scope="props">
          <span v-date="props.row.createTime"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人/操作时间"        
      >
        <template slot-scope="props">
          <div>{{props.row.operaterName}}</div>
          <div>{{toDateTime(props.row.operateTime)}}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import Warehouse from '../services';

const warehouse = new Warehouse();

const BILL_TYPE = {
  '1': '成本',
  '2': '流转成本',
  '20': '收入',
};
export default {
  data() {
    return {
      BILL_TYPE,
      loading: false,
      visible: false,
      data: [],
    };
  },
  methods: {
    toDateTime(cellValue) {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    show(data) {
      this.visible = true;
      this.loading = true;
      warehouse.getGoodsBill(data.id).then((res) => {
        this.loading = false;
        this.data = res.data.data;
      }).catch(() => {
        this.loading = false;
      });
    },
    close() {
      this.visible = false;
      this.data = [];
    },
  },
};
</script>

<style lang="less">
</style>
