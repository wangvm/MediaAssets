<template>
  <AdminList
    :init-project-list="initTaskList"
    :list="taskList"
    @change-show-list="changeShowList"
    title="编目列表"
    placeholder="请输入编目名称"
  >
    <el-button type="primary" @click="newBuilt">新建任务</el-button>
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" fixed="left" width="100" />
        <el-table-column prop="taskName" label="任务名称" width="200" />
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column prop="project" label="项目" width="200" />
        <el-table-column prop="status" label="进度" width="200">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.edit"
              class="project-status"
              :class="['project-status-' + scope.row.status]"
            >
              {{ taskStatus[scope.row.status].label }}
            </span>
            <span v-else>
              <el-select v-model="scope.row.edit_status">
                <el-option
                  v-for="item in taskStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cataloger" label="编目员" width="200">
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
        <el-table-column prop="cataloger" label="审核员" width="200">
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
        <el-table-column prop="cataloger" label="视频ID" width="200">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.videoId }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_videoId"
                placeholder="请输视频ID"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cataloger" label="编目ID" width="200">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">{{ scope.row.catalogId }}</span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_catalogId"
                placeholder="编目ID"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip
              v-if="!scope.row.edit"
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
              v-if="!scope.row.edit"
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
              v-if="!scope.row.edit"
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
              v-if="scope.row.edit"
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
              v-if="scope.row.edit"
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
      <edit-window v-show="cerateTask" @operation="operationClick" />
      <edit-enter
        v-show="enterIn"
        :taskName="this.newTaskName"
        @enterIn="enterInClick"
      />
    </div>
  </AdminList>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { debounce } from "lodash";
import AdminList from "@/components/admin-list";
import $api from "@/network/api";
import { taskStatus } from "@/constants/common";
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
      cerateTask: false,
      enterIn: false,
      newTaskName: "",
    };
  },
  created() {
    this.initTaskList();
  },
  computed: {
    ...mapState("common", ["taskList", "loginType"]), //先用project的数据
    //...mapState("edit", ["editList", "loginType"]),
  },
  watch: {
    taskList: "updateTaskList",
  },
  async created() {
    await this.initTaskList(); //初始化数组信息
  },
  methods: {
    ...mapActions("common", ["getTaskList"]), //先用project的数据
    // ...mapActions("edit", ["getEditList"]),
    //获取到信息
    initTaskList: debounce(async function () {
      let content = {
        state: "all",
        searchValue: "",
      };
      this.loading = true; //开始缓冲
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
    enterTask(val) {
      this.newTaskName = val.taskName;
      this.enterIn = true;
    },
    editTask(row) {
      console.log(row);
      row.edit = true;
    },
    async saveEdit(index, row) {
      if (!/(^[1-9]\d*$)/.test(row.edit_auditor)) {
        this.$message("请输入正确的审核员账号");
      } else if (!/(^[1-9]\d*$)/.test(row.edit_auditor)) {
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
        console.log(row);
        let resTask = await $api.updateTask(
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
      this.cerateTask = val;
    },
    enterInClick(val) {
      this.enterIn = val;
    },
    //新建编目任务
    newBuilt() {
      this.cerateTask = true;
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