<template>
  <el-card class="edit">
    <div slot="header" class="clearfix">
      <el-page-header class="edit-header" @back="goBack()">
        <template slot="content">
          <span v-if="this.titleStatus === false"
            >项目名称：{{ projectName }}</span
          >
          <span v-else-if="this.titleStatus === true"
            >编目名称：{{ taskName }}</span
          >
        </template>
      </el-page-header>
    </div>
    <router-view></router-view>
  </el-card>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "edit",
  computed: {
    ...mapState("common", ["taskName", "projectName", "titleStatus"]),
  },
  watch: {
    taskName: "taskChange",
    projectName: "projectChange",
  },
  methods: {
    ...mapMutations("common", ["setTitleStats"]),
    taskChange() {
      console.log(this.taskName + "111");
    },
    projectChange() {
      console.log(this.projectName + "222");
    },
    goBack() {
      // this.$router.push("/admin/projectList");
      // this.$router.go(-1);
      if (this.$route.path === "/edit/task") {
        this.$router.push("/admin/projectList");
      } else if (
        this.$route.path === "/edit/check" ||
        this.$route.path === "/edit/exame"
      ) {
        this.$router.push("/edit/task");
      }
      this.setTitleStats(false);
    },
  },
  created() {
    if (this.$route.query.projectName === undefined) {
      this.$message.error("请求超时，请重新进入项目");
      this.$router.push("/edit/task");
    }
  },
};
</script>

<style scoped lang="less">
.edit {
  .clearfix {
    .edit-header {
      user-select: none;
      cursor: default;
    }
  }
}
</style>
