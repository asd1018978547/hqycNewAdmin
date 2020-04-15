<template>
  <div class="skuSalesReport">
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">商品SN：</span>
          <el-input v-model='search.sn' clearable class="search_title" size='small' placeholder="请输入商品SN">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">订单来源：</span>
          <el-select class="search_title" clearable v-model='search.sourceId' size="mini" placeholder="请选择订单来源">
              <el-option label="请选择" value="-1"></el-option>
            <el-option label="商城下单" value="1"></el-option>
            <el-option label="手工导入" value="2"></el-option>
            <el-option label="API" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span='8'>
            <span class="timed">查询日期：</span>
            <el-date-picker v-model='time' :picker-options="pickerOptions2" class="w200" size='small' type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-button v-if='checkBtn("func_common_search")' class="search_btn" @click='getData' type="success" size='mini' icon='el-icon-search'>查询</el-button>
            <el-button v-if='checkBtn("func_common_export")' class="search_btn pan-btn green-btn" @click='exportData' type="success" size='mini' icon='el-icon-search'>数据导出</el-button>
          </el-col>
      </el-row>
    </div>
    <div class="chartBox">
      <line-chart :chart-data="lineChartData"></line-chart>
    </div>
  </div>
</template>
<script>
  import LineChart from '../dashboard/components/LineChart'
  import { getSkuSalesReport, expoerSkuSalesReport } from '@/api/charts/index'
  export default {
    components: {
      LineChart
    },
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.getData()
    },
    watch: {
      time: function(val) {
        if (!val) {
          this.time = []
        }
      }
    },
    methods: {
      checkBtn(str) {
        let f = false
        this.roleBtn.forEach(item => {
          if (item.FunctionCode === str) {
            f = true
          }
        })
        return f
      },
      exportData() {
        const obj = JSON.parse(JSON.stringify(this.search))
        obj.startTime = this.time[0] ? this.getTime(this.time[0]) + ' 00:00:00' : this.getDay(-7) + ' 00:00:00'
        obj.endTime = this.time[1] ? this.getTime(this.time[1]) + ' 23:59:59' : this.getDay(0) + ' 23:59:59'
        expoerSkuSalesReport(obj).then(res => {
          window.open(res.fileLink, '_blank')
        })
      },
      getData() {
        const obj = JSON.parse(JSON.stringify(this.search))
        obj.startTime = this.time[0] ? this.getTime(this.time[0]) + ' 00:00:00' : this.getDay(-7) + ' 00:00:00'
        obj.endTime = this.time[1] ? this.getTime(this.time[1]) + ' 23:59:59' : this.getDay(0) + ' 23:59:59'
        getSkuSalesReport(obj).then(res => {
          const o = {}
          o.actualData = []
          o.expectedData = []
          o.date = []
          res.skuSaleData.map(v => {
            o.actualData.push(v.GrossProfitRate.toFixed(2))
            // o.actualData.push(Math.floor(Math.random() * (1 - 100) + 100))
            o.expectedData.push(v.TotalSaleMonery)
            o.date.push(v.DateTime)
          })
          o.name = res.skuGoodsName
          this.lineChartData = o
        })
      },
      getDay(day) {
        const today = new Date()
        const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday_milliseconds)
        const tYear = today.getFullYear()
        let tMonth = today.getMonth()
        let tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      getTime(time) {
        const today = new Date(time)
        const targetday_milliseconds = today.getTime()
        today.setTime(targetday_milliseconds)
        const tYear = today.getFullYear()
        let tMonth = today.getMonth()
        let tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      doHandleMonth(month) {
        var m = month
        if (month.toString().length === 1) {
          m = '0' + month
        }
        return m
      }
    },
    data() {
      return {
        lineChartData: {},
        name: '',
        roleBtn: [],
        search: {
          startTime: '',
          endTime: '',
          dateType: '1',
          sourceId: '-1',
          orderType: '-1',
          userSN_R: '',
          sn: ''
        },
        time: [],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    }
  }
</script>