<template>
  <div class="content_box recgoods">
    <h2 class="big_title">{{ $route.query.id ? '编辑' : '新增' }}活动</h2>
    <div class="desc">
      <div class="item">
        <div class="title">活动标题：</div>
        <div class="item_desc">
          <el-input v-model="name" class="search_title" size="mini" placeholder="输入活动标题"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="title">上传图片：</div>
        <div class="item_desc" style="flex:0 0 1200px;">
          <el-upload
            class="upload-demo"
            action
            accept="image/*"
            :before-upload="checkFile"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="uploadImg"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="line-height:24px;">
              只能上传jpg/png文件，且不超过500kb
              <br />上传文件路径不会保存到数据库，只作为替换代码图片用
            </div>
          </el-upload>
        </div>
      </div>
      <div class="item">
        <div class="title">图片地址：</div>
        <div class="item_desc" style="flex:0 0 1200px;">
          <div v-for="(item,index) in imgList" :key="index">
            <el-tag style="line-height:24px;margin:0;">{{ item.tagName }}</el-tag>
            <br />
            <img :src="item.url" alt />
          </div>
        </div>
      </div>
      <div class="item" style="margin-top:20px;">
        <div class="title">活动内容：</div>
        <div class="item_desc" style="flex:0 0 1200px;line-height:20px;">
          <Tinymce :height="300" ref="editor" v-model="content" />
        </div>
      </div>
      <div class="item">
        <div class="title"></div>
        <div class="item_desc">
          <el-button style="margin-top:20px;" class="addAdv" @click="add" type="success">提交</el-button>
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
  "ActivityArea/" +
  moment().format("YYYYMM") +
  "/img/";
import Tinymce from "@/components/Tinymce2";
import {
  addActivityArea,
  getActivityArea,
  editActivityArea
} from "@/api/ActivityArea/ActivityArea";
export default {
  components: { Tinymce },
  data() {
    return {
      name: "",
      content: "",
      imgList: [],
      fileList: [],
      uploadfiles: [],
      imgNames: []
    };
  },
  created() {
    if (this.$route.query.id) {
      getActivityArea({
        id: this.$route.query.id
      }).then(res => {
        this.name = res.Name;
        this.content = res.Content;
      });
    }
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
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.imgList.push({ tagName: signUrl, url: signUrl });
          
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
    add() {
      if (this.name == "") {
        this.$message.error("请输入活动标题");
        return;
      } else if (this.content == "") {
        this.$message.error("请输入活动内容");
        return;
      }
      if (this.$route.query.id) {
        editActivityArea({
          id: this.$route.query.id,
          name: this.name,
          content: this.content
        }).then(res => {
          this.$message.success("编辑活动成功");
          this.$router.push("/ActivityArea");
        });
      } else {
        addActivityArea({
          name: this.name,
          content: this.content
        }).then(res => {
          this.$message.success("新增活动成功");
          this.$router.push("/ActivityArea");
        });
      }
    },
    checkFile(file) {
      const n = file.name.substring(file.name.lastIndexOf(".") + 1);
      const png = n === "jpg";
      const jpg = n === "png";
      const gif = n === "gif";
      const size = file.size / 1024 / 1024 < 2;
      if (!png && !jpg) {
        this.$message.error("请选择jpg,png文件！");
      }
      if (!size) {
        this.$message.error("文件过大，请从新选择");
      }
      return png || jpg || (gif && size);
    }
  }
};
</script>

<style scoped>
a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
}

.desc .item {
  line-height: 45px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 100px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 0 0 250px;
}

.desc .item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
}
</style>
