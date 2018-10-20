<template lang="html">
  <div>
    <div class="page-title">
      官方邮件
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="店铺名">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="时间" style="width: 600px;">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            placeholder="选择日期范围"
            @change="handleDateChange"
          >
          </el-date-picker>
          <el-checkbox v-model="searchData.isQA" @change="onSearch()" true-label=1 false-label=0 class="qa-checked">只看QA邮件</el-checkbox>
        </el-form-item>
        
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div>
      <el-table
        v-loading.body="tableLoading"
        ref="singleTable"
        :data="tableData"
        :row-class-name="tableRowClassName"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          prop="companyName"
          label="公司名称"
          width="200"
        >
        </el-table-column>
        <el-table-column
          label="邮件标题"
        >
          <template slot-scope="props" >
            <div v-if="(props.row.emailStatus==3||props.row.emailStatus==2)&&props.row.emailFrom.indexOf('seller-answers@amazon')!=-1">
              <el-tooltip placement="top" effect="light">
                <div slot="content" ><span>处理人员:{{props.row.modifier}}</span><br/><span>处理时间:{{toDateTime(props.row.modifyTime)}}</span></div>              
                <div class="mail-info">
                  <div>{{props.row.emailSubject}}</div>
                  <div v-show="props.row.emailFrom.indexOf('seller-answers@amazon')!=-1"><el-tag type="info" size="small" v-if="props.row.emailStatus==3||props.row.emailStatus==2">已处理</el-tag><el-tag class="active" size="small" @click.native="replay(props.row)" v-else>未处理</el-tag></div>
                </div>
              </el-tooltip>
            </div>
            <div v-else>
              <div class="mail-info">
                <div>{{props.row.emailSubject}}</div>
                <div v-show="props.row.emailFrom.indexOf('seller-answers@amazon')!=-1"><el-tag type="info" size="small" v-if="props.row.emailStatus==3||props.row.emailStatus==2">已处理</el-tag><el-tag class="active" size="small" @click.native="replay(props.row)" v-else>未处理</el-tag></div>
              </div>
            </div>
          </template>
          
        </el-table-column>
        
        <el-table-column
          label="发件人/收件人"
          width="300"
        >
          <template slot-scope="props">
            <div>发：{{props.row.emailFrom}}</div>
            <div>收：{{props.row.emailTo}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="收件北京时间"
          width="160"
        >
          <template slot-scope="props">
            <span v-datetime="props.row.receiveTime"></span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="60" fixed="right">
          <template slot-scope="props">
            <el-button type="text" @click="showFallbackDialog(props.row)">查看</el-button>
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
    <fallback-dialog ref="fallbackDialog" title="邮件详情" :hideReply="true"></fallback-dialog>
  </div>
</template>
<script>
  import moment from 'moment';
  import ajax from '@/lib/ajax';
  import format from '@/lib/format';
  import ShopSelect from '@/components/shop-select';
  import CompanySelect from '@/components/company-select';
  import OrderDetail from '@/pages/amaOrder/components/orderDetail';
  import NotNeedReplyDialog from '@/pages/customerQuesition/components/notNeedReplyDialog';
  import FallbackDialog from '@/pages/customerQuesition/components/fallbackDialog';
  import NotNeedReplyPopover from '@/pages/customerQuesition/components/notNeedReplyPopover';
  import ShopServiceMail from './services';

const shopServiceMail = new ShopServiceMail();

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
          pageSize: 10,
          isQA:0
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
        if (row.emailFrom.indexOf('seller-answers@amazon')!=-1) {
          return 'success-row2';
        }
        return '';
      },
       toDateTime(cellValue) {
        return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      replay(data){
        this.$confirm('标记为已处理?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          shopServiceMail.qaReplay(data.id).then(res=>{
            
            data.modifier=this.$store.state.userInfo.name;
            data.modifyTime=+new Date();
            data.emailStatus=3;
          })
        }).catch(() => {
                 
        });
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
      handleShowOrderDetail(data) {
        this.$refs.orderDetail.show(data.localOrderId);
      },
      formatEmailStatus(row, col, value) {
        return ['未读', '已读未回复', '已回复', '忽略'][value] || '';
      },
      formatEmailBusinessType(row, col, value) {
        return ['其他-亚马逊', '产品咨询-亚马逊', '物流咨询-亚马逊', '退货咨询-亚马逊'][value];
      },
      handleHistory(data) {
        this.searchData.emailFrom = data.emailFrom;
        this.searchData.pageNumber = 1;
        this.onSearch();
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
        shopServiceMail.getOffcialList(this.searchData)
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
  .qa-checked{
    margin-left:20px;
  }
  .el-table .success-row2{
    background: #d5f1c7;
  }
  .active{
    color:#409EFF;
    cursor: pointer;
  }
</style>
