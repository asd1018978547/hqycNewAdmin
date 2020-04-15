<template>
  <div class="content_box roleadd goodsManage sku storesetting">
    <div class="box_top">
      <el-button type="success" size="mini" @click="save">保存</el-button>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">微信分享</div>
        <div class="searchBox">
          <span class="inlineb">
            <i>*</i>推送文字：
          </span>
          <el-input
            class="inlineb w200"
            size="mini"
            v-model="objEditInfo.Sharing1.Title"
            placeholder="请输入推送文字"
          ></el-input>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            <i>*</i>推送图片：
          </span>
          <div class="addskuuploadItem" style="margin-right: 8px;">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              :http-request="uploadImg"
              accept="image/*"
              action
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :limit="1"
            >
              <img
                v-if="objEditInfo.Sharing1.Img && objEditInfo.Sharing1.Img != ''"
                :src="picShow"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon">推送图片</i>
            </el-upload>
          </div>
          <el-button
            v-if="objEditInfo.Sharing1.Img && objEditInfo.Sharing1.Img != ''"
            style="display:inline-block"
            type="text"
            @click="jumpbig"
          >查看大图</el-button>
          <span
            style="font-size:12px;color:#97a8be;margin-left:10px;"
          >请选择尺寸为1000*800，比例为5:4，大小不超过500KB。</span>
        </div>
      </div>
      <div class="box_right" style="margin-top:10px;">
        <div class="title mb">朋友圈分享</div>
        <div class="searchBox">
          <span class="inlineb" style="display:block">
            <i>*</i>选择模板：
          </span>
          <div class="imgList">
            <el-radio-group
              style="margin-top:20px;margin-left:20px;"
              v-model="objEditInfo.Sharing2"
            >
              <el-radio :label="item.Id" class="disblock" v-for="(item,index) in temp" :key="index">
                <img :src="item.Link" />
                <el-button
                  class="img_btn"
                  style="display:inline-block"
                  type="text"
                  @click="jumpimg(item.Link)"
                >查看大图</el-button>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "StoreSetting/" +
  moment().format("YYYYMM") +
  "/img/";
import {
  getSharingTemplateGet,
  getSupplierSettingsShopGet,
  saveSupplierSettingsShopGet
} from "@/api/Partner/storeSetting";
export default {
  data() {
    return {
      uploadfiles: [],
      picShow: "",
      imgNames: [],
      objEditInfo: {
        Sharing1: {
          Title: "",
          Img: ""
        },
        Sharing2: 0
      },
      temp: []
    };
  },
  activated() {
    this.getData();
    this.gettemp();
  },
  methods: {
    //自定義圖片上傳方法
    uploadImg(option) {
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      this.$forceUpdate();
      setTimeout(() => {
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + imgFileNameList[0];
        this.objEditInfo.Sharing1.Img = imgFileNameList[0];
        this.picShow = signUrl;
      }, 500);
    },
    //上传到ali-OSS
    uploadImgToOSS(file, imgName) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function put() {
        try {
          let result = await client.put(imgName, file);
        } catch (e) {
          console.log(e);
        }
      }
      put();
    },
    save() {
      if (this.objEditInfo.Sharing1.Title == "") {
        this.$message.error("请输入推送文字");
        return;
      } else if (this.objEditInfo.Sharing1.Img == "") {
        this.$message.error("请上传推送图片");
        return;
      } else if (this.objEditInfo.Sharing2 == "") {
        this.$message.error("请选择朋友圈分享模板");
      }
      saveSupplierSettingsShopGet({
        settings: this.objEditInfo
      }).then(res => {
        this.$message.success("编辑成功");
      });
    },
    jumpimg(Link) {
      window.open(Link, "_blank");
    },
    getData() {
      getSupplierSettingsShopGet().then(res => {
        res.Sharing2 = parseInt(res.Sharing2);
        this.objEditInfo = res;
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + res.Sharing1.Img;
        this.picShow = signUrl;
      });
    },
    gettemp() {
      getSharingTemplateGet({ type: 1 }).then(res => {
        this.temp = res;
      });
    },
    jumpbig() {
      window.open(this.picShow, "_blank");
    },
    beforeAvatarUpload(file, index) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 500KB!");
        this.clearFiles();
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
.storesetting .el-radio + .el-radio {
  margin-left: 0;
}
.disblock .el-radio__input {
  margin-top: -125px;
  margin-left: 10px;
}
.disblock .img_btn {
  position: absolute;
  top: -5px;
  right: 5px;
}
</style>
<style scoped lang="scss">
.disblock {
  display: block;
  border: 1px solid #eeeeee;
  height: 170px;
  line-height: 170px;
  position: relative;
  padding: 20px 0;
  width: 400px;
  margin-bottom: 10px;
}
.disblock img {
  height: 130px;
  margin-left: 30px;
}
.addskuuploadItem {
  display: inline-block;
  width: 130px;
  position: relative;
  border: 1px dashed #eeeeee;
}
.inlineb i {
  color: #ff0000;
  margin-right: 10px;
}
.w200 {
  width: 400px;
}
.inlineb {
  display: inline-block;
}
.chebox_list {
  padding: 0 10px;
}
.chebox_list p,
.el-radio-group,
.chebox_list .chebox_radio {
  width: 100%;
}
.inb_120 {
  display: inline-block;
  width: 120px;
}
.box_top {
  height: 50px;
  line-height: 50px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}
.choice_group {
  width: 100%;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;

  .input_group {
    flex: 1;
  }

  #fileEl {
    position: absolute;
    width: 265px;
    height: 36px;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
  }

  .file_text {
    width: 265px;
    height: 36px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-circle-close {
    cursor: pointer;
    font-size: 15px;
    position: relative;
    left: -32px;
    color: #aaa;
    z-index: 10000;
  }

  .pan-btn {
    padding: 10px 20px;
  }
}
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.box {
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
}

.box_left {
  flex: 0 0 150px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.content_box {
  width: 100%;
  box-sizing: border-box;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
  box-sizing: border-box;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.skuItem {
  display: flex;
}

.skuItem img {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
}

.skuItem p {
  line-height: 25px;
  padding-left: 10px;
  text-align: left;
  margin: 0;
}

.mb {
  margin-bottom: 5px;
}
</style>