<template>
  <div class="content_box">
    <el-tabs v-model="activeTab" @tab-click="tabClick" class="order_top">
      <el-tab-pane :name="item.name" v-for="(item,index) in orderStatusList" :key="index">
        <span slot="label" class="fz14">{{ item.name }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="searchBox" style="padding-bottom:60px;">
      <el-col :span="6">
        <span class="timed">账单日期：</span>
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
      <el-col :span="4">
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
      <el-col :span="8">
        <el-button @click="getData" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
      </el-col>
    </div>
    <p>合计应收账款：<span class="Danger" style="font-size:18px;">{{ allcountprice }}</span>元</p>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column label="账单结算期间" prop="RowNumber" align="center" width="180px;">
          <template slot-scope="scope">
            {{ scope.row.StartTime }}至{{ scope.row.EndTime }}
          </template>
        </el-table-column>
        <el-table-column label="账单编号" prop="SettleMentCode" align="center" width="150px"></el-table-column>
        <el-table-column label="结算周期" prop="SettlementPeriodType" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.SettlementPeriodType == 0">现结</span>
            <span v-if="scope.row.SettlementPeriodType == 1">周结</span>
            <span v-if="scope.row.SettlementPeriodType == 2">月结</span>
            <span v-if="scope.row.SettlementPeriodType == 3">固定期限</span>
          </template>
        </el-table-column>
        <el-table-column label="分销商" prop="PartnerName" align="center"></el-table-column>
        <el-table-column label="期初应收账款(元)" prop="OpeningAccountsReceivableAmount" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.OpeningAccountsReceivableAmount < 0" class="Danger">{{ scope.row.OpeningAccountsReceivableAmount }}</span>
            <span v-else class="Success">+{{ scope.row.OpeningAccountsReceivableAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交金额(元)" prop="Amount" align="center">
          <template slot-scope="scope">
            <span class="Success">+{{ scope.row.Amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交笔数" prop="Count" align="center"></el-table-column>
        <el-table-column label="退款售后金额(元)" prop="RefundAmount" align="center">
          <template slot-scope="scope">
            <span class="Danger">-{{ scope.row.RefundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款售后笔数" prop="RefundCount" align="center"></el-table-column>
        <el-table-column label="应收账款(元)" prop="ReceivableAmout" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.ReceivableAmout < 0" class="Danger">{{ scope.row.ReceivableAmout }}</span>
            <span v-else class="Success">+{{ scope.row.ReceivableAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应收笔数" prop="ReceivableCount" align="center"></el-table-column>
        <el-table-column label="应收总账(元)" prop="AccountsTotalReceivableAmout" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.AccountsTotalReceivableAmout < 0" class="Danger">{{ scope.row.AccountsTotalReceivableAmout }}</span>
            <span v-else class="Success">+{{ scope.row.AccountsTotalReceivableAmout }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" prop="SettlementStatus" align="center">
           <template slot-scope="scope">
             <span v-if='scope.row.SettlementStatus == 0' class="Danger">未结算</span>
             <span v-if='scope.row.SettlementStatus == 1' class="Success">已结算</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="Status" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="exportExcl(scope.row)">下载账单</el-button><br/>
            <el-button type="text" size="mini" @click="desc(scope.row)">账单详情</el-button><br/>
            <el-button v-if='scope.row.SettlementStatus == 0' type="text" size="mini" @click="check(scope.row)">确认结算</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalRows"
        ></el-pagination>
      </div>
  </div>
</template>

<script>
import { PKoptions } from "@/assets/pickerOptions";
import { getplist, getZD, checkJS, exportExcl } from "@/api/settle/settleSetting.js";
export default {
  data() {
    return {
      pickerOptions: PKoptions,
      activeTab: "全部账单",
      allcountprice: 0,
      channelIdList: [],
      search: {
        DateRange1: null,
        PartnerId: null
      },
      list: [],
      TotalRows: 0,
      pageIndex: 1,
      pageSize: 15,
      settlementStatus: -1,
      orderStatusList: [
        { name: "全部账单", status: -1 },
        { name: "已结算账单", status: 1 },
        { name: "未结算账单", status: 0 }
      ]
    };
  },
  activated() {
    this.getplist();
    this.getData()
  },
  methods: {
    exportExcl(item) {
      exportExcl({
        SettleMentCode: item.SettleMentCode
      }).then(res => {
        window.open(res.fileLink, '_blank')
      })
    },
    desc(item) {
      this.$router.push({
        path: '/BillSearchDesc',
        query: {
          id: item.SettleMentCode,
          stime: item.StartTime,
          etime: item.EndTime,
          status: item.SettlementStatus
        }
      })
    },
    check(item) {
      this.$confirm('确定要结算这笔账单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
checkJS({
        settlementBillId: item.Id,
        settlementStatus: 1
      }).then(res => {
        this.$message.success('结算成功')
        this.pageIndex = 1
        this.getData()
      })
        })
      
    },
    tabClick(item) {
      this.settlementStatus = this.orderStatusList[item.index].status
      this.getData()
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.getData()
    },
    handleCurrentChange(v) {
      this.pageIndex = v
      this.getData()
    },
    getData() {
      let p = JSON.parse(JSON.stringify(this.search))
      if (this.search.DateRange1) {
        p.startDate = this.search.DateRange1[0] + ' 00:00:00'
        p.endDate = this.search.DateRange1[1] + " 23:59:59"
      }
      p.pageIndex = this.pageIndex;
      p.pageSize = this.pageSize;
      p.settlementStatus = this.settlementStatus
      getZD(p).then(res => {
        this.TotalRows = res.TotalRows
        this.list = res.Data.BillList
        this.allcountprice = res.Data.ReceivableTotalAmout
      })
    },
    getplist() {
      getplist({
        partnerId: 0
      }).then(res => {
        this.channelIdList = res;
      });
    }
  }
};
</script>

<style>
</style>
