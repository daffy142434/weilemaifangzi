<template lang="html">
  <div v-if="$store.state.powers.includes('exchange_rate_current:list')">
    <div class="page-title">
      当前汇率
    </div>
    <div>
      <el-table
        v-loading.body="tableLoading"
        ref="currencyTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          label="原始币种名称"
          prop="originalCurrencyName">
        </el-table-column>
        <el-table-column
          label="原始币种编码"
          prop="originalCurrency">
        </el-table-column>
        <el-table-column
          label="人民币兑换率"
          prop="cnyExchangeRate">
        </el-table-column>
        <el-table-column
          label="美元兑换率"
          prop="usdExchangeRate">
        </el-table-column>
        <el-table-column
          label="维护人"
          prop="modifier">
        </el-table-column>
        <el-table-column
          label="维护时间"
          width="180"
          :formatter="format.toDateTime"
          prop="modifyTime">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="$store.state.powers.includes('exchange_rate_current:modify')" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">维护</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="维护汇率" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="120px">
        <el-form-item label="币种">
          {{dataForm.originalCurrencyName}}
        </el-form-item>
        <el-form-item label="人民币兑换率" prop="cnyExchangeRate">
          <el-input v-model.number="dataForm.cnyExchangeRate" placeholder="人民币兑换率" :key="dataForm.originalCurrency"></el-input>
        </el-form-item>
        <el-form-item label="美元兑换率" prop="usdExchangeRate">
          <el-input v-model.number="dataForm.usdExchangeRate" placeholder="美元兑换率" :key="dataForm.originalCurrency"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" :loading="dialogLoading" @click="onDialogSubmit('dataForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '../lib/ajax';
import store from '../store/index';
import format from '../lib/format';
export default {
  data() {
    return {
      format: format,
      tableLoading: false,
      dialogVisible: false,
      rules: {

        // 如果输入的是Number,那么这里的type要设置为Number,而且input的v-model后也要写number后缀
        cnyExchangeRate: [{
          type: 'number',
          required: true,
          message: '人民币兑换率不能为空',
          trigger: 'blur'
        },{
          pattern: /^[0-9]+(.[0-9]{1,4})?$/,
          message: '人民币兑换率应为小数位最多四位的数字',
          trigger: 'blur'
        }],
        usdExchangeRate: [{
          type: 'number',
          required: true,
          message: '美元兑换率不能为空',
          trigger: 'blur'
        },{
          pattern: /^[0-9]+(.[0-9]{1,4})?$/,
          message: '美元兑换率应为小数位最多四位的数字',
          trigger: 'blur'
        }],
      },
      dataForm: {
        originalCurrency: '',
        originalCurrencyName: '',
        cnyExchangeRate: '',
        usdExchangeRate: '',
      },
      dialogLoading: false,
      tableData: [],
    }
  },
  created(){
    this.onSearch();
  },
  methods: {
    onDialogClose() {
      this.$refs.dataForm.resetFields();
    },
    onSearch() {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/exchange_rate/list', this.searchData)
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = (response.data.data || []);
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },
    handleEdit(index, row) {
      this.dialogVisible = true;

      // 清除表单数据的神器！！！
      this.$nextTick(() => {
        for(let key of Object.keys(this.dataForm)) {
          this.dataForm[key] = row[key];
        };
      });
    },

    onDialogSubmit(name) {
      let url = '/exchange_rate/modify';
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          ajax.post(url, this.dataForm)
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
            this.dialogLoading = false;
          });
        }
      })
    },
  }
}
</script>

<style lang="css">
</style>
