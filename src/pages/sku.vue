<template lang="html">
  <div>
    <div class="page-title">
      SKU认领
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="SKU">
          <el-input v-model="searchData.sku" placeholder="SKU" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="店铺">
          <el-select v-model="searchData.shopId" placeholder="请选择">
            <el-option
              v-for="item in shops"
              :key="item.id"
              :label="item.shopName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="tableLoading"
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
        prop="platform"
        label="平台名称"
        width="150">
      </el-table-column>
      <el-table-column
        label="店铺名称"
        prop="shopName">
      </el-table-column>
      <el-table-column
        width="200"
        label="平台SKU"
        prop="relationSku">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleGoodsRelationSku(scope.$index, scope.row)">SKU认领</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">SKU删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-bar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle=='新增角色并授权' || dialogTitle=='角色授权'" label="权限">
          <el-tabs type="border-card">
            <template v-for="role in roleTree">
              <el-tab-pane :label="role.permissionName">
                <el-tree
                  :data="role.childPermList"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :props="defaultTreeProps">
                </el-tree>
              </el-tab-pane>
            </template>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" @click="onEditSubmit" v-if="dialogTitle=='角色授权' || dialogTitle=='修改角色名称'">保存</el-button>
        <el-button type="primary" @click="onAddSubmit" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// todo  1.授权功能因为插件原因反显有问题，比较棘手
import ajax from '../lib/ajax';
export default {
  data() {
    return {
      shops: [],
      totalRecord: 0,
      pageSize: 10,
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: '新增角色并授权',
      defaultTreeProps: {
        children: 'childPermList',
        label: 'permissionName'
      },
      rules: {
        roleName: [{
          required: true,
          message: '角色名称不能为空',
          trigger: 'blur'
        }]
      },
      searchData: {
        sku: '',
        shopId: '',
      },
      roleForm: {
        id: '',
        roleName: '',
        permissions: '',
      },
      roleTree: [],
      tableData: [],
    }
  },
  beforeCreate(){
    ajax.post('/shops/list_all')
    .then((response) => {
      if(response.data.code == 200) {
        this.shops = response.data.data;
      }
    });
  },
  created(){
    this.loadData();
    this.onSearch();
  },
  methods: {
    loadData() {
      ajax.get('/members/permissions/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.roleTree = response.data.data;
        }
      });
    },
    onDialogClose() {
      this.$refs.roleForm.resetFields();
      if(this.$refs.tree) {
        for(let tree of this.$refs.tree) {
          tree.setCheckedKeys([]);
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val});
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/products/sku_relation_allot/list', Object.assign({pageNumber, pageSize}, this.searchData))
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = response.data.data.data || [];
          this.totalRecord = response.data.data.totalRecord;
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },

    handleDelete(index, row) {
      this.$confirm('确认删除该SKU?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/products/sku_relation/delete', {allotId: row.id})
        .then((response) => {
          if(response.data.code == 200) {
            this.$message({
              showClose: true,
              message: response.data.msg || '操作成功',
              type: 'success'
            });
            this.onSearch({pageNumber: 1});
          }
        });
      });
    },
    handlePower(index, row) {
      this.dialogVisible = true;
      this.dialogTitle='角色授权';
    },
    handleEditRoleName(index, row) {
      for(let x of Object.keys(this.roleForm)) {
        this.roleForm[x] = row[x];
      }
      this.dialogVisible = true;
      this.dialogTitle='修改角色名称';
    },
    onAddSubmit() {
      this.getPermissions();
      let permissions = this.roleForm.permissions;
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if(!permissions) {
            this.$message({
              showClose: true,
              message: '请选择权限',
              type: 'warning'
            });
            return;
          }
          ajax.post('/members/roles/add', this.roleForm)
          .then((response) => {
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({pageNumber: 1});
              this.dialogVisible = false;
            }
          });
        }
      })
    },
    onEditSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          ajax.post('/members/roles/'+this.roleForm.id+'/name/modify', this.roleForm)
          .then((response) => {
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({pageNumber: 1});
              this.dialogVisible = false;
            }
          });
        }
      })
    },
    getPermissions() {
      let set = new Set();
      for(let tree of this.$refs.tree) {

        // 对选中的节点进行处理
        let nodes = tree.getCheckedNodes();
        for(let node of nodes) {
          let {id, parentId} = node;
          set.add(id);
          set.add(parentId);
        }

        // 对半选中状态的节点进行处理
        let nodesDOM = tree.$el.querySelectorAll('.el-tree-node');
        let nodesVue = [].map.call(nodesDOM, node => node.__vue__);
        for(let node of nodesVue.filter(item => item.indeterminate === true)) {
          let {id, parentId} = {id: node.$options.propsData.node.data.id, parentId: node.$options.propsData.node.data.parentId};
          set.add(id);
          set.add(parentId);
        }
      }

      this.roleForm.permissions = [...set].join(',');
    },
  }
}
</script>

<style lang="css">
</style>
