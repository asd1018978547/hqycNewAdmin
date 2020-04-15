<template>
  <div class="content_box roleadd goodsManage">
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">订单管理</div>
        <div class="searchBox">
          <el-row>
            <el-col :span='5'>
              <span class="timed">订单状态：</span>
              <el-select class="search_title" v-model="search.orderStatus" size="mini">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="已取消" :value="0"></el-option>
                <el-option label="待付款" :value="1"></el-option>
                <el-option label="待发货" :value="2"></el-option>
                <el-option label="待签收" :value="4"></el-option>
                <el-option label="已签收" :value="5"></el-option>
              </el-select>
            </el-col>
            <el-col :span='7'>
              <span class="timed" style="flex:0 0 150px;">订单号/顾客/合伙人：</span>
              <el-input style="margin-left:10px;" clearable v-model='search.keys' class="search_title" size='mini'
                placeholder="订单号/顾客/合伙人">
              </el-input>
            </el-col>
            <el-col :span='10'>
              <span class="timed">时间段：</span>
              <el-date-picker size="mini" v-model="time" type="daterange" align="right" unlink-panels
                range-separator="-" start-placeholder="开始日期" value-format='yyyy-MM-dd' end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
              <el-button class="search_btn" @click='getdata' type="success" size='mini'>查询
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table ref='tables' :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column label='订单号' prop='OrderCode' align='center' show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="jumpdesc(scope.row.OrderCode)">{{ scope.row.OrderCode }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label='下单时间' prop='DateAdded' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='顾客' prop='CustomerName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='合伙人' prop='PartnerName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='订单金额(元)' prop='FinalMoney' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='来源店铺' prop='ShopName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='付款状态' prop='PayDesc' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='支付方式' prop='PayTypeDesc' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='发货' prop='ExpressName' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='状态' prop='OrderStatusDesc' align='center' show-overflow-tooltip></el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageIndex" :page-sizes="[15,30,50,100]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalRows">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSupplierOrderList } from "@/api/Partner/orderListManagement";
import { formatDateTime } from '@/utils/index'
export default {
  data() {
    return {
      time: [],
      search: {
        keys: "",
        orderStatus: '',
        StartDate: "",
        EndDate: ""
      },
      list: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  activated() {
    this.getdata();
  },
  methods: {
    jumpdesc(code) {
      this.$router.push({
        path: 'orderInfoManagement',
        query: {
          code: code
        }
      })
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getdata();
    },
    getdata() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      if (this.time) {
        p.StartDate = this.time[0];
        p.EndDate = this.time[1];
      }else{
        p.StartDate = '',
        p.EndDate = '';
      }
      getSupplierOrderList(p).then(res => {
        res.Data.map(v => {
          v.DateAdded = formatDateTime(v.DateAdded)
        })
        this.list = res.Data;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style scoped lang="scss">
.chebox_list {
  padding: 0 10px;
}
.chebox_list p,
.el-radio-group,
.chebox_list .chebox_radio {
  width: 100%;
}
.inb_120 {
  display: inline-block;
  width: 120px;
}
.box_top {
  height: 50px;
  line-height: 50px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
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
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.box {
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
}

.box_left {
  flex: 0 0 150px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.content_box {
  width: 100%;
  box-sizing: border-box;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
  box-sizing: border-box;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.skuItem {
  display: flex;
}

.skuItem img {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
}

.skuItem p {
  line-height: 25px;
  padding-left: 10px;
  text-align: left;
  margin: 0;
}

.mb {
  margin-bottom: 5px;
}
</style>