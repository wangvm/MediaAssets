<template>
  <AdminList
    :init-project-list="initTaskList"
    :list="taskList"
    @change-show-list="changeShowList"
    title="编目列表"
    placeholder="请输入编目名称"
  >
    <el-button type="primary" v-if="isLoginTypeTrue" @click="newBuilt"
      >新建任务</el-button
    >
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" fixed="left" />
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{
              dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="project" label="项目" />
        <el-table-column prop="status" label="进度">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.edit"
              class="project-status"
              :class="['project-status-' + scope.row.status]"
            >
              {{ taskStatus[scope.row.status].label }}
            </span>
            <div v-else>
              <span
                v-if="loginType !== 0 || loginType !== 1"
                class="project-status"
                :class="['project-status-' + scope.row.status]"
              >
                {{ taskStatus[scope.row.status].label }}
              </span>
              <el-select v-else v-model="scope.row.edit_status">
                <el-option
                  v-for="item in taskStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cataloger" label="编目员">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.cataloger }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_cataloger"
                placeholder="请输编目员账号"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="auditor" label="审核员">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.auditor }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_auditor"
                placeholder="请输审核员账号"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              v-if="isLoginTypeTrue"
              class="item"
              effect="light"
              content="编辑任务"
              placement="left"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="primary"
                icon="el-icon-edit"
                circle
                @click.native="editTask(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="isLoginTypeTrue"
              class="item"
              effect="light"
              content="删除任务"
              placement="bottom"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click.native.prevent="deleteTask(scope.row)"
                :disabled="taskStatus[scope.row.status].value === '-1'"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="loginType !== 4"
              class="item"
              effect="light"
              content="进入任务"
              placement="right"
            >
              <el-button
                v-if="!scope.row.edit"
                size="small"
                type="warning"
                icon="el-icon-s-promotion"
                circle
                @click.native="enterTask(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              v-if="isLoginTypeTrue"
              class="item"
              effect="light"
              content="保存修改"
              placement="left"
            >
              <el-button
                v-show="scope.row.edit"
                size="small"
                type="success"
                icon="el-icon-check"
                @click.native="saveEdit(scope.$index, scope.row)"
                circle
              ></el-button
            ></el-tooltip>
            <el-tooltip
              v-if="isLoginTypeTrue"
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
      <EditWindow
        v-show="this.createTask"
        @operation="operationClick"
        @change="createTask = false"
      />
      <EditEnter
        v-show="enterIn"
        :taskName="this.newTaskName"
        @enterIn="enterInClick"
      />
    </div>
  </AdminList>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { debounce } from "lodash";
import AdminList from "@/components/admin-list";
import $api from "@/network/api";
import { taskStatus, userType } from "@/constants/common";
import EditWindow from "@/components/edit-window";
import EditEnter from "@/components/edit-enter";

export default {
  name: "editTask",
  components: {
    AdminList,
    EditWindow,
    EditEnter,
  },
  data() {
    return {
      taskStatus,
      loading: false, //表格loading
      showList: [], //每页显示的数组
      createTask: false,
      enterIn: false,
      newTaskName: "",
    };
  },
  computed: {
    ...mapState("common", ["taskList", "loginType", "projectName"]),
    isLoginTypeTrue() {
      return [0, 1].includes(this.loginType);
    },
  },
  watch: {
    taskList: "updateTaskList",
  },
  async created() {
    await this.initTaskList(); //初始化数组信息
  },
  methods: {
    ...mapActions("common", ["getTaskList", "getCatalogList"]), //先用project的数据
    ...mapMutations("common", [
      "setVideoSrc",
      "setTaskName",
      "setTitleStats",
      "setTaskStatus",
    ]),
    //获取到信息
    initTaskList: debounce(async function () {
      // console.log(sessionStorage.getItem("uid"));
      // console.log(this.loginType);
      // console.log(userType[this.loginType].role);
      let content = {
        state: "project",
        project: this.projectName,
      };
      if (![0, 1].includes(this.loginType)) {
        content[userType[this.loginType].role] = sessionStorage.getItem("uid");
      }
      this.loading = true; //开始缓冲
      // console.log(content);
      await this.getTaskList(content);
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    }, 300),
    changeShowList(val) {
      this.showList = val;
    },
    updateTaskList() {
      this.loading = true; //开始缓冲
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    },
    // TODO 此处封装有问题，建议最后由后端实现分页
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.taskList.length <= val
        ? (this.showList = this.taskList)
        : (this.showList = this.taskList.slice(this.currentPage - 1, val));
    },
    //进入项目
    async enterTask(val) {
      this.setTaskStatus(val.status);
      try {
        let res = await $api.getCatalog("taskName", val.taskName);
        if (res.code === 200) {
          this.setVideoSrc(res.data.position);
          this.getCatalogList(res.data);
          if (this.loginType === 0 || this.loginType === 1) {
            this.newTaskName = val.taskName;
            this.enterIn = true;
          } else if (this.loginType === 2 || this.loginType === 4) {
            this.$router.push({
              path: "/edit/check",
              //跳转路由时传递编目名称和edit状态true(审核)
              query: {
                edit: false,
                //   state: "edit",
                editName: val.taskName,
              },
            });
            this.setTaskName(val.taskName);
            this.setTitleStats(true);
          } else if (this.loginType === 3) {
            this.$router.push({
              path: "/edit/exame",
              //跳转路由时传递编目名称和edit状态true(审核)
              query: {
                edit: true,
                //   state: "edit",
                editName: val.taskName,
              },
            });
            this.setTaskName(val.taskName);
            this.setTitleStats(true);
          }
          if (val.status === 1) {
            await $api.updateTask(val.taskName, 2);
            this.setTaskStatus(2);
          }
        }
      } catch (e) {
        this.$message.error(e);
      }
    },
    editTask(row) {
      row.edit = true;
    },
    async saveEdit(index, row) {
      if (!/(^[1-9]\d*$)/.test(row.edit_cataloger)) {
        this.$message("请输入正确的审核员账号");
      } else if (!/(^[1-9]\d*$)/.test(row.edit_cataloger)) {
        this.$message("请输入正确的编目员账号");
      } else {
        if (row.edit_status === "") {
          row.edit_status = row.status;
        }
        if (row.edit_cataloger === "") {
          row.edit_cataloger = row.cataloger;
        }
        if (row.edit_auditor === "") {
          row.edit_auditor = row.auditor;
        }
        if (row.edit_videoId === "") {
          row.edit_videoId = row.videoId;
        }
        if (row.edit_catalogId === "") {
          row.edit_catalogId = row.catalogId;
        }
        await $api.updateTask(
          row.taskName,
          row.edit_status,
          row.edit_cataloger,
          row.edit_auditor,
          row.edit_videoId,
          row.edit_catalogId
        );
        row.edit = false;
        this.initTaskList();
      }
    },
    cancleEdit(row) {
      row.edit = false;
    },
    //删除项目
    async deleteTask(currentProject) {
      this.loading = true;
      try {
        await $api.deleteTask(currentProject.taskName);
      } catch (e) {
        this.$message.error(e);
      }
      await this.initTaskList();
      this.loading = false;
    },
    // 是否显示添加任务组件
    operationClick(val) {
      this.createTask = val;
      if (!val) {
        this.initTaskList();
      }
    },
    enterInClick(val) {
      this.enterIn = val;
    },
    //新建编目任务
    newBuilt() {
      this.createTask = true;
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
.project-status-4 {
  background: #66b1ff;
}
</style>