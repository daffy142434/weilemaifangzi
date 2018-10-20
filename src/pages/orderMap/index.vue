<template lang="html">
  <div>
    <div class="page-title">
      订单地图
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="本地SKU">
              <el-input v-model="searchData.localSku" placeholder="请输入本地SKU" :disabled="searchData.amazonSku?true:false"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="亚马逊SKU">
              <el-input v-model="searchData.amazonSku" placeholder="请输入亚马逊SKU" :disabled="searchData.localSku?true:false"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="月份">
              <el-date-picker
                v-model="month"
                type="month"
                format="yyyy-MM"
                value-format="yyyy-MM"
                placeholder="请输入月份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="fr">
              <el-button type="text" @click="handleReset">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>
<script>
  import OrderMap from './services';
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/scatter';
  import 'echarts/lib/chart/parallel';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/map/js/world.js';

  const orderMap = new OrderMap();

  export default {
    data() {
      return {
        searchData:{
          localSku:"",
          amazonSku:"",
          month:""
        },
        month:"",
        mapData:[],
        rawData:[],
        parallelAxis:[],
        geoCoordMap:{
          "Amsterdam": [4.895168,52.370216],
          "Athens": [-83.357567,33.951935],
          "Auckland": [174.763332,-36.84846],
          "Bangkok": [100.501765,13.756331],
          "Barcelona": [2.173403,41.385064],
          "Beijing": [116.407395,39.904211],
          "Berlin": [13.404954,52.520007],
          "Bogotá": [-74.072092,4.710989],
          "Bratislava": [17.107748,48.148596],
          "Brussels": [4.35171,50.85034],
          "Budapest": [19.040235,47.497912],
          "Buenos Aires": [-58.381559,-34.603684],
          "Bucharest": [26.102538,44.426767],
          "Caracas": [-66.903606,10.480594],
          "Chicago": [-87.629798,41.878114],
          "Delhi": [77.209021,28.613939],
          "Doha": [51.53104,25.285447],
          "Dubai": [55.270783,25.204849],
          "Dublin": [-6.26031,53.349805],
          "Frankfurt": [8.682127,50.110922],
          "Geneva": [6.143158,46.204391],
          "Helsinki": [24.938379,60.169856],
          "Hong Kong": [114.109497,22.396428],
          "Istanbul": [28.978359,41.008238],
          "Jakarta": [106.845599,-6.208763],
          "Johannesburg": [28.047305,-26.204103],
          "Cairo": [31.235712,30.04442],
          "Kiev": [30.5234,50.4501],
          "Copenhagen": [12.568337,55.676097],
          "Kuala Lumpur": [101.686855,3.139003],
          "Lima": [-77.042793,-12.046374],
          "Lisbon": [-9.139337,38.722252],
          "Ljubljana": [14.505751,46.056947],
          "London": [-0.127758,51.507351],
          "Los Angeles": [-118.243685,34.052234],
          "Luxembourg": [6.129583,49.815273],
          "Lyon": [4.835659,45.764043],
          "Madrid": [-3.70379,40.416775],
          "Milan": [9.185924,45.465422],
          "Manama": [50.58605,26.228516],
          "Manila": [120.984219,14.599512],
          "Mexico City": [-99.133208,19.432608],
          "Miami": [-80.19179,25.76168],
          "Montreal": [-73.567256,45.501689],
          "Moscow": [37.6173,55.755826],
          "Mumbai": [72.877656,19.075984],
          "Munich": [11.581981,48.135125],
          "Nairobi": [36.821946,-1.292066],
          "New York": [-74.005941,40.712784],
          "Nicosia": [33.382276,35.185566],
          "Oslo": [10.752245,59.913869],
          "Paris": [2.352222,48.856614],
          "Prague": [14.4378,50.075538],
          "Riga": [24.105186,56.949649],
          "Rio de Janeiro": [-43.172896,-22.906847],
          "Rome": [12.496366,41.902783],
          "Santiago de Chile": [-70.669265,-33.44889],
          "São Paulo": [-46.633309,-23.55052],
          "Seoul": [126.977969,37.566535],
          "Shanghai": [121.473701,31.230416],
          "Singapore": [103.819836,1.352083],
          "Sofia": [23.321868,42.697708],
          "Stockholm": [18.068581,59.329323],
          "Sydney": [151.209296,-33.86882],
          "Taipei": [121.565418,25.032969],
          "Tallinn": [24.753575,59.436961],
          "Tel Aviv": [34.781768,32.0853],
          "Tokyo": [139.691706,35.689487],
          "Toronto": [-79.383184,43.653226],
          "Vilnius": [25.279651,54.687156],
          "Warsaw": [21.012229,52.229676],
          "Vienna": [16.373819,48.208174],
          "Zurich": [8.541694,47.376887]
        },
        schema:[
          "Cities",
          "Gross purchasing power",
          "Net purchasing power",
          "Prices (excl. rent)",
          "Prices (incl. rent)",
          "Gross wages",
          "Net wages",
          "Working time [hours per year]",
          "Vacation [paid working days per year]",
          "Time required for 1 Big Mac [minutes]",
          "Time required for 1 kg of bread [minutes]",
          "Time required for 1 kg of rice [minutes]",
          "Time required for 1 iPhone 4S, 16 GB [hours]",
          "City break",
          "Inflation 2006",
          "Inflation 2007",
          "Inflation 2008",
          "Inflation 2009",
          "Inflation 2010",
          "Inflation 2011",
          "Prices (incl. rent)",
          "Food basket",
          "Services",
          "Normal local rent medium [USD per month]",
          "Household appliances",
          "Bus or tram or underground",
          "Train",
          "Taxi  [USD per 5 km trip]",
          "Medium-sized cars price",
          "Medium-sized cars tax",
          "Medium-sized cars gas",
          "Restaurant [USD per dinner]",
          "Hotel *** [USD per night]",
          "Hotel ***** [USD per night]",
          "Women's medium clothing",
          "Men's medium clothing",
          "Furnished medium 4-room apartment [USD per month]",
          "Unfurnished medium 3-room apartment [USD per month]",
          "Net hourly wages [USD per hour]",
          "Gross hourly wages [USD per hour]",
          "Taxes and social security contributions",
          "Primary school teacher [USD per year]",
          "Bus driver [USD per year]",
          "Automobile mechanic [USD per year]",
          "Building labourer [USD per year]",
          "Skilled industrial worker [USD per year]",
          "Cook [USD per year]",
          "Departement head [USD per year]",
          "Product manager [USD per year]",
          "Engineer [USD per year]",
          "Bank credit clerk [USD per year]",
          "Secretary [USD per year]",
          "Saleswoman [USD per year]",
          "Female industrial worker [USD per year]",
          "Female call center worker [USD per year]",
          "Financial analyst [USD per year]",
          "Financial analyst [USD pro Jahr]"
        ],
        option:"",
        chart:""
      }
    },
    computed: {
      
    },
    watch:{
      month:function(newVal,old){
        this.searchData.month= newVal.split("-").join("");
      }
    },
    beforeCreate(){
      
    },
    created() {
      this.option={
          backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.4, [{
              offset: 0,
              color: '#4b5769'
          }, {
              offset: 1,
              color: '#404a59'
          }]),
          title: {
              text: '订单地图',
              subtext: '',
              sublink: '',
              left: 'center',
              top: 5,
              itemGap: 0,
              textStyle: {
                  color: '#eee'
              },
              z: 200
          },
          tooltip: {
              trigger: 'item',
              formatter: function (params) {                  
                  return params.data.name+'<br/>'+'订单数量:'+params.data.value[3];
              }
          },
          toolbox: {
              show: true,
              left: 'right',
              iconStyle: {
                  normal: {
                      borderColor: '#ddd'
                  }
              },
              feature: {
              },
              z: 202
          },
          brush: {
              geoIndex: 0,
              brushLink: 'all',
              inBrush: {
                  opacity: 1,
                  symbolSize: 14
              },
              outOfBrush: {
                  color: '#000',
                  opacity: 0.2
              },
              z: 10
          },
          geo: {
              map: 'world',
              silent: true,
              label: {
                  emphasis: {
                      show: false,
                      areaColor: '#eee'
                  }
              },
              itemStyle: {
                  normal: {
                      borderWidth: 0.2,
                      borderColor: '#404a59'
                  }
              },
              left: '6%',
              top: 40,
              bottom: '54%',
              right: '14%',
              roam: true
              // itemStyle: {
              //     normal: {
              //         areaColor: '#323c48',
              //         borderColor: '#111'
              //     },
              //     emphasis: {
              //         areaColor: '#2a333d'
              //     }
              // }
          },
          parallelAxis: [],
          grid: [{
              show: true,
              left: 0,
              right: 0,
              top: '48%',
              bottom: 0,
              borderColor: 'transparent',
              backgroundColor: '#404a59',
              z: 99
          }, {
              show: true,
              left: 0,
              right: 0,
              top: 0,
              height: 28,
              borderColor: 'transparent',
              backgroundColor: '#404a59',
              z: 199
          }],
          parallel: {
              top: '50%',
              left: 60,
              right: 20,
              bottom: 100,
              axisExpandable: true,
              axisExpandCenter: 15,
              axisExpandCount: 10,
              axisExpandWidth: 60,
              axisExpandTriggerOn: 'mousemove',

              z: 100,
              parallelAxisDefault: {
                  type: 'value',
                  nameLocation: 'start',
                  nameRotate: 25,
                  // nameLocation: 'end',
                  nameTextStyle: {
                      fontSize: 12
                  },
                  nameTruncate: {
                      maxWidth: 170
                  },
                  nameGap: 20,
                  splitNumber: 3,
                  tooltip: {
                      show: true
                  },
                  axisLine: {
                      // show: false,
                      lineStyle: {
                          width: 1,
                          color: 'rgba(255,255,255,0.3)'
                      }
                  },
                  axisTick: {
                      show: false
                  },
                  splitLine: {
                      show: false
                  },
                  z: 100
              }
          },
          series: [
              {
                  name: '订单地图',
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  symbolSize: 8,
                  data: [],
                  activeOpacity: 1,
                  label: {
                      normal: {
                          formatter: '{b}',
                          position: 'right',
                          show: false
                      },
                      emphasis: {
                          show: true
                      }
                  },
                  symbolSize: 10,
                  itemStyle: {
                      normal: {
                          borderColor: '#fff',
                          color: '#577ceb',
                      }
                  }
              },
              {
                  name: 'parallel',
                  type: 'parallel',
                  smooth: true,
                  lineStyle: {
                      normal: {
                          color: '#577ceb',
                          width: 0.5,
                          opacity: 0.6
                      }
                  },
                  z: 100,
                  blendMode: 'lighter',
                  data: []
              }
          ]
      }
    },
    mounted(){
      this.chart=echarts.init(this.$refs.chart);
      this.onSearch();
      
    },
    methods: {
      handleReset(){
        this.searchData={
          localSku:"",
          amazonSku:"",
          month:""
        }
        this.month="";
      },
      onSearch(){
        orderMap.orderMap(this.searchData).then(res=>{
          let data=res.data.data;
          if(data&&data.length){
            this.option.parallelAxis=[{dim:1,name:"销售数量"},{dim:2,name:"订单数量"}];
            for(let i=0;i<data.length;i++){
              let currentData=data[i];
              if(currentData.coord!='N/A'){
                let coord=JSON.parse(currentData.coord);
                let rawObjectData=[currentData.city,currentData.goodsSellTotal,currentData.orderTotal];
                let mapObjectData={
                  name:currentData.city,
                  value:[coord[0],coord[1],currentData.goodsSellTotal,currentData.orderTotal]
                }
                this.option.series[1].data.push(rawObjectData);
                this.option.series[0].data.push(mapObjectData);
              }
              
            }
            this.chart.setOption(this.option);
            window.addEventListener("resize", this.chart.resize);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .chart{
    min-height: 800px;
  }
</style>
