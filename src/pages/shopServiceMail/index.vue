<template lang="html">
  <div>
    <div class="page-title">
      店铺客服邮箱设置
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="店铺邮箱">
          <el-input v-model="searchData.email" placeholder="店铺邮箱" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="beforeSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button v-if="$store.state.powers.includes('shop_service_mail:add')" type="success" icon="el-icon-plus" size="small" @click="handleAdd">新增邮箱配置</el-button>
    </div>
    <div v-if="$store.state.powers.includes('shop_service_mail:list')">
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
          prop="companyName"
          label="公司"
          width="150">
        </el-table-column>
        <el-table-column
          prop="sendName"
          label="发件人昵称"
          width="150">
        </el-table-column>
        <el-table-column
          label="发送状态"
          width="80"
        >
          <template slot-scope="props">
            <el-tag
              type="success"
              class="tag-fill"
              size="small"
              v-if="props.row.sendActiveStatus === 1"
            >成功</el-tag>
            <el-tag
              type="danger"
              class="tag-fill"
              size="small"
              v-if="props.row.sendActiveStatus !== 1"
            >失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="接收状态"
          width="80"
        >
          <template slot-scope="props">
            <div>
              <el-tag
                type="success"
                class="tag-fill"
                size="small"
                v-if="props.row.receiveActiveStatus === 1"
              >成功</el-tag>
              <el-tag
                type="danger"
                class="tag-fill"
                size="small"
                v-if="props.row.receiveActiveStatus !== 1"
              >失败</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          width="200"
          label="店铺邮箱">
        </el-table-column>
        <el-table-column
          prop="notifyRole"
          :formatter="formatNotifyRole"
          width="150"
          label="通知角色">
        </el-table-column>
        <el-table-column
          prop="receiceHost"
          label="接收邮箱服务器"
          width="250">
        </el-table-column>
        <el-table-column
          prop="recvPort"
          label="收件端口"
          width="100">
        </el-table-column>
        <el-table-column
          prop="recvProtocol"
          label="收件协议"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sendHost"
          label="发送邮箱服务器"
          width="250">
        </el-table-column>
        <el-table-column
          prop="sendPort"
          label="发件端口"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sendProtocol"
          label="发件协议"
          width="100">
        </el-table-column>
        <el-table-column
          prop="useTls"
          label="是否用tls"
          :formatter="format.formatYesOrNo"
          width="100">
        </el-table-column>
        <el-table-column
          prop="voiceNotify"
          label="是否语音通知"
          :formatter="format.voiceNotify"
          width="125">
        </el-table-column>
        <el-table-column
          prop="useSsl"
          width="100"
          label="是否用ssl"
          :formatter="format.formatYesOrNo">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <mail-connect-test :data="scope.row"></mail-connect-test>
            <el-button v-if="$store.state.powers.includes('shop_service_mail:modify')" type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button v-if="$store.state.powers.includes('shop_service_mail:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="90%" @close="onDialogClose()">
      <el-form ref="mainForm" :rules="rules" :model="dataForm" label-width="140px" v-loading="loading">
        <el-row>
          <el-col :span="8">
            <el-form-item label="店铺邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="店铺邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发件人昵称" prop="sendName">
              <el-input v-model="dataForm.sendName" placeholder="发件人昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱密码" prop="sendPassword">
              <el-input type="password" v-model="dataForm.sendPassword" placeholder="邮箱密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="公司" prop="companyId">
              <el-select
                placeholder="请选择"
                v-model="dataForm.companyId"
                @change="handleCompanyChange"
              >
                <el-option label="请选择" value=""></el-option>
                <el-option
                  v-for="company in companys"
                  :key="company.id"
                  :label="company.companyName"
                  :value="company.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="店铺" prop="shopIdList">
              <el-checkbox-group v-model="dataForm.shopIdList" class="email-shop-list">
                <el-checkbox :label="shop.id" v-for="shop in shops" :key="shop.id">{{shop.shopName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="接收邮箱服务器" prop="receiceHost">
              <el-input v-model="dataForm.receiceHost" placeholder="接收邮箱服务器"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收件端口" prop="recvPort">
              <el-input v-model="dataForm.recvPort" placeholder="收件端口，大部分为993"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收件协议" prop="recvProtocol">
              <el-input readonly v-model="dataForm.recvProtocol" placeholder="收件协议"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发送邮箱服务器" prop="sendHost">
              <el-input v-model="dataForm.sendHost" placeholder="发送邮箱服务器"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送端口" prop="sendPort">
              <el-input v-model="dataForm.sendPort" placeholder="发送端口，大部分为465"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发件协议" prop="sendProtocol">
              <el-input readonly v-model="dataForm.sendProtocol" placeholder="发件协议"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="通知角色" prop="notifyRole">
              <el-select v-model.number="dataForm.notifyRole" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否用tls" prop="useTls">
              <el-radio-group v-model="dataForm.useTls">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <span class="gray" style="margin-left: 20px;">通常邮件服务方要求选是</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否语音通知" prop="voiceNotify">
              <el-radio-group v-model="dataForm.voiceNotify">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否用ssl" prop="useSsl">
              <el-radio-group v-model="dataForm.useSsl">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
              <span class="gray" style="margin-left: 20px;">通常邮件服务方要求选是</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="info" :loading="dialogLoading" @click="onDialogSubmit()" v-if="dialogTitle=='修改邮箱配置'">保存</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import extend from 'extend';
import ajax from '@/lib/ajax';
import format from '@/lib/format';
import ShopServiceMail from './services';
import MailConnectTest from './components/mailConnectTest';

const shopServiceMail = new ShopServiceMail();

export default {
  components: {
    'mail-connect-test': MailConnectTest
  },
  data() {
    return {
      format: format,
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 10,
      tableLoading: false,
      loading: false,
      dialogType: '',
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: '新增邮箱配置',
      companys: [],
      shops: [],
      roles: [],
      rules: {
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },{
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur, change'
        }],
        sendPassword: [{
          required: true,
          message: '请填写邮箱密码'
        }],
        sendName: [{
          required: true,
          message: '请填写发件人昵称'
        }],
        receiceHost: [{
          required: true,
          message: '请填写接收邮箱服务器'
        }],
        recvPort: [{
          required: true,
          message: '请填写收件端口'
        }],
        sendHost: [{
          required: true,
          message: '请填写发送邮箱服务器'
        }],
        sendPort: [{
          required: true,
          message: '请填写发送端口'
        }],
        companyId: [{
          required: true,
          message: '请选择公司'
        }],
        shopIdList: [{
          required: true,
          message: '请选择店铺'
        }],
        useTls: [{
          required: true,
          message: '请选择是否用Tls'
        }],
        voiceNotify: [{
          required: true,
          message: '请选择是否语音通知'
        }],
        useSsl: [{
          required: true,
          message: '请选择是否用ssl'
        }],
      },
      searchData: {
        email: ''
      },
      dataForm: {
        id: '',
        sendName: '',
        companyId: '',
        shopIdList: '',
        sendPassword: '',
        email: '',
        receiceHost: '',
        sendHost: '',
        recvPort: '',
        sendPort: '',
        recvProtocol: 'imap',
        sendProtocol: 'smtp',
        useTls: 1,
        voiceNotify: 1,
        notifyRole: '',
        useSsl: 1,
      },
      tableData: [],
    }
  },
  beforeCreate(){
    this.loading = true;
    ajax.post('/members/roles/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.roles = response.data.data;
          this.onSearch();
        }
      });
  },
  created() {
    this.$store.commit('setActiveMenuIndex', 'shopServiceMail');
  },
  methods: {
    shopFomat(row, column, cellValue) {
      // const shops = row.
      return '';
    },
    onDialogClose() {
      this.shops = [];
      this.dataForm.id = '';
      this.dataForm.sendName = '';
      this.dataForm.companyId = '';
      this.dataForm.shopIdList = '';
      this.dataForm.sendPassword = '';
      this.dataForm.email = '';
      this.dataForm.receiceHost = '';
      this.dataForm.sendHost = '';
      this.dataForm.recvPort = '';
      this.dataForm.sendPort = '';
      this.dataForm.recvProtocol = 'imap';
      this.dataForm.sendProtocol = 'smtp';
      this.dataForm.useTls = 1;
      this.dataForm.voiceNotify = 1;
      this.dataForm.notifyRole = '';
      this.dataForm.useSsl = 1;
      this.$refs.mainForm.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.beforeSearch();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.onSearch();
    },
    handleReset() {
      this.searchData = {
        email: ''
      };
      this.onSearch();
    },
    beforeSearch(){
      this.pageNumber=1;
      this.onSearch();
    },
    onSearch() {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/customer_center/email_config/list', {...this.searchData, pageNumber: this.pageNumber, pageSize})
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
      this.$confirm('确认删除该邮箱配置信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(`/customer_center/email_config/delete/${row.id}`)
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
    handleCompanyChange(id) {
      const company = this.companys.filter(company => company.id === id);

      this.dataForm.shopIdList = [];
      if (!company || (company && !company.length)) {
        this.shops = [];
        return;
      }

      this.shops = company[0].shopList;
    },
    loadCompanyList() {
      return shopServiceMail.getCompanyList().then((res) => {
        const companys = res.data.data || [];
        this.companys = companys.filter(company => !!company.id);
      });
    },
    handleAdd() {
      this.dialogType = 'add';
      this.dialogVisible = true;
      this.dialogTitle='新增邮箱配置';
      this.loadCompanyList();
    },
    handleEdit(index, row) {
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.dialogTitle = '修改邮箱配置';
      this.loading = true;
      this.loadCompanyList().then(() => {
        return shopServiceMail.getMailConfig(row.id);
      }).then((res) => {
        const data = res.data.data || {};
        setTimeout(() => {
        for(let key of Object.keys(this.dataForm)) {
          switch(key) {
            case 'recvProtocol':
              this.dataForm.recvProtocol = 'imap';
              break;
            case 'sendProtocol':
              this.dataForm.sendProtocol = 'smtp';
              break;
            case 'companyId':
              continue;
            default:
              this.dataForm[key] = data[key];
          }
        };
        });
        let shopList;
        let shopIdList = [];
        const {companyId, companyName} = data;
        const currentCompany = this.companys.filter(company => company.id === data.companyId);
        if (!currentCompany.length) {
          this.companys.push({
            id: companyId,
            companyName,
            shopList: []
          })
        }
        const companys = extend(true, [], this.companys).map((company) => {
          if (company.id === data.companyId) {
            shopList = extend(true, [], data.shopList).map((shop) => {
              /**
               * 由于公司列表返回的店铺shopId字段为id
               * 而详情接口返回的shopId字段为shopId
               * 所以需要前端做一下兼容处理
               */
              shop.id = shop.shopId;
              shopIdList.push(shop.shopId);
              return shop;
            });
            // 公司列表接口不会返回已分配店铺，需要把已选择的店铺拼接上
            company.shopList = company.shopList.concat(shopList);
            company.shopList.sort((a, b) => {
              if (a.shopName > b.shopName) {
                return 1;
              } else if (a.shopName < b.shopName) {
                return -1;
              } else {
                return 1;
              }
            })
          }
          return company;
        });
        this.companys = companys;
        setTimeout(() => {
          this.dataForm.companyId = data.companyId;
          this.handleCompanyChange(data.companyId);
          this.dataForm.shopIdList = shopIdList;
        });
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });

    },
    handleMailConnectTest(row) {
      shopServiceMail.mailConnectTest(row.id);
    },
    onDialogSubmit() {
      let url;

      if (this.dialogType === 'add') {
        url = '/customer_center/email_config/add';
      } else {
        url = `/customer_center/email_config/update/${this.dataForm.id}`
      }

      this.$refs.mainForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          const params = extend(true, {}, this.dataForm);
          params.shopIdList.map((shopId, index) => params[`shopIdList[${index}]`] = shopId);
          delete params.shopIdList;
          ajax.post(url, params)
          .then((response) => {
            this.dialogLoading = false;
            if(response.data.code == 200) {
              // 因为要显示初始密码，所以讲提示信息的显示时长设置为30秒
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch({pageNumber: 1});
              this.dialogVisible = false;
            }
          })
          .catch((error) => {
            this.dialogLoading = false;
          });
        }
      })
    },
    formatNotifyRole(row, col, val) {
      const role = this.roles.filter(role => role.id === val);

      if (role && role.length) {
        return role[0].roleName;
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="less">
.email-shop-list {
  .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
  }
}
</style>
