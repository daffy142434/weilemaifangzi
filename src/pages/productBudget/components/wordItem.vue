<template lang="html">
  <el-card class="word-item">
    <div slot="header">
      <span :class="notionalFlagClass"></span>
      <el-tag
        :type="statusType"
        size="mini"
        class="tag-fill"
      >{{statusText}}</el-tag>
    </div>
    <div>
      {{data.keyWords}}
    </div>
    <div class="word-item-footer">
      <a
        class="icon el-icon-search primary"
        @click="handleOpenBudgetResult(data)"
        v-if="data.secondExploreStatus === 2 && permissions('product_devp_estimate:second_detail')"
      ></a>
      <a
        :class="{
          icon: true,
          'el-icon-caret-right': true,
        }"
        v-if="hasSearch"
        @click="handleStartSecondSearch(data)"
      ></a>
    </div>
    <second-budget ref="secondBudget" @success="$emit('success')">
    </second-budget>
  </el-card>
</template>

<script>
import SecondBudget from './secondBudget';

const statusMap = {
  0: '未探索',
  1: '探索中',
  2: '探索完毕',
  3: '探索失败',
  4: '数据未准备就绪',
};
export default {
  components: {
    SecondBudget,
  },
  props: {
    data: Object,
  },
  data() {
    return {
    };
  },
  computed: {
    notionalFlagClass() {
      return `national-flag national-flag-${this.data.stationCode}`;
    },
    statusText() {
      return statusMap[this.data.secondExploreStatus];
    },
    statusType() {
      let statusType;

      switch(this.data.secondExploreStatus) {
        case 3:
        case 4:
          statusType = 'danger';
          break;
        case 2:
          statusType = 'success';
          break;
        default:
          statusType = 'info';
      }
      return statusType;
    },
    hasSearch() {
      switch(this.data.secondExploreStatus) {
        case 1:
        case 4:
          return false;
      }
      return true;
    }
  },
  methods: {
    handleOpenBudgetResult(data) {
      this.$router.push({
        name: 'budgetAgainResult',
        params: {
          id: data.id
        },
      });
    },
    handleStartSecondSearch(data) {
      switch(this.data.secondExploreStatus) {
        case 1:
        case 4:
          return;
      }
      this.$refs.secondBudget.show(data);
    },
  },
};

</script>

<style lang="less">
.word-item {
  margin: 0 10px 20px;
  .national-flag {
    margin-right: 6px;
  }
  .el-card__header {
    padding: 10px;
  }
  &-footer {
    text-align: right;
    height: 24px;
    line-height: 24px;
    margin: 0 -10px -10px;
    padding: 0 10px 10px;
    .icon {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .el-card__body {
    padding: 10px;
  }
  .el-icon-search {
    font-size: 30px;
    font-size: 22px;
  }
  .el-icon-caret-right {
    font-size: 30px;
    color: #333;
  }
  .word-item-disabled {
    color: #ccc;
    cursor: default;
  }
}
</style>
