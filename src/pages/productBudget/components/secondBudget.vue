<template lang="html">
  <el-dialog
    title="二次探索"
    :visible.sync="visible"
    width="400px"
    append-to-body
  >
    <el-form
      v-loading="loading"
      :model="form"
      ref="form"
    >
      <el-form-item
        label-width="80px"
        v-for="(item, index) in form.keyWords"
        :key="`item_${index}`"
        :label="`探索词${index + 1}`"
        :prop="`keyWords[${index}].text`"
        :rules="{
          required: true,
          validator: validator
        }"
      >
        <el-input
          v-model="item.text"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">立即创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/mixin/dialog';
import loadingMixin from '@/mixin/loading';
import ProductBudget from '../services';

const productBudget = new ProductBudget();

export default {
  mixins: [dialogMixin, loadingMixin],
  data() {
    return {
      loading: false,
      form: {
        keyWords: [
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
        ],
      },
    };
  },
  methods: {
    afterShow(data) {
      this.data = data;
      const p = productBudget.getSecondBudgetKeyWords(data.id);
      this.checkLoadingByPromise(p).then((res) => {
        (res.data.data || []).forEach((item, index) => {
          this.form.keyWords[index].text = item.keyWord;
        })
      });
    },
    validator(rule, value, cb) {
      if (value === this.data.keyWords) {
        cb('探索词不能与主词相同');
        return;
      }
      const keyWords = this.form.keyWords
        .map(item => item.text).filter(s => !!s);
      const wordsStr = `,${keyWords.join(',,')},`;

      for (let i = 0; i < keyWords.length; i++) {
        const s = keyWords[i];
        if (s.indexOf(',') !== -1) {
          cb('不能包含逗号');
          return;
        }
      }
      for (let i = 0; i < keyWords.length; i++) {
        const s = keyWords[i];
        if (wordsStr && wordsStr.split(`,${s},`).length > 2) {
          cb('探索词不能相同');
          return;
        }
      }
      cb();
    },
    afterClose() {
      this.form = {
        keyWords: [
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
          {
            text: '',
          },
        ],
      };
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const keyWords = this.form.keyWords.map(s => s.text);
        const params = {};

        params.id = this.data.id;
        keyWords.forEach((keyWord, i) => {
          params[`keyWord${ i + 1 }`] = keyWord;
        });

        const p = productBudget.secondBudget(params);
        this.checkLoadingByPromise(p).then(() => {
          this.close();
          this.$emit('success');
        });
      });
    },
  },
};
</script>

<style lang="less">
</style>
