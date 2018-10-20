<template lang="html">
  <div>
    <div class="page-title">
      产品开发测算
      <el-popover
        placement="right"
        trigger="hover"
      >
        测算流程为：
        <span v-html="getProcess()"></span>
        <br />
        <br />
        同时进行的测算任务最多为 <span class="red">3</span> 个
        <br />
        每个测算的搜索页数最多为 <span class="red">100</span> 页
        <br />
        <span slot="reference" class="el-icon-info primary"></span>
      </el-popover>
    </div>
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl">
        <el-input style="display: none;"></el-input>
        <el-form-item label="关键词">
          <el-input v-model="searchData.keyWords" placeholder="关键词" @keyup.enter.native="onSearch()"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchData.status" placeholder="请选择">
            <el-option
              key="all"
              label="全部"
              value=""
            >
            </el-option>
            <el-option
              label="采集基本信息"
              value="1">
            </el-option>
            <el-option
              label="计算基本信息"
              value="10">
            </el-option>
            <el-option
              label="基本信息计算完成"
              value="11">
            </el-option>
            <el-option
              label="基本信息计算完成(噪点过多)"
              value="12">
            </el-option>
            <el-option
              label="采集评论信息"
              value="20">
            </el-option>
            <el-option
              label="采集完毕"
              value="21">
            </el-option>
            <el-option
              label="计算完毕"
              value="3">
            </el-option>
            <el-option
              label="计算完毕(噪点过多)"
              value="4">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <contries-select v-model="searchData.countryCode"></contries-select>
        </el-form-item>
      </el-form>
      <div class="fr">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" v-if="$store.state.powers.includes('product_devp_estimate:add')" @click="dialogVisible = true;dialogTitle='新增产品开发测算'">新增产品开发测算</el-button>
    </div>
    <div v-if="$store.state.powers.includes('product_devp_estimate:list')">
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
        <!-- <el-table-column
          prop="country"
          label="国家"
          width="80"
          :formatter="formatContry"
        >
        </el-table-column> -->
        <el-table-column
          prop=""
          label="迭代预测"
        >
          <template slot-scope="props">
            <el-switch
              v-model="props.row.iterationFlag"
              :active-value="1"
              :inactive-value="0"
              active-text=""
              inactive-text=""
              @change="handleStatus(props.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="keyWords"
          label="关键词"
          min-width="200">
          <template slot-scope="props">
            <div>
              <div><national-flag :stationCode="props.row.stationCode" :key="props.row.id"></national-flag></div>
              <div>{{props.row.keyWords}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="toDateTime"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建人"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="searchPage"
          label="搜索页数"
          width="150">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusFormat"
          min-width="180">
          <template slot-scope="props">
            <el-popover
              placement="top"
              trigger="hover"
            >
              <span v-html="getProcess(props.row.status)"></span>
              <el-tag :type="props.row.status === 3 || 4 ? 'success' : 'info'" size="small" slot="reference">
                {{statusFormat(props.row.status)}}
              </el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <div>
              <el-button v-if="scope.row.hasMarketCapacity && $store.state.powers.includes('product_devp_estimate:show_shichangrongliang')" type="text" size="small" @click="showCapacity(scope.$index, scope.row)">市场容量</el-button>
              <el-button v-if="scope.row.hasPriceAnalysis && $store.state.powers.includes('product_devp_estimate:show_dingjiafenxi')" type="text" size="small" @click="showPriceAnalysisDialog(scope.$index, scope.row)">定价分析</el-button>
              <el-button v-if="scope.row.hasCommet && $store.state.powers.includes('product_devp_estimate:show_pinglun')" type="text" size="small" @click="showComment(scope.$index, scope.row)">评论情况</el-button>
              <el-button v-if="scope.row.hasPermeateDifficulty && $store.state.powers.includes('product_devp_estimate:show_shentounanyi')" type="text" size="small" @click="showPermeate(scope.$index, scope.row)">渗透难易</el-button>
              <el-button v-if="scope.row.hasDelete && $store.state.powers.includes('product_devp_estimate:delete')" type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </div>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="80px">
        <el-form-item label="国家" prop="country">
          <contries-select v-model="dataForm.country" placeholder="国家"></contries-select>
        </el-form-item>
        <el-form-item label="关键词" prop="dialogKeyWords">
          <el-select
            style="width: 100%"
            :multiple-limit="10"
            v-model="dataForm.dialogKeyWords"
            multiple
            default-first-option
            no-data-text="请输入后回车进行确认"
            filterable
            allow-create
            placeholder="请输入后回车进行确认">
          </el-select>
        </el-form-item>
        <el-form-item label="搜索页数" prop="searchPage">
          <el-input v-model.number="dataForm.searchPage" placeholder="搜索页数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="onDialogSubmit()">立即创建</el-button>
      </div>
    </el-dialog>
    <el-dialog title="渗透难易" :visible.sync="permeateDialogVisible" width="80%">
      <header class="dialog-header">
        <el-row>
          <el-col :span="1"><national-flag :stationCode="stationCode" :key="stationCode"></national-flag></el-col>
          <el-col :span="5" class="title">{{keyWords}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="changeKeyword('last')" :disabled="rowIndex==0">上一词</el-button>
              <el-button type="primary" size="mini" @click="changeKeyword('next')" :disabled="rowIndex==tableData.length-1">下一词<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{operaItems[operaIndex]}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" :disabled="operaIndex==0" @click="changeOpera('last')">上一项</el-button>
              <el-button type="primary" size="mini" :disabled="operaIndex==operaItems.length-1" @click="changeOpera('next')">下一项<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </header>
      <el-table
        v-loading.body="permeateTableLoading"
        ref="permeateTable"
        :data="permeateTableData"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <asin-ranking :id="permeateId" :num="props.$index" :stationCode="permeateStationCode"></asin-ranking>
          </template>
        </el-table-column>
        <el-table-column
          prop="lable"
          label="商品分类">
        </el-table-column>
        <el-table-column
          prop="count"
          label="上架90天ASIN数量">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permeateDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="评论情况" :visible.sync="commentDialogVisible" width="90%">
      <header class="dialog-header">
        <el-row>
          <el-col :span="1"><national-flag :stationCode="stationCode" :key="stationCode"></national-flag></el-col>
          <el-col :span="5" class="title">{{keyWords}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="changeKeyword('last')" :disabled="rowIndex==0">上一词</el-button>
              <el-button type="primary" size="mini" @click="changeKeyword('next')" :disabled="rowIndex==tableData.length-1">下一词<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{operaItems[operaIndex]}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" :disabled="operaIndex==0" @click="changeOpera('last')">上一项</el-button>
              <el-button type="primary" size="mini" :disabled="operaIndex==operaItems.length-1" @click="changeOpera('next')">下一项<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </header>
      <el-form label-width="160px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="日新增评论数：" label-width="110px">
              {{comment.commentCount}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日新增好评评论数：">
              {{comment.goodCommentCount}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日新增差评评论数：">
              {{comment.badCommentCount}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="整体质量度(好评数/总数)：" label-width="200px">
              {{(comment.commentRate * 100).toFixed(2)}} %
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs ref="tabs" :active-name="activeTabName" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane name="goodCloud" label="好评词云">
          <el-table
            max-height="350"
            v-loading.body="goodCloudTableLoading"
            ref="goodCloudTable"
            :data="goodCloudTableData"
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              width="65">
            </el-table-column>
            <el-table-column
              prop="value"
              label="词语">
            </el-table-column>
            <el-table-column
              prop="count"
              label="权重">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="badCloud" label="差评词云">
          <el-table
            max-height="350"
            v-loading.body="badCloudTableLoading"
            ref="badCloudTable"
            :data="badCloudTableData"
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              width="65">
            </el-table-column>
            <el-table-column
              prop="value"
              label="词语">
            </el-table-column>
            <el-table-column
              prop="count"
              label="权重">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commentDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="capacityDialogVisible" title="市场容量" size="small" @close="handleCapacityClose">
      <header class="dialog-header">
        
        <el-row>
          <el-col :span="1"><national-flag :stationCode="stationCode" :key="stationCode"></national-flag></el-col>
          <el-col :span="5" class="title">{{keyWords}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="changeKeyword('last')" :disabled="rowIndex==0">上一词</el-button>
              <el-button type="primary" size="mini" @click="changeKeyword('next')" :disabled="rowIndex==tableData.length-1">下一词<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{operaItems[operaIndex]}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" :disabled="operaIndex==0" @click="changeOpera('last')">上一项</el-button>
              <el-button type="primary" size="mini" :disabled="operaIndex==operaItems.length-1" @click="changeOpera('next')">下一项<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </header>
      <el-form label-width="160px" v-loading="capacityDialogLoading">
        <div style="margin-bottom: 20px; margin-left: 45px;">大类名称：{{capacity.major}}</div>
        <el-row class="budget-row">
          <el-col :span="6">
            <div class="budget-row-title"><span>关键词组<br />商品数量</span></div>
            <em>{{capacity.itemCount}}</em>
          </el-col>
          <el-col :span="6">
            <div class="budget-row-title"><span>噪点<br />数量</span></div>
            <em>{{capacity.itemCountNoise}}</em>
          </el-col>
          <el-col :span="6">
            <div class="budget-row-title"><span>品牌<br />数量</span></div>
            <em>{{capacity.brandCount}}</em>
          </el-col>
          <el-col :span="6">
            <div class="budget-row-title"><span>查找<br />页数</span></div>
            <em>{{capacity.pageNum}}</em>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <div id="capacityChart" style="height: 350px;"></div>
        </el-col>
      </el-row>
      <div class="product-budget-cluster-text-wrap">
        <div>
          <pie-chart ref="pieChart" :options="clusterChartOptions">
          </pie-chart>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="capacityDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="定价分析"
      :visible.sync="priceAnalysisDialogVisible"
      class="heavy-form"
      width="90%"
    >
      <header class="dialog-header">
        <el-row>
          <el-col :span="1"><national-flag :stationCode="stationCode" :key="stationCode"></national-flag></el-col>
          <el-col :span="5" class="title">{{keyWords}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="changeKeyword('last')" :disabled="rowIndex==0">上一词</el-button>
              <el-button type="primary" size="mini" @click="changeKeyword('next')" :disabled="rowIndex==tableData.length-1">下一词<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="title">{{operaItems[operaIndex]}}</el-col>
          <el-col :span="6">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-arrow-left" :disabled="operaIndex==0" @click="changeOpera('last')">上一项</el-button>
              <el-button type="primary" size="mini" :disabled="operaIndex==operaItems.length-1" @click="changeOpera('next')">下一项<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </header>
      <price-analysis-dialog ref="priceAnalysisDialog"></price-analysis-dialog>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
import ajax from '@/lib/ajax';
import PieChart from '@/components/chart/pieChart';
import PriceAnalysisDialog from './components/priceAnalysisDialog';
import ProductBudget from './services';
import AsinRanking from './components/asinRanking';
import getAsinLink from '@/lib/getAsinLink';
import NationalFlag from '@/components/national-flag';
// import AsinRanking from './components/asinRanking';

const productBudget = new ProductBudget();

export default {
  data() {
    return {
      keyWords:"",
      stationCode:"",
      rowIndex:0,
      operaItems:[],
      operaIndex:0,
      priceAnalysisDialogVisible:false,
      statusMap: {
        '1': '采集基本信息',
        '10': '计算基本信息',
        '11': '基本信息计算完成',
        '12': '基本信息计算完成(噪点过多)',
        '20': '采集评论信息',
        '21': '采集完毕',
        '3': '计算完毕',
        '4': '计算完毕(噪点过多)',
      },
      totalRecord: 0,
      pageSize: 10,
      tableLoading: false,
      dialogLoading: false,
      dialogVisible: false,
      pageNumber:1,
      commentDialogVisible: false,
      comment: {
        commentCount: 0,
        goodCommentCount: 0,
        badCommentCount: 0,
        commentRate: 0,
      },
      activeTabName: 'goodCloud',
      goodCloudTableData: [],
      badCloudTableData: [],
      badCloudTableLoading: false,
      goodCloudTableLoading: false,

      permeateDialogVisible: false,
      permeateTableLoading: false,
      permeateTableData: [],

      capacityDialogVisible: false,
      capacityDialogLoading: false,
      capacity: {
        major: '',
        itemCount: '',
        itemCountNoise: '',
        brandCount: '',
        pageNum: ''
      },

      dialogTitle: '新增用户',
      roles: [],
      defaultTreeProps: {
        children: 'childPermList',
        label: 'permissionName'
      },
      rules: {
        country: [{
          required: true,
          message: '国家不能为空',
          trigger: 'blur'
        }],
        dialogKeyWords: [{
          required: true,
          message: '关键词不能为空',
          trigger: 'blur'
        }],
        searchPage: [{
          required: true,
          message: '搜索页数不能为空',
          trigger: 'blur'
        },
        {
          type: 'integer',
          message: '搜索页数应为正整数',
          trigger: 'blur'
        }],
      },
      searchData: {
        keyWords: '',
        status: '',
        countryCode: ''
      },
      dataForm: {
        id: '',
        country: '',
        keyWords: '',
        dialogKeyWords: [],
        searchPage: '',
      },
      capacityClusterText: '',

      tableData: [],
      clusterChartOptions: {
        title : {
          text: '所有商品排名区间与分布',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} ({d}%)"
        },
        series : [
          {
            name: '聚类',
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            data:[],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  beforeCreate(){
    ajax.post('/members/roles/list')
    .then((response) => {
      if(response.data.code == 200) {
        this.roles = response.data.data;
      }
    });
  },
  created() {
    this.onSearch();
    
  },
  mounted(){
    if(this.$store.state.powers.includes('product_devp_estimate:show_shichangrongliang')){
      this.operaItems.push("市场容量");
    }
    if(this.$store.state.powers.includes('product_devp_estimate:show_dingjiafenxi')){
      this.operaItems.push("定价分析");
    }
     if(this.$store.state.powers.includes('product_devp_estimate:show_pinglun')){
      this.operaItems.push("评论情况");
    }
    if(this.$store.state.powers.includes('product_devp_estimate:show_shentounanyi')){
      this.operaItems.push("渗透难易");
    }
  },
  methods: {
    handleStatus(row){
      let flag=row.iterationFlag;
      productBudget.exploreIteration({id:row.id,iterationFlag:row.iterationFlag}).then(res=>{
        if(res.data.code==200){
          this.$message({
            message: res.data.data,
            type: 'success'
          });
        }else{
          row.iterationFlag=flag==1?0:1;
        }
      })
    },
    statusFormat(cellValue) {
      const map = {
        '1': '采集基本信息',
        '10': '计算基本信息',
        '11': '基本信息计算完成',
        '12': '基本信息计算完成(噪点过多)',
        '20': '采集评论信息',
        '21': '采集完毕',
        '3': '计算完毕',
        '4': '计算完毕(噪点过多)',
      };
      return map[cellValue] || '';
    },
    onDialogClose() {
      this.dataForm.dialogKeyWords = [];
      this.$refs.dataForm.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    getProcess(status) {
      return [
        this.getStatusHtml(1, status),
        this.getStatusHtml(10, status),
        this.getStatusHtml(11, status),
        this.getStatusHtml(12, status),
        this.getStatusHtml(20, status),
        this.getStatusHtml(21, status),
        this.getStatusHtml(3, status),
      ].join(' > ');
    },
    getStatusHtml(status, isCurrentStatus) {
      const text = this.statusFormat(status);

      if (status === isCurrentStatus) {
        return `<strong style="color: #409EFF;">${text}</strong>`
      } else {
        return text;
      }
    },
    handleCurrentChange(val) {
      this.onSearch({pageNumber: val});
    },
    handleReset() {
      this.searchData = {
        keyWords: '',
        status: '',
      };
      this.onSearch();
    },
    onSearch({pageNumber = 1} = {}) {
      this.tableLoading = true;
      let pageSize = this.pageSize;
      ajax.post('/product_budget/list', Object.assign({pageNumber, pageSize}, this.searchData))
      .then((response) => {
        this.tableLoading = false;
        if(response.data.code == 200) {
          this.tableData = (response.data.data.data || []).map((d) => {
            switch(d.status) {
              case 3: case 4:
                d.hasCommet = true;
              case 11: case 12: case 20: case 21:
                d.hasMarketCapacity = true;
                d.hasPriceAnalysis = true;
                d.hasPermeateDifficulty = true;
              case 1: case 10:
                d.hasDelete = true;
            }
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
      return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm') : '';
    },
    formatContry(row, column, value) {
      const map = {
        us: "美国",
        ca: "加拿大",
        jp: "日本",
        uk: "英国",
        de: "德国",
        es: "西班牙",
        fr: "法国",
        it: "意大利"
      };

      return map[value] || value || '';
    },
    onDialogSubmit() {
      let dataForm = this.dataForm;
      let url = '/product_budget/add';
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dialogLoading = true;
          dataForm.keyWords = dataForm.dialogKeyWords.join(',');
          ajax.post(url, dataForm)
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
    showComment(index, row) {
      this.keyWords=row.keyWords;
      this.stationCode=row.stationCode;
      this.rowIndex=index;
      this.operaIndex=this.operaItems.indexOf("评论情况");
      ajax.post(`/product_budget/${row.id}/comment`)
      .then((response) => {
        if(response.data.code == 200) {
          this.commentDialogVisible = true;
          for(let key of Object.keys(this.comment)) {
            this.comment[key] = response.data.data[key];
          }
        }
      })
      .catch((error) => {
        this.$message({
          showClose: true,
          message: '获取评论数据失败',
          type: 'warning'
        });
      });

      this.goodCloudTableLoading = true;
      ajax.post(`/product_budget/1/${row.id}/word_cold`)
      .then((response) => {
        this.goodCloudTableLoading = false;
        if(response.data.code == 200) {
          this.goodCloudTableData = response.data.data;
        }
      })
      .catch((error) => {
        this.goodCloudTableLoading = false;
        this.$message({
          showClose: true,
          message: '获取好评词云数据失败',
          type: 'warning'
        });
      });

      this.badCloudTableLoading = true;
      ajax.post(`/product_budget/2/${row.id}/word_cold`)
      .then((response) => {
        this.badCloudTableLoading = false;
        if(response.data.code == 200) {
          this.badCloudTableData = response.data.data;
        }
      })
      .catch((error) => {
        this.badCloudTableLoading = false;
        this.$message({
          showClose: true,
          message: '获取差评词云数据失败',
          type: 'warning'
        });
      });

    },
    handleTabClick(tab) {
      this.activeTabName = tab.name;
    },
    showPermeate(index, row) {
      this.keyWords=row.keyWords;
      this.stationCode=row.stationCode;
      this.rowIndex=index;
      this.operaIndex=this.operaItems.indexOf("渗透难易");
      this.permeateTableData = [];
      this.permeateTableLoading = true;
      this.permeateId = row.id;
      this.permeateStationCode = row.stationCode;
      ajax.post(`/product_budget/${row.id}/permeate_level`)
      .then((response) => {
        this.permeateTableLoading = false;
        if(response.data.code == 200) {
          let data = response.data.data;
          this.permeateDialogVisible = true;
          this.permeateTableData.push({'lable': '排名前100名商品', 'count': data.topOneHundred});
          this.permeateTableData.push({'lable': '排名前200名商品', 'count': data.topTwoHundred});
          this.permeateTableData.push({'lable': '排名前300名商品', 'count': data.topThreeHundred});
        }
      })
      .catch((error) => {
        this.permeateTableLoading = false;
        this.$message({
          showClose: true,
          message: '获取渗透难易数据失败',
          type: 'warning'
        });
      });
    },
    handleDelete(index, row) {
      this.$confirm('确认删除该产品开发测算信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.post(`/product_budget/${row.id}/delete`)
        .then((response) => {
          this.$message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });
          this.onSearch();
        });
      });
    },
    changeOpera(str){
      if(str==="last"){
        this.operaIndex--;
      }else{
        this.operaIndex++;
      }
      let data=this.tableData[this.rowIndex];
      let operaStr="";
      if(this.operaIndex==this.operaItems.indexOf("市场容量")){
        operaStr="hasMarketCapacity";
      }else if(this.operaIndex==this.operaItems.indexOf("定价分析")){
        operaStr="hasPriceAnalysis";
      }else if(this.operaIndex==this.operaItems.indexOf("评论情况")){
        operaStr="hasCommet";
      }else if(this.operaIndex==this.operaItems.indexOf("渗透难易")){
        operaStr="hasPermeateDifficulty";
      }
      if(!data[operaStr]){
        if(this.operaIndex>=0||this.operaIndex<=this.operaItems.length-1){
          this.changeOpera(str);
        }
        return;
      }
      this.changeDialogData();
    },
    changeKeyword(str){
      if(str==="last"){
        this.rowIndex--;
      }else{
        this.rowIndex++;
      }
      let data=this.tableData[this.rowIndex];
      let operaStr="";
      if(this.operaIndex==this.operaItems.indexOf("市场容量")){
        operaStr="hasMarketCapacity";
      }else if(this.operaIndex==this.operaItems.indexOf("定价分析")){
        operaStr="hasPriceAnalysis";
      }else if(this.operaIndex==this.operaItems.indexOf("评论情况")){
        operaStr="hasCommet";
      }else if(this.operaIndex==this.operaItems.indexOf("渗透难易")){
        operaStr="hasPermeateDifficulty";
      }
      if(!data[operaStr]){
        if(this.rowIndex>=0||this.rowIndex<=this.tableData.length-1){
          this.changeKeyword(str);
        }
        return;
      }
      this.changeDialogData();
    },
    changeDialogData(){
      this.capacityDialogVisible = false;
      this.priceAnalysisDialogVisible=false;
      this.commentDialogVisible = false;
      this.permeateDialogVisible = false;
      if(this.operaIndex==this.operaItems.indexOf("市场容量")){
        this.showCapacity(this.rowIndex,this.tableData[this.rowIndex]);
      }else if(this.operaIndex==this.operaItems.indexOf("定价分析")){
        this.showPriceAnalysisDialog(this.rowIndex,this.tableData[this.rowIndex]);
      }else if(this.operaIndex==this.operaItems.indexOf("评论情况")){
        this.showComment(this.rowIndex,this.tableData[this.rowIndex]);
      }else if(this.operaIndex==this.operaItems.indexOf("渗透难易")){
        this.showPermeate(this.rowIndex,this.tableData[this.rowIndex]);
      }
    },
    showCapacity(index, row) {
      this.$nextTick(() => {
        this._capacityChart(row);
      });
      this.capacityClusterText = '';
      this.capacityDialogVisible = true;
      this.capacityDialogLoading = true;
      this.keyWords=row.keyWords;
      this.stationCode=row.stationCode;
      this.rowIndex=index;
      this.operaIndex=this.operaItems.indexOf("市场容量");
      Promise.all([
        ajax.post(`/product_budget/${row.id}/query_capacity`),
        productBudget.getCapacityClusterText(row.id)
      ]).then(([capacityRes, clusterRes]) => {
        for(let key of Object.keys(this.capacity)) {
          this.capacity[key] = capacityRes.data.data[key];
        }
        setTimeout(() => {
          this.renderClusterChart(clusterRes.data.data);
        });
        this.capacityDialogLoading = false;
      }).catch(() => {
        this.capacityDialogLoading = false;
      });
    },
    handleCapacityClose() {
      let echarts = require('echarts');
      setTimeout(() => {
        let capacityChart = echarts.init(document.getElementById('capacityChart'));
        capacityChart.setOption({
          title: {
            text: '大类排名（头五页商品排名）'
          },
          tooltip: {},
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
              name: '数量',
              type: 'bar',
              data: []
          }]
        });
      }, 200);
      for(let key of Object.keys(this.capacity)) {
        this.capacity[key] = '';
      }
      setTimeout(() => {
        this.renderClusterChart([]);
      });
      this.capacityDialogLoading = false;
    },
    renderClusterChart(clusterRes) {
      const legend = [];
      const data = [];
      const other = {
        value: 0,
        name: '其他',
        label: {
          normal: {
            formatter: '{b}({d}%)'
          }
        }
      };
      clusterRes.map((item) => {
        let v = +item.percent.replace('%', '');

        if (v < 3) {
          other.value += v;
        } else {
          data.push({
            value: v,
            name: item.range,
            label: {
              normal: {
                formatter: '{b}({d}%)'
              }
            }
          });
        }
      });
      if (other.value > 0) {
        legend.push('其他');
        data.push(other);
      }
      this.clusterChartOptions.series[0].data = data;
      this.$refs.pieChart.render();
    },

    showPriceAnalysisDialog(index, row) {
      // location.hash = `/priceAnalysis/${row.id}`;
      // this.$router.push({
      //   name: 'priceAnalysis',
      //   params: {
      //     id: row.id
      //   }
      // });
      this.priceAnalysisDialogVisible=true;
      this.keyWords=row.keyWords;
      this.stationCode=row.stationCode;
      this.rowIndex=index;
      this.operaIndex=this.operaItems.indexOf("定价分析");
      this.$nextTick(()=>{
        this.$refs.priceAnalysisDialog.show(row.id);
      })
      
    },

    _capacityChart(row) {
      let echarts = require('echarts');
      ajax.post(`/product_budget/1/${row.id}/asin_char`)
      .then((response) => {
        if(response.data.code == 200) {
          if (!this.capacityChart) {
            this.capacityChart = echarts.init(document.getElementById('capacityChart'));
            this.capacityChart.on('click', (e) => {
              const data = this.datas[e.dataIndex];
              window.open(getAsinLink(data.stationCode, data.asin));
            });
          }
          let capacityChart = this.capacityChart;
          let datas = response.data.data;
          this.datas = datas;
          setTimeout(() => {
            let minSub = 1 / 0;
            let tenThousand = 10000;
            let tenThousandValue;
            let oneHundredThousand = 100000;
            let tenThousandIndex;
            let tenThousandName;
            const placeholdData = [];
            const seriesData = datas.map((item, index) => {
              let valueLimit;
              let absSub = Math.abs(item.count - tenThousand);

              if (absSub < minSub) {
                minSub = absSub;
                tenThousandIndex = index;
                tenThousandName = item.value;
                tenThousandValue = item.count;
              }
              if (item.count > oneHundredThousand) {
                valueLimit = oneHundredThousand;
              } else {
                valueLimit = item.count;
              }
              placeholdData.push(index);
              return {
                name: item.value,
                value: valueLimit,
                showValue: item.count
              };
            });
            seriesData[tenThousandIndex] = {
              ...seriesData[tenThousandIndex],
              // value: oneHundredThousand,
              tooltip: {
                formatter(bar) {
                  const {data} = bar[0];
                  const {name, value} = data;
                }
              }
            };
            seriesData[tenThousandIndex].value = 0;
            placeholdData[tenThousandIndex] = tenThousandValue;
            capacityChart.setOption({
              title: {
                text: '大类排名（头五页商品排名）'
              },
              tooltip: {
                trigger: 'axis',
                formatter(bar) {
                  if (bar[0].name === tenThousandName.toString()) {
                    return `${bar[0].name}：${bar[0].data.showValue}。<br />离一万最近，左侧商品数：${tenThousandIndex}`;
                  } else {
                    return `${bar[0].name}：${bar[0].data.showValue}`;
                  }
                }
              },
              xAxis: {
                data: datas.map((item) => item.value)
              },
              yAxis: {
                max: oneHundredThousand
              },
              series: [
                {
                  name: '数量',
                  type: 'bar',
                  stack: 'one',
                  data: seriesData,
                  // markPoint: {
                  //   data: [
                  //     {
                  //       coord: [tenThousandIndex, 0],
                  //       name: 'placeholder'
                  //     }
                  //   ]
                  // }
                },
                {
                  name: 'placeholder',
                  type: 'bar',
                  stack: 'one',
                  data: placeholdData,
                  itemStyle: {
                    color: '#0f0'
                  },
                }
              ]
            });
          }, 200);
        }
      })
      .catch((error) => {
        this.$message({
          showClose: true,
          message: '获取市场容量数据失败',
          type: 'warning'
        });
      });
    },
  },
  components: {
    'asin-ranking': AsinRanking,
    'price-analysis-dialog':  PriceAnalysisDialog,
    'pie-chart': PieChart,
    'national-flag': NationalFlag
  }
}
</script>

<style lang="less" scoped>
  .product-budget-cluster-text-wrap {
    padding: 10px;
    .product-budget-cluster-text {
      line-height: 28px;
      max-height: 84px;
      overflow: auto;
    }
    .chart {
      height: 400px;
    }
  }
  .budget-row {
    text-align: center;
    margin-bottom: 10px;
    &-title {
      height: 40px;
      line-height: 18px;
      margin-bottom: 5px;
      &:before {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
        content: ' ';
      }
      span {
        display: inline-block;
        vertical-align: middle;
        color: #999;
      }
    }
    em {
      font-size: 24px;
      font-style: normal;
      color: #20A0FF;
    }
  }
  .dialog-header{
    margin-bottom: 20px;
    .el-row{
      margin-bottom: 10px;
    }
    .title{
      font-weight: bold;
    }
  }
  
</style>

