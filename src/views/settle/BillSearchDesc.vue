<template>
  <div class="content_box">
    <el-tabs v-model="activeTab" @tab-click="tabClick" class="order_top">
      <el-tab-pane :name="item.name" v-for="(item,index) in orderStatusList" :key="index">
        <span slot="label" class="fz14">{{ item.name }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="searchBox" style="padding-bottom:60px;">
      <el-row>
        <el-col :span="6">
          <span class="timed">账单日期：</span>
          <el-date-picker
            :disabled="$route.query.id != null"
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
        <el-col :span="6">
          <span class="timed">发货日期：</span>
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
        <el-col :span="6">
          <span class="timed">创建日期：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange3"
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
        <el-col :span="4" v-if="!search.settleMentCode">
          <span class="timed">分销商：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.PartnerId"
            size="small"
            placeholder="请选择分销商"
          >
            <el-option
              v-for="item in channelIdList"
              :key="item.PartnerId"
              :label="item.PartnerName"
              :value="item.PartnerId"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="timed">订单号：</span>
          <el-input size="small" v-model="search.orderCode"></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">订单类型：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.orderType"
            size="small"
            placeholder="请选择订单类型"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option label="保税备货" value="2"></el-option>
            <el-option label="跨境直邮" value="1"></el-option>
            <el-option label="一般贸易" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">订单状态：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.orderStatus"
            size="small"
            placeholder="请选择订单类型"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option label="待付款" value="10"></el-option>
            <el-option label="待申报支付" value="20"></el-option>
            <el-option label="待申报支付单" value="25"></el-option>
            <el-option label="待申报发货" value="30"></el-option>
            <el-option label="待发货" value="35"></el-option>
            <el-option label="待出库" value="40"></el-option>
            <el-option label="待清关" value="50"></el-option>
            <el-option label="待签收" value="60"></el-option>
            <el-option label="已完成" value="70"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button
            @click="getdata"
            type="primary"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            :disabled="edit.orderCode == ''"
            @click="batchEdit"
            type="primary"
            class="search_btn pan-btn blue-btn"
          >批量修改账期</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="orderList"
      border
      ref="multipleTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" width="400" label="商品信息">
        <template slot-scope="scope">
          <div class="align_left goods_con" v-for="(item, index) in scope.row.Detail" :key="index">
            <img :src="baseUrl+item.Image" alt />
            <div class="info">
              <p>{{item.Name}}</p>
              <p v-if="item.SN">编码：{{item.SN}}</p>
              <p v-if="item.Standard">规格：{{item.Standard}}</p>
              <p>￥{{item.Price.toFixed(2)}} * {{item.Count}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="left" label="订单信息" width="240">
        <template slot-scope="scope">
          <p>订单类型：{{ getStatusDesc(scope.row.OrderType) }}</p>
          <p>商户：{{ scope.row.Retailer }}</p>
          <p>外部订单号：{{ scope.row.ExternalOrderCode }}</p>
          <p>内部订单号：{{ scope.row.OrderCode }}</p>
          <p>创建时间：{{ formatDateTime(scope.row.DateAdded) }}</p>
          <p>发货时间：{{ scope.row.DeliveryDate != '' ? formatDateTime(scope.row.DeliveryDate) : ''}}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label="订单金额">
        <template slot-scope="scope">
          <p>应收货款：{{ scope.row.SettleMentOrderMoney }}</p>
          <p>应收运费：{{ scope.row.SettleMentTransFee }}</p>
          <p>综合税费：{{ scope.row.SettleMentTaxAmount }}</p>
          <p>应收账款：{{ scope.row.FinnalMoney }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="StoreTypeDesc" label="仓库"></el-table-column>
      <el-table-column align="center" prop="OrderStatusDesc" label="订单状态">
        <template slot-scope="scope">
          <template v-if="scope.row.MFD==1">
            <p>
              <el-tag type="danger">作废</el-tag>
            </p>
          </template>
          <template v-if="scope.row.MFD==2">
            <p>
              <el-tooltip class="item" effect="dark" :content="scope.row.MFDDesc" placement="top">
                <el-tag type="danger" v-popover:popover1>异常</el-tag>
              </el-tooltip>
            </p>
          </template>
          <p>
            <el-tag :type="getTag(scope.row)">{{scope.row.OrderStatusDesc}}</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算状态">
        <template slot-scope="scope">
          <p v-if="scope.row.SettlementStatus == 0" class="Danger">未结算</p>
          <p v-else class="Success">已结算</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getDesc(scope.row)">详情</el-button>
          <br />
          <el-button
            @click="editbtn(scope.row)"
            v-if="scope.row.SettlementStatus == 0"
            type="text"
            size="mini"
          >调整账期</el-button>
          <br />
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title="调整账期" :visible.sync="centerDialogVisible" width="30%" center :show-close='false'>
      <div class="infoBox">
        <div class="info_item" style="height:auto;line-height:24px;">
          <div class="info_title">订单号：</div>
          <div class="info_right">
            <span v-for="(item,index) in edit.orderCode.split(',')" :key="index">
              {{ item }}
              <br />
            </span>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">结算日期：</div>
          <div class="info_right">
            <el-date-picker
              v-model="edit.settleMentTime"
              align="right"
              type="date"
              placeholder="选择日期"
              size="mini"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeD">取 消</el-button>
        <el-button type="primary" @click="editTime">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 加个注释

import { PKoptions } from "@/assets/pickerOptions";
import {
  getParentList,
  getAllList,
  setZQ
} from "@/api/settle/settleSetting.js";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      edit: {
        orderCode: "",
        settleMentTime: ""
      },
      search: {
        DateRange2: this.$route.query.id
          ? [this.$route.query.stime, this.$route.query.etime]
          : null,
        DateRange1: null,
        DateRange3: null,
        PartnerId: null,
        pageIndex: 1,
        pageSize: 15,
        orderType: "-1",
        settleMentCode: this.$route.query.id,
        settlementStatus: -1,
        refundStatus: -1,
        orderStatus: "-1"
      },
      centerDialogVisible: false,
      formatDateTime: formatDateTime,
      TotalRows: 0,
      baseUrl: window.ali_oss_data.URL_IMG_SHOW,
      orderList: [],
      pickerOptions: PKoptions,
      channelIdList: [],
      activeTab: '全部',
      orderStatusList: [
        { name: "全部", status: -1 },
        { name: "已结算", status: 1 },
        { name: "未结算", status: 0 },
        { name: "退款售后", status: 2 }
      ]
    };
  },
  activated() {
    this.getplist();
    this.getdata();
  },
  methods: {
    getTag(item) {
      const status = parseInt(item.Status);
      if (status === 10 || status === 20) {
        return "danger";
      } else if (
        status === 25 ||
        status === 30 ||
        status === 40 ||
        status === 50 ||
        status === 60
      ) {
        return "warning";
      } else if (status === 70) {
        return "success";
      } else if (status === 0) {
        return "info";
      } else {
        return "";
      }
    },
    handleSelectionChange(v) {
      if (v.length == 0) {
        this.edit.orderCode = "";
      } else {
        let o = [];
        v.map(item => {
          o.push(item.OrderCode);
        });
        this.edit.orderCode = o.join(",");
      }
    },
    getDesc(row) {
      this.$router.push({
        path: "/orderDetail",
        query: {
          id: row.OrderCode
        }
      });
    },
    closeD() {
      this.edit = {
        orderCode: "",
        settleMentTime: ""
      };
      this.centerDialogVisible = false;
    },
    editTime() {
      if (this.edit.settleMentTime == "") {
        this.$message.error("请选择日期");
        return;
      } else {
        let p = JSON.parse(JSON.stringify(this.edit));
        p.orderCodes = p.orderCode;
        p.settleMentTime = formatDateTime(p.settleMentTime);
        setZQ(p).then(res => {
          this.$alert(res, "提示", {
            dangerouslyUseHTMLString: true
          });
          this.search.pageIndex = 1;
          this.centerDialogVisible = false;
          this.edit = {
            orderCode: "",
            settleMentTime: ""
          };
          this.getdata();
        });
      }
    },
    batchEdit() {
      this.centerDialogVisible = true;
    },
    editbtn(row) {
      this.edit.orderCode = row.OrderCode;
      this.centerDialogVisible = true;
    },
    handleSizeChange(v) {
      this.search.pageSize = v;
      this.search.pageIndex = 1;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
      this.getdata();
    },
    tabClick(item) {
      let o = this.orderStatusList[item.index];
      if (o.status == 2) {
        this.search.settlementStatus = -1;
        this.search.refundStatus = 0;
      } else if (o.status == -1) {
        this.search.settlementStatus = -1;
        this.search.refundStatus = -1;
      } else {
        this.search.settlementStatus = o.status;
        this.search.refundStatus = -1;
      }
      this.getdata();
    },
    getplist() {
      getParentList({
        thirdPayType: 0
      }).then(res => {
        this.channelIdList = res;
      });
    },
    getdata() {
      let p = JSON.parse(JSON.stringify(this.search));
      if (p.DateRange1) {
        p.deliverStartDate = formatDateTime(p.DateRange1[0]).substring(0, 10);
        p.deliverEndDate = formatDateTime(p.DateRange1[1]).substring(0, 10);
      }
      if (p.DateRange3) {
        p.startDate = formatDateTime(p.DateRange3[0]).substring(0, 10);
        p.endDate = formatDateTime(p.DateRange3[1]).substring(0, 10);
      }
      if (p.DateRange2) {
        p.startSettleMentTime = formatDateTime(p.DateRange2[0]).substring(0, 10)
        p.endSettleMentTime = formatDateTime(p.DateRange2[1]).substring(0, 10)
      }
      getAllList(p).then(res => {
        this.TotalRows = res.TotalRows;
        this.orderList = res.Data;
      });
    },
    getStatusDesc(d) {
      if (d == 2) {
        return "保税备货";
      } else if (d == 1) {
        return "跨境直邮";
      } else {
        return "一般贸易";
      }
    }
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
.info_item {
  display: flex;
  height: 50px;
  line-height: 50px;
}

.info_item .info_title {
  flex: 0 0 80px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
}
</style>
