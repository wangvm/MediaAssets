<template>
  <el-card class="edit">
    <div slot="header" class="clearfix">
      <el-page-header class="edit-header" @back="goBack">
        <template slot="content">
          <span v-if="this.$route.query.state">项目名称：{{ this.$route.query.projectName }}</span>
          <span v-else>编目名称：{{ this.$route.query.editName }}</span>
        </template>
      </el-page-header>
    </div>
    <router-view></router-view>
  </el-card>
</template>

<script>
export default {
  name: "edit",
  methods: {
    goBack() {
      // this.$router.push("/admin/projectList");
      // this.$router.go(-1);
      if(this.$route.name ==='task') {
        this.$router.push("/admin/projectList");
      }else if(this.$route.name === 'check') {
        this.$router.push("/edit/task");
      }
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
