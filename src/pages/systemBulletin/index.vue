<template lang="html">
  <div>
    <div class="page-title">
      系统公告
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公告内容">
          <el-input v-model="searchData.bulletinContent"></el-input>
        </el-form-item>
        <el-form-item label="公告时间">
          <el-date-picker value-format="yyyy-mm-dd hh:mm:ss" v-model="searchData.bulletinTime"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset" style="margin-left: 10px;">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button type="success" size="small" @click="handleAddBulletin" v-if="$store.state.powers.includes('system:bulletin_add')">添加公告</el-button>
    </div>
    <div v-if="$store.state.powers.includes('system:bulletin_list')">
      <el-table
        v-loading.body="loading"
        ref="currencyTable"
        :data="data"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="公告内容"
          prop="bulletinContent"
        >
        </el-table-column>
        <el-table-column
          label="公告时间"
          width="180"
        >
          <template slot-scope="props">
            <span v-datetime="props.row.bulletinTime"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
        >
          <template slot-scope="props">
            <confirm-popover
              :data="props.row"
              :onSubmit="handleDelete"
            >
              <p slot="content">是否删除此公告？</p>
              <el-button type="text" slot="entry" v-if="$store.state.powers.includes('system:bulletin_delete')">删除</el-button>
            </confirm-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <add-bulletin-dialog ref="addBulletinDialog" @addSuccess="onSearch"></add-bulletin-dialog>
  </div>
</template>

<script>
import ConfirmPopover from '@/components/confirm-popover';
import SystemBulletin from './services';
import AddBulletinDialog from './components/addBulletinDialog';

const systemBulletin = new SystemBulletin();

export default {
  created() {
    this.onSearch();
  },
  components: {
    'confirm-popover': ConfirmPopover,
    'add-bulletin-dialog': AddBulletinDialog
  },
  data() {
    return {
      loading: false,
      data: [],
      totalRecord: 0,
      searchData: {
        bulletinContent: '',
        bulletinTime: '',
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.searchData.pageNumber = val;
      this.onSearch();
    },
    handleAddBulletin() {
      this.$refs.addBulletinDialog.show();
    },
    handleReset() {
      this.searchData = {
        bulletinContent: '',
        bulletinTime: '',
        pageNumber: 1,
        pageSize: 10
      };
      this.onSearch();
    },
    onSearch() {
      this.loading = true;
      systemBulletin.getList(this.searchData).then((res) => {
        const data = res.data.data;
        this.data = data.data;
        this.totalRecord = data.totalRecord;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleDelete(data, cb) {
      systemBulletin.doDelete(data.id).then(() => {
        this.onSearch();
        cb();
      });
    }
  }
}
</script>

<style lang="css">
</style>
