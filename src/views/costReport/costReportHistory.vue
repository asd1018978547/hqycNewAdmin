<template>
  <div class="adv content_box">
    <m-title title="历史成本"></m-title>
    <div class="searchBox">
      <el-row style="margin-bottom:0;">
        <el-col :span='2'>
          <span class="timed">贸易类型：</span>
          <span>{{ row.OrderTypeDesc }}</span>
        </el-col>

         <el-col :span='3'>
          <span class="timed">条码：</span>
          <span>{{ row.SN }}</span>
        </el-col>
        <el-col :span='5'>
          <span class="timed">商品名称：</span>
          <span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" >{{ row.Name  }}</span>
        </el-col>

        <el-col :span='5' >
          <span class="timed">商品规格：</span>
          <span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ row.StandardInfo }}</span>
        </el-col>

        <el-col :span="5">
          <span class="timed">创建时间：</span>
          <el-date-picker value-format='yyyy-MM-dd' v-model='DateRange1' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>

        <el-col :span='4'>
          <el-button @click='getSearch' size="small" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button @click='getExl' size="small" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">导出</el-button>
        </el-col>

      </el-row>
    </div>

    <el-table border :data="tableData">
      <el-table-column prop="CostPrice" label="成本(￥)" align='center'></el-table-column>
      <el-table-column prop="DateAdded" label="创建时间" align='center'></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search.pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="search.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import MTitle from '@/components/MTitle'
import { PKoptions } from "@/assets/pickerOptions";
import { getHistory ,HistoryExl} from '@/api/costReport/costReport'
import { formatDateTime } from '@/utils/index'
export default {
  components: { MTitle },
  data() {
    return {
      row:{},
      pickerOptions: PKoptions,
      tableData:[],
      DateRange1:[],
      search: {
        SkuId: this.$route.query.SkuId,
        OrderType: this.$route.query.OrderType,
        pageIndex: 1,
        pageSize: 15,
      },
      TotalRows: 0,
      TotalPage: 0,
    };
  },
  created(){
    this.row= JSON.parse(sessionStorage.getItem('r'))  //当前成本数据
    this.getHistory()
  },
  methods:{
    getSearch(){
        this.search.pageIndex = 1 
        this.getHistory()
    },
    handleCurrentChange(v) {
        this.search.pageIndex = v
        this.getHistory()
      },
    handleSizeChange(v) {
        this.search.pageSize = v
        this.getHistory()
      },
    getHistory(){
      const p = { 
        orderType:this.search.OrderType,
          skuId:this.search.SkuId,
          pageIndex : this.search.pageIndex,
          pageSize :this.search.pageSize,
        }
      if(this.DateRange1 !== null && this.DateRange1.length > 0 ){
        p.startTime= this.DateRange1[0]
        p.endTime =this.DateRange1[1]
        if(p.startTime == p.endTime){
          p.startTime = p.startTime + ' 00:00:00'
          p.endTime = p.endTime + ' 23:59:59'
        }
      }else{
         p.startTime= ''
         p.endTime = ''
      }           
    getHistory(p).then(res=>{
       res.Data.map(v => {
          v.DateAdded = formatDateTime(v.DateAdded)
        })
        res.Data.forEach(element => {
          element.CostPrice=element.CostPrice.toFixed(2)
        });
        this.TotalRows = res.TotalRows
        this.tableData = res.Data
      })
    },

    getExl(){
      const Loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
      const p ={
        orderType:Number(this.search.OrderType),
        skuId:Number(this.search.SkuId),
        startTime:'',
        endTime : ''
      }
      if( this.DateRange1 !== null &&  this.DateRange1.length > 0 ){
        p.startTime= this.DateRange1[0]
        p.endTime =this.DateRange1[1]
        if(p.startTime == p.endTime){
          p.startTime = p.startTime + ' 00:00:00'
          p.endTime = p.endTime + ' 23:59:59'
        }
      } 
      // if(p.startTime == '' || p.endTime ==''){
      //     Loading.close()
      //     this.$message.error('请选择时间');
      //     return
      // }
      HistoryExl(p).then(res=>{
          Loading.close()
          const href = window._config.fileServer + res.fileName
          window.open(href)
      })
    }
  },
  
};
</script>