<template lang="html">
  <el-card :class="{'budget-result': true}" ref="card">
    <div slot="header">
      {{data.title}}
    </div>
    <div>
      <template v-for="(item, index) in data.infos">
        <column-tip 
          :key="`column_${index}`"
          :head="item.label"
          :foot="item.value"
          :labelWidth="labelWidth"
          :barWidth="barWidth * item.value / maxNum"
          :tailWidth="tailWidth"
        >
        </column-tip>

      </template>
    </div>
  </el-card>
</template>

<script>
import columnTip from '@/components/column-tip';
export default {
  props: {
    data: Object,
    fullWidth:Number,
  },
  components: {
    'column-tip': columnTip
  },
  created() {
    
  },
  computed: {
    notionalFlagClass() {
      return `national-flag national-flag-${this.data.stationCode}`;
    },
    barWidth() {
      return (this.fullWidth / 2) - this.labelWidth - this.tailWidth -120;
    },
    maxNum() {
      let arr = [];
      for(let item of this.data.infos) {
        arr.push(item.value);
      }
      return Math.max(...Object.values(arr));
    },
  },
  mounted() {
    
  },
  data() {
    return {
      labelWidth: 150,
      tailWidth: 70,
    };
  },
  methods: {
    getPieOptions(title, data) {
    },
  }
};
</script>

<style lang="less">
.budget-result {
  margin: 0 10px 20px;
  overflow: visible;
  &.first-result {
    margin: 0 0 80px;
    &:after {
      background: #ccc;
      height: 3px;
      overflow: hidden;
      content: ' ';
      position: relative;
      top: 45px;
      display: block;
    }
  }
  .notional-flag {
    margin-right: 30px;
  }
  &-body {
    display: flex;
    .chart {
      flex: 1;
      margin: 0 10px;
      min-height: 300px;
      line-height: 300px;
      text-align: center;
      font-size: 18px;
      font-weight: 900;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
