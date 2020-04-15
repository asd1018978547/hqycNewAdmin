<template>
  <div class="">
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">订单类型：</span>
          <el-select class="search_title" clearable v-model='search.orderType' size="mini" placeholder="请选择订单类型">
            <el-option label="保税备货" value="2"></el-option>
            <el-option label="跨境直邮" value="1"></el-option>
            <el-option label="一般贸易" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">订单来源：</span>
          <el-select class="search_title" clearable v-model='search.sourceId' size="mini" placeholder="请选择订单来源">
            <el-option label="商城下单" value="1"></el-option>
            <el-option label="手工导入" value="2"></el-option>
            <el-option label="API" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商品SN：</span>
          <el-input v-model='search.sn' clearable class="search_title" size='mini' placeholder="请输入商品SN">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户：</span>


            <!-- @change='saveUser'  -->
          <el-select  @change='saveUser' class="search_title"  filterable clearable v-model='search.user' size="mini" placeholder="请选择商户" multiple collapse-tags >
            <el-option v-for="(item,index) in userList" :key="index" :label="item.Company"  :value="item.UserSN_R"> {{ '姓名：' + item.Company + '电话：'+ item.Phone }}</el-option>
            <!--  -->
          </el-select>


          
        </el-col>
        <el-col :span='4'>
          <span class="timed">日期类型：</span>
          <el-select class="search_title" clearable v-model='search.dateType' size="mini" placeholder="请选择日期类型">
            <el-option label="日" value="1"></el-option>
            <el-option label="月" value="2"></el-option>
            <el-option label="年" value="3"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span='4'>
              <span class="timed">订单类型：</span>
              <el-select class="search_title" clearable v-model='search.OrderStatus' size="mini" placeholder="请选择订单类型">
                <el-option label="待发货" value="30,40,50"></el-option>
                <el-option label="已发货" value="60"></el-option>
                <el-option label="已完成" value="70"></el-option>
                <el-option label="退款中" value="80"></el-option>
              </el-select>
            </el-col>
        <el-col :span='8'>
          <span class="timed">查询日期：</span>
          <el-date-picker v-model='time' :picker-options="pickerOptions2" class="w200" size='mini' type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-button v-if='checkBtn("func_common_search")' class="search_btn pan-btn green-btn" @click='getData' type="success" size='mini' icon='el-icon-search'>查询</el-button>
          <el-button  v-if='checkBtn("func_common_export")'  class="search_btn pan-btn green-btn" @click='exportData' type="success" size='mini' icon='el-icon-search'>数据导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="charts" id="chart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import { getProfit, getProfitUserList, exportData } from '@/api/charts/index'
  export default {
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.getUser()
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
        obj.startTime = this.time[0] ? this.getTime(this.time[0]) : this.getDay(-30)
        obj.endTime = this.time[1] ? this.getTime(this.time[1]) : this.getDay(0)
        obj.sourceId = obj.sourceId === '' ? -1 : obj.sourceId
        obj.orderType = obj.orderType === '' ? -1 : obj.orderType
        exportData(obj).then(res => {
          window.open(res.fileLink, '_blank')
        })
      },
      getData() {
        this.search.userSN_R = this.search.user.join(',')
        const obj = JSON.parse(JSON.stringify(this.search))
        obj.startTime = this.time[0] ? this.getTime(this.time[0]) : this.getDay(-30)
        obj.endTime = this.time[1] ? this.getTime(this.time[1]) : this.getDay(0)
        obj.sourceId = obj.sourceId === '' ? -1 : obj.sourceId
        obj.orderType = obj.orderType === '' ? -1 : obj.orderType
        getProfit(obj).then(res => {
          const a = {
            GrossProfitRate: [],
            GrossProfit: [],
            DateTime: []
          }
          res.map(v => {
            a.GrossProfitRate.push(v.GrossProfitRate.toFixed(2))
            a.GrossProfit.push(v.GrossProfit)
            a.DateTime.push(v.DateTime)
          })
          this.initChart(a)
        })
      },
      initChart(listData) {
        this.chart = echarts.init(document.getElementById('chart'))
        let endList = 0
        if (listData.GrossProfitRate.length > 7 && listData.GrossProfitRate.length <= 30) {
          endList = 50
        } else if (listData.GrossProfitRate.length > 30 && listData.GrossProfitRate.length <= 50) {
          endList = 35
        } else if (listData.GrossProfitRate.length > 50 && listData.GrossProfitRate.length <= 100) {
          endList = 15
        } else if (listData.GrossProfitRate.length > 100) {
          endList = 5
        } else if (listData.GrossProfitRate.length > 2 && listData.GrossProfitRate.length <= 7) {
          endList = 80
        } else {
          endList = 100
        }
        this.chart.setOption({
          title: {
            text: '毛利润数据',
            x: 'center',
            textStyle: {
              color: '#344b58',
              fontSize: '22'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '日期：{b} <br /> {a0}: {c0} %<br />{a1}: {c1} 元',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              interval: 0

            },
            data: listData.DateTime
          }],
          yAxis: [
            {
              type: 'value',
              name: '毛利率(%)',
              interval: 10,
              axisLabel: {
                formatter: '{value} %'
              }
            },
            {
              type: 'value',
              name: '毛利润(元)',
              interval: 10000,
              axisLabel: {
                formatter: '{value} 元'
              }
            }
          ],
          dataZoom: [{
            show: endList < 100 ? 'true' : 'false',
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 0,
            zoomLock: true,
            end: endList,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#344b58'

            },
            textStyle: {
              color: '#344b58'
            },
            borderColor: '#90979c'
          }],
          series: [
            {
              name: '毛利率',
              type: 'line',
              stack: '毛利率',
              data: listData.GrossProfitRate
            }, {
              name: '毛利润',
              type: 'bar',
              barWidth: 35,
              itemStyle: {
                normal: {
                  color: '#27727b',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#27727b'
                    }
                  }
                }
              },
              yAxisIndex: 1,
              stack: '毛利润',
              data: listData.GrossProfit
            }]
        }, true)
      },
      saveUser(res) {
        // this.search.userSN_R = res.UserSN_R ? res.UserSN_R : []
        this.userList = this.userListBackUp
      },
      onUserSearch(val) {
        
        if (val) {
          const a = JSON.parse(JSON.stringify(this.userListBackUp))
          const b = []
          for (let index = 0; index < a.length; index++) {
            if (a[index].Company.indexOf(val) > -1 || a[index].Phone.indexOf(val) > -1) {
              b.push(a[index])
            }
          }
          this.search.user = val
          this.userList = b
        } else {
          this.userList = this.userListBackUp
        }
      },
      getUser() {
        getProfitUserList({
          company: '',
          pageIndex: 1,
          pageSize: 99999
        }).then(res => {
          this.userListBackUp = res.Data
          this.userList = res.Data
        })
      },
      doHandleMonth(month) {
        var m = month
        if (month.toString().length === 1) {
          m = '0' + month
        }
        return m
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
      }
    },
    data() {
      return {
        search: {
          startTime: '',
          endTime: '',
          dateType: '1',
          sourceId: '',
          orderType: '',
          OrderStatus: '',
          userSN_R: [],
          user: [],
          sn: ''
        },
        roleBtn: [],
        userList: [],
        userListBackUp: [],
        driver: null,
        time: [],
        res: null,
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
<style scoped>
  .bd {
    padding: 20px;
  }

  .w200 {
    width: 250px;
  }
  .timed{
    padding-left: 10px;
  }
  .charts {
    width: 100%;
    height: 700px;
    padding-top: 10px;
  }
</style>