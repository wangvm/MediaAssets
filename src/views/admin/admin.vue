<template>
  <el-container class="admin">
    <el-aside class="admin-aside">
      <adminAside :menu-list="menuList"
                  :current-menu="currentMenu"
                  @updateCurrentMenu="updateCurrentMenu"
      />
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
    import adminAside from "../../components/admin-aside"
    import adminHeader from "../../components/admin-header"
    import {getCurrentMenu, getLoginType, setCurrentMenu} from "../../config/storage"
    import menuConfig from "../../config/menu-config"

    export default {
        name: "admin",
        components: {
            adminAside,
            adminHeader
        },
        data() {
            return {
                menuList: []
            }
        },
        computed: {
            currentMenu() {
                return this.$store.state.currentMenu
            }
        },
        created() {
            this.initLoginType()
            this.getMenuList()
        },
        methods: {
            initLoginType() {
                let loginType = getLoginType()
                if (!loginType) {
                    this.$message.error('登录超时，请重新登录')
                    this.$router.push('/')
                } else {
                    this.$store.commit('updateLoginType', getLoginType())
                }
            },
            getMenuList() {
                // todo 测试：模拟动态获取菜单
                let loginType = this.$store.state.loginType
                let getMenu = []
                if (loginType === 'admin') {
                    getMenu = [
                        {name: '主页', value: '00'},
                        {name: '项目管理', value: '10'},
                        {name: '项目列表', value: '11'},
                        {name: '创建项目', value: '12'},
                        {name: '用户管理', value: '20'},
                        {name: '用户列表', value: '21'},
                    ]
                } else {
                    getMenu = [
                        {name: '主页', value: '00'},
                        {name: '项目管理', value: '10'},
                        {name: '项目列表', value: '11'},
                    ]
                }
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
                if (!getCurrentMenu()) {
                    setCurrentMenu(currentMenu)
                }
                this.$store.commit('updateCurrentMenu', getCurrentMenu())
            },
            updateCurrentMenu(currentMenu) {
                setCurrentMenu(currentMenu)
                this.$store.commit('updateCurrentMenu', getCurrentMenu())
            }
        },
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