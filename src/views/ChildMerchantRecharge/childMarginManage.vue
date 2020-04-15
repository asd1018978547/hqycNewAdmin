<template>
  <div class="searchBox" style="padding-top:25px;">
    <el-row>
        <el-col :span='4'>
          <span class="timed">保证金账户ID：</span>
          <el-input clearable v-model="search.fundAccountId" class="search_title" size='small' placeholder="请输入保证金账户ID">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户编号：</span>
          <el-input clearable v-model="search.userSN" class="search_title" size='small' placeholder="请输入商户编号">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户名称：</span>
          <el-input clearable v-model="search.retailerName" class="search_title" size='small' placeholder="请输入商户名称">
          </el-input>
        </el-col>
        <el-col :span='6'>
          <span class="timed">流水时间：</span>
          <el-date-picker @change='seletechange' v-model="time" value-format='yyyy-MM-dd' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <span class="timed">账户状态：</span>
        <el-select @change='seletechange' v-model="search.status" class="search_title" size="small" placeholder="请选择账户状态" >
          <el-option label="全部" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="冻结" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span='8'>
        <el-button @click="getmerchantlist" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <div style="padding:15px">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column label="序号" type="index" width="50"  align='center'></el-table-column>
          <el-table-column label='保证金账户ID' prop='FundAccountId' align='center'></el-table-column>
          <el-table-column label='商户编号' prop='UserSN' align='center'></el-table-column>
          <el-table-column label='商户名称' prop='RetailerName' align='center'></el-table-column>
          <el-table-column label='商户等级' prop='RetailerLevel' align='center'></el-table-column>
          <el-table-column label='账户余额(元)' prop='BalanceMoney' align='center'>
            <template slot-scope='scope'>
              <span>{{ scope.row.BalanceMoney.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label='状态' prop='Status' align='center'>
            <template slot-scope='scope'>
              <el-tag v-if="scope.row.Status == 1" type="success">正常</el-tag>
              <el-tag v-if="scope.row.Status == 2" type="danger">冻结</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='操作' prop='Status' align='center'>
            <template slot-scope='scope'>
              <el-button type="success" v-if="scope.row.Status == 2" size='mini' @click="changeStatus(scope.row)">解冻</el-button>
              <el-button type="danger" v-if="scope.row.Status == 1" size='mini' @click="changeStatus(scope.row)">冻结</el-button>
              <el-button type="primary" size='mini' @click="getDesc(scope.row)">明细</el-button>
            </template>
          </el-table-column>
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
import { getChildMarginManageList, changeStatus } from '@/api/ChildMerchantRecharge/ChildMerchantRecharge'
import { PKoptions } from '@/assets/pickerOptions'
export default {
  data() {
    return {
      list: [],
      pickerOptions: PKoptions,
      time: [],
      TotalRows: 0,
      search: {
        fundAccountId: '',
        userSN: '', 
        retailerName: '',
        status: '0', 
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
    getDesc(row) {
      this.$router.push({
        path: '/childMarginManageDesc',
        query: {
          id: row.FundAccountId
        }
      })
    },
    changeStatus(row) {
      this.$confirm(row.Status === 1 ? '确定要冻结这个账户吗? ' : '确定要解冻这个账户吗? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus({
          fundAccountType: 2,
          fundAccountId: row.FundAccountId,
          status: row.Status === 1 ? 2 : 1
        }).then(res => {
          this.$message.success(row.Status === 1 ? '冻结成功' : '解冻成功')
          this.getmerchantlist()
        })
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
      getChildMarginManageList(this.search).then(res => {
        this.list = res.Data
        this.TotalRows = res.TotalRows
      })
    }
  }
}
</script>

<style>
</style>
