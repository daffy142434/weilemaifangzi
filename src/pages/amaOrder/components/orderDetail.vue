<template lang="html">
  <el-dialog
    title="订单详情"
    :visible.sync="visible"
    width="90%"
    class="detail-dialog order-detail-dialog"
    top="5%"
    @close="close"
  >
    <el-tabs type="border-card" v-loading="loading">
      <el-tab-pane label="订单信息">
        <el-form ref="orderDetailForm-order" :model="orderDetailForm" label-width="86px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单编号：">
                <span :class="{'click-farming-order': orderDetailForm.clickFarmingFlag}">{{orderDetailForm.amaOrderId}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="状态：">
                {{format.formatAmaOrderStatus(orderDetailForm.orderStatus)}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="FBA：">
                {{format.formatYesOrNo(orderDetailForm.fbaFlag)}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-width="100px"
                label="当地时间：">
                <span v-datetime="orderDetailForm.orderCreateDateTz"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="店铺：">
                {{orderDetailForm.shopName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="币种：">
                {{orderDetailForm.currency}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="金额：">
                {{orderDetailForm.orderAmount}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-width="100px"
                label="格林尼治时间：">
                <span v-datetime="orderDetailForm.orderCreateDateUtc"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="付款类型：">
                {{format.formatAmaPaymentType(orderDetailForm.paymentMethod)}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否红单：">
                {{format.formatYesOrNo(orderDetailForm.clickFarmingFlag)}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="红单金额：">
                {{orderDetailForm.clickFarmingAmount}}
                ({{orderDetailForm.clickFarmingCurrency}})
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-width="100px"
                label="北京时间：">
                <span v-datetime="orderDetailForm.orderCreateDateLocal"></span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="买家邮箱：">
                {{orderDetailForm.buyerEmail}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="head">物流信息</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="物流单号：">
                {{orderDetailForm.logisticsNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="收货人电话：">
                {{orderDetailForm.receiverPhone}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物流平台：">
                {{orderDetailForm.logisticsPlatform}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="物流账户名：">
                {{orderDetailForm.logisticsUserName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="服务级别：">
                {{orderDetailForm.shipmentServiceLevel}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="物流承运商：">
                {{orderDetailForm.logisticsCarrierCode}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="配送方式：">
                {{format.formatAmaChannel(orderDetailForm.fulfillmentChannel)}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="已配送数量：">
                {{orderDetailForm.itemShippedNum}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="未配送数量：">
                {{orderDetailForm.itemUnshippedNum}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="买家姓名：">
                {{orderDetailForm.buyerName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货人姓名：">
                {{orderDetailForm.receiverName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="收货国家：">
                {{orderDetailForm.receiverCountry}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="收货州：">
                {{orderDetailForm.receiverStateRegion}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="收货城市：">
                {{orderDetailForm.receiverCity}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货郡/县：">
                {{orderDetailForm.receiverCounty}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="收货区：">
                {{orderDetailForm.receiverDistrict}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="收货地址：">
                {{orderDetailForm.showAddress}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="邮政编码：">
                {{orderDetailForm.receiverZipCode}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="head">订单备注</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <template>
                <el-table
                  :data="orderDetailForm.remarkList"
                  border
                  height="200"
                  style="width: 100%;margin-top: 15px;">
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
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品信息">
        <el-form ref="orderDetailForm-product" :model="orderDetailForm">
          <template v-for="item in orderDetailForm.productList">
            <el-card class="orderDetailForm-product-info">
              <el-row slot="header">
                <el-col :span="24">
                  <div class="orderDetailForm-title">
                    商品：<span class="title">{{item.title}}</span>
                    <el-button
                      v-if="activeTabName=='waitSend' && $store.state.powers.includes('order:ama_cancel') && item.productStatus == '0'"
                      @click="handleCancelProduct(item)"
                      type="primary"
                      size="small"
                      style="margin-left: 15px;color: #fff !important;"
                      class="fr">
                      取消商品</el-button>

                    <el-button
                      v-if="activeTabName=='complete' && $store.state.powers.includes('order:ama_refund') && item.productStatus == '10'"
                      @click="handleRefundProduct(item)"
                      type="primary"
                      size="small"
                      style="margin-left: 15px;color: #fff !important;"
                      class="fr">
                      商品退款</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="ASIN：">
                    <asin-link :asin="item.amaAsin" :stationCode="orderDetailForm.stationCode"></asin-link>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="SKU：">
                    {{item.sellerSku}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="商品状态：">
                    {{format.formatAmaProductStatus(item.productStatus)}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="数量：">
                    {{item.quantity}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="总价：">
                    {{item.itemPrice}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="税费：">
                    {{item.itemTax}}
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="sale-money">
                  <el-form-item label="实际销售金额：">
                    {{(item.itemPrice+item.itemTax+item.shippingPrice+item.shippingTax-item.shippingDiscount-item.promotionDiscount).toFixed(2)}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="head"><span>费用信息</span></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="运费：">
                    {{item.shippingPrice}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="运费税费：">
                    {{item.shippingTax}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="包装费：">
                    {{item.giftWrapPrice}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="包装费税费：">
                    {{item.giftWrapTax}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="运费折扣：">
                    {{item.shippingDiscount}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="促销折扣总计：">
                    {{item.promotionDiscount}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="COD服务费：">
                    {{item.codFee}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="COD服务费折扣：">
                    {{item.codFeeDiscount}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="head"><span>发票信息</span></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="买家发票要求：">
                    {{format.formatAmaInvoiceRequirement(item.invoiceRequirement)}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="商品发票要求：">
                    {{format.formatAmaInvoiceType(item.invoiceRequirement)}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="发票类型：">
                    {{format.formatAmaInvoiceInformationType(item.invoiceInformartionType)}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="发票抬头：">
                    {{item.invoiceTitle}}
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发票类目：">
                    {{item.invoiceCategory}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="head"><span>退款记录</span></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    {{item.refundComment||"暂无退款记录"}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="head"><span>礼品、其它信息</span></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="买家提供的礼品信息：">
                    {{item.giftMessageText}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="买家要求的礼品等级：">
                    {{item.refundComment}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预约送货开始日期：">
                    {{item.scheduledDeliveryStartDate ? (item.scheduledDeliveryStartDate + '(预约送货上门仅适用于日本)') : ''}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="预约送货结束日期：">
                    {{item.scheduledDeliveryEndDate ? (item.scheduledDeliveryEndDate + '(预约送货上门仅适用于日本)') : ''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="卖家描述的商品状况：">
                    {{item.conditionNote}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </template>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import format from '@/lib/format';
import Order from '../services';
import AsinLink from '@/components/asin-link';

const order = new Order();

export default {
  components: {
    'asin-link': AsinLink
  },
  data() {
    return {
      format,
      visible: false,
      loading: false,
      orderDetailForm: {},
      activeTabName:""
    }
  },
  methods: {
    show(orderId, data) {
      this.visible = true;
      this.loading = true;
      order.getOrderDetail(orderId).then((res) => {
        const data = res.data.data || {};
        data.showAddress =
          (data.receiverAddressLine1 || "") + " "
            + (data.receiverAddressLine2 || "") + " "
            + (data.receiverAddressLine3 || "");
        this.orderDetailForm = data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    showForCustomer(data) {
      
      this.loading = true;
      order.getOrderDetailForCustomer({shopId:data.shopId,amaOrderId:data.amaOrderId}).then((res) => {
        this.visible = true;
        const data = res.data.data || {};
        data.showAddress =
          (data.receiverAddressLine1 || "") + " "
            + (data.receiverAddressLine2 || "") + " "
            + (data.receiverAddressLine3 || "");
        this.orderDetailForm = data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    close() {
      this.orderDetailForm = {};
      this.visible = false;
    },
    handleCancelProduct(product) {
      this.$emit('onCancelProduct', product);
    },
    handleRefundProduct(product) {
      this.$emit('onRefundProduct', product);
    }
  }
}
</script>

<style lang="less">
.order-detail-dialog {
  .el-form-item__label {
    padding-right: 0;
    line-height: 30px;
  }
  .el-form-item__content {
    line-height: 30px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .asin-link {
    padding: 0;
  }
}
.order-detail-dialog{
  .sale-money{
    font-weight: bold;
    .el-form-item__label{
      font-size: 16px;
    }
  }
}
</style>

