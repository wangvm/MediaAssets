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
            <span class="time" title="时:分:秒:帧" ref="time">00:00:00:00</span>
            <a-icon class="playerBtn" title="上一帧" type="step-backward" @click="playerEvent('back')"/>
            <a-icon class="playerBtn" title="下一帧" type="step-forward" @click="playerEvent('forward')"/>
            <a-icon class="playerBtn" title="入点" type="login" @click="logEvent('login')"/>
            <a-icon class="playerBtn" title="出点" type="logout" @click="logEvent('logout')"/>
            <a-icon class="playerBtn" title="清除入点和出点" type="close" @click="logEvent('logRemove')"/>
            <div class="progress">
                <!--                <div class="progress_content">1</div>-->
                <progress ref="progress" class="progress_content" value="0" :max="this.$refs.player.duration"
                          @mousedown="progressMouseDown" @mousemove="progressMouseMove"
                          @mouseup="progressMouseUp" @click="progressClick"></progress>
                <span class="login" ref="login"></span>
                <span class="logout" ref="logout"></span>
            </div>
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
                frameRate: 25,
                ifMouseDown: false
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
                        this.$refs.progress.value = this.$refs.player.currentTime
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
                this.ifPlay = false
                this.player.currentTime = 0
                this.$refs.progress.value = this.$refs.player.currentTime
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
                        this.$refs.progress.value = this.$refs.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                        break
                    case 'back':
                        this.$refs.player.currentTime -= 1 / 25
                        this.$refs.progress.value = this.$refs.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                        break
                    case 'forward':
                        this.$refs.player.currentTime += 1 / 25
                        this.$refs.progress.value = this.$refs.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                        break
                }
            },
            logEvent(status) {
                let logIndex = this.$refs.player.currentTime / this.$refs.player.duration * 100
                switch (status) {
                    case 'login':
                        ifLoginSmall(this.$refs.login, this.$refs.logout, true, logIndex)
                        break
                    case 'logout':
                        ifLoginSmall(this.$refs.login, this.$refs.logout, false, logIndex)
                        break
                    case 'logRemove':
                        this.$refs.login.style.left = 0
                        this.$refs.logout.style.left = 0
                        break
                }

                function ifLoginSmall(login, logout, ifLogin, value) {
                    let leftLog = isNaN(parseFloat(login.style.left)) ? 0 : parseFloat(login.style.left)
                    let rightLog = isNaN(parseFloat(logout.style.left)) ? 0 : parseFloat(logout.style.left)
                    if (ifLogin) {
                        if (value <= rightLog) {
                            login.style.left = value + '%'
                        } else {
                            login.style.left = rightLog + '%'
                            logout.style.left = value + '%'
                        }
                    } else {
                        if (value > leftLog) {
                            logout.style.left = value + '%'
                        } else {
                            login.style.left = value + '%'
                            logout.style.left = leftLog + '%'
                        }
                    }
                }
            },
            progressClick(e) {
                let currentTime = this.$refs.player.duration * e.offsetX / this.$refs.progress.offsetWidth
                this.$refs.player.currentTime = currentTime
                this.$refs.progress.value = this.$refs.player.currentTime
                this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
            },
            progressMouseDown() {
                this.ifMouseDown = true
            },
            progressMouseMove(e) {
                if (this.ifMouseDown) {
                    let currentTime = this.$refs.player.duration * e.offsetX / this.$refs.progress.offsetWidth
                    this.$refs.player.currentTime = currentTime
                    this.$refs.progress.value = this.$refs.player.currentTime
                    this.$refs.time.innerText = timeFormat(this.$refs.player.currentTime, this.frameRate)
                }
            },
            progressMouseUp() {
                this.ifMouseDown = false
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
            let _time = parseInt(setTime % 3600)
            hourTime = parseInt(setTime / 3600)
            minuteTime = parseInt(_time / 60)
            secondTime = parseInt(_time % 60)
            timeStr = `${stringFormat(hourTime)}:${stringFormat(minuteTime)}:${stringFormat(secondTime)}:${stringFrame(setFrame)}`
        }
        return timeStr
    }
</script>

<style scoped lang="less">
    .videoPlayer {
        @icon-color: rgba(0, 0, 0, 1);
        width: 100%;
        height: 100%;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        padding: 10px;

        .video_btn {
            .playerBtn {
                color: @icon-color;
                font-size: 30px;
                padding: 8px;
            }

            .time {
                color: @icon-color;
                font-size: 25px;
                font-weight: lighter;
                line-height: 25px;
                padding: 5px;
                cursor: default;
                user-select: none;
            }

            .progress {
                position: relative;

                progress {
                    width: 100%;
                    height: 15px;
                    background-color: #fff;
                }

                /* 表示总长度背景色 */

                progress::-webkit-progress-bar {
                    background-color: #eee;
                }

                /* 表示已完成进度背景色 */

                progress::-webkit-progress-value {
                    background: lightsalmon;
                }

                .login {
                    height: 16px;
                    width: 2px;
                    background: red;
                    position: absolute;
                    left: 0;
                }

                .login::after {
                    content: '入点';
                    width: 30px;
                    text-align: center;
                    font-size: 1px;
                    position: absolute;
                    top: -15px;
                    left: -14px;
                }

                .logout {
                    height: 16px;
                    width: 2px;
                    background: blue;
                    position: absolute;
                    left: 0;
                }

                .logout::after {
                    content: '出点';
                    width: 30px;
                    text-align: center;
                    font-size: 1px;
                    position: absolute;
                    top: 15px;
                    left: -14px;
                }
            }
        }
    }
</style>