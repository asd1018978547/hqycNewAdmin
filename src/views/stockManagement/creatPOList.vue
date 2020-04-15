<template>
  <!-- 新建PO单 -->
  <div class="main content_box orderdetail roleadd od">
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
        style="margin-top:20px"
      >
        <el-collapse-item title="PO单基本信息" name="1">
          <el-row :gutter="20" class="mb0">
            <el-col :span="8">
              <el-form-item label="备货方式:" prop="GoodsStockUpWay">
                <el-select
                  style="width:200px"
                  v-model="ruleForm.GoodsStockUpWay"
                  placeholder="请选择"
                >
                  <el-option label="商户自行备货" :value="1"></el-option>
                  <el-option label="海外仓集货" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="舱单号:">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.ManifestNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="航次(班)号:">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.VoyageNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="提运单:" prop="AssBillNo">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.AssBillNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="件数:" prop="PackQty">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.PackQty"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="净重合计(kg):" prop="TotalGrossWeight">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.TotalGrossWeight"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="ruleForm.GoodsStockUpWay == '1'">
              <el-form-item label="毛重合计(kg):" prop="TotalNetWeight">
                <el-input
                  style="width:200px"
                  v-model="ruleForm.TotalNetWeight"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item title="PO单商品信息" name="2">
          <el-button size="mini" type="primary" @click="addOrder"
            >添加订单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="delOrder"
            :disabled="flag_deleteOder"
            >删除订单</el-button
          >
          <el-table
            class="gdInfo"
            :data="baseInfo.POMaintainDetailList"
            border
            @selection-change="handleSelectionChange"
            ref="multipleTable"
            style="width: 100%"
          >
            <el-table-column align="center" label="商品ID">
              <template slot-scope="scope">
                <span>{{ scope.row.ProductID }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称">
              <template slot-scope="scope">
                <span>{{ scope.row.Name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="条形码">
              <template slot-scope="scope">
                <span>{{ scope.row.SN }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="采购价">
              <template slot-scope="scope">
                <el-input
                  disabled
                  size="mini"
                  v-model="scope.row.OrderPrice"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="采购量">
              <template slot-scope="scope">
                <el-input
                  disabled
                  size="mini"
                  v-model="scope.row.PurchaseQty"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="申报货币">
              <template slot-scope="scope">
                <el-select
                  size="mini"
                  disabled
                  v-model="scope.row.Currency"
                  placeholder="请选择"
                >
                  <el-option label="人民币" value="CNY"> </el-option>
                  <el-option label="澳大利亚元" value="AUD"> </el-option>
                  <el-option label="其他" value=""> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="清点数量">
              <template slot-scope="scope">
                <span>{{ scope.row.Quantity }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item
          v-if="ruleForm.GoodsStockUpWay == '1'"
          title="PO单清关资料"
          name="3"
        >
          <el-table
            class="gdInfo"
            :data="fileArray"
            border
            ref="multipleTable"
            style="width: 100%"
          >
            <el-table-column align="center" label="附件名称">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <span
                  v-if="scope.row"
                  title="点击查看"
                  style="color:#00b0ff;cursor:pointer"
                  @click="jump(scope.row.url)"
                  >查看</span
                >
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-dialog
      title="选择订单"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="8">
          <span class="timed">商品ID:</span>
          <el-input
            v-model="search.ProductId"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入报关订单号"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <span class="timed">商品名称:</span>
          <el-input
            v-model="search.name"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入运单号"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <span class="timed">条码：</span>
          <el-input
            v-model="search.sn"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入条码"
          ></el-input>
        </el-col>
        <!-- <el-col :span="24">
        </el-col>-->
      </el-row>
      <div style="text-align:right;margin:0 0 10px 0">
        <el-button
          size="mini"
          type="primary"
          @click="searchClick()"
          class="search_btn pan-btn blue-btn"
          icon="el-icon-search"
          >查询订单</el-button
        >
      </div>
      <el-table
        :data="goodsList"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange1"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column align="center" label="商品编号">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.Id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品ID">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.WaybillNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.NameCN }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="贸易类型">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.SOAmount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="品牌">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.BrandName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="条码">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.SN }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.PageIndex"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="search.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalRows"
        ></el-pagination>
      </div>

      <span slot="footer" style="text-align:center;display:block;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="flag_chooseOder"
          @click="chooseOrder"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsList } from "@/api/merchandisecategories/list";
import { POlistDetail } from "../../api/stockManagement/PO";
let OSS = require("ali-oss");
import moment from "moment";
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "refundOrderManage/" +
  moment().format("YYYYMM") +
  "/img/";

export default {
  data() {
    return {
      search: {
        ProductId: "",
        EntryStatus: 1,
        sn: "",
        name: "",
        PageIndex: 1,
        PageSize: 15
      },
      goodsList: [],
      dialogVisible: false,
      ruleForm: {
        GoodsStockUpWay: "",
        ManifestNo: "",
        VoyageNo: "",
        AssBillNo: "",
        PackQty: "",
        TotalNetWeight: "",
        TotalGrossWeight: ""
      },
      rules: {
        GoodsStockUpWay: [
          { required: true, message: "请填写内容", trigger: "change" }
        ],
        AssBillNo: [
          { required: true, message: "请填写内容", trigger: "change" }
        ],
        PackQty: [{ required: true, message: "请填写内容", trigger: "change" }],
        TotalNetWeight: [
          { required: true, message: "请填写内容", trigger: "change" }
        ],
        TotalGrossWeight: [
          { required: true, message: "请填写内容", trigger: "change" }
        ]
      },
      sysNo: "",
      baseInfo: "",
      flag_chooseOder: true,
      flag_deleteOder: true,
      GoodsItems: [],
      multipleSelection: [],
      multipleSelection1: [],
      activeNames: "1",
      TotalRows: 0,
      fileArray: [],
      activedDatas: [1, 2]
    };
  },
  activated() {
    this.activeNames = "1";
    this.activedDatas = [1];
  },
  mounted() {
    this.getData();
  },

  methods: {
    handleSizeChange(v) {
      this.search.PageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.search.PageIndex = v;
      this.getData();
    },
    //选择订单
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
      if (this.multipleSelection1.length > 0) {
        this.flag_chooseOder = false;
      }
    },
    searchClick(PageIndex = 1) {
      this.search.PageIndex = PageIndex;
      this.getData();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    chooseOrder() {
      this.GoodsItems = [...this.GoodsItems, ...this.multipleSelection1];
      this.dialogVisible = false;
    },
    delOrder() {
      this.multipleSelection.forEach((item, index) => {
        this.GoodsItems.splice(0, 1);
      });
    },
    //选择表格数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.flag_deleteOder = false;
      }
    },
    addOrder() {
      this.dialogVisible = true;
      this.getData();
    },
    jump(url) {
      window.open(url, "_black");
    },
    getData() {
      getGoodsList(this.search).then(res => {
        this.TotalRows = res.TotalRows;
        this.goodsList = res
        console.log(res);
      });
    },
    //切换table
    handleChange(val) {
      // let obj = "";
      // val.map(v => {
      //   let flag = false;
      //   this.activedDatas.map(item => {
      //     if (parseInt(v) === parseInt(item)) {
      //       flag = true;
      //     }
      //   });
      //   if (!flag) {
      //     obj = v;
      //   }
      // });
      // if (obj !== "") {
      //   switch (parseInt(obj)) {
      //     case 2:
      //       this.getGoodsInfo();
      //       this.getRefundAmount();
      //       break;
      //     case 3:
      //       this.getAfterSaleInfo();
      //       break;
      //     case 4:
      //       this.getImageInfo();
      //       break;
      //     case 5:
      //       this.getExpInfo();
      //       break;
      //     case 6:
      //       this.getHistoryInfo();
      //       break;
      //   }
      //   this.activedDatas.push(obj);
      // }
    }
  }
};
</script>
<style scoped>
.bottom0 {
  margin-bottom: 0;
}
.spanLeft {
  margin-left: 10px;
}
img {
  width: 200px;
  height: 250px;
}
.btnRight {
  text-align: right;
}
.pm {
  width: 150px;
  margin: 0;
}
.historyNew {
  color: #f56c6c;
  font-weight: 500;
}
.addskuupload {
  display: flex;
  width: 100%;
}
.elheight {
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.flex1000 {
  flex: 0 0 900px !important;
  display: flex;
}

.flex1000 .dzinfo {
  width: 300px;
}

.flex1000 .dz,
.flex1000 .dzinfo {
  display: inline-block !important;
}

.addres .nm span {
  display: block;
}

.addres .nm span:nth-child(1) {
  flex: 0 0 120px;
  text-align: right;
}

.addres .nm span:nth-child(2) {
  flex: 0 0 1;
}

.addres p.nm {
  display: flex;
  height: 36px;
  width: 100%;
  line-height: 36px;
}

.goodsInfoBox {
  display: flex;
  position: relative;
}

.changeGoods {
  position: absolute;
  right: 0;
  bottom: 0;
}

.goodsInfoBox img {
  width: 90px;
  height: 90px;
  flex: 0 0 80px;
  display: block;
}

.gdInfo {
  margin-top: 20px;
}

.gdInfo p {
  margin: 0;
}

.goodsCon {
  text-align: left;
  padding: 0 15px;
}

.new {
  margin-left: 10px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 500;
}
.infoDesc {
  padding: 18px;
  padding-bottom: 0;
}
.nm {
  margin: 0;
}
.addskuuploadItem {
  display: inline-block;
  width: 130px;
  position: relative;
  border: 1px dashed #eeeeee;
}
.mb0 {
  margin-bottom: 0 !important;
}
.upload h5 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #666;
}
.fwb {
  font-weight: bolder;
}

.expinfo {
  border: 1px solid #1c1c1c;
  padding: 5px;
  border-radius: 5px;
  width: 800px;
}

.expinfo li {
  list-style: none;
  line-height: 28px;
  border-bottom: 1px solid #eee;
  padding-left: 10px;
}

.expinfo li:nth-last-child(1) {
  border-bottom: none;
}
</style>
