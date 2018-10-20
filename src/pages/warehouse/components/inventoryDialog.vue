<template lang="html">
  <el-dialog
    title="流转记录"
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
          {{INVENTORY_TYPE[props.row.inventoryType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="来源库"
        prop="sourceStorageName"
      >
      </el-table-column>
      <el-table-column
        label="去向库"
        prop="targetStorageName"
      >
      </el-table-column>
      <el-table-column
        label="单号"
        prop="businessNo"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="操作编号"
        prop="operateNo"
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="北京时间"
      >
        <template slot-scope="props">
          <span v-date="props.row.createTime"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="店铺"
        prop="shopNames"
      >
      </el-table-column>
      <el-table-column
        label="操作人/操作时间"
      >
        <template slot-scope="props">
            <div>{{props.row.operaterName}}</div>
            <div>{{toDateTime(props.row.operateTime)}}</div>
          </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
      >
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import Warehouse from '../services';

const warehouse = new Warehouse();

const INVENTORY_TYPE = {
  '1': '入库',
  '2': '出库',
  '3': '差项核销',
  '4': '销项核销',
  '5': '销毁核销',
  '6': '销售核销',
  '7': '操作失误核销',
  '8': '出库退回(剔退)',
  '9': '客户损毁',
};
export default {
  data() {
    return {
      INVENTORY_TYPE,
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
      warehouse.getGoodsInventory(data.id).then((res) => {
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
