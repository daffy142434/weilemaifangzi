<template lang="html">
  <el-dialog
    title="核销"
    :visible.sync="visible"
    width="90%"
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label='本地SKU'
          >
            <local-sku-select v-model="form.sku.value" :disabled="!form.sku.checked">
            </local-sku-select>
            <el-checkbox v-model="form.sku.checked" @change="cleanVal('sku')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='货品状态'
          >
            <el-select v-model="form.goodsStatus.value" :disabled="!form.goodsStatus.checked">
              <el-option label="请选择" value=""></el-option>
              <el-option label="新品" :value="1"></el-option>
              <el-option label="类新品" :value="2"></el-option>
              <el-option label="二手" :value="3"></el-option>
            </el-select>
            <el-checkbox v-model="form.goodsStatus.checked" @change="cleanVal('goodsStatus')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item
            label='生产时间'
          >
            <el-date-picker
              v-model="form.productionTime.value"
              placeholder="生产时间"
              value-format="yyyy-MM-dd"
              :disabled="!form.productionTime.checked"
            ></el-date-picker>
            <el-checkbox v-model="form.productionTime.checked" @change="cleanVal('productionTime')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='入库时间'
          >
            <el-date-picker
              v-model="form.inboundDate.value"
              placeholder="入库时间"
              value-format="yyyy-MM-dd"
              :disabled="!form.inboundDate.checked"
            ></el-date-picker>
            <el-checkbox v-model="form.inboundDate.checked" @change="cleanVal('inboundDate')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="条码"
            prop="barcode"
          >
            <el-input v-model="form.barcode.value" :disabled="!form.barcode.checked" placeholder="条码">
              <template slot="append">
                <el-select v-model="form.barcode.type" :disabled="!form.barcode.checked">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="UPC" value="UPC"></el-option>
                  <el-option label="EAU" value="EAU"></el-option>
                  <el-option label="GDID" value="GDID"></el-option>
                  <el-option label="中国条码" value="中国条码"></el-option>
                </el-select>
              </template>
            </el-input>
            <el-checkbox v-model="form.barcode.checked" @change="cleanVal('barcode')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='上次操作时间'
          >
            <el-date-picker
              v-model="form.operaTime.value"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="!form.operaTime.checked"
              @change="handleDaterangeChange">
            </el-date-picker>
            <el-checkbox v-model="form.operaTime.checked" @change="cleanVal('operaTime')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="实时收入额"
            prop="currentIncomeAmount"
          >
            <el-input v-model="form.currentIncomeAmount.value" :disabled="!form.currentIncomeAmount.checked" placeholder="实时收入额">
            </el-input>
            <el-checkbox v-model="form.currentIncomeAmount.checked" @change="cleanVal('currentIncomeAmount')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="实时成本价"
            prop="currentCostAmount"
          >
            <el-input v-model="form.currentCostAmount.value" :disabled="!form.currentCostAmount.checked" placeholder="实时成本价">
            </el-input>
            <el-checkbox v-model="form.currentCostAmount.checked" @change="cleanVal('currentCostAmount')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label='厂家'
          >
            <el-input v-model="form.manufacturer.value" :disabled="!form.manufacturer.checked" placeholder="厂家"></el-input>
            <el-checkbox v-model="form.manufacturer.checked" @change="cleanVal('manufacturer')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='产地'
          >
            <el-input v-model="form.madeIn.value" :disabled="!form.madeIn.checked" placeholder="产地"></el-input>
            <el-checkbox v-model="form.madeIn.checked" @change="cleanVal('madeIn')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label='单号'
          >
            <el-input v-model="form.businessNo.value" :disabled="!form.businessNo.checked" placeholder="单号"></el-input>
            <el-checkbox v-model="form.businessNo.checked" @change="cleanVal('businessNo')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='备注'
          >
            <el-input v-model="form.remark.value" :disabled="!form.remark.checked" placeholder="备注关键字"></el-input>
            <el-checkbox v-model="form.remark.checked" @change="cleanVal('remark')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label='生产批次'
          >
            <el-input v-model="form.productionNo.value" :disabled="!form.productionNo.checked" placeholder="生产批次"></el-input>
            <el-checkbox v-model="form.productionNo.checked" @change="cleanVal('productionNo')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label='操作编号'
          >
            <el-input v-model="form.operateNo.value" :disabled="!form.operateNo.checked" placeholder="操作编号"></el-input>
            <el-checkbox v-model="form.operateNo.checked" @change="cleanVal('operateNo')">使用本筛选项</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="query">
          <el-button type="primary" @click="query()">定位</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="query-res" v-if="countViewShow">
      <div class="query-table">
        <el-form
          ref="formSub"
          :model="subData"
          label-width="120px"
        >
          <div class="query-total">
            <div class="query-total-item">合计 {{totalRecord}} 个货品实例</div>
            <div class="query-total-item">合计实时成本 {{count.totalCurrentCostAmount}} 元人民币</div>
            <div class="query-total-item">合计实时收入 {{count.totalCurrentIncomeAmount}} 元人民币</div>
            <div class="query-total-item">合计实时毛利 {{count.totalCurrentMaoriAmount}} 元人民币</div>
            <!-- <div class="sku-count"><div>共有{{totalRecord}}个货品实例</div>
              <div> 每页显示
                <el-select v-model="pageSize" size="mini" @change="handleSizeChange">
                  <el-option
                    v-for="item in skuShowCountList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select> 个</div>
              </div> -->
          </div>
          
          <ul class="sku-list">
            <li v-for="(item,index) in skuList" :key="item.title" v-loading="item.loading">
              <div class="sku-list-item" @click="chooseItem(item)"><i :class="{'el-icon-arrow-down':item.checked,'el-icon-arrow-right':!item.checked}"></i> <span class="item-title">{{item.title}}</span><span v-if="item.count">（总共{{item.count}}个）</span></div>
               
              <div class="item-sub-data" v-show="item.checked">
                <el-row>
                  <el-col :span="7">
                    <el-form-item
                      label='商品实例个数'
                    >
                      <el-input-number v-model="item.subData.quantity" @change="handleQuantityChange" :min="0" :max="item.count" label="商品实例个数"></el-input-number>
                      <el-button type="primary" @click="getList(item)">核销预览</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label='核销类型'
                      prop="inventoryStatus"
                      :rules="[{ required: item.subData.quantity?true:false,validator:(rules, value, callback)=>{
                        if (!item.subData.inventoryStatus&&item.subData.quantity) {
                           return callback('请选择核销类型');
                        }
                      }}]"
                    >
                      <el-select v-model="item.subData.inventoryStatus">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="差项核销" :value="3"></el-option>
                        <el-option label="销售核销" :value="4"></el-option>
                        <el-option label="销毁核销" :value="5"></el-option>
                        <el-option label="客户损毁" :value="6"></el-option>
                        <el-option label="操作失误核销" :value="7"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="10">
                    <el-form-item
                      label='单个收入额'
                      prop="incomeAmount"
                      :rules="[{ required: item.subData.quantity?true:false, validator:(rules, value, callback)=>{
                        if (!item.subData.incomeAmount&&item.subData.quantity) {
                          return callback('请填写单个收入额');
                        }
                        if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(item.subData.incomeAmount)&&item.subData.quantity) {
                          return callback('单个收入额只能为最多保留两位小数的数字');
                        }
                        if (!item.subData.incomeAmountCurrency&&item.subData.quantity) {
                          return callback('请选择币种');
                        }
                      }}]"
                    >
                      <el-input v-model="item.subData.incomeAmount" placeholder="单个收入额">
                        <template slot="append">
                          <currency-select v-model="item.subData.incomeAmountCurrency">
                          </currency-select>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item label="备注" >
                    <el-input v-model="item.subData.remark" type="textarea" :rows="4" placeholder="备注"></el-input>
                  </el-form-item>
                </el-row>
                <!-- <el-row>
                  <el-button type="primary" class="priview" @click="priview">核销预览</el-button>
                </el-row> -->
                <div class="item-table" v-show="item.list.length">
                  <el-table
                    :data="item.list"
                    border
                    :cell-style="handleCellStyle"
                    style="width: 100%">
                    <el-table-column
                      prop="sku"
                      label="本地SKU">
                    </el-table-column>
                    <el-table-column
                      prop="currentIncomeAmount"
                      label="实时收入">
                    </el-table-column>
                    <el-table-column
                      prop="currentCostAmount"
                      label="实时成本">
                    </el-table-column>
                    <el-table-column
                      prop="currentMaoriAmount"
                      label="实时毛利">
                    </el-table-column>
                    <el-table-column
                      prop="operateNo"
                      label="操作编号">
                    </el-table-column>
                    <el-table-column
                      label="最后一次操作时间">
                      <template slot-scope="props">
                        <span v-datetime="props.row.operateTime"></span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination-bar">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :page-sizes="[10, 25, 50, 100]"
                      :page-size="pageSize"
                      layout="sizes, prev, pager, next"
                      :total="parseInt(item.subData.quantity)">
                    </el-pagination>
                  </div>
                  <div class="item-button" v-if="!item.reasion">
                    <el-button type="primary" @click="submit(item)">确认核销</el-button>
                    <el-button type="default" @click="resetItem(item)">取消</el-button>
                  </div>
                  <div class="reasion" v-else>{{item.reasion}}</div>
                </div>
                
              </div>
              
            </li>
          </ul>
          <!-- <el-row v-if="skuList.length">
            <el-col :span="3" class="query">
              <el-button type="primary" :loading="loading" @click="submit()">确定</el-button>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
      
    </div>
  </el-dialog>
