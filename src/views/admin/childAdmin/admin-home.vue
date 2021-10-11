<template>
  <AdminList
    :init-project-list="initFeedbackList"
    :list="feedbackList"
    @change-show-list="changeShowList"
    title="反馈列表"
    placeholder="请输入反馈状态"
  >
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" fixed="left" width="100" />
        <el-table-column prop="title" label="标题" width="200">
          <template slot-scope="scope">
            <span>
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="反馈内容" width="200">
          <template slot-scope="scope">
            <span>
              {{ scope.row.details }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            {{
              scope.row.createTime === null
                ? "未知"
                : dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="进度" width="200">
          <template slot-scope="scope">
            <span
              class="project-status"
              :class="['project-status-' + scope.row.status]"
            >
              {{ feedbackStatus[scope.row.status].label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          v-if="loginType === 0 || loginType === 1"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="light"
              content="完成反馈"
              placement="bottom"
            >
              <el-button
                size="small"
                type="primary"
                icon="el-icon-check"
                circle
                @click.native.prevent="CompleteClick(scope.row)"
                :disabled="
                  feedbackStatus[scope.row.status].value === 'completed'
                "
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </AdminList>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { debounce } from "lodash-es";
import AdminList from "@/components/admin-list";
import $api from "@/network/api";
import { feedbackStatus } from "@/constants/common";

export default {
  name: "adminHome",
  components: {
    AdminList,
  },
  data() {
    return {
      feedbackStatus,
      loading: false, //表格loading
      showList: [], //每页显示的数组
    };
  },
  computed: {
    ...mapState("common", ["feedbackList", "loginType"]),
  },
  watch: {
    feedbackList: "updateFeedbackList",
  },
  async created() {
    await this.initFeedbackList(); //初始化数组信息
  },
  methods: {
    ...mapActions("common", ["getFeedbackList"]),
    //获取到信息
    initFeedbackList: debounce(async function () {
      let content = {
        state: "all",
      };
      this.loading = true; //开始缓冲
      await this.getFeedbackList(content);
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    }, 300),
    changeShowList(val) {
      this.showList = val;
    },
    updateFeedbackList() {
      this.loading = true; //开始缓冲
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    },
    // TODO 此处封装有问题，建议最后由后端实现分页
    handleSizeChange(val) {
      this.pageSize = val; //此时需更新每页显示多少条
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.feedbackList.length <= val
        ? (this.showList = this.feedbackList)
        : (this.showList = this.feedbackList.slice(this.currentPage - 1, val));
    },
    //删除项目
    async CompleteClick(currentProject) {
      this.loading = true;
      try {
        await await $api.CompleteFeedback(currentProject.id);
      } catch (e) {
        this.$message.error(e);
      }
      await this.initFeedbackList();
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

.project-status-all {
  background: #909399;
}

.project-status-pending {
  background: #e6a23c;
}

.project-status-completed {
  background: #67c23a;
}
</style>
