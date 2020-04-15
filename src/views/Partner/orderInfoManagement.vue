<template>
  <div class="orderInfo">
    <h2>订单号：{{ $route.query.code }}
      <el-tag class="tag" type="info" v-if="info.OrderStatus == 0">{{ info.OrderStatusDesc }}</el-tag>
      <el-tag class="tag" v-if="info.OrderStatus == 1">{{ info.OrderStatusDesc }}</el-tag>
      <el-tag class="tag" v-if="info.OrderStatus == 2" type="warning">{{ info.OrderStatusDesc }}</el-tag>
      <el-tag class="tag" v-if="info.OrderStatus == 4 || info.OrderStatus == 5 || info.OrderStatus == 5" type="success">
        {{ info.OrderStatusDesc }}</el-tag>
    </h2>
    <div class="order_item">
      <div class="order_title">来源店铺</div>
      <div class="order_info">{{ info.PartnerName }}</div>
    </div>
    <div class="order_item">
      <div class="order_title">收货信息</div>
      <div class="order_info">
        <p>客户：{{ info.PartnerName }}</p>
        <p>收货人：{{ info.Receiver }} {{ info.Phone }} {{ info.Province }}-{{ info.City }}-{{ info.District }}-{{ info.Address }}</p>
      </div>
    </div>
    <div class="order_item">
      <div class="order_title">物流信息</div>
      <div class="order_info" v-if="info.ExpressNum != ''">
        <span class="w250">发货时间：{{ info.ExpressDate }}</span>
        <span class="w250">运单号：{{ info.ExpressNum }}</span>
        <span class="w250">物流公司：{{ info.ExpressName }}</span></div>
      <div class="order_info" v-else>暂无物流信息</div>
    </div>
    <div class="order_item">
      <div class="order_title">支付信息</div>
      <div class="order_info" v-if="info.PayDetail && info.PayDetail[0]">
        <span class="w250">支付时间：{{ info.PayDetail[0].DateAdded }}</span>
        <span class="w250">支付流水：{{ info.PayDetail[0].Proof }}</span>
        <span class="w250">支付金额：{{ info.PayDetail[0].Amount.toFixed(2) }}</span>
        <span class="w250">支付方式：{{ info.PayDetail[0].PayDesc }}</span></div>
      <div class="order_info" v-else>暂无支付信息</div>
    </div>
    <div class="order_item">
      <div class="order_title">备注信息</div>
      <div class="order_info">{{ info.Message }}</div>
    </div>
    <el-table ref='tables' :data="info.OrderDetail" border fit highlight-current-row style="width: 100%">
      <el-table-column label='商品' prop='SKUName' align='center' show-overflow-tooltip></el-table-column>
      <el-table-column label='单价(元)' prop='StandardPrice1' align='center' show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.StandardPrice1.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label='数量' prop='StandardCount' align='center' show-overflow-tooltip></el-table-column>
      <el-table-column label='税金(元)' prop='StandardCount' align='center' show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.TaxAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label='税率(%)' prop='TaxRate' align='center' show-overflow-tooltip></el-table-column>
    </el-table>
    <p class="oprder_price">商品金额：<span class="Danger">{{ info.OrderMoney.toFixed(2) }}元</span></p>
    <p class="oprder_price">总计运费：<span class="Danger">{{ info.TransFee.toFixed(2) }}元</span></p>
    <p class="oprder_price">总计税费：<span class="Danger">{{ info.TaxAmount.toFixed(2) }}元</span></p>
    <p class="oprder_price" style="font-size:16px;">总计金额：<span class="Danger" style="font-size:16px;">{{ info.OrderTotalPrice.toFixed(2) }}元</span></p>
    <p style="margin-top:30px;font-size:14px;color:#999">详细日志</p>
    <el-table ref='tables' :data="info.StatusFlow" border fit highlight-current-row style="width: 100%">
      <el-table-column label='时间' width="200" align='center' show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.DateAdded }}</span>
        </template>
      </el-table-column>
      <el-table-column label='内容' align='center' show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.FlowDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getSupplierOrderDetail } from "@/api/Partner/orderListManagement";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      info: {
        TransFee: 0,
        TaxAmount: 0,
        OrderMoney: 0,
        OrderTotalPrice: 0,
        OrderDetail: [],
        StatusFlow: []
      }
    };
  },
  methods: {},
  activated() {
    let OrderCode = this.$route.query.code;
    getSupplierOrderDetail({ OrderCode }).then(res => {
      if (res.PayDetail.length > 0) {
        res.PayDetail[0].DateAdded = formatDateTime(res.PayDetail[0].DateAdded);
      }
      res.StatusFlow.map(v => {
        v.DateAdded = formatDateTime(v.DateAdded)
      })
      if (res.ExpressDate != '') {
        res.ExpressDate = formatDateTime(res.ExpressDate);
      }
      this.info = res;
    });
  }
};
</script>
<style scoped>
.oprder_price {
  color: #333;
  line-height: 20px;
  margin-bottom: 0;
}
.w250 {
  display: inline-block;
  width: 250px;
}
.order_item {
  display: flex;
}
.order_item * {
  font-size: 13px !important;
}
.order_title {
  flex: 0 0 80px;
  line-height: 55px;
  color: #999;
}
.order_info {
  flex: 1;
  line-height: 55px;
  color: #333;
  border-bottom: 1px dashed #eaeaea;
}
.order_info p {
  margin: 0;
}
.orderInfo {
  box-sizing: border-box;
  padding: 20px;
}
.orderInfo h2 {
  font-size: 16px !important;
  line-height: 28px;
}
.orderInfo .tag {
  margin-left: 10px;
}
</style>
