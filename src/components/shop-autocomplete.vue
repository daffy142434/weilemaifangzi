<template lang="html">
  <el-autocomplete
      class="inline-input"
      v-model="value"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="true"
      @select="handleSelect"
      @blur="handleBlur"
      :disabled="disabled"
    ></el-autocomplete>
</template>

<script>
import Shop from '@/pages/shops/services';

const shop = new Shop();
let p = shop.getAllShops();
let start = Date.now();

export default {
  data() {
    return {
      list: [],
      value:""
    }
  },
  props: ['disabled'],
  computed:{
    
  },
  mounted() {
    if (Date.now() - start > 3000) {
      p = shop.getAllShops();
      start = Date.now();
    }
    p.then((res) => {
      this.list = res.data.data.map(item=>{
        return {value:item.shopName,id:item.id};
      });
    });
  },
  methods: {
    shopValue(){
      if(!this.value) return "";
      for(let i=0;i<this.list.length;i++){
        if(this.list[i].id==this.value){
          return this.list[i].value;
        }
      } 
    },
    querySearch(queryString, cb) {
      var list = this.list;
      var results = queryString ? list.filter(this.createFilter(queryString)) : list;
      cb(results);
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !==-1);
      };
    },
    handleSelect(item) {
      this.$emit('getShopId', item.id);
    },
    handleBlur(){
      if(this.list.indexOf(this.value)==-1){
        this.value="";
      }
    }
  }
}
</script>

<style lang="css">
</style>
