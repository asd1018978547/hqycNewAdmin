<template>
  <div class="content_box">
    <div class="searchBox">
      <el-row>
        <el-col :span='5'>
          <span class="timed">订单编号：</span>
          <el-input clearable class="search_title" v-model="search.OrderCode" size='small' placeholder="请输入订单编号">
          </el-input>
        </el-col>
        <!-- <el-col :span='5'>
          <span class="timed">收件人：</span>
          <el-input clearable class="search_title" v-model="search.consignee" size='small' placeholder="请输入收件人">
          </el-input>
        </el-col> -->
        <el-col :span='7'>
          <span class="timed">订单日期：</span>
          <el-date-picker v-model="search.time" class="timePicker" size="small" type="daterange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span='5'>
          <span class="timed">订单状态：</span>
          <el-select v-model="search.orderStatus" size="small" placeholder="请选择订单状态">
            <el-option v-for="(item,index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button v-if='checkBtn("func_common_search")' size="small" type="primary" @click="getData" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table border :data="tableData">
      <el-table-column :show-overflow-tooltip="true" prop="OrderCode" label="订单编号" align='center' width='180'>
        <template slot-scope="scope">
          <p style="color:#409EFF;cursor: pointer;" @click='jumporder(scope.row)'>{{ scope.row.OrderCode }}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="商品名称" align='center'>
        <template slot-scope="scope">
          <div v-for='item in scope.row.OrderDetail' :key='item.SN' class="tag">
            <el-tag type='info'>
              {{item.Name}}x{{item.Count}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="TotalMoney" label="订单金额" width='100' align='center'></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="Receiver" label="退款信息" width='180' align='left'>
        <template slot-scope="scope">
          <p style="margin: 0">收件人：{{scope.row.Receiver}}</p>
          <p style="margin: 0">订单金额：{{scope.row.TotalMoney}}</p>
          <p style="margin: 0">退款时间：<br/>{{scope.row.RefundApplyTime}}
          </p>
          <p style="margin: 0">处理时间：<br/>{{scope.row.RefundProcessingTime}}
          </p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="PayTypeDesc" label="支付信息" width='180' align='center'>
        <template slot-scope="scope">
          <p style="margin: 0">支付类型：{{scope.row.PayTypeDesc}}</p>
          <p style="margin: 0" v-if='scope.row.PayOrderBatchId != ""'>批次号：{{scope.row.PayOrderBatchId}}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="RefundApplyTime" label="申请时间" align='center'></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="RefundProcessingTime" label="处理时间" align='center'></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="RefundDesc" label="退款原因" align='center' width='150'></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="RefundDescForAdmin" label="处理结果" align='center' width='150'></el-table-column> -->
      <el-table-column label="状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tag v-if='scope.row.OrderStatus == 80' type='warning'>{{scope.row.OrderStatusDesc}}</el-tag>
          <el-tag v-else-if='scope.row.OrderStatus == 90' type='success'>{{scope.row.OrderStatusDesc}}</el-tag>
          <el-tag v-else-if='scope.row.OrderStatus == 100' type='danger'>{{scope.row.OrderStatusDesc}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align='center'>
        <template slot-scope="scope">
          <el-button v-if='checkBtn("func_common_detail")' style="margin-bottom: 10px;" @click="jumporder(scope.row)" type="primary" size="small">查看</el-button><br/>
          <el-button style="margin-bottom: 10px;" v-if='scope.row.OrderStatus == 80 && checkBtn("func_order_audit")' @click="editOrder(scope.row, true)" type="success"
            size="small">通过</el-button><br v-if='scope.row.OrderStatus == 80'/>
          <el-button style="margin-bottom: 10px;" v-if='scope.row.OrderStatus == 80 && checkBtn("func_order_audit")' @click="showmodel(scope.row)" type="danger" size="small">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="text-align:right;margin-top:10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[15, 50, 100, 200]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
    <el-dialog :close-on-click-modal='1 == 0' v-if="dialogVisible" title="提示" :visible.sync="dialogVisible" width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">拒绝理由：</div>
          <div class="info_right">
            <el-input clearable v-model='passInfo' placeholder="请输入拒绝理由" size='mini'></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="editOrder(null,false)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { PKoptions } from '@/assets/pickerOptions'
  import { editRefund, getRefund } from '@/api/refund'
  import { formatTimes } from '@/utils/index'
  export default {
    data() {
      return {
        defaultActive: '1',
        tableData: [],
        dialogVisible: false,
        options: [{ label: '全部订单', value: '80,90,100' }, { label: '退款中', value: '80' }, { label: '退款成功', value: '90' }, { label: '退款失败', value: '100' }],
        search: {
          orderStatus: '80,90,100',
          OrderCode: '',
          time: [],
          consignee: ''
        },
        pickerOptions: PKoptions,
        currentPage: 1,
        totalRow: 0,
        totalPage: 0,
        passInfo: '',
        status: 1,
        infoRow: {},
        pageSize: 15,
        pageIndex: 1,
        roleBtn: []
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
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
      jumporder(row) {
        this.$router.push({
          path: '/orderDetail',
          query: {
            id: row.OrderCode
          }
        })
      },
      showmodel(row) {
        this.dialogVisible = true
        this.infoRow = row
      },
      editOrder(row, f) {
        if (f) {
          this.$confirm(('确定通过退款吗？'), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            editRefund({
              isRefund: f,
              OrderCode: row.OrderCode,
              remarks: ''
            }).then(res => {
              this.$message.success('退款成功')
              this.getData()
            })
          })
        } else {
          if (this.passInfo === '') {
            this.$message.error('请输入拒绝理由')
            return
          }
          editRefund({
            isRefund: f,
            OrderCode: this.infoRow.OrderCode,
            remarks: this.passInfo
          }).then(res => {
            this.$message.success('拒绝成功')
            this.dialogVisible = false
            this.getData()
          })
        }
      },
      // 分页相关
      handleSizeChange(v) {
        this.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.pageIndex = v
        this.getData()
      },
      getData() {
        const p = this.search
        if (p.time && p.time.length > 0) {
          p.startTime = formatTimes(p.time[0])
          p.endTime = formatTimes(p.time[1]) + ' 23:59:59'
        } else {
          p.startTime = ''
          p.endTime = ''
        }
        p.pageIndex = this.pageIndex
        p.pageSize = this.pageSize
        if (p.orderStatus === '') {
          p.orderStatus = '89,90,100'
        }
        getRefund(p).then(res => {
          res.Data.map(v => {
            if (v.RefundDesc === '') {
              v.RefundDesc = '无'
            } else if (v.RefundDescForAdmin === '') {
              v.RefundDescForAdmin = '无'
            }
          })          
          this.currentPage = res.PageIndex
          this.totalPage = res.TotalPages
          this.totalRow = res.TotalRows
          this.tableData = res.Data    
        })
      }
    }
  }
</script>
<style lang="scss">
  .tag {
    margin-bottom: 10px
  }

  .tag:nth-last-child(1) {
    margin-bottom: 0 !important
  }

  .info_item {
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .info_item .info_title {
    flex: 0 0 80px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 0 0 200px;
  }

  .search_title {
    width: 56%;
  }

  .el-input-group {
    display: inline-block;
  }

  .timed {
    margin-right: 5px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .timePicker {
    width: 380px !important;
  }

  .clearfix {
    clear: both;
    height: 20px;
    width: 100%;
  }

  .add {
    margin-bottom: 10px;
  }

  .searchBox {
    clear: both;
    padding: 10px;
  }

  .time {
    text-align: center;
  }

  .adv {
    padding: 10px;
  }

  .adv th {
    font-weight: 400;
  }

  .adv_img {
    max-width: 200px;
    max-height: 150px;
  }

  .adv td {
    font-size: 13px;
  }

  .adv .status {
    text-align: center;
  }

  .online {
    color: #67c23a;
  }

  .online,
  .offline {
    text-align: center;
  }

  .offline {
    color: #f56c6c;
  }
</style>