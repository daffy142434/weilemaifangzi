<template lang="html">
  <div>
    <div class="page-title">
      亚马逊订单
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="80" class="fl">
        <el-form-item label="店铺名称">
          <el-select v-model="searchData.shopId">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option :label="shop.shopName" :value="shop.id" v-for="shop in shops" :key="shop.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchData.amaOrderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchData.orderStatus" placeholder="请选择">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="(name, code) in orderStatusForSelect"
              :key="code"
              :label="name"
              :value="code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU"></el-input>
        </el-form-item>
        <el-form-item label="FBA">
          <el-select v-model="searchData.fbaFlag">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
          <!-- <el-checkbox label="是否FBA" name="type" v-model="searchData.fbaFlag" true-label="1" false-label="0"></el-checkbox> -->
        </el-form-item>
        <el-form-item label="买家姓名">
          <el-input v-model="searchData.buyerName" placeholder="买家姓名"></el-input>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="searchData.receiverName" placeholder="收件人姓名"></el-input>
        </el-form-item>
        <el-form-item label="是否红单">
          <el-select v-model="searchData.clickFarmingFlag">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题订单">
          <el-select v-model="searchData.orderExceptionStatus">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="买家邮箱">
          <el-input v-model="searchData.buyerEmail" placeholder="买家邮箱"></el-input>
        </el-form-item>
        <el-form-item label="北京时间" class="order-greenwich-time">
          <el-date-picker type="daterange" v-model="daterange" @change="handleDaterangeChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="当地时间" class="order-greenwich-time">
          <el-date-picker type="daterange" v-model="daterangeLocal" @change="handleDaterangeLocalChange"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button v-if="activeTabName=='all' && $store.state.powers.includes('order:ama_all_export')" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出</el-button>
      <el-button v-if="activeTabName=='waitCheck' && $store.state.powers.includes('order:ama_wait_check_export')" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出</el-button>
      <el-button v-if="activeTabName=='waitSend' && $store.state.powers.includes('order:ama_wait_ship_export')" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出</el-button>
      <el-button v-if="activeTabName=='complete' && $store.state.powers.includes('order:ama_compelete_export')" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出</el-button>
      <el-button
        v-if="activeTabName=='waitSend' && $store.state.powers.includes('order:ama_cancel')"
        :disabled="cancelOrders.length <= 0"
        type="success" icon="el-icon-plus" size="small"
        @click="cancelOrderDialogVisible = true;
        cancelOrderDialogTitle='取消订单'">取消订单(请勾选订单)
      </el-button>
      <el-button
        v-if="activeTabName=='complete' && $store.state.powers.includes('order:ama_refund')"
        :disabled="refundOrders.length <= 0"
        type="success" icon="el-icon-plus" size="small"
        @click="refundOrderDialogVisible = true;">订单退款(请勾选订单)
      </el-button>
    </div>
    <el-tabs
      ref="tabs"
      :active-name="activeTabName"
      type="border-card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane name="all" label="全部" v-if="$store.state.powers.includes('order:ama_all_show')">
        <el-table
          v-loading="allTableLoading"
          ref="allTable"
          :data="allTableData"
          @filter-change="handleFilterChange"
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
            show-overflow-tooltip
            label="详情">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item,index) in scope.row.productList" class="product-item">
                  <div class="line" v-if="index>0"></div>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <div class="title">{{item.title}}</div>
                  </el-tooltip>
                  <div class="info">
                    <div class="info-item"><span>数量：</span>{{item.quantity}}</div>
                    <div class="info-item"><span>ASIN：</span><asin-link :asin="item.amaAsin" :stationCode="scope.row.stationCode"></asin-link></div>
                    <div class="info-item"><span>SKU：</span>{{item.sellerSku}}</div>
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
                :key="scope.row.id"
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
            :current-page.sync="pageNumber"
            :total="allTableTotalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane name="waitCheck" v-if="$store.state.powers.includes('order:ama_wait_check_list')" label="已付款">
        <el-table
          v-loading="waitCheckTableLoading"
          ref="waitCheckTable"
          :data="waitCheckTableData"
          @filter-change="handleFilterChange"
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column
            type="index"
            width="60">
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
          show-overflow-tooltip
            label="详情">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item,index) in scope.row.productList" class="product-item">
                  <div class="line" v-if="index>0"></div>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <div class="title">{{item.title}}</div>
                  </el-tooltip>
                  <div class="info">
                    <div class="info-item"><span>数量：</span>{{item.quantity}}</div>
                    <div class="info-item"><span>ASIN：</span><asin-link :asin="item.amaAsin" :stationCode="scope.row.stationCode"></asin-link></div>
                    <div class="info-item"><span>SKU：</span>{{item.sellerSku}}</div>
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
            :page-size="waitCheckTablePageSize"
            :current-page.sync="pageNumber2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="waitCheckTableTotalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane name="waitSend" v-if="$store.state.powers.includes('order:ama_wait_ship_list')" label="待自发货">
        <el-table
          v-loading="waitSendTableLoading"
          ref="waitSendTable"
          :data="waitSendTableData"
          @filter-change="handleFilterChange"
          @select="handleWaitSendTableSelect"
          @select-all="handleWaitSendTableSelect"
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            type="index"
            width="60">
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
          show-overflow-tooltip
            label="详情">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item,index) in scope.row.productList" class="product-item">
                  <div class="line" v-if="index>0"></div>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <div class="title">{{item.title}}</div>
                  </el-tooltip>
                  <div class="info">
                    <div class="info-item"><span>数量：</span>{{item.quantity}}</div>
                    <div class="info-item"><span>ASIN：</span><asin-link :asin="item.amaAsin" :stationCode="scope.row.stationCode"></asin-link></div>
                    <div class="info-item"><span>SKU：</span>{{item.sellerSku}}</div>
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
            :page-size="waitSendTablePageSize"
            :current-page.sync="pageNumber3"
            layout="total, sizes, prev, pager, next, jumper"
            :total="waitSendTableTotalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane name="complete" v-if="$store.state.powers.includes('order:ama_compelete_list')" label="已完成">
        <el-table
          v-loading="completeTableLoading"
          ref="completeTable"
          :data="completeTableData"
          @filter-change="handleFilterChange"
          @select="handleCompleteTableSelect"
          @select-all="handleCompleteTableSelect"
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            type="index"
            width="60">
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
          show-overflow-tooltip
            label="详情">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item,index) in scope.row.productList" class="product-item">
                  <div class="line" v-if="index>0"></div>
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                    <div class="title">{{item.title}}</div>
                  </el-tooltip>
                  <div class="info">
                    <div class="info-item"><span>数量：</span>{{item.quantity}}</div>
                    <div class="info-item"><span>ASIN：</span><asin-link :asin="item.amaAsin" :stationCode="scope.row.stationCode"></asin-link></div>
                    <div class="info-item"><span>SKU：</span>{{item.sellerSku}}</div>
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
            :page-size="completeTablePageSize"
            :current-page.sync="pageNumber4"
            layout="total, sizes, prev, pager, next, jumper"
            :total="completeTableTotalRecord">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onRemarkDialogClose()">
      <el-form ref="remarkForm" :rules="remarkFormRules" :model="remarkForm" label-position="top" label-width="80px">
        <el-form-item label="备注记录">
          <template>
            <el-table
              :data="remarkForm.remarkList"
              border
              style="width: 100%;">
              <el-table-column
                prop="creator"
                label="记录人"
                width="150">
              </el-table-column>
              <el-table-column
                prop="remarkContent"
                label="备注内容">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                :formatter="format.toDateTime"
                width="170">
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="remarkContent">
          <el-input type="textarea" v-model="remarkForm.remarkContent" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRemarkDialogSubmit()">确定</el-button>

      </div>
    </el-dialog>

    <el-dialog :title="cancelOrderDialogTitle" :visible.sync="cancelOrderDialogVisible" @close="onCancelOrderDialogClose()">
      <el-form ref="cancelOrderForm" :rules="cancelOrderFormRules" :model="cancelOrderForm" label-position="top" label-width="80px">
        <el-form-item label="原因" prop="cancelReason">
          <el-input type="textarea" v-model="cancelOrderForm.cancelReason" placeholder="原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" v-if="cancelOrderDialogTitle=='取消订单'" type="primary" @click="onCancelOrderDialogSubmit()">确定</el-button>
        <el-button :loading="dialogLoading" v-if="cancelOrderDialogTitle=='取消商品'" type="primary" @click="onCancelProductDialogSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="refundOrderDialogTitle" :visible.sync="refundOrderDialogVisible" @close="onRefundOrderDialogClose()">
      <el-form ref="refundOrderForm" :rules="refundOrderFormRules" :model="refundOrderForm" label-position="top" label-width="80px">
        <el-form-item label="原因" prop="refundReason">
          <el-select v-model="refundOrderForm.refundReason" filterable placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="val in refundReasons"
              :key="val"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundOrderDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onRefundOrderDialogSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="refundProductDialogTitle" width="90%" :visible.sync="refundProductDialogVisible" @close="onRefundProductDialogClose()">
      <el-form ref="refundProductForm" :rules="refundProductFormRules" :model="refundProductForm" label-position="top" label-width="80px">
        <el-form-item label="原因" prop="refundReason">
          <el-select v-model="refundProductForm.refundReason" filterable placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="val in refundReasons"
              :key="val"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-table :data="refundProducts">
            <el-table-column property="title" label="商品名称"></el-table-column>
            <el-table-column width="150" property="sellerSku" label="SKU"></el-table-column>
            <el-table-column width="150" property="refundAmount" label="退款金额">
              <template slot-scope="scope">
              <el-input v-model="refundProductForm.refundAmount" placeholder="退款金额"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundProductDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onRefundProductDialogSubmit()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="batchDialogTitle" :visible.sync="batchDialogVisible">
      <el-alert
        :closable="false"
        style="margin-bottom: 15px;font-size: 18px;"
        title="警告"
        type="warning"
        :description="batchForm.errorMsg"
        show-icon>
      </el-alert>
      <el-form ref="batchForm" label-position="top" label-width="80px">
        <el-form-item label="错误信息">
          <template>
            <el-table
              :data="batchForm.errorList"
              border
              style="width: 100%;">
              <el-table-column
                prop="orderNo"
                label="订单号"
                width="200">
              </el-table-column>
              <el-table-column
                prop="errorReson"
                :show-overflow-tooltip="showOverflowTooltip"
                label="失败原因">
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDialogVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <order-detail
      ref="orderDetail"
      @onCancelProduct="handleCancelProduct"
      @onRefundProduct="handleRefundProduct"
    ></order-detail>
  </div>
