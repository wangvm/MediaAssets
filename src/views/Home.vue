<template>
    <div class="home">
        <div class="home_video">
            <videoPlayer></videoPlayer>
        </div>
    </div>
</template>

<script>
    import videoPlayer from "../components/videoPlayer/videoPlayer"

    export default {
        name: 'Home',
        data() {
            return {}
        },
        components: {
            videoPlayer
        }
    }
</script>

<style scoped lang="less">
    .home {
        .home_video {
            margin: 0 auto;
            width: 600px;
        }
    }
</style>
