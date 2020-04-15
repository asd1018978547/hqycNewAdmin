<template>
  <div id="app">
    <!-- <div
      v-if="isShowChromeTip && this.$route.fullPath!='/login'"
      class="titleInfo"
      ref="titleInfoRef"
    >
      检测到您的浏览器是谷歌内核，可能会导致页面崩溃，建议刷新此
      <span
        title="点击刷新"
        class="freshReload"
        style="cursor:pointer;font-size: 15px;text-decoration:underline"
        @click="reloadPage"
      >页面</span> 以解决此问题！
      <span
        class="close_span"
        style="cursor:pointer;font-size: 15px;"
        @click="hideTip"
        title="点击关闭"
      >（如已刷新请关闭此提示）</span>
      <img src="@/assets/img/clear.png" title="点击关闭提示" alt="环球云仓" class="closeTip" @click="hideTip" />
    </div> -->
    <!-- <transition enter-active-class="animated zoomIn"> -->
    <transition>
      <router-view class="appView"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    reloadPage() {
      location.reload();
    },
    hideTip() {
      this.$refs.titleInfoRef.style.display = "none";
    }
  },
  computed: {
    isShowChromeTip() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf("Opera") > -1;
      //判断是否Opera浏览器
      if (isOpera) {
        return false;
      }
      //判断是否Firefox浏览器
      if (userAgent.indexOf("Firefox") > -1) {
        return false;
      }
      //判断是否chorme浏览器
      if (userAgent.indexOf("Chrome") > -1) {
        return true;
      }
      //判断是否Safari浏览器
      if (userAgent.indexOf("Safari") > -1) {
        return false;
      }
      //判断是否IE浏览器
      if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
      ) {
        return false;
      }
      // 判断是否edge浏览器
      if (userAgent.indexOf("Trident") > -1) {
        return false;
      }
    }
  }
};
</script>
<style>
.appView {
  position: absolute;
  width: 100%;
  transition: transform 0.3s ease-out;
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}

.lh40 {
  line-height: 40px !important;
}
.zoomIn {
  -webkit-animation-name: zoomIn;
  animation-name: zoomIn;
}

.content_box {
  padding: 0 20px;
}

* {
  font-size: 12px;
}

.el-submenu__title span {
  font-size: 14px;
}

.goodsdialog .el-tree {
  height: 95%;
}

.goodsdialog .el-table {
  border-left: none;
}

.el-tree-node__label {
  font-size: 12px;
}

.Success {
  color: #67c23a !important;
}

.Warning {
  color: #e6a23c;
}

.Danger {
  color: #f56c6c !important;
}
.Success_b {
  background-color: #67c23a;
}

.Warning_b {
  background-color: #e6a23c;
}

.Danger_b {
  background-color: #f56c6c;
}
.search_time {
  width: 70%;
}

.Info {
  color: #409eff;
}
.Info_b {
  background-color: #409eff;
}
.search_btn {
  margin-left: 20px;
  font-size: 12px;
  line-height: 0.4;
  border-radius: 3px;
}

.search_title {
  flex: 1;
}

.el-input-group {
  display: inline-block;
}

.timed {
  font-size: 12px;
  flex: 0 0 90px;
  text-align: right;
}

.el-row {
  margin-bottom: 10px;
}

.el-col {
  display: flex;
  height: 35px;
  line-height: 35px;
}
.dashboard-container .el-col {
  display: block !important;
  height: auto !important;
  line-height: 20px !important;
}
.big_title {
  font-size: 18px;
}

.searchBox {
  padding: 10px 0;
}

.tftt .rd * {
  font-size: 12px;
}
.pagination-container {
  text-align: right;
  padding-bottom: 50px;
}

.storeManager .info_right .el-input {
  width: 200px !important;
}

.storeManager .info_right .el-cascader {
  width: 300px;
}

.storeManager .info_right .el-cascader .el-input {
  width: 300px !important;
}

.storeManager .info_right .info_address {
  width: 505px !important;
}

.storeManager .info_right .el-select .el-input--small .el-input__inner {
  height: 28px;
  line-height: 28px;
}

.sku .skuBhDig .el-dialog__body {
  padding-top: 0 !important;
}
.recgoods .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}

.recgoods .el-dialog__body {
  padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
}

.user .el-checkbox {
  display: inline-block;
}

.roleadd .el-tree {
  border: 1px solid #e6e6e6;
  padding: 10px;
}

.goodsManage .el-tree {
  border: none !important;
}

.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.goods_tag .el-tag {
  display: block;
  margin: 0 auto;
  margin-bottom: 5px;
  width: 90%;
}

.goods_tag .el-tag:nth-last-child(1) {
  margin-bottom: 0;
}

.addGoods .el-cascader {
  width: 100%;
}

.upload .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.upload .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.sku .avatar-uploader-icon::before {
  position: absolute;
  font-size: 28px;
  width: 50px;
  left: 50%;
  top: -30px;
  margin-left: -25px;
  height: 50px;
}

.sku .el-upload--picture-card {
  background: none !important;
  width: 132px !important;
  height: 132px !important;
  line-height: auto !important;
  vertical-align: auto !important;
}

.sku .subTitle div {
  z-index: 2 !important;
}

.sku .el-upload-list--picture-card .el-upload-list__item {
  width: 132px !important;
  height: 132px !important;
}

.upload .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  position: relative;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.sku .avatar-uploader-icon {
  width: 130px !important;
  height: 130px !important;
  font-size: 12px !important;
  line-height: 160px !important;
}

.od .el-cascader {
  width: 300px;
}

.upload .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.sku .avatar {
  width: 130px !important;
  height: 130px !important;
}

.sku .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.addsku .el-form-item__label {
  font-size: 12px !important;
  font-weight: 500 !important;
}
.addsku .w200 .el-select {
  width: 100%;
}

.orderdetail .el-collapse-item__header {
  background: hsla(220, 4%, 58%, 0.1) !important;
  border: 1px solid #eee;
  text-indent: 15px;
  font-weight: bolder;
}

.orderdetail .el-collapse-item__content {
  padding: 20px;
  border: 1px solid #eee;
  border-top: none;
}

.orderdetail .el-collapse-item {
  margin-bottom: 20px;
}

.orderdetail .el-collapse-item__wrap {
  border-bottom: none;
  width: 100%;
}

.orderdetail .el-collapse {
  border: none;
}

.ao .demo-ruleForm .el-form-item {
  width: 100%;
}
.tree_tag .el-checkbox__label {
  font-size: 12px;
}
.tipSpan:hover {
  color: #00b0ff !important;
}
.freshReload:hover {
  color: #00b0ff !important;
}
.close_span:hover {
  color: #00b0ff !important;
}
.titleInfo {
  font-weight: 700;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffe0;
  color: red;
  height: 40px;
  width: 100%;
  font-size: 15px;
  text-align: center;
  padding-top: 10px;
  position: fixed;
}
.closeTip {
  cursor: pointer;
  opacity: 0.8;
  position: absolute;
  right: 12px;
  top: 7px;
  width: 20px;
  height: 20px;
}
</style>