<template lang="html">
  <el-table
    v-loading="loading"
    :data="data"
    border
    highlight-current-row
  >
    <el-table-column
      label="图片"
      width="100"
    >
      <template slot-scope="props">
        <img :src="props.row.imageUrl" v-if="props.row.imageUrl" />
      </template>
    </el-table-column>
    <el-table-column
      label="ASIN"
      prop="asin"
      width="160"
    >
      <template slot-scope="props">
        <asin-link :asin="props.row.asin" :stationCode="props.row.stationCode"></asin-link>
      </template>
    </el-table-column>
    <el-table-column
      label="SKU"
      prop="sku"
    >
    </el-table-column>
    <el-table-column
      label="店铺"
      prop="shopName"
    >
    </el-table-column>
    <el-table-column
      label="折后价"
      prop="salePrice"
      width="80"
    >
    </el-table-column>
    <el-table-column
      label="被跟卖"
    >
      <template slot-scope="props">
        <div v-if="type === 'history' || props.row.withSellFlag === 1">
          <span v-datetime="props.row.withSellStartTime"></span>
          <br />
          <span v-datetime="props.row.withSellEndTime"></span>
          <br />
          价格：{{props.row.withSellSalePrice}}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="失去购物车"
    >
      <template slot-scope="props">
        <div v-if="type === 'history' || props.row.lostCartFlag === 1">
          <span v-datetime="props.row.lostCartStartTime"></span>
          <br />
          <span v-datetime="props.row.lostCartEndTime"></span>
          <br />
          <br />
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['loading', 'data', 'type']
}
</script>

<style lang="css">
</style>
