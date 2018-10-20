<template lang="html">
  <div class="product-ads-index">
    <div class="page-title">
      广告投放
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="店铺">
          <shop-select v-model="searchData.shopId"></shop-select>
        </el-form-item>
        <el-form-item label="公司">
          <company-select v-model="searchData.companyId"></company-select>
        </el-form-item>
        <el-form-item label="日期" style="width:400px;">
          <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="searchData.date"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <el-button size="small" type="primary" @click="handleUpload">上传文件</el-button>
    <div v-if="$store.state.powers.includes('shop_prduce_salse:list')" class="table-wrap">
      
      <el-table
        v-loading="loading"
        :data="data"
        border
        highlight-current-row
        style="width: 100%"
        ref="table"
        row-key="shopId"
        @expand-change="handleExpand"
      >
        <el-table-column type="expand" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">
          <template slot-scope="scope">
            <trend-chart
              @createTrend="handleCreateTrend"
              title="店铺产品实时销量"
              :loading="scope.row.loading"
              :data="scope.row.chartData"
              :transferData="scope.row"
            ></trend-chart>
          </template>
        </el-table-column>
        <el-table-column
          label="公司"
          prop="companyName"
        >
        </el-table-column>
        <el-table-column
          label="店铺"
          prop="shopName"
        >
        </el-table-column>
        <el-table-column
          label="当地日期"
        >
          <template slot-scope="scope">
            <span v-date="scope.row.createDate"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="展示量"
          prop="impressionsAmount"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="点击量"
          prop="clicksAmount"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="点击率"
          prop="ctrAmount"
          width="120"
        >
          <template slot-scope="props">
            <span v-percent="props.row.ctrAmount"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="花销"
          width="160"
        >
          <template slot-scope="scope">
            {{scope.row.spendAmount}} ({{scope.row.currency}})
          </template>
        </el-table-column>
        <el-table-column
          label="点击成本"
          width="120"
        >
          <template slot-scope="scope">
            {{scope.row.avgCpcAmount}} ({{scope.row.currency}})
          </template>
        </el-table-column>
        <el-table-column
          label="平均ACOS"
          width="120"
        >
          <template slot-scope="props">
            <span v-percent="props.row.avgAcos"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)" v-if="$store.state.powers.includes('shop_prduce_salse:show')">详情</el-button>
            <el-button type="text" @click="showTrend($event, scope.row)" v-if="$store.state.powers.includes('shop_prduce_salse:show_trend')">趋势</el-button>
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
    <product-ads-dialog ref="productAdsDialog"></product-ads-dialog>
    <el-dialog
      title="上传文件"
      :visible.sync="dialogVisible"
      width="50%">
      <div class="upload-tip">{{uploadTip}}</div>
      <el-upload
      ref="upload"
        :action="action"
        :disabled="disabled"
        :on-progress="handleProgress"
        multiple
        drag
        name="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :show-file-list="true"
        :before-upload="handleBeforUpload"
        :on-success="handleSuccess"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip" v-html="uploadResponse"></div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import ShopSelect from '@/components/shop-select';
import CompanySelect from '@/components/company-select';
import TrendChart from '@/components/chart/trendChart';
import ProductAds from './services';
import ProductAdsDialog from './components/productAdsDialog';
import listFormat from './lib/listFormat';

const productAds = new ProductAds();

let uploadAction;
if (process.env.NODE_ENV === 'development') {
  uploadAction = '/api/product_ads/import_ads_report';
} else {
  uploadAction = '/product_ads/import_ads_report';
}