</template>
<script>
import queryString from 'query-string';
import moment from 'moment';
import extend from 'extend';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import events from '@/lib/events';
import SetClickFarmingFlag from './components/setClickFarmingFlag';
import OrderDetail from './components/orderDetail';
import NationalFlag from '@/components/national-flag';

const tablesSearchData = {
  waitCheck: {
    sku: '',
    shopId: '',
    orderStatus: '',
    amaOrderId: '',
    createStartDate: '',
    createEndDate: '',
    fbaFlag: '',
    buyerName: '',
    receiverName: '',
    exceptionReturnFlag: '',
  },
  waitSend: {
    sku: '',
    shopId: '',
    orderStatus: '',
    amaOrderId: '',
    createStartDate: '',
    createEndDate: '',
    fbaFlag: '',
    buyerName: '',
    receiverName: '',
    exceptionReturnFlag: '',
  },
  complete: {
    sku: '',
    shopId: '',
    orderStatus: '',
    amaOrderId: '',
    createStartDate: '',
    createEndDate: '',
    fbaFlag: '',
    buyerName: '',
    receiverName: '',
    exceptionReturnFlag: '',
  },
  all: {
    sku: '',
    shopId: '',
    orderStatus: '',
    amaOrderId: '',
    createStartDate: '',
    createEndDate: '',
    fbaFlag: '',
    buyerName: '',
    receiverName: '',
    exceptionReturnFlag: '',
  },
};

