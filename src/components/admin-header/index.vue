<template>
  <header class="admin-header">
    <span class="header-title">欢迎使用，{{getLoginType}}</span>
    <el-button class="header-exit" type="primary" size="mini" @click="exitClick">退出</el-button>
  </header>
</template>

<script>
    import {removeLoginType, removeCurrentMenu} from "../../config/storage"

    export default {
        name: "adminHeader",
        computed: {
            getLoginType() {
                return this.$store.state.loginType
            }
        },
        methods: {
            exitClick() {
                this.$confirm('是否退出，请确认?', '提示', {
                    confirmButtonText: '退出',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.exitAdmin()
                }).catch(() => {
                })
            },
            exitAdmin() {
                removeLoginType()
                removeCurrentMenu()
                this.$router.replace('/')
                this.$message.success('退出成功')
            },
        }
    }
</script>

<style scoped lang="less">
  .admin-header {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .header-title {
      font-size: 14px;
      font-weight: lighter;
      margin-right: 20px;
      user-select: none;
      cursor: default;
    }

    .header-exit {
      margin-right: 20px;
    }
  }
</style>