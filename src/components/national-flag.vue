<template lang="html">
  <span :class="className" v-if="stationCode"></span>
</template>

<script>
export default {
  props: ['stationCode'],
  data() {
    return {
      className: `national-flag national-flag-${this.stationCode}`
    }
  }
}
</script>

<style lang="css">
</style>
