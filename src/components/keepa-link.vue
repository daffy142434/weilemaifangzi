<template lang="html">
  <el-button type="text" @click="toKeepa" class="asin-link">
    <slot>{{text || asin}}</slot>
  </el-button>
</template>
<script>
  const map = {
    us: 1,
    uk: 2,
    de: 3,
    fr: 4,
    jp: 5,
    ca: 6,
    cn: 7,
    it: 8,
    es: 9,
    in: 10,
    mx: 11,
    br: 12,
  }
  export default {
    props: ['asin', 'stationCode', 'text'],
    methods: {
      toKeepa() {
        window.open(this.address);
      }
    },
    computed: {
      address() {
        return `https://keepa.com/#!search/${map[this.stationCode]}-${this.asin}`
      }
    }
  }
</script>
