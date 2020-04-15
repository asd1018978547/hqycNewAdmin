<template>
  <div class="adv content_box">
    <m-title title='成本计划报表'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='5'>
          <span class="timed">贸易类型：</span>
          <el-select v-model="search.orderType" clearable class='search_title' size="small" placeholder="请选择贸易类型">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="跨境直邮" value="1"></el-option>
            <el-option label="保税备货" value="2"></el-option>
            <el-option label="一般贸易" value="3"></el-option>
          </el-select>
        </el-col>
 
        <el-col :span='5'>
          <span class="timed">排序：</span>
          <el-select v-model="search.sort" clearable class='search_title' size="small" placeholder="请选择排序方式">
            <el-option label="销量" value="1"></el-option>
            <el-option label="毛利润" value="2"></el-option>
          </el-select>
        </el-col>

         <el-col :span='5'>
          <span class="timed">条码：</span>
          <el-input v-model='search.SN' clearable class="search_title" size='small' placeholder="请输入条码">
          </el-input>
        </el-col>

        <el-col :span='5'>
          <span class="timed">商品名称：</span>
          <el-input v-model='search.name' clearable class="search_title" size='small' placeholder="请输入商品名称">
          </el-input>
        </el-col>
      </el-row>


      <el-row>

        <el-col :span='5'>
          <span class="timed">时间：</span>
          <el-date-picker value-format='yyyy-MM-dd' v-model='DateRange1' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>

        <el-col :span='5'>
          <span class="timed">渠道：</span>
          <el-select class="search_title" filterable clearable multiple collapse-tags v-model="brandCode" size="mini" placeholder="请选择" >
            <el-option v-for="item in brandList" :key="item.PartnerId" :label="item.Name" :value="item.PartnerId"></el-option>
          </el-select>
        </el-col>

        <el-col :span='5'>
          <span class="timed"></span>
          <el-button @click='getSearch' size="small" type="primary" class=" pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button @click='onExport' size="small" type="info"   class=" pan-btn tiffany-btn">导出</el-button>
        </el-col>
      </el-row>


    </div>
    <el-table border :data="tableData">
      <el-table-column prop="OrderTypeDesc" label="贸易类型" align='center'></el-table-column>
      <el-table-column prop="SN" label="条码" align='center'></el-table-column>
      <el-table-column prop="Name" label="商品名称" align='center'></el-table-column>
      <el-table-column prop="StandardInfo" label="商品规格" align='center'></el-table-column>
      <el-table-column prop="PartnerName" label="渠道" align='center'></el-table-column>
      <el-table-column prop="Count" label="销量" align='center'></el-table-column>
      <el-table-column prop="GrossProfit" label="毛利润(￥)" align='center'></el-table-column>
      <el-table-column prop="GrossProfitRate" label="毛利率(%)" align='center'></el-table-column>
      <el-table-column prop="Amount" label="库存" align='center'></el-table-column>
      <el-table-column prop="CostPrice" label="成本(￥)" align='center'></el-table-column>
      <el-table-column label="操作"  align='center'>
        <template slot-scope="scope">
          <el-button @click='jumpDesc(scope.row)' type="primary" size="small" class="pan-btn blue-btn">历史成本</el-button>
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
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { PKoptions } from '@/assets/pickerOptions'
  import { getData ,Exl} from '@/api/costReport/costReport'
  import { getmanalist } from "@/api/retailer" 
  import moment from "moment";
  export default {
    components: { MTitle },
    data() {
      return {
        TotalRows: 0,
        tableData: [],
        brandList: [],//渠道合作列表
        brandCode: [],
        pickerOptions: PKoptions,
          DateRange1:[ moment().subtract(7,'d').format('YYYY-MM-DD'), moment().format("YYYY-MM-DD") ], // 下单时间
        search: {
          pageIndex: 1,
          pageSize: 15,
          name:'',
          orderType	: '-1', //贸易类型
          SN:'' ,//条码
          sort:'' //排序
        },
      }
    },
    mounted() {
      this.getBrand(() => {
        this.getList()
      });
    },
    methods: {
      //渠道合作
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
      },
      jumpDesc(row) {
        sessionStorage.setItem('r',JSON.stringify(row))
          this.$router.push({
          path: '/costReportHistory',
          query: {
            SkuId : row.SkuId,
            OrderType : row.OrderType
          }
        })
      },
      onExport() {
        const Loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        
        const p = { 
          orderType:Number(this.search.orderType),
          partnerIds: this.brandCode.join(','),
          sn : this.search.SN,
          sort :Number(this.search.sort),
          pageIndex : this.search.pageIndex,
          pageSize :this.search.pageSize,
          name: this.search.name,
          startTime:'',
          endTime : ''
        }
           if(this.DateRange1 !== null  && this.DateRange1.length > 0 ){
            p.startTime= this.DateRange1[0]
            p.endTime =this.DateRange1[1]
            if(p.startTime == p.endTime){
              p.startTime = p.startTime + ' 00:00:00'
              p.endTime = p.endTime + ' 23:59:59'
            }
          }
           if(p.startTime == '' || p.endTime ==''){
            Loading.close()
            this.$message.error('请选择时间');
            return
            }
        Exl(p).then(res => {
          Loading.close()
          const href = window._config.fileServer + res.fileName
          window.open(href)
        }).catch(() => {
          Loading.close()
        })
      },
      getSearch() {
        this.search.pageIndex = 1
        this.getList()
      },
      handleCurrentChange(v) {
        this.search.pageIndex = v
        this.getList()
      },
      handleSizeChange(v) {
        this.search.pageSize = v
        this.getList()
      },
      //表格数据
      getList() {
        const p = { 
          orderType:Number(this.search.orderType),
          partnerIds: this.brandCode.join(','),
          sn : this.search.SN,
          sort :'',
          pageIndex : this.search.pageIndex,
          pageSize :this.search.pageSize,
          name: this.search.name,
          startTime:'',
          endTime:''
        }
          //设置查询条件
          if(this.search.sort == ''){
            delete p.sort;
          }else{
            p.sort = Number(this.search.sort)
          }
          //设置时间  选择同一天添加时间戳
          if(this.DateRange1 !== null  && this.DateRange1.length > 0 ){
            p.startTime= this.DateRange1[0]
            p.endTime =this.DateRange1[1]
            if(p.startTime == p.endTime){
              p.startTime = p.startTime + ' 00:00:00'
              p.endTime = p.endTime + ' 23:59:59'
            }
          }  
          //判断是否选择时间
          if(p.startTime == '' || p.endTime ==''){
          this.$message.error('请选择时间');
          return
      } 
        getData(p).then(res => {
          this.TotalRows = res.TotalRows
          this.tableData = res.Data
        })
      },
    },
    
  }
</script>