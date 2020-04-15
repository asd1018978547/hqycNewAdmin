<template>
  <div class="content_box roleadd goodsManage sku">
    <div class="box">
      <div class="box_left">
        <div class="title">
          SKU类别
          <el-button type="text" size="mini" @click="add">新增顶级SKU类别</el-button>
        </div>
        <el-tree
          @node-click="edit"
          accordion
          :highlight-current="true"
          :data="typelist"
          :load="loadNode"
          lazy
          :props="defaultProps"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-if="node.level < 3 && checkBtn('func_common_add')"
                type="text"
                size="mini"
                @click.stop="() => append(data, node)"
              >新增</el-button>
              <el-button
                v-if="checkBtn('func_common_delete')"
                type="text"
                size="mini"
                @click.stop="() => remove(node, data)"
              >删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="box_right">
        <div class="title">SKU类别编辑</div>
        <div class="searchBox">
          <div class="desc">
            <div class="info_item">
              <div class="info_title">上级类别：</div>
              <div class="info_right">
                <el-input
                  disabled
                  class="inputClass"
                  v-model="base.PName + '-' +base.PCode"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span class="red">*</span>类别编号：
              </div>
              <div class="info_right">
                <el-input
                  disabled
                  placeholder="待生成"
                  class="inputClass"
                  v-model="base.Code"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span class="red">*</span>类别名称：
              </div>
              <div class="info_right">
                <el-input placeholder="请输入类别名称" class="inputClass" v-model="base.Name" size="mini"></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span class="red">*</span>权重：
              </div>
              <div class="info_right">
                <el-input placeholder="请输入权重" class="inputClass" v-model="base.Weight" size="mini"></el-input>
              </div>
            </div>
            <div class="info_item upload">
              <div class="info_title">类别图片：</div>
              <div class="info_right nf">
                <span v-if="base.Icon" class="blue" @click="clearFiles">重新上传</span>
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  accept="image/*"
                  action
                  :show-file-list="false"
                  :http-request="uploadImg"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                >
                  <img v-if="base.Icon" :src="picShow" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon">点击上传文件</i>
                </el-upload>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title"></div>
              <div class="info_right">
                <el-row>
                  <el-col :span="4">
                    <el-button
                      v-if="checkBtn('func_common_save')"
                      @click="save"
                      size="mini"
                      type="success"
                      class="pan-btn green-btn nm"
                      icon="el-icon-check"
                    >提交保存</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
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
  "skucategorymanage/" +
  moment().format("YYYYMM") +
  "/img/";
import { getSkuList } from "@/api/adv/recGoods";
import { editSKUType, delSKUType } from "@/api/sku/skucategorymanage";
export default {
  data() {
    return {
      CurCode: "",
      picShow: "",
      typelist: [],
      uploadfiles: [],
      imgNames: [],
      isAdd: true,
      base: {
        PCode: "",
        Code: "",
        Name: "",
        Icon: "",
        PName: "",
        Weight: ""
      },
      roleBtn: [],
      defaultProps: {
        children: "ChildMenu",
        label: "Name",
        isLeaf: "IsLeaf"
      }
    };
  },
  activated() {
    this.CurCode = "";
    this.getList().then(res => {
      this.typelist = res;
    });
  },
  created() {
    this.CurCode = "";
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    this.roleBtn.map(v => {});
    this.getList().then(res => {
      this.typelist = res;
    });
  },
  methods: {
    //自定義圖片上傳方法
    uploadImg(option) {
      this.uploadfiles = [];
      this.imgNames = [];
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
      this.$refs.upload.clearFiles();
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.base.Icon = imgFileNameList[0];
          this.picShow = signUrl;
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
    add() {
      this.clearBase();
    },
    clearBase() {
      this.base = {
        PCode: "",
        Code: "",
        Name: "",
        Weight: "",
        Icon: "",
        PName: ""
      };
    },
    save() {
      if (this.base.Name === "") {
        this.$message.error("名称不能为空");
        return;
      }
      editSKUType(this.base).then(res => {
        this.$message.success(this.isAdd ? "新增" : "编辑" + "成功");
        this.CurCode = "";
        this.getList().then(res => {
          this.typelist = res;
          this.clearBase();
        });
      });
      this.$refs.upload.clearFiles();
    },
    remove(node, data) {
      this.$confirm("确定要删除《" + data.Name + "》这个类别吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSKUType({ code: data.Code }).then(res => {
          this.$message.success("删除成功！");
          this.CurCode = "";
          this.getList().then(res => {
            this.typelist = res;
            this.clearBase();
          });
        });
      });
    },
    getList() {
      return new Promise((rs, rj) => {
        getSkuList({ CurCode: this.CurCode }).then(res => {
          rs(res);
        });
      });
    },
    edit(data) {
      const o = Object.assign(this.base, data);
      this.base = o;
      let signUrl = window.ali_oss_data.URL_IMG_SHOW + this.base.Icon;
      this.picShow = signUrl;
      this.isAdd = false;
    },
    append(data, node) {
      this.isAdd = true;
      this.clearBase();
      this.base.PCode = data.Code;
      this.base.PName = data.Name;
    },
    loadNode(node, resolve) {
      if (node.level === 0) return;
      this.CurCode = node.data.Code;
      this.getList({ CurCode: this.CurCode }).then(res => {
        resolve(res);
      });
    },
    clearFiles() {
      this.base.Icon = "";
      this.$refs.upload.clearFiles();
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style scoped>
.nf {
  display: block !important;
}

.blue {
  color: #409eff;
  line-height: 35px;
  cursor: pointer;
}

.inputClass {
  flex: 0 0 200px;
  margin-right: 10px;
}

.box_left .title,
.box_right > .title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.red {
  color: #f56c6c;
}

.desc .item {
  line-height: 45px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 120px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 0 0 300px;
}

.info_item {
  display: flex;
  height: 40px;
}

.info_title span {
  color: #ff0000;
  padding-right: 5px;
}

.upload {
  height: 180px !important;
}

.info_item .info_title {
  flex: 0 0 120px;
  line-height: 29px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
  display: flex;
}

.box {
  display: flex;
  min-height: calc(100vh - 84px);
  padding: 20px 0;
}
.box_left {
  flex: 0 0 250px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  border-bottom: 1px solid #eaeaea !important;
}
.searchBox {
  padding: 15px !important;
}
.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  margin-left: 10px;
}
</style>