<template>
    <!--    warning: v-cloak 此指令可以解决使用插值表达式页面闪烁问题-->
    <div class="videoPlayer" v-cloak>
        <div>
            <!--            <video class="player" ref="player" src="http://10.1.71.155/static/video/test.mp4"></video>-->
            <video class="player" ref="player" src="@/assets/video/test.mp4" width="100%" height="100%"
                   preload="auto" @canplay="videoDuration">
            </video>
        </div>
        <a-icon v-show="!ifPlay" class="playBtn" title="播放" type="play-circle" @click="playerEvent('play')"/>
        <a-icon v-show="ifPlay" class="pauseBtn" title="暂停" type="pause-circle" @click="playerEvent('pause')"/>
    </div>
</template>

<script>
    export default {
        name: "videoPlayer",
        data() {
            return {
                player: null,
                ifPlay: false
            }
        },
        props: {
            videoUrl: String
        },
        mounted() {
            this.player = this.$refs.player
        },
        methods: {
            videoDuration() {
                //视频加载完成
                console.log('load')
            },
            playerEvent(status) {
                //todo 播放，暂停频繁快速切换会报错
                switch (status) {
                    case 'play':
                        this.ifPlay = true
                        this.player.play()
                        break
                    case 'pause':
                        this.ifPlay = false
                        this.player.pause()
                        break
                    case 'stop':
                        this.player.currentTime = 0
                        this.player.pause()
                        break
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .videoPlayer {
        /*background: red;*/
        width: 100%;
        height: 100%;

        [v-cloak] {
            display: none;
        }

        .playBtn {
            color: white;
            font-size: 30px;
        }

        .pauseBtn {
            color: white;
            font-size: 30px;
        }
    }
</style>