<template lang="html">
  <div>
    <div class="page-title">
      角色权限管理
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="角色名称">
          <el-input v-model="searchData.roleName" placeholder="角色名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div v-if="$store.state.powers.includes('member:role_add')" class="tools-bar">
      <el-button v-if="$store.state.powers.includes('member:role_add')" type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增角色并授权';roleForm.roleName='';dialogSize='large'">新增角色</el-button>
    </div>
    <div v-if="$store.state.powers.includes('member:role_list')">
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
          prop="roleName"
          label="角色名"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作权限"
          prop="permList"
          :formatter="permListFormatter">
        </el-table-column>
        <el-table-column
          v-if="$store.state.powers.includes('member:role_modify') || $store.state.powers.includes('member:role_delete')"
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <el-button v-if="$store.state.powers.includes('member:role_modify')" type="text" size="small" @click="handleEditRoleName(scope.$index, scope.row)">修改角色名</el-button>
            <el-button v-if="$store.state.powers.includes('member:role_modify')" type="text" size="small" @click="handlePower(scope.$index, scope.row)">授权</el-button>
            <el-button v-if="$store.state.powers.includes('member:role_delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()" width="80%">
      <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="80px">
        <el-form-item v-if="dialogTitle !== '角色授权'" label="角色名称" prop="roleName">
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
        <el-button type="info" @click="onEditSubmit" v-if="dialogTitle=='修改角色名称'">保存</el-button>
        <el-button type="info" @click="onEditRoleSubmit" v-if="dialogTitle=='角色授权'">保存</el-button>
        <el-button type="primary" @click="onAddSubmit" v-if="dialogTitle=='新增角色并授权'">立即创建</el-button>
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
      dialogSize: 'large',
      totalRecord: 0,
      pageSize: 10,
      pageNumber:1,
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
        roleName: ''
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
  created(){
    this.loadData();
    this.onSearch();
  },
  methods: {
    getTreeIndexByRootRoleId(id) {
      let index;
      const len = this.roleTree.length;
      for(index = 0; index < len; index++) {
        if (this.roleTree[index].id === id) {
          return index;
        }
      }
    },
    getRootRoleIdByRoleId(id) {
      for(let i = 0; i < this.roleTree.length; i++) {
        const roles = this.roleTree[i];
        let hasRole = this.getRole(roles.childPermList, id);
        if (hasRole) {
          return roles.id;
        }
      }
    },
    getRole(roles, id) {
      let hasRole;
      if(!roles) {
        return;
      }
      for(let i = 0; i < roles.length; i++) {
        const role = roles[i];
        if (role.id === id) {
          hasRole = true;
          break;
        } else if (role.childPermList) {
          hasRole = this.getRole(role.childPermList, id);
          if (hasRole) {
            break;
          }
        }
      }
      return hasRole
    },
    isLeaf(id) {
      let isLeaf;
      for(let i = 0; i < this.roleTree.length; i++) {
        const roles = this.roleTree[i];
        this.isLeafByRoleId(roles, id, () => {
          isLeaf = true;
        });
        if (isLeaf) {
          return true;
        }
      }
    },
    isLeafByRoleId(roles, id, fn) {
      if (roles.id === id) {
        if (!roles.childPermList && roles.parentId !== 0) {
          fn();
        }
      } else if (roles.childPermList) {
        roles.childPermList.map((role) => {
          this.isLeafByRoleId(role, id, fn);
        });
      }
    },
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
    handleReset() {
      this.searchData = {
        roleName: ''
      };
      this.onSearch();
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/members/roles/permissions/list', Object.assign({pageNumber, pageSize}, this.searchData))
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = response.data.data.data || [];
          this.totalRecord = response.data.data.totalRecord;
          if(pageNumber==1) this.pageNumber=1;
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },
    permListFormatter(row, column, cellValue) {
      let str = [];
      for(let item of cellValue) {
        str.push(item.permissionName);
      }
      return str.join('，');
    },
    operateFormatter(row, column, cellValue) {
      return '<el-button type="text" size="small">编辑</el-button>';
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/members/roles/'+row.id+'/delete')
        .then((response) => {
          if(response.data.code == 200) {
            this.$emit('requestRemoveComponentCache', 'submember');
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
      this.dialogSize = 'large';
      const keys = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
      this.roleForm.id = row.id;
      row.permList.map((role) => {
        let id, rootRoleId, treeIndex;
        if (this.isLeaf(role.id)) {
          id = role.id;
          rootRoleId = this.getRootRoleIdByRoleId(id);
          treeIndex = this.getTreeIndexByRootRoleId(rootRoleId);
          keys[treeIndex].push(id);
        }
      });
      setTimeout(() => {
        const trees = this.$refs.tree;
        trees.map((tree, index) => {
          tree.setCheckedKeys(keys[index]);
        });
      });
      this.dialogVisible = true;
      this.dialogTitle='角色授权';
    },
    handleEditRoleName(index, row) {
      this.dialogSize = 'tiny';
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
              this.$emit('requestRemoveComponentCache', 'submember');
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
              this.$emit('requestRemoveComponentCache', 'submember');
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
    onEditRoleSubmit() {
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
          ajax.post('/members/roles/'+this.roleForm.id+'/empower', this.roleForm)
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
