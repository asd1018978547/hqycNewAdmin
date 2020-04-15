<template>
  <div class="content_box">
    <m-title title='商品调拨管理'></m-title>
    <!-- 搜索盒子 -->
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">调拨单号：</span>
          <el-input v-model="search.allocationNo" clearable class="search_title" size="small" placeholder="请输入调拨单号"  maxlength="30" ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">调出渠道：</span>
          <el-select class="search_title" clearable v-model="search.outPartnerId" size="small" placeholder="请选择调出渠道" >
            <el-option v-for="item in WarehouseList" :key="item.PartnerId" :label="item.Name" :value="item.PartnerId"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">调入渠道：</span>
          <el-select  class="search_title" clearable v-model="search.enterPartnerId" size="small" placeholder="请选择调入渠道" >
            <el-option v-for="item in WarehouseList" :key="item.PartnerId" :label="item.Name" :value="item.PartnerId"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">审核状态：</span>
          <el-select  class="search_title" clearable v-model="search.auditStatus" size="small" placeholder="请选择审核状态" >
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="已审核" :value="1"></el-option>
            <el-option label="已关闭" :value="2"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">出库状态：</span>
          <el-select  class="search_title" clearable v-model="search.outStockStatus" size="small" placeholder="请选择出库状态" >
            <el-option label="等待出库" :value="0"></el-option>
            <el-option label="出库完成" :value="1"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">入库状态：</span>
          <el-select  class="search_title" clearable v-model="search.enterStockStatus" size="small" placeholder="请选择入库状态" >
            <el-option label="等待入库" :value="0"></el-option>
            <el-option label="入库完成" :value="1"></el-option>
          </el-select>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="4">
          <span class="timed">商品条码：</span>
          <el-input v-model="search.Sn" clearable class="search_title" size="small" placeholder="请输入商品条码" maxlength="30"></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">商品名称：</span>
          <el-input v-model="search.name" clearable class="search_title" size="small" placeholder="请输入商品名称" maxlength="30"></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">申请人：</span>
          <el-input v-model="search.applyName" clearable class="search_title" size="small" placeholder="请输入申请人" maxlength="30"></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">审核人：</span>
          <el-input v-model="search.auditName" clearable class="search_title" size="small" placeholder="请输入审核人" maxlength="30"></el-input>
        </el-col>

        <el-col :span="5">
          <span class="timed">申请时间：</span>
           <el-date-picker value-format='yyyy-MM-dd' v-model='DateRange1' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
      </el-row>

    </div>


    <el-col class="marginBottom">
      <span class="timed"></span>
      <el-button  type="primary" @click="add">调拨开单</el-button>
      <el-button  type="primary" @click="Search" icon="el-icon-search">查询</el-button>
      <el-button  type="primary" @click="onExport" >导出</el-button>
    </el-col>

    <!-- 表单盒子 -->
    <div class="list_box">
      <el-table border :data="tableData">
        <el-table-column prop="AllocationNo" label="调拨单号" align='center'></el-table-column>
        <el-table-column prop="AllocationReason" label="调拨原因" align='center'></el-table-column>
        <el-table-column prop="OutPartnerName" label="调出渠道" align='center'></el-table-column>
        <el-table-column prop="EnterPartnerName" label="调入渠道" align='center'></el-table-column>
        <el-table-column prop="AuditStatusDesc" label="审核状态" align='center'></el-table-column>
        <el-table-column prop="OutStockStatusDesc" label="出库状态" align='center'></el-table-column>
        <el-table-column prop="EnterStockStatusDesc" label="入库状态" align='center'></el-table-column>
        <el-table-column prop="ApplyName" label="申请人" align='center'></el-table-column>
        <el-table-column label="申请时间" align='center'>
          <template slot-scope="scope">
            <div class="time">{{scope.row.ApplyDate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="AuditName" label="审核人" align='center'></el-table-column>
        <el-table-column label="审核时间" align='center'>
          <template slot-scope="scope">
            <div class="time">{{scope.row.AuditDate}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width="180" >
          <template slot-scope="scope">
            <span @click="jump(scope.row)" class="blue">详情</span>
            <span @click="del(scope.row)" v-if="scope.row.AuditStatus==0" class="blue">删除</span>
        </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search.pageIndex" 
      :page-sizes="[15,30,50,100]" :page-size="search.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="TotalRows"></el-pagination>
    </div>
  </div>
</template>
<script>
import { PKoptions } from '@/assets/pickerOptions'
import { getList , getWarehouseList ,del,ExportOrder} from "../../api/stockManagement/goodsAllocationBill";
import { formatDateTime, parseTime } from "@/utils/index";
import MTitle from '@/components/MTitle'
import moment from "moment";
export default {
  components: { MTitle },
  data() {
    return {
      DateRange1:[], // 下单时间
      roleBtn: [],
      tableData: [],
      pickerOptions: PKoptions,
      WarehouseList:[],
      search: {
        allocationNo:'',
        outPartnerId:'',
        enterPartnerId:'',
        auditStatus:'',
        outStockStatus:'',
        enterStockStatus:'',
        sn: "",
        name:'',
        applyName:'',
        auditName:'',
        pageIndex: 1,
        pageSize: 15,
      },
      TotalRows: 0,
      TotalPage: 0,
    };
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
    //导出订单
    onExport() {
      
      let par = JSON.parse(JSON.stringify(this.search)) 
      if(par.outPartnerId ==='') par.outPartnerId = -1
      if(par.enterPartnerId ==='') par.enterPartnerId = -1
      if(par.auditStatus ==='') par.auditStatus = -1
      if(par.outStockStatus ==='') par.outStockStatus = -1
      if(par.enterStockStatus ==='') par.enterStockStatus = -1
      if(this.DateRange1 !== null  && this.DateRange1.length > 0 ){
        par.startDate= this.DateRange1[0]
        par.endDate =this.DateRange1[1]
        if(par.startDate == par.endDate){
          par.startDate = par.startDate + ' 00:00:00'
          par.endDate = par.endDate + ' 23:59:59'
        }
      } 
      delete par.pageIndex
      delete par.pageSize
      console.log(par)
        const Loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        })
        ExportOrder(par).then(res => {
          Loading.close()
          const href = window._config.fileServer + res.fileName
          window.open(href)
        }).catch(() => {
          Loading.close()
        })
      },
    //分页相关
    handleSizeChange(v) {
      this.search.pageSize = v;
       this.getData();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
       this.getData();
    },
    Search(){
      this.search.pageIndex=1
      this.getData();
    },  
    //跳转详情
    jump(row){
      this.$router.push({
        path: '/goodsAllocationDetail',
        query:{
          allocationNo:row.AllocationNo
        }
      })
    },
    del(row){
      this.$confirm("确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        del({allocationNo:row.AllocationNo}).then(res=>{
          this.$message.success("删除成功！");
          this.getData();
        })
      }); 
    },
    add(){
      this.$router.push({ path: '/addAllocationBill', })
    },
    //获取全部数据
    getData() {
      let par = JSON.parse(JSON.stringify(this.search)) 
      if(par.outPartnerId ==='') par.outPartnerId = -1
      if(par.enterPartnerId ==='') par.enterPartnerId = -1
      if(par.auditStatus ==='') par.auditStatus = -1
      if(par.outStockStatus ==='') par.outStockStatus = -1
      if(par.enterStockStatus ==='') par.enterStockStatus = -1
      if(this.DateRange1 !== null  && this.DateRange1.length > 0 ){
        par.startDate= this.DateRange1[0]
        par.endDate =this.DateRange1[1]
        if(par.startDate == par.endDate){
          par.startDate = par.startDate + ' 00:00:00'
          par.endDate = par.endDate + ' 23:59:59'
        }
      }  
      console.log(par,'par')
      getList(par).then(res => {
        // res.Data.map(item => {
        //   item.DateModified = formatDateTime(item.DateModified);
        // });
        this.tableData = res.Data;    
        this.PageIndex = res.PageIndex
        this.TotalRows =res.TotalRows
        this.TotalPage = res.TotalPage
      });
    },
    //获取仓库选项数据
    getWarehouseList(){
      getWarehouseList().then(res=>{
        this.WarehouseList = res
      })
    },

  },
  created() {
    //获取全部数据
    this.getData();
    this.getWarehouseList()
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
  },
  activated(){
    this.getData();
  },
  
};
</script>
<style>
.order_top .el-tabs__nav-wrap {
  height: 60px;
}
.order_top .el-tabs__nav-scroll {
  margin-top: 10px;
  overflow: visible;
}
</style>

<style lang="scss" scoped>
 .blue{
    color: #409eff;
    cursor: pointer;
  }
.marginBottom {
  margin-bottom: 20px;
}
.fz14 {
  font-size: 14px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}

.align_left {
  text-align: left;
}

.goods_con {
  display: flex;
  box-sizing: border-box;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.choice_group {
  width: 100%;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;

  .input_group {
    flex: 1;
  }

  #fileEl {
    position: absolute;
    width: 265px;
    height: 36px;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
  }

  .file_text {
    width: 265px;
    height: 36px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-circle-close {
    cursor: pointer;
    font-size: 15px;
    position: relative;
    left: -32px;
    color: #aaa;
    z-index: 10000;
  }

  .pan-btn {
    padding: 10px 20px;
  }
}

p {
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

.list_box {
  .btn_group {
    .btn_item {
      padding: 10px 0;
      border-top: 1px solid #eee;

      .pan-btn {
        line-height: 1.5;
      }
    }
  }
}

.text_center {
  text-align: center;
}

.size14 {
  font-size: 14px;
  line-height: 1.5;
}
</style>