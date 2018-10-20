<template lang="html">
  <div>
    <div class="page-title">
      客户往来记录
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="店铺名">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchData.amaOrderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="买家名">
          <el-input v-model="searchData.sendName" placeholder="买家名"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="买家邮箱">
          <el-input v-model="searchData.emailFrom" placeholder="买家邮箱"></el-input>
        </el-form-item>
        <el-form-item label="收件邮箱">
          <el-input v-model="searchData.emailTo" placeholder="收件邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchData.emailStatus">
            <el-option label="请选择" value=""></el-option>
            <el-option label="未读" value="0"></el-option>
            <el-option label="已读" value="1"></el-option>
            <el-option label="已回复" value="2"></el-option>
            <el-option label="无需回复" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" style="width: 600px;">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            placeholder="选择日期范围"
            @change="handleDateChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button
        type="success"
        size="small"
        @click="handleIgnoreAll"
        v-if="$store.state.powers.includes('customer_mail_log:list')"
      >忽略全部</el-button>
    </div>
    <div v-if="$store.state.powers.includes('customer_mail_log:list')">
      <el-table
        v-loading.body="tableLoading"
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          label="邮件"
          width="420"
        >
          <template slot-scope="props">
            <div v-if="props.row.emailStatus === 3">
              <el-tooltip placement="top" effect="light">
                <div slot="content"><span>忽略人员:{{props.row.modifier}}</span><br/><span>忽略时间:{{toDateTime(props.row.modifyTime)}}</span></div>
                <div class="mail-info">
                  <div><span class="mail-info-title">发：</span><span class="mail-info-text">{{props.row.emailFrom}}</span></div>
                  <div><span class="mail-info-title">收：</span><span class="mail-info-text">{{props.row.emailTo}}</span></div>
                  <div><span class="mail-info-title">标题：</span><span class="mail-info-text">{{props.row.emailSubject}}</span></div>
                </div>
              </el-tooltip>
            </div>
            <div v-else>
              <div class="mail-info">
                  <div><span class="mail-info-title">发：</span><span class="mail-info-text">{{props.row.emailFrom}}</span></div>
                  <div><span class="mail-info-title">收：</span><span class="mail-info-text">{{props.row.emailTo}}</span></div>
                  <div><span class="mail-info-title">标题：</span><span class="mail-info-text">{{props.row.emailSubject}}</span></div>
                </div>
            </div>
            
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          width="180"
        >
          <template slot-scope="props">
            <div>
              <el-button
                type="text"
                @click="handleShowOrderDetail(props.row)"
              >{{props.row.amaOrderId}}</el-button>
              <!-- <span v-if="!props.row.localOrderId">{{props.row.amaOrderId}}</span> -->
            </div>
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

        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="props">
            <div class="cq-exec">
              <el-button type="text" @click="handleHistory(props.row)">历史往来</el-button>
              <not-need-reply-popover
                :data="props.row"
                v-if="props.row.emailStatus === 0 || props.row.emailStatus === 1"
                @setNotNeedReplySuccess="onSearch"
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
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <not-need-reply-dialog ref="notNeedReplyDialog" @setNotNeedReplySuccesss="onSearch"></not-need-reply-dialog>
    <fallback-dialog ref="fallbackDialog"></fallback-dialog>
    <order-detail
      ref="orderDetail"
    ></order-detail>
  </div>
