<template>
  <el-menu
    :default-active="currentMenu"
    class="el-menu-vertical-demo"
    @select="getCurrentMenu"
  >
    <header class="menu-title">
      <img class="menu-logo" src="@/assets/images/logo.png" alt="" />
      <span>媒资管理系统</span>
    </header>
    <template v-for="(item, index) in menuList">
      <div :key="index" v-if="item.children.length > 0">
        <el-submenu :index="item.index">
          <template slot="title">
            <i :class="item.icon"></i>
            {{ item.name }}
          </template>
          <template v-for="(citem, cindex) in item.children">
            <router-link :key="cindex" :to="citem.index">
              <el-menu-item :index="citem.index">{{ citem.name }}</el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </div>
      <div :key="index" v-else>
        <router-link :to="item.index">
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </router-link>
      </div>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: "adminAside",
  props: {
    // 菜单列表
    menuList: {
      type: Array,
      required: true,
    },
    // 当前菜单选中值
    currentMenu: {
      type: String,
      required: true,
    },
  },
  methods: {
    getCurrentMenu(key, keyPath) {
      this.$emit("updateCurrentMenu", key);
    },
  },
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo {
  height: 100%;

  .menu-title {
    width: 100%;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    user-select: none;
    cursor: default;

    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;

    .menu-logo {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
}
</style>
