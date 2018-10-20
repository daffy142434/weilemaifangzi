<template lang="html">
  <div>
    <div class="page-title">
      商品迭代预测
    </div>
    <div class="search-bar">
      <el-form :inline="true" class="fl" label-width="100px">
        <el-form-item label="预测词">
            <el-select v-model="wordId" @change="handleChange">
                <el-option v-for="item in wordsList" :key="item.id" :label="item.keyWords" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      
    </div>
    <div>
      <el-row>
        <el-col :span="12" v-if="word1"><echarts ref="echart1" title="极大视角演变趋势" :subtext="word1" :data="data1" :indicator="indicator1" :legend="legend1"></echarts></el-col>
        <el-col :span="12" v-if="word2"><echarts ref="echart2" title="灵敏视角演变趋势" :subtext="word2" :data="data2" :indicator="indicator2" :legend="legend2"></echarts></el-col>
      </el-row>
    </div>
      
  </div>
</template>

<script>
import moment from 'moment';
import service from './services'
import Echarts from './components/echart'
const services =new service();
export default {
  
  data() {
    return {
      word1:"",
      indicator1:[],
      legend1:[],
      data1:[],
      word2:"",
      indicator2:[],
      legend2:[],
      data2:[],
      wordsList:[],
      wordId:""
    }
  },
  components:{
    Echarts
  },
  mounted() {
    this.getList();

  },
  methods: {
    getList(){
        services.getList().then(res=>{
            if(res.data.code==200){
                this.wordsList=res.data.data;
                this.wordId=this.wordsList[0].id;
                this.handleChange(this.wordsList[0].id);
            }
        })
    },
    handleChange(val){
        this.greatViewAngle(val);
        this.sensitiveViewAngle(val);
    },
    greatViewAngle(id){
        services.greatViewAngle({id:id}).then(res=>{
            if(res.data.code==200){
                
                let data=res.data.data;
                if(data&&data.length){
                    this.word1=data[0].keyWords;
                    let iterationList=data[0].iterationList;
                    this.legend1=[];
                    this.indicator1=[];
                    this.data1=[];
                    let max=0;
                    for(let i=0;i<iterationList.length;i++){
                        let createTime=moment(iterationList[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                        this.legend1.push(createTime);
                        let iterationResultMap=iterationList[i].iterationResultMap;
                        
                        let dataVal=[];
                        Object.keys(iterationResultMap).forEach((key,index)=>{
                            if(index<60){
                                let val=iterationResultMap[key];
                                if(i==0){
                                    this.indicator1.push({text: key, max: 0})
                                }
                                
                                dataVal.push(val);
                                if(val>max){
                                    max=val;  
                                } 
                                
                            }
                            
                        });
                        
                        this.data1.push({value:dataVal,name:createTime});
                    }
                    this.indicator1=this.indicator1.map(item=>{
                        item.max=max;
                        return item;
                    })
                    setTimeout(() => {
                        this.$refs.echart1.setOption();
                    }, 500);
                }else{
                    this.word1="";
                    this.legend1=[];
                    this.indicator1=[];
                    this.data1=[];
                }
                
                
            }
        })
    },
    sensitiveViewAngle(id){
        services.sensitiveViewAngle({id:id}).then(res=>{
             if(res.data.code==200){
                 let data=res.data.data;
                 let max=0;
                if(data&&data.length){
                    this.word2=data[0].keyWords;
                    let iterationList=data[0].iterationList;
                    this.legend2=[];
                    this.indicator2=[];
                    this.data2=[];
                    for(let i=0;i<iterationList.length;i++){
                        let createTime=moment(iterationList[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                        this.legend2.push(createTime);
                        let iterationResultMap=iterationList[i].iterationResultMap;
                        
                        let dataVal=[];
                        Object.keys(iterationResultMap).forEach((key,index)=>{
                            if(index<60){
                                let val=iterationResultMap[key];
                                if(i==0){
                                    this.indicator2.push({text: key, max: 0})
                                }
                                
                                dataVal.push(val);
                                if(val>max) max=val;
                            }
                            
                        });
                        
                        this.data2.push({value:dataVal,name:createTime});
                    }
                    this.indicator2=this.indicator2.map(item=>{
                        item.max=max;
                        return item;
                    })
                    setTimeout(() => {
                        this.$refs.echart2.setOption();
                    }, 500);
                }else{
                    this.word2="";
                    this.legend2=[];
                    this.indicator2=[];
                    this.data2=[];
                }
            }
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
