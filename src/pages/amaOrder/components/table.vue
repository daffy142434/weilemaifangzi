<template lang="html">
  <el-table
  v-loading="allTableLoading"
  ref="allTable"
  :data="tableData"
  border
  highlight-current-row
  style="width: 100%">
  <el-table-column
    type="index"
    width="40">
  </el-table-column>
  <el-table-column
    label="下单时间"
    width="220">
    <template slot-scope="scope">
      <div><national-flag :stationCode="scope.row.stationCode" :key="scope.row.id" class="national-flag"></national-flag> {{scope.row.shopName}}</div>
      <div><span v-datetime="scope.row.orderCreateDateTz"></span> (当地)</div>
      <div><span v-datetime="scope.row.orderCreateDateLocal"></span> (北京)</div>
    </template>
  </el-table-column>
  <el-table-column
    prop="amaOrderId"
    label="订单号"
    align="center"
    width="220">
    <template slot-scope="scope">
      <div>
        
        <div>
        <el-popover
          ref="popover1"
          placement="top-start"
          title="订单备注"
          width="650"
          border
          trigger="hover">
          <el-table :data="scope.row.remarkList">
            <el-table-column width="150" property="creator" label="记录人"></el-table-column>
            <el-table-column property="remarkContent" label="备注内容"></el-table-column>
            <el-table-column width="170" property="createTime" label="创建时间" :formatter="format.toDateTime"></el-table-column>
          </el-table>
        </el-popover>
          <el-button v-if="$store.state.powers.includes('order:ama_all_show')" @click="handleShowOrderDetail(scope.row)" type="text"  v-popover:popover1><span :class="{'click-farming-order': !!scope.row.clickFarmingFlag}">{{scope.row.amaOrderId}}</span></el-button>
          <el-button v-else type="text"  v-popover:popover1>{{scope.row.amaOrderId}}</el-button>
        </div>
        <div>
          <el-tag size="small" type="danger" v-if="scope.row.orderStatus==32||scope.row.orderStatus==51||scope.row.orderStatus==52||scope.row.orderStatus==53">{{format.formatAmaOrderStatus(scope.row.orderStatus)}}</el-tag>
          <el-tag size="small" v-else>{{format.formatAmaOrderStatus(scope.row.orderStatus)}}</el-tag>
        </div>
        <div v-if="scope.row.fbaFlag==1" class="fba-tag"><el-tag size="small" type="success">FBA商品</el-tag></div>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    prop="orderAmount"
    label="总价"
    width="100">
  </el-table-column>
  
  <el-table-column
    label="详情">
    <template slot-scope="scope">
      <ul>
        <li v-for="item in scope.productList">
          <div>{{item.title}}</div>
          <div>
            <span>数量：{{item.quantity}}</span>
            <span>ASIN：{{item.amaAsin}}</span>
            <span>SKU：{{item.sellerSku}}</span>
          </div>
        </li>
      </ul>
    </template>
  </el-table-column>
  <el-table-column
    width="350"
    label="买家信息">
    <template slot-scope="scope">
      <div>{{scope.row.buyerName}}</div>
      <div>{{scope.row.buyerEmail}}</div>
    </template>
  </el-table-column>
    
  <el-table-column
    label="操作"
    fixed="right"
    width="90">
    <template slot-scope="scope">
      <div>
      <el-button v-if="$store.state.powers.includes('order:ama_wait_check_remark_add')" type="text" size="small" @click="dialogTitle = '添加备注';dialogVisible = true;remarkForm.orderId = scope.row.id;remarkForm.remarkList = scope.row.remarkList;">添加备注</el-button>
      <set-click-framing-flag
        v-if="$store.state.powers.includes('order:ama_all_click_farming_add')"
        :order="scope.row"
        @onClickFraming="handleClickFarming"
      ></set-click-framing-flag></div>
    </template>
  </el-table-column>
</el-table>
<div class="pagination-bar">
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :page-sizes="[10, 25, 50, 100]"
    :page-size="allTablePageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="allTableTotalRecord">
  </el-pagination>
</div>
</template>

<script>
import format from '@/lib/format';
import AsinLink from '@/components/asin-link';


export default {
  props: ['tableData'],
  data() {
    return {
      allTableLoading:false,
    }
  },
  methods: {
    
  }
}
</script>

