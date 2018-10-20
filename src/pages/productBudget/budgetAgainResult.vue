<template lang="html">
  <div>
    <div class="page-title">
      二次探索结果
      <a @click="back">返回二次探索列表</a>
    </div>
    <div class="budget-result-page" v-loading="loading">
      <budget-result-item
        v-for="(item, index) in list"
        :data="item"
        :index="index"
        :key="`item_${index}`"
      >
      </budget-result-item>
    </div>
  </div>
</template>

<script>
import loadingMixin from '@/mixin/loading';
import BudgetResultItem from './components/budgetResultItem';
import ProductBudget from './services';

const productBudget = new ProductBudget();

export default {
  mixins: [loadingMixin],
  components: {
    BudgetResultItem,
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
  methods: {
    loadData() {
      const p = productBudget.wordsBudget(this.$route.params.id);
      this.checkLoadingByPromise(p).then((res) => {
        this.list = res.data.data;
      });
    },
    back() {
      this.$router.push({
        name: 'budgetAgain',
      });
    }
  },
};
</script>

<style lang="less">
</style>
