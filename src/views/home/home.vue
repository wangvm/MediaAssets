<template>
  <el-container class="home">
    <el-header class="home-header">媒资管理系统</el-header>
    <el-main class="home-main">
      <div class="home-container">
        <div class="login-type">
          <div class="type-login type-common" @click="changeLoginType('login')">
            <el-button type="primary" class="type-common">登录</el-button>
          </div>
          <div class="type-register type-common" @click="changeLoginType('register')">
            <el-button type="danger" class="type-common">注册</el-button>
          </div>
        </div>
        <div class="login-show">
          <div class="form" v-if="loginType">
            <div class="form-title">用户登录</div>
            <div class="form-input">
              <el-input placeholder="请输入账号" v-model="username">
                <template slot="prepend">账 号：</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input placeholder="请输入密码" v-model="password" show-password>
                <template slot="prepend">密 码：</template>
              </el-input>
            </div>
            <div class="form-button">
              <el-button class="button-login" type="primary" @click="loginAndRegisterClick">
                登录
              </el-button>
            </div>
          </div>
          <div class="form" v-else>
            <div class="form-title">用户注册</div>
            <div class="form-input">
              <el-input placeholder="请输入账号" v-model="username">
                <template slot="prepend">新 的 账 号：</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input placeholder="请输入密码" v-model="password" show-password>
                <template slot="prepend">新 的 密 码：</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input placeholder="请再次输入密码" v-model="password1" show-password>
                <template slot="prepend">确 认 密 码：</template>
              </el-input>
            </div>
            <div class="form-button">
              <el-button class="button-register" type="danger" @click="loginAndRegisterClick">注册</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <vue-particles
        class="home-bg"
        color="#dedede"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType="circle"
        :particleSize="4"
        linesColor="#dedede"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
    >
    </vue-particles>
  </el-container>
</template>

<script>
	import {setUserToken, getUserToken} from "../../config/storage"
	import $api from "../../network/api"

	export default {
		name: "home",
		data() {
			return {
				loginType: true,//登录类型 true=登录 false=注册
				username: '',//账号
				password: '',//密码
				password1: '',//注册验证密码
			}
		},
		methods: {
			changeLoginType(type) {
				type === 'login' ? this.loginType = true : this.loginType = false
				this.initFormData()
			},
			loginAndRegisterClick() {
				const {username, password} = this
				if (!username)
					return this.$message.error('账号不能为空')
				if (!password)
					return this.$message.error('密码不能为空')
				this.loginType ? this.login() : this.register()
			},
			async login() {
				const {username, password} = this
				let resLogin = await $api.login(username, password)
				resLogin.code === 200 ? this.$message.success(resLogin.message) : this.$message.error(resLogin.message)
				if (resLogin.code === 200) {
					let token = resLogin.data
					setUserToken(token)
					this.$store.commit('setToken', getUserToken())
					this.$router.push('/admin')
				}
				this.initFormData()
			},
			async register() {
				const {username, password, password1} = this
				if (password !== password1)
					return this.$message.error('两次密码不一致')
				let resRegister = await $api.register(username, password)
				this.$message.info(resRegister.message)
				resRegister.code === 200 && this.changeLoginType('login')
				this.initFormData()
			},
			initFormData() {
				this.username = this.password = this.password1 = ''
			}
		}
	}
</script>

<style scoped lang="less">
  .home {
    height: 100vh;
    min-width: 1000px;
    background-image: url("../../assets/images/login-bg.jpg");
    overflow: hidden;
    background-repeat: no-repeat;
    position: relative;

    .home-header {
      background: rgba(255, 255, 255, .8);
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      cursor: default;
      user-select: none;
      letter-spacing: 10px;

      position: relative;
      z-index: 2;
    }

    .home-main {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .home-container {
        width: 700px;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        display: flex;

        position: relative;
        z-index: 2;

        .login-type {
          width: 200px;
          height: 100%;
          display: flex;
          flex-direction: column;


          .type-login {
            background-color: rgb(64, 158, 255);
            border-radius: 10px 0 0 0;
          }

          .type-register {
            background-color: #F56C6C;
            border-radius: 0 0 0 10px;
          }

          .type-common {
            width: 100%;
            height: 100%;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            font-weight: lighter;
            cursor: pointer;
            user-select: none;
            color: #eeeeee;
          }
        }

        .login-show {
          width: 500px;
          height: 100%;
          cursor: default;
          user-select: none;

          .form {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .form-title {
              text-align: center;
              font-size: 18px;
              font-weight: lighter;
              padding: 10px;
              letter-spacing: 10px;
            }

            .form-input {
              margin: 10px;
            }

            .form-button {
              margin-right: 10px;
              display: flex;
              justify-content: flex-end;
            }
          }
        }
      }
    }

    .home-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
  }
</style>
