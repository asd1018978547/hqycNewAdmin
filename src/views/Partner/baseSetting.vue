<template>
  <div class="content_box roleadd goodsManage sku storesetting">
    <div class="box_top">
      <el-button type="success" size="mini" @click="onsave">保存</el-button>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">营业执照</div>
        <div class="searchBox">
          <span
            class="inlineb"
          >说明：为遵循《电商法》要求，需上传营业执照，上传的营业执照会展示在店铺端小程序中图片要求：支持png、gif、jpg格式，大小不超过2M，只允许上传一张图片</span>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            <i>*</i>营业执照：
          </span>
          <div class="addskuuploadItem" style="margin-right: 8px;">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              action
              :http-request="uploadImg"
              accept="image/*"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :limit="1"
            >
              <img v-if="info.License && info.License != ''" :src="LicenseShow" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
            </el-upload>
          </div>
          <el-button
            v-if="info.License && info.License != ''"
            style="display:inline-block;z-index:9999"
            type="text"
            @click="jumpbig"
          >查看大图</el-button>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">支付配置</div>
        <div class="searchBox">
          <span class="inlineb">自有微信支付通道，需要配置微信相关公众号ID和密钥等。需要自己向微信申请开通。</span>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">支付状态：</span>
          <el-radio v-model="info.Pay.Status" label="1">启用</el-radio>
          <el-radio v-model="info.Pay.Status" label="0">禁用</el-radio>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">AppId：</span>
          <el-input
            class="inlineb w200"
            size="mini"
            v-model="info.Pay.AppId"
            placeholder="请输入AppId"
          ></el-input>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">Key：</span>
          <el-input class="inlineb w200" size="mini" v-model="info.Pay.Key" placeholder="请输入key"></el-input>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">MCHID：</span>
          <el-input
            class="inlineb w200"
            size="mini"
            v-model="info.Pay.MCHID"
            placeholder="请输入MCHID"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">运费规则</div>
        <div class="searchBox">
          <span class="inlineb">
            订单满
            <el-input
              size="mini"
              v-model="info.TransFee.OrderGreaterThan"
              class="w110"
              @change="changePrice"
            ></el-input>元包邮，否则每单收
            <el-input size="mini" class="w110" v-model="info.TransFee.FeeOfOne"></el-input>元
          </span>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">商品服务</div>
        <div class="searchBox">
          <span class="inlineb">服务在商品详情页显示，描述建议简单精确，8个字以内。</span>
        </div>
        <div class="searchBox" v-for="(item,index) in info.GoodsService" :key="index">
          <span class="inlineb w150">服务{{ index + 1 }}：</span>
          <el-input
            class="inlineb w200"
            :disabled="index == 0"
            size="mini"
            v-model="info.GoodsService[index]"
            placeholder="请填写内容"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">订单设置</div>
        <div class="searchBox">
          <span class="inlineb">
            自动取消：订单提交后
            <el-input size="mini" v-model="info.CPOrder.DaysAfterSubmit" class="w80"></el-input>分钟
          </span>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            自动签收：订单发货后
            <el-input size="mini" v-model="info.CPOrder.DaysAfterDelivery" class="w80"></el-input>天
          </span>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">结算设置</div>
        <div class="searchBox">
          <span class="inlineb">结算提示：订单签收6日后，商家会将佣金转入合伙人的微信零钱，请耐心等待哦~</span>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            结算时间：订单签收后
            <el-input size="mini" v-model="info.Settlement.DaysAfterSigned" class="w80"></el-input>天
          </span>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            自动结算：订单支付后
            <el-input
              :disabled="true"
              size="mini"
              v-model="info.Settlement.DaysAfterPaid"
              class="w80"
            ></el-input>天
          </span>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">打款方式</div>
        <div class="searchBox">
          <span class="inlineb">打款提醒： 结算后佣金金额可以实现自动转账到合伙人微信零钱。</span>
        </div>
        <div class="searchBox">
          <span class="inlineb">
            打款方式：
            <el-input size="mini" :disabled="true" v-model="paystr" class="w150"></el-input>
          </span>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">常见问题</div>
        <div class="searchBox">
          <span class="inlineb">问题类型： 合伙人须知</span>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">显示状态：</span>
          <el-radio v-model="info.FAQ4Partner.Status" :label="1">启用</el-radio>
          <el-radio v-model="info.FAQ4Partner.Status" :label="0">禁用</el-radio>
        </div>
        <el-button type="success" size="mini" class="add_btn" @click="addpartner">新增合伙人须知</el-button>
        <div class="faq_item" v-for="(item,index) in info.FAQ4Partner.FAQS" :key="index">
          <el-button type="text" class="faq_item_delete" size="mini" @click="delpartner(index)">删除</el-button>
          <div class="searchBox">
            <span class="inlineb w50">问题：</span>
            <el-input size="mini" v-model="info.FAQ4Partner.FAQS[index].Title" class="w250 inlineb"></el-input>
          </div>
          <div class="searchBox">
            <span class="inlineb w50">回答：</span>
            <el-input
              type="textarea"
              :rows="4"
              size="mini"
              v-model="info.FAQ4Partner.FAQS[index].Content"
              class="w250 inlineb"
            ></el-input>
          </div>
        </div>
        <div class="searchBox">
          <span class="inlineb">问题类型： 商品说明</span>
        </div>
        <div class="searchBox">
          <span class="inlineb w150">显示状态：</span>
          <el-radio v-model="info.FAQ4Goods.Status" :label="1">启用</el-radio>
          <el-radio v-model="info.FAQ4Goods.Status" :label="0">禁用</el-radio>
        </div>
        <el-button type="success" size="mini" class="add_btn" @click="addgoods">新增商品说明</el-button>
        <div class="faq_item" v-for="(item,index) in info.FAQ4Goods.FAQS" :key="'info2-'+index">
          <el-button type="text" class="faq_item_delete" size="mini" @click="delgoods(index)">删除</el-button>
          <div class="searchBox">
            <span class="inlineb w50">问题：</span>
            <el-input size="mini" v-model="info.FAQ4Goods.FAQS[index].Title" class="w250 inlineb"></el-input>
          </div>
          <div class="searchBox">
            <span class="inlineb w50">回答：</span>
            <el-input
              type="textarea"
              :rows="4"
              size="mini"
              v-model="info.FAQ4Goods.FAQS[index].Content"
              class="w250 inlineb"
            ></el-input>
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
  "baseSetting/" +
  moment().format("YYYYMM") +
  "/img/";
