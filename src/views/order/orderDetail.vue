<template>
  <div class="main content_box orderdetail roleadd od">
    <h2 class="big_title">
      订单详情
      <span style="padding-left:15px;"></span>
      <el-button
        type="primary"
        size="mini"
        v-if="baseInfo.OrderStatus === 50 && baseInfo.MFD!=2 && baseInfo.MFD!=1"
        @click="batchFXs"
      >放行</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="baseInfo.OrderStatus === 50 && baseInfo.MFD!=2 && baseInfo.MFD!=1"
        @click="ycmodelshow = true"
      >异常标注</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="baseInfo.MFD == 2 && getOrderExceptions(baseInfo.OrderExceptions, 1)&& baseInfo.OrderStatus !== 40"
        @click="reZF"
      >申报支付单</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="baseInfo.MFD == 2 && getOrderExceptions(baseInfo.OrderExceptions, 2)&& baseInfo.OrderStatus !== 40"
        @click="reDD"
      >申报订单</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="baseInfo.MFD == 2 && baseInfo.OrderStatus === 40"
        @click="reTSHWC"
      >推送海外仓</el-button>
      <el-button type="warning" size="mini" v-if="baseInfo.MFD == 2" @click="exitYc">取消异常标注</el-button>
      <el-button
        type="danger"
        size="mini"
        v-if="baseInfo.MFD == 2 && baseInfo.SourceId != 1 "
        @click="zuofei"
      >作废</el-button>
    </h2>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="24" v-if="baseInfo.MFD == 2">
          <el-col :span="24">
            <p class="nm">
              <span class="Danger" style="font-size:12px;">订单异常：{{ baseInfo.MFDDesc }}</span>
            </p>
          </el-col>
        </el-row>
        <el-row v-if="baseInfo.MFD == 1">
          <el-col :span="6">
            <p class="nm">
              <span class="Danger" style="font-size:12px;">订单已作废：{{ baseInfo.MFDDesc }}</span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 1200px">
          <el-col :span="6">
            <p class="nm">
              贸易类型：
              <span class="Warning">{{ baseInfo.TypeOfTrade }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单类型：{{ baseInfo.OrderType }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">
              订单状态：
              <span class="Success">{{ baseInfo.OrderStatusDesc }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单同步方式：{{ baseInfo.Source }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 1200px">
          <el-col :span="6">
            <p class="nm">订单渠道：{{ baseInfo.Channel }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商户编号：{{ baseInfo.UserSN_R }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商户名称：{{ baseInfo.Retailer }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单同步时间：{{ baseInfo.DateAdded }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 1200px">
          <el-col :span="6">
            <p class="nm">订单外部编号：{{ baseInfo.ExtOrderCode }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">渠道订单号：{{ baseInfo.ChannelOrderCode }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单内部编号：{{ baseInfo.OrderCode }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">报关订单号：{{ baseInfo.OutTradeNo }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 1200px">
          <el-col :span="6">
            <p class="nm">原始下单时间：{{ baseInfo.ExtDateAdded }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">
              付款时间：
              <span class="Warning">{{ baseInfo.PayDate }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">
              订单金额：
              <span
                class="Danger"
              >￥{{ (baseInfo.FinnalMoney + baseInfo.TaxAmount + baseInfo.TransFee).toFixed(2) }}</span>
            </p>
          </el-col>
          <el-col :span="6" v-if="baseInfo.OrderStatus == 0">
            <p class="nm">取消原因：{{ baseInfo.CancelReason == '' ? '暂无原因' : baseInfo.CancelReason }}</p>
          </el-col>
          <!-- <el-col :span="6" v-if='baseInfo.MFDDesc != "" && baseInfo.MDF == 1'>
            <p class="nm">作废原因：{{ baseInfo.MFDDesc }}</p>
          </el-col>-->
        </el-row>
        <!-- v-if="baseInfo.OrderStatus !==70 && baseInfo.OrderStatus !==60" ⬇ -->
        <el-row :gutter="24" class="mb0" style="width: 1200px">
          <el-col :span="24">
            <p class="nm">订单留言：{{ baseInfo.MemoOfRetailer }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="mb0" style="width: 1200px">
          <el-col :span="24">
            <p class="nm">订单备注：{{ baseInfo.MemoOfSupplier ? baseInfo.MemoOfSupplier : '暂无' }}</p>
          </el-col>
        </el-row>
        <!-- v-if="baseInfo.OrderStatus==70 || 60 || 30 " ⬇-->
        <el-row :gutter="24" class="mb0" style="width: 1200px">
          <el-col :span="24">
            <p
              class="nm"
            >追加备注：{{ baseInfo.AppendMemoOfSupplier ? baseInfo.AppendMemoOfSupplier :'暂无' }}</p>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="商品信息" name="2">
        <el-row
          :gutter="20"
          class="mb0"
          style="width: 1200px"
          v-if="baseInfo.OrderStatus == 30 && checkBtn('func_order_entrepot')"
        >
          <el-col :span="24" v-if="goodsInfo.BaseInfo.StoreType != 3">
            选择仓库：
            <el-select size="mini" v-model="store.Code" placeholder="请选择仓库" @change="changeStore">
              <el-option
                v-for="item in store.storeList"
                :key="item.Code"
                :label="item.Name"
                :value="item.Code"
              ></el-option>
            </el-select>
            <el-button
              @click="saveChangeStore"
              style="margin-left: 15px"
              class="pan-btn blue-btn"
              type="primary"
              size="mini"
            >提交保存</el-button>
            <span class="Danger">【注意】在跨境直邮和保税备货两种仓库之间切换时，会清除SKU与商品的已有关联，您将需要重新选择关联商品。</span>
          </el-col>
        </el-row>
        <el-table
          class="gdInfo"
          :data="goodsInfo.Items"
          border
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column align="center" label="SKU信息" width="400">
            <template slot-scope="scope">
              <div class="goodsInfoBox" v-if="scope.row.id != 'all'">
                <img :src="scope.row.ProImage" />
                <div class="goodsCon">
                  <p>{{ scope.row.ProName }}</p>
                  <p>编号：{{ scope.row.Code }}</p>
                  <!-- <p v-if="scope.row.Expiration">效期：{{ scope.row.Expiration }}</p> -->
                  <p v-if="scope.row.BatchNo">入仓编号：{{ scope.row.BatchNo }}</p>
                </div>
              </div>
              <p v-else>{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" width="70" label="订购量">
            <template slot-scope="scope">
              <p v-if="scope.row.id != 'all'">{{ scope.row.ProCount }}</p>
              <p v-else>{{ scope.row.ac }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="单价(￥)" width="100">
            <template slot-scope="scope">
              <p
                v-if="scope.row.id != 'all'"
              >{{ scope.row.ProPrice.toFixed(2) }}/{{ scope.row.ProUnit }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="销售结算" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'">
                <p>商品金额：{{ scope.row.Price.toFixed(2) }}</p>
                <p v-if="goodsInfo.BaseInfo.StoreType != 3">综合税率：{{ scope.row.TaxRate }}%</p>
                <p
                  v-if="goodsInfo.BaseInfo.StoreType != 3"
                >商品税费：{{ scope.row.SubTotalTax1.toFixed(2) }}</p>
              </div>
              <div v-else>
                <p>商品金额：{{ scope.row.ss.FinnalMoney.toFixed(2) }}</p>
                <p>运费：{{ scope.row.ss.TransFee.toFixed(2) }}</p>
                <p
                  v-if="goodsInfo.BaseInfo.StoreType != 3"
                >综合税费：{{ scope.row.ss.TaxAmount.toFixed(2) }}</p>
                <p>抵扣金额：{{ goodsInfo.BaseInfo.DisCount.toFixed(2) }}</p>
                <p>合计金额：{{ (scope.row.ss.FinnalMoney + scope.row.ss.TransFee + scope.row.ss.TaxAmount).toFixed(2) }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商品信息"
            width="400"
            v-if="goodsInfo.BaseInfo.StoreType != 3"
          >
            <template slot-scope="scope">
              <div class="goodsInfoBox" v-if="scope.row.id != 'all'">
                <img v-if="scope.row.ProImage != ''" :src="scope.row.ProImage" />
                <img v-else src="/static/img/no_goods_image.jpg" />
                <div class="goodsCon">
                  <p>{{ scope.row.goodsItems.Childs[0].NameCN }}</p>
                  <p>编号：{{ scope.row.goodsItems.Childs[0].Code }}</p>
                  <p
                    v-if="scope.row.goodsItems.Childs[0].Standard != ''"
                  >规格：{{ scope.row.goodsItems.Childs[0].Standard }}</p>
                  <el-button
                    v-if="(baseInfo.OrderStatus == 20 || (baseInfo.OrderStatus == 30 && baseInfo.SourceId == 1)) && checkBtn('func_order_relevance_edit')"
                    @click="changeStoreGoods(scope)"
                    class="changeGoods"
                    type="primary"
                    plain
                    size="mini"
                  >修改关联</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="发货量/单位"
            v-if="goodsInfo.BaseInfo.StoreType != 3"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.id != 'all'"
              >{{ scope.row.ProCount1 }}/{{ scope.row.goodsItems.Childs[0].Unit }}</p>
              <p v-else>{{ scope.row.acc }}</p>
            </template>
          </el-table-column>
          <el-table-column align="left" label="清关申报" v-if="goodsInfo.BaseInfo.StoreType != 3">
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'">
                <p>申报名称：{{ scope.row.goodsItems.Childs[0].Name4Customs }}</p>
                <p>申报税号：{{ scope.row.goodsItems.Childs[0].SN4Customs }}</p>
                <p
                  v-if="goodsInfo.BaseInfo.StoreType != 3"
                >申报税率：{{ scope.row.goodsItems.Childs[0].TaxRate }}%</p>
                <p>申报单价：{{ scope.row.goodsItems.Childs[0].Price4Customs.toFixed(2) }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="申报小计"
            width="150"
            v-if="goodsInfo.BaseInfo.StoreType != 3"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'">
                <p>申报金额：{{ scope.row.goodsItems.Childs[0].Price4Customs.toFixed(2) }}</p>
                <p v-if="goodsInfo.BaseInfo.StoreType != 3">
                  申报税金：{{ (scope.row.goodsItems.Childs[0].Price4Customs * scope.row.goodsItems.Childs[0].TaxRate / 100).toFixed(2)
                  }}
                </p>
              </div>
              <div v-else>
                <p>申报金额：{{ scope.row.allPrice.toFixed(2) }}</p>
                <p v-if="goodsInfo.BaseInfo.StoreType != 3">申报税金：{{ scope.row.allTax.toFixed(2) }}</p>
                <p>合计申报：{{ (scope.row.allPrice + scope.row.allTax).toFixed(2) }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item class="addres" title="订购人信息" name="3">
        <el-row :gutter="20" class="mb0" style="width: 900px" v-if="baseInfo.OrderType != '一般贸易'">
          <el-col :span="24">
            <p class="nm">
              <span>订购人姓名：</span>
              <span v-if="!editUserInfo">{{ userInfo.PurchaserName }}</span>
              <span v-else>
                <el-input v-model="userInfo.PurchaserName" size="mini" placeholder="请输入订购人姓名"></el-input>
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px" v-if="baseInfo.OrderType != '一般贸易'">
          <el-col :span="24">
            <p class="nm">
              <span>订购人证件类型：</span>
              <span>{{ userInfo.IDTypeDesc }}</span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px" v-if="baseInfo.OrderType != '一般贸易'">
          <el-col :span="24">
            <p class="nm">
              <span>订购人证件号码：</span>
              <span v-if="!editUserInfo">{{ userInfo.IDNum }}</span>
              <span v-else>
                <el-input v-model="userInfo.IDNum" size="mini" placeholder="请输入证件号码"></el-input>
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px">
          <el-col :span="24">
            <p class="nm">
              <span>收件人姓名：</span>
              <span v-if="!editUserInfo">{{ userInfo.Consignee }}</span>
              <span v-else>
                <el-input v-model="userInfo.Consignee" size="mini" placeholder="请输入收件人姓名"></el-input>
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px">
          <el-col :span="24">
            <p class="nm">
              <span>收件人电话：</span>
              <span v-if="!editUserInfo">{{ userInfo.Phone }}</span>
              <span v-else>
                <el-input v-model="userInfo.Phone" size="mini" placeholder="请输入收件人电话"></el-input>
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px">
          <el-col :span="24">
            <p class="nm">
              <span>收件人地址：</span>
              <span
                v-if="!editUserInfo"
              >{{ userInfo.Province + userInfo.City + userInfo.District + userInfo.Address }}</span>
              <span
                v-else-if="editUserInfo && baseInfo.OrderStatus == 30 && baseInfo.MFD == 0"
                class="flex1000"
              >
                <el-cascader
                  class="dz"
                  size="mini"
                  v-model="userInfo.addressInfo"
                  separator="-"
                  placeholder="请选择地址"
                  :props="areaOptions"
                  :options="areaData"
                  filterable
                ></el-cascader>
                <el-input
                  class="dzinfo"
                  size="mini"
                  :maxlength="200"
                  placeholder="请输入详细地址"
                  v-model="userInfo.Address"
                ></el-input>
              </span>
              <span
                v-else
              >{{ userInfo.Province + userInfo.City + userInfo.District + userInfo.Address }}</span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0" style="width: 900px;margin-top: 10px;">
          <el-col :span="24">
            <el-button
              v-if="(!editUserInfo && (baseInfo.OrderStatus == 20 || baseInfo.OrderStatus == 25 || baseInfo.OrderStatus == 30 ) && checkBtn('func_order_harvest_edit')) || (!editUserInfo && baseInfo.MFD == 2 && checkBtn('func_order_harvest_edit')) "
              type="primary"
              size="mini"
              @click="editUserInfoFunc"
            >修改</el-button>
            <el-button v-if="editUserInfo" type="success" size="mini" @click="saveAddressInfo">确定</el-button>
            <el-button v-if="editUserInfo" type="info" size="mini" @click="editUserInfoExit">取消</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="支付信息" name="4">
        <template v-if="payInfo.Amount">
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">支付时间：{{ payInfo.DateAdded }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">支付金额：￥{{ payInfo.Amount }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">支付方式：{{ payInfo.PayTypeDesc }}</p>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm Warning">暂无支付信息</p>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>
      <el-collapse-item title="结算信息" name="7">
        <template v-if="jsInfo != null">
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">订单金额：￥{{ jsInfo.SettleMentTotalMoney }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">商品金额：￥{{ jsInfo.SettleMentOrderMoney }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">商品运费：￥{{ jsInfo.SettleMentTransFee }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">综合税金：￥{{ jsInfo.SettleMentTaxAmount }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p
                class="nm"
              >支付方式：{{ jsInfo.FundAccountType == 0 ? '无需结算' : jsInfo.FundAccountType == 1 ? '预付款支付' : '授信支付'}}</p>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm Warning">暂无结算信息</p>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>

      <el-collapse-item title="物流信息" name="5">
        <template v-if="expInfo.ExpNum != ''">
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">物流方式：{{ expInfo.ExpName }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">物流单号：{{ expInfo.ExpNum }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24" style="height: auto;">
              <p class="nm">物流跟踪信息：</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="height: auto;">
              <ul class="expinfo">
                <li
                  v-for="(item,index) in expInfo.ExpDesc"
                  :key="index"
                  :class=" index == 0 ? 'Danger fwb' : '' "
                >
                  {{item.AcceptTime}}
                  <span v-if="index == 0" class="new">最新</span>
                  <br />
                  {{item.AcceptStation}}
                </li>
                <li v-if="expInfo.ExpDesc.length == 0">暂无物流信息</li>
              </ul>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm Warning">订单申报发货后自动生成物流信息</p>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>

      <el-collapse-item title="清关信息" name="6">
        <el-table :data="qglist" border ref="multipleTable" style="width: 100%">
          <el-table-column align="center" prop="DeclareDesc" label="清关类型">
            <template slot-scope="scope">
              <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.DeclareDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="SubStatusDesc" label="清关状态">
            <template slot-scope="scope">
              <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.SubStatusDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="Description" label="回执">
            <template slot-scope="scope">
              <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.Description }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="DateAdded" label="时间">
            <template slot-scope="scope">
              <span :class="scope.$index == 0 ? 'Danger' : ''">{{ scope.row.DateAdded }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="仓储信息" name="8">
        <template v-if="ccInfo != null">
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">发货仓库：{{ ccInfo.storeName }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">集包码：{{ ccInfo.lastMileCode1 }}</p>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm">记号笔：{{ ccInfo.lastMileCode2 }}</p>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24">
              <p class="nm Warning">仓储信息</p>
            </el-col>
          </el-row>
        </template>
      </el-collapse-item>
    </el-collapse>
    <GoodsDialog
      :orderType="goodsInfo.BaseInfo.StoreType"
      :goodsVisible="goodsVisible"
      @choice="choiceGoods"
      @close="onclose"
    ></GoodsDialog>
    <el-dialog title="选择异常类型" :visible.sync="ycmodelshow" width="30%" center>
      <div>
        <p>订单编号：{{ baseInfo.OrderCode }}</p>
        <br />
        <p>
          异常类型：
          <el-select v-model="ycDesc" placeholder="请选择" @change="setYcSeleted" size="mini">
            <el-option
              v-for="(item,index) in ycType"
              :key="index"
              :label="item.SubStatusDesc"
              :value="item.SubStatus"
            ></el-option>
          </el-select>
          <el-select v-model="ycDesc2" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index) in ycTypeDesc"
              :key="index"
              :label="item.ReceiptDesc"
              :value="item.ReceiptCode"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ycmodelshow = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subYCMark" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="showMfd" width="30%" center>
      <el-input v-model="mfdDesc" placeholder="请输入作废原因"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMfd = false">取 消</el-button>
        <el-button type="primary" @click="subMfd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import {
  getOrderInfo,
  getOrderGoodsInfo,
  getOrderUserInfo,
  getOrderPayInfo,
  getOrderExpInfo,
  saveStoreInfo,
  saveAddressInfo,
  getStoreGoodsInfo,
  getJSinfo,
  sendToOverseaStore,
  storeInfo
} from "@/api/order/order";
import {
  getQGinfo,
  batchExitYiChang,
  batchZuoFei,
  reZF,
  reDD,
  setFX,
  setYC,
  getYCType
} from "@/api/order/orderCenter";
import { getStoreList } from "@/api/storeManage/index";
import { getAddressData } from "@/api/address/index";
import GoodsDialog from "@/components/Goods/GoodsDialog.vue";
export default {
  components: { GoodsDialog },
  data() {
    return {
      ycmodelshow: false,
      showMfd: false,
      bUserInfo: null,
      mfdDesc: "",
      qglist: [],
      selectedIndex: -1,
      editUserInfo: false,
      goodsVisible: false,
      orderCode: this.$route.query.id,
      activeNames: "1",
      activedDatas: [1],
      baseGoodsInfo: null,
      goodsInfo: {
        BaseInfo: {},
        Items: []
      },
      store: {
        Code: "",
        storeList: []
      },
      expInfo: {
        ExpName: null,
        ExpNum: null,
        ExpDesc: []
      },
      payInfo: {
        DateAdded: null,
        Amount: null,
        PayTypeDesc: null
      },
      areaOptions: {
        value: "Code",
        label: "Name",
        children: "Children"
      },
      areaData: window._areaDatas,
      userInfo: {
        IDTypeDesc: null,
        addressInfo: [],
        IDNum: null,
        Consignee: null,
        Phone: null,
        Province: null,
        City: null,
        District: null,
        Address: null
      },
      baseInfo: {
        TypeOfTrade: null,
        OrderType: null,
        OrderStatusDesc: null,
        Source: null,
        Channel: null,
        UserSN_R: null,
        Retailer: null,
        DateAdded: null,
        ExtOrderCode: null,
        OrderCode: null,
        ExtDateAdded: null,
        MemoOfRetailer: null,
        PayDate: null,
        SourceId: null,
        FinnalMoney: null,
        TaxAmount: null,
        TransFee: null,
        CancelReason: null,
        MFDDesc: null,
        MemoOfSupplier: null,
        OrderStatus: null
      },
      ycTypeDesc: "",
      ycType: "",
      ycDesc: "",
      ycDesc2: "",
      roleBtn: [],
      jsInfo: null,
      ccInfo: null
    };
  },
  activated() {
    this.activeNames = "1";
    this.activedDatas = [1];
    this.getAddressData(() => {
      this.getOrderInfo();
      this.getYcType();
    });
  },
  created() {
    this.getOrderInfo();
    this.getYcType();
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  methods: {
    //获取仓储信息--hjy
    getccinfo() {
      storeInfo({
        orderCode: this.baseInfo.OrderCode
      }).then(res => {
        this.ccInfo = res;
        console.log(res);
      });
    },
    getjsinfo() {
      getJSinfo({
        orderCode: this.baseInfo.OrderCode
      }).then(res => {
        this.jsInfo = res;
      });
    },
    editUserInfoFunc() {
      this.bUserInfo = JSON.parse(JSON.stringify(this.userInfo));
      this.editUserInfo = true;
    },
    editUserInfoExit() {
      this.userInfo = this.bUserInfo;
      this.editUserInfo = false;
    },
    getQGinfo() {
      getQGinfo({
        OrderCode: this.baseInfo.OrderCode
      }).then(res => {
        this.qglist = res;
      });
    },
    exitYc() {
      this.$confirm(
        "确定要取消订单：" + this.baseInfo.OrderCode + "的异常标注吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        batchExitYiChang({
          OrderCodes: this.baseInfo.OrderCode
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.getOrderInfo();
        });
      });
    },
    zuofei() {
      this.$confirm("确定要作废这个订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showMfd = true;
      });
    },
    subMfd() {
      if (this.mfdDesc == "") {
        this.$message.error("请输入作废原因");
        return;
      } else {
        batchZuoFei({
          OrderCodes: this.baseInfo.OrderCode,
          mfdDesc: this.mfdDesc
        }).then(res => {
          this.showMfd = false;
          this.mfdDesc = "";
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.getOrderInfo();
        });
      }
    },
    getOrderExceptions(exp, num) {
      let f = false;
      exp.map(v => {
        if (v.ModeCode == num) {
          f = !v.IsResolve;
        }
      });
      return f;
    },
    reZF(row) {
      this.$confirm("确定要重推支付单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        reZF({
          OrderCodes: this.baseInfo.OrderCode
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.getOrderInfo();
        });
      });
    },
    reDD(rwo) {
      this.$confirm("确定要重推订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        reDD({
          OrderCodes: this.baseInfo.OrderCode
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定"
          });
          this.getOrderInfo();
        });
      });
    },
    //推送海外仓----hjy
    reTSHWC() {
      this.$confirm("确定要推送至海外仓吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        sendToOverseaStore({ OrderCodes: this.baseInfo.OrderCode })
          .then(res => {
            this.$message({
              message: "正在推送订单至海外仓,请稍后查看推送是否成功",
              type: "success",
              center: true,
              duration: 2000
            });
            this.getOrderInfo();
          })
          .catch(err => {
            this.$message({
              message: "推送失败，请重试",
              type: "error",
              center: true,
              duration: 2000
            });
          });
      });
    },
    batchFXs() {
      this.$confirm("确定要放行这个订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        setFX({
          OrderCodes: this.baseInfo.OrderCode
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.getOrderInfo();
        });
      });
    },
    subYCMark() {
      if (this.ycDesc == "" || this.ycDesc2 == "") {
        this.$message.error("请选择异常类型");
        return;
      } else {
        setYC({
          OrderCodes: this.baseInfo.OrderCode,
          SubStatus: this.ycDesc,
          ReceiptCode: this.ycDesc2
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.ycDesc = "";
          this.ycDesc2 = "";
          this.ycmodelshow = false;
          this.getOrderInfo();
        });
      }
    },
    setYcSeleted(val) {
      this.getYcType(val);
    },
    getYcType(val) {
      let par = {};
      if (val) {
        par = { exceptionType: val };
      }
      getYCType(par).then(res => {
        if (val) {
          res.map(v => {
            if (v.SubStatus == val) {
              this.ycTypeDesc = v.Receipt;
            }
          });
        } else {
          this.ycType = res;
        }
      });
    },
    getAddressData(cb) {
      getAddressData().then(res => {
        res.map(a => {
          a.Children.map(b => {
            b.Children.map(c => {
              delete c.Children;
            });
          });
        });
        this.areaData = res;
        cb();
      });
    },
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    saveAddressInfo() {
      if (this.userInfo.addressInfo.length !== 3 && this.baseInfo.MFD == 0) {
        this.$message.error("请选择地区");
        return;
      }
      if (this.baseInfo.MFD == 0) {
        this.userInfo.AreaCode = this.userInfo.addressInfo[2];
        const ad = this.areaData;
        const arr = [];
        for (let x = 0; x < ad.length; x++) {
          for (let y = 0; y < ad[x].Children.length; y++) {
            for (let i = 0; i < ad[x].Children[y].Children.length; i++) {
              if (
                parseInt(ad[x].Children[y].Children[i].Code) ===
                parseInt(this.userInfo.addressInfo[2])
              ) {
                arr[0] = ad[x].Name;
                arr[1] = ad[x].Children[y].Name;
                arr[2] = ad[x].Children[y].Children[i].Name;
              }
            }
          }
        }
        this.userInfo.Province = arr[0];
        this.userInfo.City = arr[1];
        this.userInfo.District = arr[2];
      }
      this.userInfo.OrderCode = this.orderCode;
      this.userInfo.status = this.baseInfo.OrderStatus;
      saveAddressInfo(this.userInfo).then(() => {
        this.$message.success("修改成功");
        this.editUserInfo = false;
      });
    },
    saveChangeStore() {
      const arr = JSON.parse(JSON.stringify(this.goodsInfo.Items));
      arr.pop();
      const para = [];
      for (let x = 0; x < arr.length; x++) {
        para.push({
          id: arr[x].Id,
          skuId: arr[x].ProId,
          goodsId: arr[x].GoodsId,
          count: arr[x].ProCount
        });
      }
      if (this.store.Code === "") {
        this.$message.error("请选择仓库");
        return;
      }
      saveStoreInfo({
        orderCode: this.orderCode,
        storeCode: this.store.Code,
        proInfos: para
      }).then(() => {
        this.$message.success("保存成功");
        this.baseGoodsInfo = JSON.parse(JSON.stringify(this.goodsInfo));
      });
    },
    changeStoreGoods(item) {
      this.selectedIndex = item.$index;
      this.goodsVisible = true;
    },
    onclose() {
      this.goodsVisible = false;
    },
    choiceGoods(data) {
      this.goodsInfo.Items[this.selectedIndex].goodsItems = data;
      this.goodsInfo.Items[this.selectedIndex].GoodsId = data.cd.Id;
      this.goodsInfo.Items.pop();
      this.setGoodsItem(this.goodsInfo, true).then(res => {
        this.goodsInfo = res;
        this.goodsVisible = false;
      });
    },
    changeStore(val) {
      const a = this.store.storeList.find(v => {
        return v.Code === val;
      });
      console.log(this.goodsInfo);
      console.log(this.goodsInfo.BaseInfo);

      if (a.StoreType !== this.goodsInfo.BaseInfo.StoreType) {
        this.clearGoods();
        this.goodsInfo.BaseInfo.StoreType = a.StoreType;
      } else {
        this.goodsInfo = JSON.parse(JSON.stringify(this.baseGoodsInfo));
        this.goodsInfo.Items.pop();
        this.setGoodsItem(this.goodsInfo, true).then(data => {
          this.goodsInfo = data;
        });
      }
    },
    clearGoods() {
      this.goodsInfo.Items.map(v => {
        if (v.id !== "all") {
          v.goodsItems = {};
          v.ProCount1 = "";
          v.goodsItems.Image = "";
          v.goodsItems.Childs = [
            {
              GoodsId: "",
              GoodsName: "",
              GoodsStandard: "",
              GoodsUnit: "",
              ProCount1: "",
              Code1: "",
              Price4Customs: 0,
              TaxRate: 0,
              GoodsImage: "",
              Name4Customs: "",
              Sn4Customs: ""
            }
          ];
        }
      });
      this.goodsInfo.Items.pop();
      this.setGoodsItem(this.goodsInfo, true).then(data => {
        this.goodsInfo = data;
      });
    },
    handleChange(val) {
      let obj = "";
      val.map(v => {
        let flag = false;
        this.activedDatas.map(item => {
          if (parseInt(v) === parseInt(item)) {
            flag = true;
          }
        });
        if (!flag) {
          obj = v;
        }
      });
      if (obj !== "") {
        switch (parseInt(obj)) {
          case 2:
            this.getOrderGoodsInfo();
            break;
          case 3:
            this.getOrderUserInfo();
            break;
          case 4:
            this.getOrderPayInfo();
            break;
          case 5:
            this.getOrderExpInfo();
            break;
          case 6:
            this.getQGinfo();
            break;
          case 7:
            this.getjsinfo();
            break;
          case 8:
            this.getccinfo();
            break;
        }
        this.activedDatas.push(obj);
      }
    },
    getOrderInfo() {
      getOrderInfo({
        orderCode: this.orderCode
      }).then(res => {
        let obj = Object.assign(this.baseInfo, res);
        this.baseInfo = {};
        this.baseInfo = obj;
        console.log(obj);
      });
    },
    getOrderGoodsInfo() {
      getOrderGoodsInfo({
        orderCode: this.orderCode
      }).then(res => {
        this.setGoodsItem(res).then(data => {
          this.goodsInfo = data;
          this.goodsInfo.Items.forEach(element => {
            if (element.ProImage) {
              if (element.ProImage.indexOf("/u/") != -1) {
                let newImage = element.ProImage.substring(
                  element.ProImage.indexOf("/u/"),
                  element.ProImage.length
                );
                let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
                element.ProImage = signUrl;
              } else {
                let signUrl =
                  window.ali_oss_data.URL_IMG_SHOW + element.ProImage;
                element.ProImage = signUrl;
              }
            }
          });
          this.store.Code = data.BaseInfo.StoreCode;
          this.baseGoodsInfo = JSON.parse(JSON.stringify(data));
        });
      });
      getStoreList().then(res => {
        this.store.storeList = res.Data;
      });
    },
    setGoodsItem(res, f) {
      return new Promise(re => {
        const a = res;
        let ap = 0;
        let at = 0;
        let ac = 0;
        let acc = 0;
        for (let x = 0; x < a.Items.length; x++) {
          const v = a.Items[x];
          v.CustomsSN = v.SN4Customs;
          const index = x;
          if (f) {
            ap += v.goodsItems.Childs[0].Price4Customs * v.ProCount1;
            at +=
              ((v.goodsItems.Childs[0].Price4Customs *
                v.goodsItems.Childs[0].TaxRate) /
                100) *
              v.ProCount1;
            ac += v.ProCount;
            acc += v.ProCount1;
            if (index === res.Items.length - 1) {
              const loading = this.$loading({
                fullscreen: true,
                text: "努力加载中...",
                background: "rgba(0,0,0,.6)",
                lock: true
              });
              at += (a.BaseInfo.TransFee1 * v.goodsItems.TaxRate) / 100;
              setTimeout(() => {
                a.Items.push({
                  id: "all",
                  name: "合计",
                  ac: ac,
                  acc: acc,
                  ss: a.BaseInfo,
                  allPrice: ap,
                  allTax: at
                });
                loading.close();
                re(a);
              }, 500);
            }
          } else {
            getStoreGoodsInfo({
              goodsId: v.GoodsId,
              SN: "",
              Name: "",
              BrandCode: "",
              orderType: a.BaseInfo.StoreType
            }).then(data => {
              console.log(1111111111, data);

              v.goodsItems = data.Data[0];
              ap += v.goodsItems.Childs[0].Price4Customs * v.ProCount1;
              at +=
                ((v.goodsItems.Childs[0].Price4Customs *
                  v.goodsItems.Childs[0].TaxRate) /
                  100) *
                v.ProCount1;
              ac += v.ProCount;
              acc += v.ProCount1;
              if (index === res.Items.length - 1) {
                const loading = this.$loading({
                  fullscreen: true,
                  text: "努力加载中...",
                  background: "rgba(0,0,0,.6)",
                  lock: true
                });
                at +=
                  (a.BaseInfo.TransFee1 * v.goodsItems.Childs[0].TaxRate) / 100;
                setTimeout(() => {
                  a.Items.push({
                    id: "all",
                    name: "合计",
                    ac: ac,
                    acc: acc,
                    ss: a.BaseInfo,
                    allPrice: ap,
                    allTax: at
                  });
                  loading.close();
                  re(a);
                }, 500);
              }
            });
          }
        }
      });
    },
    getOrderUserInfo() {
      getOrderUserInfo({
        orderCode: this.orderCode
      }).then(res => {
        this.userInfo = Object.assign(this.userInfo, res);
        const ad = this.areaData;
        const arr = [];
        for (let x = 0; x < ad.length; x++) {
          for (let y = 0; y < ad[x].Children.length; y++) {
            for (let i = 0; i < ad[x].Children[y].Children.length; i++) {
              if (
                parseInt(ad[x].Children[y].Children[i].Code) === res.AreaCode
              ) {
                arr[0] = ad[x].Code;
                arr[1] = ad[x].Children[y].Code;
                arr[2] = ad[x].Children[y].Children[i].Code;
              }
            }
          }
        }
        this.userInfo.addressInfo = arr;
      });
    },
    getOrderPayInfo() {
      getOrderPayInfo({
        orderCode: this.orderCode
      }).then(res => {
        this.payInfo = Object.assign(this.payInfo, res);
      });
    },
    getOrderExpInfo() {
      getOrderExpInfo({
        orderCode: this.orderCode
      }).then(res => {
        this.expInfo = Object.assign(this.expInfo, res);
        if (this.expInfo.ExpDesc !== "") {
          this.expInfo.ExpDesc = JSON.parse(this.expInfo.ExpDesc);
          this.expInfo.ExpDesc = this.expInfo.ExpDesc.reverse();
        } else {
          this.expInfo.ExpDesc = [];
        }
      });
    }
  }
};
</script>
<style scoped>
.flex1000 {
  flex: 0 0 900px !important;
  display: flex;
}

.flex1000 .dzinfo {
  width: 300px;
}

.flex1000 .dz,
.flex1000 .dzinfo {
  display: inline-block !important;
}

.addres .nm span {
  display: block;
}

.addres .nm span:nth-child(1) {
  flex: 0 0 120px;
  text-align: right;
}

.addres .nm span:nth-child(2) {
  flex: 0 0 1;
}

.addres p.nm {
  display: flex;
  height: 36px;
  width: 100%;
  line-height: 36px;
}

.goodsInfoBox {
  display: flex;
  position: relative;
}

.changeGoods {
  position: absolute;
  right: 0;
  bottom: 0;
}

.goodsInfoBox img {
  width: 90px;
  height: 90px;
  flex: 0 0 80px;
  display: block;
}

.gdInfo {
  margin-top: 20px;
}

.gdInfo p {
  margin: 0;
}

.goodsCon {
  text-align: left;
  padding: 0 15px;
}

.new {
  margin-left: 10px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 500;
}

.nm {
  margin: 0;
}

.mb0 {
  margin-bottom: 0 !important;
}

.fwb {
  font-weight: bolder;
}

.expinfo {
  border: 1px solid #1c1c1c;
  padding: 5px;
  border-radius: 5px;
  width: 800px;
}

.expinfo li {
  list-style: none;
  line-height: 28px;
  border-bottom: 1px solid #eee;
  padding-left: 10px;
}

.expinfo li:nth-last-child(1) {
  border-bottom: none;
}
</style>