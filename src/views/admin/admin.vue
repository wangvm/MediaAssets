<template>
  <el-container class="admin">
    <el-aside class="admin-aside">
      <adminAside/>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <adminHeader/>
      </el-header>
      <el-main class="admin-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import adminAside from "../../components/adminAside/adminAside"
    import adminHeader from "../../components/adminHeader/adminHeader"
    import {getLoginType} from "../../config/storage"

    export default {
        name: "admin",
        components: {
            adminAside,
            adminHeader
        },
        methods: {
            initIfLogin() {
                let loginType = getLoginType()
                if (!loginType) {
                    this.$message.error('登录超时，请重新登录')
                    this.$router.push('/')
                } else {
                    this.$store.commit('updateLoginType', getLoginType())
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
    }

    .admin-header {
      height: 100%;
      width: 100%;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      padding: 0;
    }

    .admin-main {
    }
  }
</style>