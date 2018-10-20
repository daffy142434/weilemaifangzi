<template lang="html">
  <div class="workbench-index">
    <div class="workbench-top">
      <div class="workbench-top-left">
        <div class="workbench-title"><span>订单统计</span></div>
        
        <div class="workbench-top-right">
          <div class="workenbacn-top-right-content">
            <div class="workbench-tag-item-center"><span>订单统计</span></div>
            <div class="workbench-tag-item workbench-tag" @click="handleShowCustomerQuesitionDialog">
              <div class="email">
                <span class="name">待处理邮件</span>
                <span class="num">{{waitProcess}}</span>
              </div>
            </div>
            <div class="workbench-tag-item workbench-tag" @click="handleOnlineProductOutlier">
              <div class="product">
                <span class="name">异常商品数</span>
                <span class="num">{{onlineProductOutlier}}</span>
              </div>
            </div>
            <div class="workbench-tag-item workbench-tag" @click="handleShowAllProduct">
              <div class="outlier">
                <span class="name">所有商品数</span>
                <span class="num">{{totalProductNum}}</span>
              </div>
            </div>
            <div class="workbench-tag-item workbench-tag" @click="handleFbaList">
              
              <div class="warn">
                <span class="name">库存预警数</span>
                <span class="num">{{stockWarnProductNum}}</span>
              </div>
            </div>
          </div>
          
        </div>
        <div class="workbench-top-left-cont">
          <div class="workbench-round-item">
            <div class="workbench-num workbench-round-primary">
              <count-down :count="totalOrderNum"></count-down>
            </div>
            <em>所有订单</em>
          </div>

          <div class="workbench-round-item">
            <div class="workbench-num workbench-round-success">
              <count-down :count="waitProcessOrderNum"></count-down>
            </div>
            <em>等待中订单</em>
          </div>
          <div class="workbench-round-item">
            <div class="workbench-num workbench-round-warning">
              <count-down :count="waitShipOrderNum"></count-down>
            </div>
            <em>自发货待处理订单</em>
          </div>
          <div class="workbench-round-item ">
            <div class="workbench-num workbench-round-danger">
              <count-down :count="completeOrderNum"></count-down>
            </div>
            <em>已完成订单</em>
          </div>
        </div>
      </div>
      
    </div>
    <!-- <div class="workbench-split"></div> -->
    <div class="workbench-chart-list">
      <div class="workbench-chart-wrap">
        <div class="workbench-title"><span>店铺总数</span></div>
        <div class="workbench-round-item">
          <div class="workbench-num-top">
            <div class="left"></div>
            <div class="right"><span class="shop-color">{{shopSaleNum}}</span><span>/{{shopAllNum}}</span>家</div>
          </div>
          <div class="workbench-shop-rank">
            <el-radio-group v-model="currentShopMonth" size="mini" @change="handleShopMonthChange" class="month-change-shop">
              <el-radio-button v-for="month in monthList" :label="month.val" :key="month.val">{{month.name}}</el-radio-button>
            </el-radio-group>
            <div class="content">
              <div class="more-shop" @click="dialogVisibleShop=true">更多></div>
              <el-table
                :data="shopListTop"
                border
                style="width: 100%">
                <el-table-column
                  prop="rankindex"
                  label="排名"
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="shopName"
                  align="center"
                  label="店铺名">
                </el-table-column>
                <el-table-column
                  prop="sales"
                  align="center"
                  width="130"
                  label="销售额（CNY）">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- <div class="workbench-num-bottom">
            <div class="title"><i class="icon"></i>汇率转换</div>
            <ul>
              <li v-for="item in exchangeList">1{{item.originalCurrencyName}}（{{item.originalCurrency}}）={{item.cnyExchangeRate}}人民币</li>
            </ul>
          </div> -->
        </div>
      </div>
      <workbench-chart
        title="业绩销量（汇总人民币）"
        :load="loadActivementChart"
      ></workbench-chart>
    </div>
    <div class="workbench-chart-list">
      <workbench-chart
        title="三十天日均销售额（汇总人民币）"
        :load="loadPerformanceSalesBy30Day"
      ></workbench-chart>
      <workbench-chart
        title="三十天客单价（汇总人民币）"
        :load="loadCustomerUnitPriceBy30Day"
      ></workbench-chart>
    </div>
    <custome-quesition-dialog
      ref="customerQuesitionDialog"
      @onOpenFallbackDialog="handleOpenFallbackDialog"
      @notNeedReply="handleNotNeedReply"
      @showOrderDetail="handleShowOrderDetail"
    ></custome-quesition-dialog>
    <not-need-reply-dialog ref="notNeedReplyDialog" @setNotNeedReplySuccess="handleSetNotNeedReplySuccess"></not-need-reply-dialog>
    <fallback-dialog ref="fallbackDialog" onReply="handleReply"></fallback-dialog>
    <ama-online-product-outlier-dialog ref="amaOnlineProductOutlierDialog" @onAmaOnlineProductOutlierUpdate="loadData()">
    </ama-online-product-outlier-dialog>
    <all-product ref="allProduct"></all-product>
    <fba-list ref="fbaList" @showStockWarnDialog="handleShowStockWarnDialog"></fba-list>
    <stock-warn-dialog ref="stockWarnDialog" @setStockWarnSuccess="handleStockWarnSuccess"></stock-warn-dialog>
    <order-detail
      ref="orderDetail"
    ></order-detail>
    <div class="workbench-collect">
      <div class="workbench-title"><span>{{currentMonthName}}产品汇总</span></div>
      <div class="item-list">
        <el-radio-group v-model="productTab" size="mini" @change="handleChange">
          <el-radio-button v-for="stationCode in stationCodeList" :label="stationCode.val" :key="stationCode.val">{{stationCode.name}}</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="currentMonth" size="mini" @change="handleMonthChange" class="month-change">
          <el-radio-button v-for="month in monthList" :label="month.val" :key="month.val">{{month.name}}</el-radio-button>
        </el-radio-group>
        <el-row>
          <el-col :span="6">
            <div class="item">
              <div class="item-title first">{{currentMonthName}}销量最大的产品 <span class="more" @click="showMore(productData.rankQuantityList,1)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankQuantityList&&productData.rankQuantityList.length">
                <div v-for="(item,index) in productData.rankQuantityList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月销量</div>
                    <div class="right-bottom"><span>{{item.value}}</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div class="item-title second">{{currentMonthName}}销售金额最大的产品 <span class="more" @click="showMore(productData.rankAmoutList,2)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankAmoutList&&productData.rankAmoutList.length" >
                <div v-for="(item,index) in productData.rankAmoutList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月金额</div>
                    <div class="right-bottom"><span>{{item.value}}</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div class="item-title third">{{currentMonthName}}利润最高的产品 <span class="more" @click="showMore(productData.rankMaoriAmountList,3)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankMaoriAmountList&&productData.rankMaoriAmountList.length" >
                <div v-for="(item,index) in productData.rankMaoriAmountList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月利润</div>
                    <div class="right-bottom"><span>{{item.value}}</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div class="item-title third">{{currentMonthName}}增长最快的产品 <span class="more" @click="showMore(productData.rankIncreaseList,4)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankIncreaseList&&productData.rankIncreaseList.length" >
                <div  v-for="(item,index) in productData.rankIncreaseList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月增长</div>
                    <div class="right-bottom"><span>{{item.value}}%</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
            
          <el-col :span="6">
            <div class="item">
              <div class="item-title forth">{{currentMonthName}}退货排行 <span class="more" @click="showMore(productData.rankReturnQuantityList,5)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankReturnQuantityList&&productData.rankReturnQuantityList.length" >
                <div v-for="(item,index) in productData.rankReturnQuantityList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月退货数</div>
                    <div class="right-bottom"><span>{{item.value}}</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div class="item-title fifth">{{currentMonthName}}退货百分比排行 <span class="more" @click="showMore(productData.rankReturnPercentList,6)">更多 ></span></div>
              <div class="item-body" v-if="productData.rankReturnPercentList&&productData.rankReturnPercentList.length" >
                <div v-for="(item,index) in productData.rankReturnPercentList" :class="[index==0?'best':'better']" v-if="index<3">
                  <div class="left"><img src="../../img/diot.png" alt=""/><i></i> <div class="inner"><img :src="item.imageUrl" alt=""/></div></div>
                  <div class="right">
                    <div class="right-top">{{item.skuLocalName}}</div>
                    <div class="right-center">本月退货百分比</div>
                    <div class="right-bottom"><span>{{item.value+"%"}}</span></div>
                  </div>
                </div>
              </div>
              <div class="item-body" v-else>
                <div class="no-count">
                  <i></i>
                </div>
              </div>
            </div>
          </el-col>
          
        </el-row>
      </div>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="50%"
      >
      <div>
        <el-table
          :data="tableDataProducts"
          border
          style="width: 100%">
          <el-table-column
            prop="rankindex"
            width="80"
            align="center"
            label="排名">
          </el-table-column>
          <el-table-column
          align="center"
          width="120"
            label="图片">
            <template slot-scope="props">
              <img class="product-img" :src="props.row.imageUrl"/>
            </template>
          </el-table-column>
          <el-table-column
          align="center"
            prop="skuLocalName"
            label="本地SKU">
          </el-table-column>
          <el-table-column
            prop="value"
            align="center"
            width="120"
            :label="currentName">
            <template slot-scope="props">
              <div>
                <span v-if="currentName=='增长' || currentName=='退货百分比'">
                  {{props.row.value}}%
                </span>
                <span v-else>{{props.row.value}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="dialogVisibleShop"
      width="30%"
      >
      <div>
        <el-table
          :data="shopList"
          border
          style="width: 100%">
          <el-table-column
            prop="rankindex"
            label="排名"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="shopName"
            align="center"
            label="店铺名">
          </el-table-column>
          <el-table-column
            prop="sales"
            align="center"
            width="130"
            label="销售额（CNY）">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="less">
.product-img{
  width:50%;
}
.more-shop{
  float: right;
  margin-bottom: 3px;
  margin-top:-3px;
  font-size: 14px;
  color:#83c9fd;
  cursor: pointer;
}
.workbench-num-top{
  width: 50%;
  box-sizing: border-box;
  float: left;
  .left{
    width: 132px;
    height: 120px;
    background: url(../../img/workbench-business.png) no-repeat 0 0;
    background-size: 100%;
    display: inline-block;
    vertical-align: middle;
  }
  .right{
    vertical-align: middle;
    margin-left:20px;
    display:inline-block;
    font-size: 24px;
    color: #0d1836;
    span{
      font-size: 100px;
    }
  }
}
.workbench-shop-rank{
  position: relative;
  width: 50%;
  float:right;
  .content{
    padding-top:40px;
  }
  .month-change-shop{
    float:right;
    &::after{
      content:"";
      display: block;
      clear: both;
    }
  }
  
}
.workbench-num-bottom{
  width: 90%;
  border: 1px solid #0d1836;
  color:#0d1836;
  text-align: left;
  border-radius: 10px;
  padding: 5px 15px;
  .title{
    padding: 0 15px;
    i{
      display: inline-block;
      width: 25px;
      height: 25px;
      background: url(../../img/workbench-exhange.png) no-repeat 0 0;
      background-size: 100%;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  ul{
    border-top:1px solid #0d1836;
    border-left:1px solid #0d1836;
    margin-top: 5px;
    &::after{
      display: block;
      content: "";
      clear: both;
    }
    li{
      padding: 3px 10px;
      border-bottom: 1px solid #0d1836;
      border-right: 1px solid #0d1836;
      float:left;
      width: 50%;
      box-sizing: border-box;
      
    }

  }
}
.workbench-collect{
  padding:0 30px;
  margin-bottom: 50px;
}
.item-list{
  .item{
    color: #0d1836;
    position: relative;
    width:90%;
    margin:20px 0;
    .item-title{
      color: #fff;
      padding: 3px 10px;
      border-radius: 3px;
      &.first{
        background: #e52437;
      }
      &.second{
        background: #d38a2b;
      }
      &.third{
        background: #5db449;
      }
      &.forth{
        background: #4197d4;
      }
      &.fifth{
        background: #81c4df;
      }
      .more{
        float:right;
        &:hover{
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
    .item-body{
      .best{
        width: 100%;
        margin-top: 20px;
        .left{
          width: 45%;
          float: left;
          font-size: 35px;
          //min-height: 150px;
          //line-height: 150px;
          border:1px solid #0d1836;
          border-radius: 10px;
          box-sizing: border-box;
          text-align: center;
          position: relative;
          overflow: hidden;
          position: relative;
          .inner{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
          }
          img{
            width: 100%;
          }
          i{
            display: block;
            position: absolute;
            width: 30px;
            height: 30px;
            top:0;
            right:10px;
            background: url(../../img/workbench-champion.png) no-repeat 0 0;
            background-size:100%;
            z-index: 10;
          }
        }
        .right{
          width: 50%;
          float: right;
          font-size: 12px;
          // margin-top:40px;
          .right-top{
            background: #0d1836;
            color: #fff;
            padding: 2px 10px;
            border-radius: 2px;
            font-size: 16px;
          }
          .right-center{
            font-size:14px;
          }
          .right-bottom span{
            font-size:24px;
          }
        }
        &::after{
          display: block;
          content: "";
          clear: both;
        }
      }
      .better{
        width: 80%;
        margin-top: 20px;
        .left{
          width: 32%;
          float: left;
          //min-height:80px;
          //line-height: 80px;
          border:1px solid #0d1836;
          border-radius: 5px;
          box-sizing: border-box;
          text-align: center;
          overflow: hidden;
          position: relative;
          .inner{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
          }
          img{
            width: 100%;
          }
        }
        .right{
          width: 65%;
          float: right;
          font-size: 12px;
          .right-top{
            background: #0d1836;
            color: #fff;
            padding: 2px 10px;
            border-radius: 2px;
            font-size: 14px;
          }
          .right-center{
            font-size:14px;
          }
          .right-bottom span{
            font-size:24px;
          }
        }
        &::after{
          display: block;
          content: "";
          clear: both;
        }
      }
    }
  }
}
.no-count{
  position: relative;
  width: 100%;
  height: 100%;
  i{
    display: block;
    width: 250px;
    height: 250px;
    background: url(../../img/no-count.jpg) no-repeat 0 0;
    background-size: 100%;
    margin:50px auto;
  }
}
.month-change{
  float:right;
  margin-right: 40px;
}
.shop-color{
  color:green;
}
</style>
<script>
  import moment from 'moment';
  import CountDown from '@/components/countDown';
  import FallbackDialog from '@/pages/customerQuesition/components/fallbackDialog';
  import NotNeedReplyDialog from '@/pages/customerQuesition/components/notNeedReplyDialog';
  import StockWarnDialog from '@/pages/fbaList/components/stockWarnDialog';
  import AmaOnlineProductOutlierDialog from './components/ama-online-product-outlier-dialog';
  import OrderDetail from '@/pages/amaOrder/components/orderDetail';
  import LineChart from '@/components/chart/lineChart';
  import Workbench from './services';
  import CustomeQuesitionDialog from './components/customerQuesitionDialog';
  import AllProduct from './components/allProduct';
  import FbaList from './components/fbaList';
  import WorkbenchChart from './components/workbenchChart';
  import getChartDefaultOption from './lib/getChartDefaultOption';

  const workbench = new Workbench();

  export default {
    components: {
      'order-detail': OrderDetail,
      'custome-quesition-dialog': CustomeQuesitionDialog,
      'not-need-reply-dialog': NotNeedReplyDialog,
      'fallback-dialog': FallbackDialog,
      'ama-online-product-outlier-dialog': AmaOnlineProductOutlierDialog,
      'count-down': CountDown,
      'line-chart': LineChart,
      'all-product': AllProduct,
      'fba-list': FbaList,
      'workbench-chart': WorkbenchChart,
      'stock-warn-dialog': StockWarnDialog
    },
    data() {
      return {
        tableLoading: true,
        canApply: '-',
        waitProcess: '-',
        onlineProductOutlier: '-',
        shopNum: 0,
        totalOrderNum: 0,
        waitProcessOrderNum: 0,
        waitShipOrderNum: 0,
        completeOrderNum: 0,
        totalProductNum: 0,
        exceptionProductNum: 0,
        stockWarnProductNum: 0,
        tableData: [],
        visible: true,
        shopsOptions: {},
        actievementOptions: {},
        productOptions: {},
        exchangeList:[],
        productTab:"all",
        stationCodeList:[
          {name:"全部",val:"all"},
          {name:"英",val:"uk"},
          {name:"德",val:"de"},
          {name:"法",val:"fr"},
          {name:"意",val:"it"},
          {name:"西",val:"es"},
          {name:"美",val:"us"},
          {name:"加",val:"ca"},
          {name:"日",val:"jp"}
        ],
        monthList:[
        ],
        currentMonth:"",
        currentShopMonth:"",
        currentMonthName:"",
        productData:{},
        shopList:[],
        shopSaleNum:0,
        shopAllNum:0,
        dialogVisible:false,
        tableDataProducts:[],
        shopListTop:[],
        dialogVisibleShop:false,
        currentName:""
      }
    },
    created() {
      this.loadData();
      let exchange=sessionStorage.getItem('exchange');
      this.exchangeList=JSON.parse(exchange);
      

      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      let monthList=[];
      monthList.push({name:"本月",val:year+"-"+(month<10?'0'+month:month)});
      if(month==2){
        monthList.push({name:"1月",val:year+"-01"});
        monthList.push({name:"12月",val:(year-1)+"-12"});
      }else if(month==1){
        monthList.push({name:"12月",val:(year-1)+"-12"});
        monthList.push({name:"11月",val:(year-1)+"-11"});
      }else{
        monthList.push({name:(month-1)+"月",val:year+"-"+((month-1)<10?'0'+(month-1):(month-1))});
        monthList.push({name:(month-2)+"月",val:year+"-"+((month-2)<10?'0'+(month-2):(month-2))});
      }
      this.monthList=monthList;
      this.currentMonth=monthList[0].val;
      this.currentShopMonth=monthList[0].val;
      this.productSummary();
      this.getShopRank();

      this.getShopInfo();
    },
    watch:{
      currentMonth:function(newVal,old){
        this.monthList.forEach(item=>{
          if(item.val==newVal){
            this.currentMonthName=item.name;
          }
        })
      }
    },
    methods: {
      showMore(list,type){
        
        let currentName="销量";
        switch(type){
          case 1: currentName="销量"; break;
          case 2: currentName="金额";break;
          case 3: currentName="利润"; break;
          case 4: {
            currentName="增长";
            
            break;
          }
          case 5: currentName="退货数"; break;
          case 6:{
            currentName="退货百分比";
            
            break;
          } 
          
          
        }
        this.currentName=currentName;
        this.tableDataProducts=list;
        this.dialogVisible=true;
      },
      getShopInfo(){
        workbench.getShopInfo().then(res=>{
          let data=res.data.data;
          this.shopAllNum=data.shop_count_all;
          this.shopSaleNum=data.shop_count_open;
        })
      },
      getShopRank(){
        workbench.getShopRank({reportDate:this.currentShopMonth}).then(res=>{
          this.shopList=res.data.data;
          this.shopListTop=this.shopList.slice(0,4);
        });
      },
      handleMonthChange(val){
        this.currentMonth=val;
        this.productSummary();
      },
      handleShopMonthChange(val){
        this.currentShopMonth=val;
        this.getShopRank();
      },
      handleChange(val){
        this.productTab=val;
        this.productSummary();
      },
      productSummary(){
        workbench.productSummary({stationCode:this.productTab,reportDate:this.currentMonth}).then(res=>{
          this.productData=res.data.data;
        })
      },
      loadData() {
        Promise.all([
          workbench.getCustomerQuesitionStatistics(),
          workbench.getCount(),
        ]).then(([customerData, countData]) => {
          this.loadCustomerQuesition(customerData);
          this.loadCount(countData);
        });
      },
      loadCustomerQuesition({canApply, waitProcess, onlineProductOutlier}) {
        this.canApply = canApply;
        this.waitProcess = waitProcess;
        this.onlineProductOutlier = onlineProductOutlier;
      },
      getDays(year,month){
        month=month+1;
        if(month==12){
          month=0;
          year+=1;
        }
        return new Date(year,month,0).getDate();
      },
      loadActivementChart(stationCode) {
        return workbench.getPerformanceSales(stationCode).then((res) => {
          const data = res.data.data || [];
          const chartOption = getChartDefaultOption();
          let barData=[];
          data.map((item,index) => {
            if(new Date(item.date)>=new Date('2017-12')){
              let date = moment(item.date).format('MM');
              chartOption.xAxis[0].data.push(`${date.replace(/^0/, '')}月`);
              chartOption.series[0].data.push(item.salesAmount);
              if(index==data.length-1){
                barData.push(item.achievementPredict);
              }else{
                barData.push(null);
              }
            }
          });
          chartOption.series.push({
            data:barData,
            type:'bar',
            barWidth:"20",
            name:"预测本月销售额"
          });
          chartOption.series[0].lineStyle.normal.color = '#F7BA2A';
          chartOption.series[0].itemStyle.normal.color = '#F7BA2A';
          return chartOption;
        });
      },
      loadPerformanceSalesBy30Day(stationCode) {
        return workbench.getPerformanceSalesBy30Day(stationCode).then((res) => {
          const data = res.data.data || [];
          const chartOption = getChartDefaultOption();
          const amount = [];
          data.map((item) => {
            let date = moment(item.date).format('DD');
            chartOption.xAxis[0].data.push(`${date.replace(/^0/, '')}日`);
            chartOption.series[0].data.push(item.averageSales);
            amount.push(item.salesAmount);
          });
          chartOption.legend = {
            data: ['日均销售额', '实际销售额'],
            padding: [20, 0]
          };
          chartOption.series[0].lineStyle.normal.color = '#91c7ae';
          chartOption.series[0].itemStyle.normal.color = '#91c7ae';
          chartOption.series[0].name = '日均销售额';
          chartOption.series[1] = {
            name: '实际销售额',
            type: 'line',
            itemStyle: {
              normal: {}
            },
            lineStyle: {
              normal: {}
            },
            data: amount
          };
          return chartOption;
        });
      },
      loadCustomerUnitPriceBy30Day(stationCode) {
        return workbench.getCustomerUnitPriceBy30Day(stationCode).then((res) => {
          const data = res.data.data || [];
          const chartOption = getChartDefaultOption();
          data.map((item) => {
            let date = moment(item.date).format('DD');
            chartOption.xAxis[0].data.push(`${date.replace(/^0/, '')}日`);
            chartOption.series[0].data.push(item.averagePrice);
          });
          chartOption.series[0].lineStyle.normal.color = '#61a0a8';
          chartOption.series[0].itemStyle.normal.color = '#61a0a8';
          return chartOption;
        });
      },
      loadCount(res) {
        const data = res.data.data || {};
        this.shopNum = data.shopNum;
        this.totalOrderNum = data.totalOrderNum;
        this.waitProcessOrderNum = data.waitProcessOrderNum;
        this.waitShipOrderNum = data.waitShipOrderNum;
        this.completeOrderNum = data.completeOrderNum;
        this.totalProductNum = data.totalProductNum;
        this.exceptionProductNum = data.exceptionProductNum;
        this.stockWarnProductNum = data.stockWarnProductNum;
      },
      handleShowOrderDetail(data) {
        this.$refs.orderDetail.show(data.localOrderId, data);
      },
      handleShowCustomerQuesitionDialog() {
        this.$refs.customerQuesitionDialog.show();
      },
      handleOpenFallbackDialog(data) {
        this.$refs.fallbackDialog.show(data);
      },
      handleReply() {
        this.$refs.customerQuesitionDialog.loadData({});
      },
      handleNotNeedReply(data) {
        this.$refs.notNeedReplyDialog.show(data);
      },
      handleSetNotNeedReplySuccess() {
        this.$refs.customerQuesitionDialog.loadData({});
      },
      handleOnlineProductOutlier() {
        this.$refs.amaOnlineProductOutlierDialog.show();
        // this.$router.push({name: 'amaOnlineProductOutlier'});
      },
      handleShowStockWarnDialog(data) {
        this.$refs.stockWarnDialog.show(data);
      },
      handleStockWarnSuccess() {
        this.$refs.fbaList.onSearch();
      },
      handleShowAllProduct() {
        this.$refs.allProduct.show();
      },
      handleFbaList() {
        this.$refs.fbaList.show();
      },
      getDefaultOptions() {
        return {
          height: 200,
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : []
            }
          ],
          yAxis : [{type: 'value'}],
          series : [{
            type: 'line',
            itemStyle: {
              normal: {}
            },
            lineStyle: {
              normal: {}
            },
            data: []
          }]
        }
      }
    },
  }
</script>
<style lang="less">
.workbench-index{


  .workbench-title {
    font-size: 20px;
    border-bottom: #0d1836 2px solid;
    margin-bottom: 35px;
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-top-left-radius: 60px;
      border-bottom-right-radius: 60px;
      background: #0d1836;
      color: #fff;
      padding: 0 30px;
    }
  }
  .workbench-list {
    padding: 10px 30px;
    display: flex;
  }
  .workbench-top {
    display: flex;
    .workbench-top-left {
      width: 100%;
      box-sizing:border-box;
      padding: 0 30px;
      &-cont {
        width:50%;
        display:flex;
        box-sizing:border-box;
      }
    }
    .workbench-top-right {
      float:left;
      width:50%;
      box-sizing:border-box;
      padding-top: 10px;
      .workenbacn-top-right-content{
        position: relative;
        width:550px;
        margin:0 auto;
        display:flex;
        justify-content: space-between;
        flex-wrap:wrap;
        .workbench-tag-item-center{
          position: absolute;
          width:100px;
          height: 100px;
          line-height:100px;
          text-align:center;
          top:-3px;
          left: 34%;
          background:url(../../img/y-0.png) 0 0 no-repeat;
          background-size:100%;
        }
      }
      .workbench-tag-item {
        margin-bottom: 10px;
        cursor: pointer;
      }
      .workbench-tag{
        width:50%;
        color:#fff;
        >div{
          box-sizing:border-box;
          width:200px;
          height: 50px;
          line-height:35px;
          padding-left:20px;
        }
        .email{
          background:url(../../img/y-1.png) 0 0 no-repeat;
          background-size:100%;
        }
        .product{
          background:url(../../img/y-3.png) 0 0 no-repeat;
          background-size:100%;
          padding-left:70px;
        }
        .outlier{
          background:url(../../img/y-2.png) 0 0 no-repeat;
          background-size:100%;
          line-height:32px;
        }
        .warn{
          background:url(../../img/y-4.png) 0 0 no-repeat;
          background-size:100%;
          padding-left:70px;
          line-height:32px;
        }
      }
      
    }
  }
  .workbench-round-item {
    flex: 1;
    text-align: center;
    .workbench-num {
      cursor: pointer;
      width: 90px;
      height: 90px;
      line-height: 90px;
      border-radius: 50%;
      text-align: center;
      font-size: 18px;
      display: inline-block;
      &.workbench-round-primary {
        color:#83c9fd;
        background:url(../../img/workbench-q-1.png) 0 0 no-repeat;
        background-size:100%;
      }
      &.workbench-round-success {
        color:#76d6a1;
        background:url(../../img/workbench-q-2.png) 0 0 no-repeat;
        background-size:100%;
      }
      &.workbench-round-warning {
        color:#fdda86;
        background:url(../../img/workbench-q-3.png) 0 0 no-repeat;
        background-size:100%;
      }
      &.workbench-round-danger {
        color:#838282;
        background:url(../../img/workbench-q-4.png) 0 0 no-repeat;
        background-size:100%;
      }
    }
    em {
      font-style: normal;
      display: block;
      font-size:15px;
      margin-top: 5px;
    }
  }
  .workbench-split {
    background: #EEE;
    height: 1px;
    overflow: hidden;
    margin: 30px 0;
  }
  .workbench-chart-list {
    display: flex;
    .workbench-chart-wrap {
      flex: 1;
      padding: 0 30px;
      overflow: hidden;
      .chart {
        height: 300px;
      }
      .workbench-num {
        width: 200px;
        height: 200px;
        line-height: 200px;
        font-size: 72px;
        border-color: #4f6486;
        background: #344869;
        color: #fff;
      }
    }
  }
  .shop-count {
    font-size: 200px;
    text-align: center;
    color: #f35e5e;
    font-weight: 900;
    small {
      font-size: 72px;
      font-weight: 200;
    }
  }
  
}
.workbench-index{
  .el-radio-button__inner{
    color:#0d1836;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      color: #fff;
      background-color: #0d1836;
      border-color: #0d1836;
      -webkit-box-shadow: -1px 0 0 0 #0d1836;
      box-shadow: -1px 0 0 0 #0d1836;
  }
  .el-radio-button__inner:hover {
      color: #fff;
      background-color: #0d1836;
  }
}
</style>