export default {
  components: {
    'set-click-framing-flag': SetClickFarmingFlag,
    'order-detail': OrderDetail,
    'national-flag':NationalFlag
  },
  data() {
    let activeTabName;
    const powers = this.$store.state.powers;
    const searchData = this.$route.params.searchData || {};
    activeTabName = 'all';
    return {
      format: format,
      // 根据这个值进行tab切换
      activeTabName,
      waitCheckTableTotalRecord: 0,
      waitSendTableTotalRecord: 0,
      completeTableTotalRecord: 0,
      allTableTotalRecord: 0,
      waitCheckTablePageSize: 10,
      waitSendTablePageSize: 10,
      completeTablePageSize: 10,
      allTablePageSize: 10,
      waitCheckTableLoading: false,
      waitSendTableLoading: false,
      completeTableLoading: false,
      allTableLoading: false,
      waitCheckTableData: [],
      waitSendTableData: [],
      completeTableData: [],
      allTableData: [],

      showOverflowTooltip: true,
      daterange: '',
      daterangeLocal:'',
      orderDetailForm: {},

      cancelOrders: [],

      refundOrders: [],
      refundProducts: [],

      dialogLoading: false,
      dialogVisible: false,
      dialogTitle: '添加备注',

      cancelOrderDialogVisible: false,
      cancelOrderDialogTitle: '取消订单',

      refundOrderDialogVisible: false,
      refundOrderDialogTitle: '订单退款',

      refundProductDialogVisible: false,
      refundProductDialogTitle: '商品退款',

      batchDialogTitle: '部分失败',
      batchDialogVisible: false,

      orderDetailDialogVisible: false,

      shops: [],
      orderStatusForSelect: {
        "10": "已支付未授权",
        "11": "已支付无需配送"
      },
      defaultTreeProps: {
        children: 'childPermList',
        label: 'permissionName'
      },
      searchData: {
        sku: '',
        shopId: '',
        orderStatus: '',
        amaOrderId: '',
        createStartDate: '',
        createEndDate: '',
        createStartDateTz: '',
        createEndDateTz: '',
        fbaFlag: '',
        buyerName: '',
        receiverName: '',
        clickFarmingFlag: '',
        exceptionReturnFlag: '',
        buyerEmail:"",
        ...searchData,
      },
      pageNumber:1,
      pageNumber2:1,
      pageNumber3:1,
      pageNumber4:1,
      remarkFormRules: {
        remarkContent: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 200,
          message: '备注长度在 1 到 200 个字符',
          trigger: 'blur'
        }],
      },
      remarkForm: {
        orderId: '',
        remarkList: [],
        remarkContent: '',
      },

      cancelOrderFormRules: {
        cancelReason: [{
          required: false,
          min: 1,
          max: 200,
          message: '原因长度在 1 到 200 个字符',
          trigger: 'blur'
        }],
      },
      cancelOrderForm: {
        orderId: '',
        cancelReason: '',
      },

      refundReasons: [
        "NoInventory",
        "CustomerReturn",
        "GeneralAdjustment",
        "CouldNotShip",
        "DifferentItem",
        "Abandoned",
        "CustomerCancel",
        "PriceError",
        "ProductOutofStock",
        "CustomerAddressIncorrect",
        "Exchange",
        "Other",
        "CarrierCreditDecision",
        "RiskAssessmentInformationNotValid",
        "CarrierCoverageFailure",
        "TransactionRecord",
        "Undeliverable",
        "RefusedDelivery",
      ],
      refundOrderFormRules: {
        refundReason: [{
          required: false,
          min: 1,
          max: 200,
          message: '原因长度在 1 到 200 个字符',
          trigger: 'blur'
        }],
      },
      refundOrderForm: {
        orderId: '',
        refundReason: '',
      },

      refundProductFormRules: {
        refundReason: [{
          required: false,
          min: 1,
          max: 200,
          message: '原因长度在 1 到 200 个字符',
          trigger: 'blur'
        }],
      },
      refundProductForm: {
        orderId: '',
        refundReason: '',
        prdId: '',
        refundAmount: '',
      },

      batchForm: {
        errorMsg: '',
        errorList: [],
      }
    }
  },
  beforeCreate(){
    ajax.post('/shops/list_all')
    .then((response) => {
      if(response.data.code == 200) {
        this.shops = response.data.data;
      }
    });
  },
  mounted() {
    this.onSearch({tabName: this.$refs.tabs.currentName});
    events.addEventListener('searchOrder', (searchData) => {
      this.searchData = {
        ...this.searchData,
        ...searchData,
      };
      this.onSearch({});
    });
  },
  destroyed() {
    events.removeEventListener('searchOrder');
  },
  methods: {
    toDateTime(row, column, cellValue) {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    handleDaterangeChange(values) {
      if (!values) {
        this.daterange = '';
        this.searchData.createStartDate = '';
        this.searchData.createEndDate = '';
        return;
      }
      const [createStartDate, createEndDate] = values;
      this.searchData.createStartDate = format.toDate(createStartDate);
      this.searchData.createEndDate = format.toDate(createEndDate);
    },
    handleDaterangeLocalChange(values) {
      if (!values) {
        this.daterange = '';
        this.searchData.createStartDateTz = '';
        this.searchData.createEndDateTz = '';
        return;
      }
      const [createStartDate, createEndDate] = values;
      this.searchData.createStartDateTz = format.toDate(createStartDate);
      this.searchData.createEndDateTz = format.toDate(createEndDate);
    },
    filterShop(shopId) {
      this.searchData.id = shopId;
      this.onSearch();
    },
    handleFilterChange(e) {
      if (e.shopId !== undefined) {
        this.searchData.shopId = e.shopId;
        this.onSearch({tabName: this.activeTabName});
      }
    },
    shopFormat(row, column, cellValue) {
      let shop = this.shops.filter((item) => item.id == cellValue)[0];

      return shop ? shop.shopName : '';
    },
    handleExport() {
      let exportUrls, url;
      exportUrls = {

        // 待审核页签订单修改URL
        "waitCheck": "/ama_orders/export/wait_check",

        // 待发货页签订单修改URL
        "waitSend": "/ama_orders/export/wait_send",

        // 完成页签订单修改URL
        "complete": "/ama_orders/export/complete",

        // 全部页签订单修改URL
        "all": "/ama_orders/export/all",
      };
      url = exportUrls[this.$refs.tabs.currentName] + "?"
        + queryString.stringify(this.searchData);
      window.open(url);
    },
    handleTabClick(tab) {
      const oldTabSearchData = extend(true, {}, this.searchData);
      const newTabSearchData = extend(true, {}, tablesSearchData[tab.name]);

      tablesSearchData[this.activeTabName] = oldTabSearchData;
      this.activeTabName = tab.name;
      this.searchData.shopId = undefined;
      switch(tab.name) {
        case 'waitCheck':
          this.orderStatusForSelect = {
            "10": "已支付未授权",
            "11": "已支付无需配送",
          };
          break;
        case 'waitSend':
          this.orderStatusForSelect = {
            "20": "待发货",
            "21": "已下物流单",
            "22": "已部分发货",
            "23": "取消处理中",
            "24": "发货处理中",
            "25": "延迟待发",
          };
          break;
        case 'complete':
          this.orderStatusForSelect = {
            "30": "已发货",
            "31": "已发货待确认发票寄出",
            "32": "退款处理中",
            "33": "虚拟发货",
            "40": "已完成",
            "50": "已取消",
            "51": "已退款",
          };
          break;
        default:
          this.orderStatusForSelect = {
            "10": "已支付未授权",
            "11": "已支付无需配送",
            "20": "待发货",
            "21": "已下物流单",
            "22": "已部分发货",
            "23": "取消处理中",
            "24": "发货处理中",
            "25": "延迟待发",
            "30": "已发货",
            "31": "已发货待确认发票寄出",
            "32": "退款处理中",
            "33": "虚拟发货",
            "40": "已完成",
            "50": "已取消",
            "51": "已退款",
          };
      }
      setTimeout(() => {
        Object.keys(this.searchData).forEach((key) => {
          this.$set(this.searchData, key, newTabSearchData[key]);
        });
        if (this.searchData.createStartDate) {
          const {createStartDate, createEndDate} = this.searchData;
          this.daterange = [
            new Date(createStartDate),
            new Date(createEndDate)
          ]
        } else {
          this.daterange = '';
        }
        this.onSearch({tabName: tab.name});
      });
    },
    onRemarkDialogClose() {
      this.dialogLoading = false;
      this.$refs.remarkForm.resetFields();
    },
    onCancelOrderDialogClose() {
      this.dialogLoading = false;
      this.$refs.cancelOrderForm.resetFields();
    },
    onRefundOrderDialogClose() {
      this.dialogLoading = false;
      this.$refs.refundOrderForm.resetFields();
    },
    onRefundProductDialogClose() {
      this.dialogLoading = false;
      this.$refs.refundProductForm.resetFields();
    },
    handleSizeChange(val) {
      this[this.$refs.tabs.currentName+'TablePageSize'] = val;
      this.onSearch({tabName: this.$refs.tabs.currentName});
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val, tabName: this.$refs.tabs.currentName});
    },
    handleReset() {
      this.searchData = {
        sku: '',
        shopId: '',
        orderStatus: '',
        amaOrderId: '',
        createStartDate: '',
        createEndDate: '',
        fbaFlag: '',
        buyerName: '',
        receiverName: '',
        clickFarmingFlag: '',
        createStartDateTz: '',
        createEndDateTz: '',
      };
      this.daterange="";
      this.daterangeLocal="";
      this.onSearch();
    },
    onSearch({pageNumber = 1, tabName = this.$refs.tabs.currentName} = {}) {

      this[tabName+'TableLoading'] = true;
      let pageSize = this[tabName+'TablePageSize'];
      let urlMiddle = '';
      if(tabName == 'waitCheck') {
        urlMiddle = 'wait_check';
      }else if(tabName == 'waitSend') {
        urlMiddle = 'wait_send';
      }else if(tabName == 'complete') {
        urlMiddle = 'complete';
      }else if(tabName == 'all') {
        urlMiddle = 'all';
      }
      if (this.$refs) {
        this.$refs.waitCheckTable && this.$refs.waitCheckTable.clearSelection();
        this.$refs.waitSendTable && this.$refs.waitSendTable.clearSelection();
        this.$refs.completeTable && this.$refs.completeTable.clearSelection();
      }
      ajax.post('/ama_orders/list/'+urlMiddle, {pageNumber, pageSize, ...this.searchData})
      .then((response) => {
        this[tabName+'TableLoading'] = false;
        if(response.data.code == 200) {
          const data = response.data.data.data || [];
          this[tabName+'TableData'] = data.map((d) => {
            switch(d.orderStatus) {
              case 32: // 退款处理中
              case 51: // 已退款
              case 52: // 部分退货
              case 53: // 已退货
                d.isReturn = true;
            }
            return d;
          });
          this[tabName+'TableTotalRecord'] = response.data.data.totalRecord;
          setTimeout(() => {
            const checkboxes = document.querySelectorAll('.el-table input[type=checkbox]');
            if (checkboxes && checkboxes.length) {
              const checkboxList = Array.prototype.slice.apply(checkboxes);
              checkboxList.map((input) => {
                input.checked = false;
              });
            }
          });
          if(pageNumber==1){
            this.pageNumber=1;
            this.pageNumber2=1;
            this.pageNumber3=1;
            this.pageNumber4=1;
          } 
        }
      })
      .catch((error) => {
        this[tabName+'TableLoading'] = false;
      });
    },

    handleWaitSendTableSelect(selection, row) {
      this.cancelOrders = selection;
      this.cancelOrderDisabled = (selection.length <= 0);
    },

    // 批量操作，注意有201错误需要处理
    onCancelOrderDialogSubmit() {
      let valid = true;
      for(let obj of this.cancelOrders) {

        // 状态只有待发货、已下物流单订单才可以进行取消订单操作
        if(obj.orderStatus != "20" && obj.orderStatus != "21") {
          valid = false;
          break;
        }
      }
      if(!valid) {
        this.$message({
          showClose: true,
          message: '只有待发货、已下物流单订单才可以进行取消订单操作',
          type: 'warning'
        });
        return;
      }else {
        let url = '/ama_orders/cancel_all';
        this.cancelOrderForm.orderId = this.cancelOrders.map(item => item.id).join(',');
        this.$refs.cancelOrderForm.validate((valid) => {
          if (valid) {
            this.dialogLoading = true;
            ajax.post(url, this.cancelOrderForm)
            .then((response) => {
              this.dialogLoading = false;
              this.cancelOrderDialogVisible = false;
              if(response.data.code == 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg || '操作成功',
                  type: 'success'
                });
                this.onSearch({tabName: this.$refs.tabs.currentName});

              // 201表示部分成功
              }else if(response.data.code == 201) {
                let data = response.data.data;
                this.batchForm.errorMsg =
                  '您共对 '+data.totalNum
                    +' 条信息进行了操作，成功操作 '
                    +data.successNum
                    +' 条，失败 '
                    +(data.totalNum-data.successNum)
                    +' 条';
                this.batchForm.errorList = [];
                for(let orderNo of Object.keys(data.failInfo)) {
                  let temp = {orderNo: orderNo, errorReson: data.failInfo[orderNo]};
                  this.batchForm.errorList.push(temp);
                }
                if(data.successNum == 0) {
                  this.batchDialogTitle = "取消订单操作全部失败";
                }else {
                  this.batchDialogTitle = "取消订单操作部分失败";
                }
                this.batchDialogVisible = true;
              }
            })
            .catch((error) => {
              this.dialogLoading = false;
            });
          }
        })
      }
    },

    handleCancelProduct(product) {
      this.cancelOrderDialogVisible = true;
      this.cancelOrderDialogTitle = '取消商品';
      this.cancelOrderForm.orderId = product.orderId;
      this.cancelOrderForm.prdId = product.id;
    },
    onCancelProductDialogSubmit() {
      let url = '/ama_orders/cancel_part';
      this.$refs.cancelOrderForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          ajax.post(url, this.cancelOrderForm)
          .then((response) => {
            this.dialogLoading = false;
            if(response.data.code == 200) {
              this.cancelOrderDialogVisible = false;
              this.orderDetailDialogVisible = false;
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({tabName: this.$refs.tabs.currentName});

            // 201表示部分成功
            }else if(response.data.code == 201) {
              let data = response.data.data;
              this.batchForm.errorMsg =
                '您共对 '+data.totalNum
                  +' 条信息进行了操作，成功操作 '
                  +data.successNum
                  +' 条，失败 '
                  +(data.totalNum-data.successNum)
                  +' 条';
              this.batchForm.errorList = [];
              for(let orderNo of Object.keys(data.failInfo)) {
                let temp = {orderNo: orderNo, errorReson: data.failInfo[orderNo]};
                this.batchForm.errorList.push(temp);
              }
              if(data.successNum == 0) {
                this.batchDialogTitle = "取消订单操作全部失败";
              }else {
                this.batchDialogTitle = "取消订单操作部分失败";
              }
              this.batchDialogVisible = true;
            }
          })
          .catch((error) => {
            this.dialogLoading = false;
          });
        }
      })
    },

    handleCompleteTableSelect(selection, row) {
      this.refundOrders = selection;
      this.refundOrderDisabled = (selection.length <= 0);
    },

    // 批量操作，注意有201错误需要处理
    onRefundOrderDialogSubmit(index, row) {
      let valid = true;
      for(let obj of this.refundOrders) {

        // 状态为已发货、已完成、虚拟发货才可以做订单退款操作
        if(obj.orderStatus != "30" && obj.orderStatus != "40" && obj.orderStatus != "33") {
          valid = false;
          break;
        }
      }
      if(!valid) {
        this.$message({
          showClose: true,
          message: '只有已发货、已完成订单、虚拟发货才可以进行订单退款操作',
          type: 'warning'
        });
        return;
      }else {
        let url = '/ama_orders/refund_all';
        this.refundOrderForm.orderId = this.refundOrders.map(item => item.id).join(',');
        this.$refs.refundOrderForm.validate((valid) => {
          if (valid) {
            this.dialogLoading = true;
            ajax.post(url, this.refundOrderForm)
            .then((response) => {
              this.dialogLoading = false;
              this.refundOrderDialogVisible = false;
              if(response.data.code == 200) {
                this.$message({
                  showClose: true,
                  message: response.data.msg || '操作成功',
                  type: 'success'
                });
                this.onSearch({tabName: this.$refs.tabs.currentName});

              // 201表示部分成功
              }else if(response.data.code == 201) {
                let data = response.data.data;
                this.batchForm.errorMsg =
                  '您共对 '+data.totalNum
                    +' 条信息进行了操作，成功操作 '
                    +data.successNum
                    +' 条，失败 '
                    +(data.totalNum-data.successNum)
                    +' 条';
                this.batchForm.errorList = [];
                for(let orderNo of Object.keys(data.failInfo)) {
                  let temp = {orderNo: orderNo, errorReson: data.failInfo[orderNo]};
                  this.batchForm.errorList.push(temp);
                }
                if(data.successNum == 0) {
                  this.batchDialogTitle = "订单退款操作全部失败";
                }else {
                  this.batchDialogTitle = "订单退款操作部分失败";
                }
                this.batchDialogVisible = true;
              }
            })
            .catch((error) => {
              this.dialogLoading = false;
            });
          }
        })
      }
    },

    handleClickFarming() {
      this.onSearch();
    },

    handleRefundProduct(product) {
      this.refundProductDialogVisible = true;
      this.refundProductForm.orderId = product.orderId;
      this.refundProductForm.prdId = product.id;
      this.refundProducts = [product];
    },

    onRefundProductDialogSubmit() {
      let refundAmount = this.refundProductForm.refundAmount;
      if(refundAmount==undefined
        || refundAmount==null
        || refundAmount=='') {
        this.$message({
          showClose: true,
          message: '请填写退款金额',
          type: 'warning'
        });
        return;
      }
      if(!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(refundAmount)) {
        this.$message({
          showClose: true,
          message: '退款金额格式有问题，请修改',
          type: 'warning'
        });
        return;
      }
      let url = '/ama_orders/refund_part';
      this.$refs.refundProductForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;

          let data = {orderId: this.refundProductForm.orderId};
          data['refundProduct[0].prdId'] = this.refundProductForm.prdId;
          data['refundProduct[0].refundAmount'] = this.refundProductForm.refundAmount;

          ajax.post(url, data)
          .then((response) => {
            this.dialogLoading = false;
            if(response.data.code == 200) {
              this.refundProductDialogVisible = false;
              this.orderDetailDialogVisible = false;
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({tabName: this.$refs.tabs.currentName});

            // 201表示部分成功
            }else if(response.data.code == 201) {
              let data = response.data.data;
              this.batchForm.errorMsg =
                '您共对 '+data.totalNum
                  +' 条信息进行了操作，成功操作 '
                  +data.successNum
                  +' 条，失败 '
                  +(data.totalNum-data.successNum)
                  +' 条';
              this.batchForm.errorList = [];
              for(let orderNo of Object.keys(data.failInfo)) {
                let temp = {orderNo: orderNo, errorReson: data.failInfo[orderNo]};
                this.batchForm.errorList.push(temp);
              }
              if(data.successNum == 0) {
                this.batchDialogTitle = "取消商品操作全部失败";
              }else {
                this.batchDialogTitle = "取消商品操作部分失败";
              }
              this.batchDialogVisible = true;
            }
          })
          .catch((error) => {
            this.dialogLoading = false;
          });
        }
      })
    },

    handleShowOrderDetail(row) {
      this.orderDetailForm = row;
      this.$refs.orderDetail.show(row.id, row);
      this.orderDetailForm.showAddress =
        (this.orderDetailForm.receiverAddressLine1 || "") + " "
          + (this.orderDetailForm.receiverAddressLine2 || "") + " "
          + (this.orderDetailForm.receiverAddressLine3 || "");
    },

    onRemarkDialogSubmit() {
      let url = '/ama_orders/'+this.remarkForm.orderId+'/remark/add';
      this.$refs.remarkForm.validate((valid) => {
        if (valid) {
          ajax.post(url, this.remarkForm)
          .then((response) => {
            this.dialogVisible = false;
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({tabName: this.$refs.tabs.currentName});
            }
          });
        }
      })
    },
  },
  computed: {
    shopFilters() {
      const shopFilters = this.shops.map((shop) => {
        return {
          text: shop.shopName,
          value: shop.id
        }
      });
      return shopFilters;
    }
  }
}
</script>

