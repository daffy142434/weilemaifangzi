<template lang="html">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="90%"
    append-to-body
    @close="close"
  >
    <el-form :model="form" label-position="top" v-if="!isPreview">
      <div :key="`goods_${index}`" v-for="(item, index) in form.data">
        <el-row>
          <el-col :span="6">
            <el-form-item label="SKU">
              <div>{{item.sku}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所有待操作商品数：">
              <div>{{item.totalWaitOperateNum}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已处理商品数">
              <div>{{item.operatedNum}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="type==0">
            <el-form-item label="当前处理商品数">
              <el-input-number
                v-model="item.waitOperateNum"
                :max="item.totalWaitOperateNum - item.operatedNum"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注">
              <div>{{item.remark}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="type==1">
            <el-form-item label="剔退备注">
              <el-input type="textarea" v-model="remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div v-if="isPreview">
      <el-table
        :data="form.data"
        v-loading="loading"
        border
      >
        <el-table-column label="SKU" prop="sku">
        </el-table-column>
        <el-table-column label="所有待操作商品数" prop="totalWaitOperateNum">
        </el-table-column>
        <el-table-column label="已处理商品数" prop="operatedNum">
        </el-table-column>
        <el-table-column label="当前处理商品数" prop="waitOperateNum">
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="props">
            <remark-column :text="props.row.remark">
            </remark-column>
          </template>
        </el-table-column>
      </el-table>
      <div class="danger">请再次确认{{type==1?'剔退':'接收'}}商品信息</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" v-if="!isPreview">取 消</el-button>
      <el-button @click="isPreview = false;" v-if="isPreview">返回</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixin/dialog';
import loadingMixin from '@/mixin/loading';
import RemarkColumn from './remarkColumn';
import Warehouse from '../services';
import WAREHOUSE from '../const';

const warehouse = new Warehouse();

const { GOODS_STATUS } = WAREHOUSE;

export default {
  mixins: [dialogMixin, loadingMixin],
  components: {
    RemarkColumn,
  },
  data() {
    return {
      GOODS_STATUS,
      isPreview: false,
      id: '',
      operateId: '',
      loading: false,
      form: {
        data: [],
      },
      type:"",
      title:"",
      remark:""
    };
  },
  methods: {
    afterShow(id, operateId, data,type) {
      this.id = id,
      this.operateId = operateId;
      this.form.data = data;
      this.type=type;
      if(type==1){
        this.title="确认剔退商品";
      }else{
        this.title="确认接收商品";
      }
      this.remark="";
    },
    afterClose() {
      this.id = '';
      this.operateId = '';
      this.isPreview = false;
      this.form.data = [];
    },
    submit() {
      if (!this.isPreview) {
        this.isPreview = true;
        return;
      }
      const params = {};

      
      if(this.type==1){
        params.remark=this.remark;
        const r = warehouse.transfersReject(this.id, this.operateId, params);
        this.checkLoadingByPromise(r).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.$emit('success');
          this.close();
        });
      }else{
        this.form.data.forEach((item, index) => {
          const prefix = `goodsList[${index}]`;
          params[`${prefix}.storageOperateGoodsId`] = item.id;
          params[`${prefix}.sku`] = item.sku;
          params[`${prefix}.quantity`] = item.waitOperateNum;
        });
        const p = warehouse.transfersConfirm(this.id, this.operateId, params);
        this.checkLoadingByPromise(p).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.$emit('success');
          this.close();
        });
      }
      
    }
  },
};
</script>

<style lang="less">
</style>
