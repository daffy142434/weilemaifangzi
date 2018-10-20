<template lang="html">
  <el-dialog title="选择类目" :visible="visible" width="90%" ref="dialog">
    <div>
    <el-row>
      <el-col :span="24">
        <el-autocomplete
          style="width: 100%;"
          v-model="queryString"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
          placeholder="请输入关键字搜索产品类目或者点击下方下拉框直接选择产品类目"
          @select="handleSelect"
          icon="el-icon-search">
        </el-autocomplete>
      </el-col>
    </el-row>
    <el-row v-loading.body="loading">
      <el-col :span="24">
        <template v-for="(item, index) in categorys">
          <div class="category-container">
            <ul>
              <li v-for="(obj, key) in item" :key="key">
                <p :key="obj.id" type="text" :class="{active: obj.fixed=='1'}" @click="handleQueryList(item, obj)">{{obj.originCategoryName}}
                  <i v-if="obj.endNode=='0'" style="position:relative;top:3px;font-size:10px;padding-right:3px;" class="el-icon-d-arrow-right fr"></i>
                </p>
              </li>
            </ul>
          </div>
        </template>
      </el-col>
    </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="dialogSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ajax from 'lib/ajax';
export default {
  props: ['visible', 'data'],
  mounted() {
    this.$refs.dialog.$el.querySelector('.el-icon-close').addEventListener('click', () => {
      this.handleClose();
    });
  },
  data() {
    return {
      loading: false,
      queryString: '',
      categorys: [],
    }
  },
  created() {
    this.queryList({isTop: true});
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },

    handleQueryList(items, obj) {
      for(let item of items) {
        item.fixed = 0;
      }
      obj.fixed = 1;
      if(obj.endNode == '1') {
        return;
      }
      let temp = [];
      for(let i=0;i<obj.categoryLevel;i++) {
        temp.push(this.categorys[i]);
      }
      this.categorys = temp;
      temp = null;
      this.queryList({parentId: obj.id});
    },
    queryList({isTop=false, parentId}={}) {
      this.loading = true;
      ajax.get('/categories/list', {params: {isTop: isTop, parentId: parentId}})
      .then((response) => {
        if(response.data.code == 200) {
          let data = response.data.data || [];
          this.setCategorys(data);
          this.loading = false;
        }
      });
    },
    querySearch(queryString, callBack) {
      ajax.post('/categories/query', {categoryName: queryString})
      .then((response) => {
        if(response.data.code == 200) {
          let data = response.data.data || [];
          for(let item of data) {
            item.value = item.originCategoryTreePath;
          }
          callBack(data);
        }else {
          this.$message({
            showClose: true,
            message: '查询失败',
            type: 'error'
          });
        }
      })
      .catch((error) => function() {
        this.$message({
          showClose: true,
          message: '查询失败',
          type: 'error'
        });
      });
    },
    handleSelect(item) {
      this.queryCategoryTree(item.id);
    },
    querySearch2(queryString, callBack) {
      // for(let item of items) {
      //   item.value = item.originCategoryTreePath;
      // }
      // callBack(items);
    },
    queryCategoryTree(categoryId) {
      this.loading = true;
      ajax.get('/categories/tree', {params: {categoryId: categoryId}})
      .then((response) => {
        this.loading = false;
        if(response.data.code == 200) {
          let data = response.data.data || [];
          this.categorys = [];
          this.setCategorys(data);
        }else {
          this.$message({
            showClose: true,
            message: '查询失败',
            type: 'error'
          });
        }
      })
      .catch((error) => function() {
        this.loading = false;
        this.$message({
          showClose: true,
          message: '查询失败',
          type: 'error'
        });
      });
    },
    setCategorys(data) {
      this.categorys.push(data);
      for(let item of data) {
        let childCategories = item.childCategories;
        if(childCategories && childCategories.length > 0) {
          this.setCategorys(childCategories);
          break;
        }
      }
    },
    dialogSubmit() {
      let fixedItem = this.categorys[this.categorys.length-1].filter((item) => item.fixed == "1");

      if(fixedItem.length == 1) {
        this.data.categoryTreePath = fixedItem[0].originCategoryTreePath.split('>').join(' > ');
        this.data.categoryId = fixedItem[0].id;
        this.data.categoryCode = fixedItem[0].id;
        this.handleClose();
      }
    },
  }
}
</script>

<style lang="less">
  .category-container {
    display: inline-block;
    margin-right: 15px;
    margin-top: 15px;
    // padding: 10px 0;
    border: 1px solid #20A0FF;
    height: 415px;
    width: 245px;
    overflow: auto;
  }
  ul {
    padding: 0;
    margin-bottom: 0;
    list-style: none;
  }
  ul>li {
    display: block;
    padding: 0 10px ;
    position: relative;
  }

  ul>li>button {
    width:100%;
    text-align: left !important;
    color: #58B7FF !important;
    text-indent: 3px;
  }
  ul>li>p {
    cursor: pointer;
  }
  ul>li>p.active {
    background: #58B7FF;
    color: #fff !important;
  }

</style>
