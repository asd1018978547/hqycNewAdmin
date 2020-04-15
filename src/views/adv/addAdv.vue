<template>
  <div class="content_box recgoods">
    <h2 class="big_title">{{big_title}}广告</h2>
    <div class="box">
      <el-row>
        <el-col class="title" :span="2">广告类型：</el-col>
        <el-col :span="6">
          <el-select
            :disabled="isEdit"
            class="adcselect"
            @change="platechange"
            v-model="advType"
            size="small"
            placeholder="请选择广告类型"
          >
            <el-option
              v-for="item in options1"
              :key="item.Id"
              :label="item.Plateform"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">广告位置：</el-col>
        <el-col :span="6">
          <el-select
            :disabled="isEdit"
            class="adcselect"
            v-model="advLocation"
            size="small"
            placeholder="请选择广告位置"
          >
            <el-option
              v-for="item in options2"
              :key="item.Id"
              :label="item.Location"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">广告内容：</el-col>
        <el-col :span="6">
          <el-select class="adcselect" v-model="advContent" size="small" placeholder="请选择广告内容">
            <el-option
              v-for="(item,index) in options3"
              :key="index"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title none" :span="2">隐藏字段：</el-col>
        <el-col :span="6">
          <el-input v-model="content" size="small" disabled></el-input>
        </el-col>
        <el-col style="padding-left:10px;" :span="4">
          <el-button
            v-if="checkBtn('func_advertising_category')"
            @click="openDig"
            size="small"
            plain
            type="success"
          >选择类别</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">广告权重：</el-col>
        <el-col :span="6">
          <el-input v-model="weight" placeholder="请输入广告权重" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">广告标题：</el-col>
        <el-col :span="6">
          <el-input v-model="title" placeholder="请输入广告标题" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">广告说明：</el-col>
        <el-col :span="6">
          <el-input v-model="desc" placeholder="请输入广告说明" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">商品原价：</el-col>
        <el-col :span="6">
          <el-input v-model="OriginalPrice" placeholder="请输入商品原价" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="2">标签：</el-col>
        <el-col :span="6">
          <el-input v-model="label" placeholder="请输入标签,使用英文逗号分割" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row style="height: 100px;">
        <el-col class="title" :span="2">广告标签图片：</el-col>
        <el-col :span="12">
          <el-upload
            ref="upload2"
            accept="image/*"
            :file-list="file_list"
            :http-request="uploadImg"
            :before-upload="checkFile"
            action
          >
            <el-button size="mini" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">仅支持jpg,jpeg,png,bmp格式，文件小于2M</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row style="height: 400px;" v-if="LabelImg != ''">
        <el-col :span="8" class="i_box">
          <div class="imgBox">
            <img :src="LabelImgShow" alt />
          </div>
          <el-button
            style="margin-left:15px;"
            size="mini"
            type="danger"
            @click="deleteLabelImg"
          >删除图片</el-button>
        </el-col>
      </el-row>
      <el-row style="height: 100px;">
        <el-col class="title" :span="2">广告图片：</el-col>
        <el-col :span="12">
          <el-upload
            ref="upload"
            accept="image/*"
            v-if="checkBtn('func_common_upload')"
            :file-list="file_list"
            :http-request="uploadImg1"
            :before-upload="checkFile"
            action
          >
            <el-button size="mini" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">仅支持jpg,jpeg,png,bmp格式，文件小于2M</div>
          </el-upload>
        </el-col>
      </el-row>
      <el-row style="height: 400px;" v-if="fileUploadUrl != ''">
        <el-col :span="8" class="i_box">
          <div class="imgBox">
            <img :src="fileUploadUrlShow" alt />
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="add_box">
          <el-button class="addAdv" @click="addAdv" type="success">提交</el-button>
        </el-col>
      </el-row>
    </div>
    <!--选择品牌-->
    <el-dialog v-if="brandVisible" title="选择品牌" :visible.sync="brandVisible" width="40%">
      <div class="searchBox">
        <el-row>
          <el-col :span="10">
            <span class="timed">品牌名称：</span>
            <el-input v-model="searchBrand" class="search_title" size="small" placeholder="输入品牌名称"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              class="search_btn pan-btn green-btn"
              @click="getBrand"
              type="success"
              size="mini"
              icon="el-icon-search"
            >查询</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="brandData" border cell-class-name="brand_td">
        <el-table-column prop="Name" label="品牌名称" align="center"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button @click="choiceBrand(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right;padding:10px 0;"
        @current-change="brandCurrentChange"
        :page-size="brandPageSize"
        layout="prev, pager, next, jumper"
        :total="brandTotal"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="brandVisible = false">取 消</el-button>
        <el-button type="primary" @click="brandVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择分类-->
    <el-dialog v-if="cateVisible" title="选择分类" :visible.sync="cateVisible" width="30%">
      <el-tree
        accordion
        :render-content="renderContent"
        :data="cateData"
        :props="cateOpt"
        :load="lazyCateData"
        lazy
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cateVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--选择商品-->
    <el-dialog v-if="goodsVisible" title="选择商品" :visible.sync="goodsVisible" width="70%">
      <div class="goods">
        <div class="goods_left">
          <el-tree
            accordion
            :render-content="goodsRenderContent"
            :data="cateData"
            :props="cateOpt"
            :load="lazyCateData"
            lazy
          ></el-tree>
        </div>
        <div class="goods_right">
          <div class="searchBox">
            <el-row>
              <el-col :span="10">
                <span class="timed">SKU名称：</span>
                <el-input
                  v-model="goods_skuname"
                  class="search_title"
                  size="small"
                  placeholder="输入SKU名称"
                ></el-input>
              </el-col>
              <el-col :span="10">
                <span class="timed">SN编码：</span>
                <el-input
                  v-model="goods_skucode"
                  class="search_title"
                  size="small"
                  placeholder="输入SN编码"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <el-button
                  class="search_btn pan-btn green-btn"
                  @click="getGoods"
                  type="success"
                  size="mini"
                  icon="el-icon-search"
                >查询</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table :data="goodsData" border cell-class-name="brand_td">
            <el-table-column label="商品信息" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-table :data="scope.row.childSkuList" border fit highlight-current-row>
                  <el-table-column label="基础信息" align="center" width="300" :resizable="false">
                    <template slot-scope="scope">
                      <div class="skuItem">
                        <div style="padding:0 0 0 10px;text-align:left">
                          <div>{{scope.row.Name}}</div>
                          <div>商品编号：{{scope.row.SN}}</div>
                          <div>渠道商品编码：{{scope.row.ExtSN}}</div>
                          <div>{{scope.row.StandardInfo}}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="规格" align="center" width="200">
                    <template slot-scope="scope">
                      <span>{{scope.row.StandardInfo}}</span>
                    </template>
                  </el-table-column>-->
                  <el-table-column label="库存" align="center" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.Amount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="批发价￥" align="center" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.Price.toFixed(2)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="零售价￥" align="center" :resizable="false">
                    <template slot-scope="scope">
                      <span>{{scope.row.RetailPrice.toFixed(2)}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="发货方式" align="center" :resizable="false">
                    <template slot-scope="scope">
                      <span v-if="scope.row.OrderType == 1">跨境直邮</span>
                      <span v-if="scope.row.OrderType == 2">保税备货</span>
                      <span v-if="scope.row.OrderType == 3">一般贸易</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="scope">
                      <el-button @click="choiceGoods(scope.row)" type="text" size="small">选择</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="BrandName" label="品牌名称" align="center" width="200"></el-table-column>
          </el-table>
          <el-pagination
            style="text-align:right;padding:10px 0;"
            @size-change="goodsSizeChange"
            @current-change="goodsCurrentChange"
            :page-sizes="[10,20,30,50]"
            :page-size="goodsPageSize"
            layout="prev, pager, next, jumper"
            :total="goodsTotal"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="goodsVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="hdVisible" width="70%">
      <el-table border :data="tableData">
        <el-table-column prop="Name" label="活动标题" align="center"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="choiceactivityarea(scope.row)"
              size="small"
              class="pan-btn blue-btn"
              icon="el-icon-edit"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right;margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[15, 50, 100, 200]"
        :page-size="15"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRow"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hdVisible = false">取 消</el-button>
        <el-button type="primary" @click="hdVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "adv/" +
  moment().format("YYYYMM") +
  "/img/";
import { getSkuList, getSkuForId, getBrand } from "@/api/adv/recGoods";
import {
  getAdvLocation,
  getAdvPlate,
  getAdvInfo,
  addAdv,
  editAdv
} from "@/api/adv";
import { getActivityAreaList } from "@/api/ActivityArea/ActivityArea";
export default {
  data() {
    return {
      hdobj: {},
      sid: "",
      orderType: "",
      totalRow: 0,
      pageSize: 15,
      pageIndex: 1,
      fu: window.ali_oss_data.URL_IMG_SHOW,
      big_title: "新增",
      isEdit: false,
      weight: "",
      fileUpload:
        window._config.fileServer +
        "/f/upload/300002/?partnerId=10000&token=" +
        window.localStorage.getItem("Token"),
      fileUploadUrl: "",
      fileUploadUrlShow: "",
      LabelImgShow: "",
      file_list: [],
      goodsInfo: {},
      hdVisible: false,
      goodsVisible: false,
      goodsData: [],
      goods_skuname: "",
      goodsPageSize: 15,
      label: "",
      goodsTotal: 0,
      goodsPageIndex: 1,
      goods_skucode: "",
      tableData: [],
      cateCode: "",
      cateInfo: {},
      cateVisible: false,
      cateData: [],
      cateOpt: {
        label: "Name"
      },
      searchBrand: "",
      brandData: [],
      brandPageSize: 15,
      brandPageIndex: 1,
      brandTotal: 0,
      brandVisible: false,
      brandInfo: {},
      desc: "",
      size: {
        pc: {
          banner: "1200*400",
          brand: "199*108"
        },
        Sprogram: {
          banner: "750*360",
          special: "88*88"
        }
      },
      sizeDesc: "",
      px: "720*288",
      advType: "",
      advLocation: "",
      title: "",
      content: "",
      uploadfiles: [],
      imgNames: [],
      uploadfiles1: [],
      imgNames1: [],
      advContent: "",
      LabelImg: "",
      OriginalPrice: "",
      options1: [],
      roleBtn: [],
      options2: [],
      options3: [
        {
          id: 1,
          label: "商品信息"
        },
        {
          id: 2,
          label: "商品分类"
        },
        {
          id: 3,
          label: "商品品牌"
        },
        {
          id: 4,
          label: "活动"
        }
      ]
    };
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    const id = parseInt(this.$route.query.id);
    if (id !== -1 && id) {
      this.big_title = "编辑";
      this.isEdit = true;
      this.editData(this.$route.query.id);
    } else {
      this.big_title = "新增";
      this.isEdit = false;
      this.getPlate();
    }
    this.getAreaList();
  },
  activated() {
    const id = parseInt(this.$route.query.id);
    if (id !== -1 && id) {
      this.big_title = "编辑";
      this.isEdit = true;
      this.editData(this.$route.query.id);
    } else {
      this.big_title = "新增";
      this.isEdit = false;
      this.getPlate();
    }
    this.getAreaList();
  },
  deactivated() {
    // 文件上传
    this.fileUploadUrl = "";
    this.file_list = [];
    // 商品
    this.goodsInfo = {};
    this.goodsVisible = false;
    this.goodsData = [];
    this.goods_skuname = "";
    this.goodsPageSize = 15;
    this.goodsTotal = 0;
    this.goodsPageIndex = 1;
    this.goods_skucode = "";
    this.weight = "";
    this.cateCode = "";
    // 分类
    this.cateInfo = {};
    this.cateVisible = false;
    this.cateData = [];
    // 品牌
    this.searchBrand = "";
    this.brandData = [];
    this.brandPageSize = 15;
    this.brandPageIndex = 1;
    this.brandTotal = 0;
    this.brandVisible = false;
    this.brandInfo = {};
    this.desc = "";
    this.advType = "";
    this.advLocation = "";
    this.title = "";
    this.content = "";
    this.advContent = "";
    this.options1 = [];
    this.options2 = [];
  },
  watch: {
    brandVisible(newVal, oldVal) {
      if (newVal) {
        this.getBrand();
        this.goodsInfo = {};
        this.cateInfo = {};
      }
    },
    cateVisible(newVal, oldVal) {
      if (newVal) {
        this.getCate();
        this.goodsInfo = {};
        this.brandInfo = {};
      }
    },
    goodsVisible(newVal, oldVal) {
      if (newVal) {
        this.getCate();
        this.getGoods();
        this.cateInfo = {};
        this.brandInfo = {};
      }
    }
  },
  methods: {
    //自定義圖片上傳方法
    uploadImg(option) {
      this.LabelImgShow = "";
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
      this.LabelImg = imgFileNameList[0];
      setTimeout(() => {
        this.$refs.upload2.clearFiles();
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + imgFileNameList[0];
        this.LabelImgShow = signUrl;
        console.log("this.LabelImgShow: ", this.LabelImgShow);
      }, 800);
    },
    //自定義圖片上傳方法
    uploadImg1(option) {
      this.fileUploadUrlShow = "";
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
      this.fileUploadUrl = imgFileNameList[0];
      setTimeout(() => {
        this.$refs.upload.clearFiles();
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + imgFileNameList[0];
        this.fileUploadUrlShow = signUrl;
        console.log("this.fileUploadUrlShow: ", this.fileUploadUrlShow);
      }, 800);
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
    deleteLabelImg() {
      this.LabelImg = "";
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
    checkFile(file) {
      const n = file.name.substring(file.name.lastIndexOf(".") + 1);
      const png = n === "jpg";
      const jpg = n === "png";
      const gif = n === "bmp";
      const size = file.size / 1024 / 1024 < 2;
      if (!png && !jpg && !gif) {
        this.$message.error("请选择jpg,png,bmp文件！");
        return false;
      }
      if (!size) {
        this.$message.error("文件过大，请从新选择");
        return false;
      }
      return png || jpg || (gif && size);
    },
    // 如果是编辑
    editData(id) {
      this.isEdit = true;
      getAdvInfo({
        id: id
      }).then(res => {
        if (res.Link.split("&").length > 2) {
          this.orderType = parseInt(res.Link.split("&")[2].split("=")[1]);
          this.advContent = parseInt(res.Link.split("&")[0].split("=")[1]);
        }
        this.title = res.Title;
        this.label = res.Label;
        this.desc = res.Desc;
        this.weight = res.Weight;
        this.OriginalPrice = res.OriginalPrice;
        this.LabelImg = res.LabelImg;
        this.LabelImgShow = window.ali_oss_data.URL_IMG_SHOW + res.LabelImg;
        this.options1 = [
          {
            Id: 1,
            Plateform: res.Plateform
          }
        ];
        this.options2 = [
          {
            Id: 1,
            Location: res.Location
          }
        ];
        this.hdobj = {};
        this.hdobj.Id = res.Link.split("&")[1].split("=")[1];
        this.advType = 1;
        this.advLocation = 1;
        for (let x = 0; x < this.options3.length; x++) {
          if (
            parseInt(this.options3[x].id) ===
            parseInt(res.Link.split("&")[0].split("=")[1])
          ) {
            this.advContent = this.options3[x].id;
          }
        }
        this.goodsInfo = {};
        this.goodsInfo.Id = res.Link.split("&")[1].split("=")[1];
        this.sid = res.Link.split("&")[1].split("=")[1];
        this.content = res.TargetInfo;
        this.fileUploadUrl = res.AdvImg;
        this.fileUploadUrlShow = window.ali_oss_data.URL_IMG_SHOW + res.AdvImg;
      });
    },
    // 新增广告
    addAdv() {
      const p = {};
      if (this.title === "") {
        this.$message.error("请输入标题");
        return;
      }
      p.title = this.title;
      if (this.advContent === "") {
        this.$message.error("请选择广告内容");
        return;
      }
      p.linkType = this.advContent;
      if (p.linkType == 1) {
        p.orderType = this.orderType;
      }
      p.targetInfo = this.content;
      p.linkVal = this.getKey();
      if (p.linkType == 1) {
        p.linkVal = this.sid;
      }
      if (this.fileUploadUrl === "") {
        this.$message.error("请上传广告图片");
        return;
      }
      if (this.content === "") {
        this.$message.error("请选择类别");
        return;
      }
      p.image = this.fileUploadUrl;
      if (this.desc === "") {
        this.$message.error("请输入说明");
        return;
      }
      if (this.weight === "" || this.weight < 0) {
        this.$message.error("请输入正确的权重");
        return;
      }
      p.weight = this.weight;
      p.desc = this.desc;
      const _this = this;
      p.OriginalPrice = this.OriginalPrice;
      p.LabelImg = this.LabelImg;
      p.label = this.label;
      if (parseInt(this.$route.query.id) === -1) {
        if (!this.checkBtn("func_common_addsave")) return;
        if (this.advLocation === "") {
          this.$message.error("请选择广告位");
          return;
        }
        p.locationId = this.advLocation;
        addAdv(p).then(res => {
          this.$message.success({
            message: "添加成功",
            duration: 1500,
            onClose() {
              _this.$store
                .dispatch("delVisitedViews", {
                  name: "addAdv",
                  path: "/addAdv",
                  title: "新增广告"
                })
                .then(res => {
                  _this.$router.push("/adv");
                });
            }
          });
        });
      } else {
        if (!this.checkBtn("func_common_editsave")) return;
        p.id = parseInt(this.$route.query.id);
        editAdv(p).then(res => {
          this.$message.success({
            message: "编辑成功",
            duration: 1500,
            onClose() {
              _this.$store
                .dispatch("delVisitedViews", {
                  name: "addAdv",
                  path: "/addAdv",
                  title: "编辑广告"
                })
                .then(res => {
                  _this.$router.push("/adv");
                });
            }
          });
        });
      }
    },
    getKey() {
      if (this.advContent == 1) {
        return this.goodsInfo.Id;
      }
      if (this.advContent == 2) {
        return this.cateInfo.Code;
      }
      if (this.advContent == 3) {
        return this.brandInfo.Code;
      }
      if (this.advContent == 4) {
        return this.hdobj.Id;
      }
      return null;
    },
    // 商品相关
    getGoods() {
      getSkuForId({
        sn: this.goods_skucode,
        name: this.goods_skuname,
        cateCode: this.cateCode,
        pageIndex: this.goodsPageIndex,
        pageSize: this.goodsPageSize,
        status: "1"
      }).then(res => {
        this.goodsTotal = res.TotalRows;
        this.goodsPageIndex = res.PageIndex;
        this.goodsData = res.Data;
      });
    },
    goodsSizeChange(val) {
      this.goodsPageSize = val;
      this.getGoods();
    },
    choiceGoods(val) {
      this.sid = val.Id;
      this.orderType = val.OrderType;
      this.$set(this, "goodsInfo", val);
      this.content = val.Name;
      // this.content = val.BrandName + " " + val.Name;
      this.goodsVisible = false;
    },
    choiceactivityarea(row) {
      this.$set(this, "hdobj", row);
      this.content = row.Name;
      this.hdVisible = false;
    },
    goodsCurrentChange(val) {
      this.goodsPageIndex = val;
      this.getGoods();
    },
    choiceCateForGoods(data) {
      this.cateCode = data.Code;
      this.getGoods();
    },
    goodsRenderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span class="tree_font">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.choiceCateForGoods(data)}
            >
              选择
            </el-button>
          </span>
        </span>
      );
    },
    // 获取分类
    lazyCateData(node, resolve) {
      if (node.level >= 1) {
        this.getMoreCate(node.data.Code, resolve);
      } else {
        resolve(this.cateData);
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span class="tree_font">
            <el-button
              size="mini"
              type="text"
              on-click={() => this.choiceCate(data)}
            >
              选择
            </el-button>
          </span>
        </span>
      );
    },
    choiceCate(data2) {
      this.$set(this, "cateInfo", data2);
      this.cateVisible = false;
      this.content = data2.Name;
    },
    getMoreCate(val, resolve) {
      getSkuList({
        curCode: val
      }).then(res => {
        resolve(res);
      });
    },
    getCate() {
      getSkuList().then(res => {
        this.cateData = res;
      });
    },
    // 品牌分页
    brandCurrentChange(v) {
      this.brandPageIndex = v;
      this.getBrand();
    },
    // 选择品牌
    choiceBrand(row) {
      this.$set(this, "brandInfo", row);
      this.content = row.Name;
      this.brandVisible = false;
    },
    // 获取品牌
    getBrand() {
      getBrand({
        pageSize: this.brandPageSize,
        pageIndex: this.brandPageIndex,
        brandName: this.searchBrand
      }).then(res => {
        this.brandData = res.Data;
        this.brandTotal = res.TotalRows;
      });
    },
    // 打开弹窗
    openDig() {
      if (parseInt(this.advContent) === 1) {
        this.goodsVisible = true;
      } else if (parseInt(this.advContent) === 2) {
        this.cateVisible = true;
      } else if (parseInt(this.advContent) === 3) {
        this.brandVisible = true;
      } else if (this.advContent == 4) {
        this.hdVisible = true;
      }
    },
    // 获取广告位置
    platechange(v) {
      this.getLocation(v);
    },
    // 获取活动列表
    getAreaList() {
      getActivityAreaList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        status: 1
      }).then(res => {
        this.totalRow = res.TotalRows;
        this.tableData = res.Data;
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getAreaList();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getAreaList();
    },
    getLocation(val) {
      getAdvLocation({
        plateformId: val
      }).then(res => {
        this.options2 = res;
      });
    },
    // 获取广告类型
    getPlate() {
      getAdvPlate().then(res => {
        this.options1 = res;
      });
    }
  }
};
</script>

<style scoped>
.goods {
  display: flex;
  justify-content: flex-end;
}
.goods_left {
  flex: 0 0 200px;
}
.goods_right {
  flex: 1;
}
.imgBox {
  padding-left: 120px;
}
.imgBox img {
  border: 1px solid #eee;
  width: 400px;
  height: 400px;
}
</style>