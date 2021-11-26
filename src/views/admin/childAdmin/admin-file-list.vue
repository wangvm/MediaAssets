<template>
  <AdminList
    :init-project-list="initFileList"
    :list="fileList"
    @change-show-list="changeShowList"
    title="文件列表"
    placeholder="请输入文件名称"
  >
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" fixed="left" />
        <el-table-column prop="fileName" label="文件名称"> </el-table-column>
      </el-table>
    </div>
  </AdminList>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { debounce } from "lodash-es";
import AdminList from "@/components/admin-list";
import $api from "@/network/api";
import { projectStatus } from "@/constants/common";

export default {
  name: "adminFileList",
  components: {
    AdminList,
  },
  data() {
    return {
      projectStatus,
      loading: false, //表格loading
      showList: [], //每页显示的数组
    };
  },
  created() {
    console.log(this.loginType, typeof this.loginType);
  },
  computed: {
    ...mapState("common", ["fileList", "loginType"]),
  },
  watch: {
    fileList: "updateFileList",
  },
  async created() {
    await this.initFileList(); //初始化数组信息
  },
  methods: {
    ...mapActions("common", ["getFileList"]),
    ...mapMutations("common", ["setProjectName", "setTitleStats"]),
    //获取到信息
    initFileList: debounce(async function () {
      let content = {
        state: "all",
        searchValue: "",
        pageSize: 5,
        pageIndex: 0,
      };
      this.loading = true; //开始缓冲
      await this.getFileList(content);
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    }, 300),
    changeShowList(val) {
      this.showList = val;
    },
    updateFileList() {
      this.loading = true; //开始缓冲
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    },
    // // TODO 此处封装有问题，建议最后由后端实现分页
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.fileList.length <= val
        ? (this.showList = this.fileList)
        : (this.showList = this.fileList.slice(this.currentPage - 1, val));
    },
    //进入项目
    async enterProject(val) {
      this.$router
        .push({
          path: "/edit/task",
          query: {
            projectName: val.projectName,
            //  state: "project"
          },
        })
        .catch((err) => {});
      let res = await $api.updateProject(val.projectName, 2);
      this.setProjectName(val.projectName);
      this.setTitleStats(false);
      // this.$router.replace({ name: "task" }).catch((err) => {
      //   console.log(err);
      // });
    },
    editProject(row) {
      row.edit = true;
    },
    async saveEdit(index, row) {
      if (row.edit_leaderId === "") {
        row.edit_leaderId = row.leaderId;
      }
      if (row.edit_category === "") {
        row.edit_category = row.category;
      }
      if (row.edit_status === "") {
        row.edit_status = row.status;
      }
      let resProject = await $api.updateProject(
        row.projectName,
        row.edit_leaderId,
        row.edit_category,
        row.edit_status
      );
      row.edit = false;
      this.initFileList();
    },
    cancleEdit(row) {
      row.edit = false;
    },
    //删除项目
    async deleteProject(currentProject) {
      this.loading = true;
      try {
        await $api.deleteProject(currentProject.projectName);
      } catch (e) {
        this.$message.error(e);
      }
      await this.initFileList();
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="less">
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
