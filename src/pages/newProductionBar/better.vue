<template lang="html">
  <div class="new-paoduction-bar-index">
    <div class="page-title">
      潜力预测
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" class="fl" label-width="100px">
        <el-form-item label="国家">
          <constries-select v-model="searchData.country"></constries-select>
        </el-form-item>
        <el-form-item label="产品类目">
          <el-select v-model="searchData.category" placeholder="请选择类目" >
            <el-option
              v-for="item in categoryList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="form-timerange"
          label='发现时间段'
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
        <el-form-item label="价格区间">
          <el-input placeholder="" v-model="searchData.salePriceStart" type="number" class="input-area"></el-input>
          <span>-</span>
          <el-input v-model="searchData.salePriceEnd" placeholder="" type="number" class="input-area"></el-input>
        </el-form-item>
        <el-form-item label="星级区间">
          <el-input placeholder="" v-model="searchData.productStarStart" type="number" class="input-area"></el-input>
          <span>-</span>
          <el-input v-model="searchData.productStarEnd" placeholder="" type="number" class="input-area"></el-input>
        </el-form-item>
        <el-form-item label="评论数区间">
          <el-input placeholder="" v-model="searchData.reviewCountStart" type="number" class="input-area"></el-input>
          <span>-</span>
          <el-input v-model="searchData.reviewCountEnd" placeholder="" type="number" class="input-area"></el-input>
        </el-form-item>
        <div class="fr">
          <el-button type="text" @click="handleReset">重置</el-button>
          <el-button type="primary" icon="el-icon-search" @click="getTableData">查询</el-button>
        </div>
      </el-form>
    </div>
    <div ref="chart" class="chart"></div>
    <el-table
      class="table"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        align="center"
        label="Asin">
        <template slot-scope="props">
          <div>
            <div><img class="main-img" :src="props.row.imgUrl" alt=""/></div>
            <div><a class="url-asin" :href="props.row.productUrl" target="_blank">{{props.row.asin}}</a></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="排名">
        <template slot-scope="props">
          <div>
            <div class="check" @click="check(props.row)">{{props.row.ranking}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
      width="100"
        label="价格">
        <template slot-scope="props">
          <div>{{props.row.salePrice}}</div>
        </template>
      </el-table-column>
      <el-table-column
      width="100"
        label="性能">
        <template slot-scope="props">
          <div>星级：{{props.row.star}}</div>
          <div>评论数：{{props.row.reviewCount}}</div>
          <div>卖家数：{{props.row.countSeller}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="类目">
        <template slot-scope="props">
          <div><national-flag :stationCode="props.row.country"></national-flag></div>
          <div>{{props.row.productCategory}}</div>
          <div>{{props.row.productBrand}}</div>
        </template>
      </el-table-column>
      
      <!-- <el-table-column
        prop=""
        label="发现时间">
      </el-table-column> -->
      <el-table-column
        min-width="150"
        label="标题">
        <template slot-scope="props">
          <div class="translate" @mouseenter="handleTranslate(props.row)" @mouseleave="handleLeave(props.row)">{{props.row.title}}</div>
        </template>
      </el-table-column>
      
    </el-table>
    <el-dialog
      title="数据详情"
      :visible.sync="dialogVisible"
      width="80%">
      <div>
        <div ref="chartLine" class="chart-line"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import translate from 'lib/translate';
import NationalFlag from '@/components/national-flag';
import echarts from 'echarts/lib/echarts';
import ajax from '../../lib/ajax';
import ContriesSelect from '@/components/contries-select';
export default {
  data() {
      let option = {
        title: {
            text: '潜力预测',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [],
        },
        dataZoom: [{
            type: 'slider',
            start: 0,
            end: 30,
            z:10
        }],
        grid: {
            left: '2%',
            right: '2%',
            bottom: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                rotate: 60
            },
        },
        yAxis: {
            type: 'value',            
        },
        series: [
            
        ]
    };
    return {
      dialogVisible:false,
      searchData:{
        country:"us",
        salePriceStart:"",
        salePriceEnd:"",
        productStarStart:"",
        productStarEnd:"",
        reviewCountStart:"",
        reviewCountEnd:"",
        createTimeStart:"",
        createTimeEnd:"",
        category:"",
      },
      chart:"",
      chartLine:"",
      tableData:[],
      option:option,
      category:"",
      categoryList:[],
      batchData:[],
      seriesData:[],
      data:[],
      dataIndex:[],
      asinData:[],
      translateData:{},
      time:"",
      optionLine:{
          tooltip: {
              trigger: 'item'
          },
          legend: {
              data:['排名','价格','星级','评论数','卖家数']
          },
          grid: {
              left: '100',
              right: '200',
              bottom: '20',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              data: [],
              name:"批次"
          },
          yAxis: [{
              type: 'value',
              name:"排名",
              axisLine: {
                lineStyle: {
                  color: "#c23632"
                }
              }
            },
            {
                type: 'value',
                name: '价格',
                position: 'left',
                offset: 80,
                axisLine: {
                  lineStyle: {
                    color: "#415562"
                  }
                }
            },
            {
                type: 'value',
                name: '星级',
                position: 'right',
                offset: 0,
                axisLine: {
                  lineStyle: {
                    color: "#61a0a8"
                  }
                }
            },
            {
                type: 'value',
                name: '评论数',
                position: 'right',
                offset: 80,
                axisLine: {
                  lineStyle: {
                    color: "#d79079"
                  }
                }
            },
            {
                type: 'value',
                name: '卖家数',
                position: 'right',
                offset: 160,
                axisLine: {
                  lineStyle: {
                    color: "#91c7ae"
                  }
                }
            },
          ],
          series: [{
              data: [],
              type: 'line',
              name:'排名',
          },
          {
              data: [],
              type: 'line',
              name:'价格',
              yAxisIndex: 1,
              
          },
          {
              data: [],
              type: 'line',
              name:'星级',
              yAxisIndex: 2,
          },
          {
              data: [],
              type: 'line',
              name:'评论数',
              yAxisIndex: 3,
          },
          {
              data: [],
              type: 'line',
              name:'卖家数',
              yAxisIndex: 4,
          }]
      }
    }
  },
  components: {
    'national-flag': NationalFlag,
    'constries-select':ContriesSelect
  },
  beforeCreate() {
    
  },
  created() {
    this.getCategory();
  },
  mounted(){
    
    this.chart=echarts.init(this.$refs.chart);
    this.chart.setOption(this.option);
    setTimeout(()=>{
      window.addEventListener("resize", this.chart.resize);
    })
    
    this.chart.on("click",param=>{
      let asin=param.name;
      let batch=param.seriesName;
      for(let i=0;i<this.dataIndex.length;i++){
        if(this.dataIndex[i].batch==batch&&this.dataIndex[i].asin==asin){
          this.tableData=[this.dataIndex[i]];
        }
      }
    });
    
  },
  methods: {
    check(row){
      this.dialogVisible=true;
      let xdata=[];
      let sdataRanking=[];
      let sdataPrice=[];
      let sdataStar=[];
      let sdataReview=[];
      let sdataSeller=[];
      if(row.releasesExcellents){
        row.releasesExcellents.forEach(item => {
          xdata.push(item.batch+"");
          sdataRanking.push(item.ranking);
          sdataPrice.push(item.salePrice);
          sdataStar.push(item.productStar);
          sdataReview.push(item.reviewCount);
          sdataSeller.push(item.countSeller);
        });
      }
      
      this.optionLine.xAxis.data=xdata;
      this.optionLine.series[0].data=sdataRanking;
      this.optionLine.series[1].data=sdataPrice;
      this.optionLine.series[2].data=sdataStar;
      this.optionLine.series[3].data=sdataReview;
      this.optionLine.series[4].data=sdataSeller;
      
      this.$nextTick(()=>{
        this.chartLine=echarts.init(this.$refs.chartLine);
        this.chartLine.setOption(this.optionLine);
      })
      

    },
    handleDaterangeChange(val){
      if(!val){
        this.searchData.createTimeStart="";
        this.searchData.createTimeEnd="";
      }else{
        this.searchData.createTimeStart=val[0];
        this.searchData.createTimeEnd=val[1];
      }
    },
    handleReset(){
      this.searchData={
        country:"us",
        salePriceStart:"",
        salePriceEnd:"",
        productStarStart:"",
        productStarEnd:"",
        reviewCountStart:"",
        reviewCountEnd:"",
        createTimeStart:"",
        createTimeEnd:"",
        category:"",
      }
      this.time="";
    },
    
    getTableData(){
      if(!this.searchData.country){
        this.$message({
          message: '必须选择国家',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.salePriceStart)<0){
        this.$message({
          message: '价格不能小于0',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.salePriceStart)>parseInt(this.searchData.salePriceEnd)){
        this.$message({
          message: '价格区间不正确',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.productStarStart)<0){
        this.$message({
          message: '星级不能小于0',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.productStarStart)>parseInt(this.searchData.productStarEnd)){
        this.$message({
          message: '星级区间不正确',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.reviewCountStart)<0){
        this.$message({
          message: '评论数不能小于0',
          type: 'warning'
        });
        return;
      }
      if(parseInt(this.searchData.reviewCountStart)>parseInt(this.searchData.reviewCountEnd)){
        this.$message({
          message: '评论数区间不正确',
          type: 'warning'
        });
        return;
      }
      ajax.post("/product_appraisal/category_appraisal_excellent",this.searchData).then(res=>{
        if(res.data.code==200){
          this.batchData=[];
          this.asinData=[];
          this.seriesData=[];
          this.data=res.data.data;
          let series=[{name:"",type:"bar",barMaxWidth:"20",data:[]}];
          let tabledata=[];
          
          if(this.data&&this.data.length){
            for(let i=0;i<this.data.length;i++){
              this.asinData.push(this.data[i].asin);
              let list=this.data[i].releasesExcellents;
              this.batchData.push(this.data[i].batch+"");
              
              tabledata.push(this.data[i]);
              this.dataIndex.push(this.data[i]);//每个柱子的数据
              if(i==0){
                series[0].name=this.data[i].batch;
              }
              // series[0].data.push(this.data[i].ranking);
              if(list&&list.length){
                for(let j=0;j<list.length;j++){
                  this.batchData.push(list[j].batch+"");
                  if(series[j+1]==undefined){
                    series[j+1]={name:"",type:"bar",barMaxWidth:"20",data:[]};
                  }
                  if(!series[j+1].name) series[j+1].name=list[j].batch;
                  series[j+1].data.push(list[j].ranking);

                  // tabledata.push(list[j]);
                  let obj=JSON.parse(JSON.stringify(list[j]));//为每个asin添加变化数据
                  obj.releasesExcellents=list;
                  this.dataIndex.push(obj);
                }
              }
              
            }
          }else{
            this.tableData=[];
          }
          
          // this.dataIndex=this.tableData;
          this.option.legend.data=this.batchData;
          this.option.xAxis.data=this.asinData;
          this.option.series=series;
          this.chart.setOption(this.option);
          tabledata.forEach(item=>{
            if(item.salePrice&&item.ranking){
              item.state=0;
              item.oldTitle=item.title;
              item.newTitle=item.title;
              this.tableData.push(item);
            }
          });
          
        }
      })
    },
    handleTranslate(row){
      if(row.state==0){
        if(row.title){
          translate(row.title,'en','zh', (result)=> {
            row.title=result;
            row.newTitle=result;
            row.state=1;
          });
        }
      }else{
        row.title=row.newTitle;
      }
    },
    handleLeave(row){
      row.title=row.oldTitle;
    },
    getCategory(){
      ajax.get("/product_appraisal/category_list").then(res=>{
        if(res.data.code==200){
          let data=res.data.data;
          data.forEach(item=>{
            this.categoryList.push(item.startCategory);
          })
          if(this.categoryList.length){
            this.searchData.category=this.categoryList[0];
            this.getTableData();
          }
          
        }
      })
    }
  }
}
</script>
<style scoped>
.chart{
  min-height: 600px;
}
.inline-input{
  float: left;
}
.main-img{
  position: relative;
  width: 60px;
  height: 60px;
}
.url-asin{
  text-decoration: none;
}
.table{
  margin-top:20px;
  margin-bottom: 50px;
}
.translate{
  padding:10px 0;
}

.multi-row-search .el-form-item{
  width:400px;
}
.multi-row-search .form-timerange{
  width:500px;
}
.check{
  color:#3a8ee6;
  cursor:pointer;
}
.chart-line{
  min-height:400px;
}
</style>
<style>
.new-paoduction-bar-index .search-bar .el-input{
  width:295px;
}
.new-paoduction-bar-index .search-bar .input-area{
  width:140px;
}
</style>