<style lang="less">
.el-alert .el-alert__title {
  font-size: 16px;
}
.el-alert .el-alert__description {
  font-size: 14px;
}
.detail-dialog .el-form-item {
  margin-bottom: 0;
}
.detail-dialog .head {
  padding: 15px 0 5px;
  font-size: 18px;
  border-bottom: 1px solid #d1dbe5;
}
.detail-dialog .el-form-item__label {
  padding-right: 0;
}
.search-bar {
  .el-form-item {
    margin-bottom: 15px;
  }
}
.multi-row-search {
  .el-form-item {
    width: 300px;
    margin-bottom: 15px;
  }
  .el-form-item__label {
  }
}

.orderDetailForm-product-info {
  box-shadow: none;
  border: 0;
  .el-card__header {
    border-top: #d1dbe5 1px solid;
    background: #F6F6F6;
  }
  .head {
    &:before {
      display: block;
      content: " ";
      height: 1px;
      border-radius: 50%;
      background: #20a0ff;
      vertical-align: middle;
      margin-right: 10px;
    }
    font-size: 16px;
    border: 0;
    padding-bottom: 15px;
    margin-top: 20px;
    span {
      display: inline-block;
      float: left;
      background: #fff;
      padding: 0 10px;
      margin-top: -12px;
      margin-left: 10px;
    }
  }
}
.orderDetailForm-title {
  .title {
    color: #1880ce;
  }
}
.order-detail-dialog {
  .asin-link {
    padding: 0;
  }
}
.order-greenwich-time {
  width: 600px !important;
  // .el-form-item__label {
  //   width: 110px;
  // }
}
</style>
<style scoped lang="less">
.fba-tag{
  margin-top:5px;
}
.national-flag{
  margin-top: -3px;
}
.product-item{
  .line{
    width:80%;
    height: 1px;
    background:#eee;
    margin:10px auto;
  }
  .title{
    color:#333;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .info{
    .info-item{
      display:inline-block;
      margin-right:20px;
      span{
        color:#333;
        font-size:12px;
      }
    }
    
  }
}
</style>
