<template>
    <!--    warning: v-cloak 此指令可以解决使用插值表达式页面闪烁问题-->
    <div class="videoPlayer" v-cloak v-show="ifLoad">
        <div class="video_content">
            <!--http://10.1.71.155/static/video/test.mp4-->
            <!--@/assets/video/test.mp4-->
            <video class="player" ref="player" :src="videoInfo.url" width="100%" height="100%" preload="auto"
                   @canplaythrough="videoEvent('canplaythrough')"
                   @playing="videoEvent('playing')"
                   @pause="videoEvent('pause')"
                   @ended="videoEvent('end')">
            </video>
            <video v-show="false" ref="playerPreview" src="@/assets/video/test.mp4"></video>
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
            <a-icon class="playerBtn" title="跳转至入点" type="vertical-align-bottom" @click="logEvent('toLogin')"/>
            <a-icon class="playerBtn" title="跳转至出点" type="vertical-align-top" @click="logEvent('toLogout')"/>
            <button @click="btnClick">test</button>
            <div class="progress">
                <progress ref="progress" class="progress_content" value="0" :max="this.$refs.player.duration"
                          @mousedown="progressMouseDown"
                          @mousemove="progressMouseMove"
                          @mouseup="progressMouseUp"
                          @click="progressClick"
                          @mouseenter="progressMouseEnter"
                          @mouseleave="progressMouseLeave">
                </progress>
                <span class="login" ref="login"></span>
                <span class="logout" ref="logout"></span>
                <img class="video_preview" ref="preview" src=""/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "videoPlayer",
        data() {
            return {
                player: null,//视频播放器
                playerPreview: null,//视频进度条预览
                ifLoad: false,//视频是否加载完成
                ifPlay: false,//播放暂停切换
                timer: null,
                frameRate: 25,
                ifMouseDown: false,
                ifPreview: false
            }
        },
        props: {
            videoInfo: Object
        },
        mounted() {
            this.player = this.$refs.player
            this.playerPreview = this.$refs.playerPreview
        },
        methods: {
            //warning 设置定时器让播放器静音播放1s解决刷新进页面第一次播放前1s卡顿的问题
            videoEvent(status) {
                switch (status) {
                    case 'canplaythrough':
                        //视频加载完成
                        if (!this.ifLoad) {
                            this.player.muted = true
                            this.player.play()
                            setTimeout(() => {
                                this.player.currentTime = 0
                                this.player.pause()
                                this.player.muted = false
                                this.ifLoad = true
                            }, 1000)
                        }
                        break
                    case 'playing':
                        //判断播放器正在播放
                        if (this.ifLoad) {
                            this.timer = setInterval(() => {
                                this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                                this.$refs.progress.value = this.player.currentTime
                            }, this.frameRate)
                        }
                        break
                    case 'pause':
                        //播放器暂停
                        clearInterval(this.timer)
                        this.timer = null
                        break
                    case 'end':
                        //视频播放完成
                        this.ifPlay = false
                        this.player.currentTime = 0
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        break
                }
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
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        break
                    case 'back':
                        this.player.currentTime -= 1 / 25
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        break
                    case 'forward':
                        this.player.currentTime += 1 / 25
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        break
                }
            },
            logEvent(status) {
                let logIndex = this.player.currentTime / this.player.duration * 100
                switch (status) {
                    case 'login':
                        ifLoginSmall(this.$refs.login, this.$refs.logout, true, logIndex)
                        break
                    case 'logout':
                        ifLoginSmall(this.$refs.login, this.$refs.logout, false, logIndex)
                        break
                    case 'logRemove':
                        this.$refs.login.style.left = 0
                        this.$refs.logout.style.right = 0
                        break
                    case 'toLogin':
                        let left = isNaN(parseFloat(this.$refs.login.style.left)) ? 0 : parseFloat(this.$refs.login.style.left)
                        this.player.currentTime = this.player.duration * left / 100
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        this.player.pause()
                        this.ifPlay = false
                        break
                    case 'toLogout':
                        let right = isNaN(parseFloat(this.$refs.logout.style.right)) ? 0 : parseFloat(this.$refs.logout.style.right)
                        this.player.currentTime = this.player.duration - this.player.duration * right / 100
                        this.$refs.progress.value = this.player.currentTime
                        this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                        this.player.pause()
                        this.ifPlay = false
                        break
                }

                function ifLoginSmall(login, logout, ifLogin, value) {
                    let leftLog = isNaN(parseFloat(login.style.left)) ? 0 : parseFloat(login.style.left)
                    let rightLog = isNaN(parseFloat(logout.style.right)) ? 0 : parseFloat(logout.style.right)
                    if (ifLogin) {
                        if (value <= 100 - rightLog) {
                            login.style.left = value + '%'
                        } else {
                            login.style.left = value + '%'
                            logout.style.right = 100 - value + '%'
                        }
                    } else {
                        if (value > leftLog) {
                            logout.style.right = 100 - value + '%'
                        } else {
                            login.style.left = value + '%'
                            logout.style.right = 100 - value + '%'
                        }
                    }
                }
            },
            progressClick() {
                this.player.currentTime = this.player.duration * event.offsetX / this.$refs.progress.offsetWidth
                this.$refs.progress.value = this.player.currentTime
                this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
            },
            progressMouseEnter() {
                this.ifPreview = true
                this.$refs.preview.style.display = 'block'
            },
            progressMouseDown() {
                this.ifMouseDown = true
            },
            progressMouseMove() {
                if (this.ifMouseDown) {
                    this.player.currentTime = this.player.duration * event.offsetX / this.$refs.progress.offsetWidth
                    this.$refs.progress.value = this.player.currentTime
                    this.$refs.time.innerText = timeFormat(this.player.currentTime, this.frameRate)
                }
                if (this.ifPreview) {
                    let canvas = document.createElement("canvas") // 创建一个画布
                    canvas.width = 100
                    canvas.height = 50
                    this.playerPreview.currentTime = this.player.duration * event.offsetX / this.$refs.progress.offsetWidth
                    canvas.getContext('2d').drawImage(this.playerPreview, 0, 0, canvas.width, canvas.height) // getContext:设置画布环境；drawImage:画画
                    this.$refs.preview.src = canvas.toDataURL("image/png") // 获取图片的url
                    this.$refs.preview.style.left = event.offsetX - 50 + 'px'
                }
            },
            progressMouseUp() {
                this.ifMouseDown = false
            },
            progressMouseLeave() {
                this.ifPreview = false
                this.$refs.preview.style.display = 'none'
            },
            btnClick() {
                //入点，出点时间
                let left = isNaN(parseFloat(this.$refs.login.style.left)) ? 0 : parseFloat(this.$refs.login.style.left)
                let right = isNaN(parseFloat(this.$refs.logout.style.right)) ? 0 : parseFloat(this.$refs.logout.style.right)
                console.log('入点时间', this.player.duration * left / 100)
                console.log(timeFormat(this.player.duration * left / 100, this.frameRate))
                console.log('出点时间', this.player.duration - this.player.duration * right / 100)
                console.log(timeFormat(this.player.duration - this.player.duration * right / 100, this.frameRate))
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
        min-width: 500px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        padding: 10px;

        [v-cloak] {
            display: none;
        }

        .video_btn {
            .playerBtn {
                color: @icon-color;
                font-size: 20px;
                line-height: 20px;
                padding: 8px;
            }

            .time {
                color: @icon-color;
                font-size: 20px;
                font-weight: lighter;
                line-height: 20px;
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
                    background: black;
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
                    background: black;
                    position: absolute;
                    right: 0;
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

                .video_preview {
                    width: 100px;
                    height: 50px;
                    position: absolute;
                    top: -50px;
                    left: -50px;
                    display: none;
                }
            }
        }
    }
</style>