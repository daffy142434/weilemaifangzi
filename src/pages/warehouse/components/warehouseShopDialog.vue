<template lang="html">
  <el-dialog
    title="绑定亚马逊店铺"
    :visible.sync="visible"
    width="80%"
    class="warehouse-shops-dialog"
    @close="close"
  >
    <el-form
      ref="form"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="请勾选：" prop="status">
        <el-checkbox-group v-model="shopId" class="warehouse-shops">
          <div v-for="company in companies" :key="`company_${company.id}`">
            <strong style="font-size: 14px;">
              公司：{{company.companyName}}
            </strong>
            <div>
              <el-checkbox
                v-for="shop in company.shopSimpleList"
                :label="shop.id"
                :key="shop.id"
              >{{shop.shopName}}</el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment';
import extend from 'extend';
import getCountryNameByStationCode from '@/lib/getCountryNameByStationCode';
import Warehouse from '../services';

const warehouse = new Warehouse();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      id: '',
      shops: [],
      shopId: [],
      companies: [],
    };
  },
  methods: {
    submit() {
      this.loading = true;
      warehouse.relateShops(this.id, this.shopId).then(() => {
        this.loading = false;
        this.$message({
          type: 'success',
          message: '操作成功',
        });
        this.close();
      }).catch(() => {
        this.loading = false;
      });
    },
    show(id, data) {
      this.id = id;
      this.visible = true;
      this.loading = true;

      warehouse.getShops(id).then((res) => {
        const companies = res.data.data;
        const shopId = [];

        this.loading = false;
        this.companies = companies;
        companies.forEach((company) => {
          if (!company) {
            return;
          }
          if (!company.shopSimpleList) {
            return;
          }
          company.shopSimpleList.forEach((shop) => {

            if (shop.chooseFlag === 1) {
              shopId.push(shop.id);
            }
          });
          this.shopId = shopId;
        }).catch(() => {
          this.loading = false;
        });
      });
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
.warehouse-shops-dialog {
  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
}
.warehouse-shops {
  strong {
    display: block;
    padding: 0 10px;
    background: #efefef;
  }
}
</style>
