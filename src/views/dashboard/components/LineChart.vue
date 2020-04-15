<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  // import { debounce } from '@/utils'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '550px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      // if (this.autoResize) {
      //   this.__resizeHanlder = debounce(() => {
      //     if (this.chart) {
      //       this.chart.resize()
      //     }
      //   }, 100)
      //   window.addEventListener('resize', this.__resizeHanlder)
      // }
      // // 监听侧边栏的变化
      // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      // sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

      this.chart.dispose()
      this.chart = null
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      setOptions({ expectedData, actualData, date, name } = {}) {
        if (!date) return
        let endList = 0
        if (date.length > 7 && date.length <= 30) {
          endList = 50
        } else if (date.length > 30 && date.length <= 50) {
          endList = 35
        } else if (date.length > 50 && date.length <= 100) {
          endList = 15
        } else if (date.length > 100) {
          endList = 5
        } else if (date.length > 2 && date.length <= 7) {
          endList = 80
        } else {
          endList = 100
        }
        this.chart.setOption({
          title: {
            text: name ? name + '销售数据' : '销售数据',
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
            formatter: '日期：{b} <br /> {a0}: {c0} 元<br />{a1}: {c1} %',
            axisPointer: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            top: 110,
            left: 150,
            right: 150,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
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
            data: date
          }],
          yAxis: [{
            type: 'value',
            name: '销售额',
            scale: true,
            min: 0,
            interval: 100000,
            axisLabel: {
              formatter: '￥{value}'
            }
          }, {
            type: 'value',
            name: '毛利率',
            scale: true,
            interval: 10,
            axisLabel: {
              formatter: '{value}%'
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
            data: ['销售额', '毛利率']
          },
          series: [
            {
              name: '销售额',
              type: 'bar',
              stack: '销售额',
              barWidth: 35,
              data: expectedData,
              barCateGoryGap: 20,
              yAxisIndex: 0,
              itemStyle: {
                normal: {
                  color: '#36a3f7',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#36a3f7'
                    }
                  }
                }
              }
            }, {
              name: '毛利率',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: '#f4516c'
                }
              },
              stack: '毛利率',
              data: actualData
            }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }
    }
  }
</script>