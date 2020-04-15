<template>
  <div class="content_box roleadd goodsManage" style="margin-top:10px;">
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title">销售数据</div>
        <div class="dashboard-container" v-show="orderStatus == 1">
          <el-row :gutter="12" style="margin-bottom:0">
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售总金额</span>
                  <span>￥{{ saleInfo.TotalMoneyOfOrder }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售金额(含佣金)</span>
                  <span>￥{{ saleInfo.TotalMoneyOfCommissionOrder }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>订单总数</span>
                  <span>{{ saleInfo.OrderCount }}</span>
                  <svg-icon icon-class="list" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>订单数(含佣金)</span>
                  <span>{{ saleInfo.OrderCount }}</span>
                  <svg-icon icon-class="list" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>合伙人</span>
                  <span>{{ saleInfo.PartnerCount }}</span>
                  <svg-icon icon-class="people" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>佣金金额</span>
                  <span>￥{{ saleInfo.TotalMoneyOfCommission }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>顾客数</span>
                  <span>{{ saleInfo.CustomerCount }}</span>
                  <svg-icon icon-class="people" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="dashboard-container" v-show="orderStatus == 0">
          <el-row :gutter="12" style="margin-bottom:0">
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>商品</span>
                  <span>{{ saleInfo.SkuCount }}</span>
                  <svg-icon icon-class="documentation" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售总金额</span>
                  <span>￥{{ saleInfo.TotalMoneyOfOrder }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售金额(含佣金)</span>
                  <span>￥{{ saleInfo.TotalMoneyOfCommissionOrder }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售总量</span>
                  <span>{{ saleInfo.SaleCount }}</span>
                  <svg-icon icon-class="chart" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>销售量(含佣金)</span>
                  <span>{{ saleInfo.saleCommissionCount }}</span>
                  <svg-icon icon-class="chart" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
            <el-col :span='3'>
              <el-card shadow="always" :body-style="panlStyle">
                <div class="panl_box Info_b">
                  <span>佣金金额</span>
                  <span>￥{{ saleInfo.TotalMoneyOfCommission }}</span>
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox">
          <el-row>
            <el-col :span='5'>
              <span class="timed">数据类型：</span>
              <el-select class="search_title" v-model="orderStatus" size="mini">
                <el-option label="销售数据" :value="1"></el-option>
                <el-option label="商品数据" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span='7'>
              <span class="timed" style="flex:0 0 150px;">订单号/顾客/合伙人：</span>
              <el-input style="margin-left:10px;" clearable v-model='search.keys' class="search_title" size='mini'
                placeholder="订单号/顾客/合伙人">
              </el-input>
            </el-col>
            <el-col :span='10'>
              <span class="timed">时间段：</span>
              <el-date-picker size="mini" v-model="time" type="daterange" align="right" unlink-panels
                range-separator="-" start-placeholder="开始日期" value-format='yyyy-MM-dd' end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
              <el-button class="search_btn" @click='getdata' type="success" size='mini'>查询
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table v-show="orderStatus == 1" ref='tables' :data="list" border fit highlight-current-row
            style="width: 100%">
            <el-table-column label='合伙人' prop='NickName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='销售金额' prop='TotalMoneyOfOrder' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='订单总数' prop='OrderCount' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='销售金额(含佣金)' prop='TotalMoneyOfCommissionOrder' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='订单数(含佣金)' prop='CommissionOrderCount' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='应得佣金' prop='TotalMoneyOfCommission' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='实得佣金' prop='TotalMoneyOfCommission1' align='center' show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-table v-show="orderStatus == 0" ref='tables' :data="list" border fit highlight-current-row
            style="width: 100%">
            <el-table-column label='商品' prop='ProName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='分类' prop='Category' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='品牌' prop='Brand' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='销售总金额' prop='TotalMoney' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='销售总量' prop='StandardCount' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='销售金额(含佣金)' prop='CommissionTotalMoney' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='销售量(含佣金)' prop='CommissionStandardCount' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='应付佣金' prop='TotalMoneyOfCommission' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='实付佣金' prop='TotalMoneyOfCommission1' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='上架店铺' prop='ShopCount' align='center' show-overflow-tooltip></el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageIndex" :page-sizes="[15,30,50,100]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalRows">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getSupplierRptSalesList,
  getSupplierRptGoodsList
} from "@/api/Partner/saleData";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      panlStyle: { padding: "0px" },
      time: [],
      orderStatus: 1,
      search: {
        keys: "",
        StartDate: "",
        EndDate: ""
      },
      multipleList: [],
      list: [],
      saleInfo: {},
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
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
      }
    };
  },
  watch: {
    orderStatus: function(v) {
      this.getdata();
    }
  },
  activated() {
    this.getdata();
  },
  methods: {
    handleSizeChange(v) {
      this.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getdata();
    },
    getdata() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      if (this.time) {
        p.StartDate = this.time[0];
        p.EndDate = this.time[1];
      }
      if (this.orderStatus == 1) {
        getSupplierRptSalesList(p).then(res => {
          res.Data.map(v => {
            v.DateOfOrder = formatDateTime(v.DateOfOrder);
          });
          
          this.saleInfo = res.Summary;
          this.list = res.Data;
          this.pageIndex = res.PageIndex;
          this.totalRows = res.TotalRows;
        });
      } else {
        getSupplierRptGoodsList(p).then(res => {
          res.Data.map(v => {
            v.DateOfOrder = formatDateTime(v.DateOfOrder);
          });
          this.saleInfo = res.Summary;
          this.list = res.Data;
          this.pageIndex = res.PageIndex;
          this.totalRows = res.TotalRows;
        });
      }
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 300px;
}
.rankBox {
  width: 100%;
  display: flex;
}

.rankBox p {
  font-size: 18px;
  margin: 10px 0;
}

.rank {
  flex: 0 0 50%;
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
}

.rank:nth-child(1) {
  padding-right: 15px;
}

.rank:nth-child(2) {
  padding-left: 15px;
}

.chartBox {
  padding-top: 20px;
  background: #fff;
}

.bd {
  margin-bottom: 15px;
}

.dashboard-container {
  padding: 13px;
  background: #f0f2f5;
}

.panl_box {
  cursor: pointer;
  position: relative;
  padding: 10px;
}

.card-panel-icon {
  font-size: 34px;
  position: absolute;
  right: 10px;
  top: 18px;
  color: #fff;
}

.panl_box span {
  font-weight: 500;
  color: #fff;
}

.panl_box > span:nth-child(1) {
  font-size: 14px;
  display: block;
  margin-bottom: 10px;
}

.panl_box > span:nth-child(2),
.card-panel-num {
  font-size: 16px;
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