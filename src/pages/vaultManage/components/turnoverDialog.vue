<template lang="html">
    <el-dialog
    title="新增交易 "
    :visible.sync="dialogVisible"
    width="80%"
    >
    <el-form :inline="true" :model="searchData" label-width="100px">
      <el-row>
        <el-col :span="12">
            <el-form-item label="金额">
              <el-input placeholder="金额" type="number" :min="0" v-model="searchData.operationAmount">
                <template slot="append">CNY</template>
              </el-input>
            </el-form-item>
            <el-form-item label="" v-if="permissions('financial_warehouse:recharge')"><el-checkbox true-label="1" false-label="0" v-model="searchData.rechargeFlag">是否充值</el-checkbox></el-form-item>
        </el-col>
        <el-col :span="12" v-show="searchData.rechargeFlag==0">
          <el-form-item label="店铺">
            <shop-autocomplete @getShopId="getShopId" ref="shopAutocomplete"></shop-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="searchData.rechargeFlag==0">
          <el-form-item label="部门">
            <el-select v-model="searchData.departmentId">
              <el-option label="无相关" value=""></el-option>
              <el-option label="运营部" value="1"></el-option>
              <el-option label="行政人事部" value="2"></el-option>
              <el-option label="技术部" value="3"></el-option>
              <el-option label="总裁办" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="searchData.rechargeFlag==0">
          <el-form-item label="在线SKU">
            <online-sku-autocomplete v-model="searchData.onlineSku" :shop-id="searchData.shopId" @cleanVal="cleanVal"></online-sku-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="searchData.rechargeFlag==0">
          <el-form-item label="用途">
            <el-select v-model="searchData.transactionType">
              <el-option label="请选择" value=""></el-option>
              <el-option label="样品费" value="0"></el-option>
              <el-option label="红单成本" value="1"></el-option>
              <el-option label="翻译费" value="2"></el-option>
              <el-option label="购买资源" value="3"></el-option>
              <el-option label="其他" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="searchData.rechargeFlag==0">
          <el-form-item label="订单号">
            <el-input placeholder="订单号" v-model="searchData.orderNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明" class="trunover-dialog-textarea">
            <el-input type="textarea"  placeholder="说明" v-model="searchData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传图片">
            <el-upload
                :action="uploadImgAction"
                list-type="picture-card"
                name="uploadFile"
                multiple
                :data="{businessType: 'warehouse_acc'}"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :on-error="handleError"
                :limit="5"
                accept="image/*"
                ref="uploadImg"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div>请上传bmp/jpg/gif/png文件,且不超过2M,最多上传5张图片</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传文件">
            <el-upload
              :action="uploadFileAction"
              :data="{businessType: 'warehouse_acc'}"
              :before-upload="beforeUploadFile"
              :on-remove="handleRemoveFile"
              :on-success="handleUploadSuccessFile"
              :on-error="handleError"
              multiple
              :limit="3"
              accept="file"
              name="uploadFile"
              ref="uploadFile"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">文件大小不超过2M,最多上传3个文件</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit" :disabled="disabled">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ShopAutocomplete from '@/components/shop-autocomplete'
