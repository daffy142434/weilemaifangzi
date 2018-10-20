<template lang="html">
  <div class="operate-log-index">
    <div class="page-title">
      仓库操作日志
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库">
              <storage-select v-model="id"></storage-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作类型">
              <el-select v-model="searchData.operateType">
                <el-option label="请选择" value=""></el-option>
                <el-option label="入库" value="1"></el-option>
                <el-option label="出库" value="2"></el-option>
                <el-option label="确认接收货物" value="3"></el-option>
                <el-option label="核销" value="4"></el-option>
                <el-option label="剔退" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          
          <el-col :span="18">
            <el-form-item
              label='截止日期'
            >
              <el-date-picker
                v-model="time"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDaterangeChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="fr">
              <el-button type="text" @click="handleReset">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
            </div>
          </el-col>
        </el-row>
        
        
      </el-form>
      
    </div>
    <div>
      <el-table
        v-loading.body="loading"
        :data="data"
        border
        highlight-current-row
        style="width: 100%">
        
        <el-table-column
          label="操作人员"
          prop="modifier"
          width=""
        >
        </el-table-column>
        <el-table-column
          label="源库"
          prop="sourceStorageName"
          width=""
        >
        </el-table-column>
        
        <el-table-column
          label="目标库"
          prop="storageName"
          width=""
        >
        </el-table-column>
        <el-table-column
          label="操作类型"
          prop="operateType"
          :formatter="handleType"
        >
          
        </el-table-column>
        <el-table-column
          label="操作编号"
          prop="operateNo"
          width=""
        >
        </el-table-column>
        
        <el-table-column
          label="操作时间"
          width=""
        >
          <template slot-scope="props">
            <span v-date="props.row.operateTime"></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
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

import storageSelect from '@/components/storage-select';
import operateLog from './services';
const operate = new operateLog();

export default {
  
  data() {
    return {
      loading: false,
      data: [],
      totalRecord: 0,
      id:"",
      searchData: {
        pageSize: 10,
        pageNumber: 1,
        operateType: '',
        startDate: '',
        endDate: ''
      },
      time:""
    }
  },
  components:{
    storageSelect
  },
  mounted() {
    // this.onSearch();
  },
  methods: {
    handleType(row, column, cellValue, index){
      switch(cellValue){
        case 1: return '入库'; break;
        case 2: return '出库'; break;
        case 3: return '确认接收货物'; break;
        case 4: return '核销'; break;
        case 5: return '剔退'; break;
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
      this.searchData =  {
        pageSize: 10,
        pageNumber: 1,
        operateType: '',
        startDate: '',
        endDate: ''
      };
      //this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      if(!this.id){
        this.$message.error('请选择仓库');
        return;
      }
      this.loading = true;
      operate.getList(this.id,this.searchData).then((res) => {
        const data = res.data.data.data || [];
        const totalRecord = res.data.data.totalRecord;

        this.data = data;
        this.totalRecord = totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleDaterangeChange(val){
      if(!val){
        this.searchData.startDate="";
        this.searchData.endDate="";
      }else{
        this.searchData.startDate=val[0];
        this.searchData.endDate=val[1];
      }
    },
  }
}
</script>

<style lang="less" scoped>
.search-bar .el-form{
  width: 100%;
}
.el-row:nth-child(1){
  margin-bottom:10px;
}

</style>
<style>
.operate-log-index .search-bar .el-input{
  width: 240px;
}
</style>
