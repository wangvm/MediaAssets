<template>
    <div class="videoPlayer">
        <div>
            <video class="player" ref="player" src="http://10.1.71.155/static/video/test.mp4"></video>
        </div>
        <button @click="playClick">play</button>
        <button @click="pauseClick">pause</button>
        <button @click="stopClick">stop</button>
    </div>
</template>

<script>
    export default {
        name: "videoPlayer",
        methods: {
            playClick() {
                let player = this.$refs.player
                player.play()
            },
            pauseClick() {
                let player = this.$refs.player
                player.pause()
            },
            stopClick() {
                let player = this.$refs.player
                player.currentTime = 0
            }
        }
    }
</script>

<style scoped lang="less">
</style>