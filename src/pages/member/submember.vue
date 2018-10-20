<template lang="html">
  <div>
    <div class="page-title">
      子用户管理
    </div>
    <div class="search-bar">
      <el-form :inline="true" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="登录名称">
          <el-input v-model="searchData.loginName" placeholder="登录名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div v-if="$store.state.powers.includes('member:sub_add')" class="tools-bar">
      <el-button v-if="$store.state.powers.includes('member:sub_add')" type="success" icon="el-icon-plus" size="small" @click="showAddUserDialog">新增子用户</el-button>
    </div>
    <div v-if="$store.state.powers.includes('member:sub_list')">
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
          prop="status"
          label="停用/启用"
          align="center"
          min-width="100">
          <template slot-scope="scope">
            <!-- <el-tag class="tag-fill" v-if="scope.row.status=='1'" type="success">启用</el-tag>
            <el-tag class="tag-fill" v-if="scope.row.status=='0'" type="danger">停用</el-tag> -->
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text=""
              inactive-text=""
              @change="handleStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="登录名"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="name"
          label="真实姓名"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          width="130">
        </el-table-column>
        <el-table-column
          prop="roleList"
          :formatter="roleFormatter"
          width="200"
          label="权限">
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="200"
          label="联系地址">
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱"
          min-width="210">
        </el-table-column>
        <el-table-column
          prop="sessionKeepText"
          label="保持会话"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          label="最后登录时间"
          :formatter="toDateTime"
          width="170">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="170">
          <template slot-scope="scope" v-if="$store.state.powers.includes('member:sub_add') || $store.state.powers.includes('member:sub_reset_pwd') || $store.state.powers.includes('member:sub_active')">
            <div>
              <el-button v-if="$store.state.powers.includes('member:sub_modify')" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button v-if="$store.state.powers.includes('member:sub_reset_pwd')" type="text" size="small" @click="handleResetPwd(scope.$index, scope.row)">重置密码</el-button>
              <!-- <el-button v-if="scope.row.status==1&&$store.state.powers.includes('member:sub_active')" type="text" size="small" @click="handleChangeStatus(scope.$index, scope.row)">停用</el-button>
              <el-button v-if="scope.row.status==0&&$store.state.powers.includes('member:sub_active')" type="text" size="small" @click="handleChangeStatus(scope.$index, scope.row)">启用</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleTreeCurrentChange"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :current-page.sync="pageNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="90%" @close="onDialogClose()">
      <el-row v-loading="dialogLoading">
        <el-col :span="12">
          <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="80px">
            <div class="hide-input-group__prepend">
              <el-form-item label="登录名" prop="loginName">
                <template v-if="dialogTitle=='修改用户信息'">
                  {{dataForm.loginName}}
                </template>
                <el-input v-else v-model="dataForm.loginName" placeholder="登录名">
                  <template slot="prepend">
                    {{dataForm.prependName}}:
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <el-form-item label="用户角色" prop="roleIds">
              <el-select v-model="dataForm.tempRoleIds" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="真实姓名" prop="name">
              <el-input v-model="dataForm.name" placeholder="真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="dataForm.mobile" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="dataForm.address" placeholder="联系地址"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="保持会话" prop="sessionKeepFlag">
              <el-radio-group v-model="dataForm.sessionKeepFlag">
                <el-radio :label="0">不保持</el-radio>
                <el-radio :label="1">保持</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="info" @click="onDialogSubmit()" v-if="dialogTitle=='修改用户信息'">保存</el-button>
              <el-button type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-tree
            :data="companys"
            class="submenu-company-tree"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
          >
          </el-tree>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/lib/ajax';
import moment from 'moment';
import format from '@/lib/format';
import Member from './services';

const member = new Member();

