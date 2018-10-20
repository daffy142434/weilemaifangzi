<template lang="html">
  <div>
    <div class="page-title">
      商品迭代预测
    </div>
    
    <div>
      
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="wireless doorbell" :data="chartList[7].dataList" :indicator="chartList[7].indicatorList"></echarts></el-col>
        <el-col :span="12"><echarts ref="echart1" title="灵敏视角演变趋势" subtext="wireless doorbell" :data="chartList[8].dataList" :indicator="chartList[8].indicatorList"></echarts></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="Pet Carrier" :data="chartList[6].dataList" :indicator="chartList[6].indicatorList"></echarts></el-col>
        <el-col :span="12"><echarts ref="echart1" title="灵敏视角演变趋势" subtext="Pet Carrier" :data="chartList[5].dataList" :indicator="chartList[5].indicatorList"></echarts></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="Pet Water Fountain" :data="chartList[4].dataList" :indicator="chartList[4].indicatorList"></echarts></el-col>
        <el-col :span="12"><echarts ref="echart1" title="灵敏视角演变趋势" subtext="Pet Water Fountain" :data="chartList[0].dataList" :indicator="chartList[0].indicatorList"></echarts></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="External CD Drive" :data="chartList[9].dataList" :indicator="chartList[9].indicatorList"></echarts></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="Monocular Telescope" :data="chartList[1].dataList" :indicator="chartList[1].indicatorList"></echarts></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="Smart Table Lamp" :data="chartList[2].dataList" :indicator="chartList[2].indicatorList"></echarts></el-col>
        <el-col :span="12"></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><echarts ref="echart1" title="极大视角演变趋势" subtext="outdoor smart plug" :data="chartList[3].dataList" :indicator="chartList[3].indicatorList"></echarts></el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </div>
      
  </div>
</template>

<script>
import Echarts from './components/echart'
import Service from './services';

const service = new Service();
export default {
  
  data() {
    return {
        chartData:{},
        chartList:[]
    }
  },
  components:{
    Echarts
  },
  mounted() {
    this.getList()

  },
  methods: {
    getList(){
        service.getList().then(res=>{
            let data=res.data.data;
            let indexList=[];
            for(let item in data){
                let itemObj={};
                itemObj.name=item;
                
                let dataList=[];
                let indicatorList=[];
                
                let nameData=data[item];
                
                Object.keys(nameData).forEach((nameItem,index)=>{
                    let dataListObj={};
                    
                    dataListObj.name=nameItem;
                    let dataObjValue=[];
                    let valueDataList=nameData[nameItem];
                    for(let j=0;j<valueDataList.length;j++){
                        dataObjValue.push(parseInt(valueDataList[j].value));//valueDataItem.value  
                        if(index==0){
                            let indicatorListObj={};
                            indicatorListObj.text=valueDataList[j].text;//valueDataItem.text
                            indicatorListObj.max=valueDataList[j].max;
                            indicatorList.push(indicatorListObj);//chart indicator
                        } 
                    }
                    
                    dataList.push({name:nameItem,value:dataObjValue});//chart data
                })
                itemObj.dataList=dataList;
                itemObj.indicatorList=indicatorList;
                indexList.push(itemObj);//list
            }
            this.chartList=indexList;
            
        })
    }
    
  }
}
</script>

<style lang="less" scoped>
  .item{
    width: 1000px;
    margin:0 auto;
  }
</style>
