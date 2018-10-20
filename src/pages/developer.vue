<template lang="html">
  <div>
    <div class="page-title">
      开发者账号管理
    </div>
    <div v-if="$store.state.powers.includes('ama_devp:add')" class="tools-bar">
      <el-button v-if="$store.state.powers.includes('ama_devp:add')" type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增开发者账号'">新增开发者账号</el-button>
    </div>
    <el-table
      v-loading.body="tableLoading"
      v-if="$store.state.powers.includes('ama_devp:list')"
      ref="singleTable"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>

      <el-table-column
        prop="accessKey"
        label="accessKey"
        width="250">
      </el-table-column>
      <el-table-column
        prop="secretKey"
        label="secretKey">
      </el-table-column>
      <el-table-column
        prop="marketId"
        label="所属站点"
        :formatter="marketFormat"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="170">
        <template slot-scope="scope">
          <el-button v-if="$store.state.powers.includes('ama_devp:modify')" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="$store.state.powers.includes('ama_devp:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="90px">
        <el-form-item label="accessKey" prop="accessKey">
          <el-input v-model="dataForm.accessKey" placeholder="开发者账号accessKey"></el-input>
        </el-form-item>
        <el-form-item label="secretKey" prop="secretKey">
          <el-input v-model="dataForm.secretKey" placeholder="开发者账号secretKey"></el-input>
        </el-form-item>
        <el-form-item label="平台站点" prop="marketId">
          <el-select v-model="dataForm.marketId" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in markets"
              :key="item.id"
              :label="item.marketName"
              :value="item.marketId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="info" @click="onDialogSubmit()" v-if="dialogTitle=='修改开发者账号信息'">保存</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '../lib/ajax';
import moment from 'moment';
export default {
  data() {
    return {
      dialogLoading: false,
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: '新增开发者账号信息',
      markets: [],
      rules: {
        accessKey: [{
          required: true,
          message: 'accessKey不能为空',
          trigger: 'blur'
        }],
        secretKey: [{
          required: true,
          message: 'secretKey不能为空',
          trigger: 'blur'
        }],
        marketId: [{
          required: true,
          message: '所属站点不能为空',
          trigger: 'change'
        }],
      },
      dataForm: {
        id: '',
        accessKey: '',
        secretKey: '',
        marketId: '',
      },
      tableData: [],
    }
  },
  created() {
    ajax.post('/shops/ama_market/list')
    .then((response) => {
      if(response.data.code == 200) {
        this.markets = response.data.data;
        this.onSearch();
      }
    });
  },
  methods: {
    marketFormat(row, column, cellValue) {
      let market = this.markets.filter((item) => item.marketId == cellValue.replace(/\s+/, ''))[0];
      return market ? market.marketName : '';
    },
    onDialogClose() {
      this.$refs.dataForm.resetFields();
    },

    onSearch() {
      this.tableLoading = true;
      ajax.post('/ama_devp/list')
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = response.data.data || [];
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该开发者账号信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(`/ama_devp/${row.id}/delete/`)
        .then((response) => {
          if(response.data.code == 200) {
            this.$message({
              showClose: true,
              message: response.data.msg || '操作成功',
              type: 'success'
            });
            this.onSearch();
          }
        });
      });
    },
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.dialogTitle='修改开发者账号信息';
      for(let x of Object.keys(this.dataForm)) {
        this.dataForm[x] = row[x];
      }
    },
    onDialogSubmit() {
      let dataForm = this.dataForm;
      let url = dataForm.id ? (`/ama_devp/${dataForm.id}/modify`) : '/ama_devp/add';
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          ajax.post(url, dataForm)
          .then((response) => {
            this.dialogLoading = false;
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch();
              this.dialogVisible = false;
            }
          })
          .catch((error) => {
            this.dialogVisible = false;
          })
        }
      })
    },
  }
}
</script>

<style lang="css">
</style>
