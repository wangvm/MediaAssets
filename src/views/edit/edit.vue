<template>
  <el-card class="edit">
    <div slot="header" class="clearfix">
      <el-page-header class="edit-header" @back="goBack">
        <template slot="content">
          <span>项目名称：{{this.$route.params.projectName}}</span>
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
                this.$router.push('/admin/projectList')
            }
        },
        created() {
            if (this.$route.params.projectName === undefined) {
                this.$message.error('请求超时，请重新进入项目')
                this.$router.push('/admin/projectList')
            }
        }
    }
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