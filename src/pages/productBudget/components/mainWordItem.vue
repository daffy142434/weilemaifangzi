<template lang="html">
  <el-card class="word-item">
    <div slot="header" class="word-head">
      <span :class="notionalFlagClass"></span>
      <el-tag
        v-if="statusText && !showDetail"
        type="info"
        size="mini"
        class="tag-fill"
      >{{statusText}}</el-tag>
    </div>
    <div>
      {{data.keyWords}}
    </div>
    <div class="word-item-footer" v-if="!showDetail">
      <a
        :class="{
          icon: true,
          'el-icon-caret-right': true,
        }"
        @click="openDetail(data)"
        v-if="showPower"
      ></a>
    </div>
  </el-card>
</template>

<script>
// status字段：11、12、20、21、3、4可以点击，展示数据；1、10 不展示数据，提示正在计算
const statusMap = {
  1: '正在计算',
  10: '正在计算',
};
export default {
  components: {

  },
  props: {
    data: Object,
    showDetail:{
      type: Boolean,
      default() {
        return false;
      }
    } 
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
      return statusMap[this.data.status];
    },
    showPower() {
      // status字段：11、12、20、21、3、4可以点击，展示数据；1、10 不展示数据，提示正在计算
      switch(this.data.status) {
        case 3:
        case 4:
        case 11:
        case 12:
        case 20:
        case 21:
          return true;
      }
      return false;
    }
  },
  methods: {
    openDetail(data) {
      this.$router.push({
        name: 'budgetMainResult',
        params: {
          fromData: data,
        },
      });
    }
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
<style scoped>
.word-head{
  height: 24px;
}
</style>
