<template>
  <div class="upload-container">
    <el-button
      icon="el-icon-upload"
      size="mini"
      :style="{background:color,borderColor:color}"
      @click=" dialogVisible=true"
      type="primary"
    >上传图片</el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        action
        :multiple="true"
        accept="image/*"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :http-request="uploadImg"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "ActivityArea/" +
  moment().format("YYYYMM") +
  "/img/";
export default {
  name: "editorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff"
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      uploadfiles: [],
      imgNames: []
    };
  },
  methods: {
    //自定義圖片上傳方法
    uploadImg(option) {
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
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
    handleSubmit() {
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000)+new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      this.$emit("successCBK", imgFileNameList);
      this.dialogVisible = false;
    },
    handleRemove(file) {
      for (var i = 0; i < this.imgNames.length; i++) {
        if (this.imgNames[i] == file.name) {
          this.imgNames.splice(i, 1);
          this.uploadfiles.splice(i, 1);
        }
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>