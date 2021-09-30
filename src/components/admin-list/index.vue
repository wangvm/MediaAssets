<template>
  <el-card class="admin-project-list">
    <div class="header">
      <div class="header-title" @click="initProjectList">{{ title }}</div>
      <div class="header-search">
        <el-input
          class="search-input"
          size="medium"
          :placeholder="placeholder"
          v-model="searchValue"
          @keydown.enter.native="searchClick"
          clearable
        >
          <el-select
            class="search-select"
            v-model="select"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option
              v-show="placeholder == '请输入项目名称'"
              :label="item.label"
              :value="item.value"
              v-for="item in Project"
              :key="item.value"
            ></el-option>
            <el-option
              v-show="placeholder == '请输入用户名称'"
              :label="item.label"
              :value="item.value"
              v-for="item in User"
              :key="item.value"
            ></el-option>
            <el-option
              v-show="placeholder == '请输入编目名称'"
              :label="item.label"
              :value="item.value"
              v-for="item in Task"
              :key="item.value"
            ></el-option>
          </el-select>
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
import { mapActions } from "vuex";
export default {
  name: "AdminLIst",
  data() {
    return {
      currentPage: 1, //默认显示第几页
      page: "1", //目前所在页数
      searchValue: "", //搜索康输入的值
      pageSize: 5, //默认每页显示多少条
      pageSizes: [5, 10, 15, 20], //每页显示多少条有哪些选项
      select: this.placeholder === "请输入用户名称" ? 4 : 7,
      Project: [
        { value: 1, label: "项目名" },
        { value: 2, label: "项目类别" },
        { value: 3, label: "项目状态" },
        { value: 4, label: "起始时间" },
        { value: 5, label: "结束时间" },
        { value: 6, label: "组长账号" },
        { value: 7, label: "全部内容" },
      ],
      User: [
        { value: 1, label: "账号" },
        { value: 2, label: "姓名" },
        { value: 3, label: "权限" },
        { value: 4, label: "全部内容" },
      ],
      Task: [
        { value: 1, label: "任务名" },
        { value: 2, label: "所属项目名" },
        { value: 3, label: "任务状态" },
        { value: 4, label: "编目员账号" },
        { value: 5, label: "审核员账号" },
      ],
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
    ...mapActions("common", ["getUserList", "getProjectList"]),
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
      let content = {
        state: "",
        searchValue: "",
      };
      if (this.placeholder === "请输入用户名称") {
        if (this.select === 1) {
          content.state = "id";
          content.searchValue = this.searchValue;
          await this.getUserList(content);
        } else if (this.select === 2) {
          content.state = "name";
          content.searchValue = this.searchValue;
          await this.getUserList(content);
        } else if (this.select === 3) {
          content.state = "authority";
          content.searchValue = this.searchValue;
          await this.getUserList(content);
        } else if (this.select === 4) {
          content.state = "all";
          content.searchValue = this.searchValue;
          await this.getUserList(content);
        }
      } else if (this.placeholder === "请输入项目名称") {
        console.log("搜搜项目");
        if (this.select === 1) {
          content.state = "name";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 2) {
          content.state = "category";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 3) {
          content.state = "status";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 4) {
          content.state = "start";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 5) {
          content.state = "end";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 6) {
          content.state = "leader";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        } else if (this.select === 7) {
          content.state = "all";
          content.searchValue = this.searchValue;
          await this.getProjectList(content);
        }
      } else if (this.placeholder === "请输入编目名称") {
      }
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
      .search-input {
        width: 30em;
        .search-select {
          width: 9em;
        }
      }
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