import OnlineSkuAutocomplete from '@/components/online-sku-autocomplete'
import services from '../services';
const service = new services();
  export default {
    data() {
      let uploadImgAction,uploadFileAction;
      if (process.env.NODE_ENV === 'development') {
        uploadImgAction = '/api/image/upload';
        uploadFileAction='/api/file/upload';
      } else {
        uploadImgAction = '/image/upload';
        uploadFileAction='/file/upload';
      }
      return {
        dialogVisible: false,
        disabled:false,
        searchData:{
          warehouseId:"",
          operationAmount:"",
          rechargeFlag:"0",
          onlineSku:"",
          departmentId:"",
          shopId:"",
          transactionType:"",
          orderNo:"",
          remark:"",
          imgs:[],
          accessoryDtos:[]
        },
        uploadImgAction:uploadImgAction,
        imgList:[],
        uploadFileAction:uploadFileAction,
        fileList:[]
      };
    },
    components: {
      ShopAutocomplete,
      OnlineSkuAutocomplete
    },
    watch:{
      // 'searchData.rechargeFlag':function(val,oldVal){
      //   if(val==="1"){
      //     this.searchData.shopId="";
      //     this.searchData.departmentId="";
      //     this.searchData.onlineSku="";
      //     this.searchData.transactionType="";
      //     this.searchData.orderNo="";
      //     this.$refs.shopAutocomplete.value="";
      //   }
      // }
    },
    methods: {
      cleanVal(){
        this.searchData.onlineSku="";
      },
      show(id){
        this.dialogVisible=true;
        // this.searchData.warehouseId=id;
        this.searchData={
          warehouseId:id,
          operationAmount:"",
          rechargeFlag:"0",
          onlineSku:"",
          departmentId:"",
          shopId:"",
          transactionType:"",
          orderNo:"",
          remark:"",
          imgs:[],
          accessoryDtos:[]
        }
        this.$refs.shopAutocomplete.value="";
        this.$refs.uploadImg.clearFiles();
        this.$refs.uploadFile.clearFiles();
        this.imgList=[];
        this.fileList=[];
      },
      getShopId(id){
        this.searchData.shopId=id;
        this.searchData.onlineSku="";
      },
      submit(){
        if(!this.searchData.operationAmount){
          this.$message({
            message: '请填写金额',
            type: 'warning'
          });
          return false;
        }
        if(parseInt(this.searchData.operationAmount)<=0){
          this.$message({
            message: '金额不能为负',
            type: 'warning'
          });
          return false;
        }
        if(this.searchData.rechargeFlag=="0"&&!this.searchData.departmentId){
          this.$message({
            message: '请选择部门',
            type: 'warning'
          });
          return false;
        }
        if(this.searchData.rechargeFlag=="0"&&!this.searchData.transactionType){
          this.$message({
            message: '请选择用途',
            type: 'warning'
          });
          return false;
        }
        for(let i=0;i<this.imgList.length;i++){
          this.searchData['imgs['+i+']']=Object.values(this.imgList[i])[0];
        }
        for(let i=0;i<this.fileList.length;i++){
          this.searchData['accessoryDtos['+i+'].accessoryPath']=this.fileList[i].value.savePath;
          this.searchData['accessoryDtos['+i+'].accessoryName']=this.fileList[i].value.fileName;
          this.searchData['accessoryDtos['+i+'].accessoryUrl']=this.fileList[i].value.viewUrl;
        }
        if(this.searchData.rechargeFlag=="1"){
          this.searchData.shopId="";
          this.searchData.departmentId="";
          this.searchData.onlineSku="";
          this.searchData.transactionType="";
          this.searchData.orderNo="";
        }
        service.add(this.searchData).then(res=>{
          if(res.data.code===200){
            this.$emit("search");
            this.dialogVisible=false;
          }
        })
      },
      handleRemoveFile(file, fileList) {
        this.fileList=this.fileList.filter(item=>{
          if(item.uid!==file.uid) return item;
        })

      },
      handleError(){
        this.disabled=false;
      },
      beforeUploadFile(file) {
        if (file.size / 1024 /1024 > 2) {
          this.$message({
            showClose: true,
            message: '请上传小于2MB的图片',
            type: 'warning'
          });
          return false;
        }
        this.disabled=true;
      },
      handleUploadSuccessFile(response, file, fileList) {
        this.disabled=false;
        if(response.code == "200") {
          let data={};
          data.value = response.data;
          data.uid=file.uid;
          this.fileList.push(data);
        }else {
          this.$message({
            showClose: true,
            message: response.msg+'，请删除'+file.name+"后重新上传",
            type: 'error'
          });
        }
      },
      handleRemove(file, fileList) {
        this.imgList=this.imgList.filter(item=>{
          if(Object.keys(item)[0]!==file.name) return item;
        })
      },
      beforeUpload(file) {
        if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif' && file.type != 'image/bmp') {
          this.$message({
            showClose: true,
            message: '请上传JPG/PNG/GIF/BMP格式的图片',
            type: 'warning'
          });
          return false;
        }
        if (file.size / 1024 /1024 > 2) {
          this.$message({
            showClose: true,
            message: '请上传小于2MB的图片',
            type: 'warning'
          });
          return false;
        }
        this.disabled=true;
      },
      handleUploadSuccess(response, file, fileList) {
        this.disabled=false;
        if(response.code == "200") {
          let data = response.data;
          this.imgList.push(data);
        }else {
          this.$message({
            showClose: true,
            message: response.msg+'，请删除'+file.name+"后重新上传",
            type: 'error'
          });
        }
      },
    }
  };
</script>
<style lang="less">
.trunover-dialog-textarea{
  width: 100%;
  .el-form-item__content{
    width: 80%;
  }
} 
</style>