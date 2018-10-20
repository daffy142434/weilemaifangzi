<template lang="html">
  <el-button type="text" @click="toAma" class="asin-link">
    <slot>{{text}}</slot>
  </el-button>
</template>
<script>
  import getDomainSuffixByStationCode from '@/lib/getDomainSuffixByStationCode';
  export default {
    props: ['marketId', 'sellerId', 'stationCode', 'text'],
    methods: {
      toAma() {
        window.open(this.address);
      }
    },
    computed: {
      address() {
        const {marketId, sellerId, stationCode} = this;
        const domainSuffix = getDomainSuffixByStationCode(stationCode);
        return `https://www.amazon.${domainSuffix}/sp?marketplaceID=${marketId}&seller=${sellerId}`;
      }
    }
  }
</script>
