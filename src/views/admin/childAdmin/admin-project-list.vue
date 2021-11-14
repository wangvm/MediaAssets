<template>
  <AdminList
    :init-project-list="initProjectList"
    :list="projectList"
    @change-show-list="changeShowList"
    title="项目列表"
    placeholder="请输入项目名称"
  >
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" fixed="left" width="100" />
        <el-table-column prop="projectName" label="项目名称" width="200">
        </el-table-column>
        <el-table-column prop="leaderId" label="组长账号" width="200">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">
              {{ scope.row.leaderId }}
            </span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_leaderId"
                placeholder="请输组长账号"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类别" width="200">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">
              {{ scope.row.category }}
            </span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_category"
                placeholder="请输类别"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="进度" width="200">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.edit"
              class="project-status"
              :class="['project-status-' + scope.row.status]"
            >
              {{ projectStatus[scope.row.status].label }}
            </span>
            <span v-else>
              <el-select v-model="scope.row.edit_status">
                <el-option
                  v-for="item in projectStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip
              v-show="loginType === 0 || loginType === 1"
              class="item"
              effect="light"
              content="编辑项目"
              placement="left"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="primary"
                icon="el-icon-edit"
                circle
                @click.native="editProject(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-show="loginType === 0 || loginType === 1"
              class="item"
              effect="light"
              content="删除项目"
              placement="bottom"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click.native.prevent="deleteProject(scope.row)"
                :disabled="projectStatus[scope.row.status].value === '-1'"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.edit"
              class="item"
              effect="light"
              content="进入项目"
              placement="right"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="warning"
                icon="el-icon-s-promotion"
                circle
                @click.native="enterProject(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-show="loginType === 0 || loginType === 1"
              class="item"
              effect="light"
              content="保存修改"
              placement="left"
            >
              <el-button
                v-if="scope.row.edit"
                size="small"
                type="success"
                icon="el-icon-check"
                @click.native="saveEdit(scope.$index, scope.row)"
                circle
              ></el-button
            ></el-tooltip>
            <el-tooltip
              v-show="loginType === 0 || loginType === 1"
              class="item"
              effect="light"
              content="取消"
              placement="right"
            >
              <el-button
                v-if="scope.row.edit"
                size="small"
                type="info"
                icon="el-icon-close"
                @click.native="cancleEdit(scope.row)"
                circle
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
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
  name: "adminProjectList",
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
    ...mapState("common", ["projectList", "loginType"]),
  },
  watch: {
    projectList: "updateProjectList",
  },
  async created() {
    await this.initProjectList(); //初始化数组信息
  },
  methods: {
    ...mapActions("common", ["getProjectList"]),
    ...mapMutations("common", ["setProjectName", "setTitleStats"]),
    //获取到信息
    initProjectList: debounce(async function () {
      let content = {
        state: "all",
        searchValue: "",
      };
      this.loading = true; //开始缓冲
      await this.getProjectList(content);
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    }, 300),
    changeShowList(val) {
      this.showList = val;
    },
    updateProjectList() {
      this.loading = true; //开始缓冲
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    },
    // TODO 此处封装有问题，建议最后由后端实现分页
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.projectList.length <= val
        ? (this.showList = this.projectList)
        : (this.showList = this.projectList.slice(this.currentPage - 1, val));
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
      this.initProjectList();
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
      await this.initProjectList();
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
