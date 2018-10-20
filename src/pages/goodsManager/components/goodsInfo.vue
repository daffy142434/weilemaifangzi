<template lang="html">
  <div>
    <el-input v-if="false">
      <template slot="prepend">来源URL</template>
      <el-button type="primary" slot="append" v-model="crawlerUrl" @click="getGoodsInfo">采集数据</el-button>
    </el-input>
    <el-form ref="form" size="mini" :rules="rules" :model="data" label-width="100px" class="heavy-form">
      <el-row>
        <form-item :span="12" label="中文名称">
          <el-input v-model="data.name"></el-input>
        </form-item>
        <div class="primary el-col el-col-6">
          <div class="el-form-item el-form-item--mini">
            <label class="el-form-item__label" style="width: 100px; height: 28px; line-height: 22px; position: relative; top: 2px; left: 14px;">
              <span style="text-align: center; display: block;">
                采购价格
              </span>
              <span style="font-size: 12px; display: block; text-align: center;">
                （需人民币）
              </span>
            </label>
            <div class="el-form-item__content" style="margin-left: 100px;">
              <div class="el-input el-input--mini">
                <input v-model="data.purchasePrice" autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner">
              </div>
            </div>
          </div>
        </div>
        <form-item :span="6" label="产品类目">
          <div class="clearfix">
            <span></span>
            <el-tooltip
              placement="top"
              trigger="hover"
              v-if="data.categoryTreePath !== ''"
              :content="data.categoryTreePath"
            >
              <el-button
                type="text"
                size="small fr"
                class="category-button"
                @click="chooseCategory"
              >{{data.categoryTreePath}}</el-button>
            </el-tooltip>
            <el-button
              type="text"
              size="small fr"
              class="category-button"
              v-if="data.categoryTreePath === ''"
              @click="chooseCategory"
            >选择类目</el-button>
          </div>
        </form-item>
      </el-row>
      <el-row>
        <form-item :span="12" label="英文名字">
          <el-input v-model="data.enName"></el-input>
        </form-item>
        <form-item :span="6" label="颜色">
          <el-input v-model="data.color"></el-input>
        </form-item>
        <form-item :span="6" label="商品状态">
          <el-select v-model="data.skuStatus">
            <el-option label="已删除" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
        </form-item>
      </el-row>
      <el-row>
        <form-item :span="7" label="主SKU" prop="originSku">
          <el-input v-model="data.originSku" :disabled="data.skuId!==''"></el-input>
        </form-item>
        <form-item :span="5" label="工厂型号">
          <el-input v-model="data.size"></el-input>
        </form-item>
        <form-item :span="6" label="品牌">
          <el-input v-model="data.brand"></el-input>
        </form-item>
        <form-item :span="6" label="开发人">
          <el-select v-model="data.developer" style="width:100%;">
            <el-option
              v-for="item in developers"
              :key="item.userNo"
              :label="item.loginName+'( '+item.name+' )'"
              :value="item.userNo">
            </el-option>
          </el-select>
        </form-item>
      </el-row>
      <strong class="form-label">
        报关信息
      </strong>
      <el-row>
        <form-item :span="12" label="中文报关名">
          <el-input v-model="data.declareCnName"></el-input>
        </form-item>
        <form-item :span="12" label="英文报关名">
          <el-input v-model="data.declareEnName"></el-input>
        </form-item>
      </el-row>
      <el-row>
        <form-item :span="12" label="报关编码">
          <el-input v-model="data.declareCode"></el-input>
        </form-item>
        <form-item :span="6" label="报关价格">
          <el-input v-model="data.declarePrice"></el-input>
        </form-item>
        <form-item :span="6" label="报关货币">
          <el-input v-model="data.declareCurrency"></el-input>
        </form-item>
      </el-row>
      <strong class="form-label">
        装箱信息
      </strong>
      <el-row>
        <form-item :span="8" label="单包重量单位">
          <el-select v-model="data.unitaryWeightUnit">
            <el-option value="g" label="克"></el-option>
            <el-option value="kg" label="千克"></el-option>
            <el-option value="lb" label="磅"></el-option>
          </el-select>
        </form-item>
        <form-item :span="8" label="单包重量">
          <el-input v-model="data.unitaryWeight">
            <template slot="append"><span>{{unitaryWeightUnitText}}</span></template>
          </el-input>
        </form-item>
        <form-item :span="8" label="单包尺寸单位">
          <el-select class="form-control" v-model="data.unitarySizeUnit">
  					<el-option value="cm" label="厘米"></el-option>
  					<el-option value="m" label="米"></el-option>
  					<el-option value="feet" label="英尺"></el-option>
  					<el-option value="inches" label="英寸"></el-option>
  				</el-select>
        </form-item>
        <form-item :span="8" label="单包尺寸">
          <el-row>
            <form-item :span="7" className="short-input">
              <el-input placeholder="最长边" v-model="data.unitarySizeLength">
              </el-input>
            </form-item>
            <form-item :span="7" className="short-input">
              <el-input placeholder="中边" v-model="data.unitarySizeWidth">
              </el-input>
            </form-item>
            <form-item :span="7" className="short-input">
              <el-input placeholder="最短边" v-model="data.unitarySizeHeight">
              </el-input>
            </form-item>
            <el-col :span="3">
              <span class="goods-unit">
                {{unitarySizeUnitText}}
              </span>
            </el-col>
          </el-row>
        </form-item>
        <form-item :span="8" label="是否带电">
          <el-select v-model="data.batteryType">
            <el-option value="0" label="不带电"></el-option>
            <el-option value="1" label="内置"></el-option>
            <el-option value="2" label="纯电"></el-option>
          </el-select>
        </form-item>
      </el-row>
      <el-row>
        <form-item :span="8" label="外箱重量单位">
          <el-select v-model="data.packageWeightUnit">
            <el-option value="g" label="克"></el-option>
            <el-option value="kg" label="千克"></el-option>
            <el-option value="lb" label="磅"></el-option>
          </el-select>
        </form-item>
        <form-item :span="8" label="外箱重量">
          <el-input v-model="data.packageWeight">
            <template slot="append">{{packageWeightUnitText}}</template>
          </el-input>
        </form-item>
        <form-item :span="8" label="外箱尺寸单位">
          <el-select class="form-control" v-model="data.packageSizeUnit">
  					<el-option value="cm" label="厘米"></el-option>
  					<el-option value="mm" label="毫米"></el-option>
  					<el-option value="m" label="米"></el-option>
  					<el-option value="inches" label="英尺"></el-option>
  				</el-select>
        </form-item>
        <form-item :span="8" label="外箱尺寸">
          <el-row>
            <form-item :span="7" className="short-input">
              <el-input placeholder="最长边" v-model="data.packageSizeLength">
              </el-input>
            </form-item>
            <form-item :span="7" className="short-input">
              <el-input placeholder="中边" v-model="data.packageSizeWidth">
              </el-input>
            </form-item>
            <form-item :span="7" className="short-input">
              <el-input placeholder="最短边" v-model="data.packageSizeHeight">
              </el-input>
            </form-item>
            <el-col :span="3">
              <span class="goods-unit">
                {{packageSizeUnitText}}
              </span>
            </el-col>
          </el-row>
        </form-item>
        <form-item :span="8" label="外箱装箱数量">
          <el-input v-model="data.cartonIncludeNum"></el-input>
        </form-item>
        <form-item :span="8" label="外箱体重量比">
          <el-input v-model="data.packageSizeWeightRate"></el-input>
        </form-item>
      </el-row>
      <el-row>
        <form-item :span="24" label="图片">
          <el-upload
            :action="uploadAction"
            list-type="picture-card"
            name="uploadFile"
            :file-list="data.imgs"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
          >
          <i class="el-icon-plus"></i>
          </el-upload>
          <div>请上传bmp/jpg/gif/png文件，且不超过2M</div>
        </form-item>
      </el-row>
    </el-form>
    <div style="margin-top: 15px;text-align: center;">
      <el-button v-if="data.action !='edit' && false" type="primary" icon="el-icon-upload" @click="saveGoodsBase">保存信息</el-button>
      <el-button type="primary" icon="el-icon-check" @click="submitGoodsBase">提交信息</el-button>
    </div>
    <categoryDialog :visible="visible" :data="data" @close="closeCategoryDialog">
    </categoryDialog>
  </div>
