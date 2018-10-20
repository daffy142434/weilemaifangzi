<template lang="html">
  <el-dialog
    title="处理客户邮件"
    :visible.sync="visible"
    class="heavy-form"
    width="90%"
  >
    <div class="tools-bar">
      <el-button
        type="success"
        size="small"
        @click="handleIgnoreAll"
        v-if="$store.state.powers.includes('customer_mail_log:list')"
      >忽略全部</el-button>
    </div>
    <el-table
      v-loading.body="loading"
      :data="data"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="邮件"
        width="420"
      >
        <template slot-scope="props">
          <div class="mail-info">
            <div><span class="mail-info-title">发：</span><span class="mail-info-text">{{props.row.emailFrom}}</span></div>
            <div><span class="mail-info-title">收：</span><span class="mail-info-text">{{props.row.emailTo}}</span></div>
            <div><span class="mail-info-title">标题：</span><span class="mail-info-text">{{props.row.emailSubject}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        width="180"
      >
        <template slot-scope="props">
          <el-button
            type="text"
            v-if="props.row.localOrderId"
            @click="handleShowOrderDetail(props.row)"
          >{{props.row.amaOrderId}}</el-button>
          <span v-if="!props.row.localOrderId">{{props.row.amaOrderId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="店铺名"
        width="160"
        >
      </el-table-column>
      <el-table-column
        prop="emailStatus"
        label="状态"
        width="100"
        :formatter="formatEmailStatus"
      >
      </el-table-column>
      <el-table-column
        prop="emailBusinessType"
        label="邮件类型"
        width="130"
        :formatter="formatEmailBusinessType"
      >
      </el-table-column>
      <el-table-column
        label="收件北京时间"
        width="180"
      >
        <template slot-scope="props">
          <span v-datetime="props.row.receiveTime"></span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="props">
          <div class="cq-exec">
            <not-need-reply-popover
              :data="props.row"
              v-if="props.row.emailStatus === 0 || props.row.emailStatus === 1"
              @setNotNeedReplySuccess="loadData({})"
            ></not-need-reply-popover>
            <el-button v-if="$store.state.powers.includes('customer_mail_log:show')" type="text" @click="showFallbackDialog(props.row)">查看/回复</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageSize"
        :current-page="pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import '@/lib/promiseExt';
import format from '@/lib/format';
import CustomerQuesition from '@/pages/customerQuesition/services';
import NotNeedReplyPopover from '@/pages/customerQuesition/components/notNeedReplyPopover';

const customerQuesition = new CustomerQuesition();

export default {
  components: {
    'not-need-reply-popover': NotNeedReplyPopover,
  },
  data() {
    return {
      visible: false,
      loading: false,
      data: [],
      pageSize: 10,
      pageNumber: 1,
      totalRecord: 0,
      doId: null
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.loadData({});
    },
    loadData({pageSize = this.pageSize, pageNumber = this.pageNumber}) {
      const params = {
        pageSize: pageSize,
        pageNumber: pageNumber,
        // emailStatus: 0
      }
      this.loading = true;

      customerQuesition.getQuesitionList(params).then((res) => {
        const data = res.data.data.data || [];
        this.data = data;
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleSizeChange(pageSize) {
      this.loadData({pageSize});
    },
    handleCurrentChange(pageNumber) {
      this.loadData({pageNumber});
    },
    handleNotNeedReply(data) {
      this.$emit('notNeedReply', data);
    },
    handleShowOrderDetail(data) {
      this.$emit('showOrderDetail', data);
    },
    handleHistory(data) {
    },
    handleIgnoreAll() {
      this.$confirm(
        '是否忽略全部邮件，此处为忽略ERP中对邮件的提示。如果需要标记客户邮件无需回复，任需要进亚马逊后台操作',
        {
          title: '忽略全部邮件',
          type: 'warning',
          callback: (action) => {
            if (action === "confirm") {
              this.loading = true;
              customerQuesition.ignoreAllEmail().then(() => {
                this.loadData({});
              })
              .catch(() => {
                this.loading = false;
              });
            }
          },
        }
      );
    },
    claim({processOrder}) {
      customerQuesition.applyQuesition(processOrder.id)
        .then(() => {
          return this.loadData({});
        })
    },
    showFallbackDialog(data) {
      this.$emit('onOpenFallbackDialog', data);
    },
    closeQuesition(data) {
      customerQuesition.closeQuesition(data.processOrder.id)
        .then(() => {
          return this.loadData({});
        })
    },
    formatEmailBusinessType(row, col, value) {
      return ['其他-亚马逊', '产品咨询-亚马逊', '物流咨询-亚马逊', '退货咨询-亚马逊'][value];
    },
    formatEmailStatus(row, col, value) {
      return ['未读', '已读未回复', '已回复', '忽略'][value] || '';
    },
  }
}
</script>

<style lang="less">
</style>
