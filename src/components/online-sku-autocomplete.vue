<template lang="html">
  <el-autocomplete
      class="inline-input"
      v-model="value"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="true"
      @input="handleSelect"
      @blur="handleBlur"
    ></el-autocomplete>
</template>

<script>
import ajax from '@/lib/ajax';

export default {
  props: ['value','shopId'],
  data() {
    return {
      list: []
    }
  },
  mounted() {
    
  },
  methods: {
    querySearch(queryString, cb) {
      ajax.post("/online_product/sku_list",{shopId:this.shopId}).then(res=>{
        if(res.data.code==200){
          let list=res.data.data.map(item=>{
            return {value:item.sku,id:item.id}
          });
          this.list=list;
          let results = queryString ? list.filter(this.createFilter(queryString)) : list;
          cb(results);
        }
      })
      
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !=- 1);
      };
    },
    handleSelect(item) {
      this.$emit('input', item.value || this.value);
    },
    handleBlur(){
      if(this.list==[] ||this.list.indexOf(this.value)==-1){
        // this.value="";
        this.$emit('cleanVal');
      }
    }
  }
}
</script>

<style lang="css">
</style>
