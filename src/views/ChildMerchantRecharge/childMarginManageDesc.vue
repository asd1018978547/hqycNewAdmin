<template>
  <div class="searchBox" style="padding-top:25px;">
    <el-row>
        <el-col :span='6'>
          <span class="timed">流水时间：</span>
          <el-date-picker @change='seletechange' v-model="time" value-format='yyyy-MM-dd' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
        <span class="timed">交易类型：</span>
        <el-select @change='seletechange' v-model="search.transactionType" class="search_title" size="small" placeholder="请选择交易类型" >
          <el-option label="全部" value="0"></el-option>
          <el-option label="缴纳" value="3"></el-option>
          <el-option label="提现" value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span='8'>
        <el-button @click="getmerchantlist" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <div style="padding:15px;padding-top:20px;">
      <el-row>
        <el-col :span="24">
          <el-tag style="margin-right:10px;">预付款账户ID：{{ FundAccountId }}</el-tag>
          <el-tag style="margin-right:10px;">商户编号：{{ UserSN }}</el-tag>
          <el-tag style="margin-right:10px;">商户名称：{{ RetailerName }}</el-tag>
          <el-tag style="margin-right:10px;">账户余额：{{ BalanceMoney }}</el-tag>
        </el-col>
      </el-row>
    </div>
    <div style="padding:15px;padding-top:0">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column label='交易流水号' prop='TransactionSerialNumber' align='center'></el-table-column>
          <el-table-column label='交易时间' prop='DateAdded' align='center'></el-table-column>
          <el-table-column label='类型说明' align='center'>
            <template slot-scope="scope">
              <el-tag v-if='scope.row.TransactionType == 1'>订单结算</el-tag>
              <el-tag v-if='scope.row.TransactionType == 2' type="warning">订单退款</el-tag>
              <el-tag v-if='scope.row.TransactionType == 3' type="success">充值</el-tag>
              <el-tag v-if='scope.row.TransactionType == 4' type="danger">提现</el-tag>
              <el-tag v-if='scope.row.TransactionType == 8' type="success">缴纳</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='交易金额(元)' prop='TransactionMoney' align='center'></el-table-column>
          <el-table-column label='余额(元)' prop='CurrentBalanceMoney' align='center'></el-table-column>
          <el-table-column label='操作人' prop='Operation' align='center'></el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search.pageIndex"
            :page-sizes="[15,30,50,100]" :page-size="search.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="TotalRows">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { getChildMerchantWalletDesc, getChildMerchantDesc } from '@/api/ChildMerchantRecharge/ChildMerchantRecharge'
import { PKoptions } from '@/assets/pickerOptions'
export default {
  data() {
    return {
      list: [],
      pickerOptions: PKoptions,
      time: [],
      TotalRows: 0,
      search: {
        transactionType: '',
        fundAccountType: 2,
        fundAccountId: this.$route.query.id,
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        pageIndex: 1,
        pageSize: 15
      },
      BalanceMoney: 0,
      RetailerName: '',
      FundAccountId: '',
      UserSN: ''
    }
  },
  activated() {
    this.getmerchantlist()
    this.getChildMerchantDesc()
  },
  methods: {
    getChildMerchantDesc() {
      getChildMerchantDesc({
        fundAccountType: 2,
        fundAccountId: this.$route.query.id
      }).then(res => {
        this.BalanceMoney = res.BalanceMoney
        this.RetailerName = res.RetailerName
        this.FundAccountId = res.FundAccountId
        this.UserSN = res.UserSN
      })
    },
    seletechange() {
      this.search.pageIndex = 1
      this.getmerchantlist()
    },
    handleSizeChange(v) {
      this.search.pageSize = v
      this.getmerchantlist()
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v
      this.getmerchantlist()
    },
    getmerchantlist() {
      if (this.time != null && this.time.length === 2) {
        this.search.startTime = this.time[0] + ' 00:00:00'
        this.search.endTime = this.time[1] + ' 23:59:59'
      } else {
        this.search.startTime = ''
        this.search.endTime = ''
      }
      this.getChildMerchantDesc()
      getChildMerchantWalletDesc(this.search).then(res => {
        this.list = res.Data
        this.TotalRows = res.TotalRows
      })
    }
  }
}
</script>

<style>
</style>
