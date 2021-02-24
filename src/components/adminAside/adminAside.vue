<template>
  <el-menu
      :default-active="currentMenu"
      class="el-menu-vertical-demo"
      @select="menuSelect">
    <div class="menu-title">
      <img class="menu-logo" src="../../assets/images/logo.png" alt="">
      <span>媒资管理系统</span>
    </div>
    <template v-for="item in menuList">
      <el-submenu v-if="item.children.length>0" :index="item.index">
        <template slot="title">
          <i :class="item.icon"></i>
          {{item.name}}
        </template>
        <template v-for="citem in item.children">
          <el-menu-item :index="citem.index">{{citem.name}}</el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item v-else :index="item.index">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
    import menuConfig from "../../config/menuConfig"
    import {setCurrentMenu, getCurrentMenu} from "../../config/storage"

    export default {
        name: "adminAside",
        data() {
            return {
                menuList: [],//菜单列表
            }
        },
        computed: {
            currentMenu() {
                return this.$store.state.currentMenu
            }
        },
        methods: {
            getMenuList() {
                // todo 测试：模拟动态获取菜单
                let getMenu = [
                    {name: '主页', value: '00'},
                    {name: '项目管理', value: '10'},
                    {name: '项目列表', value: '11'},
                    {name: '创建项目', value: '12'},
                    {name: '用户管理', value: '20'},
                    {name: '用户列表', value: '21'},
                    {name: '任务管理', value: '30'},
                    {name: '任务列表', value: '31'},
                    {name: '创建任务', value: '32'},
                    {name: '内容审核', value: '40'},
                    {name: '审核列表', value: '41'},
                    {name: '视频编目', value: '50'},
                    {name: '编目列表', value: '51'}
                ]
                this.initMenu(getMenu)
            },
            initMenu(getMenu) {
                let menuList = []
                getMenu.map(val => {
                    if (val.value.slice(1, 2) === '0') {
                        let children = []
                        getMenu.map(cval => {
                            if (cval.value.slice(0, 1) === val.value.slice(0, 1) && cval.value !== val.value) {
                                children.push(menuConfig[cval.value])
                            }
                        })
                        menuList.push({...menuConfig[val.value], children})
                    }
                })
                let currentMenu = menuList[0].children > 0 ? menuList[0].children[0].index : menuList[0].index
                this.menuList = menuList
                if (!getCurrentMenu())
                    setCurrentMenu(currentMenu)
                this.$store.commit('updateCurrentMenu', getCurrentMenu())

            },
            menuSelect(key, keyPath) {
                setCurrentMenu(key)
                this.$store.commit('updateCurrentMenu', getCurrentMenu())
            },
        },
        created() {
            this.getMenuList()
        }
    }
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