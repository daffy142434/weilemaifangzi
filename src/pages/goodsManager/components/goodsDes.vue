<template lang="html">
  <div class="goodsDes">
    <el-form label-width="80px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="中文" name="cn">
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.cnBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.cnCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.cnDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="英语" name="en">
          <div class="top-btn">
            <el-button type="success" size="small" lang="en" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.enBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.enName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.enCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.enDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="法语" name="fr">
          <div class="top-btn">
            <el-button type="success" size="small" lang="fr" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.frBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.frName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.frCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.frDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="德语" name="de">
          <div class="top-btn">
            <el-button type="success" size="small" lang="de" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.deBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.deName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.deCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.deDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="西班牙语" name="es">
          <div class="top-btn">
            <el-button type="success" size="small" lang="es" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.esBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.esName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.esCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.esDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="意大利语" name="it">
          <div class="top-btn">
            <el-button type="success" size="small" lang="it" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.itBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.itName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.itCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.itDescription"></el-input>
        </el-tab-pane>
        <el-tab-pane label="葡萄牙语" name="pt">
          <div class="top-btn">
            <el-button type="success" size="small" lang="pt" @click="translate">一键翻译</el-button>
          </div>
          <el-form-item label="卖点">
            <el-select
              style="width: 100%"
              :multiple-limit="5"
              v-model="data.ptBulletPoint"
              multiple
              default-first-option
              no-data-text="请输入后回车进行确认，最多可输入五个卖点"
              filterable
              allow-create
              placeholder="请输入后回车进行确认，最多可输入五个卖点">
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="data.ptName"></el-input>
          </el-form-item>
          <el-form-item label="配货信息">
            <el-input v-model="data.ptCargoInfo"></el-input>
          </el-form-item>
          <el-input type="textarea" :rows="desRows" v-model="data.descriptions.ptDescription"></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <div style="margin-top: 15px;text-align: center;">
      <el-button v-if="data.action !='edit' && false" type="primary" icon="el-icon-upload" @click="saveDes">保存信息</el-button>
      <el-button type="primary" icon="el-icon-check" @click="submitDes">提交信息</el-button>
    </div>
  </div>
</template>

<script>
import translate from 'lib/translate';
export default {
  props: ['data', 'title'],
  data() {
    return {
      desRows: 10,
      activeName: 'cn',
    };
  },
  methods: {
    saveDes() {
      this.$store.dispatch('saveGoods');
    },
    submitDes() {
      this.$store.dispatch('submitGoods');
    },
    translate(event) {
      let lang = event.currentTarget.attributes.lang.nodeValue;
      let data = this.data;
      if(lang) {
        translate(data[lang+'Name'],'', lang, function(result) {
          data[lang+'Name'] = result;
        });
        translate(data[lang+'CargoInfo'],'', lang, function(result) {
          data[lang+'CargoInfo'] = result;
        });
        for(let i=0; i<data[lang+'BulletPoint'].length; i++) {
          (function(index) {
            translate(data[lang+'BulletPoint'][index],'', lang, function(result) {
              data[lang+'BulletPoint'].splice(index, 1, result);
            });
          })(i)
        }
        translate(data.descriptions[lang+'Description'],'', lang, function(result) {
          data.descriptions[lang+'Description'] = result;
        });
      }
    },
  }
}
</script>

<style lang="less">
  .goodsDes {
    .top-btn {
      padding-left: 80px;
      margin-bottom: 15px;
    }
    .el-tabs__header {
      margin-bottom: 15px;
    }
  }
</style>
