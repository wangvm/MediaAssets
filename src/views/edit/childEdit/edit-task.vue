<template>
  <AdminList
      :init-project-list="initProjectList"
      :list="projectList"
      @change-show-list="changeShowList"
      title="编目列表"
      placeholder="请输入编目名称"
  >
    <el-button type="primary" @click="newBuilt">新建编目</el-button>
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号"/>
        <el-table-column prop="projectName" label="项目名称"/>
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
  </AdminList>
</template>

<script>
  import {mapState, mapActions} from "vuex";
  import {debounce} from "lodash";
  import AdminList from "@/components/admin-list";
  import $api from "@/network/api";
  import {projectStatus} from "@/constants/common";

  export default {
    name: "editTask",
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
    computed: {
      ...mapState("common", ["projectList", "loginType"]),//先用project的数据
      //...mapState("edit", ["editList", "loginType"]),
    },
    async created() {
      await this.initProjectList(); //初始化数组信息
    },
    methods: {
      ...mapActions("common", ["getProjectList"]),//先用project的数据
      // ...mapActions("edit", ["getEditList"]),
      //获取到信息
      initProjectList: debounce(async function () {
        this.loading = true; //开始缓冲
        await this.getProjectList();
        this.handleSizeChange(5);
        this.loading = false; //结束缓冲
      }, 300),
      changeShowList(val) {
        this.showList = val;
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
      enterProject(val) {
        this.$router.push({
          name: "check",
          params: {projectName: val.projectName},
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
      //新建编目任务
      newBuilt() {
        this.$prompt('请输入编目名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,//正则表达式：不能为空+不能由空格等特殊字符构成的
          inputErrorMessage: '编目名称不能为空'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的编目名称是: ' + value,
          });
          this.$router.push('check');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消创建'
          });
        });
      }
    },
  }
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