export default {
  data() {
    return {
      totalRecord: 0,
      pageSize: 10,
      pageNumber:1,
      tableLoading: false,
      dialogVisible: false,
      dialogTitle: '新增子用户',
      dialogLoading: false,
      roles: [],
      companys: [],
      userCompanyList: [],
      searchData: {
        loginName: ''
      },
      dataForm: {
        id: '',
        prependName: '',
        loginName: '',
        shopIds: '',
        tempRoleIds: [],
        roleIds: '',
        name: '',
        mobile: '',
        address: '',
        email: '',
        sessionKeepFlag: 0
      },
      tableData: [],
      rules: {
        loginName: [{
          required: true,
          message: '登录名不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 50,
          message: '登录名长度在 1 到 50 个字符',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '真实姓名不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 20,
          message: '真实姓名长度在 1 到 20 个字符',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '联系电话不能为空',
          trigger: 'blur'
        }, {
          pattern: /^(13|15|18|14|17)[0-9]{9}$/,
          message: '手机号码格式不正确',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },{
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur, change'
        }],
      },
      defaultProps: {
        label: 'companyName',
        isLeaf: 'leaf'
      }
    };
  },
  beforeCreate(){
    ajax.post('/members/roles/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.roles = response.data.data;
        }
      });
    ajax.post('/members/companys/list', {queryShop: true})
      .then((response) => {
        const companys = (response.data.data || []).map((company) => {
          const children = !company.shopList ? [] : company.shopList.map((shop) => {
            return {
              label: shop.shopName,
              id: shop.id
            }
          });
          return {
            label: company.companyName,
            id: `c_${company.id}`,
            children
          }
        });
        this.companys = companys;
      });
  },
  created() {
    this.dataForm.prependName = localStorage.getItem('loginName');
    this.onSearch();
    window.vm = this;
  },
  methods: {
    handleStatus(row){
      let activeStatus = row.status;
      ajax.post('/members/subs/'+row.id+'/active', {activeStatus})
        .then((response) => {
          if(response.data.code == 200) {
            this.$message({
              showClose: true,
              message: response.data.msg || '操作成功',
              type: 'success'
            });
          }else{
            row.status=row.status == 1 ? 0 : 1;
          }
        });
    },
    showAddUserDialog() {
      this.dialogVisible = true;
      this.dialogTitle='新增子用户';
      ajax.post('/members/roles/list')
        .then((response) => {
          if(response.data.code == 200) {
            this.roles = response.data.data;
          }
        });
    },
    onDialogClose() {
      this.dataForm.id = '';
      this.dataForm.prependName = localStorage.getItem('loginName');
      this.dataForm.loginName = '';
      this.dataForm.shopIds = '';
      this.dataForm.tempRoleIds = [];
      this.dataForm.roleIds = '';
      this.dataForm.name = '';
      this.dataForm.mobile = '';
      this.dataForm.address = '';
      this.dataForm.email = '';
      this.dataForm.sessionKeepFlag = 0;
      this.$refs.tree.setCheckedKeys([]);
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
        loginName: ''
      };
      this.onSearch();
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/members/subs/list', Object.assign({pageNumber, pageSize}, this.searchData))
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          const tableData = response.data.data.data || [];
          const sessionKeepMap = ['不保持', '保持'];
          this.tableData = tableData.map((d) => {
            d.sessionKeepText = sessionKeepMap[d.sessionKeepFlag];
            return d;
          });
          this.totalRecord = response.data.data.totalRecord;
          if(pageNumber==1) this.pageNumber=1;
        }
      })
      .catch((error) => {
        this.tableLoading = false;
      });
    },
    toDateTime(row, column, cellValue) {
      return format.toDateTime(cellValue);
    },
    roleFormatter(row, column, cellValue) {
      let result = [];
      if(typeof cellValue == 'object' && cellValue.length > 0) {
        for(let item of cellValue) {
          result.push(item.roleName);
        }
      }
      return result.join('，');
    },
    handleChangeStatus(index, row) {
      let activeStatus = row.status == 1 ? 0 : 1;
      let confirmMsg = activeStatus == 1 ? '确认启用该用户？' : '确认停用该用户？';
      this.$confirm(confirmMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/members/subs/'+row.id+'/active', {activeStatus})
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
    handleResetPwd(index, row) {
      this.$confirm('确认重置该用户的登录密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/members/subs/'+row.id+'/reset/pwd')
        .then((response) => {
          if(response.data.code == 200) {
            this.$message({
              showClose: true,
              message: response.data.data ? ('用户：'+row.loginName+'的初始登录密码为：'+response.data.data) : '操作成功',
              type: 'success'
            });
            this.onSearch({pageNumber: 1});
          }
        });
      });
    },

    setCheckedShops() {
      const keys = [];
      this.userCompanyList.map((company) => {
        company.shopList.map((shop) => {
          keys.push(shop.shopId);
        });
      });
      this.$refs.tree.setCheckedKeys(keys);
    },
    // todo..
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.dialogTitle='修改用户信息';
      this.dataForm.tempRoleIds = [];
      this.dialogLoading = true;
      ajax.post('/members/roles/list')
        .then((response) => {
          if(response.data.code == 200) {
            this.roles = response.data.data;
          }
        });
      for(let x of Object.keys(this.dataForm)) {
        if(x == 'tempRoleIds' && typeof row.roleList == 'object' && row.roleList.length > 0) {
          for(let item of row.roleList) {
            this.dataForm.tempRoleIds.push(item.id);
          }
        }else {
          this.dataForm[x] = row[x];
        }
      }
      if (!this.dataForm.tempRoleIds) {
        this.dataForm.tempRoleIds = [];
      }
      setTimeout(() => {
        this.$refs.tree.setCheckedNodes([]);
      })
    ajax.post('/members/roles/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.roles = response.data.data;
        }
      });
      member.getCompanyListByUserNo(row.userNo).then((res) => {
        this.userCompanyList = res.data.data || [];
        this.setCheckedShops();
        this.dialogLoading = false;
      }).catch(() => {
        this.dialogLoading = false;
      });
    },
    onExpand() {
    },
    onDialogSubmit() {
      let dataForm = this.dataForm;
      let url = dataForm.id ? ('/members/subs/'+this.dataForm.id+'/modify') : '/members/subs/add';
      this.getShopIds();
      let shopIds = this.dataForm.shopIds;
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if(typeof dataForm.tempRoleIds != 'object' || dataForm.tempRoleIds.length <= 0) {
            this.$message({
              showClose: true,
              message: '请选择角色',
              type: 'warning'
            });
            return;
          }
          // if(typeof dataForm.shopIds != 'string' || dataForm.shopIds <= 0) {
          //   this.$message({
          //     showClose: true,
          //     message: '请选择店铺',
          //     type: 'warning'
          //   });
          //   return;
          // }
          dataForm.roleIds = dataForm.tempRoleIds.join(',');

          let data = Object.assign({}, dataForm);
          data.loginName = data.prependName +':'+ data.loginName;
          ajax.post(url, data)
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
    getShopIds() {
      const shopIds = this.$refs.tree.getCheckedKeys() || [];
      this.dataForm.shopIds = shopIds.filter((shopId) => {
        return (shopId || '').toString().indexOf('c_') === -1;
      }).join(',');
    },
    handleTreeCurrentChange(pageNumber) {
      this.onSearch({pageNumber});
    },
  }
}
</script>

<style lang="less">
  .el-col {
    padding: 0 15px;
  }
  .hide-input-group__prepend {
    .el-input-group__prepend {
      background: transparent;
    }
  }
  .submenu-company-tree {
    border: #DDD 1px solid;
    padding: 10px;
  }
</style>
