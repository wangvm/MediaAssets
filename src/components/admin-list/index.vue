<template>
  <el-card class="admin-project-list">
    <div class="header">
      <div class="header-title" @click="initProjectList">{{ title }}</div>
      <div class="header-search">
        <el-input
          size="medium"
          :placeholder="placeholder"
          v-model="searchValue"
          @keydown.enter.native="searchClick"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="mini" @click="searchClick">搜索</el-button>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.length"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "AdminLIst",
  data() {
    return {
      currentPage: 1, //默认显示第几页
      page: "1", //目前所在页数
      searchValue: "", //搜索康输入的值
      pageSize: 5, //默认每页显示多少条
      pageSizes: [5, 10, 15, 20], //每页显示多少条有哪些选项
    };
  },
  props: {
    title: {
      required: true,
      type: String,
    },
    placeholder: {
      required: true,
      type: String,
    },
    initProjectList: {
      required: true,
      type: Function,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    //每页显示多少条
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.list.length <= val
        ? this.$emit("change-show-list", this.list)
        : this.$emit(
            "change-show-list",
            this.list.slice(this.currentPage - 1, val)
          );
    },
    //切换到第几页
    handleCurrentChange(val) {
      this.page = val;
      let pageList = [];
      let num = Math.ceil(this.list.length / this.pageSize); //向上取整（取请求数组长度/每页显示的条数）= 第几页
      if (val === num) {
        //若页数=最后一页
        if (this.list.length % this.pageSize !== 0) {
          //若最后一页不满，则显示剩余条数
          pageList = this.list.slice(
            (val - 1) * this.pageSize,
            this.list.length - (val - 1) * this.pageSize
          );
        }
      }
      pageList = this.list.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
      this.$emit("change-show-list", pageList);
    },
    //点击搜索
    async searchClick() {
      // TODO 搜索部分要弄
      // let searchList = [];
      // let res = await $api.getProjectById(this.searchValue); //将通过用户行搜索到的对应的对象拿到
      // if (res.code === 200) {
      //   //判断返回是否成功：200->请求成功；3->用户不存在
      //   searchList.push(res.data); //先将对象放进数组中
      //   searchList.map((val, index) => {
      //     //在对数组里进行补充，这样就可以进行编辑
      //     val["index"] = index + 1;
      //     val["edit"] = false;
      //     val["edit_password"] = "";
      //     val["edit_role"] = "";
      //     search.push(val);
      //   });
      // } else {
      //   searchList = []; //若不成功则数组为空，用户可点击分页序号返回默认显示列表
      // }
      // this.showList = searchList; //这时显示搜索的数组
    },
  },
};
</script>

<style scoped lang="less">
.admin-project-list {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;

    .header-title {
      font-size: 17px;
      cursor: pointer;
      user-select: none;
    }

    .header-title:hover {
      color: #409eff;
    }

    .header-search {
      display: flex;
    }
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
