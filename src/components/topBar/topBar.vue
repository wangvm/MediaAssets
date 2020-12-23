<template>
    <div class="wrapper">
        <div class="top_bar">
            <div class="title" @click="titleClick">媒体资产管理系统</div>
            <div v-if="!this.$store.state.userName" class="loginInfo">
                <span class="login" @click="loginClick">登录/注册</span>
            </div>
            <div v-else class="userInfo">
                <a-dropdown>
                    <span class="ant-dropdown-link" @click="e => e.preventDefault()">
                        <a-icon class="userInfo_icon" type="usb"/>
                        <span class="user">欢迎，{{this.$store.state.userName}}</span>
                    </span>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <span @click="dropdownEvent('first')">1st menu item</span>
                        </a-menu-item>
                        <a-menu-item>
                            <span @click="dropdownEvent('second')">2nd menu item</span>
                        </a-menu-item>
                        <a-menu-item>
                            <span @click="dropdownEvent('third')">3rd menu item</span>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
                <a-icon class="userInfo_icon" type="login" @click="exitClick"/>
                <span class="exit" @click="exitClick">退出</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "topBar",
        methods: {
            titleClick() {
                //点击title路由跳转
                let routePath = this.$route.path
                if (routePath !== '/') {
                    this.$router.push('/')
                }
            },
            loginClick() {
                //登录/注册路由跳转
                let routePath = this.$route.path
                if (routePath !== '/login') {
                    this.$router.push('/login')
                }
            },
            dropdownEvent(status) {
                switch (status) {
                    case 'first':
                        console.log('first click')
                        break
                    case 'second':
                        console.log('second click')
                        break
                    case 'third':
                        console.log('third click')
                        break
                }
            },
            exitClick() {
                //退出
                this.$store.commit('exit')
                let routePath = this.$route.path
                if (routePath !== '/') {
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @topBarBackground: rgba(0, 0, 0, 0.8);
    @topBarHeight: 44px;
    @topBarColor: rgba(255, 255, 255, 1);
    .wrapper {
        height: @topBarHeight;

        .top_bar {
            background: @topBarBackground;
            height: @topBarHeight;
            line-height: @topBarHeight;
            color: @topBarColor;
            font-size: @font-size-common;
            font-weight: @font-weight-common;

            display: flex;
            justify-content: space-between;
            padding: 0 20px;

            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;

            .title {
                cursor: pointer;
                user-select: none;
            }

            .loginInfo {
                .login {
                    cursor: pointer;
                    user-select: none;
                }
            }

            .userInfo {
                cursor: pointer;
                user-select: none;

                .user {
                    margin-right: 10px;
                }
            }
        }
    }
</style>