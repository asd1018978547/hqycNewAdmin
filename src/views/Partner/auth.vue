<template>
  <div id="paddsku" class="content_box roleadd addGoods addsku sku">
    <div class="info mb10">
      <div class="infoTitle">授权说明</div>
      <div class="infoDesc" style="padding-bottom:18px">
        <p>1、您的微信小程序授权给智选云商后，智选云商将为你部署并发布小程序；</p>
        <p>2、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给智选云商；</p>
        <p>3、新授权的小程序需与已授权的小程序及公众号主体一致；</p>
        <p>4、您在该入口授权的公众账号类型为小程序，请在授权页面正确选择。</p>
      </div>
    </div>
    <div class="info mb10">
      <div class="infoTitle">小程序类型</div>
      <div class="infoDesc" style="padding-bottom:18px">
        <p>1、企业类型帐号，可以根据需要确定是否申请微信认证（认证入口：登录小程序—设置—基本设置—微信认证—详情）；</p>
        <p>2、已认证帐号可使用微信支付权限，个人类型帐号暂不支持微信认证。</p>
        <div class="auth_btn">
          <div class="auth_btn_item">
            <p>掌柜端小程序</p>
            <el-button type="primary" size="mini" @click="goToAuth(3)">一键授权</el-button>
          </div>
          <div class="auth_btn_item">
            <p>店铺端小程序</p>
            <el-button type="primary" size="mini" @click="goToAuth(2)">一键授权</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        authUrl: ''
      };
    },
    computed: {
      computedAUTHURL() {
        return window._config.authurl + 'Pages/AuthCode.html?t=' + localStorage.token;
      }
    },
    methods: {
      goToAuth(type) {
        let url = window._config.authurl;
        var token = '';
        if (typeof(localStorage.getItem('Token')) != 'undefined'){
           token = localStorage.getItem('Token');
        }
        window.open(url + 'Pages/AuthCode.html?t=' +  token + '&type=' + type);
      }
    }
  };
</script>
<style>
.auth_btn {
  display: flex;
  width: 400px;
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 30px;
}
.auth_btn_item {
  flex: 0 0 50%;
  text-align: center;
}
#paddsku {
  padding: 15px;
}
#paddsku .avatar-uploader {
  position: relative;
}
.gdservice .el-checkbox + .el-checkbox {
  margin-left: 0;
}
.gdservice .el-checkbox {
  margin-bottom: 15px;
}
#paddsku .el-form-item__label {
  font-size: 12px;
  font-weight: 400;
}
</style>
<style scoped>
.w350 {
  width: 350px !important;
}
.w300 {
  width: 300px !important;
}
.ml10 {
  margin-left: 10px;
}

.w800 {
  width: 800px;
}

.info_item {
  display: flex;
  height: 40px;
}

.info_item .info_title {
  flex: 0 0 100px;
  line-height: 29px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
  display: flex;
}

.delImage {
  position: absolute;
  z-index: 1;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 130px;
  left: 0;
  color: #fff;
  text-align: center;
  height: 25px;
  font-style: normal;
}

.title_btn {
  margin-left: 15px;
}

.subTitle {
  padding-bottom: 20px;
  z-index: 2 !important;
}

.subTitle h2 {
  margin: 0;
  height: 45px;
  line-height: 45px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.addskuupload {
  display: flex;
  width: 100%;
}

.mr15 {
  margin-right: 15px;
}

.upload h5 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #666;
}

.edit-input {
  flex: 1;
}

.mb10 {
  margin-bottom: 10px;
}

.mb18 {
  margin-bottom: 18px;
}

.info {
  border: 1px solid #eee;
}

.infoDesc {
  padding: 18px;
  padding-bottom: 0;
}

.infoTitle {
  height: 40px;
  line-height: 40px;
  background: hsla(220, 4%, 58%, 0.1) !important;
  border-bottom: 1px solid #eee;
  text-indent: 10px;
  font-size: 13px;
}

.w200 {
  width: 400px;
}
</style>