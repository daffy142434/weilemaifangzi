<template>
  <div class="tip-col">
    <div class="tip-label" :style="{width: labelWidth + 'px'}">{{head}}</div>
    <div class="tip-bar" :style="{width: barWidth + 'px'}">
    </div>
    <div  :style="{width: tailWidth + 'px'}">{{foot}}</div>
  </div>
</template>
<script>
  export default {
    name: 'column-tip',
    props: {
      head: {
        type: String,
        default: '',
      },
      foot: {
        type: Number,
        default: '',
      },
      labelWidth: {
        type: Number,
        default: 80,
      },
      barWidth: {
        type: Number,
        default: 150,
      },
      tailWidth: {
        type: Number,
        default: 100,
      },
    },
    computed: {
      
    }
  };
</script>
<style lang="less">
  .el-progress-bar__outer {
    background: none;
  }
 
.tip-col{
    display: -webkit-flex;
    align-items:center;
  }
  .tip-col +  .tip-col{
    margin-top: 10px;

  }
  .tip-label {
    text-align: right;
    width: 80px;
    word-wrap: break-word;
    line-height: 1.1;
  }
  .tip-bar{
    height: 18px;
    border-radius:18px;
    background:#409eff;
    margin: 0 20px;
  }
</style>