</template>
<script>
  import moment from 'moment';
  import ajax from '@/lib/ajax';
  import format from '@/lib/format';
  import CustomerQuesition from '@/pages/customerQuesition/services';
  import ShopSelect from '@/components/shop-select';
  import CompanySelect from '@/components/company-select';
  import OrderDetail from '@/pages/amaOrder/components/orderDetail';
  import NotNeedReplyDialog from './components/notNeedReplyDialog';
  import FallbackDialog from './components/fallbackDialog';
  import NotNeedReplyPopover from './components/notNeedReplyPopover';

  const customerQuesition = new CustomerQuesition();

  export default {
    components: {
      'fallback-dialog': FallbackDialog,
      'not-need-reply-dialog': NotNeedReplyDialog,
      'shop-select': ShopSelect,
      'company-select': CompanySelect,
      'not-need-reply-popover': NotNeedReplyPopover,
      'order-detail': OrderDetail
    },
    data() {
      return {
        searchData: {
          shopName: '',
          countryName: '',
          amaOrderId: '',
          customerName: '',
          userNo: '',
          customerEmail: '',
          startDate: '',
          endDate: '',
          pageNumber: 1,
          pageSize: 10
        },
        daterange: '',
        tableData: [],
        totalRecord: 0,
        pageSize: 10,
        tableLoading: false,
      }
    },
    computed: {
    },
    beforeCreate(){
    },
    created() {
      this.onSearch();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (row.emailStatus === 0 || row.emailStatus === 1) {
          return 'success-row';
        }
        return '';
      },
      toDateTime(cellValue) {
        return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      showFallbackDialog(data) {
        const requestData = {
          ...data,
          processOrder: {
            emailForm: data.customerEmail,
            shopEmail: data.shopEmail,
            shopId: data.emailId,
            emailId: data.shopId,
          }
        }
        this.$refs.fallbackDialog.show(data);
      },
      handleHistory(data) {
        this.searchData.emailFrom = data.emailFrom;
        this.searchData.pageNumber = 1;
        this.onSearch();
      },
      handleNotNeedReply(data) {
        this.$refs.notNeedReplyDialog.show(data);
      },
      handleSizeChange(val) {
        this.searchData.pageSize = val;
        this.beforeSearch();
      },
      handleCurrentChange(val) {
        this.searchData.pageNumber = val;
        this.onSearch({pageNumber: val});
      },
      handleDateChange(values) {
        if (!values) {
          this.searchData.startDate = '';
          this.searchData.endDate = '';
          return;
        }
        const [startDate, endDate] = values;
        this.searchData.startDate = format.toDate(startDate);
        this.searchData.endDate = format.toDate(endDate);
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
                  this.onSearch();
                })
                .catch(() => {
                  this.loading = false;
                });
              }
            },
          }
        );
      },
      handleShowOrderDetail(data) {
        this.$refs.orderDetail.showForCustomer(data);
      },
      formatEmailStatus(row, col, value) {
        return ['未读', '已读未回复', '已回复', '忽略'][value] || '';
      },
      formatEmailBusinessType(row, col, value) {
        return ['其他-亚马逊', '产品咨询-亚马逊', '物流咨询-亚马逊', '退货咨询-亚马逊'][value];
      },
      handleReset() {
        this.searchData = {
          shopName: '',
          countryName: '',
          amaOrderId: '',
          customerName: '',
          userNo: '',
          customerEmail: '',
          startDate: '',
          endDate: '',
          pageNumber: 1,
          pageSize: 10
        };
        this.daterange = '';
        this.onSearch();
      },
      beforeSearch(){
        this.searchData.pageNumber=1;
        this.onSearch();
      },
      onSearch() {
        this.tableLoading = true;
        let pageSize = this.pageSize;
        customerQuesition.getQuesitionList(this.searchData)
          .then((response) => {
            const tableData = response.data.data.data || [];
            this.tableData = tableData.map((d) => {
              d.emailTime = format.toDateTime(d.emailTime);
              return d;
            });
            this.totalRecord = response.data.data.totalRecord;
            this.tableLoading = false;
          })
          .catch(() => {
            this.tableLoading = false;
          });
      },
    },
  }
</script>

<style lang="less">
  .big-pic {
    max-width: 650px;max-height: 650px;
  }
  .small-pic {
    margin-top:7px;cursor:pointer;width: 50px;height: 50px;
  }
  .cq-exec {
    .el-button {
      margin: 0 6px;
    }
  }
  .mail-info {
    &>div {
      display: flex;
    }
    &-title {
      width: 45px;
      text-align: right;
    }
    &-text {
      flex: 1;
    }
  }
</style>
