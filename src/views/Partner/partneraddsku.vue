<template>
  <div id="paddsku" class="content_box roleadd addGoods addsku sku">
    <el-button type="success" @click="onadd" style="margin-bottom:20px" size="mini">提交保存</el-button>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="info mb10">
        <div class="infoTitle">基础信息</div>
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="分类" prop="CategoryId">
            <div v-if="this.name">{{ this.name }}</div>
            <el-select
              filterable
              v-else
              size="mini"
              v-model="ruleForm.CategoryId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in CategoryList"
                :key="item.Id"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="名称" prop="Name">
            <el-input type="text" v-model="ruleForm.Name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="卖点" prop="ShortDesc">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="ruleForm.ShortDesc"
              placeholder="请输入卖点"
              maxlength="120"
            ></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="SN" prop="SN">
            <el-input type="text" v-model="ruleForm.SN" placeholder="请输入SN"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="体积" prop="BoxVolume">
            <el-input type="text" v-model.number="ruleForm.BoxVolume" placeholder="请输入体积"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="贸易类型" prop="TradeType">
            <el-select
              filterable
              size="mini"
              v-model="ruleForm.TradeType"
              placeholder="请选择"
              @change="gettemp"
            >
              <el-option label="跨境直邮" :value="1"></el-option>
              <el-option label="保税备货" :value="2"></el-option>
              <el-option label="一般贸易" :value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            size="mini"
            class="w200"
            label="税率"
            prop="TaxRate"
            v-if="ruleForm.TradeType!=3"
          >
            <el-input type="text" v-model.number="ruleForm.TaxRate" placeholder="请输入税率"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="原产地" prop="OriginName">
            <el-select
              filterable
              size="mini"
              v-model="ruleForm.OriginName"
              placeholder="请选择"
              @change="getycd"
            >
              <el-option
                v-for="(item,index) in ycdArray"
                :key="index"
                :label="item.NameCN"
                :value="item.Code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="运费模板" prop="TransFeeTemplateId">
            <el-select
              size="mini"
              filterable
              v-model="ruleForm.TransFeeTemplateId"
              placeholder="请选择"
              @change="mes"
            >
              <el-option
                v-for="(item,index) in tempList"
                :key="index"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
            <span style="color:#666">运费模板需先选择贸易类型</span>
            <!-- 运费模板详情 -->
            <div v-if="expInfo ">
              <p v-if="expInfo.Country">
                发货地：
                <span
                  style="color:#ff0000"
                >{{ expInfo.Country + expInfo.Province + expInfo.City + expInfo.District }}</span>
              </p>
              <div v-if="expInfo.IsCharge != 0 && expInfo">
                <div v-for="(i,index) in expInfo.items" :key="index">
                  <p>
                    运送至：
                    <span
                      style="color:#ff0000"
                    >{{ i.Areas.length == 0 ? i.ExpressTo : getCityStr(i.Areas)}}</span>
                  </p>
                  <p>
                    {{ i.IsDefault ? '默认运费' : '运费' }}
                    <span
                      style="color:#ff0000"
                    >{{ i.FirstNumber }}{{ expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>/内
                    <span style="color:#ff0000">{{ i.FirstTransFee }}</span>元，每增加
                    <span
                      style="color:#ff0000"
                    >{{ i.SecondNumber }}{{ expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>，增加运费
                    <span style="color:#ff0000">{{ i.SecondTransFee }}</span>元
                  </p>
                </div>
              </div>
              <div v-else style="color: #ff0000">包邮</div>
            </div>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="品牌" prop="BrandId">
            <el-select size="mini" filterable v-model="ruleForm.BrandId" placeholder="请选择">
              <el-option
                v-for="item in BrandList"
                :key="item.Id"
                :label="item.Brand"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="单位" prop="UnitId">
            <el-select filterable size="mini" v-model="ruleForm.UnitId" placeholder="请选择">
              <el-option
                v-for="item in UnitList"
                :key="item.Id"
                :label="item.Unit"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="图片" prop="Images" class="upload">
            <h5>支持.jpg .jpeg .png格式图片，大小2M以内，最多上传5张图片</h5>
            <div class="addskuupload">
              <div
                class="addskuuploadItem"
                style="margin-right: 8px;"
                v-for="(item, index) in ruleForm.Images"
                :key="index"
              >
                <el-upload
                  :ref="'upload' + index"
                  accept="image/*"
                  class="avatar-uploader"
                  action
                  :http-request="uploadImg2"
                  :show-file-list="false"
                  :before-upload="(res) => { return beforeAvatarUpload2(res, index) }"
                  :limit="1"
                >
                  <template v-if="item != ''">
                    <img :src="Images[index]" class="avatar" />
                    <i class="delImage" @click.stop="delImage(item, index)">删除图片</i>
                  </template>
                  <i v-else class="el-icon-plus avatar-uploader-icon">点击上传图片</i>
                </el-upload>
              </div>
            </div>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="展示到" prop="IsRecommended">
            <el-checkbox v-model="ruleForm.IsRecommended">今日热销</el-checkbox>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10">
        <div class="infoTitle">SKU规格</div>
        <div class="infoDesc">
          <div v-for="(pitem, index) in propList" :key="index">
            <template>
              <p style="margin-top:0;margin-bottom:18px;">
                <span style="display:inline-block;width:100px;text-align:right">请选择规格：</span>
                <el-select
                  filterable
                  class="w300"
                  @change="(val) => { changeProp(val,index) }"
                  size="mini"
                  v-model="pitem.propval"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pitem.prop"
                    :key="item.Id"
                    :label="item.Standard"
                    :value="item.Id"
                  ></el-option>
                </el-select>
                <el-button class="ml10" size="mini" type="primary" @click="addProp(index)">新增规格</el-button>
                <el-button class="ml10" size="mini" type="danger" @click="delProp(index)">删除规格</el-button>
              </p>
              <p style="margin-top:0;margin-bottom:18px;">
                <span style="display:inline-block;width:100px;text-align:right">选择规格值：</span>
                <el-select
                  @change="propchildvalchange"
                  :disabled="pitem.propval == null"
                  class="w800"
                  filterable
                  size="mini"
                  multiple
                  v-model="pitem.propselectedval"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pitem.propchildval"
                    :key="item.Id"
                    :label="item.Val"
                    :value="item.Id"
                  ></el-option>
                </el-select>
                <el-button
                  class="ml10"
                  size="mini"
                  @click="showValDig(index)"
                  type="primary"
                  :disabled="pitem.propval == null"
                >新增规格值</el-button>
              </p>
            </template>
          </div>
          <p style="margin-top:0;margin-bottom:18px;">
            <el-button class="ml10" size="mini" type="primary" @click="addnewprop">添加规格</el-button>
            <el-button class="ml10" size="mini" type="success" @click="saveProp">保存规格</el-button>
          </p>
        </div>
      </div>
      <div class="info mb10" style="padding-bottom:20px;">
        <div class="infoTitle">商品列表</div>
        <div class="infoDesc upload">
          <el-table :data="bhlist" border fit highlight-current-row style="width: 100%">
            <el-table-column label="图片" align="center" width="150">
              <template slot-scope="scope">
                <div class="addskuupload">
                  <div class="addskuuploadItem" style="border: 1px dashed #ebeef5">
                    <el-upload
                      :ref="'upload_' + scope.$index"
                      class="avatar-uploader"
                      action
                      accept="image/*"
                      :http-request="uploadImg"
                      :show-file-list="false"
                      :before-upload="(res) => {  return beforeAvatarUpload(res, scope.$index) }"
                      :limit="1"
                    >
                      <img v-if="scope.row.Images[0]" :src="scope.row.showImg" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon">商品主图</i>
                    </el-upload>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="关联库房商品" align="center" width="250">
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-input
                    v-model="scope.row.NameCN"
                    @focus="getGoods(scope)"
                    size="mini"
                    placeholder="请选择商品"
                    suffix-icon="el-icon-search"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="虚拟库存" align="center" width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.Amount"
                  :disabled="ruleForm.TradeType!=3"
                  class="edit-input"
                  size="mini"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="最低零售价" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.MinPrice4Retail" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="建议零售价" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Price4Retail" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="最高零售价" align="center" width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.MaxPrice4Retail" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="重量" align="center" width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.GrossWeight"
                  :disabled="ruleForm.TradeType!=3"
                  class="edit-input"
                  size="mini"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="佣金" align="center" width="250">
              <template slot-scope="scope">
                <el-select
                  style="width:100px"
                  v-model="scope.row.CommissionType"
                  filterable
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option label="金额" :value="0"></el-option>
                  <el-option label="百分比" :value="1"></el-option>
                </el-select>
                <el-input
                  style="width:80px;"
                  v-model="scope.row.Commission"
                  class="edit-input"
                  size="mini"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="规格信息" align="center">
              <template slot-scope="scope">
                <template v-for="item in scope.row.StdDetail">
                  <el-tag :key="item.Id" style="margin-right:5px">{{ item.Val }}</el-tag>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="info mb10">
        <div class="infoTitle">商品详情</div>
        <div class="infoDesc upload">
          <el-form-item size="mini" label="详情" prop="DetailInfo">
            <div class="editor-container">
              <Tinymce :height="400" ref="editor" v-model="ruleForm.DetailInfo" />
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10">
        <div class="infoTitle">商品服务</div>
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="显示状态" prop="ServiceStatus">
            <el-radio-group v-model="ruleForm.ServiceStatus">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="mini" class="w350 gdservice" label="商品服务" prop="sert">
            <el-checkbox-group v-model="ruleForm.ServiceContent">
              <el-checkbox v-for="(item,index) in GoodsService" :key="index" :label="index">
                <el-input
                  type="text"
                  class="w300"
                  v-model="GoodsService[index]"
                  placeholder="请输入服务"
                ></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU规格"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title lh40">规格名称：</div>
          <div class="info_right">
            <el-input class="inputClass lh40" v-model="propName" placeholder="请输入规格名称" size="mini"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSpec">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU规格值"
      :visible.sync="ValdialogVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title lh40">规格值名称：</div>
          <div class="info_right">
            <el-input
              class="inputClass lh40"
              v-model="propValName"
              placeholder="请输入规格值名称"
              size="mini"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="ValdialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSpecVal">确 定</el-button>
      </span>
    </el-dialog>
    <GoodsDialog
      :goodsVisible="goodsVisible"
      :TradeType="ruleForm.TradeType"
      @choice="choiceGoods"
      @close="onclose"
    ></GoodsDialog>
  </div>
</template>
<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "partnerSku/" +
  moment().format("YYYYMM") +
  "/img/";
import { getCategoryAll } from "@/api/Partner/sku";
import GoodsDialog from "@/components/Goods/GoodsDialogx.vue";
import { getSupplierSettingsBaseInfoGet } from "@/api/Partner/storeSetting";
import Tinymce from "@/components/Tinymce";
import descartes from "@/utils/descartes";
import {
  getBrandList,
  getUnitList,
  getStandardList,
  getStandardVals,
  addSkuSpecItem,
  addSkuSpec,
  addSku,
  getSkuInfo,
  editSkuInfo
} from "@/api/Partner/skuadd";
import { getExpTemp } from "@/api/sku/addsku";
import { getOriginList } from "@/api/brand/origin";
import worldoptions from "../../../static/js/addressJson";

const stdTpl = () => ({
  SN: "",
  Amount: "",
  Commission: "",
  CommissionType: 0,
  RelationSkuId: "",
  Price4Retail: "",
  GrossWeight: "",
  Images: [],
  StdDetail: []
});
export default {
  components: { Tinymce, GoodsDialog },
  data() {
    const checkImage = (rule, value, callback) => {
      let f = false;
      this.ruleForm.Images.map(v => {
        if (v != "") {
          f = true;
        }
      });
      if (!f) {
        callback(new Error("请至少上传一张商品主图"));
      } else {
        callback();
      }
    };
    return {
      areaOptions: {
        value: "name",
        label: "name",
        children: "children"
      },
      areaData: worldoptions,
      name: this.$route.query.name, //设置默认分类
      expInfo: {},
      spztIndex: "",
      GoodsService: [],
      Images: [],
      uploadfiles: [],
      imgNames: [],
      uploadfiles2: [],
      imgNames2: [],
      tempList: [],
      id: "",
      dialogVisible: false,
      ValdialogVisible: false,
      propValName: "",
      deleteOssImages: [],
      propName: "",
      ycdArray: [],
      bhlist: [],
      goodsVisible: false,
      rules: {},
      sProp: {},
      defprop: [],
      propList: [],
      CategoryList: [],
      ftIndex: "",
      BrandList: [],
      UnitList: [],
      backproplist: [],
      ruleForm: {
        Images: ["", "", "", "", ""],
        DetailInfo: "",
        OriginCode: "",
        OriginName: "",
        ServiceStatus: 1,
        ServiceContent: [],
        TransFeeTemplateId: "",
        CategoryId: "", //设置默认分类
        IsRecommended: ""
      },
      rules: {
        BoxVolume: { required: true, message: "请输入体积" },
        TaxRate: { required: true, message: "请输入税率" },
        TransFeeTemplateId: { required: true, message: "请选择运费模板" },
        CategoryId: { required: true, message: "请选择分类" },
        Name: { required: true, message: "请输入名称" },
        ShortDesc: { required: true, message: "请输入卖点" },
        SN: { required: true, message: "请输入SN" },
        TradeType: { required: true, message: "请选择交易类型" },
        OriginName: { required: true, message: "请选择原产地" },
        BrandId: { required: true, message: "请选择品牌" },
        UnitId: { required: true, message: "请选择单位" },
        DetailInfo: { required: true, message: "请填写详情" },
        ServiceStatus: { required: true, message: "请选择显示状态" },
        DetailInfo: { required: true, message: "请填写详情" },
        Images: {
          required: true,
          validator: checkImage
        }
      },
      addspecindex: -1
    };
  },
  mounted() {
    let self = this;
    let arry = [];
    getOriginList({ InUse: 1 }).then(res => {
      res.Data.forEach(element => {
        arry.push({
          NameCN: element.NameCN,
          Code: element.Code
        });
      });
      self.ycdArray = arry;
    });
  },
  activated() {
    this.bhlist = [];
    this.getCategoryList();
    this.getBrandList();
    this.getUnitList();
    this.getStandardList();
    this.getServiceList();
    this.$nextTick(() => {
      if (this.$route.query.id) {
        this.getInfo();
      }
    });
  },
  methods: {
    //商品主图上传 spztIndex
    uploadImg(option) {
      const preDelPic = JSON.parse(JSON.stringify(this.bhlist[this.spztIndex]))
        .Images[0];
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
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
      setTimeout(() => {
        const a = JSON.parse(JSON.stringify(this.bhlist[this.spztIndex]));
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          a.Images[0] = imgFileNameList[0];
          this.$set(a, "showImg", signUrl);
          this.$set(this.bhlist, this.spztIndex, a);
          this.$refs["upload_" + this.spztIndex].clearFiles();
        });
      }, 500);
    },
    uploadImg2(option) {
      const preDelPic = JSON.parse(JSON.stringify(this.ruleForm.Images))[
        [this.ftIndex]
      ];
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
      this.uploadfiles2 = [];
      this.imgNames2 = [];
      this.uploadfiles2.push(option.file);
      this.imgNames2.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames2.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles2.length; i++) {
        this.uploadImgToOSS(this.uploadfiles2[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          const a = JSON.parse(JSON.stringify(this.ruleForm.Images));
          a[this.ftIndex] = imgFileNameList[0];
          this.Images[this.ftIndex] = signUrl;
          this.ruleForm.Images = a;
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
    mes(v) {
      this.tempList.map(i => {
        if (i.Id == v) {
          this.expInfo = i;
        }
      });
    },
    getCityStr(row) {
      let str = "";
      row.map(v => {
        if (v.IsAllSelect) {
          str += v.Name + ",";
        } else {
          v.ChildArea.map(item => {
            str += item.Name + ",";
          });
        }
      });
      return str.substring(0, str.length - 1);
    },
    getInfo() {
      getSkuInfo({ id: this.$route.query.id }).then(res => {
        this.id = res.Id;
        getExpTemp({ orderTypeId: res.TradeType }).then(data => {
          this.tempList = data;
          if (res.Images.length < 5) {
            for (let i = 0, imgl = res.Images.length; i < 5 - imgl; i++) {
              res.Images.push("");
            }
          }
          let gs = [];
          res.ServiceContent.map((v, index) => {
            gs.push(index);
          });
          if (res.ServiceContent.length < 5) {
            for (
              let i = 0, imgl = res.ServiceContent.length;
              i < 3 - imgl;
              i++
            ) {
              res.ServiceContent.push("");
            }
          }
          this.GoodsService = res.ServiceContent;
          res.ServiceContent = gs;
          let pl = [];
          let gpflag = false;
          res.GrpPanel.map((v, index) => {
            pl.push({
              prop: JSON.parse(JSON.stringify(this.defprop)),
              propval: v.StdId,
              propselectedval: [],
              propchildval: null
            });
            v.StdVals.map(vst => {
              pl[index].propselectedval.push(vst.Id);
            });
            getStandardVals({ id: v.StdId }).then(stdval => {
              pl[index].propchildval = stdval;
              if (index == res.GrpPanel.length - 1) {
                gpflag = true;
              }
            });
          });
          let setin = setInterval(() => {
            if (gpflag) {
              clearInterval(setin);
              this.propList = pl;
              this.$forceUpdate();
              res.StandardIds.map(v => {
                let a = [];
                pl.map(vp => {
                  let stdv = v.StdValIds.split(",");
                  stdv.map(v1 => {
                    vp.propchildval.map(v2 => {
                      if (v1 == v2.Id) {
                        a.push(v2);
                      }
                    });
                  });
                });
                this.$nextTick(() => {
                  this.bhlist.push({
                    Amount: v.Amount,
                    Id: v.Id,
                    Commission: v.Commission,
                    CommissionType: v.CommissionType,
                    RelationSkuId: v.RelationSkuId,
                    Price4Retail: v.Price4Retail,
                    GrossWeight: v.GrossWeight,
                    MaxPrice4Retail: v.MaxPrice4Retail,
                    MinPrice4Retail: v.MinPrice4Retail,
                    Images: v.Images,
                    NameCN: v.ProInfos[0].ProName,
                    StdDetail: a,
                    ProInfos: [
                      {
                        ProId: v.ProInfos[0].ProId,
                        ProName: v.ProInfos[0].ProName,
                        isShowProList: true,
                        Price4Retail: v.ProInfos[0].Price4Retail,
                        ProCount: 1
                      }
                    ]
                  });
                  this.bhlist.forEach(element => {
                    if (element.Images[0].indexOf("/u/") != -1) {
                      let newImage = element.Images[0].substring(
                        element.Images[0].indexOf("/u/"),
                        element.Images[0].length
                      );
                      let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
                      this.$set(element, "showImg", signUrl);
                    } else {
                      let signUrl =
                        window.ali_oss_data.URL_IMG_SHOW + element.Images[0];
                      this.$set(element, "showImg", signUrl);
                    }
                  });
                });
              });
              this.ruleForm = JSON.parse(JSON.stringify(res));
              this.ruleForm.Images.forEach(element => {
                if (element.indexOf("/u/") != -1) {
                  let newImage = element.substring(
                    element.lastIndexOf("/u/"),
                    element.length
                  );
                  let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
                  this.Images.push(signUrl);
                } else {
                  let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
                  this.Images.push(signUrl);
                }
              });
              this.mes(this.ruleForm.TransFeeTemplateId); //设置默认运费模板
              this.ruleForm.IsRecommended =
                res.IsRecommended == 1 ? true : false;
            }
          }, 700);
        });
      });
    },
    //删除oss上的图片
    deleteOssPic(picArr) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function deleteMulti() {
        try {
          let result = await client.deleteMulti(picArr, {
            quiet: true
          });
          console.log(result);
        } catch (e) {
          console.log(e);
        }
      }

      deleteMulti();
    },
    onadd() {
      let bhf = true,
        fl = true;
      this.bhlist.map((v, i) => {
        if (
          v.Images.length === 0 ||
          v.RelationSkuId === "" ||
          v.Amount === "" ||
          v.Price4Retail === "" ||
          v.GrossWeight === "" ||
          v.Commission === "" ||
          v.MinPrice4Retail === "" ||
          v.MaxPrice4Retail === ""
        ) {
          bhf = false;
        }
        var re = /^[0-9]+.?[0-9]*$/;
        if (!re.test(v.MinPrice4Retail)) {
          this.$message.error(`请检查第${i + 1}个商品，请输入正确的最低零售价`);
          fl = false;
        }
        if (0.01 > v.MinPrice4Retail) {
          this.$message.error(`请检查第${i + 1}个商品，最低零售价不能小于0.01`);
          fl = false;
        }
        if (0.01 > Number(v.MinPrice4Retail)) {
          this.$message.error(`请检查第${i + 1}个商品，最低零售价不能小于0.01`);
          fl = false;
        }
        if (Number(v.MinPrice4Retail) > Number(v.Price4Retail)) {
          this.$message.error(
            `请检查第${i + 1}个商品，最低零售价不能超过建议零售价`
          );
          fl = false;
        }

        if (!re.test(v.MaxPrice4Retail)) {
          this.$message.error(`请检查第${i + 1}个商品，请输入正确的最高零售价`);
          fl = false;
        }

        if (Number(v.Price4Retail) > Number(v.MaxPrice4Retail)) {
          this.$message.error(
            `请检查第${i + 1}个商品，最高零售价不能小于建议零售价`
          );
          fl = false;
        }

        if (v.MaxPrice4Retail > 9999.99) {
          this.$message.error(
            `请检查第${i + 1}个商品，最高零售价不能大于9999.99`
          );
          fl = false;
        }
        if (Number(v.MaxPrice4Retail) > 9999.99) {
          this.$message.error(
            `请检查第${i + 1}个商品，最高零售价不能大于9999.99`
          );
          fl = false;
        }
        if (
          v.CommissionType == 0 &&
          Number(v.Commission) > Number(v.Price4Retail)
        ) {
          this.$message.error(
            `请检查第${i + 1}个商品，佣金金额不能大于建议零售价`
          );
          fl = false;
        }
        if (v.CommissionType == 1 && v.Commission > 100) {
          this.$message.error(
            `请检查第${i + 1}个商品，佣金方式为百分比时不能大于100%`
          );
          fl = false;
        }
        if (v.CommissionType == 1 && Number(v.Commission) > 100) {
          this.$message.error(
            `请检查第${i + 1}个商品，佣金方式为百分比时不能大于100%`
          );
          fl = false;
        }
      });
      if (!bhf || this.bhlist.length == 0) {
        this.$message.error("请完善商品列表信息");
        return;
      }

      if (!fl) return;
      this.$refs.ruleForm.validate().then(res => {
        if (!res) {
          this.$message.error("请完善信息在进行提交");
          return;
        }
        let par = JSON.parse(JSON.stringify(this.ruleForm));
        this.BrandList.map(v => {
          if (v.Id == par.BrandId) {
            par.Brand = v.Brand;
          }
        });
        this.UnitList.map(v => {
          if (v.Id == par.UnitId) {
            par.Unit = v.Unit;
          }
        });
        par.IsRecommended = par.IsRecommended ? 1 : 0;
        let intreg = /^\d+(\.\d+)?$/;
        // let intreg = /^\+?[1-9][0-9]*$/;
        let floatreg = /(^[0-9]*(.[0-9]+)?)$/;
        if (!intreg.test(par.BoxVolume)) {
          this.$message.error("请输入正确的体积");
          return;
        }
        if (
          this.ruleForm.TradeType != 3 &&
          (!floatreg.test(par.TaxRate) || par.TaxRate < 0 || par.TaxRate > 100)
        ) {
          this.$message.error("请输入正确的税率");
          return;
        }
        let f = false;
        for (let index = 0; index < this.bhlist.length; index++) {
          const element = this.bhlist[index];
          if (!intreg.test(element.Amount)) {
            this.$message.error("请为商品设置正确的虚拟库存");
            f = true;
            return;
          }
          if (
            !floatreg.test(element.Price4Retail) ||
            element.Price4Retail < 0.001
          ) {
            this.$message.error("请为商品设置正确的零售价");
            f = true;
            return;
          }
          if (
            !floatreg.test(element.GrossWeight) ||
            element.GrossWeight < 0.001
          ) {
            this.$message.error("请为商品设置正确的重量");
            f = true;
            return;
          }
          if (
            !floatreg.test(element.Commission) ||
            element.Commission < 0.001
          ) {
            this.$message.error("请为商品设置正确的佣金");
            f = true;
            return;
          }
        }
        if (f) return;
        let imgarr = [];
        par.Images.map(v => {
          if (v != "") {
            imgarr.push(v);
          }
        });
        par.Images = imgarr;
        par.GrpPanel = [];
        this.propList.map((v, vi) => {
          par.GrpPanel.push({
            StdId: v.propval,
            StdName: v.propname,
            Weight: 1,
            StdVals: []
          });
          v.propchildval.map(vv => {
            v.propselectedval.map(svv => {
              if (svv == vv.Id) {
                par.GrpPanel[vi].StdVals.push(vv);
              }
            });
          });
        });
        par.GrpPanel.forEach(element => {
          if (element.StdName) {
          } else {
            element.StdVals.forEach(ele => {
              element.StdName = ele.StdName;
            });
          }
        });
        par.StandardIds = [];
        this.bhlist.map((v, vi) => {
          par.StandardIds.push({
            StdValIds: "",
            StdName: "",
            Id: v.Id,
            Amount: v.Amount,
            isShowProList: false,
            Price4Retail: v.Price4Retail,
            Images: v.Images,
            GrossWeight: v.GrossWeight,
            RelationSkuId: v.RelationSkuId,
            Commission: v.Commission,
            CommissionType: v.CommissionType,
            MaxPrice4Retail: Number(v.MaxPrice4Retail),
            MinPrice4Retail: Number(v.MinPrice4Retail),
            ProInfos: []
          });
          let s1 = "";
          let s2 = "";
          v.StdDetail.map(vstd => {
            s1 += vstd.Id + ",";
            s2 += vstd.StdName + "：" + vstd.Val + "；";
          });
          par.StandardIds[vi].StdValIds = s1.substring(0, s1.length - 1);
          par.StandardIds[vi].StdName = s2.substring(0, s2.length - 1);
          v.ProInfos.map(vp => {
            par.StandardIds[vi].ProInfos.push({
              ProId: vp.Id,
              ProName: vp.ProName,
              isShowProList: true,
              Price4Retail: v.Price4Retail,
              MaxPrice4Retail: Number(v.MaxPrice4Retail),
              MinPrice4Retail: Number(v.MinPrice4Retail),
              ProCount: 1
            });
          });
        });
        let sarr = [];
        this.GoodsService.map((v, i) => {
          par.ServiceContent.map(vs => {
            if (vs == i) {
              sarr.push(v);
            }
          });
        });
        par.ServiceContent = sarr;
        if (this.$route.query.id) {
          editSkuInfo(par).then(res => {
            this.deleteOssPic(this.deleteOssImages);
            this.$message.success("编辑成功");
            this.$router.back(-1);
            this.bhlist = [];
          });
        } else {
          addSku(par).then(res => {
            this.deleteOssPic(this.deleteOssImages);
            this.$message.success("新增成功");
            this.$router.back(-1);
          });
        }
      });
    },
    gettemp() {
      this.ruleForm.TransFeeTemplateId = "";
      getExpTemp({ orderTypeId: this.ruleForm.TradeType }).then(res => {
        this.tempList = res;
      });
    },
    //选择原产地
    getycd(val) {
      const ycdObj = this.ycdArray.find(item => {
        return item.Code == val;
      });
      this.ruleForm.OriginCode = ycdObj.Code;
      this.ruleForm.OriginName = ycdObj.NameCN;
    },
    getServiceList() {
      getSupplierSettingsBaseInfoGet({ whichSetting: 3 }).then(res => {
        this.GoodsService = res.GoodsService;
      });
    },
    getGoods(index) {
      this.bhIndex = index.$index;
      this.goodsVisible = true;
      sessionStorage.setItem("tradeTypeGoodDialog", this.ruleForm.TradeType);
    },
    choiceGoods(data) {
      const a = JSON.parse(JSON.stringify(this.bhlist[this.bhIndex]));
      a.NameCN = data.ProName;
      a.Amount = data.Amount;
      a.GrossWeight = data.GrossWeight;
      a.SN = data.SN;
      a.isShowProList = false;
      a.ProInfos = [data];
      a.GoodsAmount = 1;
      a.RelationSkuId = data.Id;
      this.$set(this.bhlist, this.bhIndex, a);
      this.goodsVisible = false;
    },
    onclose() {
      this.goodsVisible = false;
    },
    addSpec() {
      if (this.propName !== "") {
        addSkuSpec({ standard: this.propName }).then(res => {
          this.$message.success("新增成功");
          getStandardList().then(res => {
            this.propList.map(v => {
              v.prop = res;
            });
            this.defprop = res;
            this.propList[this.addspecindex].prop.map(v => {
              if (v.Standard == this.propName) {
                this.propList[this.addspecindex].propchildval = v.Vals;
                this.propList[this.addspecindex].propval = v.Id;
                this.sProp.Id = v.Id;
                this.sProp.Standard = v.Standard;
                this.sProp.index = this.addspecindex;
              }
            });
            this.propName = "";
            this.dialogVisible = false;
          });
        });
      } else {
        this.$message.error("请输入规格名称");
      }
    },
    addSpecVal() {
      if (this.propValName.trim() === "") {
        this.$message.error("请输入规格值名称");
        return;
      }
      addSkuSpecItem({
        pid: this.sProp.Id,
        Val: this.propValName
      }).then(res => {
        this.$message.success("新增成功");
        getStandardVals({ id: this.sProp.Id }).then(data => {
          this.$forceUpdate();
          this.propList[this.sProp.index].prop.map(v => {
            if (v.Id == this.sProp.Id) {
              this.propList[this.sProp.index].propchildval = data;
            }
          });
          this.propValName = "";
          this.$forceUpdate();
          this.ValdialogVisible = false;
        });
      });
    },
    addnewprop() {
      if (this.propList.length > 2) {
        this.$message.error("最多支持3组规格");
        return;
      }
      this.propList.push({
        prop: JSON.parse(JSON.stringify(this.defprop)),
        propval: null,
        propselectedval: [],
        propchildval: null
      });
    },
    saveProp() {
      let isseleteall = true;
      this.propList.map(v => {
        if (v.propselectedval.length == 0) {
          isseleteall = false;
        }
      });
      if (!isseleteall) {
        this.$message.error("请完善规格信息");
        return;
      }
      let karr = [];
      this.propList.map(v => {
        let oa = [];
        v.propchildval.map(cv => {
          v.propselectedval.map(scv => {
            if (cv.Id == scv) {
              oa.push(cv);
            }
          });
        });
        karr.push(oa);
      });
      karr = descartes(karr);
      // let a = [];
      let a = this.bhlist;
      karr.map(v => {
        let tpl = stdTpl();
        if (this.propList.length > 1) {
          tpl.StdDetail.push(...v);
        } else {
          tpl.StdDetail.push(v);
        }

        if (a.length < karr.length) {
          // 选择列表有，数组没有，添加
          if (JSON.stringify(a).includes(JSON.stringify(tpl.StdDetail))) {
          } else {
            a.push(tpl);
          }
        } else if (a.length > karr.length) {
          // 选择规格列表没有，删除数组
          a.map((ite, iteIndex) => {
            ite.StdDetail.map(ites => {
              if (!JSON.stringify(v).includes(JSON.stringify(ites))) {
                a.splice(iteIndex, 1);
              } else {
              }
            });
          });
        } else {
          return false;
        }
      });
      this.backproplist = JSON.parse(JSON.stringify(this.propList));
      this.$nextTick(() => {
        this.bhlist = a;
      });
    },
    getArrDifference(a1, a2) {
      let obj = {};
      let arr = [];
      let arr2 = [];
      a2.map(v1 => {
        obj[v1] = true;
      });
      a1.map(v2 => {
        if (obj[v2]) {
          arr.push(v2);
        } else {
          arr2.push(v2);
        }
      });
      let deletearr = [];
      a2.map(v2 => {
        let f = false;
        arr.map(va => {
          if (va == v2) f = true;
        });
        if (!f) deletearr.push(v2);
      });
      let o = {};
      o.add = arr2;
      o.del = deletearr;
      o.def = arr;
      return o;
    },
    addProp(v) {
      this.addspecindex = v;
      this.dialogVisible = true;
    },
    delProp(index) {
      this.$confirm("此操作将删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.propList.splice(index, 1);
        this.$nextTick(() => {
          this.saveProp();
        });
      });
    },
    showValDig(index) {
      this.propList[index].prop.map(v => {
        if (v.Id == this.propList[index].propval) {
          this.sProp.Id = v.Id;
          this.sProp.Standard = v.Standard;
          this.sProp.index = index;
        }
      });
      this.ValdialogVisible = true;
    },
    changeProp(val, index) {
      let f = false;
      this.propList.map((v, i) => {
        if (v.propval == val && i != index) {
          f = true;
        }
      });
      if (f) {
        this.$message.error("不可选择已有的规格");
        this.propList[index].propval = null;
        this.propList[index].propselectedval = [];
        return;
      }
      let obj = JSON.parse(JSON.stringify(this.propList[index]));
      let n = "";
      obj.prop.map(v => {
        if (v.Id == val) {
          getStandardVals({ id: v.Id }).then(res => {
            obj.propchildval = res;
            n = v.Standard;
            obj.propname = v.Standard;
          });
        }
      });
      obj.propselectedval = [];
      this.sProp.Id = obj.propval;
      this.sProp.Standard = n;
      this.sProp.index = index;
      this.$set(this.propList, index, obj);
    },
    propchildvalchange(v) {
      this.$forceUpdate();
    },
    getStandardList() {
      getStandardList().then(res => {
        this.defprop = res;
      });
    },
    getCategoryList() {
      getCategoryAll().then(res => {
        this.CategoryList = res;
      });
    },
    getBrandList() {
      getBrandList().then(res => {
        this.BrandList = res;
      });
    },
    getUnitList() {
      getUnitList().then(res => {
        this.UnitList = res;
      });
    },
    delImage(item, index) {
      this.$refs["upload" + index][0].clearFiles();
      this.ruleForm.Images[index] = "";
      this.$set(this.Images, this.Images[index], "");
      this.Images[index] = "";
      if (item) {
        this.deleteOssImages.push(item);
      }
    },
    beforeAvatarUpload2(file, index) {
      this.ftIndex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.$refs["upload" + index][0].clearFiles();
        this.$set(this.ruleForm.Images, index, "");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.$refs["upload" + index][0].clearFiles();
        this.$set(this.ruleForm.Images, index, "");
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload(file, index) {
      this.spztIndex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、JPG 格式!");
        this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.clearFiles();
      }
      return isJPG && isLt2M;
    },
    handleAvatarSucces2(res, index) {
      const a = JSON.parse(JSON.stringify(this.ruleForm.Images));
      a[index] = res.Data.fileLink;
      this.ruleForm.Images = a;
    },
    handleRemove(file, fileList, index) {
      const a = JSON.parse(JSON.stringify(this.ruleForm.Images));
      this.ruleForm.Images = a;
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
  }
};
</script>
<style>
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
