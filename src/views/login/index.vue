<template>
  <div class="login-container">
    <canvas ref="canvas" id="canvas"></canvas>
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          <img src="../../assets/img/login-logo.png" alt />
        </h3>
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          name="password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          placeholder="密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;"
        :loading="loading"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import LangSelect from '@/components/LangSelect'
import loginBg from "@/assets/bg.js";
import login from "@/api/user/login";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          import("@/utils/md5").then(md5 => {
            login(this.loginForm.username, md5(this.loginForm.password)).then(
              res => {
                window.localStorage.setItem("Token", res.Token);
                window.localStorage.setItem("NickName", res.NickName);
                window.localStorage.setItem("UserId", res.UserId);
                window.localStorage.setItem("RoleId", res.RoleId);
                window.localStorage.setItem(
                  "TokenExpirationTime",
                  res.TokenExpirationTime
                );
                this.$router.replace({
                  name: "main"
                });
                // setTimeout(() => {
                //   location.reload();
                // }, 700);
              }
            );
          });
        }
      });
    }
  },
  mounted() {
    loginBg(this.$refs.canvas);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #fff;
$light_gray: #eee;
#canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 0;
}

/* reset element-ui css */

.login-container {
  -webkit-user-select: none;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        background: transparent !important;
        -webkit-box-shadow: 0 0 0px 1000px rgba(48, 65, 86, 1) inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #999;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  // background: url('../../assets/login_bj.png');
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    z-index: 2;
    padding: 35px 35px 15px 35px;
    margin: 200px auto;
    border-radius: 5px;
    box-shadow: 0 0 14px #cacbcb;
    background: rgba(48, 65, 86, 1);
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>