</template>

<script>
import ajax from 'lib/ajax';
import skuManagerDialog from './skuManagerDialog';
import categoryDialog from '@/components/categoryDialog';

let uploadAction;

if (process.env.NODE_ENV === 'development') {
  uploadAction = '/api/image/upload';
} else {
  uploadAction = '/image/upload';
}
const weightUnitMap = {
  g: "克",
  kg: "千克",
  lb: "磅",
};
const sizeUnitMap = {
  cm: "厘米",
  m: "米",
  feet: "英尺",
  inches: "英寸",
};
export default {
  props: ['data', 'title'],
  data() {
    return {
      uploadAction,
      visible: false,
      developers: [],
      crawlerUrl: '',
      rules: {
        // originSku: [{
        //   required: true,
        //   message: '主SKU不能为空',
        //   trigger: 'blur'
        // }],
      },
    };
  },
  computed: {
    unitaryWeightUnitText: {
      get() {
        return weightUnitMap[this.data.unitaryWeightUnit];
      }
    },
    unitarySizeUnitText: {
      get() {
        return sizeUnitMap[this.data.unitarySizeUnit];
      }
    },
    packageWeightUnitText: {
      get() {
        return weightUnitMap[this.data.packageWeightUnit];
      }
    },
    packageSizeUnitText: {
      get() {
        return sizeUnitMap[this.data.packageSizeUnit];
      }
    }
  },
  beforeCreate(){

    // 查询所有会员
    ajax.post('/members/list_all')
    .then((response) => {
      if(response.data.code == 200) {
        this.developers = response.data.data || [];
      }
    });
  },
  mounted(){
  },
  methods: {

    //  采集数据
		getGoodsInfo() {
      // ajax.post('/products/collect/website', {crawlerUrl: this.crawlerUrl})
      // .then((response) => {
      //   if(response.data.code == 200) {
      //     this.setGoodsInfo(response.data.data);
      //   }
      // });
    },
    setGoodsInfo(data) {

    },

    chooseCategory() {
      this.visible = true;
    },

    closeCategoryDialog() {
      this.visible = false;
    },

    handleRemove(file, fileList) {
      if(this.data.imgs.filter(item => item.name == file.name).length > 0) {
        let temp = this.data.imgs.filter(item => item.name != file.name);
        this.data.imgs = temp;
      }
    },
    beforeUpload(file) {
      if(this.data.imgs.length >=5) {
        this.$message({
          showClose: true,
          message: '最多上传5张图片',
          type: 'warning'
        });
        return false;
      }
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
    },

    handleUploadSuccess(response, file, fileList) {
      if(response.code == "200") {
        let data = response.data;
        if(this.data.imgs.filter(item => item.name == file.name).length == 0) {
          this.data.imgs.push({name: Object.keys(data)[0], url: Object.values(data)[0]});
        }else {
          this.$message({
            showClose: true,
            message: '图片'+file.name+"已经上传过，请选择其他图片上传",
            type: 'error'
          });
          fileList.pop();
        }
      }else {
        this.$message({
          showClose: true,
          message: response.msg+'，请删除'+file.name+"后重新上传",
          type: 'error'
        });
      }
    },
    saveGoodsBase() {
      this.$store.dispatch('saveGoods');
    },
    submitGoodsBase() {
      this.$store.dispatch('submitGoods');
    },
  },
  components: {
    skuManagerDialog,
    categoryDialog,
    'form-item': {
      props: {
        span: {
          type: Number
        },
        label: {
          type: String
        },
        'className': {
          type: String,
          required: false
        }
      },
      template: '<el-col :span="span"><el-form-item :label="label" :class="className"><slot></slot></el-form-item></el-col>'
    }
  }
}
</script>

<style lang="less">
@import './goodsInfo.less';
</style>
