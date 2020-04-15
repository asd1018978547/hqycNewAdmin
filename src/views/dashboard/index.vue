<template>
  <div class="dashboard-container">
  
    <div class="bd">
      <el-date-picker
        v-model="time2"
        :picker-options="pickerOptions2"
        class="w200"
        size="mini"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button size="mini" type="success" @click="getData">按日期查询</el-button>
    </div>
    <p
      style="font-size: 18px;"
    >{{ time[0] ? getTime(time[0]) : getDay(0) }} 至 {{ time[1] ? getTime(time[1]) : getDay(0) }} 基本数据</p>
    <el-row :gutter="12">
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.TotalSalesMoney > 0 ? 'Success_b' : base.TotalSalesMoney == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>销售金额</span>
            <span>
              ￥
              <count-to
                :decimals="2"
                class="card-panel-num"
                :startVal="0"
                :endVal="base.TotalSalesMoney"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.TotalOrderNumber > 0 ? 'Success_b' : base.TotalOrderNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>订单数量</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.TotalOrderNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="list" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.TotalSalesGoodsNumber > 0 ? 'Success_b' : base.TotalSalesGoodsNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>销售商品数量</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.TotalSalesGoodsNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="component" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.GrossProfit > 0 ? 'Success_b' : base.GrossProfit == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>毛利润</span>
            <span>
              ￥
              <count-to
                :decimals="2"
                class="card-panel-num"
                :startVal="0"
                :endVal="base.GrossProfit"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.GrossProfitRate > 0 ? 'Success_b' : base.GrossProfitRate == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>毛利率</span>
            <span>
              <count-to
                class="card-panel-num"
                :decimals="2"
                :startVal="0"
                :endVal="base.GrossProfitRate"
                :duration="2000"
              ></count-to>%
            </span>
            <svg-icon icon-class="chart" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.VisitorsNumber > 0 ? 'Success_b' : base.VisitorsNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>访客数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.VisitorsNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.PayingCustomersNumber > 0 ? 'Success_b' : base.PayingCustomersNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>付款客户数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.PayingCustomersNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.ConversionRate > 0 ? 'Success_b' : base.ConversionRate == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>转化率</span>
            <span>
              <count-to
                class="card-panel-num"
                :decimals="2"
                :startVal="0"
                :endVal="base.ConversionRate"
                :duration="2000"
              ></count-to>%
            </span>
            <svg-icon icon-class="example" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.UnitPrice > 0 ? 'Success_b' : base.UnitPrice == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>客单价</span>
            <span>
              ￥
              <count-to
                :decimals="2"
                class="card-panel-num"
                :startVal="0"
                :endVal="base.UnitPrice"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            @click="jumpLink('10')"
            :class="base.WaitForPaymentOrderNumber > 0 ? 'Success_b' : base.WaitForPaymentOrderNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>待付款订单数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.WaitForPaymentOrderNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            @click="jumpLink('30')"
            :class="base.WaitForDeliveryOrderNumber > 0 ? 'Success_b' : base.WaitForDeliveryOrderNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>待发货订单数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.WaitForDeliveryOrderNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            @click="jumpLink('0')"
            :class="base.CancelOrderNumber > 0 ? 'Success_b' : base.CancelOrderNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>取消订单数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.CancelOrderNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.AuthenticationNumber > 0 ? 'Success_b' : base.AuthenticationNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>VIP客户数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.AuthenticationNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card shadow="always" :body-style="panlStyle">
          <div
            class="panl_box"
            :class="base.RegisterNumber > 0 ? 'Success_b' : base.RegisterNumber == 0 ? 'Warning_b' : 'Danger_b'"
          >
            <span>注册客户数</span>
            <span>
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="base.RegisterNumber"
                :duration="2000"
              ></count-to>
            </span>
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <p
      style="font-size: 18px;"
    >{{ time[0] ? getTime(time[0]) : getDay(-7) }} 至 {{ time[1] ? getTime(time[1]) : getDay(0) }} 销售数据</p>
    <div class="chartBox">
      <line-chart :chart-data="lineChartData"></line-chart>
    </div>
    <p
      style="font-size: 18px;"
    >{{ time[0] ? getTime(time[0]) : getDay(-7) }} 至 {{ time[1] ? getTime(time[1]) : getDay(0) }} 成交数据</p>
    <div class="rankBox">
      <div class="rank">
        <div class="chart" id="chart1"></div>
      </div>
      <div class="rank">
        <div class="chart" id="chart2"></div>
      </div>
    </div>
    <div class="rankBox">
      <div class="rank">
        <p>TOP20付款商品排行榜</p>
        <el-table border :data="rank.PaymentGoodsRanking">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GoodsName"
            label="商品名称"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GoodsNumber"
            label="数量"
            align="center"
          ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="Price" label="金额（元）" align="center"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="UnitPrice"
            label="客单价（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GrossProfit"
            label="毛利润（元）"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div class="rank">
        <p>TOP20客户排行榜</p>
        <el-table border :data="rank.CustomerRanking">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="UserName"
            label="客户名称"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="SalesMoney"
            label="销售金额（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="OrderNumber"
            label="订单数"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="UnitPrice"
            label="客单价（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GrossProfit"
            label="毛利润（元）"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="rankBox">
      <div class="rank">
        <p>TOP20访问商品排行榜</p>
        <el-table border :data="rank.VisitorRanking">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GoodsName"
            label="商品名称"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GoodsNumber"
            label="数量"
            align="center"
          ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="Price" label="金额（元）" align="center"></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="UnitPrice"
            label="客单价（元）"
            align="center"
          ></el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="GrossProfit"
            label="毛利润（%）"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div class="rank"></div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import {
  getIndexData,
  getIndexTableData,
  getIndexRankData,
  getIndexPieData
} from "@/api/main/index";
import LineChart from "./components/LineChart";
import echarts from "echarts";
export default {
  components: {
    CountTo,
    LineChart
  },
 
  data() {
    return {
      chart1: null,
      chart2: null,
      rank: {
        PaymentGoodsRanking: [],
        CustomerRanking: [],
        VisitorRanking: []
      },
      lineChartData: {},
      base: {
        TotalSalesMoney: 0,
        TotalOrderNumber: 0,
        TotalSalesGoodsNumber: 0,
        WaitForPaymentOrderNumber: 0,
        WaitForDeliveryOrderNumber: 0,
        CancelOrderNumber: 0,
        AuthenticationNumber: 0,
        RegisterNumber: 0,
        GrossProfitRate: 0,
        GrossProfit: 0,
        UnitPrice: 0,
        PayingCustomersNumber: 0,
        ConversionRate: 0,
        VisitorsNumber: 0
      },
      panlStyle: { padding: "0px" },
      time2: [],
      time: [],
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
    time2: function(val) {
      if (val === null) {
        this.time2 = [];
      }
    }
  },
  created() {
    this.getData();
  },

  methods: {
   
    jumpLink(str) {
      this.$router.push({
        path: "/order",
        query: {
          id: str
        }
      });
    },
    initChart1(data1, data2) {
      this.chart1 = echarts.init(document.getElementById("chart1"));
      const option = {
        title: {
          text: "成交人数占比",
          x: "center",
          textStyle: {
            color: "#344b58",
            fontSize: "22"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["新成交客户数", "老成交客户数"]
        },
        series: [
          {
            name: "成交数",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: data1, name: "新成交客户数" },
              { value: data2, name: "老成交客户数" }
            ]
          }
        ]
      };
      this.chart1.setOption(option);
    },
    initChart2(data1, data2) {
      this.chart2 = echarts.init(document.getElementById("chart2"));
      const option = {
        title: {
          text: "成交金额占比",
          x: "center",
          textStyle: {
            color: "#344b58",
            fontSize: "20"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["新成交客户付款金额", "老成交客户付款金额"]
        },
        series: [
          {
            name: "付款金额",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "14",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: data1, name: "新成交客户付款金额" },
              { value: data2, name: "老成交客户付款金额" }
            ]
          }
        ]
      };
      this.chart2.setOption(option);
    },
    getIndexPieData() {
      getIndexPieData({
        startTime: this.time[0]
          ? this.getTime(this.time[0]) + " 00:00:00"
          : this.getDay(-7) + " 00:00:00",
        endTime: this.time[1]
          ? this.getTime(this.time[1]) + " 23:59:59"
          : this.getDay(0) + " 23:59:59"
      }).then(res => {
        this.initChart1(
          res.NewUserTransactionProportion,
          res.OldUserTransactionProportion
        );
        this.initChart2(
          res.NewUserTransactionTotalAmount.toFixed(2),
          res.OldUserTransactionTotalAmount.toFixed(2)
        );
      });
    },
    getIndexRankData() {
      getIndexRankData({
        startTime: this.time2[0]
          ? this.getTime(this.time2[0]) + " 00:00:00"
          : this.getDay(-7) + " 00:00:00",
        endTime: this.time2[1]
          ? this.getTime(this.time2[1]) + " 23:59:59"
          : this.getDay(0) + " 23:59:59"
      }).then(res => {
        this.rank = res;
      });
    },
    getIndexTableData() {
      getIndexTableData({
        startTime: this.time2[0]
          ? this.getTime(this.time2[0]) + " 00:00:00"
          : this.getDay(-7) + " 00:00:00",
        endTime: this.time2[1]
          ? this.getTime(this.time2[1]) + " 23:59:59"
          : this.getDay(0) + " 23:59:59",
        dateType: 1,
        orderType: -1,
        sourceId: -1,
        sn: "",
        userSN_R: ""
      }).then(res => {
        const o = {};
        o.actualData = [];
        o.expectedData = [];
        o.date = [];
        res.map(v => {
          o.actualData.push((v.GrossProfitRate * 100).toFixed(2));
          // o.actualData.push(Math.floor(Math.random() * (1 - 100) + 100))
          o.expectedData.push(v.TotalSaleMonery);
          o.date.push(v.DateTime);
        });
        this.lineChartData = o;
      });
    },
    getData() {
      this.getIndexTableData();
      this.time = this.time2;
      getIndexData({
        startTime: this.time[0]
          ? this.getTime(this.time[0]) + " 00:00:00"
          : this.getDay(0) + " 00:00:00",
        endTime: this.time[1]
          ? this.getTime(this.time[1]) + " 23:59:59"
          : this.getDay(0) + " 23:59:59"
      }).then(res => {
        this.base = res;
        this.getIndexRankData();
        this.getIndexPieData();
      });
    },
    getDay(day) {
      const today = new Date();
      const targetday_milliseconds =
        today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      const tYear = today.getFullYear();
      let tMonth = today.getMonth();
      let tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    getTime(time) {
      const today = new Date(time);
      const targetday_milliseconds = today.getTime();
      today.setTime(targetday_milliseconds);
      const tYear = today.getFullYear();
      let tMonth = today.getMonth();
      let tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length === 1) {
        m = "0" + month;
      }
      return m;
    }
  }
};
</script>
<style scoped>
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
.tipSpan:hover {
  color: #00b0ff !important;
}
.freshReload:hover {
  color: #00b0ff !important;
}
.close_span:hover {
  color: #00b0ff !important;
}
.titleInfo {
  font-weight: 700;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffe0;
  color: red;
  height: 40px;
  width: 100%;
  font-size: 15px;
  text-align: center;
  padding-top: 10px;
  position:fixed
}
.closeTip {
  cursor: pointer;
  opacity: 0.8;
  position: absolute;
  right: 12px;
  top: 7px;
  width: 20px;
  height: 20px;
}
.panl_box > span:nth-child(1) {
  font-size: 16px;
  display: block;
  margin-bottom: 10px;
}

.panl_box > span:nth-child(2),
.card-panel-num {
  font-size: 16px;
}
</style>