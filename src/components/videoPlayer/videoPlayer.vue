<template>
    <!--    warning: v-cloak 此指令可以解决使用插值表达式页面闪烁问题-->
    <div class="videoPlayer">
        <div class="video_content">
            <!--http://10.1.71.155/static/video/test.mp4-->
            <!--@/assets/video/test.mp4-->
            <video class="player" ref="player" src="http://10.1.71.155/static/video/test.mp4" width="100%" height="100%"
                   preload="auto" @canplaythrough="videoCanplaythrough" @playing="videoPlaying" @pause="videoPause"
                   @ended="videoEnd">
            </video>
        </div>
        <div v-if="ifLoad" class="video_btn">
            <a-icon v-show="!ifPlay" class="playerBtn" title="播放" type="play-circle" @click="playerEvent('play')"/>
            <a-icon v-show="ifPlay" class="playerBtn" title="暂停" type="pause-circle" @click="playerEvent('pause')"/>
            <a-icon class="playerBtn" title="停止" type="undo" @click="playerEvent('stop')"/>
            <span class="time" ref="time">00:00:00:00</span>
            <button title="下一帧" @click="btnClick">test next frame</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "videoPlayer",
        data() {
            return {
                player: null,
                ifLoad: false,
                ifPlay: false,
                timer: null,
                frameRate: 25
            }
        },
        mounted() {
            this.player = this.$refs.player
        },
        methods: {
            //warning 设置定时器让播放器静音播放1s解决刷新进页面第一次播放前1s卡顿的问题
            videoCanplaythrough() {
                //视频加载完成
                if (!this.ifLoad) {
                    this.$refs.player.muted = true
                    this.$refs.player.play()
                    setTimeout(() => {
                        this.$refs.player.currentTime = 0
                        this.$refs.player.pause()
                        this.$refs.player.muted = false
                        this.ifLoad = true
                    }, 1000)
                }
            },
            videoPlaying() {
                //判断播放器正在播放
                if (this.ifLoad) {
                    this.timer = setInterval(() => {
                        this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                    }, this.frameRate)
                }
            },
            videoPause() {
                //播放器暂停
                clearInterval(this.timer)
                this.timer = null
            },
            videoEnd() {
                //视频播放完成
                console.log('end')
                this.ifPlay = false
                this.player.currentTime = 0
                this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
            },
            playerEvent(status) {
                //播放器 播放，暂停，停止
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
                        this.ifPlay = false
                        this.player.pause()
                        this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                        break
                }
            },
            btnClick() {
                this.$refs.player.currentTime += 1 / 25
                this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
            }
        }
    }

    //时分秒帧转换
    function timeFormat(time, frameRate) {
        let timeStr = ''
        let stringFormat = (i) => {
            //if i<10 return '0'+i else return i
            return i < 10 ? `0${i}` : `${i}`
        }
        let stringFrame = (i) => {
            let res = parseInt(i * frameRate)
            return res < 10 ? `0${res}` : `${res}`
        }
        let minuteTime = 0
        let secondTime = 0
        let hourTime = 0
        let setTime = parseInt(time)
        let setFrame = time - parseInt(time)
        if (setTime < 60) {
            timeStr = `00:00:${stringFormat(setTime)}:${stringFrame(setFrame)}`
        } else if (setTime >= 60 && setTime < 3600) {
            minuteTime = parseInt(setTime / 60)
            secondTime = parseInt(setTime % 60)
            timeStr = `00:${stringFormat(minuteTime)}:${stringFormat(secondTime)}:${stringFrame(setFrame)}`
        } else if (setTime >= 3600) {
            let _t = parseInt(setTime % 3600)
            hourTime = parseInt(setTime / 3600)
            minuteTime = parseInt(_t / 60)
            secondTime = parseInt(_t % 60)
            timeStr = `${stringFormat(hourTime)}:${stringFormat(minuteTime)}:${stringFormat(secondTime)}:${stringFrame(setFrame)}`
        }
        return timeStr
    }
</script>

<style scoped lang="less">
    .videoPlayer {
        @icon-color: rgba(0, 0, 0, 1);
        /*background: red;*/
        width: 100%;
        height: 100%;

        .playerBtn {
            color: @icon-color;
            font-size: 30px;
            padding: 5px;
        }

        .time {
            color: @icon-color;
            font-size: 25px;
            font-weight: lighter;
            line-height: 25px;
            padding: 5px;
        }
    }
</style>