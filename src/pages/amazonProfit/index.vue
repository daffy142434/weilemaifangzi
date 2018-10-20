<template lang="html">
  <div class="amazon-profit-index">
    <div class="page-title">
      亚马逊商品利润
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" :model="searchData" label-width="200px;">
        <el-form-item label="在线SKU">
          <el-input placeholder="在线SKU" v-model="searchData.onlineSku"></el-input>
        </el-form-item>
        <el-form-item label="本地SKU">
          <el-input placeholder="本地SKU" v-model="searchData.relationSku"></el-input>
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
            v-model="searchData.reportDate"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="export" >
      <el-button type="primary" size="small" @click="exportData">导出近一年的数据<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
      >
        <el-table-column
          label="店铺名"
          prop="shopName"
        >
        </el-table-column>
        <el-table-column
          label="当地月份"
          prop="reportDate"
        >
        </el-table-column>
        <el-table-column
          label="在线SKU"
          prop="onlineProductSku"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="本地SKU"
          prop="relationSku"
          width="210"
        >
        </el-table-column>
        <el-table-column
          label="毛利和毛利率(粗算)"
          width="145"
        >
          <template slot-scope="props">
            <div>
              {{props.row.maoriAmount || 0}}
            </div>
            <div>
              {{props.row.maoriRate | percent}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售额"
          label-class-name="sale-class-title"
        >
          <template slot-scope="props">
            <div>{{props.row.salesAmount || 0}}</div>
          </template>
        </el-table-column>
        
        <el-table-column
          label="退货金额"
        >
          <template slot-scope="props">
            {{props.row.returnAmount || 0}}
          </template>
        </el-table-column>
        <el-table-column
          label="货物成本"
        >
          <template slot-scope="props">
            {{props.row.costAmount || 0}}
          </template>
        </el-table-column>
        <el-table-column
          label="流转成本"
        >
          <template slot-scope="props">
            {{props.row.shippingAmount || 0}}
          </template>
        </el-table-column>
        <el-table-column
          label="初期成本"
        >
          <template slot-scope="props">
            {{props.row.brushesAmount || 0}}
          </template>
        </el-table-column>
        <el-table-column
          label="参考广告成本"
          class-name="amount-class"
          label-class-name="amount-class-title"
        >
          <template slot-scope="props">
            {{props.row.advertisementCost || 0}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[ 50, 100]"
          :page-size="searchData.pageSize"
          :current-page.sync="searchData.pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
      <el-tooltip ref="toolTip" class="tooltip tooltip-wrap" effect="dark" content="已扣除佣金及FBA费用" placement="top">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
    
  </div>
</template>

<script>
import ajax from '../../lib/ajax';
export default {
  data() {
    const getDate=function(){
      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      return year+"-"+(month>9?month:("0"+month));
    }
    return {
      visible: false,
      tableLoading:false,
      searchData:{
        onlineSku:"",
        relationSku:"",
        reportDate:getDate(),
        pageNumber:1,
        pageSize:50
      },
      totalRecord:0,
      tableData:[
        
      ],
    }
  },
  filters: {
    percent: function (value) {
      if (!value) return "--"
      return (value*100).toFixed(2)+"%"
    }
  },
  beforeCreate() {
    
  },
  created() {
    this.onSearch();
  },
  mounted(){
    this.$nextTick(()=>{
      document.getElementsByClassName("sale-class-title")[1].appendChild(document.getElementsByClassName("tooltip-wrap")[0]);
    })
    
  },
  methods: {
    exportData(){
      window.open("/data_analysis/export_product_profit");
    },
    handleReset(){
      this.searchData={onlineSku:"",
        relationSku:"",
        reportDate:"",
        pageNumber:1,
        pageSize:10}
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch(){
      let params=this.searchData;
      ajax.post("/data_analysis/product_profit",params).then(response=>{
        if(response.data.code==200){
          this.tableData=response.data.data.data;
          this.totalRecord=response.data.data.totalRecord;
        }
      })
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
  }
}
</script>

<style lang="less">
.amazon-profit-index{
  .amount-class{
    background: #b5c1f9;
  }
  .amount-class-title{
    background: #5370fb;
    color: #fff;
  }
  
} 
</style>
<style scoped>
.export{
  margin-bottom: 10px;
}
.table-wrapper{
  position: relative;
}
.tooltip{
  margin-left:5px;
}
</style>