<template lang="html">
  <div>
    <div class="page-title">
      亚马逊库件
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="货件状态">
          <el-select v-model="searchData.outBoundStatus">
            <el-option label="请选择" value=""></el-option>
            <el-option value="WORKING"></el-option>
            <el-option value="SHIPPED"></el-option>
            <el-option value="IN_TRANSIT"></el-option>
            <el-option value="DELIVERED"></el-option>
            <el-option value="CHECKED_IN"></el-option>
            <el-option value="RECEIVING"></el-option>
            <el-option value="CLOSED"></el-option>
            <el-option value="CANCELLED"></el-option>
            <el-option value="DELETED"></el-option>
            <el-option value="ERROR"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <contries-select v-model="searchData.countryCode"></contries-select>
        </el-form-item>
        <el-form-item label="出库日期范围" class="date">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="handleDate"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库人">
          <el-input placeholder="出库人" v-model="searchData.outbounder"></el-input>
        </el-form-item>
        <el-form-item label="货件编号">
          <el-input placeholder="货件编号" v-model="searchData.shipmentId"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div>
      <el-table
        v-loading.body="loading"
        ref="currencyTable"
        :data="data"
        border
        style="width: 100%">
        <el-table-column
          label="店铺名称"
          prop="shopName"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="出库仓库/入库仓库"
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.sourceStorageName}}</div>
              <div style="font-weight:bold;color:#67C23A;">{{props.row.targetStorageName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="出库国别/入库国别"
          width="100"
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.sourceStorageCountryName}}</div>
              <div style="font-weight:bold;color:#67C23A;">{{props.row.targetStorageCountryName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="出库人/出库日期/流转批次号"
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.outbounder}}</div>
              <div v-date="props.row.outboundTime"></div>
              <div>{{props.row.transferBatchNo}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="货件编号/货件名称"
          width="200"
        >
          <template slot-scope="props">
            <div>
              <div>{{props.row.shipmentId}}</div>
              <div>{{props.row.shipmentName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="装载/接收"
          min-width="180"
        >
          <template slot-scope="props">
            <div>
              <div v-for="item in props.row.amaInboundItemList" :key="item.id">
                [<span style="color:#67C23A;">{{item.originSku}}</span>] {{item.onlineSku}}({{item.shippedQuantity}} | {{item.receivedQuantity}}),
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="亚马逊货件状态"
          prop="outBoundStatus"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="异常状态"
          width="120"
          prop="exceptionType"
          :formatter="exceptionType"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="props">
            <div>
              <div>
                <el-tooltip :content="props.row.remark" placement="top" effect="light">
                  <el-button type="text" @click="handleRow(props.row.id)">备注</el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Service from './services';
import ShopSelect from '@/components/shop-select';

const service = new Service();

export default {
  components: {
    'shop-select': ShopSelect
  },
  data() {
    return {
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        pageSize: 50,
        pageNumber: 1,
        shipmentId:"",
        outBoundStatus:"",
        outbounder:"",
        outboundStartDate:"",
        outboundEndDate:"",
        countryCode:""
      },
      date:"",
      handleId:""
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    handleRow(id){
      this.$prompt('请输入处理信息', '备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showInput:true
      }).then(({ value }) => {
        this.getRemark(id,value);
      })
    },
    getRemark(id,value){
      service.getRemark(id,{remark:value}).then(res=>{
        this.$message({
          type: 'success',
          message: '备注成功'
        });
        this.onSearch();
      })
    },
    handleDate(val){
      if(val){
        this.searchData.outboundStartDate=val[0];
        this.searchData.outboundEndDate=val[1];
      }else{
        this.searchData.outboundStartDate="";
        this.searchData.outboundEndDate="";
      }
    },
    exceptionType(row, column, cellValue, index){
      switch(cellValue){
        case 0: return '处理完成';break;
        case 1: return '待接受货物';break;
        case 2: return '入库异常';break;
        case 3: return '接收异常';break;
      }
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        pageSize: 10,
        pageNumber: 1,
        shipmentId:"",
        outBoundStatus:"",
        outbounder:"",
        outboundStartDate:"",
        outboundEndDate:"",
        countryCode:""
      };
      this.date="";
      this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      service.getList(this.searchData).then((res) => {
        const data = res.data.data.data || [];
        const totalRecord = res.data.data.totalRecord;

        this.data = data;
        this.totalRecord = totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.multi-row-search .date{
  width: 500px;
}
</style>
