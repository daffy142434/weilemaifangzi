<template lang="html">
  <div class="custom-contaier">
    <el-table></el-table>
  </div>
</template>
<script>
  import format from '@/lib/format';
  export default {
    data() {
      return {
        searchData: {
          shopName: '',
          countryName: '',
          amaOrderId: '',
          customerName: '',
          userNo: '',
          customerEmail: '',
          startDate: '',
          endDate: '',
          pageNumber: 1,
        },
        tableData: [],
        totalRecord: 0,
        pageSize: 10,
        tableLoading: false,
      }
    },
    computed: {
    },
    beforeCreate(){
    },
    created() {
      this.onSearch();
    },
    mouted() {

    },
    methods: {
    },
  }
</script>

<style lang="less">
</style>