</template>

<script>
import Warehouse from '../services';
import LocalSkuSelect from '@/components/local-sku-select';

const warehouse = new Warehouse();

export default {
  components: {
    'local-sku-select': LocalSkuSelect,
  },
  data() {
    var check=(rule, value, callback)=>{
      if(!this.form.barcode.type){
        return callback(new Error('请选择条码类型'));
      }
    }
    var checkNumber=(rule, value, callback)=>{
      if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value.value)) {
        return callback(new Error('只能为最多保留两位小数的数字'));
      }
    }
    const form={
        sku:{
          value:"",
          nullKey:"queryNullSku",
          checked:false
        },
        goodsStatus:{
          value:"",
          nullKey:"queryNullGoodsStatus",
          checked:false
        },
        manufacturer:{
          value:"",
          nullKey:"queryNullManufacturer",
          checked:false
        },
        madeIn:{
          value:"",
          nullKey:"queryNullMadeIn",
          checked:false
        },
        productionTime:{
          value:"",
          nullKey:"queryNullProductionTime",
          checked:false
        },
        inboundDate:{
          value:"",
          checked:false
        },
        operaTime:{
          startTime:"",
          endTime:"",
          value:"",
          checked:false
        },
        barcode:{
          value:"",
          type:"",
          nullKey:"queryNullBarcode",
          checked:false
        },
        currentIncomeAmount:{
          value:"",
          type:"",
          nullKey:"queryNullCurrentIncomeAmount",
          checked:false
        },
        currentCostAmount:{
          value:"",
          type:"",
          nullKey:"queryNullCurrentCostAmount",
          checked:false
        },
        businessNo:{
          value:"",
          nullKey:"queryNullBusinessNo",
          checked:false
        },
        remark:{
          value:"",
          nullKey:"queryNullRemark",
          checked:false
        },
        operateNo:{
          value:"",
          checked:false
        },
        productionNo:{
          value:"",
          nullKey:"queryNullProductionNo",
          checked:false
        }
      }
    return {
      visible: false,
      loading: false,
      isPreview: false,
      id: '',
      form:JSON.parse(JSON.stringify(form)),
      formIndex:JSON.parse(JSON.stringify(form)),
      rules:{
        barcode:[{ validator: check,trigger: 'blur' }],
        currentIncomeAmount:[{ validator: checkNumber,trigger: 'blur' }],
        currentCostAmount:[{ validator: checkNumber,trigger: 'blur' }]
      },
      goodsData:[],
      totalRecord: 0,
      count:{
        totalCurrentCostAmount:0,
        totalCurrentIncomeAmount:0,
        totalCurrentMaoriAmount:0
      },
      pageNumber: 1,
      pageSize: 10,
      currentItem:null,
      countViewShow:false,
      subData:{
        sku:"",
        quantity:"",
        inventoryStatus:"",
        incomeAmount:"",
        incomeAmountCurrency:"",
        remark:""
      },
      skuList:[],
      // skuShowCount:10,
      skuShowCountList:[10,25,50,100],
    };
  },
  created() {
  },
  methods: {
    chooseItem(item){
      item.checked=!item.checked;
      this.currentItem=item;
    },
    handleCellStyle({row, column, rowIndex, columnIndex}){
      if(columnIndex==0){
        return {"font-weight":"bold"};
      }
    },
    show(id) {
      this.visible = true;
      this.id = id;
    },
    close() {
      this.visible = false;
      this.id = '';
    },
    getFormData(){
      let newObj={};
      for(let item in this.form){
        if(this.form[item].checked){
          if(item=='barcode'){
            newObj['barcode']=this.form[item].value;
            newObj['barcodeType']=this.form[item].type;
          }else if(item=='operaTime'){
            newObj['lastOperateDateStart']=this.form[item].startTime;
            newObj['lastOperateDateEnd']=this.form[item].endTime;
          }else{
             newObj[item]=this.form[item].value;
             if(this.form[item].nullKey){
               if(this.form[item].value){
                  newObj[this.form[item].nullKey]=0;
               }else{
                 newObj[this.form[item].nullKey]=1;
               }
               
             }
          }
        }else{
          if(this.form[item].nullKey){
            newObj[this.form[item].nullKey]="";
          }
          if(item=='barcode'){
            newObj['barcode']="";
            newObj['barcodeType']="";
          }else if(item=='operaTime'){
            newObj['lastOperateDateStart']="";
            newObj['lastOperateDateEnd']="";
          }else{
             newObj[item]="";
          }
        }
      }
      return newObj;
    },
    query(){
      const params=this.getFormData();
      warehouse.verificationCount(this.id,params).then(res=>{
        this.count=res.data.data;
      });
      this.loading = true;
      const listParams={...params,pageNumber:this.pageNumber,pageSize:this.pageSize};
       this.totalRecord=0;
      warehouse.skuAll(this.id,params).then(res=>{
        this.loading = false;
        this.countViewShow=true;
        this.skuList=res.data.data.map((item)=>{
          let obj={};
          obj.title=item.sku;
          obj.checked=false;
          obj.list=[];
          obj.totalList=[];
          // obj.haveVal=false;
          obj.count=item.saleAvailableQuantity;
          obj.pageNumber=1;
          obj.pageSize=10;
          obj.loading=false;
          obj.reasion="";
          obj.subData={
            sku:item.sku,
            quantity:"",
            incomeAmount:"",
            incomeAmountCurrency:"",
            remark:"",
            inventoryStatus:""
          }
          this.totalRecord+=item.saleAvailableQuantity;
          return obj;
        });
        if(this.skuList.length){
          // this.getList(this.skuList[0]);
          this.skuList[0].checked=true;
          this.currentItem=this.skuList[0];
        }
      }).catch(() => {
        this.loading = false;
      });
      
    },
    resetItem(item){
      item.list=[];
      item.totalList=[];
      item.pageNumber=1;
      item.pageSize=10;
      item.subData.quantity=0;
      item.reasion="";
    },
    getList(item){
      if(!item.subData.quantity) return;
      // if(!item.haveVal||flag){
        const params=this.getFormData();
        params.sku=item.title;
        params.queryNullSku=0;
        const listParams={...params,pageNumber:1,pageSize:item.subData.quantity};
        item.loading = true;
        warehouse.verificationList(this.id,listParams).then(res=>{
          item.loading = false;
          item.reasion="";
          
          item.totalList = res.data.data.data;
          item.list=item.totalList.slice(0,this.pageSize-1);

          // item.checked=true;
          // item.haveVal=true;
          item.count = res.data.data.totalRecord;
        }).catch(() => {
          item.loading = false;
        });
      // }else{
      //   item.checked=!item.checked;
      // }
      
    },
    contactData(item){
      let goodsList=[];
      let goodsIds=[];
      // for(let i=0;i<this.skuList.length;i++){
      //   if(this.skuList[i].haveVal){
      //     let subData=this.skuList[i].subData;
      //     let index=parseInt(subData.quantity);
      //     let list=this.skuList[i].list;
      //     if(index){
      //       for(let j=0;j<index;j++){
      //         goodsIds.push(list[j].id);
      //       }
      //       goodsList.push({...this.skuList[i].subData});
      //     }
          
      //   }
      // }
      for(let i=0;i<item.totalList.length;i++){
        goodsIds.push(item.totalList[i].id);
      }
      let newGoodIds=goodsIds.join(",");
      let params={goodsIds:newGoodIds};
      goodsList.push(item.subData);
      goodsList.forEach((item,index)=>{
        Object.keys(item).forEach((key) => {
          params[`goodsList[${index}].${key}`] = item[key];
        });
      })
      
      return params;
    },
    submit(item){
      if(!item.subData.inventoryStatus){
        this.$message({
          message: '请选择核销类型',
          type: 'warning'
        });
        return;
      }
      if(!item.subData.incomeAmount){
        this.$message({
          message: '请填写单个收入额',
          type: 'warning'
        });
        return;
      }
      if(!item.subData.incomeAmountCurrency){
        this.$message({
          message: '请填选择币种',
          type: 'warning'
        });
        return;
      }
      const params=this.contactData(item);
      item.loading = true;
      warehouse.verification(this.id,Object.assign({},params)).then(res=>{
        item.loading = false;
        let data=res.data.data;
        let successCount=data.success;
        let failCount=data.fail;
        if(failCount===0){
          this.$message({
            message: '核销成功',
            type: 'success'
          });
          this.resetItem(item);
        }else{
          item.subData.quantity=failCount;
          let array=[];
          for(let i=0;i<item.totalList.length;i++){
            if(data.failIds.indexOf(item.totalList[i].id)!=-1){
              array.push(item.totalList[i]);
            }
          }
          item.list=array;
          item.reasion="执行成功"+successCount+"个,"+"失败"+failCount+"个,"+data.failReason;
        }
        item.count-=successCount;
        this.totalRecord-=successCount;
      }).catch(() => {
        item.loading = false;
      });
    },
    cleanVal(val){
      if(!this.form[val].checked){
        if(val=='barcode'){
          this.form[val].value="";
          this.form[val].type="";
        }else if(val=='operaTime'){
          this.form[val].value="";
          this.form[val].startTime="";
          this.form[val].endTime="";
        }else{
          this.form[val].value="";
        }
      }
      
    },
    close(){
      this.visible = false;
      this.id = '';
      this.form=this.formIndex;
      this.countViewShow=false;
      this.skuList=[];
    },
    handleSizeChange(val) {
      this.currentItem.pageSize = val;
      let begin=(this.currentItem.pageNumber-1)*this.currentItem.pageSize;
      this.currentItem.list=this.currentItem.totalList.slice(begin,begin+this.currentItem.pageSize-1);
    },
    handleCurrentChange(val) {
      this.currentItem.pageNumber = val;
      let begin=(this.currentItem.pageNumber-1)*this.currentItem.pageSize;
      this.currentItem.list=this.currentItem.totalList.slice(begin,begin+this.currentItem.pageSize-1);
    },
    handleDaterangeChange(val){
      if(!val){
        this.form.operaTime.value="";
        this.form.operaTime.startTime="";
        this.form.operaTime.endTime="";
      }else{
        this.form.operaTime.startTime=val[0];
        this.form.operaTime.endTime=val[1];
      }
    },
    handleQuantityChange(val){

    }
  }
}
</script>
<style lang="css" scoped>
.el-input{
  width: 70%;
}
.el-select>.el-input{
  width: 100%;
}
.el-dialog__body{
  max-height: 500px;
  overflow: auto;
}
.sku-count .el-select>.el-input{
  width: 100px;
}
.reasion{
  color: #F56C6C;
  text-align: center;
}
</style>
<style lang="less">
.query{
  float:right;
}
.query-res{
  margin-top:20px;
}
.query-total{
  padding: 10px 0;
  .query-total-item{
    display:inline-block;
    margin-right: 20px;
    font-size: 16px;
  }
}
.query-sub{
  margin-top:50px;
}
.query-table{
  padding-left:120px;
}
.sku-count{
  float: right;
  overflow: hidden;
  font-size: 16px;
  margin-right: 0;
  div{
    display:inline-block;
  }
  &>div{
    margin-right: 20px;
  }
}
ul.sku-list{
  margin-top: 10px;
  li{
    margin:10px 0;
    .pagination-bar{
      margin-top:5px;
      li{
        margin:0;
      }
    }
    .item-title{
      font-size: 16px;
      color: #333;
    }
    .item-title{
      cursor: pointer;
    }
    .item-sub-data{
      margin-top:10px;
    }
    .item-table{
      margin-left:120px;
      padding:5px;
      background: #fefefe;
      border: 1px solid #f1f1f1;
      box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
    }
    .item-button{
      width: 215px;
      margin:0 auto;
    }
  }
  
}
.sku-list-item{
  display: inline;
  cursor: pointer;
}
.priview{
  float:right;
  margin-bottom: 10px;
}
</style>
