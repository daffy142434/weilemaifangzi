<template lang="html">
  <div class="online-goods-list-index">
    <div class="page-title">
      亚马逊在线产品
      <a @click="back">返回到店铺列表</a>
      <span class="fr" style="margin-left: 15px;">业绩归属部门@人：<span style="color:#FA5555;">{{pmDepartmentName}}@{{pmUserName}}</span></span>
      <span class="fr" style="margin-left: 15px;">店铺名：<span style="color:#FA5555;">【{{stationName}}】{{shopName}}</span></span>
    </div>
    <div class="search-bar multi-row-search">
      <el-form :inline="true" :model="searchData" label-width="120" class="fl">
        <el-form-item label="商品SKU">
          <el-input v-model="searchData.sku" placeholder="商品SKU"></el-input>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select v-model="searchData.status" placeholder="请选择">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              v-for="(name, code) in productStatusForSelect"
              :key="code"
              :label="name"
              :value="code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联产品库">
          <el-select v-model="searchData.relationSkuFlag" placeholder="请选择">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option key="0" label="未关联" value="0"></el-option>
            <el-option key="1" label="已关联" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="FBA">
          <el-select v-model="searchData.shippingFlag" placeholder="请选择">
            <el-option
              key=""
              label="全部"
              value=""
            >
            </el-option>
            <el-option key="1" label="是" value="1"></el-option>
            <el-option key="2" label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ASIN">
          <el-input v-model="searchData.asin" placeholder="ASIN"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar" v-if="$store.state.powers.includes('online_product:ama_relate') || $store.state.powers.includes('online_product:ama_import_relate')">
      <el-button v-if="$store.state.powers.includes('online_product:ama_relate')" :disabled="selection.length <= 0" type="success" icon="el-icon-plus" size="small" @click="relateSkuGoods=[];relateSkuDialogVisible = true;searchSkuParam=''">关联已有产品库SKU</el-button>
      <el-button v-if="$store.state.powers.includes('online_product:ama_relate_add')" type="success" icon="el-icon-plus" size="small" :disabled="selection.length !=1" @click="addWithRelate">新增本地产品并关联</el-button>
      <el-button v-if="$store.state.powers.includes('online_product:ama_import_relate')" type="success" icon="el-icon-plus" size="small" @click="importDialogVisible = true;">导入产品关联关系</el-button>
    </div>
    <div v-if="$store.state.powers.includes('online_product:ama_list')">
      <el-table
        v-loading.body="tableLoading"
        @select="handleSelect"
        @select-all="handleSelect"
        ref="singleTable"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          label="关联产品库"
          align="center"
          width="150">
          <template slot-scope="scope">
            <div><el-tag size="medium" v-if="scope.row.relationSkuFlag==1">已关联本地产品</el-tag><el-tag size="medium" type="info" v-else>未关联本地产品</el-tag></div>
            <div style="margin-top:5px;"><el-tag size="medium" type="success" v-if="scope.row.shippingFlag==1">FBA商品</el-tag><el-tag size="medium" type="warning" v-else>自发货商品</el-tag></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="shippingFlag"
          label="FBA"
          :formatter="fbaFormat"
          width="95">
        </el-table-column>
        <el-table-column
          label="SKU"
          width="180"
          class-name="sku-column"
          fixed="left"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              ref="popover1"
              placement="right-start"
              title=""
              width="650"
              border
              trigger="click">
              <img :src="scope.row.mainPic" class="big-pic"/>
            </el-popover>
            <img :src="scope.row.mainPic" v-popover:popover1/>
            <div class="sku-column-text">{{scope.row.sku}}</div>
            <asin-link :asin="scope.row.asin" :stationCode="scope.row.stationCode"></asin-link>
          </template>
        </el-table-column>
        
        <el-table-column
          label="出价"
          width="140">
          <template slot-scope="scope">
            <div>原价：{{scope.row.originPrice}}</div>
            <div>折后价：{{scope.row.salePrice}}</div>
            <div>配送费：{{scope.row.distributionFee}}</div>
            <div>佣金比例：{{toPersent(scope.row.commissionRate)}}</div>
            <div>币种：{{scope.row.distributionFeeCurrency}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="重量和尺寸"
          align="center"
          width="200">
          <template slot-scope="props">
            <div>
              <span v-if="props.row.packageWeight&&props.row.packageWeight!='0.00'">{{props.row.packageWeight}}</span><span v-else>-</span> <span v-if="props.row.packageWeight&&props.row.weightUnit">({{props.row.weightUnit}})</span><span v-else>-</span>
            </div>
            <div>
              <span v-if="props.row.packageSize&&props.row.packageSize!='0.00'">{{props.row.packageSize}}</span><span v-else>-</span> <span v-if="props.row.packageSize&&props.row.sizeUnit">({{props.row.sizeUnit}})</span><span v-else>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="条码类型"
        >
          <template slot-scope="props">
            <div>{{amaProductTypeMapp[props.row.amaProductIdType] || ''}}</div>
            <div>{{props.row.amaProductId}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="别名"
          width="110">
        </el-table-column>
        
        <el-table-column
          prop="title"
          :show-overflow-tooltip="true"
          width="150"
          label="产品名称">
        </el-table-column>
        <el-table-column
          prop="offerSubmitStatus"
          label="报价状态"
          :formatter="formatOfferSubmitStatus"
          width="110">
        </el-table-column>
        <el-table-column
          prop="status"
          label="销售状态"
          :formatter="formatStatus"
          width="110">
        </el-table-column>
        <el-table-column
          prop="markStatus"
          label="库外状态"
          :formatter="formatMarkStatus"
          width="110">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="170">
          <template slot-scope="scope">
            <el-button v-if="$store.state.powers.includes('online_product:ama_mark_status')" type="text" size="small" @click="handleChangeMarkStatus(scope.$index, scope.row)">修改库外状态</el-button>
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
    </div>
    <el-dialog :title="urlDialogTitle" :visible.sync="urlDialogVisible" @close="onUrlDialogClose()">
      <el-form ref="urlDataForm" :rules="urlRules" :model="urlData" label-width="80px">
        <el-form-item label="URL" prop="productUrl">
          <el-input v-model="urlData.productUrl" placeholder="URL"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="urlDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="info" @click="onUrlDialogSubmit()" v-if="urlDialogTitle=='编辑URL'">保存</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onUrlDialogSubmit()" v-else>添加URL</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联产品库SKU" :visible.sync="relateSkuDialogVisible" width="90%">
      <el-form ref="relateSkuDataForm" :model="relateSkuData" label-width="100px">
        <!-- <el-form-item label="SKU关键字">
          <el-input placeholder="如需关联到已有本地产品，请输入本地产品的SKU后点击查询。如未存在本地产品，请点击下方绿色新增按钮" v-model="searchSkuParam">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods">查询</el-button>
          </el-input>
        </el-form-item> -->
        <el-row>
          <el-col :offset="2" :span="8">
            <el-form-item label="SKU关键字">
              <el-input placeholder="如需关联到已有本地产品，请输入本地产品的SKU后点击查询。如未存在本地产品，请点击下方绿色新增按钮" v-model="searchSkuParam"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="识别码">
              <el-input placeholder="识别码" v-model="identificationCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"><el-button class="fr" type="primary" @click="searchGoods">查询</el-button></el-col>
        </el-row>
        <el-form-item>
          <template>
            <el-table
              v-loading.body="goodsTableLoading"
              :data="relateSkuGoods"
              border
              style="width: 100%;">
              <el-table-column
                width="110">
                <template slot-scope="scope">
                  <el-radio class="radio" v-model="relateSkuData.relationSkuId" :label="scope.row.id">请选择</el-radio>
                </template>
              </el-table-column>
              <el-table-column
                label="图片"
                width="90">
                <template slot-scope="scope">
                  <el-popover
                    ref="popover1"
                    placement="right-start"
                    title=""
                    width="650"
                    border
                    trigger="click">
                    <img :src="scope.row.mainImg" class="big-pic"></img>
                  </el-popover>
                  <img :src="scope.row.mainImg" class="small-pic" v-popover:popover1></img>
                </template>
              </el-table-column>
              <el-table-column
                prop="originSku"
                width="170"
                label="SKU">
              </el-table-column>
              <el-table-column
                prop="identificationCode"
                width="170"
                label="识别码">
              </el-table-column>
              <el-table-column
                prop="name"
                label="商品名称">
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="relateSkuDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onRelateSkuDialogSubmit()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入产品关联关系" :visible.sync="importDialogVisible" size="tiny">
      <el-form ref="importDataForm" :model="urlData" label-width="80px">
        <el-form-item label="文件">
          <el-upload
            :data="uploadData"
            ref="upload"
            action="/online_product/import_relation"
            :on-change="fileChange"
            :on-success="handleUploadSuccess"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个xlsx文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="">
          <el-button type="text" @click="handleDownloadFile">点击下载导入产品关联关系模板</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="$refs.upload.submit();">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改库外状态" :visible.sync="changeMarkStatusDialogVisible" size="tiny">
      <el-form ref="changeMarkStatusForm" :model="changeMarkStatusForm" :rules="changeMarkStatusRules" label-width="80px">
        <el-form-item label="库外状态" props="markStauts">
          <el-select v-model="changeMarkStatusForm.markStauts" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="(name, code) in markStatusMap"
              :key="code"
              :label="name"
              :value="code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeMarkStatusDialogVisible = false">取 消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="changeMarkStatus">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="batchDialogTitle" :visible.sync="batchDialogVisible">
      <el-alert
        :closable="false"
        style="margin-bottom: 15px;font-size: 18px;"
        title="警告"
        type="warning"
        :description="batchForm.errorMsg"
        show-icon>
      </el-alert>
      <el-form ref="batchForm" label-position="top" label-width="80px">
        <el-form-item label="错误信息">
          <template>
            <el-table
              :data="batchForm.errorList"
              border
              style="width: 100%;">
              <el-table-column
                prop="orderNo"
                label="订单号"
                width="200">
              </el-table-column>
              <el-table-column
                prop="errorReson"
                label="失败原因">
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDialogVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/lib/ajax';
import moment from 'moment';
export default {
  data() {
    const params = this.$router.currentRoute.params || {};
    const searchData = params.searchData || {};
    return {
      markets: [],
      amaProductTypeMapp: {
        '1': 'ASIN',
        '2': 'ISBN',
        '3': 'UPC',
        '4': 'EAN',
        '5': 'GCID'
      },
      productStatusForSelect: {
        "1": "在售",
        "2": "下架",
        "3": "已删除",
      },
      relationSkuMap: {
        "0": "未关联本地产品",
        "1": "已关联本地产品",
      },
      statusMap: {
        "1": "在售",
        "2": "下架",
        "3": "已删除",
      },
      offerSubmitStatusMap: {
        "0": "处理中",
        "1": "处理成功",
        "2": "处理失败",
        "3": "暂无报价",
      },
      markStatusMap: {
        '0': "无标记",
        '1': "库外",
        '2': "下架",
      },
      searchData: {
        shopId: this.$route.query.shopId,
        sku: '',
        status: '',
        relationSkuFlag: '',
        asin: '',
        shippingFlag: '1',
        ...searchData,
      },
      tableData: [],
      totalRecord: 0,
      pageSize: 10,
      tableLoading: false,

      dialogLoading: false,
      urlDialogVisible: false,
      urlDialogTitle: '',

      changeMarkStatusDialogVisible: false,
      changeMarkStatusForm: {
        skuId: '',
        markStauts: '',
      },
      changeMarkStatusRules: {
        markStauts: [{
          type: 'number',
          required: true,
          message: '请选择库外状态',
          trigger: 'change'
        }],
      },

      selection: [],
      relateSkuDialogVisible: false,
      searchSkuParam: '',
      relateSkuGoods: [],

      urlData: {
        id: '',
        productUrl: '',
      },
      urlRules: {
        productUrl: [{
          required: true,
          message: 'URL不能为空',
          trigger: 'blur'
        }],
      },

      importDialogVisible: false,
      uploadData: {
        shopId: this.$route.query.shopId,
      },
      shopName: this.$route.query.shopName,
      pmDepartmentName: this.$route.query.pmDepartmentName,
      pmUserName: this.$route.query.pmUserName,

      goodsTableLoading: false,
      relateSkuData: {
        id: '',
        relationSkuId: '',
      },

      batchDialogTitle: '部分失败',
      batchDialogVisible: false,
      batchForm: {
        errorMsg: '',
        errorList: [],
      },
      identificationCode:""
    }
  },
  computed: {
    addWithRelateShowFlag: function() {
      return this.relateSkuGoods.length <= 0;
    },
    stationName: function() {
      let market = this.markets.filter((item) => {
        if(item.stationCode) {
          return item.stationCode == this.$route.query.stationCode;
        }
      });
      return market.length > 0 ? market[0].marketName : '';
    },

  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': {
      handler: 'fetchData',
      immediate: true
    }
  },
  beforeCreate(){
    ajax.post('/shops/ama_market/list')
    .then((response) => {
      if(response.data.code == 200) {
        this.markets = response.data.data;
      }
    });
  },
  created() {
    this.backHref = this.$router.currentRoute.params.backHref;
    const params = this.$router.currentRoute.params || {};
    this.searchData.sku = params.sku;
    // this.onSearch();
  },
  mounted() {
    const params = this.$router.currentRoute.params || {};
    this.searchData.sku = params.sku;
    if (params.formDetection) {
      this.searchData.shippingFlag = '';
    }
    this.onSearch();
  },
  methods: {
    toPersent(val){
      return (val*100).toFixed(2)+"%";
    },
    fetchData(){
      const route=this.$router.currentRoute;
      if(route.name==='onlineGoodsList'){
        this.searchData.sku =route.params.sku;
        this.shopName= route.query.shopName;
        this.pmDepartmentName=route.query.pmDepartmentName;
        this.pmUserName=route.query.pmUserName;
        this.searchData.shopId=route.query.shopId;
        this.uploadData.shopId=route.query.shopId;
        this.onSearch();
      }
    },
    back() {
      this.$router.push({
        name: 'onlineGoods',
        params: {
          searchData: {
            companyName: this.$router.currentRoute.query.searchCompanyName,
            shopName: this.$router.currentRoute.query.searchShopName,
            station_code: this.$router.currentRoute.query.searchStationCode,
          }
        }
      });
    },
    fbaFormat(row, column, cellValue) {
      if(cellValue || cellValue == '0') {
        return {'1': '是', '2': '否'}[cellValue];
      }else  {
        return '';
      }
    },
    formatWeight(row, column, cellValue) {
      return (cellValue && row.weightUnit) ? (cellValue+' '+row.weightUnit) : '';
    },
    formatRelationSku(row, column, cellValue) {
      return this.relationSkuMap[cellValue] || "";
    },
    formatStatus(row, column, cellValue) {
      return this.statusMap[cellValue] || "";
    },
    formatOfferSubmitStatus(row, column, cellValue) {
      return this.offerSubmitStatusMap[cellValue] || "";
    },
    formatMarkStatus(row, column, cellValue) {
      return this.markStatusMap[cellValue] || "";
    },
    onUrlDialogClose() {
      this.$refs.dataForm.resetFields();
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
        shopId: this.$route.query.shopId,
        sku: '',
        status: '1',
        relationSkuFlag: '',
        asin: '',
        shippingFlag: '1',
      };
      this.onSearch();
    },
  
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/online_product/sku/info', Object.assign({pageNumber, pageSize}, this.searchData))
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

    onUrlDialogSubmit() {
      let urlData = this.urlData;
      let url = '/onlineProduct/todo...';
      this.$refs.urlDataForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          ajax.post(url, urlData)
          .then((response) => {
            this.dialogLoading = false;
            this.urlDialogVisible = false;
            if(response.data.code == 200) {
              // 因为要显示初始密码，所以讲提示信息的显示时长设置为30秒
              this.$message({
                showClose: true,
                message: (response.data.msg && dataForm.id) ? '操作成功' : ('用户：'+dataForm.loginName+'的初始登录密码为：'+response.data.data),
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

    handleSelect(selection, row) {
      this.selection = selection;
    },

    onRelateSkuDialogSubmit() {
      let valid = true;
      for(let obj of this.selection) {

        // 状态只有未关联产品库状态的在线产品才可以做关联SKU操作
        if(obj.relationSkuFlag == "1") {
          valid = false;
          break;
        }
      }
      if(!valid) {
        this.$message({
          showClose: true,
          message: '只有未关联产品库状态的在线产品才可以做关联SKU操作',
          type: 'warning'
        });
        return;
      }else {
        let url = '/online_product/relate';
        this.relateSkuData.id = this.selection.map((item) => item.id).join(',');

        this.dialogLoading = true;
        ajax.post(url, this.relateSkuData)
        .then((response) => {
          this.dialogLoading = false;
          if(response.data.code == 200) {
            this.relateSkuDialogVisible = false;
            this.$message({
              showClose: true,
              message: response.data.msg || '操作成功',
              type: 'success'
            });
            this.$refs.singleTable.clearSelection();
            this.onSearch({pageNumber: 1});
          }
        })
        .catch((error) => {
          this.dialogLoading = false;
        });
      }
    },

    searchGoods() {
      
      // if(!this.searchSkuParam) {
      //   this.$message({
      //     showClose: true,
      //     message: '请输入SKU关键字',
      //     type: 'warning'
      //   });
      //   return;
      // }
      this.goodsTableLoading = true;
      ajax.post("/products/search", {sku: this.searchSkuParam,identificationCode:this.identificationCode})
      .then((response) => {
        this.goodsTableLoading = false;
        if(response.data.code == 200) {
          this.relateSkuGoods = response.data.data;
        }
      })
      .catch((error) => function() {
        this.goodsTableLoading = false;
      });
    },
    addWithRelate() {
      if(this.selection.length > 1) {
        this.$message({
          showClose: true,
          message: '只能选中一条在线产品信息进行操作',
          type: 'warning'
        });
        return;
      }
      this.$store.state.activeMenuIndex = "goods";
      this.$router.push({name: 'goodsAddWithRelate', params: {action: 'addWithRelate', relateSkuId: this.selection[0].id, backHref: location.href}});
    },
    handleDownloadFile() {
      location.href = "/static/download/import_online_sku_relation.xlsx";
    },
    fileChange(file, fileList) {
      if(!/^.+\.xlsx$/.test(file.name)){
        this.$message({
          showClose: true,
          message: '请选择后缀xlsx的文件进行上传',
          type: 'warning'
        });
        fileList.pop();
      }
      if(fileList.length > 1) {
        fileList.shift();
      }
    },
    handleUploadSuccess() {
      this.importDialogVisible = false;
      this.$refs.upload.clearFiles();
    },
    handleChangeMarkStatus(index, row) {
      this.changeMarkStatusForm.skuId = row.id;
      this.changeMarkStatusForm.markStauts = ''+row.markStatus;
      this.changeMarkStatusDialogVisible = true;
    },

    changeMarkStatus() {
      this.dialogLoading = true;
      ajax.post("/online_product/update/skumarkStatus", this.changeMarkStatusForm)
      .then((response) => {
        this.dialogLoading = false;
        if(response.data.code == 200) {
          this.$message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });
          this.changeMarkStatusDialogVisible = false;
          this.onSearch({pageNumber: 1});
        }
      })
      .catch((error) => function() {
        this.dialogLoading = false;
      });
    },
  }
}
</script>

<style lang="css" scoped>
  .big-pic {
    max-width: 650px;max-height: 650px;
  }
  .small-pic {
    margin-top:7px;cursor:pointer;width: 50px;height: 50px;
  }
  .el-tag{
    min-width: 110px;
    background-color: #5481358a;
    border-color: #4f9023;
    color: #3e840d;
  }

  .el-tag--info{
    background-color: #ffd966;
    border-color: #f3b806;
    color: #ad8305;
  }
  .el-tag--success{
    background-color: #8eaadcab;
    border-color: #598fefe3;
    color: #266dea;
  }
</style>
