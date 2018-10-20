<template lang="html">
  <div>
    <div class="page-title">
      公司管理
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-form-item label="公司名称">
          <el-input v-model="searchData.companyName" placeholder="公司名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="searchData.shopName" placeholder="店铺名称" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="search-bar">
      <ul>
        <li>第一步：在各洲亚马逊后台对ERP授权</li>
        <li>第二步：新增公司</li>
        <li>第三步：对该公司依次添加实际在售国的站点</li>
      </ul>
    </div>
    <div v-if="$store.state.powers.includes('member:company_add')" class="tools-bar">
      <el-button v-if="$store.state.powers.includes('member:company_add')" type="success" icon="el-icon-plus" size="small" @click="companyDialogVisible = true;companyDialogTitle='新增公司'">新增公司</el-button>
    </div>
    <el-table
      v-loading.body="companyTableLoading"
      v-if="$store.state.powers.includes('member:company_list')"
      ref="companyTable"
      @expand-change="handleCompanyRowExpand"
      :data="companyTableData"
      border
      highlight-current-row
      style="width: 100%">
      <el-table-column
        type="expand"
        v-if="$store.state.powers.includes('member:company_shop_list')"
        width="60">
        <template slot-scope="props">
          <el-table
            v-loading.body="shopTableLoading"
            ref="shopTable"
            :data="props.row.shops"
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              width="60">
            </el-table-column>
            <el-table-column
              label="店铺名称"
              width="200"
            >
              <template slot-scope="props">
                {{props.row.shopName}}
                <el-tooltip placement="top" v-if="props.row.isShopActiveSuccess">
                  <div slot="content">连线成功</div>
                  <el-tag
                    type="success"
                    size="mini"
                    class="tag-fill"
                  >连线成功</el-tag>
                </el-tooltip>
                <el-tooltip placement="top" v-if="props.row.isShopActiveFail">
                  <div slot="content">ERP中亚马逊信息填写有误，或未在亚马逊后台向ERP授权</div>
                  <el-tag
                    type="danger"
                    size="mini"
                    class="tag-fill"
                  >连线失败</el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="平台登录用户名"
              width="150"
              prop="shopAuthName">
            </el-table-column>

            <el-table-column
              label="平台站点"
              :formatter="marketFormat"
              width="100"
              prop="shopAuthParam">
            </el-table-column>
            <el-table-column
              label="业绩归属部门"
              width="150"
              prop="pmDepartmentName">
            </el-table-column>
            <el-table-column
              label="业绩归属人"
              width="150"
              prop="pmUserName">
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark">
            </el-table-column>
            <el-table-column
              label="操作"
              width="140">
              <template slot-scope="scope">
                <el-button v-if="$store.state.powers.includes('member:company_shop_modify')" type="text" size="small" @click="handleEditShop(scope.$index, scope.row)">修改</el-button>
                <el-button v-if="$store.state.powers.includes('member:company_shop_delete')" type="text" size="small" @click="handleDeleteShop(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="company.companyName"
        label="公司名称">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button v-if="$store.state.powers.includes('member:company_edit')" type="text" size="small" @click="handleEditCompany(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="$store.state.powers.includes('member:company_delete')" type="text" size="small" @click="handleDeleteCompany(scope.$index, scope.row)">删除</el-button>
          <el-tooltip class="item" effect="dark" content="一套公司资料如有多国站点，需多次添加" placement="top">
            <el-button v-if="$store.state.powers.includes('member:company_shop_add')" type="text" size="small" @click="handleAddShop(scope.$index, scope.row)">添加店铺</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="companyDialogTitle" :visible.sync="companyDialogVisible" @close="onCompanyDialogClose()">
      <el-form ref="companyDataForm" :rules="rules" :model="companyDataForm" label-width="80px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="companyDataForm.companyName" placeholder="开立一套亚马逊账户对应的公司资料名称，例如：联想控股"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="companyDialogVisible = false">取 消</el-button>
        <el-button type="info" @click="onCompanyDialogSubmit" v-if="companyDialogTitle=='修改公司信息'">保存</el-button>
        <el-button type="primary" @click="onCompanyDialogSubmit" v-else>立即创建</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="shopDialogTitle" :visible.sync="shopDialogVisible" @close="onShopDialogClose()">
      <el-form ref="shopDataForm" :rules="shopRules" :model="shopDataForm" label-width="140px">
        <el-form-item label="平台名称" prop="shopPlatform">
          亚马逊
        </el-form-item>
        <el-form-item label="平台站点" prop="marketId">
          <el-select v-model="shopDataForm.marketId" placeholder="请选择" style="width: 100%;" @change="getInfo">
            <el-option
              v-for="item in markets"
              :key="item.id"
              :label="item.marketName"
              :value="item.marketId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="shopDataForm.shopName" placeholder="ERP内部别名  建议取名:店铺简称-国家名，以便展示区分"></el-input>
        </el-form-item>
        <el-form-item label="平台登录用户名" prop="shopAuthName">
          <el-input v-model="shopDataForm.shopAuthName" placeholder="平台登录用户名"></el-input>
        </el-form-item>
        <el-form-item label="Seller ID" prop="sellerId">
          <el-input v-model="shopDataForm.sellerId" placeholder="Seller ID"></el-input>
        </el-form-item>
        <el-form-item label="MWS Auth Token" prop="MWSAuthToken">
          <el-input v-model="shopDataForm.MWSAuthToken" placeholder="MWS Auth Token"></el-input>
        </el-form-item>
        <el-form-item label="业绩归属部门">
          <el-select
            style="width: 100%"
            :multiple-limit="1"
            v-model="shopDataForm.pmDepartmentIds"
            multiple
            default-first-option
            no-data-text="可输入关键字搜索，如果没有结果可直接输入回车确认"
            filterable
            allow-create
            placeholder="可输入关键字搜索，如果没有结果可直接输入回车确认">
            <el-option
              v-for="item in pmDepartments"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业绩归属人">
          <el-select v-model="shopDataForm.pmUserNo" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in developers"
              :key="item.userNo"
              :label="item.loginName+'( '+item.name+' )'"
              :value="item.userNo">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="shopDataForm.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shopDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onShopDialogSubmit">{{shopDialogSaveButtonText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/lib/ajax';
import trim from '@/lib/trim';
import store from '../store/index';

const SHOP_ACTIVE_STATUS = {
  SUCCESS: 1,
  FAIL: 0
};

const SHOP_DIALOG_TYPE = {
  ADD: 'add',
  EDIT: 'edit',
  RECONNECT: 'reconnect'
}

export default {
  data() {
    return {
      SHOP_DIALOG_TYPE,
      companyTableLoading: false,
      shopTableLoading: false,
      companyDialogVisible: false,
      shopDialogVisible: false,
      companyDialogTitle: '新增公司',
      shopDialogTitle: '新增店铺',
      shopDialogType: SHOP_DIALOG_TYPE.ADD,
      shopDialogSaveButtonText: '保存',
      rules: {
        companyName: [{
          required: true,
          message: '公司名称不能为空',
          trigger: 'blur'
        }]
      },
      shopRules: {
        marketId: [{
          required: true,
          message: '请选择平台站点',
          trigger: 'blur'
        }],
        shopAuthName: [{
          required: true,
          message: '请输入平台登录用户名',
          trigger: 'blur'
        }],
        sellerId: [{
          required: true,
          message: '请输入Seller ID',
          trigger: 'blur'
        }],
        MWSAuthToken: [{
          required: true,
          message: '请输入MWS Auth Token',
          trigger: 'blur'
        }],
        shopName: [{
          required: true,
          message: '请输入店铺名称',
          trigger: 'blur'
        }, {
          min: 1,
          max: 50,
          message: '店铺名称长度在 1 到 50 个字符',
          trigger: 'blur'
        }],
        remark: [{
          min: 0,
          max: 200,
          message: '备注最多只能有 200 个字符',
          trigger: 'blur'
        }],
      },
      searchData: {
        companyName: '',
        shopName: '',
      },
      companyDataForm: {
        id: '',
        companyName: ''
      },
      shopDataForm: {
        id: '',
        memberCompanyId: '',
        marketId: '',
        shopPlatform: 'ama',
        shopName: '',
        shopAuthName: '',
        sellerId: '',
        MWSAuthToken: '',
        pmDepartmentIds: [],
        pmDepartmentId: '',
        pmDepartmentName: '',
        pmUserNo: [],
        shopAuthParam: {sellerId:"",MWSAuthToken:"",marketId:""},
        remark: '',
      },
      companyTableData: [],
      shopTableData: [],
      markets: [],
      developers: [],
      pmDepartments: [],
    }
  },
  beforeCreate() {

    // 查询平台站点
    ajax.post('/shops/ama_market/list')
    .then((response) => {
      if(response.data.code == 200) {
        this.markets = response.data.data;
      }
    });

    // 查询所有会员
    ajax.post('/members/list_all')
    .then((response) => {
      if(response.data.code == 200) {
        this.developers = response.data.data || [];
      }
    });

  },
  created(){
    this.loadData();
    this.onSearch();
    this.queryDepartments();
    this.$store.commit('setActiveMenuIndex', 'company');
  },
  methods: {
    getInfo(){
      this.shopDataForm.shopAuthName="";
      this.shopDataForm.sellerId="";
      this.shopDataForm.MWSAuthToken="";
      ajax.post('/shops/check_station',{marketId:this.shopDataForm.marketId,memberCompanyId:this.shopDataForm.memberCompanyId,shopPlatform:this.shopDataForm.shopPlatform})
      .then((response) => {
        if(response.data.code == 200) {
          let data=response.data.data;
          if(data){
            this.$confirm('你已有该洲的其他店铺，根据亚马逊特性，MWS信息是相同的，是否快速复制MWS资料填入？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              this.shopDataForm.shopAuthName=data.shopAuthName;
              const shopData=JSON.parse(data.shopAuthParam);
              this.shopDataForm.sellerId=shopData.sellerId;
              this.shopDataForm.MWSAuthToken=shopData.MWSAuthToken;
            })
          }
        }
      });
    },
    queryDepartments() {
      // 查询所有部门
      ajax.post('/members/department/list_all')
      .then((response) => {
        if(response.data.code == 200) {
          this.pmDepartments = response.data.data || [];
        }
      });
    },
    marketFormat(row, column, cellValue) {
      let market = this.markets.filter((item) => item.marketId == JSON.parse(cellValue)['marketId']);
      return (Array.isArray(market) && market.length == 1) ? market[0].marketName : '';
    },
    loadData() {
      ajax.get('/members/permissions/list')
      .then((response) => {
        if(response.data.code == 200) {
          this.roleTree = response.data.data;
        }
      });
    },
    onCompanyDialogClose() {
      this.companyDataForm.id = '';
      this.companyDataForm.companyName = '';
    },
    onShopDialogClose() {
      this.shopDataForm.id = '';
      this.shopDataForm.memberCompanyId = '';
      this.shopDataForm.marketId = '';
      this.shopDataForm.shopPlatform = 'ama';
      this.shopDataForm.shopName = '';
      this.shopDataForm.shopAuthName = '';
      this.shopDataForm.sellerId = '';
      this.shopDataForm.MWSAuthToken = '';
      this.shopDataForm.pmDepartmentIds = [];
      this.shopDataForm.pmDepartmentId = '';
      this.shopDataForm.pmDepartmentName = '';
      this.shopDataForm.pmUserNo = [];
      this.shopDataForm.shopAuthParam = {sellerId:"",MWSAuthToken:"",marketId:""};
      this.shopDataForm.remark = '';
    },
    handleReset() {
      this.searchData = {
        companyName: '',
        shopName: '',
      };
      this.onSearch();
    },
    onSearch() {
      this.companyTableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/members/companys/list', this.searchData)
      .then((response) => {
        this.companyTableLoading = false;
        if(response.data.code == 200) {
          this.companyTableData = (response.data.data || []).map(d => ({company: d, shops: []}));
        }
      })
      .catch((error) => {
        this.companyTableLoading = false;
      });
    },
    searchShops(companyId,row) {
      //this.shopTableLoading = true;
      ajax.post('/shops/company/'+companyId+'/list')
      .then((response) => {
        this.shopTableLoading = false;
        if(response.data.code == 200) {
          // this.companyTableData = this.companyTableData.map((d) => {
          //   if (d.company.id === companyId) {
          //     const shops = response.data.data || [];
          //     d.shops = shops.map((shop) => {
          //       shop.isShopActiveSuccess = (shop.activeStatus === SHOP_ACTIVE_STATUS.SUCCESS);
          //       shop.isShopActiveFail = (shop.activeStatus === SHOP_ACTIVE_STATUS.FAIL);
          //       return shop;
          //     });
          //   }
          //   return d;
          // });
          const shops = response.data.data || [];
          row.shops=shops.map((shop) => {
            shop.isShopActiveSuccess = (shop.activeStatus === SHOP_ACTIVE_STATUS.SUCCESS);
            shop.isShopActiveFail = (shop.activeStatus === SHOP_ACTIVE_STATUS.FAIL);
            return shop;
          });
        }
      })
      .catch((error) => {
        this.shopTableLoading = false;
      });
    },
    handleCompanyRowExpand(row, expanded) {
      if(expanded) {
        this.searchShops(row.company.id,row);
      }
    },
    handleDeleteCompany(index, row) {
      this.$confirm('确认删除该公司?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/members/companys/'+row.company.id+'/delete')
        .then((response) => {
          this.$message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });
          this.onSearch({pageNumber: 1});
        });
      });
    },
    handleEditCompany(index, row) {
      for(let x of Object.keys(this.companyDataForm)) {
        this.companyDataForm[x] = row.company[x];
      }
      this.companyDialogVisible = true;
      this.companyDialogTitle='修改公司信息';
    },

    onCompanyDialogSubmit() {
      let url = this.companyDataForm.id ? ('/members/companys/'+this.companyDataForm.id+'/modify') : '/members/companys/add';
      this.$refs.companyDataForm.validate((valid) => {
        if (valid) {
          ajax.post(url, this.companyDataForm)
          .then((response) => {
            if(response.data.code == 200) {
              this.$message({
                showClose: true,
                message: response.data.msg || '操作成功',
                type: 'success'
              });
              this.onSearch();
              this.companyDialogVisible = false;
            }
          });
        }
      })
    },
    handleAddShop(index, row) {
      this.shopDialogVisible = true;
      this.shopDataForm.pmDepartmentIds = [];
      this.shopDataForm.memberCompanyId = row.company.id;
      this.shopDialogTitle='新增店铺';
      this.shopDialogType = SHOP_DIALOG_TYPE.ADD;
      this.shopDialogSaveButtonText = '保存';
    },
    handleReConnect(index, row) {
      this.shopDialogTitle='店铺重连';
      this.shopDialogType = SHOP_DIALOG_TYPE.EDIT;
      this.shopDialogSaveButtonText = '保存并重连';
      this.showShopDialogByEdit(row);
    },
    handleEditShop(index, row) {
      this.shopDialogTitle='修改店铺信息';
      this.shopDialogType = SHOP_DIALOG_TYPE.EDIT;
      this.shopDialogSaveButtonText = '保存并连接';
      this.showShopDialogByEdit(row);
    },
    showShopDialogByEdit(row) {
      this.shopDialogVisible = true;
      this.$nextTick(function () {
        // 拷贝数据到shopDataForm
        for(let key of Object.keys(this.shopDataForm)) {
          if(key == 'shopAuthParam') {
            let obj = JSON.parse(row[key]);
            for(let x of Object.keys(obj)) {
              this.shopDataForm[x] = obj[x];
            }
          }else if(key == 'pmDepartmentIds') {
            if(row.pmDepartmentId) {
              this.shopDataForm.pmDepartmentIds = [row.pmDepartmentId];
            }else {
              this.shopDataForm.pmDepartmentIds = [];
            }
          }else  {
            this.shopDataForm[key] = row[key];
          }
        }
      });
    },
    onShopDialogSubmit() {
      let shopDataForm = this.shopDataForm;
      let url = shopDataForm.id ? ('/shops/'+shopDataForm.id+'/modify') : '/shops/add';
      this.shopDataForm.sellerId = trim(this.shopDataForm.sellerId);
      this.shopDataForm.MWSAuthToken = trim(this.shopDataForm.MWSAuthToken);
      this.$refs.shopDataForm.validate((valid) => {
        if (valid) {
          shopDataForm.shopAuthParam = {sellerId:"",MWSAuthToken:"",marketId:""};
          for(let x of Object.keys(shopDataForm.shopAuthParam)) {
            shopDataForm.shopAuthParam[x] = shopDataForm[x];
          }
          shopDataForm.shopAuthParam = JSON.stringify(shopDataForm.shopAuthParam);
          let id = shopDataForm.pmDepartmentIds[0];
          shopDataForm.pmDepartmentName = '';
          if(id) {
            let filterPmDepartment = this.pmDepartments.filter((item) => item.id==id);
            shopDataForm.pmDepartmentId = filterPmDepartment.length == 1 ? id : '';
            shopDataForm.pmDepartmentName = filterPmDepartment.length == 1 ? filterPmDepartment[0].departmentName : id;
          }
          ajax.post(url, shopDataForm)
          .then((res) => {
            const data = res.data;
            let message;
            let type;

            if (data.data === 0) {
              message = '保存店铺成功但连线失败';
              type = 'warning';
            } else {
              message = '操作成功';
              type = 'success';
            }
            this.$message({
              showClose: true,
              message,
              type
            });
            this.queryDepartments();
            if (shopDataForm.memberCompanyId) {
              this.searchShops(shopDataForm.memberCompanyId);
            }
            this.shopDialogVisible = false;
          });
        }
      })
    },
    handleDeleteShop(index, row) {
      this.$confirm('确认删除该店铺?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post('/shops/'+row.id+'/delete')
        .then((response) => {
          this.$message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });

          this.searchShops(row.memberCompanyId);
        });
      });
    },
  }
}
</script>

<style lang="css">
</style>
