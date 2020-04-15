<template>
  <div class="content_box roleadd addGoods">
    <h2 class="big_title">{{big_title}}商品</h2>

    <el-tabs v-model="activeName" type="border-card" :before-leave="tabsLeave">
      <el-tab-pane name="one" label="基础信息">
        <div class="desc">
          <div class="item">
            <div class="title">商品类别：</div>
            <div class="item_desc">
              <el-cascader
                v-model="base.CateCodeArray"
                clearable
                placeholder="请选择商品类别"
                separator="-"
                size="mini"
                :options="options"
                @active-item-change="handleItemChange"
                :props="props"
              ></el-cascader>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>商品编码：
            </div>
            <div class="item_desc">
              <el-input
                :disabled="GoodsId != ''"
                v-model="base.goodsCode"
                class="search_title"
                size="mini"
                placeholder="请输入商品编码"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>商品条码：
            </div>
            <div class="item_desc">
              <el-input v-model="base.SN" class="search_title" size="mini" placeholder="请输入商品条码"></el-input>
            </div>
          </div>

          <div class="item">
            <div class="title">HSCode：</div>
            <div class="item_desc">
              <el-input
                v-model="base.HSCode"
                class="search_title"
                size="mini"
                placeholder="请输入HSCode商品条码"
              ></el-input>
            </div>
          </div>

          <div class="item">
            <div class="title">
              <span class="red">*</span>商品中文名称：
            </div>
            <div class="item_desc">
              <el-input
                v-model="base.NameCN"
                class="search_title"
                size="mini"
                placeholder="请输入商品中文名称"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>商品英文名称：
            </div>
            <div class="item_desc">
              <el-input
                v-model="base.NameEN"
                class="search_title"
                size="mini"
                placeholder="请输入商品英文名称"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>成本价：
            </div>
            <div class="item_desc">
              <el-input
                v-model="base.CostPrice"
                class="search_title"
                size="mini"
                placeholder="请输入成本价"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>商品原产地：
            </div>
            <div class="item_desc">
              <el-select
                v-model="base.OriginCode"
                clearable
                filterable
                class="search_title"
                size="small"
                placeholder="请选择原产地"
              >
                <el-option
                  v-for="item in originlist"
                  :key="item.Code"
                  :label="item.NameCN"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>品牌：
            </div>
            <div class="item_desc">
              <el-select
                v-model="base.BrandCode"
                clearable
                filterable
                class="search_title"
                size="small"
                placeholder="请选择品牌"
              >
                <el-option
                  v-for="(item,index) in brandlist"
                  :key="index"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>商品规格：
            </div>
            <div class="item_desc">
              <el-input
                v-model="base.Standard"
                class="search_title"
                size="mini"
                placeholder="请输入商品规格"
              ></el-input>
            </div>
          </div>

          <div class="item">
            <div class="title">
              <span class="red">*</span>单位：
            </div>
            <div class="item_desc">
              <el-select
                v-model="base.UnitCode"
                clearable
                filterable
                class="search_title"
                size="small"
                placeholder="请选择单位"
              >
                <el-option
                  v-for="item in unitlist"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">第二法定单位：</div>
            <div class="item_desc">
              <el-select
                v-model="base.UnitCode1"
                clearable
                filterable
                class="search_title"
                size="small"
                placeholder="请选择第二法定单位"
              >
                <el-option
                  v-for="item in unitlist"
                  :key="item.Code"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="title">商品净重( kg )：</div>
            <div class="item_desc">
              <el-input
                v-model="base.NetWeight"
                class="search_title"
                size="mini"
                placeholder="请输入商品净重"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">商品毛重( kg )：</div>
            <div class="item_desc">
              <el-input
                v-model="base.GrossWeight"
                class="search_title"
                size="mini"
                placeholder="请输入商品毛重"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">商品体积( cm )：</div>
            <div class="item_desc tiji">
              <el-input v-model="base.Length" class="search_title" size="mini" placeholder="长"></el-input>
              <el-input v-model="base.Width" class="search_title" size="mini" placeholder="宽"></el-input>
              <el-input v-model="base.Height" class="search_title" size="mini" placeholder="高"></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">商品图片：</div>
            <div class="item_desc upload">
              <el-button type="text" size="mini" v-if="base.Image" @click="clearFiles">重新上传</el-button>
              <el-upload
                ref="upload"
                accept="image/*"
                :http-request="uploadImg"
                class="avatar-uploader"
                action
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :limit="1"
              >
                <img v-if="base.Image" :src="ImageShow" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>功能：
            </div>
            <div class="item_desc item_textarea">
              <el-input
                maxlength="500"
                type="textarea"
                v-model="base.Functions"
                placeholder="0/500"
              ></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>用途：
            </div>
            <div class="item_desc item_textarea">
              <el-input maxlength="200" type="textarea" v-model="base.Purpose" placeholder="0/200"></el-input>
            </div>
          </div>
          <div class="item">
            <div class="title">
              <span class="red">*</span>主要成分：
            </div>
            <div class="item_desc item_textarea">
              <el-input
                maxlength="500"
                type="textarea"
                v-model="base.Component"
                placeholder="0/500"
              ></el-input>
            </div>
          </div>

          <div class="item">
            <div class="title"></div>
            <div class="item_desc">
              <el-row>
                <el-col :span="4">
                  <el-button
                    size="mini"
                    type="success"
                    @click="save"
                    class="pan-btn green-btn nm"
                    icon="el-icon-check"
                  >提交保存</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="two" label="多规格">
        <el-row>
          <el-col :span="4">
            <el-button
              v-if="checkBtn('func_goods_specification_add')"
              class="pan-btn green-btn"
              @click="addGoodsSpec"
              type="success"
              size="mini"
              icon="el-icon-plus"
            >新增规格</el-button>
            <el-button
              v-if="checkBtn('func_goods_specification_batch')"
              class="pan-btn red-btn"
              @click="deleAllSpec"
              type="warning"
              size="mini"
              icon="el-icon-close"
            >批量删除规格</el-button>
            <el-button
              v-if="checkBtn('func_goods_specification_set')"
              @click="addSpec"
              class="pan-btn blue-btn"
              type="primary"
              size="mini"
              icon="el-icon-setting"
            >规格设置</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" label="全选" align="center"></el-table-column>
          <el-table-column prop="rn" label="序号" align="center"></el-table-column>
          <el-table-column prop="Code" label="商品编码" align="center"></el-table-column>
          <el-table-column prop="Standard" label="规格详情" align="center"></el-table-column>
          <el-table-column prop="Desc" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="checkBtn('func_common_delete')"
                @click="deleteSpec(scope.row)"
                type="warning"
                size="mini"
                class="pan-btn red-btn"
                icon="el-icon-close"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="three" label="跨境申报">
        <el-row>
          <el-col :span="4">
            <el-button
              v-if="checkBtn('func_goods_declare')"
              size="mini"
              type="success"
              @click="saveStore"
              class="pan-btn green-btn nm"
              icon="el-icon-check"
            >提交保存</el-button>
          </el-col>
        </el-row>
        <el-table :data="storeList" border fit highlight-current-row style="width: 100%">
          <el-table-column label="申报口岸" prop="Customs" align="center"></el-table-column>
          <el-table-column label="申报名称" align="center">
            <template slot-scope="scope">
              <el-input class="edit-input" size="mini" v-model="scope.row.Name4Customs"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="申报税号" align="center">
            <template slot-scope="scope">
              <el-input class="edit-input" size="mini" v-model="scope.row.Sn4Customs"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="申报价格（￥）" align="center">
            <template slot-scope="scope">
              <el-input class="edit-input" size="mini" v-model="scope.row.Price4Customs"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="适用税率（%）" align="center">
            <template slot-scope="scope">
              <el-input class="edit-input" size="mini" v-model="scope.row.TaxRate"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :close-on-click-modal="false"
      v-if="addGoodsSpecVisble"
      title="新增规格商品"
      :visible.sync="addGoodsSpecVisble"
      width="50%"
    >
      <div class="infoBox addBox">
        <div class="info_item">
          <div class="info_title">商品编码：</div>
          <div class="info_right">
            <el-input disabled class="inputClass" v-model="GoodsId" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">商品名称：</div>
          <div class="info_right">
            <el-input disabled class="inputClass" v-model="base.NameCN" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">子商品编码：</div>
          <div class="info_right">
            <el-input disabled class="inputClass" v-model="add.goodsCode" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item" v-for="(item,index) in specList" :key="index">
          <div class="info_title">
            <span class="red">*</span>
            {{ item.Name }}：
          </div>
          <div class="info_right tiji">
            <el-input class="inputClass" v-model="item._content" size="mini"></el-input>
            <span class="lh29">
              <span class="red">*</span>代码：
            </span>
            <el-input @input="input_change" class="inputClass" v-model="item._code" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">商品重量(g)：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              placeholder="请输入商品重量"
              v-model="add.grossWeight"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">商品体积( cm )：</div>
          <div class="item_desc tiji">
            <el-input v-model="add.Length" class="search_title" size="mini" placeholder="长(cm)"></el-input>
            <el-input v-model="add.Width" class="search_title" size="mini" placeholder="宽(cm)"></el-input>
            <el-input v-model="add.Height" class="search_title" size="mini" placeholder="高(cm)"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">备注：</div>
          <div class="info_right">
            <el-input class="inputClass" placeholder="请输入备注" v-model="add.desc" size="mini"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsSpecVisble = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addSpecGoods" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      v-if="goodsSpec"
      title="多规格设置"
      :visible.sync="goodsSpec"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">规格名称：</div>
          <div class="info_right">
            <el-input class="inputClass" v-model="moreSpecName" placeholder="请输入规格名称" size="mini"></el-input>
            <div>
              <el-button type="primary" @click="addMoreSpec" size="mini">添加</el-button>
            </div>
          </div>
        </div>
        <el-table :data="specList" border fit highlight-current-row style="width: 100%">
          <el-table-column label="编号" prop="Id" align="center"></el-table-column>
          <el-table-column label="规格名称" prop="Name" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                @click="delMoreSpec(scope.row)"
                class="pan-btn red-btn"
                type="danger"
                size="mini"
                icon="el-icon-close"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsSpec = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="goodsSpec = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "merchandisecontrol/" +
  moment().format("YYYYMM") +
  "/img/";
