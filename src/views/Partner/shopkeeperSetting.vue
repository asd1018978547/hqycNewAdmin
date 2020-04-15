<template>
  <div class="content_box roleadd goodsManage sku storesetting">
    <div class="box_top">
      <el-button type="success" size="mini" @click="save">保存</el-button>
    </div>
    <div
      class="box"
      style="padding-top:0;min-height:155px;padding-bottom:10px;"
    >
      <div class="box_right">
        <div class="title mb">广告管理</div>
        <div class="searchBox">
          <span style="font-size:12px;color:#97a8be;"
            >显示规则：在掌柜端小程序首页显示，轮播图最少1张，最多可上传5张。</span
          >
          <div style="height:15px;"></div>
          <span style="font-size:12px;color:#97a8be;"
            >图片要求：图片建议尺寸为750*300，大小不超过2MB。</span
          >
          <div style="height:15px;"></div>
          <div
            class="adv_item"
            v-for="(item, index) in objEditInfo.Advs"
            :key="index"
          >
            <el-button
              style="margin-left:10px;margin-top:10px;"
              type="danger"
              size="mini"
              @click="deleteAdv(index)"
              >删除广告</el-button
            >
            <div class="searchBox">
              <span class="inlineb"> <i>*</i>绑定商品： </span>
              <el-input
                class="inlineb"
                style="width:250px"
                :disabled="true"
                size="mini"
                v-model="item.ProName"
                placeholder="请输入推送文字"
              ></el-input>
              <el-button
                style="margin-left:10px;"
                type="success"
                size="mini"
                @click="choiceGoods(index)"
                >选择商品</el-button
              >
            </div>
            <div class="searchBox">
              <span class="inlineb"> <i>*</i>图片： </span>
              <div class="addskuuploadItem" style="margin-right: 8px;">
                <el-upload
                  :ref="'upload' + index"
                  class="avatar-uploader"
                  action
                  accept="image/*"
                  :http-request="uploadImg1"
                  :show-file-list="false"
                  :before-upload="
                    res => {
                      return beforeAvatarUpload(res, index);
                    }
                  "
                >
                  <img
                    v-if="item.Img && item.Img != ''"
                    :src="item.showImg"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    >推送图片</i
                  >
                </el-upload>
              </div>
              <el-button
                v-if="item.Img && item.Img != ''"
                style="display:inline-block"
                type="text"
                @click="jumpbigimg(item.showImg)"
                >查看大图</el-button
              >
            </div>
          </div>
          <el-button
            v-if="objEditInfo.Advs.length < 5"
            type="success"
            size="mini"
            @click="addAdv"
            >新增广告</el-button
          >
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">微信分享</div>
        <div class="searchBox">
          <span class="inlineb"> <i>*</i>推送文字： </span>
          <el-input
            class="inlineb w200"
            size="mini"
            v-model="objEditInfo.Sharing1.Title"
            placeholder="请输入推送文字"
          ></el-input>
        </div>
        <div class="searchBox">
          <span class="inlineb"> <i>*</i>推送图片： </span>
          <div class="addskuuploadItem" style="margin-right: 8px;">
            <el-upload
              ref="wxupload"
              class="avatar-uploader"
              accept="image/*"
              action
              :http-request="uploadImg"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload1"
            >
              <img
                v-if="
                  objEditInfo.Sharing1.Img && objEditInfo.Sharing1.Img != ''
                "
                :src="ShareImgShow"
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
            >查看大图</el-button
          >
          <span style="font-size:12px;color:#97a8be;margin-left:10px;"
            >请选择尺寸为1000*800，比例为5:4，大小不超过2MB。</span
          >
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
              <el-radio
                :label="item.Id"
                class="disblock"
                v-for="(item, index) in temp"
                :key="index"
              >
                <img :src="item.Link" />
                <el-button
                  class="img_btn"
                  style="display:inline-block"
                  type="text"
                  @click="jumpimg(item.Link)"
                  >查看大图</el-button
                >
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择商品" :visible.sync="dialogTableVisible" width="80%">
      <el-row>
        <el-col :span="5">
          <span class="timed">关键字/品牌：</span>
          <el-input
            clearable
            v-model="search.keys"
            class="search_title"
            size="mini"
            placeholder="请输入关键字/品牌"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            class="search_btn"
            @click="getGoodsData"
            type="success"
            size="mini"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <el-table
        ref="tables"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          label="商品信息"
          prop="FullCategoryName"
          align="center"
          width="650"
        >
          <template slot-scope="scope">
            <div class="skuItem">
              <img :src="scope.row.Images[0]" />
              <p>
                商品名称：{{ scope.row.Title }}
                <el-tag size="mini" style="margin-left:10px;">{{
                  scope.row.TradeType == 1
                    ? "跨境直邮"
                    : scope.row.TradeType == 2
                    ? "保税备货"
                    : "一般贸易"
                }}</el-tag>
                <br />
                <span class="inb_120">商品品牌：{{ scope.row.Brand }}</span>
                商品分类：{{ scope.row.Category }}
                <br />
                <span class="inb_120">
                  今日热销：
                  <el-tag
                    size="mini"
                    v-if="scope.row.IsRecommended == 1"
                    type="success"
                    >是</el-tag
                  >
                  <el-tag
                    size="mini"
                    v-if="scope.row.IsRecommended == 0"
                    type="danger"
                    >否</el-tag
                  >
                </span>
                <span class="inb_120">
                  商品状态：
                  <el-tag size="mini" v-if="search.Status == 1" type="success"
                    >上架</el-tag
                  >
                  <el-tag size="mini" v-if="search.Status == 0" type="danger"
                    >下架</el-tag
                  >
                </span>
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="规格名称"
          prop="std.Name"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="虚拟库存"
          prop="std.Amount"
          align="center"
          width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="零售价"
          prop="std.Price4Retail"
          align="center"
          width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="佣金类型"
          prop="std.CommissionTypeDesc"
          align="center"
          width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="佣金"
          prop="std.Commission"
          align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="关联库房商品" align="center">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.std.ProInfos" :key="index">
              {{ item.ProName }} × {{ item.ProCount }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="choice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRows"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "shopkeeperSetting/" +
  moment().format("YYYYMM") +
  "/img/";
import {
  getSharingTemplateGet,
  getSupplierSettingsMngrGet,
  saveSupplierSettingsMngrSet
} from "@/api/Partner/storeSetting";
import { getskulist } from "@/api/Partner/sku";
export default {
  data() {
    return {
      list: [],
      myindex: "",
      ShareImgShow: "",
      search: {
        keys: ""
      },
      dialogTableVisible: false,
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      objEditInfo: {
        Advs: [],
        Sharing1: {
          Title: "",
          Img: ""
        },
        Sharing2: 0
      },
      choiceindex: -1,
      temp: [],
      uploadfiles: [],
      imgNames: [],
      uploadfiles1: [],
      imgNames1: []
    };
  },
  activated() {
    this.getData();
    this.gettemp();
    this.getGoodsData();
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
        this.$forceUpdate();
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.objEditInfo.Sharing1.Img = imgFileNameList[0];
          this.ShareImgShow = signUrl;
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg1(option) {
      //配置的上传路径
      this.uploadfiles1 = [];
      this.imgNames1 = [];
      this.uploadfiles1.push(option.file);
      this.imgNames1.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames1.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles1.length; i++) {
        this.uploadImgToOSS(this.uploadfiles1[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.objEditInfo.Advs[this.myindex].Img = imgFileNameList[0];
          this.$set(this.objEditInfo.Advs[this.myindex], "showImg", signUrl);
          this.$forceUpdate();
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
    addAdv() {
      this.objEditInfo.Advs.push({
        Img: "",
        ProId: "",
        ProName: ""
      });
    },
    deleteAdv(index) {
      this.$confirm("确定要删除这条广告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.objEditInfo.Advs.splice(index, 1);
      });
    },
    choiceGoods(index) {
      this.choiceindex = index;
      this.dialogTableVisible = true;
    },
    choice(row) {
      this.objEditInfo.Advs[this.choiceindex].ProId = row.Id;
      this.objEditInfo.Advs[this.choiceindex].StdId = row.std.Id;
      this.objEditInfo.Advs[this.choiceindex].ProName = row.Title;
      this.dialogTableVisible = false;
      console.log(this.objEditInfo.Advs[this.choiceindex]);
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getGoodsData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getGoodsData();
    },
    getGoodsData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      getskulist(p).then(res => {
        let arr = [];
        res.Data.map(v => {
          v.Standards.map(vs => {
            let o = JSON.parse(JSON.stringify(v));
            o.std = vs;
            arr.push(o);
          });
        });
        this.list = arr;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 0) {
        if (rowIndex == 0) {
          return {
            rowspan: row.Standards.length,
            colspan: 1
          };
        } else if (this.list[rowIndex - 1].Id === row.Id) {
          return [0, 0];
        } else {
          return {
            rowspan: row.Standards.length,
            colspan: 1
          };
        }
      }
    },
    save() {
      let f = false;
      this.objEditInfo.Advs.map(v => {
        if (v.Img == "" || v.ProId == "") {
          f = true;
        }
      });
      if (this.objEditInfo.Sharing1.Title == "") {
        this.$message.error("请输入推送文字");
        return;
      } else if (this.objEditInfo.Sharing1.Img == "") {
        this.$message.error("请上传推送图片");
        return;
      } else if (this.objEditInfo.Sharing2 == "") {
        this.$message.error("请选择朋友圈分享模板");
        return;
      } else if (this.objEditInfo.Advs.length < 1) {
        this.$message.error("请最少上传一张广告图片");
        return;
      } else if (f) {
        this.$message.error("请完善广告信息");
        return;
      }
      saveSupplierSettingsMngrSet({
        settings: this.objEditInfo
      }).then(res => {
        this.$message.success("编辑成功");
      });
    },
    jumpbigimg(img) {
      window.open(img, "_blank");
    },
    jumpimg(Link) {
      window.open(Link, "_blank");
    },
    getData() {
      getSupplierSettingsMngrGet().then(res => {
        res.Sharing2 = parseInt(res.Sharing2);

        if (res.Sharing1.Img) {
          if (res.Sharing1.Img.indexOf("/u/") != -1) {
            let newImage = res.Sharing1.Img.substring(
              res.Sharing1.Img.indexOf("/u/"),
              res.Sharing1.Img.length
            );
            let signUrl =  newImage;
            res.Sharing1.Img = signUrl;

            this.ShareImgShow = window.ali_oss_data.URL_IMG_SHOW +signUrl;
          } else {
            let signUrl =  res.Sharing1.Img;
            res.Sharing1.Img = signUrl;

            this.ShareImgShow = window.ali_oss_data.URL_IMG_SHOW +signUrl;
          }
        }
        res.Advs.forEach(item => {
          if (item.Img) {
            if (item.Img.indexOf("/u/") != -1) {
              let newImage = item.Img.substring(
                item.Img.indexOf("/u/"),
                item.Img.length
              );
              let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
              item.Img = newImage;
              this.$set(item, "showImg", signUrl);
            } else {
              let signUrl = window.ali_oss_data.URL_IMG_SHOW + item.Img;
              this.$set(item, "showImg", signUrl);
            }
          }
        });

        this.objEditInfo = res;
      });
    },
    gettemp() {
      getSharingTemplateGet({ type: 0 }).then(res => {
        this.temp = res;
      });
    },
    jumpbig() {
      window.open(this.ShareImgShow, "_blank");
    },
    beforeAvatarUpload(file, index) {
      this.myindex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
        this.objEditInfo.Advs[index].Img = "";
        this.$set(this.objEditInfo.Advs, index, "");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.objEditInfo.Advs[index].Img = "";
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload1(file, index) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG格式!");
        this.objEditInfo.Advs[index].Img = "";
        this.$set(this.objEditInfo.Advs, index, "");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.objEditInfo.Advs[index].Img = "";
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
.adv_item {
  border: 1px solid #eee;
  margin-bottom: 10px;
  width: 665px;
}
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
