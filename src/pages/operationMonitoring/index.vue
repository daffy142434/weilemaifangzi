<template lang="html">
  <div>
    <div class="page-title">
      模型运算监控
    </div>
    
    <div>
      <div class="item">
        <echarts ref="echart1" title="北美电商选品分析进程" :data="list1" :key="1"></echarts>
      </div>
      <div class="item">
        <echarts ref="echart2" title="亚洲电商选品分析进程" :data="list2" :key="2"></echarts>
      </div>
      <div class="item">
        <echarts ref="echart3" title="欧洲电商选品分析进程" :data="list3" :key="3"></echarts>
      </div>
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
      list1:[],
      list2:[],
      list3:[]
    }
  },
  components:{
    Echarts
  },
  mounted() {
    setInterval(()=>{
      this.getList();
    },3000)
    // this.getList();
  },
  methods: {
    getList(){
      service.getList().then(res=>{
        let data=res.data.data;
        
        let list1=[];
        let list2=[];
        let list3=[];
        list1.push(parseInt(data.productNumAs));
        list1.push(parseInt(data.speedAs));
        list1.push(parseInt(data.hitAs));
        list1.push(parseInt(data.hitAs2));
        list2.push(parseInt(data.productNumEu));
        list2.push(parseInt(data.speedEu));
        list2.push(parseInt(data.hitEu));
        list2.push(parseInt(data.hitEu2));
        list3.push(parseInt(data.productNumNa));
        list3.push(parseInt(data.speedNa));
        list3.push(parseInt(data.hitNa));
        list3.push(parseInt(data.hitNa2));
        this.list1=list1;
        this.list2=list2;
        this.list3=list3;
        this.$refs.echart1.handleRandom(this.list1);
        this.$refs.echart2.handleRandom(this.list2);
        this.$refs.echart3.handleRandom(this.list3);
      })
    }
    
  }
}
</script>

<style lang="less" scoped>
  .item{
    margin-top:-180px;
  }
</style>
