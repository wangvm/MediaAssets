<template>
    <div id="app">
        <top-bar></top-bar>
        <router-view/>
    </div>
</template>

<script>
    import topBar from "./components/topBar/topBar"

    export default {
        name: 'App',
        components: {
            topBar
        }
    }
</script>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
    }
</style>
