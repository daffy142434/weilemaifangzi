<template lang="html">
  <el-dialog
    :title="title"
    :append-to-body="true"
    ref="dialog"
    width="95%"
    :visible.sync="visible"
    @close="close"
  >
    <div>
      <el-table 
        ref="infoTable"
        :data="inboundRecords"
        v-loading.body="loading"
        border 
        highlight-current-row
      >
        <el-table-column property="sku" min-width="250" label="本地SKU"></el-table-column>
        <el-table-column property="storageName" width="250" label="仓库"></el-table-column>
        <el-table-column property="deliveryNum" width="250" label="入库数量"></el-table-column>
        <el-table-column property="deliveryTime" width="250" label="入库时间">
          <template slot-scope="scope">
            {{scope.row.deliveryTime ? moment(scope.row.deliveryTime).format('YYYY-MM-DD HH:mm:ss') : ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import PurchaseManage from '../services';
const purchaseManage = new PurchaseManage();
const yesOrNoMap = {
  "1": "是",
  "0": "否",
};
export default {
  components: {

  },
  props: ['type'],
  data() {
    return {
      moment,
      inboundRecords: [],
      visible: false,
      loading: true,
      title: '入库记录',
    }
  },
  updated() {
  },
  methods: {
    show(params) {
      this.visible = true;
      purchaseManage.getInboundRecords(params).then((res) => {
        let result = res.data.data;
        for(let item of result) {
          item.sku = params.sku;
        }
        this.inboundRecords = result;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
      });
    },
    close() {
      this.sku = '';
      this.inboundRecords = [];
      this.visible = false;
      this.loading = false;
    },
  }
}
</script>

<style lang="less">
</style>
