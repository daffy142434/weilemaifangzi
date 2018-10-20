<template lang="html">
  <el-dialog
    title="处理异常商品"
    ref="dialog"
    width="90%"
    :visible.sync="visible"
    @close="close"
  >
    <div class="dialog-list-form outlier-operation-list-form">
      <div class="dialog-list" :style="listStyle">
        <el-table
          v-loading.body="tableLoading"
          ref="currencyTable"
          :data="remarkList"
          :height="286"
          border
        >
          <el-table-column
            label="处理人"
            prop="creator"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="处理时间"
            width="160"
          >
            <template slot-scope="scope">
              <span v-datetime="scope.row.createTime"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
          >
            <template slot-scope="scope">
              <el-popover
                ref="remarkPop"
                placement="right"
                width="200"
                trigger="hover"
                :content="scope.row.remark">
              </el-popover>
              <div class="outlier-remark" v-popover:remarkPop>{{scope.row.remark}}</div>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div class="dialog-form" v-if="type === 'exception'">
        <el-form ref="form" label-position="top" :model="form" v-loading="formLoading" :rules="rules">
          <el-form-item label="处理状态：" prop="processStatus">
            <el-select v-model="form.processStatus">
              <el-option label="待处理" value="1"></el-option>
              <el-option label="处理中" value="2"></el-option>
              <el-option label="已处理" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :rows="8" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AmaOnlineProductOutlier from '../services';

const amaOnlineProductOutlier = new AmaOnlineProductOutlier();

export default {
  props: ['type'],
  data() {
    return {
      visible: false,
      tableLoading: false,
      formLoading: false,
      id: '',
      listStyle: '',
      form: {
        processStatus: '1',
        remark: ''
      },
      rules: {
        processStatus: [
          {
            required: true,
            message: '请选择处理状态'
          }
        ],
        remark: [
          {
            required: true,
            message: '请填写处理备注'
          }
        ]
      },
      remarkList: []
    }
  },
  updated() {
    if (this.type === 'exception') {
      this.listStyle = 'width: 60%';
    } else {
      this.listStyle = 'width: 100%;';
    }
  },
  methods: {
    show(data) {
      const {id, processStatus} = data;
      this.visible = true;
      this.id = id;
      this.form.processStatus = processStatus.toString();
      this.loadRemarkList(id);
    },
    loadRemarkList(id) {
      this.tableLoading = true;
      amaOnlineProductOutlier.getRemarkList(id).then((res) => {
        this.remarkList = res.data.data || [];
        this.tableLoading = false;
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    close() {
      this.visible = false;
      this.tableLoading = false;
      this.formLoading = false;
      this.remarkList = [];
      this.form.remark = '';
      this.$refs.form.resetFields();
    },
    submit() {
      if (this.type === 'exception') {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return;
          }
          this.formLoading = true;
          amaOnlineProductOutlier.operation(this.id, this.form).then((res) => {
            this.visible = false;
            this.$emit('operationSuccess');
            this.formLoading = false;
          }).catch(() => {
            this.formLoading = false;
          });
        });
      } else {
        this.close();
      }
    }
  }
}
</script>

<style lang="less">
.outlier-operation-list-form {
  .dialog-list {
    min-width: 700px;
    max-width: 100%;
  }
  .outlier-remark {
    max-height: 48px;
    overflow: hidden;
  }
}
</style>
