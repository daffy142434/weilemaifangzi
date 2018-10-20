<template lang="html">
  <el-dialog
    title="待接收商品"
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
        type="expand"
      >
        <template slot-scope="props">
          <el-table
            :data="props.row.goodsList"
            size="mini"
            border
          >
            <el-table-column
              label="SKU"
              prop="sku"
            >
            </el-table-column>
            <el-table-column
              label="商品状态"
            >
              <template slot-scope="props">
                {{GOODS_STATUS[props.row.goodsStatus]}}
              </template>
            </el-table-column>
            <el-table-column
              label="总待操作货品数量"
              prop="totalWaitOperateNum"
            >
            </el-table-column>
            <el-table-column
              label="已操作货品数量"
              prop="operatedNum"
            >
            </el-table-column>
            <el-table-column
              label="剩余待操作货品数量"
              prop="waitOperateNum"
            >
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
            >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="来源库"
        prop="sourceStorageName"
      >
      </el-table-column>
      <el-table-column
        label="操作人"
        prop="modifier"
      >
      </el-table-column>
      <el-table-column
        label="操作类型"
      >
        <template slot-scope="props">
          <span>{{OPERATE_TYPE[props.row.operateType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
      >
        <template slot-scope="props">
          <span v-date="props.row.operateTime"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作状态"
      >
        <template slot-scope="props">
          {{OPERATE_STATUS[props.row.operateStatus]}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作编号"
        prop="operateNo"
      >
      </el-table-column>
      <el-table-column
        label="流转批次号"
        prop="transferBatchNo"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template slot-scope="props">
          <el-button
            type="text"
            @click="handleShowConfirmDialog(props.row)"
            v-if="permissions('local_storage:goods_receive')"
          >确认</el-button>
          <el-button
            type="text"
             @click="handleShowRejectDialog(props.row)"
            v-if="permissions('local_storage:goods_receive')"
          >剔退</el-button>
          <!-- <el-popover
            placement="right"
            width="400"
            trigger="click">
            <div style="float:left">
              <el-input v-model="props.row.shippingPrice" placeholder="单个流转价格">
                <template slot="append">
                  <currency-select v-model="props.row.shippingPriceCurrency">
                  </currency-select>
                </template>
              </el-input>
            </div>
            <div style="float:right">
              <el-button type="primary" size="samll">确定</el-button>
            </div>
            <el-button type="text" slot="reference">修改价格</el-button>
          </el-popover> -->
        </template>
      </el-table-column>
    </el-table>
    <receive-confirm
      ref="receiveConfirm"
      @success="onSearch()"
    >
    </receive-confirm>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixin/dialog';
import loadingMixin from '@/mixin/loading';
import ReceiveConfirm from './receiveConfirm';
import Warehouse from '../services';
import WAREHOUSE from '../const';

const warehouse = new Warehouse();

const { GOODS_STATUS, OPERATE_TYPE, OPERATE_STATUS } = WAREHOUSE;

export default {
  mixins: [dialogMixin, loadingMixin],
  components: {
    ReceiveConfirm,
  },
  data() {
    return {
      GOODS_STATUS,
      OPERATE_TYPE,
      OPERATE_STATUS,
      loading: false,
      visible: false,
      id: '',
      data: [],
      searchData: {
        pageNumber: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    afterShow(data) {
      this.id = data.id;
      this.onSearch();
    },
    afterClose() {
      this.id = '';
      this.data = [];
    },
    handleShowConfirmDialog(data) {
      this.$refs.receiveConfirm.show(this.id, data.id, data.goodsList,0);
    },
    handleShowRejectDialog(data){
      this.$refs.receiveConfirm.show(this.id, data.id, data.goodsList,1);
    },
    onSearch() {
      const p = warehouse.getTransfersList(this.id, this.searchData);
      this.checkLoadingByPromise(p).then((res) => {
        this.data = res.data.data.data;
      });
    }
  }
}
</script>

<style lang="less">
</style>
