<template>
  <header class="admin-header">
    <el-button
      class="header-exit"
      type="primary"
      size="mini"
      @click="exitClick"
    >
      退出
    </el-button>
  </header>
</template>

<script>
import { mapMutations } from "vuex";
import { removeAllSessionStorage } from "@/config/storage";
import $api from "@/network/api";

export default {
  name: "adminHeader",
  methods: {
    ...mapMutations("common", [
      "setToken",
      "updateLoginType",
      "updateCurrentMenu",
    ]),
    exitClick() {
      this.$confirm("是否退出，请确认?", "提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exitAdmin();
        })
        .catch(() => {});
    },
    async exitAdmin() {
      try {
        await $api
          .logout((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        this.$message.error(e);
      }
      localStorage.removeItem("loginType");
      // removeAllSessionStorage();
      // // this.setToken("");
      // this.updateLoginType("");
      // this.updateCurrentMenu("");
      this.$message.success("退出成功");
      this.$router.replace("/");
    },
  },
};
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
