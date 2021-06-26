<template>
  <el-card class="admin-project-list">
    <div class="header">
      <div class="header-title" @click="initProjectList">
        项目列表
      </div>
      <div class="header-search">
        <el-input
          size="medium"
          placeholder="请输入项目名称"
          v-model="searchValue"
          @keydown.enter.native="searchClick"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="mini" @click="searchClick">搜索</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_table">
        <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="projectName" label="项目名称" />
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="进度">
            <template slot-scope="scope">
              <span
                class="project-status"
                :class="['project-status-' + scope.row.status]"
              >
                {{ projectStatus[scope.row.status].label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="light"
                content="进入项目"
                placement="left"
              >
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="enterProject(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-if="loginType === '0'"
                class="item"
                effect="light"
                content="删除项目"
                placement="right"
              >
                <h1>{{ scope.row.status }}</h1>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click.native.prevent="deleteProject(scope.row)"
                  :disabled="projectStatus[scope.row.status].value === '-1'"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="projectList.length"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { debounce } from "lodash";
import $api from "@/network/api";
import { projectStatus } from "@/constants/common";

export default {
  name: "adminProjectList",
  data() {
    return {
      currentPage: 1, //默认显示第几页
      page: "1", //目前所在页数
      searchValue: "", //搜索康输入的值
      pageSize: 5, //默认每页显示多少条
      pageSizes: [5, 10, 15, 20], //每页显示多少条有哪些选项
      loading: false, //表格loading

      ProjectList: [], //从api.js中获取到的数组
      showList: [], //每页显示的数组
      //权限选项
      projectStatus,
    };
  },
  async created() {
    await this.initProjectList(); //初始化数组信息
  },
  computed: {
    ...mapState("common", ["projectList", "loginType"]),
  },
  methods: {
    ...mapActions("common", ["getProjectList"]),
    //获取到信息
    initProjectList: debounce(async function() {
      this.loading = true; //开始缓冲
      await this.getProjectList();
      this.handleSizeChange(this.pageSize);
      this.loading = false; //结束缓冲
    }, 300),
    //每页显示多少条
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.projectList.length <= val
        ? (this.showList = this.projectList)
        : (this.showList = this.projectList.slice(this.currentPage - 1, val));
    },
    //切换到第几页
    handleCurrentChange(val) {
      this.page = val;
      let pageList = [];
      let num = Math.ceil(this.projectList.length / this.pageSize); //向上取整（取请求数组长度/每页显示的条数）= 第几页
      if (val === num) {
        //若页数=最后一页
        if (this.projectList.length % this.pageSize !== 0) {
          //若最后一页不满，则显示剩余条数
          pageList = this.projectList.slice(
            (val - 1) * this.pageSize,
            this.projectList.length - (val - 1) * this.pageSize
          );
        }
      }
      pageList = this.projectList.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
      this.showList = pageList;
    },
    //进入项目
    enterProject(val) {
      this.$router.push({
        name: "task",
        params: { projectName: val.projectName },
      });
    },
    //删除项目
    async deleteProject(currentProject) {
      this.loading = true;
      try {
        await $api.deleteProject(currentProject.pid);
      } catch (e) {
        this.$message.error(e);
      }
      await this.initProjectList();
      this.loading = false;
    },
    //点击搜索
    async searchClick() {
      this.loading = true;
      // TODO
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
      this.loading = false;
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

.project-status {
  padding: 5px 10px;
  border-radius: 10px;
  color: #ffffff;
  font-weight: lighter;
  cursor: default;
  user-select: none;
}

.project-status--1 {
  background: #f56c6c;
}

.project-status-1 {
  background: #909399;
}

.project-status-2 {
  background: #e6a23c;
}

.project-status-3 {
  background: #67c23a;
}
</style>
