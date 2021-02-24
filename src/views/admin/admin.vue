<template>
  <el-container class="admin">
    <el-aside class="admin-aside">Aside</el-aside>
    <el-container>
      <el-header class="admin-header">Header</el-header>
      <el-main class="admin-main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
    import {getIfLogin} from "../../config/storage"

    export default {
        name: "admin",
        methods: {
            initIfLogin() {
                let ifLogin = JSON.parse(getIfLogin())
                if (!ifLogin) {
                    this.$message.error('登录超时，请重新登录')
                    this.$router.push('/')
                } else {
                    this.$store.commit('changeIfLogin', JSON.parse(getIfLogin()))
                }
            }
        },
        created() {
            this.initIfLogin()
        }
    }
</script>

<style scoped lang="less">
  .admin {
    height: 100vh;

    .admin-aside {
      background: yellow;
    }

    .admin-header {
      background: greenyellow;
    }

    .admin-main {
      background: cornflowerblue;
    }
  }
</style>