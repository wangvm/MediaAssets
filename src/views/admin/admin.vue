<template>
  <el-container class="admin">
    <el-aside class="admin-aside">
      <adminAside
        :menu-list="menuList"
        :current-menu="currentMenu"
        @updateCurrentMenu="selectMenu"
      />
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <adminHeader />
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import adminAside from "@/components/admin-aside";
import adminHeader from "@/components/admin-header";
import {
  getCurrentMenu,
  getLoginType,
  getUserToken,
  setCurrentMenu,
} from "@/config/storage";
import menuConfig from "@/config/menu-config";

export default {
  name: "admin",
  components: {
    adminAside,
    adminHeader,
  },
  data() {
    return {
      menuList: [],
    };
  },
  computed: {
    ...mapState("common", ["currentMenu", "loginType"]),
  },
  created() {
    this.initUserToken();
    this.getMenuList();
  },
  methods: {
    ...mapMutations("common", [
      "setToken",
      "updateLoginType",
      "updateCurrentMenu",
    ]),
    initUserToken() {
      let userToken = getUserToken();
      let loginType = getLoginType();
      if (!userToken) {
        this.$message.error("登录超时，请重新登录");
        this.$router.push("/");
      } else {
        this.setToken(userToken);
        this.updateLoginType(loginType);
      }
    },
    getMenuList() {
      let loginType = this.loginType;
      let getMenu = [];
      //rol值为admin:0;user:1创建；user:2编目; user:3审核
      if (loginType === "0") {
        getMenu = [
          { name: "主页", value: "00" },
          { name: "项目管理", value: "10" },
          { name: "项目列表", value: "11" },
          { name: "创建项目", value: "12" },
          { name: "用户管理", value: "20" },
          { name: "用户列表", value: "21" },
          { name: "创建用户", value: "22" },
        ];
      } else {
        getMenu = [
          { name: "主页", value: "00" },
          { name: "项目管理", value: "10" },
          { name: "项目列表", value: "11" },
        ];
      }
      this.initMenu(getMenu);
    },
    initMenu(getMenu) {
      let menuList = [];
      getMenu.map((val) => {
        // TODO 目录优化
        if (val.value.slice(1, 2) === "0") {
          let children = [];
          getMenu.map((cval) => {
            if (
              cval.value.slice(0, 1) === val.value.slice(0, 1) &&
              cval.value !== val.value
            ) {
              children.push(menuConfig[cval.value]);
            }
          });
          menuList.push({ ...menuConfig[val.value], children });
        }
      });
      let currentMenu =
        menuList[0].children > 0
          ? menuList[0].children[0].index
          : menuList[0].index;
      this.menuList = menuList;
      if (!getCurrentMenu()) {
        setCurrentMenu(currentMenu);
      }
      this.updateCurrentMenu(getCurrentMenu());
    },
    selectMenu(currentMenu) {
      setCurrentMenu(currentMenu);
      this.updateCurrentMenu(getCurrentMenu());
    },
  },
};
</script>

<style scoped lang="less">
.admin {
  position: relative;
  height: 100vh;

  .admin-header {
    position: relative;
    z-index: 9;
    height: 100%;
    width: 100%;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    padding: 0;
    min-width: 1000px;
  }

  .admin-main {
    min-width: 1000px;
  }
}
</style>
}