import { getList } from "@/api/merchandisecategories/index";
import { getUnitList } from "@/api/brand/unit";
import { getOriginList } from "@/api/brand/origin";
import { getBrandList } from "@/api/brand/index";
import {
  addGoods,
  getGoodsSpecList,
  getMoreSpecList,
  addMoreSpec,
  delMoreSpec,
  delGoodsSpec,
  addSpecGoods,
  getStoreList,
  saveEditStoreList,
  editGoods
} from "@/api/goods/index";
export default {
  data() {
    return {
      fu: window.ali_oss_data.URL_IMG_SHOW,
      uploadfiles: [],
      imgNames: [],
      add: {
        goodsCode: "",
        pGoodsId: "",
        grossWeight: "1",
        stdInfo: "",
        Length: "0",
        Width: "0",
        Height: "0",
        desc: ""
      },
      baseAdd: {},
      storeList: [],
      goodsSpec: false,
      addGoodsSpecVisble: false,
      tableData: [],
      moreSpecName: "",
      specList: [],
      activeName: "one",
      big_title: "新增",
      props: {
        value: "Code",
        children: "Childs",
        label: "Name"
      },
      GoodsId: "",
      ImageShow: "",
      base: {
        Functions: "", //功能
        Purpose: "", //用途
        Component: "", //主要成分
        HSCode: "", //HSCode
        CateCode: "",
        CateCodeArray: [],
        goodsCode: "",
        NameCN: "",
        NameEN: "",
        CustomsSN: "",
        SN: "",
        OriginCode: "",
        CostPrice: "",
        Image: "",
        BrandCode: "",
        UnitCode: "",
        UnitCode1: "",
        Standard: "",
        GrossWeight: "",
        NetWeight: "",
        Length: "",
        Width: "",
        Height: ""
      },
      isEdit: false,
      options: [],
      originlist: [],
      unitlist: [],
      isF: false,
      brandlist: [],
      baseSpecList: [],
      multipleSelection: [],
      roleBtn: []
    };
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    new Promise(re => {
      this.getTypeList(false);
      this.getBrand();
      this.getUnit();
      this.getOrigin();
      re();
    }).then(() => {
      if (parseInt(this.$route.query.id) === -1) {
        this.big_title = "新增";
      } else {
        this.isEdit = true;
        this.big_title = "编辑";
        const data = JSON.parse(
          window.sessionStorage.getItem(this.$route.query.id)
        );
        this.GoodsId = data.Id;
        this.base = Object.assign(this.base, data);
        this.base.goodsCode = data.Code;
        this.base.Image = data.Image;
        if (data.Image.indexOf("/u/") != -1) {
          let newImage = data.Image.substring(
            data.Image.indexOf("/u/"),
            data.Image.length
          );
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
          this.ImageShow = signUrl;
        } else {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + data.Image;
          this.ImageShow = signUrl;
        }
        this.base.HSCode = data.HSCode;
        this.base.Functions = data.Functions;
        this.base.Purpose = data.Purpose;
        this.base.Component = data.Component;
        this.base.CateCodeArray[0] = data.FirstCateCode;
        this.base.CateCodeArray[1] = data.FirstCateCode + data.SecondCateCode;
        this.base.CateCodeArray[2] =
          data.FirstCateCode + data.SecondCateCode + data.ThridCateCode;
        this.isF = true;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    let f = false;
    this.$store.state.tagsView.visitedViews.map(v => {
      if (v.path === from.path) {
        f = true;
      }
    });
    if (!f) {
      this.$destroy();
    }
    next();
  },
  watch: {
    options: function(nval, oval) {
      if (oval.length === 0 && this.isEdit) {
        new Promise(re => {
          this.getTypeList([this.base.CateCodeArray[0]]);
          re();
        }).then(() => {
          setTimeout(() => {
            this.getTypeList([
              this.base.CateCodeArray[0],
              this.base.CateCodeArray[1]
            ]);
          }, 800);
        });
      }
    },
    activeName: function(nval, oval) {
      if (nval === "two") {
        this.getGoodsSpecList();
        getMoreSpecList({
          goodsId: this.GoodsId
        }).then(res => {
          res = res.map(v => {
            v._content = "";
            v._code = "";
            return v;
          });
          this.specList = res;
          this.baseSpecList = JSON.parse(JSON.stringify(res));
          this.baseAdd = JSON.parse(JSON.stringify(this.add));
        });
      } else if (nval === "three") {
        this.getStoreList();
      }
    }
  },
  methods: {
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    saveStore() {
      saveEditStoreList({
        goodsId: this.GoodsId,
        customsInfo: this.storeList
      }).then(() => {
        this.$message.success("保存成功");
        this.getStoreList();
      });
    },
    getStoreList() {
      getStoreList({
        goodsId: this.GoodsId
      }).then(res => {
        this.storeList = res;
      });
    },
    addSpecGoods() {
      this.add.pGoodsId = this.GoodsId;
      const a = [];
      let f = false;
      this.specList.map(v => {
        if (v._code === "" || v._content === "") {
          f = true;
        } else {
          a.push(v.Name + ":" + v._content + ":" + v._code);
        }
      });
      if (f) {
        this.$message.error("请先完善规格商品信息");
        return;
      }
      this.add.stdInfo = a.join(",");
      addSpecGoods(this.add).then(() => {
        this.$message.success("新增成功");
        this.getGoodsSpecList();
        this.addGoodsSpecVisble = false;
        this.add = JSON.parse(JSON.stringify(this.baseAdd));
      });
    },
    input_change() {
      this.add.goodsCode = this.base.goodsCode + "-" + this.get_code();
    },
    get_code() {
      const str = [];
      this.specList.map(v => {
        if (v._code !== "") {
          str.push(v._code);
        }
      });
      return str.join("-");
    },
    addGoodsSpec() {
      this.addGoodsSpecVisble = true;
      this.add.goodsCode = this.base.goodsCode;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleAllSpec() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请至少选择一个规格商品在进行删除操作");
      } else {
        this.$confirm("确定要删除选择的这些规格商品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const a = this.multipleSelection.map(v => {
            return v.Id;
          });
          this.delSpec(a);
        });
      }
    },
    delSpec(a) {
      delGoodsSpec({
        ids: a.join(",")
      }).then(res => {
        this.$message.success("删除成功");
        this.getGoodsSpecList();
      });
    },
    addSpec() {
      getMoreSpecList({
        goodsId: this.GoodsId
      }).then(res => {
        res = res.map(v => {
          v._content = "";
          v._code = "";
          return v;
        });
        this.specList = res;
        this.baseSpecList = JSON.parse(JSON.stringify(res));
        this.goodsSpec = true;
      });
    },
    addMoreSpec() {
      if (this.moreSpecName === "") {
        return;
      } else {
        addMoreSpec({
          name: this.moreSpecName,
          goodsId: this.GoodsId
        }).then(res => {
          this.$message.success("新增成功");
          this.moreSpecName = "";
          this.addSpec();
        });
      }
    },
    delMoreSpec(row) {
      this.$confirm("确定要删除这个规格吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMoreSpec({
          goodsId: this.GoodsId,
          stdId: row.Id,
          stdName: row.Name
        }).then(res => {
          this.$message.success("删除成功");
          this.addSpec();
        });
      });
    },
    deleteSpec(row) {
      this.$confirm("确定要删除此规格商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delSpec([row.Id]);
      });
    },
    handleItemChange(val) {
      this.getTypeList(val);
    },
    // 保存商品信息
    save() {
      this.base.CateCode = this.base.CateCodeArray[2];
      if (!this.base.CateCode) {
        this.$message.error("请选择商品类别");
        return;
      }
      if (this.base.goodsCode === "") {
        this.$message.error("请输入商品编码");
        return;
      } else if (this.base.SN === "") {
        this.$message.error("请输入商品条码");
        return;
      } else if (this.base.hsCode === "") {
        this.$message.error("请输入HSCode");
        return;
      } else if (this.base.Standard === "") {
        this.$message.error("请输入商品规格");
        return;
      } else if (this.base.NameCN === "") {
        this.$message.error("请输入商品中文名称");
        return;
      } else if (
        this.base.NameCN.indexOf("+") >= 0 ||
        this.base.NameCN.indexOf('"') >= 0 ||
        this.base.NameCN.indexOf("'") >= 0
      ) {
        this.$message.error("请输入正确的商品名称，不允许输入特殊字符");
        return;
      } else if (this.base.NameEN === "") {
        this.$message.error("请输入商品英文名称");
        return;
      } else if (this.base.OriginCode === "") {
        this.$message.error("请选择商品原产地");
        return;
      } else if (this.base.BrandCode === "") {
        this.$message.error("请选择商品品牌");
        return;
      } else if (this.base.UnitCode === "") {
        this.$message.error("请选择单位");
        return;
      } else if (
        this.base.CostPrice === "" ||
        isNaN(this.base.CostPrice) ||
        parseFloat(this.base.CostPrice) < 0.01
      ) {
        this.$message.error("请选择输入正确的成本价");
        return;
      }
      if (!this.isEdit) {
        if (!this.checkBtn("func_common_addsave")) return;
        addGoods(this.base).then(res => {
          this.base.goodsCode = res.Code;
          this.GoodsId = res.Id;
          this.$message.success(this.big_title + "成功");
        });
      } else {
        if (!this.checkBtn("func_common_editsave")) return;
        editGoods(this.base).then(res => {
          this.base.FirstCateCode = this.base.CateCodeArray[0];
          this.base.SecondCateCode = this.base.CateCodeArray[1].slice(
            this.base.CateCodeArray[0].length,
            this.base.CateCodeArray[1].length
          );
          this.base.ThridCateCode = this.base.CateCodeArray[2].slice(
            this.base.CateCodeArray[1].length,
            this.base.CateCodeArray[2].length
          );
          window.sessionStorage.setItem(
            this.$route.query.id,
            JSON.stringify(this.base)
          );
          this.$message.success(this.big_title + "成功");
        });
      }
    },
    getGoodsSpecList() {
      getGoodsSpecList({
        pageSize: 99,
        pageIndex: 1,
        goodsId: this.GoodsId
      }).then(res => {
        this.tableData = res.Data;
      });
    },
    tabsLeave(activeName, oldActiveName) {
      if (
        this.GoodsId === "" &&
        (activeName === "two" || activeName === "three")
      ) {
        this.$message.error("请先完善商品基本信息");
        return false;
      }
    },
    getTypeList(data) {
      getList({
        CurCode: data ? (data.length === 1 ? data[0] : data[1]) : ""
      }).then(res => {
        if (!data) {
          this.options = res;
        } else {
          this.options.map(v => {
            if (data.length === 1) {
              if (v.Code === data[0]) {
                v.Childs = res;
                return;
              }
            } else if (data.length === 2) {
              v.Childs.map(item => {
                if (item.Code === data[1]) {
                  res.map(i => {
                    delete i.Childs;
                  });
                  item.Childs = res;
                  return;
                }
              });
            }
          });
        }
      });
    },
    getBrand() {
      getBrandList({ InUse: 1 }).then(res => {
        this.brandlist = res.Data;
      });
    },
    getUnit() {
      getUnitList({ InUse: 1 }).then(res => {
        this.unitlist = res.Data;
      });
    },
    getOrigin() {
      getOriginList({ InUse: 1 }).then(res => {
        this.originlist = res.Data;
      });
    },
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
          this.ImageShow = signUrl;
          this.base.Image = imgFileNameList[0];
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
    clearFiles() {
      this.base.Image = "";
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
.addBox .info_title {
  flex: 0 0 120px !important;
}

.nm {
  margin-left: 0 !important;
}

.tiji {
  display: flex;
}

.tiji .search_title {
  flex: 0 0 25% !important;
  margin-right: 10px;
}

.lh29 {
  line-height: 29px;
}

.lh29 .red {
  padding-right: 5px;
}

.red {
  color: #f56c6c;
}

.pan-btn {
  margin-left: 15px;
}

a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
  padding-top: 10px;
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

.item_textarea {
  margin: 10px 0;
}
.info_item {
  display: flex;
  height: 40px;
}

.info_title span {
  color: #ff0000;
  padding-right: 5px;
}

.info_item .info_title {
  flex: 0 0 70px;
  line-height: 29px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
  display: flex;
}

.inputClass {
  flex: 0 0 200px;
  margin-right: 10px;
}
</style>