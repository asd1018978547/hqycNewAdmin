<template>
  <div class="content_box roleadd goodsManage">
    <div class="box">
      <div class="box_left">
        <div class="title">
          SKU类别
          <el-button type="text" size="mini" @click="jump">新增SKU类别</el-button>
        </div>
        <el-tree
          accordion
          @node-click="getGoodsData"
          :highlight-current="1 === 1"
          :data="typelist"
          :load="loadNode"
          lazy
          :props="defaultProps"
          ref="tree"
        ></el-tree>
      </div>
      <div class="box_right">
        <div class="title mb">SKU列表</div>
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">已上架</el-menu-item>
          <el-menu-item index="2">待审核</el-menu-item>
          <el-menu-item index="0">已下架</el-menu-item>
        </el-menu>
        <div class="searchBox">
          <el-row>
            <el-col :span="6">
              <span class="timed">商品名称：</span>
              <el-input
                clearable
                v-model="search.Name"
                class="search_title"
                size="mini"
                placeholder="请输入SKU名称"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <span class="timed">关键字：</span>
              <el-input
                clearable
                v-model="search.Labels"
                class="search_title"
                size="mini"
                placeholder="请输入SKU关键字"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <span class="timed">SN：</span>
              <el-input
                clearable
                v-model="search.sn"
                class="search_title"
                size="mini"
                placeholder="请输入备货SN"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <span class="timed">渠道商品编码：</span>
              <el-input
                clearable
                v-model="search.ExtSN"
                class="search_title"
                size="mini"
                placeholder="请输入渠道商品编码"
              ></el-input>
            </el-col>
            <!-- <el-col :span="6">
              <span class="timed">渠道商品编码：</span>
              <el-input
                clearable
                v-model="search.ExtSN"
                class="search_title"
                size="mini"
                placeholder="请输入渠道商品编码"
              ></el-input>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="timed">发货方式：</span>
              <el-select
                class="search_title"
                filterable
                clearable
                v-model="search.OrderType"
                size="mini"
                placeholder="发货方式"
              >
                <el-option
                  v-for="(item,index) in orderTypeList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span class="timed">品牌：</span>
              <el-select
                class="search_title"
                filterable
                clearable
                v-model="search.brandCode"
                size="mini"
                placeholder="请选择品牌"
              >
                <el-option
                  v-for="(item,index) in brandList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span class="timed">原产地：</span>
              <el-select
                class="search_title"
                filterable
                clearable
                v-model="search.originCode"
                size="mini"
                placeholder="请选择原产地"
              >
                <el-option
                  v-for="(item,index) in originList"
                  :key="index"
                  :label="item.NameCN"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button
                v-if="checkBtn('func_common_search')"
                class="search_btn pan-btn green-btn"
                @click="getGoodsData"
                type="success"
                size="mini"
                icon="el-icon-search"
              >查询</el-button>
              <el-button
                class="search_btn pan-btn tiffany-btn"
                @click="reSearch"
                type="info"
                size="mini"
                icon="el-icon-refresh"
              >重置搜索条件</el-button>
              <el-button
                v-if="checkBtn('func_common_add')"
                @click="jumpAdd(-1)"
                class="pan-btn green-btn"
                type="success"
                size="mini"
                icon="el-icon-plus"
              >添加SKU</el-button>
              <el-button
                v-if="checkBtn('func_sku_batchchangeprice')"
                class="pan-btn blue-btn"
                type="success"
                size="mini"
                @click="onImport"
              >批量改价</el-button>
              <el-button
                v-if="checkBtn('func_sku_exportsku')"
                class="pan-btn blue-btn"
                type="success"
                size="mini"
                @click="exoprtSkuLists"
              >导出SKU</el-button>
              <a class="a_load" href="static/file/batch_import_sku_price.xls">下载批量改价模板</a>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox">
          <el-row>
            <el-col>
              <el-button
                v-if="checkBtn('func_sku_batch_down') && search.Status != 2"
                :disabled="multipleList.length < 1"
                @click="downAllGoods"
                class="pan-btn green-btn"
                type="success"
                size="mini"
              >批量{{ search.Status == 0 ? "上架" : "下架" }}</el-button>
              <el-button
                v-if="search.Status == 2 && checkBtn('func_common_batchapprove')"
                :disabled="multipleList.length < 1"
                @click="batchSh"
                class="pan-btn green-btn"
                type="success"
                size="mini"
              >批量审核价格</el-button>
              <!-- <el-button :disabled='multipleList.length < 1' @click='delAllGoods' class="pan-btn red-btn" type="danger" size="mini">批量删除</el-button> -->
            </el-col>
          </el-row>
          <el-table
            @selection-change="changeFun"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="商品信息" align="center" width="580" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-table :data="scope.row.childSkuList" border fit highlight-current-row>
                  <el-table-column label="基础信息" align="center" width="280" :resizable="false">
                    <template slot-scope="scope">
                      <div class="skuItem">
                        <img v-if="scope.row.Image" :src="scope.row.Image" />
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
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="发货方式" align="center" width="115">
              <template slot-scope="scope">
                <span v-if="scope.row.OrderType == 1">跨境直邮</span>
                <span v-if="scope.row.OrderType == 2">保税备货</span>
                <span v-if="scope.row.OrderType == 3">一般贸易</span>
              </template>
            </el-table-column>
            <el-table-column
              label="品类"
              prop="FullCategoryName"
              align="center"
              width="270"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="操作时间"
              prop="FullCategoryName"
              align="center"
              width="250"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-tag class="mb" type="success">上架时间：{{scope.row.StatusDate}}</el-tag>
                <br />
                <el-tag class="mb" type="warning">更新时间：{{scope.row.DateModified}}</el-tag>
                <!-- <br/>
                <el-tag type='info'>失效时间：{{scope.row.DateExpiration}}</el-tag>-->
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template slot-scope="scope">
                <el-button
                  v-if="checkBtn('func_common_edit')"
                  class="pan-btn blue-btn mb"
                  type="primary"
                  @click="jumpAdd(scope.row)"
                  size="mini"
                  icon="el-icon-edit"
                >编辑</el-button>
                <br />
                <el-button
                  v-if="search.Status == 0 && checkBtn('func_sku_down')"
                  class="pan-btn green-btn mb"
                  type="success"
                  @click="downGoods(scope.row)"
                  size="mini"
                  icon="el-icon-upload2"
                >上架</el-button>
                <el-button
                  v-if="search.Status == 1 && checkBtn('func_sku_down')"
                  class="pan-btn yellow-btn mb"
                  type="warning"
                  @click="downGoods(scope.row)"
                  size="mini"
                  icon="el-icon-download"
                >下架</el-button>
                <el-button
                  v-if="search.Status == 2 && checkBtn('func_common_approve')"
                  class="pan-btn green-btn mb"
                  type="success"
                  @click="downGoods(scope.row)"
                  size="mini"
                  icon="el-icon-upload2"
                >通过审核</el-button>
                <br />
                <el-button
                  v-if="checkBtn('func_common_delete')"
                  class="pan-btn red-btn mb"
                  type="warning"
                  @click="deleteGoods(scope.row)"
                  size="mini"
                  icon="el-icon-close"
                >删除</el-button>
                <br />
                <el-button
                  v-if="checkBtn('func_common_historyprice')"
                  class="pan-btn yellow-btn mb"
                  type="warning"
                  @click="gethis(scope.row)"
                  size="mini"
                >查看历史价格</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[15,30,50,100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next"
              :total="totalRows"
            ></el-pagination>
          </div>
        </div>
        <el-dialog title="批量改价" :visible.sync="showImport" width="24%" center @close="initUpFile">
          <div class="choice_group">
            <div class="input_group">
              <input type="file" ref="fileEl" id="fileEl" @change="fileChange($event)" />
              <input type="text" v-model="uploadFile.name" class="file_text" placeholder="选择文件" />
              <span class="el-icon-circle-close" @click="deleteFile" v-if="uploadFile.name"></span>
            </div>
            <el-button
              class="pan-btn blue-btn"
              type="primary"
              @click="upFile"
              icon="el-icon-upload"
              :disabled="fileLoading"
              :loading="fileLoading"
            >上传文件</el-button>
          </div>
          <div style="padding-top:15px;" v-if="upfileerror != ''">
            <p style="color:#ff0000">{{ upfileerror }}</p>
            <el-button type="text" @click="jumpDown">点击下载结果</el-button>
          </div>
        </el-dialog>
        <el-dialog title="改价详情" :visible.sync="dialogVisible" width="70%" center>
          <el-row>
            <el-col :span="5">
              <span class="timed">贸易类型：</span>
              <el-select class="search_title" v-model="price_orderType" size="mini">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="跨境直邮" :value="1"></el-option>
                <el-option label="保税备货" :value="2"></el-option>
                <el-option label="一般贸易" :value="3"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span class="timed" style="flex:0 0 150px;">操作人：</span>
              <el-input
                style="margin-left:10px;"
                clearable
                v-model="price_username"
                class="search_title"
                size="mini"
                placeholder="操作人"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <span class="timed">时间段：</span>
              <el-date-picker
                size="mini"
                v-model="price_date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
              ></el-date-picker>
              <el-button class="search_btn" @click="getpriceList" type="success" size="mini">查询</el-button>
            </el-col>
          </el-row>
          <el-table :data="pricelist" border fit highlight-current-row style="width: 100%">
            <el-table-column
              label="SKU名称"
              prop="SKuName"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="SKU规格"
              prop="SKuStandardName"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="贸易类型"
              prop="OrderTypeDesc"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="改价前" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p style="margin:0">成本价：{{ scope.row.BeforeCostPrice }}元</p>
                <p style="margin:0">批发价：{{ scope.row.BeforePrice }}元</p>
                <p style="margin:0">零售价：{{ scope.row.BeforeRetailPrice }}元</p>
              </template>
            </el-table-column>
            <el-table-column label="改价后" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p style="margin:0">成本价：{{ scope.row.AfterCostPrice }}元</p>
                <p style="margin:0">批发价：{{ scope.row.AfterPrice }}元</p>
                <p style="margin:0">零售价：{{ scope.row.AfterRetailPrice }}元</p>
              </template>
            </el-table-column>
            <el-table-column
              label="时间"
              prop="DateAdded"
              align="center"
              :show-overflow-tooltip="true"
              width="240"
            >
              <template slot-scope="scope">
                <p style="margin:0">修改时间：{{ scope.row.DateAdded }}</p>
                <p style="margin:0">审核时间：{{ scope.row.AuditDateAdded }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作人" prop="UserName" align="left" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p style="margin:0">操作人：{{ scope.row.UserName }}</p>
                <p style="margin:0">审核人：{{ scope.row.AuditUserName }}</p>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="pageIndex2"
              :page-sizes="[15,30,50,100]"
              :page-size="pageSize2"
              layout="total, sizes, prev, pager, next"
              :total="totalRows2"
            ></el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import {
  getSkuList,
  getSkuForId,
  batchChangePrice,
  exportSkuList
} from "@/api/adv/recGoods";
import { getOriginList } from "@/api/brand/origin";
import { getBrandList } from "@/api/brand/index";
import { parseTime } from "@/utils/index";
import axios from "axios";
import { delSkuGoods, downSkuGoods, gethisprice } from "@/api/sku/skulist";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      upfileerror: "",
      pricelist: [],
      price_date: [],
      priceId: "",
      pageIndex2: 1,
      pageSize2: 15,
      price_orderType: -1,
      totalRows2: 0,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      fileLoading: false,
      showImport: false,
      price_username: "",
      uploadFile: {},
      multipleList: [],
      search: {
        SkuId: "",
        OrderType: "",
        Name: "",
        Labels: "",
        sn: "",
        ExtSN: "",
        Status: 1,
        brandCode: "",
        originCode: ""
      },
      orderTypeList: [
        {
          Name: "保税备货",
          Code: "2"
        },
        {
          Name: "跨境直邮",
          Code: "1"
        },
        {
          Name: "一般贸易",
          Code: "3"
        }
      ],
      dialogVisible: false,
      baseSearch: {},
      list: [],
      brandList: [],
      originList: [],
      typelist: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      CurCode: "",
      roleBtn: [],
      jumpdownlink: "",
      defaultProps: {
        children: "ChildMenu",
        label: "Name",
        isLeaf: "IsLeaf"
      }
    };
  },
  activated() {
    this.CurCode = "";
    this.getGoodsData();
    this.getOrigin();
    this.getBrand();
    this.getData().then(res => {
      this.typelist = res;
    });
  },
  created() {
    this.baseSearch = JSON.parse(JSON.stringify(this.search));
    this.CurCode = "";
    this.getGoodsData();
    this.getOrigin();
    this.getBrand();
    this.getData().then(res => {
      this.typelist = res;
    });
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  methods: {
    handleSizeChange2(v) {
      this.pageSize2 = v;
      this.getpriceList();
    },
    handleCurrentChange2(v) {
      this.pageIndex2 = v;
      this.getpriceList();
    },
    getpriceList() {
      gethisprice({
        skuId: this.priceId,
        orderType: this.price_orderType,
        userName: this.price_username,
        dateRange1: this.price_date,
        pageIndex: this.pageIndex2,
        pagesize: this.pageSize2
      }).then(res => {
        res.Data.map(v => {
          v.DateAdded = formatDateTime(v.DateAdded);
          v.AuditDateAdded = formatDateTime(v.AuditDateAdded);
        });
        this.pricelist = res.Data;
        this.totalRows2 = res.TotalRows;
      });
    },
    gethis(row) {
      this.priceId = row.Id;
      this.price_orderType = -1;
      this.price_username = "";
      this.price_date = null;
      this.pageIndex2 = 1;
      this.pageSize2 = 15;
      this.getpriceList();
      this.dialogVisible = true;
    },
    batchSh() {
      this.$confirm("确定要批量审核这些SKU吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        const arr = this.multipleList.map(v => {
          return v.Id;
        });
        downSkuGoods({
          Id: arr.join(","),
          Status: 1
        }).then(() => {
          this.$message.success("操作成功！");
          this.reSearch();
        });
      });
    },
    exoprtSkuLists() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        cateCode: this.$refs.tree
          ? this.$refs.tree.getCurrentNode()
            ? this.$refs.tree.getCurrentNode().Code
            : ""
          : ""
      });
      exportSkuList(p).then(res => {
        window.open(res.fileLink, "_blank");
      });
    },
    onImport() {
      this.showImport = true;
    },
    initUpFile() {
      this.deleteFile();
    },
    deleteFile() {
      this.uploadFile = {};
      this.$refs.fileEl.value = "";
      this.upfileerror = "";
      this.jumpdownlink = "";
    },
    fileChange(e) {
      const file = e.currentTarget.files[0];
      if (!file) return;
      this.uploadFile = file;
      const arr = this.uploadFile.name.split(".");
      if (
        !(arr[arr.length - 1] === "xls") &&
        !(arr[arr.length - 1] === "xlsx")
      ) {
        this.uploadFile = {};
        this.$message.error("请选择.xls或者.xlsx格式的表格文件！");
      }
    },
    upFile() {
      if (!this.uploadFile.name) {
        this.$message.error("请先选择文件");
        return;
      }
      const f = new FormData();
      f.append(this.uploadFile.name, this.uploadFile);
      this.fileLoading = true;
      const token = window.localStorage.getItem("Token");
      const api =
        window._config.fileServer +
        "/f/upload/300002/?partnerId=10000&token=" +
        token;
      axios.post(api, f).then(res => {
        if (res.data.ResponseId === 0) {
          batchChangePrice({
            fileName: res.data.Data.fileName,
            fileLink: res.data.Data.fileLink,
            fileUrl: res.data.Data.fileUrl
          })
            .then(response => {
              this.fileLoading = false;
              // this.showImport = false
              this.upfileerror = response.message;
              this.jumpdownlink = response.fileLink;
              this.getGoodsData();
            })
            .catch(msg => {
              this.upfileerror = msg.Data;
              // this.$message.error(str)
              this.fileLoading = false;
            });
        } else {
          this.fileLoading = false;
          this.$message.error(res.data.Message);
        }
      });
    },
    jumpDown() {
      window.open(this.jumpdownlink, "_blank");
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
    handleSelect(v) {
      this.search.Status = v;
      this.getGoodsData();
    },
    delAllGoods() {
      this.$confirm("确定要删除这些SKU吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        const arr = this.multipleList.map(v => {
          return v.Id;
        });
        delSkuGoods({
          SkuIds: arr.join(",")
        }).then(() => {
          this.$message.success("删除成功！");
          this.reSearch();
        });
      });
    },
    downAllGoods() {
      const str = this.search.Status == 1 ? "下架" : "上架";
      this.$confirm("确定要" + str + "这些SKU吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const arr = this.multipleList.map(v => {
          return v.Id;
        });
        downSkuGoods({
          Id: arr.join(","),
          Status: this.search.Status == 1 ? 0 : 2
        }).then(() => {
          this.$message.success("操作成功！");
          this.reSearch();
        });
      });
    },
    changeFun(val) {
      this.multipleList = val;
    },
    jumpAdd(data) {
      this.$router.push({
        path: "/sku",
        query: {
          id: parseInt(data) === -1 ? -1 : data.Id
        }
      });
    },
    downGoods(row) {
      let str = "";
      let s = "";
      if (this.search.Status == 1) {
        str = "下架";
        s = 0;
      } else if (this.search.Status == 2) {
        str = "审核通过";
        s = 1;
      } else {
        str = "上架";
        s = 2;
      }
      this.$confirm("确定要" + str + "这个SKU吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        downSkuGoods({
          Id: row.Id,
          Status: s
        }).then(() => {
          this.$message.success("操作成功！");
          this.reSearch();
        });
      });
    },
    reSearch() {
      const s = this.search.Status;
      this.search = JSON.parse(JSON.stringify(this.baseSearch));
      this.search.Status = s;
      this.getGoodsData();
    },
    deleteGoods(row) {
      this.$confirm("确定要删除这个SKU吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSkuGoods({ SkuIds: row.Id }).then(() => {
          this.$message.success("删除成功");
          this.reSearch();
        });
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getGoodsData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getGoodsData();
    },
    loadNode(node, resolve) {
      if (node.level === 0) return;
      this.CurCode = node.data.Code;
      this.getData().then(res => {
        resolve(res);
      });
    },
    jump() {
      this.$router.push("/skucategorymanage");
    },
    getGoodsData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        cateCode: this.$refs.tree
          ? this.$refs.tree.getCurrentNode()
            ? this.$refs.tree.getCurrentNode().Code
            : ""
          : ""
      });
      getSkuForId(p).then(res => {
        res.Data.map(v => {
          v.DateExpiration = parseTime(v.DateExpiration);
          v.DateModified = parseTime(v.DateModified);
          v.StatusDate = parseTime(v.StatusDate);
        });
        this.list = res.Data;
        this.list.forEach(element => {
          element.childSkuList.forEach(item => {
            if (item.Image) {
              if (item.Image.indexOf("/u/") != -1) {
                let newImage = item.Image.substring(
                  item.Image.indexOf("/u/"),
                  item.Image.length
                );
                let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
                item.Image = signUrl;
              } else {
                let signUrl = window.ali_oss_data.URL_IMG_SHOW + item.Image;
                item.Image = signUrl;
              }
            }
          });
        });
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    },
    getBrand() {
      getBrandList({ InUse: 1, pageSize: 9999 }).then(res => {
        this.brandList = res.Data;
      });
    },
    getOrigin() {
      getOriginList({ InUse: 1, pageSize: 9999 }).then(res => {
        this.originList = res.Data;
      });
    },
    getData() {
      return new Promise((rs, rj) => {
        getSkuList({
          CurCode: this.CurCode
        }).then(res => {
          rs(res);
        });
      });
    }
  }
};
</script>
<style scoped lang="scss">
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

.title .add {
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

.skuItem {
  display: flex;
  img {
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
  }
  // p {
  //   line-height: 55px;
  //   text-indent: 10px;
  // }
}

.mb {
  margin-bottom: 5px;
}
</style>