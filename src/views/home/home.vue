<template>
    <div class="home">
        <top-bar></top-bar>
        <!--div class='test'为测试代码，可删，无用-->
        <div class="test">
            home
        </div>
    </div>
</template>

<script>
    import topBar from "../../components/topBar/topBar"

    export default {
        name: "home",
        components: {
            topBar
        }
    }
</script>

<style scoped lang="less">
</style>