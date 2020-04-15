<template>
  <div class="content_box roleadd addGoods addsku sku">
    <sticky class="sub-navbar">
      <h2 class="big_title">
        {{ $route.meta.title }}
        <el-button
          v-if="checkBtn('func_common_save')"
          @click="onSave"
          class="pan-btn green-btn mrr10"
          type="success"
          size="small"
        >提交保存</el-button>
      </h2>
    </sticky>
    <!--:model="ruleForm" :rules="rules" -->
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-top:20px;">
      <div class="info mb10">
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="快报标题" prop="Name">
            <el-input type="text" v-model="title" placeholder="请输入快报标题"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="快报副标题" prop="Name">
            <el-input type="text" v-model="desc" placeholder="请输入快报副标题"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="主图" prop="ShortDesc">
            <div class="addskuupload">
              <div class="addskuuploadItem" style="border: 1px dashed #ebeef5">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :http-request="uploadImg"
                  action
                  accept="image/*"
                  :show-file-list="false"
                  :limit="1"
                >
                  <img v-if="image != ''" :src="imageShow" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon">新闻主图</i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="标签" prop="labelId">
            <el-select filterable v-model="labelId" placeholder="请选择标签">
              <el-option
                v-for="item in labelList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="点赞数" prop="Name">
            <el-input
              type="text"
              @keyup.native="checkIsInt1"
              v-model="thumbsUpNumber"
              placeholder="请输入快报标题"
            ></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="分享数" prop="Name">
            <el-input
              type="text"
              @keyup.native="checkIsInt2"
              v-model="forwardNumber"
              placeholder="请输入快报标题"
            ></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="阅读数" prop="Name">
            <el-input
              type="text"
              @keyup.native="checkIsInt3"
              v-model="readNumber"
              placeholder="请输入快报标题"
            ></el-input>
          </el-form-item>
          <el-form-item size="mini" label="新闻内容" prop="content">
            <div class="editor-container">
              <Tinymce :height="400" ref="editor" v-model="content" />
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "news/" +
  moment().format("YYYYMM") +
  "/img/";
import Sticky from "@/components/Sticky";
import Tinymce from "@/components/Tinymce";
import { getLabelList, editNews, getNews } from "@/api/news/news.js";
export default {
  components: { Tinymce, Sticky },
  data() {
    return {
      fu: window.ali_oss_data.URL_IMG_SHOW,
      labelId: null,
      image: "",
      imageShow: "",
      labelList: [],
      title: "",
      desc: "",
      content: "",
      thumbsUpNumber: 0,
      forwardNumber: 0,
      readNumber: 0,
      roleBtn: [],
      uploadfiles: [],
      imgNames: []
    };
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    this.getLabelList();
    if (parseInt(this.$route.query.id) !== -1 && this.$route.query.id !== "") {
      getNews({ id: this.$route.query.id }).then(res => {
        this.title = res.Title;
        this.image = res.Image;
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + res.Image;
        this.imageShow = signUrl;
        this.labelId = res.LabelId;
        this.desc = res.Desc;
        this.content = res.Content;
        this.thumbsUpNumber = res.ThumbsUpNumber;
        this.forwardNumber = res.ForwardNumber;
        this.readNumber = res.ReadNumber;
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    let f = false;
    let view = {};
    this.$store.state.tagsView.visitedViews.map(v => {
      if (v.path === from.path) {
        f = true;
        view = v;
      }
    });
    if (f) {
      this.$destroy();
      this.$store.dispatch("delVisitedViews", view).then(views => {});
    }
    next();
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

      const u = this.$refs.upload;
      u.clearFiles();
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.image = imgFileNameList[0];
          this.imageShow = signUrl;
        });
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
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    checkIsInt1() {
      this.thumbsUpNumber = this.thumbsUpNumber.replace(/[^\.\d]/g, "0");
      this.thumbsUpNumber = this.thumbsUpNumber.replace(".", "");
      this.thumbsUpNumber =
        parseInt(this.thumbsUpNumber).toString() === "NaN"
          ? 0
          : parseInt(this.thumbsUpNumber).toString();
    },
    checkIsInt2() {
      this.forwardNumber = this.forwardNumber.replace(/[^\.\d]/g, "0");
      this.forwardNumber = this.forwardNumber.replace(".", "");
      this.forwardNumber =
        parseInt(this.forwardNumber).toString() === "NaN"
          ? 0
          : parseInt(this.forwardNumber).toString();
    },
    checkIsInt3() {
      this.readNumber = this.readNumber.replace(/[^\.\d]/g, "0");
      this.readNumber = this.readNumber.replace(".", "");
      this.readNumber =
        parseInt(this.readNumber).toString() === "NaN"
          ? 0
          : parseInt(this.readNumber).toString();
    },
    onSave() {
      if (this.title === "") {
        this.$message.error("请输入标题");
        return;
      } else if (this.image === "") {
        this.$message.error("请上传主图");
        return;
      } else if (this.labelId === null) {
        this.$message.error("请选择标签");
        return;
      } else if (this.content === "") {
        this.$message.error("请填写内容");
        return;
      } else if (this.desc === "") {
        this.$message.error("请填写副内容");
        return;
      }
      editNews({
        id: this.$route.query.id === -1 ? 0 : this.$route.query.id,
        title: this.title,
        image: this.image,
        labelId: this.labelId,
        content: this.content,
        desc: this.desc,
        thumbsUpNumber: this.thumbsUpNumber,
        forwardNumber: this.forwardNumber,
        readNumber: this.readNumber
      }).then(res => {
        this.$message.success(
          this.$route.query.id === -1 ? "新增" : "编辑" + "成功"
        );
        this.$router.back(-1);
      });
    },
    getLabelList() {
      getLabelList().then(res => {
        this.labelList = res;
      });
    }
  }
};
</script>
<style scoped>
.w200 {
  width: 400px;
}

.mrr10 {
  margin-left: 20px;
}

.big_title {
  margin: 0;
}

.addskuupload {
  width: 130px;
  position: relative;
}
</style>