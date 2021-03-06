<template>
  <el-container class="home">
    <el-header class="home-header">媒资管理系统</el-header>
    <el-main class="home-main">
      <div class="home-container">
        <div class="login-type">
          <div
            class="type-login type-common"
            @click="changeLoginStatus('login')"
          >
            <el-button type="primary" class="type-common">登录</el-button>
          </div>
          <div
            class="type-register type-common"
            @click="changeLoginStatus('register')"
          >
            <el-button type="danger" class="type-common">注册</el-button>
          </div>
        </div>
        <div class="login-show">
          <div class="form">
            <div class="form-title">{{ loginStatusTitle }}</div>
            <div class="form-input" v-if="!loginStatus">
              <el-input placeholder="请输入用户名" v-model="username" clearable>
                <template slot="prepend">用 户 名 ：</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input placeholder="请输入账号" v-model="id">
                <template slot="prepend">{{ loginStatusId }}</template>
              </el-input>
            </div>
            <div class="form-input">
              <el-input
                placeholder="请输入密码"
                v-model="password"
                show-password
              >
                <template slot="prepend">{{ loginStatusPassword }}</template>
              </el-input>
            </div>
            <div class="form-input" v-if="!loginStatus">
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
                :class="loginStatusButtonClassName"
                type="primary"
                @click="loginAndRegisterClick"
              >
                {{ loginStatusButtonContent }}
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
import { mapState, mapActions } from "vuex";
import $api from "@/network/api";
import { debounce } from "lodash-es";

export default {
  name: "home",
  data() {
    return {
      loginStatus: true, //登录类型 true=登录 false=注册
      username: "", //用户名
      id: null, //账号
      password: "", //密码
      password1: "", //注册验证密码
    };
  },
  computed: {
    ...mapState("common", ["loginType"]),
    loginStatusTitle() {
      return this.loginStatus ? "用户登录" : "用户注册";
    },
    loginStatusId() {
      return this.loginStatus ? "账 号：" : "新 的 账 号：";
    },
    loginStatusPassword() {
      return this.loginStatus ? "密 码：" : "新 的 密 码：";
    },
    loginStatusButtonClassName() {
      return this.loginStatus ? "button-login" : "button-register";
    },
    loginStatusButtonContent() {
      return this.loginStatus ? "登录" : "注册";
    },
  },
  methods: {
    ...mapActions("common", ["userLogin"]),
    // 登录注册切换
    changeLoginStatus(type) {
      switch (type) {
        case "login":
          this.loginStatus = true;
          this.initFormData();
          break;
        case "register":
          this.loginStatus = false;
          this.initFormData();
          break;
      }
    },
    // 登录注册-前端验证
    loginAndRegisterClick: debounce(function () {
      const { id, password } = this;
      if (!id) return this.$message.error("账号不能为空");
      if (!password) return this.$message.error("密码不能为空");
      this.loginStatus ? this.login() : this.register();
    }, 300),
    // 登录
    async login() {
      let retNum = /^\d*$/;
      const { id, password } = this;
      const params = { id, password };
      if (retNum.test(id)) {
        await this.userLogin(params);
        sessionStorage.setItem("uid", id);
        if (this.loginType) this.$router.push("/admin");
        this.initFormData();
      } else {
        this.$message.error("请输入正确格式的账号");
      }
    },
    // 注册
    async register() {
      let retNum = /^\d*$/;
      const { id, username, password, password1 } = this;
      if (password !== password1) return this.$message.error("两次密码不一致");
      if (retNum.test(id)) {
        try {
          let resRegister = await $api.register([
            { id, username, password, authority: "4" },
          ]);
          resRegister.code === 200 && this.changeLoginStatus("login");
          this.initFormData();
        } catch (e) {
          this.$message.error(e);
        }
      } else {
        this.$message.error("请输入正确格式的账号");
      }
    },
    // 初始化input值
    initFormData() {
      this.id = null;
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
