<template lang="html">
  <div class="new-paoduction-bar-index">
    <div class="page-title">
      定价模型
    </div>
      <div ref="chart" class="chart"></div>
      <div ref="chart1" class="chart"></div>
      <div ref="chart2" class="chart"></div>
      <div ref="chart3" class="chart"></div>
  </div>
</template>

<script>
import translate from 'lib/translate';
import NationalFlag from '@/components/national-flag';
import echarts from 'echarts/lib/echarts';
import ajax from '../../lib/ajax';
export default {
  data() {
  let option = {
    title: {
        text: '欧洲商品定价模型'
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return '成本价格: ' + parseInt(params.name).toFixed(2) + '<br>安全售价: ' + params.data;
        }
    },
    dataZoom: [{
        type: 'slider',
        start: 0,
        end: 15,
        z:10
    }],
    grid: {
        left: '3%',
        right: '10%',
        bottom: '9%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        name:"成本价格（CNY）",
        boundaryGap: false,
        data: (function(){
            let array=[];
            for(let i=1;i<=300;i++){
                array.push(i);
            }
            return array;
        })()
    },
    yAxis: {
        type: 'value',
        name:"安全售价（EUR）"
    },
    series: [
        {
            name:'',
            type:'line',
            data:[]
        }
    ]
};

    return {
      dialogVisible:false,
      option:option,
      chart:"",
      chart1:"",
      chart2:""
    }
  },
  components: {
    'national-flag': NationalFlag
  },
  beforeCreate() {
    
  },
  created() {
    
  },
  mounted(){
    
    this.chart=echarts.init(this.$refs.chart);
    this.chart.setOption(this.option);
    this.chart1=echarts.init(this.$refs.chart1);
    this.chart1.setOption(this.option);
    this.chart2=echarts.init(this.$refs.chart2);
    this.chart2.setOption(this.option);
     this.chart3=echarts.init(this.$refs.chart3);
    this.chart3.setOption(this.option);
    setTimeout(()=>{
      window.addEventListener("resize", this.chart.resize);
      window.addEventListener("resize", this.chart1.resize);
      window.addEventListener("resize", this.chart2.resize);
      window.addEventListener("resize", this.chart3.resize);
    })
    this.getData();

    
  },
  methods: {
    getData(){
        ajax.get("/oeration_monitoring/pricing_model").then(res=>{
            let data=res.data.data;
            let optionData=[];
            let optionData1=[];
            let optionData2=[];
            let optionData3=[];
            data.forEach(item => {
                optionData.push(item.salesAmountT1);
                optionData1.push(item.salesAmountT2);
                optionData2.push(item.salesAmountT3);
                optionData3.push(item.salesAmount);
            });
            this.option.series[0].data=optionData;
            this.chart.setOption(this.option);

            this.option.series[0].data=optionData1;
            this.option.title.text="北美商品定价模型";
            // this.option.xAxis.name="成本价格（USD）";
            this.option.yAxis.name="安全售价（USD）";
            this.chart1.setOption(this.option);
            this.option.series[0].data=optionData2;
            this.option.title.text="日本商品定价模型";
            this.option.yAxis.name="安全售价（JPY）";
            this.chart2.setOption(this.option);
            this.option.series[0].data=optionData3;
            this.option.yAxis.name="安全售价（GBP）";
            this.option.title.text="英国商品定价模型";
            this.chart3.setOption(this.option);
        })
    }
    
  }
}
</script>
<style scoped>
.chart{
  min-height: 600px;
}

</style>