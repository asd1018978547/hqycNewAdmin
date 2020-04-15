<template>
  <div class="content_box">
    <el-tabs v-model="activeTab" @tab-click="tabClick" class="order_top">
      <el-tab-pane
        :label="item.name"
        :name="item.name"
        v-for="(item,index) in RefundStatusTab"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <!-- 搜索盒子 -->
    <div class="searchBox">
      <el-row>
        <el-col :span="5">
          <span class="timed">订单来源：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.OrderSource"
            size="small"
            placeholder="请选择订单来源"
          >
            <el-option
              v-for="item in orderSourceList"
              :key="item.Code"
              :label="item.AliasValue"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span class="timed">订单类型：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.StoreType"
            size="small"
            placeholder="请选择订单类型"
          >
            <el-option
              v-for="item in storeTypeList"
              :key="item.Code"
              :label="item.AliasValue"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span class="timed">订单内部编号：</span>
          <el-input
            v-model="search.OrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入内部编号"
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="5">
          <span class="timed">订单外部单号：</span>
          <el-input
            v-model="search.ExtOrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入外部编号"
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">退货物流单号：</span>
          <el-input
            v-model="search.ExpNum"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入退货物流单号"
            maxlength="30"
          ></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <span class="timed">下单时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange1"
            class="search_time"
            size="small"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <span class="timed">退款申请时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange2"
            class="search_time"
            size="small"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <span class="timed">商品条码：</span>
          <el-input
            v-model="search.Sn"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入商品条码"
            maxlength="30"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <span class="timed">责任主体：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.ResponsibleBody"
            size="small"
            placeholder="请选择责任主体"
          >
            <el-option
              v-for="item in responsebilityList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">
          <span class="timed">退款编号：</span>
          <el-input
            v-model="search.RefundOrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入退款编号"
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="5" v-if="refundStatus">
          <span class="timed">退款状态：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.RefundStatus"
            size="small"
            placeholder="请选择退款状态"
          >
            <el-option
              v-for="item in RefundStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span class="timed">退款类型：</span>
          <el-select
            class="search_title"
            clearable
            @change="changeType"
            v-model="search.RefundType"
            size="small"
            placeholder="请选择退款类型"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option label="售中退款" value="1"></el-option>
            <el-option label="售后退款" value="2"></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span class="timed">退款方式：</span>
          <el-select
            size="small"
            clearable
            placeholder="请选择退款方式"
            @change="changeMethod"
            v-model="search.RefundMethodCode"
          >
            <el-option
              :key="index"
              v-for="(item,index) in refundList"
              :label="item.RefundMethodDesc"
              :value="item.RefundMethodCode"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">退款原因：</span>
          <el-select size="small" clearable placeholder="请选择退款原因" v-model="search.RefundReasonCode">
            <el-option
              v-for="(obj,index) in reasonsList"
              :key="index"
              :label="obj.RefundReasonDesc"
              :value="obj.RefundReasonCode"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <el-col class="marginBottom">
      <span class="timed"></span>
      <el-button
        v-if="checkBtn('func_common_search')"
        size="small"
        type="primary"
        @click="Search"
        icon="el-icon-search"
      >查询订单</el-button>
      <el-button
        v-if="checkBtn('func_common_export')"
        type="info"
        @click="onExport"
        class="search_btn pan-btn tiffany-btn"
      >导出订单</el-button>
    </el-col>

    <!-- 表单盒子 -->
    <div class="list_box">
      <el-table border :data="tableData">
        <el-table-column :show-overflow-tooltip="true" label="商品" align="center">
          <template slot-scope="scope">
            <div
              class="align_left goods_con"
              v-for="(item, index) in scope.row.OrderDetail"
              :key="index"
            >
              <img :src="item.Image" alt />
              <div class="info">
                <p v-if="item.SN">商品条码：{{item.SN}}</p>
                <p>{{item.Name}}</p>
                <p v-if="item.Standard">规格：{{item.Standard}}</p>
                <p v-if="item.Expiration">效期：{{item.Expiration}}</p>
                <p>￥{{item.Price.toFixed(2)}} * {{item.RefundCount}}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="信息" align="center">
          <template slot-scope="scope">
            <p style="margin: 0">订单内部编号:{{scope.row.OrderCode}}</p>
            <p style="margin: 0">订单外部编号:{{scope.row.ExternalOrderCode}}</p>
            <p style="margin: 0">退款编号:{{scope.row.RefundOrderCode}}</p>
            <p style="margin: 0">订单类型:{{scope.row.OrderTypeDesc}}</p>
            <p style="margin: 0">商户:{{scope.row.Retailer}}</p>
            <p style="margin: 0 ">申请时间:{{ scope.row.DateModified}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="订单金额" width="150" align="center">
          <template slot-scope="scope">
            <p style="margin: 0">订单金额：￥{{scope.row.OrderAmount.toFixed(2)}}</p>
            <p style="margin: 0">商品金额：￥{{scope.row.GoodsMoney.toFixed(2)}}</p>
            <p style="margin: 0">订单运费：￥{{scope.row.TransFee.toFixed(2)}}</p>
            <p style="margin: 0">综合税费：￥{{scope.row.TaxAmount.toFixed(2)}}</p>
            <p style="margin: 0">抵扣金额：￥{{scope.row.DisCount.toFixed(2)}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="退款金额" width="150" align="center">
          <template slot-scope="scope">
            <p style="margin: 0">￥{{scope.row.RefundTotalAmount.toFixed(2)}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="支付方式" width="150" align="center">
          <template slot-scope="scope">
            <p style="margin: 0">{{scope.row.PayTypeDesc}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="退款状态" width="150" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.RefundStatusDesc}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="退款类型" width="150" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.RefundTypeDesc}}</p>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" label="退款方式" align="center" width="150">
          <template slot-scope="scope">
            <p style="margin: 0">{{scope.row.RefundMethodDesc}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="checkBtn('func_common_detail')"
              style="margin-bottom: 10px;"
              @click="jumpDetail(scope.row)"
              type="primary"
              size="small"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageIndex"
        :page-sizes="[15,30,50,100]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import { stringify } from "querystring";
import { PKoptions } from "@/assets/pickerOptions";
import axios from "axios";
import { getRefund, ExportOrder } from "../../api/refundOrderManage/index";
import { getDictionary, getListFromDictionary } from "@/api/order/orderCenter";
import { search } from "../../api/afterSaleRuleManage/index";
import {
  addRule,
  editRule,
  getEditRule
} from "../../api/afterSaleRuleManage/addRule";
const Ip = window._config.url;
const PartnerId = window._config.partnerId;
import { formatDateTime, parseTime } from "@/utils/index";
import moment from "moment";
export default {
  data() {
    return {
      roleBtn: [],
      tableData: [],
      pickerOptions: PKoptions,
      search: {
        ResponsibleBody: "", //责任主体
        OrderSource: "", //订单来源
        StoreType: "", //订单类型
        OrderCode: "", //内部编号
        ExtOrderCode: "", //外部编号
        ExpNum: "", //物流单号
        Sn: "", //商品条码
        DateRange1: [
          moment()
            .subtract(7, "d")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ], // 下单时间
        DateRange2: null, // 退款申请时间
        RefundOrderCode: "", //退款编号
        RefundType: "", //退款类型
        RefundStatus: "", //退款状态
        RefundMethodCode: "", //退款方式
        RefundReasonCode: "", //退款原因
        pageIndex: 1,
        pageSize: 15
      },
      responsebilityList: [
        {
          name: "买家",
          value: 1
        },
        {
          name: "快递公司",
          value: 2
        },
        {
          name: "澳蓉公司",
          value: 3
        },
        {
          name: "环球云仓",
          value: 4
        }
      ],
      TotalRows: 0,
      TotalPage: 0,
      refundStatus: true, //是否显示退款状态
      activeTab: "全部订单",
      RefundStatusTab: [
        //tabBar
        { name: "全部订单", status: "" },
        { name: "退款中", status: "123456" },
        { name: "退款成功", status: "7" },
        { name: "退款关闭", status: "8" }
      ],
      RefundStatusList: [
        //下拉框
        { label: "退款处理中", value: "1" },
        { label: "退款待商家审核", value: "2" },
        { label: "退款拒绝待买家处理", value: "3" },
        { label: "待买家发货", value: "4" },
        { label: "待卖家确认收货", value: "5" },
        { label: "商家拒绝收货待买家处理", value: "6" },
        { label: "商家已确认收货", value: "9" },
        { label: "退款关闭", value: "7" },
        { label: "退款成功", value: "8" }
      ],
      orderSourceList: [], //订单来源列表
      storeTypeList: [], //订单类型列表
      refundList: [], //退款方式列表
      reasonsList: [] //退款原因
    };
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
    //导出订单
    onExport() {
      const Loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let par = Object.assign(
        {
          token: localStorage.Token
        },
        this.search
      );
      if (par.OrderSource == "") par.OrderSource = "-1";
      if (par.RefundType == "") par.RefundType = "-1";
      if (par.StoreType == "") par.StoreType = "-1";
      par.OrderSource = Number(par.OrderSource);
      par.StoreType = Number(par.StoreType);
      par.RefundType = Number(par.RefundType);
      ExportOrder(par)
        .then(res => {
          Loading.close();
          const href = window._config.fileServer + res.fileName;
          window.open(href);
        })
        .catch(() => {
          Loading.close();
        });
    },
    //切换
    tabClick(item) {
      const status = this.RefundStatusTab[item.index].status;
      this.refundStatus = status !== "" ? false : true; //切换显示退款状态
      let s = status;
      if (s == "123456") s = "1,2,3,4,5,6,9";
      this.search.RefundStatus = s;
      this.getRefund();
    },
    //分页相关
    handleSizeChange(v) {
      this.search.pageSize = v;
      this.getRefund();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
      this.getRefund();
    },
    Search() {
      this.search.pageIndex = 1;
      this.getRefund();
    },
    //改变 类型列表 联动  方式
    changeType(e) {
      let p = { RefundType: this.search.RefundType };
      search(p).then(res => {
        this.refundList = res;
        this.search.RefundMethodCode = "";
        this.search.RefundReasonCode = "";
      });
    },
    //改变  方式  列表联动   原因
    changeMethod(e) {
      this.reasonsList = [];
      this.refundList.map(item => {
        if (item.RefundMethodCode == e) {
          this.reasonsList = item.RefundOrderReasons;
        }
        this.search.RefundReasonCode = "";
      });
    },
    //跳转详情
    jumpDetail(row) {
      this.$router.push({
        path: "/refundOrderManageDetail",
        query: {
          RefundOrderCode: row.RefundOrderCode,
          OrderCode: row.OrderCode,
          RefundMethodCode: row.RefundMethodCode,
          RefundType: row.RefundType
        }
      });
    },
    //获取全部数据
    getRefund() {
      let par = Object.assign(
        {
          token: localStorage.Token
        },
        this.search
      );
      if (par.ResponsibleBody == "") par.ResponsibleBody = "-1";
      if (par.OrderSource == "") par.OrderSource = "-1";
      if (par.RefundType == "") par.RefundType = "-1";
      if (par.StoreType == "") par.StoreType = "-1";
      par.OrderSource = Number(par.OrderSource);
      par.StoreType = Number(par.StoreType);
      par.RefundType = Number(par.RefundType);
      getRefund(par).then(res => {
        res.Data.map(item => {
          item.DateModified = formatDateTime(item.DateModified);
        });
        this.tableData = res.Data;
        this.tableData.forEach(element => {
          element.OrderDetail.forEach(ele => {
            let signUrl = window.ali_oss_data.URL_IMG_SHOW + ele.Image;
            ele.Image = signUrl;
          });
        });
        this.PageIndex = res.PageIndex;
        this.TotalRows = res.TotalRows;
        this.TotalPage = res.TotalPage;
      });
    }
    //修改el-tag样式
  },
  created() {
    //获取全部数据
    this.getRefund();
    getDictionary().then(res => {
      this.orderSourceList = getListFromDictionary(res, "OrderSource"); //设置订单来源列表
      this.storeTypeList = getListFromDictionary(res, "StoreType"); //设置订单类型列表
    });
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  activated() {
    this.getRefund();
  }
};
</script>
<style>
.order_top .el-tabs__nav-wrap {
  height: 60px;
}
.order_top .el-tabs__nav-scroll {
  margin-top: 10px;
  overflow: visible;
}
</style>

<style lang="scss" scoped>
.marginBottom {
  margin-bottom: 20px;
}
.fz14 {
  font-size: 14px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}

.align_left {
  text-align: left;
}

.goods_con {
  display: flex;
  box-sizing: border-box;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
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

p {
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

.list_box {
  .btn_group {
    .btn_item {
      padding: 10px 0;
      border-top: 1px solid #eee;

      .pan-btn {
        line-height: 1.5;
      }
    }
  }
}

.text_center {
  text-align: center;
}

.size14 {
  font-size: 14px;
  line-height: 1.5;
}
</style>