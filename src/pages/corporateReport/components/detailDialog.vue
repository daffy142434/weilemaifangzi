<template lang="html">
  <el-dialog
    title="详情"
    width="90%"
    :visible.sync="visible"
  >
    <div class="company-operate-report">
      <el-form v-loading="loading" label-width="320px">
        <el-row>
          <el-col :span="24">
            <span class="fr">Currency Code: <span style="color: #F56C6C;">{{expenses.currencyCode}}</span></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="company-operate-report-left">
            <div class="company-operate-title">
              <el-form-item label="Income">| Amount</el-form-item>
            </div>
            <el-form-item label="Seller Product Sales Price: ">{{income.sellerProductSalesPrice}}</el-form-item>
            <el-form-item label="Seller Product Sales Refunds: ">{{income.sellerProductSalesRefunds}}</el-form-item>
            <el-form-item label="Fba Product Sales Price: ">{{income.fbaProductSalesPrice}}</el-form-item>
            <el-form-item label="Fba Product Sales Refunds: ">{{income.fbaProductSalesRefunds}}</el-form-item>
            <el-form-item label="Fba Inventory Credits: ">{{income.fbaInventoryCredits}}</el-form-item>
            <el-form-item label="Shipping Credits: ">{{income.shippingCredits}}</el-form-item>
            <el-form-item label="Shipping Credit Refunds: ">{{income.shippingCreditRefunds}}</el-form-item>
            <el-form-item label="Gift Wrap Credits: ">{{income.giftWrapCredits}}</el-form-item>
            <el-form-item label="Gift Wrap Credit Refunds: ">{{income.giftWrapCreditRefunds}}</el-form-item>
            <el-form-item label="Promotional Rebates: ">{{income.promotionalRebates}}</el-form-item>
            <el-form-item label="Promotional Rebate Refunds: ">{{income.promotionalRebateRefunds}}</el-form-item>
            <el-form-item label="Fba Liquidation Proceeds: ">{{income.fbaLiquidationProceeds}}</el-form-item>
            <el-form-item label="Chargebacks: ">{{income.chargebacks}}</el-form-item>
            <el-form-item label="Income Total: " class="total">{{income.incomeTotal}}</el-form-item>
          </el-col>
          <el-col :span="13">
            <div class="company-operate-title">
              <el-form-item label="Expenses">| Amount</el-form-item>
            </div>
            <el-form-item label="Seller Selling Fees: ">{{expenses.sellerSellingFees}}</el-form-item>
            <el-form-item label="FBA SellingFees: ">{{expenses.fabSellingFees}}</el-form-item>
            <el-form-item label="Fba Transaction Fees: ">{{expenses.fbaTransactionFees}}</el-form-item>
            <el-form-item label="Fba Transaction Fee Refunds: ">{{expenses.fbaTransactionFeeRefunds}}</el-form-item>
            <el-form-item label="Fba Inventory Inbound Service Fees: ">{{expenses.fbaInventoryInboundServiceFees}}</el-form-item>
            <el-form-item label="Service Fees: ">{{expenses.serviceFees}}</el-form-item>
            <el-form-item label="Adjustments: ">{{expenses.adjustments}}</el-form-item>
            <el-form-item label="Other Transaction Fees: ">{{expenses.otherTransactionFees}}</el-form-item>
            <el-form-item label="Other Transaction Fee Refunds: ">{{expenses.otherTransactionFeeRefunds}}</el-form-item>
            <el-form-item label="Shipping Label Purchases: ">{{expenses.shippingLabelPurchases}}</el-form-item>
            <el-form-item label="Shipping Label Refunds: ">{{expenses.shippingLabelRefunds}}</el-form-item>
            <el-form-item label="Carrier Shipping Label Adjustments: ">{{expenses.carrierShippingLabelAdjustments}}</el-form-item>
            <el-form-item label="Refund For Advertiser: ">{{expenses.refundForAdvertiser}}</el-form-item>
            <el-form-item label="Cost of Advertising: ">{{expenses.costOfAdvertiser}}</el-form-item>
            <el-form-item label="Actual Selling Fee Refunds: ">{{expenses.actualSellingFeeRefunds}}</el-form-item>
            <el-form-item label="Expenses Total: " class="total">{{expenses.expensesTotal}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" class="company-operate-report-left">
            <div class="company-operate-title">
              <el-form-item label="Transfer">| Amount</el-form-item>
            </div>
            <el-form-item label="Converted Total Amount: ">{{financialEventGroup.convertedTotalAmount}}({{financialEventGroup.convertedTotalCurrencyCode}})</el-form-item>
            <el-form-item label="Beginning Balance Amount: ">{{financialEventGroup.beginningBalanceAmount}}({{financialEventGroup.beginningBalanceCurrencyCode}})</el-form-item>
            <el-form-item label="Failed Transfers Amount: ">{{transfers.failedTransfersAmount}}({{transfers.currencyCode}})</el-form-item>
            <el-form-item label="Charges To Credit Card: ">{{transfers.chargesToCreditCard}}({{transfers.currencyCode}})</el-form-item>
            <el-form-item label="Transfers Total: ">{{transfers.transfersTotal}} ({{transfers.currencyCode}})</el-form-item>
            <el-form-item label="Fund Transfer Status: ">{{financialEventGroup.fundTransferStatus}}</el-form-item>
            <el-form-item label="Account Tail: ">{{financialEventGroup.accountTail}}</el-form-item>
            <el-form-item label="Original Total Amount: " class="total">{{financialEventGroup.originalTotalAmount}}({{financialEventGroup.originalTotalCurrencyCode}})</el-form-item>
          </el-col>
          <el-col :span="13">
            <div class="company-operate-title">
              <el-form-item label="Sales Tax">| Amount</el-form-item>
            </div>
            <el-form-item label="Sales Collected Amount: ">{{salseTax.salesCollectedAmount}}</el-form-item>
            <el-form-item label="Sales Tax Redunds: ">{{salseTax.salesTaxRedunds}}</el-form-item>
            <el-form-item label="Sales Tax Total: " class="total">{{salseTax.salesTaxTotal}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>

import CorporateReport from '../services';

const corporateReport = new CorporateReport();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      income: {},
      expenses: {},
      transfers: {},
      salseTax: {},
      financialEventGroup: {}
    };
  },
  methods: {
    show(shopId, financialEventGroupId) {
      this.visible = true;
      this.loading = true;
      corporateReport.getReportDetail(shopId, financialEventGroupId).then((res) => {
        const data = res.data.data;
        const {expensesDetail, incomeDetail, salseTaxDetail, transfersDetail, financialEventGroup} = data;

        this.expenses = expensesDetail;
        this.income = incomeDetail;
        this.salseTax = salseTaxDetail;
        this.transfers = transfersDetail;
        this.financialEventGroup = financialEventGroup;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="less">
  .company-operate-report {
    &-left {
      .el-form-item__label {
        width: 240px !important;
      }
      .el-form-item__content {
        margin-left: 240px !important;
      }
    }
    .el-form-item__label {
      padding: 0 6px;
      font-weight: 900;
      text-align: right;
      color: #666;
    }
    .el-form-item {
      margin-bottom: 0;
      &.total {
        .el-form-item__label, .el-form-item__content {
          font-size: 18px;
          font-weight: 900;
          color: #1D8CE0;
        }
        .el-form-item__content {
          border: 0;
        }
      }
    }
    .el-form-item__content {
      min-height: 20px;
      margin-bottom: 0;
      border-bottom: #bfcbd9 1px solid;
      line-height: 40px;
    }
  }
  .company-operate-title {
    margin-bottom: 10px;
    .el-form-item__label {
      font-size: 24px;
      color: #000;
    }
    .el-form-item__content {
      text-align: left;
      font-size: 24px;
      font-weight: 900;
      border: 0;
      color: #000;
      line-height: 40px;
    }
  }
</style>
