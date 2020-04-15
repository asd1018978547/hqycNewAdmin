<template>
  <div class="content_box roleadd addGoods addsku sku">
    <m-title title="分销商SKU上架详情"></m-title>
    <div class="desc">
      <div class="item">
        <div class="title">分销商姓名：</div>
        <div class="item_desc" style="font-size:18px;">{{ $route.query.name }}</div>
      </div>
      <div class="item">
        <div class="item_desc">
          <div class="searchBox">
            <el-row>
              <el-col :span="4">
                <span class="timed">SKU名称：</span>
                <el-input
                  clearable
                  v-model="info_skuname"
                  class="search_title"
                  size="mini"
                  placeholder="输入SKU名称"
                ></el-input>
              </el-col>
              <el-col :span="4">
                <span class="timed">SN：</span>
                <el-input v-model="info_sn" class="search_title" size="mini" placeholder="输入SN"></el-input>
              </el-col>
              <el-col :span="5">
                <span class="timed">状态：</span>
                <el-select
                  class="search_title"
                  filterable
                  clearable
                  v-model="info_status"
                  size="small"
                  placeholder="请选择状态"
                >
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="上架" value="1"></el-option>
                  <el-option label="待审核" value="2"></el-option>
                  <el-option label="下架" value="0"></el-option>
                </el-select>
              </el-col>
              <!-- <el-col :span="4">
                <span class="timed">贸易类型：</span>
                <el-select class="search_title" clearable v-model='info_orderType' size="small" placeholder="请选择订单来源">
            <el-option v-for="item in orderTypeList" :key="item.val" :label="item.label" :value="item.val">
            </el-option>
          </el-select>
              </el-col>-->
              <el-col :span="4">
                <el-button
                  style="margin-left:10px;"
                  class="search_btn pan-btn green-btn"
                  @click="getInfo(1)"
                  type="success"
                  size="mini"
                >查询</el-button>
                <el-button
                  @click="showModel"
                  class="title_btn pan-btn green-btn"
                  type="success"
                  size="mini"
                >新增SKU</el-button>
                <el-button
                  class="search_btn pan-btn green-btn"
                  @click="batchUp"
                  type="success"
                  size="mini"
                >批量上架</el-button>
                <el-button
                  class="search_btn pan-btn red-btn"
                  @click="batchDown"
                  type="danger"
                  size="mini"
                >批量下架</el-button>
                <el-button
                  class="search_btn pan-btn green-btn"
                  @click="batchCreatePrice"
                  type="success"
                  size="mini"
                >一键生成供货价</el-button>
                <el-button
                  class="search_btn pan-btn green-btn"
                  @click="batchshenhe"
                  type="success"
                  size="mini"
                >批量审核</el-button>
                <el-button
                  class="search_btn pan-btn green-btn"
                  @click="daochu"
                  type="success"
                  size="mini"
                >导出SKU</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <el-table
        ref="table"
        :data="infoData"
        border
        cell-class-name="brand_td"
        :span-method="objectSpanMethod2"
        width="100%"
      >
        <el-table-column
          prop="Name"
          label="SKU名称"
          align="center"
          width="300"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- <el-table-column prop="BrandName" label="SKU品牌" align="center" width="150" :show-overflow-tooltip="true">
        </el-table-column>-->
        <el-table-column prop="cd.OrderType" label="贸易类型" align="center" width="100"></el-table-column>
        <el-table-column
          prop="cd.SN"
          label="SN"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="cd.StandardInfo" label="规格" align="center"></el-table-column>
        <el-table-column prop="cd.CostPrice" label="成本价（元）" align="center" width="100"></el-table-column>
        <el-table-column prop="cd.SkuDesc" label="备注" align="center" width="100"></el-table-column>
        <el-table-column prop="cd.Amount" label="库存" align="center" width="100"></el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cd.Status == 1" type="success">上架</el-tag>
            <el-tag v-if="scope.row.cd.Status == 0" type="danger">下架</el-tag>
            <el-tag v-if="scope.row.cd.Status == 2" type="warning">{{ scope.row.cd.StatusDesc }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="规格信息" width="150" align="center">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.cd.SkuSpecs" :key="index">
              {{ item.SpecNumber + item.Unit }} :
              {{ item.SupplyPrice }}元
            </p>
          </template>
        </el-table-column>
        <el-table-column label="审核信息" width="150" align="center">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.cd.AuditSkuSpecs" :key="index">
              {{ item.AuditSpecNumber + item.Unit }} :
              {{ item.AuditSupplyPrice }}元
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleCheck(scope.row)">修改规格</el-button>
            <el-button
              type="text"
              size="mini"
              @click="editTime(scope.row)"
              style="margin-left:0"
            >编辑备注</el-button>
            <el-button
              v-if="scope.row.cd.Status == 0"
              @click="up(scope.row)"
              type="text"
              size="mini"
              style="margin-left:0"
            >上架</el-button>
            <br />
            <el-button
              v-if="scope.row.cd.Status == 1"
              @click="down(scope.row)"
              type="text"
              size="mini"
              style="margin-left:0"
            >下架</el-button>
            <el-button type="text" size="mini" @click="gethis(scope.row)">改价详情</el-button>
            <el-button
              v-if="scope.row.cd.Status == 2"
              @click="shenhe(scope.row)"
              type="text"
              size="mini"
              style="margin-left:0"
            >审核通过</el-button>
            <el-button @click="delInfoGoods(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template slot="header" slot-scope="scope">
            <el-checkbox @change="check_all_Info" label="全选" v-model="info_check_all"></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.cd.check"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scopes">
            <el-table border :data="scopes.row.cd.SkuSpecs" style="width: 50%">
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column prop="SpecNumber" label="数量" align="center">
                <template slot-scope="scope">
                  <el-input :disabled="!scope.row.edit" v-model="scope.row.SpecNumber" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Unit" label="单位" align="center"></el-table-column>
              <el-table-column prop="SupplyPrice" label="价格（元）" align="center">
                <template slot-scope="scope">
                  <el-input :disabled="!scope.row.edit" v-model="scope.row.SupplyPrice" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="150">
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.edit"
                    type="text"
                    size="mini"
                    @click="scope.row.edit = true"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="delSkuSpecs(scope.row, scopes.row.cd, scope)"
                  >删除规格</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              type="primary"
              size="mini"
              style="margin-top:20px"
              @click="addSkuSpecs(scopes.row.cd)"
            >添加规格</el-button>
            <el-button
              type="success"
              size="mini"
              style="margin-top:20px"
              @click="saveSkuSpecs(scopes.row.cd, scopes.row)"
            >提交保存</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right;padding:10px 0;"
        @size-change="infoSizeChange"
        @current-change="infoCurrentChange"
        :page-sizes="[15,20,30,100,200]"
        :page-size="info_pageSize"
        layout="total,prev, pager, next, jumper, sizes"
        :total="info_total"
      ></el-pagination>
    </div>
    <el-dialog
      title="选择SKU"
      @close="gv = false"
      :visible="gv"
      width="90%"
      :close-on-click-modal="false"
    >
      <div class="goods recgoods goodsdialog">
        <div class="goods_left">
          <el-tree
            @node-click="getnodedata"
            accordion
            :data="cateData"
            :props="cateOpt"
            :load="lazyCateData"
            lazy
          ></el-tree>
        </div>
        <div class="goods_right">
          <div class="searchBox">
            <el-row>
              <el-col :span="6">
                <span class="timed">SKU名称：</span>
                <el-input
                  clearable
                  v-model="goods_skuname"
                  class="search_title"
                  size="small"
                  placeholder="输入SKU名称"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <span class="timed">SN：</span>
                <el-input v-model="goods_sn" class="search_title" size="small" placeholder="输入SN"></el-input>
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
          <el-table
            :data="goodsData"
            border
            cell-class-name="brand_td"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              prop="Name"
              label="SKU名称"
              align="center"
              width="300"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="BrandName"
              label="SKU品牌"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="cd.OrderType" label="贸易类型" align="center" width="100"></el-table-column>
            <el-table-column
              prop="cd.SN"
              label="SN"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="cd.StandardInfo" label="规格" align="center"></el-table-column>
            <el-table-column prop="cd.CostPrice" label="成本价（元）" align="center" width="100"></el-table-column>
            <el-table-column label="全选" align="center" width="100">
              <template slot="header" slot-scope="scope">
                <el-checkbox @change="check_all_goods" label="全选" v-model="goods_check_all"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.cd.check"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align:right;padding:10px 0;"
            @size-change="goodsSizeChange"
            @current-change="goodsCurrentChange"
            :page-sizes="[15,20,30,100,200]"
            :page-size="goodsPageSize"
            layout="total,prev, pager, next, jumper, sizes"
            :total="goodsTotal"
          ></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gv = false">取 消</el-button>
        <el-button @click="add_goods" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="改价详情" :visible.sync="dialogVisible" width="70%" center>
      <el-row>
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
          <el-button
            style="margin-left:15px"
            class="search_btn"
            @click="getpriceList"
            type="success"
            size="mini"
          >查询</el-button>
        </el-col>
      </el-row>
      <el-table :data="pricelist" border fit highlight-current-row style="width: 100%">
        <el-table-column label="SKU名称" prop="Name" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          width="150"
          label="批次号"
          prop="BatchNo"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="改价详情" align="left" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.SkusHistoryPriceDetail" :key="index">
              <p style="margin:0">
                数量：{{ item.SpecNumber }}
                <span style="display:inline-block;padding-left:10px;"></span>
                改价前：{{ item.BeforPrice }}元
                <span
                  style="display:inline-block;padding-left:10px;"
                ></span>
                改价后：{{ item.AfterPrice }}元
              </p>
            </div>
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
          :page-sizes="[15,30,50,100,200]"
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
</template>

<script>
import MTitle from "@/components/MTitle";
import { formatDateTime } from "@/utils/index";
import {
  editSkuSpecs,
  getfenxiaoshangskugaijie,
  getRetailTraderSkuList,
  getRetailTraderInfo,
  addRetailTraderSku,
  upDownSku,
  editPrice,
  delSku,
  shenhetongyi,
  daochusku,
  batchCreate,
  editSkuTime
} from "@/api/retailTraderSkuManage/retailTraderSkuManage";
import { getSkuList } from "@/api/adv/recGoods";
export default {
  components: { MTitle },
  data() {
    return {
      pricelist: [],
      pageIndex2: 1,
      pageSize2: 15,
      totalRows2: 0,
      price_orderType: -1,
      price_username: "",
      price_date: [],
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
      dialogVisible: false,
      gv: false,
      goods_check_all: false,
      goodsPageIndex: 1,
      goodsPageSize: 15,
      goods_skuname: "",
      goods_sn: "",
      info_skuname: "",
      info_TotalPages: 0,
      info_status: "-1",
      info_orderType: 2,
      info_sn: "",
      goodsTotal: 0,
      cateData: [],
      cateOpt: {
        label: "Name"
      },
      cateCode: "",
      goodsData: [],
      info_check_all: false,
      info_pageSize: 15,
      info_pageIndex: 1,
      infoData: [],
      info_total: 0
    };
  },
  activated() {
    getSkuList().then(res => {
      this.cateData = res;
      this.getSkuList();
      this.getInfo();
    });
  },
  methods: {
    // render 事件
    // renderHeader(h, { column }) {
    //   // h即为cerateElement的简写，具体可看vue官方文档
    //   return h("div", [
    //     h("el-checkbox", {
    //       on: {
    //         change: this.check_all_goods // 选中事件
    //       },
    //       'value': this.goods_check_all,
    //       label:'全选'
    //     })
    //   ]);
    // },
    daochu() {
      daochusku({
        partnerId: this.$route.query.id,
        name: this.info_skuname,
        orderType: this.info_orderType,
        sn: this.info_sn,
        status: this.info_status,
        pageIndex: this.info_pageIndex,
        pageSize: this.info_pageSize
      }).then(res => {
        window.open(res.fileLink, "_blank");
      });
    },
    handleSizeChange2(v) {
      this.pageSize2 = v;
      this.getpriceList();
    },
    handleCurrentChange2(v) {
      this.pageIndex2 = v;
      this.getpriceList();
    },
    getpriceList() {
      getfenxiaoshangskugaijie({
        skuId: this.priceId,
        partnerId: this.$route.query.id,
        orderType: this.price_orderType,
        userName: this.price_username,
        startDate: this.price_date ? this.price_date[0] : "",
        endData: this.price_date ? this.price_date[1] : "",
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
      this.priceId = row.cd.SkuId;
      this.price_orderType = row.cd.ot;
      this.price_username = "";
      this.price_date = null;
      this.pageIndex2 = 1;
      this.pageSize2 = 15;
      this.getpriceList();
      this.dialogVisible = true;
    },
    batchshenhe() {
      let a = [];
      this.infoData.map(v => {
        if (v.cd.Status == 2 && v.cd.check) {
          a.push({
            skuid: v.cd.SkuId,
            pskuid: v.cd.PSkuId,
            orderType: v.cd.ot
          });
        }
      });
      if (a.length < 1) {
        this.$message.error("请至少选择一个SKU");
        return;
      }
      shenhetongyi({
        skus: a,
        partnerId: this.$route.query.id,
        status: 1
      }).then(() => {
        this.$message.success("操作成功");
        this.getInfo();
        this.check_all_Info(false);
      });
    },
    shenhe(row) {
      shenhetongyi({
        skus: [
          {
            skuid: row.cd.SkuId,
            pskuid: row.cd.PSkuId,
            orderType: row.cd.ot
          }
        ],
        partnerId: this.$route.query.id,
        status: 1
      }).then(() => {
        this.$message.success("操作成功");
        this.getInfo();
        this.check_all_Info(false);
      });
    },
    batchCreatePrice() {
      let data = [];
      this.infoData.map(v => {
        if (v.cd.check) {
          data.push(v);
        }
      });
      if (data.length < 1) {
        this.$message.error("请至少选择一个SKU");
        return;
      }
      let p = {
        partnerId: this.$route.query.id,
        skuSpecs: []
      };
      data.map(v => {
        p.skuSpecs.push({
          skuId: v.cd.SkuId,
          orderType: v.cd.ot
        });
      });
      batchCreate(p).then(() => {
        this.$message.success("生成成功");
        this.info_pageSize = 15;
        this.info_pageIndex = 1;
        this.getInfo();
        this.check_all_Info(false);
      });
    },
    editTime(row) {
      this.$prompt("", "请输入备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.cd.SkuDesc
      }).then(({ value }) => {
        editSkuTime({
          partnerId: this.$route.query.id,
          skuId: row.cd.SkuId,
          orderType: row.cd.ot,
          SkuDesc: value
        }).then(res => {
          this.$message.success("修改备注成功");
          getSkuList().then(res => {
            this.cateData = res;
            this.getSkuList();
            this.getInfo();
          });
        });
      });
    },
    delSkuSpecs(spe, row, spe_index) {
      if (row.SkuSpecs.length === 1) {
        this.$message.error("请至少保留一个规格");
        return;
      }
      this.$confirm("确定要删除这个规格么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const a = JSON.parse(JSON.stringify(this.infoData));
        let o = null;
        let arr = [];
        for (let index = 0; index < a.length; index++) {
          if (a[index].cd.SkuId === row.SkuId) {
            o = index;
            arr = a[index].cd.SkuSpecs;
            arr.map((v, vi) => {
              if (
                v.SpecNumber === spe.SpecNumber &&
                v.SupplyPrice === spe.SupplyPrice &&
                vi === spe_index.$index
              ) {
                arr.splice(vi, 1);
              }
            });
          }
        }
        this.$set(this.infoData[o].cd, "SkuSpecs", arr);
      });
    },
    isRepeat(arr) {
      const hash = {};
      for (const i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },
    addSkuSpecs(row) {
      const a = JSON.parse(JSON.stringify(this.infoData));
      let o = null;
      let arr = [];
      for (let index = 0; index < a.length; index++) {
        if (a[index].cd.SkuId === row.SkuId) {
          o = index;
          arr = a[index].cd.SkuSpecs;
          arr.push({
            SkuId: row.SkuId,
            Unit: a[index].Unit,
            OrderType: row.ot,
            edit: true,
            SpecNumber: 0,
            SupplyPrice: 0
          });
        }
      }
      this.$set(this.infoData[o].cd, "SkuSpecs", arr);
    },
    saveSkuSpecs(row, brow) {
      const r = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
      let f1 = false;
      let f2 = false;
      const countArr = [];
      row.SkuSpecs.map(v => {
        if (!r.test(v.SupplyPrice) || v.SupplyPrice < 0.01) {
          f1 = true;
        }
        if (!/(^[1-9]\d*$)/.test(v.SpecNumber) || v.SpecNumber < 1) {
          f2 = true;
        }
        countArr.push(v.SpecNumber);
      });
      if (f1) {
        this.$message.error("供货价为0.01至999999.99之间的数字，请重新输入");
        return;
      }
      if (f2 || this.isRepeat(countArr)) {
        this.$message.error(
          "SKU数量为1至9999之间的正整数，且不能重复，请重新输入"
        );
        return;
      }
      editSkuSpecs({
        skuId: row.SkuId,
        orderType: row.ot,
        partnerId: this.$route.query.id,
        skuSpecs: row.SkuSpecs
      }).then(res => {
        this.$message.success("编辑成功");
        this.info_pageIndex = 1;
        this.getInfo();
      });
    },
    handleCheck(row, f) {
      const $table = this.$refs.table;
      if (f !== undefined) {
        $table.toggleRowExpansion(row, f);
      } else {
        $table.toggleRowExpansion(row);
      }
    },
    editSupplyPrice(row) {
      const a = JSON.parse(JSON.stringify(this.infoData));
      a.map(v => {
        if (
          v.cd.SkuId === row.cd.SkuId &&
          v.cd.OrderType === row.cd.OrderType
        ) {
          v.cd.edit = true;
        }
      });
      this.infoData = a;
    },
    subSupplyPrice(row) {
      editPrice({
        skuId: row.cd.SkuId,
        orderType: row.cd.ot,
        partnerId: this.$route.query.id,
        supplyPrice: row.cd.SupplyPrice
      }).then(() => {
        this.$message.success("修改供货价成功！");
        this.getInfo();
      });
    },
    upDownSku(row) {
      const str = row.cd.Status === 1 ? "下架" : "上架";
      this.$confirm("确定要" + str + "这个sku吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        upDownSku({
          skus: [
            {
              skuid: row.cd.SkuId,
              pskuid: row.cd.PSkuId,
              orderType: row.cd.ot
            }
          ],
          partnerId: this.$route.query.id,
          status: row.cd.Status === 1 ? 0 : 1
        }).then(res => {
          this.$message.success(
            row.cd.Status === 1 ? "下架SKU成功" : "上架SKU成功"
          );
          this.getInfo();
          this.check_all_Info(false);
        });
      });
    },
    batchUpDownSku(row) {
      upDownSku({
        skus: row.ids,
        partnerId: this.$route.query.id,
        status: row.cd.Status === 1 ? 0 : 1
      }).then(res => {
        this.$message.success(
          row.cd.Status === 1 ? "下架SKU成功" : "上架SKU成功"
        );
        this.getInfo();
        this.check_all_Info(false);
      });
    },
    down(row) {
      this.upDownSku(row);
    },
    up(row) {
      this.upDownSku(row);
    },
    batchUp() {
      const a = [];
      this.infoData.map(v => {
        if (v.cd.check && v.cd.Status === 0) {
          a.push({
            pskuid: v.cd.PSkuId,
            skuid: v.cd.SkuId,
            orderType: v.cd.ot
          });
        } else {
          v.cd.check = false;
        }
      });
      if (a.length < 1) {
        this.$message.error("请至少选择一个下架状态的SKU");
        this.info_check_all = false;
      } else {
        this.batchUpDownSku({
          ids: a,
          cd: {
            Status: 0
          }
        });
      }
    },
    batchDown() {
      const a = [];
      this.infoData.map(v => {
        if (v.cd.check && v.cd.Status === 1) {
          a.push({
            pskuid: v.cd.PSkuId,
            skuid: v.cd.SkuId,
            orderType: v.cd.ot
          });
        } else {
          v.cd.check = false;
        }
      });
      if (a.length < 1) {
        this.$message.error("请至少选择一个上架状态的SKU");
        this.info_check_all = false;
      } else {
        this.batchUpDownSku({
          ids: a,
          cd: {
            Status: 1
          }
        });
      }
    },
    check_all_Info(val) {
      this.info_check_all = val;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const a = JSON.parse(JSON.stringify(this.infoData));
      a.map(v => {
        v.cd.check = val;
      });
      this.infoData = a;
      this.$nextTick(() => {
        loading.close();
      });
    },
    add_goods() {
      const items = [];
      this.goodsData.map(v => {
        if (v.cd.check) {
          items.push(v);
        }
      });
      if (items.length < 1) {
        this.$message.error("请至少选择一个商品");
        return;
      }
      const a = [];
      items.map(v => {
        a.push({
          orderType: v.cd.ot,
          amount: v.cd.Amount,
          skuId: v.cd.SkuId,
          pSkuId: v.cd.PSkuId
        });
      });
      const par = {
        partnerId: this.$route.query.id,
        skus: a
      };
      addRetailTraderSku(par).then(() => {
        this.$message.success("新增成功！");
        this.info_skuname = "";
        this.info_sn = "";
        this.gv = false;
        this.getSkuList();
        this.getInfo();
      });
    },
    onAdd() {},
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
    delInfoGoods(row) {
      this.$confirm("确定要删除这个sku吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSku({
          skuid: row.cd.SkuId,
          orderType: row.cd.ot,
          partnerId: this.$route.query.id,
          pskuid: row.cd.PSkuId
        }).then(() => {
          this.$message.success("删除成功");
          const arr = [];
          this.infoData.map(v => {
            if (v.cd.SkuId !== row.cd.SkuId) {
              arr.push(v);
            }
          });
          this.infoData = arr;
          this.getInfo();
        });
      });
    },
    infoSizeChange(v) {
      this.info_pageSize = v;
      this.info_pageIndex = 1;
      this.getInfo();
    },
    infoCurrentChange(v) {
      this.info_pageIndex = v;
      this.getInfo();
    },
    getInfo(v) {
      if (v) {
        this.info_pageIndex = 1;
      }
      getRetailTraderInfo({
        partnerId: this.$route.query.id,
        name: this.info_skuname,
        orderType: this.info_orderType,
        sn: this.info_sn,
        status: this.info_status,
        pageIndex: this.info_pageIndex,
        pageSize: this.info_pageSize
      }).then(res => {
        res.Data.map(v => {
          const sd = [];
          v.SkuStandardDetails.OrderTypeList1.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.SkuStandardDetails.OrderTypeList2.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.SkuStandardDetails.OrderTypeList3.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.sd = sd;
        });
        const arr = [];
        for (let x = 0; x < res.Data.length; x++) {
          for (let i = 0; i < res.Data[x].sd.length; i++) {
            let o = {};
            o = res.Data[x];
            o.cd = res.Data[x].sd[i];
            o.cd.check = false;
            o.edit = false;
            o.cd.SkuSpecs.map(specitem => {
              specitem.edit = false;
            });
            arr.push(JSON.parse(JSON.stringify(o)));
          }
        }
        this.info_check_all = false;
        this.info_total = res.TotalRows;
        this.info_pageIndex = res.PageIndex;
        this.infoData = [];
        this.infoData = arr;
        if (arr.length === 0 && this.info_pageIndex !== 1) {
          this.info_pageIndex = 1;
          this.getInfo();
        }
      });
    },
    showModel() {
      this.gv = true;
    },
    check_all_goods(val) {
      console.log(this.goods_check_all)
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const a = JSON.parse(JSON.stringify(this.goodsData));
      a.map(v => {
        v.cd.check = val;
      });
      this.goodsData = a;
      this.$nextTick(() => {
        loading.close();
      });
    },
    goodsSizeChange(v) {
      this.goodsPageSize = v;
      this.getSkuList();
    },
    goodsCurrentChange(v) {
      this.goodsPageIndex = v;
      this.getSkuList();
    },
    getGoods() {
      this.getSkuList();
    },
    getSkuList() {
      getRetailTraderSkuList({
        cateCode: this.cateCode,
        name: this.goods_skuname,
        sn: this.goods_sn,
        orderType: 2,
        partnerId: this.$route.query.id,
        pageIndex: this.goodsPageIndex,
        pageSize: this.goodsPageSize
      }).then(res => {
        res.Data.map(v => {
          const sd = [];
          v.SkuStandardDetails.OrderTypeList1.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.SkuStandardDetails.OrderTypeList2.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.SkuStandardDetails.OrderTypeList3.map(item => {
            item.ot = item.OrderType;
            item.OrderType =
              item.OrderType === 1
                ? "跨境直邮"
                : item.OrderType === 2
                ? "保税备货"
                : "一般贸易";
            sd.push(item);
          });
          v.sd = sd;
        });
        const arr = [];
        for (let x = 0; x < res.Data.length; x++) {
          for (let i = 0; i < res.Data[x].sd.length; i++) {
            let o = {};
            o = res.Data[x];
            o.cd = res.Data[x].sd[i];
            o.cd.check = false;
            o.cd.SupplyPrice = 0;
            arr.push(JSON.parse(JSON.stringify(o)));
          }
        }
        this.goodsTotal = res.TotalRows;
        this.goodsData = arr;
        this.goods_check_all = false;
      });
    },
    getnodedata(data) {
      this.cateCode = data.Code;
      this.pageIndex = 1;
      this.getSkuList();
    },
    lazyCateData(node, resolve) {
      if (node.level >= 1) {
        this.getMoreCate(node.data.Code, resolve);
      } else {
        resolve(this.cateData);
      }
    },
    getMoreCate(val, resolve) {
      this.pageIndex = 1;
      getSkuList({
        curCode: val
      }).then(res => {
        resolve(res);
      });
    },
    objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: row.sd.length,
            colspan: 1
          };
        } else if (this.infoData[rowIndex - 1].SkuId === row.SkuId) {
          return [0, 0];
        } else {
          return {
            rowspan: row.sd.length,
            colspan: 1
          };
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex === 0) {
          return {
            rowspan: row.sd.length,
            colspan: 1
          };
        } else if (this.goodsData[rowIndex - 1].SkuId === row.SkuId) {
          return [0, 0];
        } else {
          return {
            rowspan: row.sd.length,
            colspan: 1
          };
        }
      }
    }
  }
};
</script>

<style>
@import url("//unpkg.com/element-ui@2.4.0/lib/theme-chalk/index.css");

.el-table__expand-column .cell {
  display: none;
}
.desc {
  padding: 0 15px;
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
  border-bottom: 1px solid #333;
}

.desc .item {
  line-height: 40px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 150px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 1;
}

.desc .item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
}
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
