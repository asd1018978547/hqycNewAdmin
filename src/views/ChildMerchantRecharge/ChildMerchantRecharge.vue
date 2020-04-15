<template>
  <div class="searchBox" style="padding-top:25px;">
    <el-row>
        <el-col :span='4'>
          <span class="timed">商户编号：</span>
          <el-input clearable v-model="search.userSN" class="search_title" size='small' placeholder="请输入商户编号">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户名称：</span>
          <el-input clearable v-model="search.merchantName" class="search_title" size='small' placeholder="请输入商户名称">
          </el-input>
        </el-col>
        <el-col :span='6'>
          <span class="timed">业务时间：</span>
          <el-date-picker @change='seletechange' v-model="time" value-format='yyyy-MM-dd' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <span class="timed">充值方式：</span>
        <el-select @change='seletechange' v-model="search.payWay" class="search_title" size="small" placeholder="请选择充值方式" >
          <el-option label="全部" value="-1"></el-option>
          <el-option label="微信支付" value="1"></el-option>
          <el-option label="支付宝支付" value="2"></el-option>
          <el-option label="银联支付" value="3"></el-option>
          <el-option label="线下转账" value="4"></el-option>
          <el-option label="通联支付" value="5"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span class="timed">充值状态：</span>
        <el-select @change='seletechange' v-model="search.status" class="search_title" size="small" placeholder="请选择订单来源" >
          <el-option label="全部" value="-1"></el-option>
          <el-option label="待上传凭证" value="1"></el-option>
          <el-option label="待凭证审核" value="2"></el-option>
          <el-option label="成功" value="3"></el-option>
          <el-option label="凭证审核不通过" value="4"></el-option>
        </el-select>
      </el-col>
        <el-col :span="4">
        <span class="timed">业务类型：</span>
        <el-select @change='seletechange' v-model="search.businessType" class="search_title" size="small" placeholder="请选择业务类型" >
          <el-option label="全部" value="-1"></el-option>
          <el-option label="商户钱包充值" value="1"></el-option>
          <el-option label="保证金缴纳" value="2"></el-option>
          <el-option label="授信账户还款" value="3"></el-option>
        </el-select>
      </el-col>
      <el-col :span='8'>
        <el-button @click="getmerchantlist" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <div style="padding:15px">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column label="序号" type="index" width="50"  align='center'></el-table-column>
          <el-table-column label='业务类型' prop='BusinessTypeDesc' align='center'></el-table-column>
          <el-table-column label='业务流水号' prop='BusinessSerialNumber' align='center' width="220"></el-table-column>
          <el-table-column label='业务时间' prop='DateAdded' align='center'></el-table-column>
          <el-table-column label='资金账户ID' prop='FundAccountId' align='center' width="200"></el-table-column>
          <el-table-column label='商户编号' prop='UserSN_R' align='center'></el-table-column>
          <el-table-column label='商户名称' prop='MerchantName' align='center'></el-table-column>
          <el-table-column label='充值金额(￥)' prop='RechargeMoney' align='center'></el-table-column>
          <el-table-column label='手续费(￥)' prop='ServiceChargeMoney' align='center'></el-table-column>
          <el-table-column label='充值方式' prop='PayTypeDesc' align='center'></el-table-column>
          <el-table-column label='状态' prop='Status' align='center'>
            <template slot-scope='scope'>
              <el-tag v-if="scope.row.Status == 1">待上传凭证</el-tag>
              <el-tag v-if="scope.row.Status == 2" type="warning">待凭证审核</el-tag>
              <el-tag v-if="scope.row.Status == 5" type="warning">待支付</el-tag>
              <el-tag v-if="scope.row.Status == 3" type="success">成功</el-tag>
              <!-- <el-tag v-if="scope.row.Status == 6" type="success">成功</el-tag> -->
              <el-tag v-if="scope.row.Status == 4" type="danger">凭证审核不通过</el-tag>
              <el-tag v-if="scope.row.Status == 7" type="danger">支付失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='操作人' prop='UserName' align='center'></el-table-column>
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
import { getmerchantlist } from '@/api/ChildMerchantRecharge/ChildMerchantRecharge'
import { PKoptions } from '@/assets/pickerOptions'
export default {
  data() {
    return {
      list: [],
      pickerOptions: PKoptions,
      time: [],
      TotalRows: 0,
      search: {
        userSN: '', 
        payWay: '-1', 
        status: '-1', 
        businessType: '-1', 
        merchantName: '', 
        startTime: '', 
        endTime: '', 
        pageIndex: 1,
        pageSize: 15
      }
    }
  },
  created() {
    this.getmerchantlist()
  },
  methods: {
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
      getmerchantlist(this.search).then(res => {
        this.list = res.Data
        this.TotalRows = res.TotalRows
      })
    }
  }
}
</script>

<style>
</style>
