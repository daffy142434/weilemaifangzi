<template lang="html">
  <el-button type="text" @click="toAma" class="asin-link">
    <slot>{{text || asin}}</slot>
  </el-button>
</template>
<script>
  import getAsinLink from '@/lib/getAsinLink';
  export default {
    props: ['asin', 'stationCode', 'text'],
    methods: {
      toAma() {
        window.open(this.asinAddress);
      }
    },
    computed: {
      asinAddress() {
        return getAsinLink(this.stationCode, this.asin);
      }
    }
  }
</script>
