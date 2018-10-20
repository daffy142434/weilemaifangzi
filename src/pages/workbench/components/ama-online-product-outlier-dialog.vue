<template lang="html">
  <div>
    <el-dialog
      title="异常商品"
      :visible.sync="visible"
      width="90%"
      @close="close"
    >
      <ama-online-product-outlier-table
        ref="table"
        :loading="loading"
        :data="data"
        @onOperation="onOperation"
      >
      </ama-online-product-outlier-table>
    </el-dialog>
    <operation-dialog ref="operationDialog" @operationSuccess="handleOperationSuccess()"></operation-dialog>
  </div>
</template>

<script>
  import OperationDialog from '@/pages/amaOnlineProductOutlier/components/operation-dialog';
  import AmaOnlineProductOutlierTable from '@/pages/amaOnlineProductOutlier/components/ama-online-product-outlier-table';
  import AmaOnlineProductOutlier from '@/pages/amaOnlineProductOutlier/services';

  const amaOnlineProductOutlier = new AmaOnlineProductOutlier();

  export default {
    components: {
      'operation-dialog': OperationDialog,
      'ama-online-product-outlier-table': AmaOnlineProductOutlierTable
    },
    data() {
      return {
        visible: false,
        loading: false,
        data: []
      };
    },
    methods: {
      onOperation([rowData]) {
        this.$refs.operationDialog.show(rowData);
      },
      handleOperationSuccess() {
        this.loadData();
        this.$emit('onAmaOnlineProductOutlierUpdate');
      },
      loadData() {
        amaOnlineProductOutlier.getExceptionList({
          processStatus: 1,
          pageNumber: 1,
          pageSize: 100,
          processStatus: 1
        })
        .then((res) => {
          this.data = res.data.data.data || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      },
      show() {
        this.visible = true;
        this.loading = true;
        this.loadData();
      },
      close() {
        this.visible = false;
      }
    }
  }
</script>

<style lang="css">
</style>