import {
  getSupplierSettingsBaseInfoGet,
  saveSupplierSettingsBaseInfoSet
} from "@/api/Partner/storeSetting";
export default {
  data() {
    return {
      paystr: "微信零钱",
      uploadfiles: [],
      LicenseShow: "",
      srcList: [],
      imgNames: [],
      info: {
        License: "",
        Settlement: {
          DaysAfterPaid: 28,
          DaysAfterSigned: 6
        },
        FAQ4Partner: {
          Status: 1,
          FAQS: [
            {
              Title: "",
              Content: ""
            }
          ]
        },
        FAQ4Goods: {
          Status: 1,
          FAQS: [
            {
              Title: "",
              Content: ""
            }
          ]
        },
        CPOrder: {
          DaysAfterDelivery: 7,
          DaysAfterSubmit: 30
        },
        GoodsService: [],
        TransFee: {
          FeeOfOne: 0,
          OrderGreaterThan: 0
        },
        Pay: {
          Key: "",
          MCHID: "",
          AppId: "",
          Status: "1"
        }
      }
    };
  },
  activated() {
    getSupplierSettingsBaseInfoGet({ whichSetting: 0 }).then(res => {
      if (res.GoodsService.length < 3) {
        let l = res.GoodsService.length;
        for (let index = 0; index < 3 - l; index++) {
          res.GoodsService.push("");
        }
      }
      if (res.FAQ4Partner.FAQS.length == 0) {
        res.FAQ4Partner.FAQS.push({
          Title: "",
          Content: ""
        });
      }
      if (res.FAQ4Goods.FAQS.length == 0) {
        res.FAQ4Goods.FAQS.push({
          Title: "",
          Content: ""
        });
      }
      let signUrl = window.ali_oss_data.URL_IMG_SHOW + res.License;
      this.LicenseShow = signUrl;
      this.info = res;
    });
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
        this.info.License = imgFileNameList[0];
        this.LicenseShow = signUrl;
        this.srcList.push(signUrl);
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
    delpartner(index) {
      this.info.FAQ4Partner.FAQS.splice(index, 1);
    },
    delgoods(index) {
      this.info.FAQ4Goods.FAQS.splice(index, 1);
    },
    changePrice(v) {
      this.info.GoodsService[0] = "订单满" + v + "元包邮";
      this.$forceUpdate();
    },
    onsave() {
      saveSupplierSettingsBaseInfoSet({
        settings: this.info
      }).then(res => {
        this.$message.success("编辑成功");
      });
    },
    addpartner() {
      this.info.FAQ4Partner.FAQS.push({
        Title: "",
        Content: ""
      });
    },
    addgoods() {
      this.info.FAQ4Goods.FAQS.push({
        Title: "",
        Content: ""
      });
    },
    jumpbig() {
      window.open(this.LicenseShow, "_blank");
    },
    beforeAvatarUpload(file, index) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
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
.add_btn {
  margin-left: 10px;
  margin-bottom: 10px;
}
.faq_item {
  width: 500px;
  border: 1px solid #eeeeee;
  margin-left: 10px;
  margin-bottom: 10px;
  position: relative;
}
.faq_item_delete {
  color: #ff0000;
  position: absolute;
  right: 5px;
  top: 5px;
}
.w50 {
  width: 50px;
  text-align: right;
}
.w80 {
  width: 50px;
  margin: 0 10px;
}
.w110 {
  width: 100px;
  margin: 0 10px;
}
.w150 {
  width: 100px;
  text-align: right;
}
.w250 {
  width: 250px;
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