export default {
  components: {
    'shop-select': ShopSelect,
    'company-select': CompanySelect,
    'product-ads-dialog': ProductAdsDialog,
    'trend-chart': TrendChart
  },
  data() {
    return {
      format: format,
      searchData: {
        shopId: '',
        companyId: '',
        sku: '',
        date: '',
        pageNumber: 1,
        pageSize: 10,
      },
      totalRecord: 0,
      loading: false,
      data: [],
      fileList:[],
      action:uploadAction,
      disabled:false,
      dialogVisible:false,
      uploadResponse:"",
      uploadTip:"",
      uploadData:{
        totalNum:0,
        successNum:0,
        failNum:0,
        updateFailNum:0,
        validateFailNum:0,
        shopFailNum:0,
        updateFailFile:[],
        validateFailFile:[],
        shopFailFile:[]
      },
      fileCount:0,
    }
  },
  created() {
    this.onSearch();
  },
  updated() {
  },
  methods: {
    handleUpload(){
      this.dialogVisible=true;
      if(!this.disabled){
        this.uploadResponse="";
        this.fileCount=0;
        this.uploadData={
          totalNum:0,
          successNum:0,
          failNum:0,
          updateFailNum:0,
          validateFailNum:0,
          shopFailNum:0,
          updateFailFile:[],
          validateFailFile:[],
          shopFailFile:[]
        };
        this.$refs.upload.clearFiles();
      }
      
    },
    handleSuccess(response, file, fileList){
      this.fileCount++;
      if(this.fileCount==fileList.length){
        this.disabled=false; 
        this.uploadTip="上传完成";    
      }
       
      if(response.code==200){
        let data=response.data;
        this.uploadData.totalNum+=data.totalNum;
        this.uploadData.successNum+=data.successNum;
        this.uploadData.failNum+=data.failNum;
        this.uploadData.updateFailNum+=data.updateFailNum;
        this.uploadData.validateFailNum+=data.validateFailNum;
        this.uploadData.shopFailNum+=data.shopFailNum;
        this.uploadData.updateFailFile.push.apply(this.uploadData.updateFailFile,data.updateFailFile);
        this.uploadData.validateFailFile.push.apply(this.uploadData.validateFailFile,data.validateFailFile);
        this.uploadData.shopFailFile.push.apply(this.uploadData.shopFailFile,data.shopFailFile);

        this.uploadResponse="<div>总文件数："+this.uploadData.totalNum+"; 成功文件数："+this.uploadData.successNum+"; 失败文件数："+this.uploadData.failNum+";</div>";
        if(this.uploadData.updateFailFile&&this.uploadData.updateFailFile.length){
          let updateFailFiles="";
          this.uploadData.updateFailFile.forEach((item,index)=>{
            if(index==this.uploadData.updateFailFile.length-1){
              updateFailFiles+=item+";";
            }else{
              updateFailFiles+=item+", ";
            }
          })
          if(updateFailFiles){
            this.uploadResponse+="<div> 文件上传失败文件数："+this.uploadData.updateFailNum+"; 文件上传失败文件名称："+updateFailFiles+"</div>";
          }
        }
        
        if(this.uploadData.validateFailFile&&this.uploadData.validateFailFile.length){
          let validateFailFiles="";
          this.uploadData.validateFailFile.forEach((item,index)=>{
            if(index==this.uploadData.validateFailFile.length-1){
              validateFailFiles+=item+";";
            }else{
              validateFailFiles+=item+", ";
            }
          })
          if(validateFailFiles){
            this.uploadResponse+="<div> 文件校验失败数："+this.uploadData.validateFailNum+"; 文件校验失败文件名称："+validateFailFiles+"</div>";
          }
        }
        
        if(this.uploadData.shopFailFile&&this.uploadData.shopFailFile.length){
          let shopFailFiles="";
          this.uploadData.shopFailFile.forEach((item,index)=>{
            if(index==this.uploadData.shopFailFile.length-1){
              shopFailFiles+=item+";";
            }else{
              shopFailFiles+=item+", ";
            }
          })
          if(shopFailFiles){
            this.uploadResponse+="<div> 没有对应店铺失败文件数："+this.uploadData.shopFailNum+"; 没有对应店铺失败文件名称："+shopFailFiles+"</div>";
          }
        }
        
      }
    },
    handleBeforUpload(file){
      this.disabled=true;
      this.uploadTip="上传中...";
    },
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleProgress(event, file, fileList){
    },
    handleReset() {
      this.searchData = {
        shopId: '',
        companyId: '',
        sku: '',
        date: '',
        pageNumber: 1,
        pageSize: 10,
      };
      //this.onSearch();
    },
    beforeSearch(){
      this.searchData.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.loading = true;

      productAds.getList(this.searchData).then((res) => {
        const data = res.data.data.data || [];
        this.data = listFormat(data).map((d, index) => {
          d.loading = false;
          d.isLoad = false;
          d.chartData = [];
          return d;
        });
        this.totalRecord = res.data.data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleExpand(row, isExpand) {
      if (!isExpand) {
        return;
      }
      const newData = this.data.filter((d) => {
        if (d.id === row.id) {
          d.loading = true;
        }
        return d;
      });
      this['data'] = newData;
    },
    handleCreateTrend({transferData, vm}) {
      if (vm.loading) {
        return;
      }
      vm.loading = true;
      const {id, shopId, createDate} = transferData;
      this.loadingTrend(id, shopId, createDate, vm);
    },
    loadingTrend(id, shopId, createDate, chartVM) {
      productAds.getShopAdsTrend(shopId, format.toDate(createDate)).then((res) => {
        let chartData;
        const newData = this.data.map((d) => {
          if (id === d.id) {
            chartData = this.getChartData(res.data.data || []);
            d.chartData = chartData;
          }
          return d;
        });
        if (chartData) {
          setTimeout(() => {
            chartVM.render(chartData);
          });
        }
        this.data = newData;
        chartVM.loading = false;
      }).catch(() => {
        chartVM.loading = false;
      });
    },
    hideLoading() {
      const newData = this.data.map((d) => {
        d.loading = false;
        return d;
      });
      this.data = newData;
    },
    getChartDefaultData() {
      return {
        xAxis: [],
        data:[
          {
            yAxis: {
              name: '花销',
              type: 'value',
            },
            lists: [
              {
                name: '花销',
                type: 'line',
                data: []
              }
            ]
          },
          {
            yAxis: {
              name: '平均ACOS',
              type: 'value',
            },
            lists: [
              {
                name: '平均ACOS',
                type: 'line',
                data: []
              }
            ]
          },
        ]
      };
    },
    getChartData(data) {
      const chartData = this.getChartDefaultData();
      data.map((d) => {
        chartData.data[0].lists[0].data.push(d.spendAmount);
        chartData.data[1].lists[0].data.push(d.avgAcos);
        chartData.xAxis.push(format.toDate(d.createDate));
      });
      return chartData;
    },
    showDetail(rowData) {
      this.$refs.productAdsDialog.show(rowData);
    },
    showTrend(e, rowData) {
      let td;

      td = e.target;
      while(td.tagName !== 'TD') {
        td = td.parentNode;
      }
      const firstTd = td.parentNode.children[0];
      firstTd.children[0].children[0].click();
    }
  }
}
</script>

<style lang="less">
.trend-chart {
  width: 800px;
  height: 300px;
  .chart {
    height: 300px;
  }
}
.product-ads-index{
  .el-upload{
    position: relative;
    width: 100%;
  }
  .el-upload-dragger,.el-upload-list{
      width: 80%;
      margin:0 auto;
    }
  .el-upload__tip{
    width: 80%;
    margin:0 auto;
    color:#F56C6C;
  }
}
</style>
<style scoped>
.table-wrap{
  margin-top:10px;
}
.upload-tip{
  line-height: 2;
  text-align: center;
  color:#409EFF;
  font-weight: bold;
}
</style>
