<template>
    <div class="wrapper">
        <div class="top_bar">
            <div class="title">媒体资产管理系统</div>
            <div class="login" @click="loginClick">登录/注册</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "topBar",
        methods:{
            loginClick(){
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped lang="less">
    @topBarBackground: rgba(0, 0, 0, 1);
    @topBarHeight: 44px;
    @topbarColor: rgba(255, 255, 255, 1);
    .wrapper {
        height: @topBarHeight;

        .top_bar {
            background: @topBarBackground;
            height: @topBarHeight;
            line-height: @topBarHeight;
            color: @topbarColor;

            display: flex;
            justify-content: space-between;
            padding: 0 15px;

            position: fixed;
            top: 0;
            left: 0;
            right: 0;
        }
    }
</style>