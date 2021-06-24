<template>
  <el-container class="home">
    <el-header class="home-header">媒资管理系统</el-header>
    <el-main class="home-main">
      <div class="home-container">
        <div class="login-type">
          <div class="type-login type-common" @click="changeLoginType('login')">
            <el-button type="primary" class="type-common">登录</el-button>
          </div>
          <div
            class="type-register type-common"
            @click="changeLoginType('register')"
          >
            <el-button type="danger" class="type-common">注册</el-button>
          </div>
        </div>
        <div class="login-show">
          <div class="form">
            <div class="form-title">{{ loginTypeTitle }}</div>
            <div class="form-input">
              <el-input placeholder="请输入账号" v-model="username">
                <template slot="prepend">{{ loginTypeUsername }}</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input
                placeholder="请输入密码"
                v-model="password"
                show-password
              >
                <template slot="prepend">{{ loginTypePassword }}</template>
              </el-input>
            </div>
            <div class="form-input" v-if="!loginType">
              <el-input
                placeholder="请再次输入密码"
                v-model="password1"
                show-password
              >
                <template slot="prepend">确 认 密 码：</template>
              </el-input>
            </div>
            <div class="form-button">
              <el-button
                :class="loginTypeButtonClassName"
                type="primary"
                @click="loginAndRegisterClick"
              >
                {{ loginTypeButtonContent }}
              </el-button>
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
import { setUserToken, setLoginType } from "@/config/storage";
import $api from "@/network/api";
import { mapMutations } from "vuex";

export default {
  name: "home",
  data() {
    return {
      loginType: true, //登录类型 true=登录 false=注册
      username: "", //账号
      password: "", //密码
      password1: "", //注册验证密码
    };
  },
  computed: {
    loginTypeTitle() {
      return this.loginType ? "用户登录" : "用户注册";
    },
    loginTypeUsername() {
      return this.loginType ? "账 号：" : "新 的 账 号：";
    },
    loginTypePassword() {
      return this.loginType ? "密 码：" : "新 的 密 码：";
    },
    loginTypeButtonClassName() {
      return this.loginType ? "button-login" : "button-register";
    },
    loginTypeButtonContent() {
      return this.loginType ? "登录" : "注册";
    },
  },
  methods: {
    ...mapMutations("common", ["updateLoginType", "setToken"]),
    // 登录注册切换
    changeLoginType(type) {
      switch (type) {
        case "login":
          this.loginType = true;
          this.initFormData();
          break;
        case "register":
          this.loginType = false;
          this.initFormData();
          break;
      }
    },
    // 登录注册-前端验证
    loginAndRegisterClick() {
      const { username, password } = this;
      if (!username) return this.$message.error("账号不能为空");
      if (!password) return this.$message.error("密码不能为空");
      this.loginType ? this.login() : this.register();
    },
    // 登录
    async login() {
      try {
        const { username, password } = this;
        let resLogin = await $api.login(username, password);
        if (resLogin.code === 200) {
          let token = resLogin.data.token;
          // TODO 关于loginType的值 admin:0;user:1创建；user:2编目; user:3审核
          let loginType = 0;
          setUserToken(token);
          setLoginType(loginType);
          this.updateLoginType(loginType);
          this.setToken(token);
          this.$router.push("/admin");
        }
        this.initFormData();
      } catch (e) {
        this.$message.error(e);
      }
    },
    // 注册
    async register() {
      const { username, password, password1 } = this;
      if (password !== password1) return this.$message.error("两次密码不一致");
      try {
        let resRegister = await $api.register([{ username, password }]);
        resRegister.code === 200 && this.changeLoginType("login");
        this.initFormData();
      } catch (e) {
        this.$message.error(e);
      }
    },
    // 初始化input值
    initFormData() {
      this.username = "";
      this.password = "";
      this.password1 = "";
    },
  },
};
</script>

<style scoped lang="less">
.home {
  position: relative;
  height: 100vh;
  min-width: 1000px;
  background-image: url("~@/assets/images/login-bg.jpg");
  overflow: hidden;
  background-repeat: no-repeat;

  .home-header {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    cursor: default;
    background: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    font-weight: bold;
    user-select: none;
    letter-spacing: 10px;
  }

  .home-main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .home-container {
      position: relative;
      z-index: 2;
      display: flex;
      width: 700px;
      height: 400px;
      background-color: white;
      border-radius: 10px;

      .login-type {
        display: flex;
        flex-direction: column;
        width: 200px;
        height: 100%;

        .type-login {
          background-color: rgb(64, 158, 255);
          border-radius: 10px 0 0 0;
        }

        .type-register {
          background-color: #f56c6c;
          border-radius: 0 0 0 10px;
        }

        .type-common {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          width: 100%;
          height: 100%;
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
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;

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
