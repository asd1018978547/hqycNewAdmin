<template>
  <div class="dashboard-container">
    <div class="bd">
      <el-date-picker v-model='time' :picker-options="pickerOptions2" class="w200" size='mini' type="daterange"
        range-separator="-" start-placeholder="开始日期" @change='checkTime' end-placeholder="结束日期">
      </el-date-picker>
      <!--v-if='checkBtn("func_common_search")'-->
      <el-button  size='mini' type="success" @click='getData'>按日期查询</el-button>
      <el-button v-if='checkBtn("func_report_order_pctoexcel")' size='mini' type="success" @click='openDownLoad(1)'>导出PC前台订单excel</el-button>
      <el-button v-if='checkBtn("func_report_order_appletexcel")' size='mini' type="success" @click='openDownLoad(2)'>导出小程序订单excel</el-button>
      <el-button v-if='checkBtn("func_report_order_handtoexcel")' size='mini' type="success" @click='openDownLoad(3)'>导出手工新增订单excel</el-button>
      <el-button v-if='checkBtn("func_report_order_batchtoexcel")' size='mini' type="success" @click='openDownLoad(4)'>导出批量导入订单excel</el-button>
    </div>
    <div class="charts" id="chart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import { getCharts } from '@/api/charts/index'
  import * as Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import steps from './defineSteps'
  export default {
    name: 'dashboard',
    data() {
      return {
        driver: null,
        time: [],
        roleBtn: [],
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
    },
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
    },
    mounted() {
      this.getData()
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
      doHandleMonth(month) {
        var m = month
        if (month.toString().length === 1) {
          m = '0' + month
        }
        return m
      },
      checkTime(val) {
        if ((new Date(val[1]).getTime() - new Date(val[0]).getTime()) / 1000 / 60 / 60 / 24 > 365) {
          this.$message.error('请选择小于1年的时间')
          this.time = []
        }
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
      openDownLoad(val) {
        const res = this.res
        let obj = ''
        let name = (this.time[0] ? this.getTime(this.time[0]) : this.getDay(-7)).toString() + '至' + (this.time[1] ? this.getTime(this.time[1]) : this.getDay(0)).toString()
        switch (val) {
          case 1:
            obj = 'BusinessFrontOrderResult'
            name += 'PC前台'
            break
          case 2:
            obj = 'wxOrderResult'
            name += '小程序'
            break
          case 3:
            obj = 'RetailerHandMovementOrderResult'
            name += '手工新增'
            break
          case 4:
            obj = 'RetailerBatchImportOrderResult'
            name += '批量导入'
            break
        }
        let str = `查询日期,订单数量,订单金额（元）\n`
        for (let i = 0; i < res[obj].length; i++) {
          for (const item in res[obj][i]) {
            if (item === 'DateAdded') {
              res[obj][i][item] = res[obj][i][item].split(' ')[0]
            } else if (item === 'OrderPrice') {
              res[obj][i][item] = res[obj][i][item]
            }
            str += `${res[obj][i][item] + '\t'},`
          }
          str += '\n'
        }
        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
        var link = document.createElement('a')
        link.href = uri
        link.download = name + '数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      },
      getData() {
        getCharts({
          startTime: this.time[0] ? this.getTime(this.time[0]) : this.getDay(-7),
          endTime: this.time[1] ? this.getTime(this.time[1]) : this.getDay(0),
          orderStatus: '30,40,50,60,70'
        }).then(res => {
          this.res = res
          const r = {}
          r.time = []
          r.all = {}
          r.all.price = []
          r.all.count = []
          r.a_1 = {}
          r.a_1.price = []
          r.a_1.count = []
          r.a_2 = {}
          r.a_2.price = []
          r.a_2.count = []
          r.a_3 = {}
          r.a_3.price = []
          r.a_3.count = []
          r.a_4 = {}
          r.a_4.price = []
          r.a_4.count = []
          r.a_5 = {}
          r.a_5.price = []
          r.a_5.count = []
          for (const i in res) {
            for (let x = 0; x < res[i].length; x++) {
              if (i !== 'TotalOrderResult' && i !== 'RetailerOrderResult') {
                if (!r.all.price[x]) {
                  r.all.price[x] = 0
                  r.all.count[x] = 0
                  r.all.price[x] += res[i][x].OrderPrice
                  r.all.count[x] += res[i][x].OrderCount
                } else {
                  r.all.price[x] += res[i][x].OrderPrice
                  r.all.count[x] += res[i][x].OrderCount
                }
              }
              if (i === 'BusinessFrontOrderResult') {
                r.a_1.price[x] = res[i][x].OrderPrice
                r.a_1.count[x] = res[i][x].OrderCount
              } else if (i === 'RetailerBatchImportOrderResult') {
                r.a_2.price[x] = res[i][x].OrderPrice
                r.a_2.count[x] = res[i][x].OrderCount
              } else if (i === 'RetailerHandMovementOrderResult') {
                r.a_3.price[x] = res[i][x].OrderPrice
                r.a_3.count[x] = res[i][x].OrderCount
              } else if (i === 'wxOrderResult') {
                r.a_4.price[x] = res[i][x].OrderPrice
                r.a_4.count[x] = res[i][x].OrderCount
              } else if (i === 'RetailerApiImportOrderResult') {
                r.a_5.price[x] = res[i][x].OrderPrice
                r.a_5.count[x] = res[i][x].OrderCount
              }
            }
          }
          const p = r.all.price.map(v => {
            return v.toFixed(2)
          })
          r.all.price = p
          res['BusinessFrontOrderResult'].map(v => {
            r.time.push(v.DateAdded.split(' ')[0])
          })
          this.initChart(r)
        })
      },
      initChart(listData) {
        this.chart = echarts.init(document.getElementById('chart'))
        let endList = 0
        if (listData.all.price.length > 7 && listData.all.price.length <= 30) {
          endList = 50
        } else if (listData.all.price.length > 30 && listData.all.price.length <= 50) {
          endList = 35
        } else if (listData.all.price.length > 50 && listData.all.price.length <= 100) {
          endList = 15
        } else if (listData.all.price.length > 100) {
          endList = 5
        } else if (listData.all.price.length > 2 && listData.all.price.length <= 7) {
          endList = 80
        } else {
          endList = 100
        }
        this.chart.setOption({
          title: {
            text: '订单数据',
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
            data: listData.time
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }],
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
          legend: {
            top: '40',
            data: ['总计数量', 'API订单数量','PC前台订单数量', '小程序订单数量', '手工新增订单数量', '批量导入订单数量', '总计金额', 'API订单金额', 'PC前台订单金额', '小程序订单金额', '手工新增订单金额', '批量导入订单金额']
          },
          series: [
            {
              name: '总计数量',
              type: 'bar',
              barWidth: 20,
              stack: '总计数量',
              data: listData.all.count
            }, {
              name: '总计金额',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: '#27727B'
                }
              },
              stack: '总计金额',
              data: listData.all.price
            }, {
              name: 'API订单数量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: '#FE8463'
                }
              },
              stack: '数量',
              data: listData.a_5.count
            }, {
              name: 'API订单金额',
              type: 'bar',
              barWidth: 20,
              stack: '金额',
              data: listData.a_5.price
            }, {
              name: 'PC前台订单数量',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: '#FE8463'
                }
              },
              stack: '数量',
              data: listData.a_1.count
            }, {
              name: 'PC前台订单金额',
              type: 'bar',
              barWidth: 20,
              stack: '金额',
              data: listData.a_1.price
            }, {
              name: '小程序订单数量',
              type: 'bar',
              barWidth: 20,
              stack: '数量',
              data: listData.a_4.count
            }, {
              name: '小程序订单金额',
              type: 'bar',
              barWidth: 20,
              stack: '金额',
              data: listData.a_4.price
            }, {
              name: '手工新增订单数量',
              type: 'bar',
              stack: '数量',
              barWidth: 20,
              data: listData.a_3.count
            }, {
              name: '手工新增订单金额',
              type: 'bar',
              stack: '金额',
              barWidth: 20,
              data: listData.a_3.price
            }, {
              name: '批量导入订单数量',
              type: 'bar',
              stack: '数量',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: '#FAD860'
                }
              },
              data: listData.a_2.count
            }, {
              name: '批量导入订单金额',
              type: 'bar',
              stack: '金额',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: '#26C0C0'
                }
              },
              data: listData.a_2.price
            }]
        }, true)
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

  .charts {
    width: 100%;
    height: 500px;
    padding-top: 10px;
  }
</style>