<template>
  <div class="dashboard-container">
    <div class="bd">
      时间：
      <el-date-picker
      v-model="starttime"
      type="month"
      size="mini"
      value-format='yyyy-MM'
      class='w200'
      placeholder="选择开始月">
    </el-date-picker> 至 <el-date-picker
      v-model="endtime"
      type="month"
      size="mini"
      class="w200"
      value-format='yyyy-MM'
      placeholder="选择结束月">
    </el-date-picker><span style="margin-left:10px;"></span>合作者：
      <el-select
        class="search_title"
        filterable
        clearable
        multiple
        collapse-tags
        v-model="brandCode"
        size="mini"
        placeholder="请选择合作者"
      >
        <el-option v-for="item in brandList" :key="item.PartnerId" :label="item.Name" :value="item.PartnerId"></el-option>
      </el-select>
      <el-button size="mini" type="success" @click="getData">查询</el-button>
      <el-button size="mini" type="success" @click="exportData">导出报表</el-button>
    </div>
    <div class="charts" id="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { gethezuozhedachebaobiao, daochuhezuozhedachebaobiao } from '@/api/charts/index'
import { getmanalist } from "@/api/retailer";
export default {
  data() {
    return {
      chart: null,
      starttime: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
      endtime: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
      brandList: [],
      brandCode: [],
      pickerOptions2: {
        shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          }]
      }
    };
  },
  mounted() {
    this.getBrand(() => {
      this.getData();
    });
  },
  methods: {
    exportData() {
      let endstr = ''
      if ((new Date(this.endtime).getMonth()+1) == 1 || (new Date(this.endtime).getMonth()+1) == 3 || (new Date(this.endtime).getMonth()+1) == 5 || (new Date(this.endtime).getMonth()+1) ==7 || (new Date(this.endtime).getMonth()+1) ==8 || (new Date(this.endtime).getMonth()+1) == 10 || (new Date(this.endtime).getMonth()+1) == 12) {
        endstr = '-31'
      } else {
        endstr = '-30'
      }
      daochuhezuozhedachebaobiao({
        partnerIds: this.brandCode.join(','),
        startDate: this.starttime ? this.starttime + '-01' : '',
        endDate: this.endtime ? this.endtime  + endstr: ''
      }).then(res => {
        window.open(res.fileLink, '_blank')
      })
    },
    initChart(listData) {
      this.chart = echarts.init(document.getElementById('chart'))
      let endList = 0
        if (listData.BrandNameDate.length > 5 && listData.BrandNameDate.length <= 10) {
          endList = 50
        } else if (listData.BrandNameDate.length > 10 && listData.BrandNameDate.length <= 20) {
          endList = 35
        } else if (listData.BrandNameDate.length > 20 && listData.BrandNameDate.length <= 40) {
          endList = 20
        } else if (listData.BrandNameDate.length > 40 && listData.BrandNameDate.length <= 60) {
          endList = 5
        } else if (listData.BrandNameDate.length > 60) {
          endList = 1
        } else if (listData.BrandNameDate.length > 2 && listData.BrandNameDate.length <= 7) {
          endList = 80
        } else {
          endList = 100
        }
      this.chart.setOption({
          title: {
            text: '月度销售报表',
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
            data: listData.BrandNameDate
          }],
          legend: {
            top: '40',
            data: ['计划(万)','本月合计(万)','今日销售(万)','完成率(%)']
          },
          yAxis: [{
            type: 'value',
            name: '销售额(万)',
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
            show: true,
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
              name: '计划(万)',
              type: 'bar',
              barWidth: 20,
              stack: '计划(万)',
              data: listData.SellPlanMoney
            },{
              name: '本月合计(万)',
              type: 'bar',
              barWidth: 20,
              stack: '本月合计(万)',
              data: listData.OrderMoney
            },{
              name: '今日销售(万)',
              type: 'bar',
              barWidth: 20,
              stack: '今日销售(万)',
              data: listData.TodayOrderMoney
            },{
              name: '完成率(%)',
              type: 'bar',
              barWidth: 20,
              stack: '完成率(%)',
              data: listData.BrandReach
            }]
        }, true)
    },
    getData() {
      if (this.starttime && !this.endtime) {
        this.$message.error('请选择结束时间')
        return
      }
      if (this.endtime && !this.starttime) {
        this.$message.error('请选择开始时间')
        return
      }
      if (this.starttime && this.endtime) {
        if ((new Date(this.endtime).getTime() - new Date(this.starttime).getTime()) < 0) {
          this.$message.error('开始日期必须小于结束日期')
          return
        }
      }
      let endstr = ''
      if ((new Date(this.endtime).getMonth()+1) == 1 || (new Date(this.endtime).getMonth()+1) == 3 || (new Date(this.endtime).getMonth()+1) == 5 || (new Date(this.endtime).getMonth()+1) ==7 || (new Date(this.endtime).getMonth()+1) ==8 || (new Date(this.endtime).getMonth()+1) == 10 || (new Date(this.endtime).getMonth()+1) == 12) {
        endstr = '-31'
      } else {
        endstr = '-30'
      }
      gethezuozhedachebaobiao({
        partnerIds: this.brandCode.join(','),
        startDate: this.starttime ? this.starttime + '-01' : '',
        endDate: this.endtime ? this.endtime  + endstr: ''
      }).then(res => {
        let a = []
        a.BrandName = []
        a.BrandReach = []
        a.Month = []
        a.OrderMoney = []
        a.SellPlanMoney = []
        a.TodayOrderMoney = []
        a.BrandNameDate = []
        res.map(v => {
          a.BrandName.push(v.PartnerName)
          a.BrandReach.push(v.PartnerReach)
          let str = v.Year + '年' + v.Month + '月'
          a.Month.push(str)
          a.OrderMoney.push(v.OrderMoney)
          a.SellPlanMoney.push(v.SellPlanMoney)
          a.TodayOrderMoney.push(v.TodayOrderMoney)
          a.BrandNameDate.push(str + '-' + v.PartnerName)
        })
        this.initChart(a)
      })
    },
    getBrand(cb) {
      getmanalist().then(res => {
        res.map(v => {
          this.brandCode.push(v.PartnerId)
        })
        this.brandList = res;
        this.$nextTick(() => {
          cb()
        })
      });
    }
  }
};
</script>

<style scoped>
.search_title {
  width: 300px;
}
.bd {
  padding: 20px;
}

.w200 {
  width: 120px;
}

.charts {
  width: 100%;
  height: 500px;
  padding-top: 10px;
}
</style>