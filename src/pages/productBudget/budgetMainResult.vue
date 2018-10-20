<template lang="html">
  <div>
    <div class="page-title">
      商品建模画像结果
      <a @click="back">返回商品建模画像列表</a>
    </div>
    <el-row id="row">
      <el-col
        :span="8"
      >
        <main-word-item
          :showDetail="true"
          :data="fromData"
        >
        </main-word-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        id="mainResultItemContainer"
        :span="12"
        v-for="(item, index) in list"
        :key="`word_${index}`"
      >
        <budget-main-result-item
          :data="item"
          :fullWidth="fullWidth"
        >
        </budget-main-result-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MainWordItem from './components/mainWordItem';
import loadingMixin from '@/mixin/loading';
import BudgetMainResultItem from './components/budgetMainResultItem';
import ProductBudget from './services';

const productBudget = new ProductBudget();

export default {
  mixins: [loadingMixin],
  components: {
    'budget-main-result-item': BudgetMainResultItem,
    'main-word-item': MainWordItem
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  computed: {
    fromData() {
      return this.$route.params.fromData || {};
    },
    fullWidth() {
      return document.querySelector('#row').offsetWidth;
    }
  },
  methods: {
    loadData() {
      const p = productBudget.budgetMainResult(this.$route.params.fromData.id);
      this.checkLoadingByPromise(p).then((res) => {
        let data = res.data.data;
        let titleInfos = [];
        let newFiveInfos = [];

        for(let key of Object.keys(data.titleWord)) {
          titleInfos.push({
            label: key,
            value: data.titleWord[key]
          });
        }
        for(let key of Object.keys(data.newFiveWord)) {
          newFiveInfos.push({
            label: key,
            value: data.newFiveWord[key]
          });
        }
        titleInfos.sort(function(a, b){  
          return b.value - a.value;  
        })  
        newFiveInfos.sort(function(a, b){  
          return b.value - a.value;  
        })  
        this.list.push({
          title: '速描商品核心轮廓',
          infos: titleInfos,
        });
        this.list.push({
          title: '刻画商品基本属性',
          infos: newFiveInfos,
        });
      });
    },
    back() {
      this.$router.push({
        name: 'budgetMain',
      });
    }
  },
};
</script>

<style lang="less">
</style>
