<template>
  <div class="main content_box orderdetail roleadd od">
    <h2 class="big_title">
      退款详情
      <span style="padding-left:15px;"></span>
      <el-button
        type="primary"
        size="mini"
        v-if="showButton.CustomerServiceReviewButton== 1 && checkBtn('func_refundorder_customerserviceaudit')"
        @click="serviceReviewdialog = true"
      >客服审核</el-button>
      <el-button
        type="warning"
        size="mini"
        v-if="showButton.FinanceReviewButton== 1 && checkBtn('func_refundorder_financeaudit')"
        @click="financeReviewdialog = true"
      >财务审核</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="showButton.ConfirmReceiptButton== 1 && checkBtn('func_refundorder_confirmreceipt')"
        @click="showConfirmReceipt"
      >确认收货</el-button>
    </h2>

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="20" class="mb0">
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
              订单类状态：
              <span class="Success">{{ baseInfo.OrderStatusDesc }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单来源：{{ baseInfo.Source }}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">订单外部编号：{{ baseInfo.ExtOrderCode }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">订单内部编号：{{ baseInfo.OrderCode }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">下单时间：{{ baseInfo.ExtDateAdded }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商户编号：{{ baseInfo.UserSN_R }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商户名称：{{ baseInfo.Retailer }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm" v-if="baseInfo.ResponsibleBody">
              责任主体：
              <span v-if="baseInfo.ResponsibleBody == 1">买家</span>
              <span v-if="baseInfo.ResponsibleBody == 2">快递公司</span>
              <span v-if="baseInfo.ResponsibleBody == 3">澳蓉公司</span>
              <span v-if="baseInfo.ResponsibleBody == 4">环球云仓</span>
            </p>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="退款商品信息" name="2">
        <el-table
          class="gdInfo"
          :data="goodsInfo.Items"
          border
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column align="center" label="商品信息">
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'  " class="goodsInfoBox">
                <img v-if="scope.row.ProImage != ''" :src="scope.row.ProImage" />
                <img v-else src="/static/img/no_goods_image.jpg" />
                <div class="goodsCon">
                  <p>编号：{{ scope.row.SN }}</p>
                  <p>{{scope.row.ProName }}</p>
                  <p>规格：{{ scope.row.ProStandard }}</p>
                  <p v-if="scope.row.Expiration">效期：{{ scope.row.Expiration }}</p>
                  <p v-if="scope.row.BatchNo">入仓编号：{{ scope.row.BatchNo }}</p>
                </div>
              </div>
              <div v-else>
                <p>合计</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="70" label="订购量">
            <template slot-scope="scope">
              <p v-if="scope.row.id != 'all'">{{ scope.row.ProCount }}</p>
              <p v-else>{{ goodsInfo.BaseInfo.Count }}</p>
            </template>
          </el-table-column>

          <el-table-column align="center" label="单价(￥)" width="100">
            <template slot-scope="scope">
              <p
                v-if="scope.row.id != 'all'"
              >{{ scope.row.ProPrice.toFixed(2) }}/{{ scope.row.ProUnit }}</p>
            </template>
          </el-table-column>

          <el-table-column align="center" label="销售结算(￥)" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'">
                <p>商品金额：{{ scope.row.SubTotal.toFixed(2) }}</p>
                <p>综合税率：{{ scope.row.TaxRate .toFixed(2)}}%</p>
                <p>商品税费：{{ scope.row.SubTotalTax.toFixed(2) }}</p>
              </div>
              <div v-else>
                <p>商品金额：{{ goodsInfo.BaseInfo.FinnalMoney.toFixed(2) }}</p>
                <p>运费：{{ goodsInfo.BaseInfo.TransFee.toFixed(2) }}</p>
                <p>综合税费：{{ goodsInfo.BaseInfo.TaxAmount.toFixed(2) }}</p>
                <p>折扣金额：{{ goodsInfo.BaseInfo.DisCount.toFixed(2) }}</p>
                <p>总金额：{{ goodsInfo.BaseInfo.OrderAmount.toFixed(2) }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="300" label="申请退款标准">
            <template slot-scope="scope" v-if="scope.row.id != 'all'">
              <div v-for="(item,index) in goodsInfo.BaseInfo.Standard" :key="index">
                <p>{{ item.RefundStandardDesc }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="退换数量" width="150">
            <template slot-scope="scope">
              <div v-if="RefundType == 1 && scope.row.id != 'all' ">
                <p>{{ scope.row.ProCount }}</p>
              </div>
              <div v-if="scope.row.id != 'all'">
                <div v-for="(item,index) in goodsInfo.BaseInfo.Standard" :key="index">
                  <p v-if="item.RefundStandardCode == 'RSC001'">{{ scope.row.DamageTenCount }}</p>
                  <p
                    v-if="item.RefundStandardCode == 'RSC002'"
                  >{{ scope.row.DamageTenToThirtyCount }}</p>
                  <p
                    v-if="item.RefundStandardCode == 'RSC003'"
                  >{{ scope.row.DamageThirtyToFiftyCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC004'">{{ scope.row.SlightDamageCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC005'">{{ scope.row.ModerateDamageCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC006'">{{ scope.row.SeriousDamageCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC007'">{{ scope.row.RefundCount }}</p>
                  <p
                    v-if="item.RefundStandardCode == 'RSC009'"
                  >{{ scope.row.LowerThanPlatformValidityPeriodCount }}</p>
                  <p
                    v-if="item.RefundStandardCode == 'RSC010'"
                  >{{ scope.row.LowerThanTotalValidityPeriodCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC011'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC012'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC013'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC014'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC015'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC016'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC017'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC018'">{{ scope.row.RefundCount }}</p>
                  <p v-if="item.RefundStandardCode == 'RSC022'">{{ scope.row.RefundCount }}</p>
                </div>
              </div>
              <div v-if="scope.row.id == 'all'">
                <p>{{ goodsInfo.BaseInfo.RefundCount }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="退换合计(￥)" width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.id != 'all'">
                <p>{{ scope.row.RefundGoodsAmount.toFixed(2) }}</p>
              </div>
              <div v-else>
                <p>商品金额：{{ goodsInfo.BaseInfo.RefundGoodsTotalAmount.toFixed(2)}}</p>
                <p>运费：{{ goodsInfo.BaseInfo.RefundTransFee.toFixed(2) }}</p>
                <p>综合税费：{{ goodsInfo.BaseInfo.RefundTaxAmount.toFixed(2) }}</p>
                <p
                  v-if="afterSaleInfo.RefundMethodDesc=='退货退款' &&  goodsInfo.BaseInfo.AssumeBackTransFee == 2"
                >退货运费：商家承担，{{ goodsInfo.BaseInfo.BackTransFee.toFixed(2) }}</p>
                <p>总计金额：{{ goodsInfo.BaseInfo.RefundOrderAmount.toFixed(2) }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p
          class="btnRight"
          v-if="goodsInfo.BaseInfo.RefundType == 2 && goodsInfo.BaseInfo.RefundStatus !==7 && goodsInfo.BaseInfo.RefundStatus !== 8 && checkBtn('func_refundorder_editamount')"
        >
          <el-button type="primary" @click="modifiedAmountdialog = true">修改金额</el-button>
        </p>
      </el-collapse-item>
      <el-collapse-item title="售后信息" name="3">
        <el-row :gutter="20" class="mb0">
          <el-col :span="5">
            <p class="nm">
              退款编号：
              <span class="Warning">{{ afterSaleInfo.RefundOrderCode }}</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p class="nm">退款类型：{{ afterSaleInfo.RefundTypeDesc }}</p>
          </el-col>
          <el-col :span="5">
            <p class="nm">
              退款状态：
              <span class="Success">{{ afterSaleInfo.RefundStatusDesc }}</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p class="nm">退款方式：{{ afterSaleInfo.RefundMethodDesc }}</p>
          </el-col>
          <el-col :span="4">
            <p class="nm">退款原因：{{ afterSaleInfo.RefundReasonDesc }}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb0">
          <el-col :span="5">
            <p class="nm">
              退款金额：
              <span>￥{{ afterSaleInfo.RefundOrderAmount }}</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p class="nm">退款流水号：{{ afterSaleInfo.RefundPayNo }}</p>
          </el-col>
          <el-col :span="5">
            <p class="nm">
              退款路径：
              <span v-if="afterSaleInfo.RefundStatus == 7">原路退回</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p class="nm">退款说明：{{ afterSaleInfo.RefundExplain }}</p>
          </el-col>
          <el-col :span="4">
            <p class="nm">申请时间：{{ afterSaleInfo.DateAdded}}</p>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- 售后类型类型为售后2显示 -->
      <el-collapse-item title="售后图片信息" name="4" v-if="checkAfterSell ">
        <el-row :gutter="20" class="mb0">
          <el-col v-for="(item,index) in imageInfo" :key="index" :span="8" class="elheight">
            <p class="pm">{{ item.name }}：</p>
            <img v-if="item.pic !== ''" :src="item.pic" />
            <img v-else src="/static/img/no_goods_image.jpg" />
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="售后退货信息" name="5" v-if="checkAfterSell  ">
        <template v-if="expInfo.ExpNum != ''">
          <el-row v-if="expInfo.PayProof" :gutter="20" class="mb0" style="width: 900px">
            <!-- <el-col :span="24"> -->
            <p class="nm" v-if="expInfo.PayProof" style="margin-left:5px">退货商家支付凭证：</p>
            <img
              style="dispaly:inline-block;margin-left:5px;width:150px;height:150px"
              v-if="expInfo.PayProof"
              :src="imgurl+expInfo.PayProof"
            />
            <!-- </el-col> -->
          </el-row>
          <el-row :gutter="20" class="mb0" style="width: 900px">
            <el-col :span="24" v-if="expInfo.BackTransFee">
              <p class="nm" v-if="expInfo.BackTransFee">
                退货运费：
                <span v-if="expInfo.AssumeBackTransFee==2">商家承担，￥{{ expInfo.BackTransFee }}</span>
                <span v-if="expInfo.AssumeBackTransFee==1">买家承担</span>
              </p>
            </el-col>
          </el-row>
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

      <el-collapse-item title="协商历史" name="6">
        <el-table border style="width: 100%" :data="historyInfo">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <p :class="{ 'historyNew': scope.$index==0 }">{{ scope.row.DateAdded }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="协商内容">
            <template slot-scope="scope">
              <p :class="{ 'historyNew': scope.$index==0 }">{{ scope.row.OperationDesc }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作人" width="180">
            <template slot-scope="scope">
              <p :class="{ 'historyNew': scope.$index==0 }">
                <span v-if="scope.row.OperatorType == 2">{{ scope.row.OperatorTypeDesc }}</span>
                <span v-if="scope.row.OperatorType == 1">{{ scope.row.OperatorTypeDesc }}</span>
                ：
                <span>{{ scope.row.OperatorName }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              <p :class="{ 'historyNew': scope.$index==0 }">{{ scope.row.Desc }}</p>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <el-dialog title="客服审核" width="500px" center :visible.sync="serviceReviewdialog">
      <el-form>
        <el-form-item
          style="text-align: center"
          v-if="afterSaleInfo.RefundTypeDesc=='售后退款'&&serviceReviewInfo.isAdopt =='通过'"
        >
          <span class="timed">责任主体：</span>
          <el-select
            class="search_title"
            clearable
            v-model="serviceReviewInfo.ResponsibleBody"
            size="small"
            placeholder="请选择责任主体"
          >
            <el-option
              v-for="item in responsebilityList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-radio-group v-model="serviceReviewInfo.isAdopt">
            <el-radio label="通过"></el-radio>
            <el-radio label="拒绝"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="serviceReviewInfo.isAdopt =='拒绝'" label="拒绝理由" label-width="70px">
          <el-input
            v-model="serviceReviewInfo.refuseReason"
            style="padding-left:15px;"
            placeholder="请输入拒绝理由"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-20px">
        <el-button @click="serviceReviewdialog = false">取 消</el-button>
        <el-button type="primary" @click="serviceReview">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="财务审核" width="500px" center :visible.sync="financeReviewdialog">
      <el-form>
        <el-form-item style="text-align: center">
          <el-radio-group v-model="financeReviewInfo.isAdopt">
            <el-radio label="通过"></el-radio>
            <el-radio label="拒绝"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="financeReviewInfo.isAdopt =='通过' && afterSaleInfo.RefundMethodDesc=='退货退款' && expInfo.AssumeBackTransFee==2"
          label="商家支付凭证"
          label-width="100px"
        >
          <div class="infoDesc upload" style="margin-top:-10px">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              action
              accept="image/*"
              :http-request="uploadImg"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="picShow!=''" :src="picShow" class="avatar" />
              <i v-else style="font-size:20px;" class="el-icon-plus avatar-uploader-icon">上传凭证</i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item v-if="financeReviewInfo.isAdopt =='拒绝'" label="拒绝理由" label-width="70px">
          <el-input
            v-model="financeReviewInfo.refuseReason"
            style="padding-left:15px;"
            placeholder="输入拒绝理由"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="financeReviewdialog = false">取 消</el-button>
        <el-button type="primary" @click="financeReview">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认收货" width="500px" center :visible.sync="confirmReceiptdialog">
      <el-form size="mini">
        <el-form-item v-if="confirmReceiptInfo.isAdopt == '通过'" label="物流单号" label-width="70px">
          <el-input v-model="confirmReceiptInfo.expNum" placeholder="请输入运单号" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item v-if="confirmReceiptInfo.isAdopt == '通过'" label="物流公司" label-width="70px">
          <el-select clearable v-model="confirmReceiptInfo.expCode" placeholder="物流公司">
            <el-option label="中通" value="ZTO"></el-option>
            <el-option label="圆通" value="YT"></el-option>
            <el-option label="申通" value="ST"></el-option>
            <el-option label="百世汇通" value="BSHT"></el-option>
            <el-option label="EMS" value="EMS"></el-option>
            <el-option label="韵达" value="YUNDA"></el-option>
            <el-option label="京东快递" value="JD"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="退货运费"
          label-width="70px"
          v-if="confirmReceiptInfo.AssumeBackTransFee == 2"
        >
          <span v-if="confirmReceiptInfo.AssumeBackTransFee == 1">买家承担</span>
          <span v-if="confirmReceiptInfo.AssumeBackTransFee == 2">商家承担，￥</span>
          <span
            v-if="confirmReceiptInfo.AssumeBackTransFee == 2"
          >{{confirmReceiptInfo.BackTransFee}}</span>
        </el-form-item>
        <el-form-item v-if="confirmReceiptInfo.isAdopt =='拒绝'" label="拒绝理由" label-width="70px">
          <el-input
            v-model="confirmReceiptInfo.refuseReason"
            style
            placeholder="请输入拒绝理由"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item style="text-align: center">
          <el-radio-group v-model="confirmReceiptInfo.isAdopt">
            <el-radio label="通过"></el-radio>
            <el-radio label="拒绝"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmReceiptdialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmReceipt">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改金额" width="700px" center :visible.sync="modifiedAmountdialog">
      <el-form size="mini" ref="tkref">
        <el-form-item label="订单号" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.OrderCode }}</span>
        </el-form-item>
        <el-form-item label="商品总金额(￥)" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.FinnalMoney }}</span>
        </el-form-item>
        <el-form-item label="运费(￥)" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.TransFee }}</span>
        </el-form-item>
        <el-form-item label="综合税金(￥)" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.TaxAmount }}</span>
        </el-form-item>
        <el-form-item label="订单总金额(￥)" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.OrderTotalAmount }}</span>
        </el-form-item>
        <el-form-item label="退款数量" label-width="140px" class="bottom0">
          <span>{{ AmountInfo.RefundCount }}</span>
        </el-form-item>

        <el-form-item label="*退款商品金额(￥)" label-width="140px">
          <el-col :span="15">
            <el-input
              ref="inputtk"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model="tkMoney"
            ></el-input>
          </el-col>
          <span class="spanLeft">{{ '最多退款金额为￥'+AmountInfo.MostRefundGoodsTotalAmount }}</span>
        </el-form-item>
        <el-form-item label="*退款运费(￥)" label-width="140px">
          <el-col :span="15">
            <el-input
              ref="inputtkyf"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model="tkyf1Money"
            ></el-input>
          </el-col>
          <span class="spanLeft">{{ '最多退款金额为￥'+AmountInfo.MostRefundTransFee }}</span>
        </el-form-item>
        <el-form-item label="退款税金(￥)" label-width="140px">
          <el-col :span="15">
            <el-input
              ref="inputtksj"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model="tksjMoney"
            ></el-input>
          </el-col>
          <span class="spanLeft">{{ '最多退款税金为￥'+AmountInfo.MostRefundTaxAmount }}</span>
        </el-form-item>

        <el-form-item
          v-if="afterSaleInfo.RefundMethodDesc=='退货退款' &&  goodsInfo.BaseInfo.AssumeBackTransFee == 2"
          label="退货运费(￥)"
          label-width="140px"
        >
          <el-col :span="15">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model="modifiedAmountInfo.BackTransFee"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="afterSaleInfo.RefundMethodDesc=='退货退款' &&  goodsInfo.BaseInfo.AssumeBackTransFee == 2 "
          label="线上退款总金额(￥)"
          label-width="140px"
        >
          <span>{{ allMoney1 }}</span>
        </el-form-item>
        <el-form-item
          v-if="afterSaleInfo.RefundMethodDesc=='退货退款' &&  goodsInfo.BaseInfo.AssumeBackTransFee == 2"
          label="线下退款总金额(￥)"
          label-width="140px"
        >
          <span>{{ allMoney2 }}</span>
        </el-form-item>
        <div v-if="afterSaleInfo.RefundMethodDesc=='退货退款'">
          <el-form-item
            v-if="goodsInfo.BaseInfo.AssumeBackTransFee != 2"
            label="退款总金额(￥)"
            label-width="140px"
          >
            <span>{{ allMoney1 }}</span>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="退款总金额(￥)" label-width="140px">
            <span>{{ allMoney }}</span>
          </el-form-item>
        </div>
        <el-form-item label="备注" label-width="140px">
          <el-col :span="15">
            <el-input maxlength="30" v-model="modifiedAmountInfo.desc"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifiedAmountdialog = false">取 消</el-button>
        <el-button type="primary" @click="modifiedAmount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import moment from "moment";
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "refundOrderManage/" +
  moment().format("YYYYMM") +
  "/img/";
import { getOrderInfo } from "@/api/order/order";
import { getAddressData } from "@/api/address/index";

import {
  modifyMoney,
  getRefund,
  getGoods,
  getImage,
  getAfterSale,
  getExp,
  serviceReview,
  getHistory,
  getRefundAmount,
  financeReview,
  confirmReceipt
} from "../../api/refundOrderManage/index";
import { formatDateTime, parseTime } from "@/utils/index";
export default {
  data() {
    return {
      roleBtn: [],
      responsebilityList: [
        {
          name: "买家",
          value: 1
        },
        {
          name: "快递公司",
          value: 2
        },
        {
          name: "澳蓉公司",
          value: 3
        },
        {
          name: "环球云仓",
          value: 4
        }
      ],
      RefundOrderCode: this.$route.query.RefundOrderCode, //退款订单号
      OrderCode: this.$route.query.OrderCode,
      RefundMethodCode: this.$route.query.RefundMethodCode,
      RefundType: this.$route.query.RefundType,
      activeNames: "1",
      picShow: "",
      activedDatas: [1],
      baseGoodsInfo: null,
      goodsInfo: {
        BaseInfo: {},
        Items: []
      },
      expInfo: {
        ExpName: null,
        ExpNum: null,
        PayProof: null,
        BackTransFee: null,
        AssumeBackTransFee: null,
        ExpDesc: []
      },
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
      uploadfiles: [],
      imgNames: [],
      showButton: {},
      baseInfo: {}, //基本信息
      imageInfo: [
        { name: "快递面单照片", pic: "" },
        { name: "快递外箱照片", pic: "" },
        { name: "商品瑕疵处照片", pic: "" },
        { name: "商品正面照片", pic: "" },
        { name: "产品批次号和效期处照片", pic: "" },
        { name: "气泡柱照片", pic: "" },
        { name: "售后群照", pic: "" }
      ], //图片信息
      afterSaleInfo: {}, //售后信息
      historyInfo: [], //协商历史
      AmountInfo: {}, //退款金额信息
      imgurl: window.ali_oss_data.URL_IMG_SHOW,
      serviceReviewdialog: false, //客服弹出框
      financeReviewdialog: false,
      confirmReceiptdialog: false,
      modifiedAmountdialog: false,
      serviceReviewInfo: {
        //客服弹出框信息
        ResponsibleBody: "",
        isAdopt: "",
        refuseReason: ""
      },
      financeReviewInfo: {
        isAdopt: "",
        PayProof: "",
        refuseReason: ""
      },
      confirmReceiptInfo: {
        isAdopt: "",
        expCode: "",
        expNum: "",
        AssumeBackTransFee: "",
        BackTransFee: "",
        refuseReason: ""
      },
      modifiedAmountInfo: {
        refundGoodsTotalAmount: "",
        BackTransFee: "",
        refundTransFee: "",
        refundTaxAmount: "",
        desc: ""
      }
    };
  },
  activated() {
    this.activeNames = "1";
    this.activedDatas = [1];
    this.getOrderInfo();
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId("/refundOrderDetail");
    this.getOrderInfo();
    this.getExpInfo();
    this.getAfterSaleInfo();
  },
  computed: {
    tkMoney: {
      get() {
        return this.modifiedAmountInfo.refundGoodsTotalAmount;
      },
      set(newval) {
        if (newval <= this.AmountInfo.MostRefundGoodsTotalAmount) {
          this.modifiedAmountInfo.refundGoodsTotalAmount = newval;
          return newval;
        } else {
          this.$message.error(
            "最多退款金额为￥" + this.AmountInfo.MostRefundGoodsTotalAmount
          );
          this.modifiedAmountInfo.refundGoodsTotalAmount = "";
          // this.$refs.inputtk.clearFiles()
          this.$refs["inputtk"].clear();
          console.log(
            "this.$refs[inputtkyf].fields: ",
            this.$refs["inputtkyf"]
          );
          // return;
        }
      }
    },

    tksjMoney: {
      get() {
        return this.modifiedAmountInfo.refundTaxAmount;
      },
      set(newval) {
        if (newval <= this.AmountInfo.MostRefundTaxAmount) {
          this.modifiedAmountInfo.refundTaxAmount = newval;
          return newval;
        } else {
          this.$message.error(
            "最多退款税金为￥" + this.AmountInfo.MostRefundTaxAmount
          );
          this.modifiedAmountInfo.refundTaxAmount = "";
          this.$refs["inputtksj"].clear();
          // return;
        }
      }
    },
    tkyf1Money: {
      get() {
        return this.modifiedAmountInfo.refundTransFee;
      },
      set(newval) {
        if (newval <= this.AmountInfo.MostRefundTransFee) {
          this.modifiedAmountInfo.refundTransFee = newval;
          return newval;
        } else {
          console.log("newval: ", newval);
          newval = "";
          console.log("newval: ", newval);
          this.modifiedAmountInfo.refundTransFee = "";
          this.$message.error(
            "最多退款运费为￥" + this.AmountInfo.MostRefundTransFee
          );
          this.$refs["inputtkyf"].clear();
          // return ;
        }
      }
    },
    allMoney2() {
      let allMoney = 0;
      allMoney = Number(this.modifiedAmountInfo.BackTransFee);
      return allMoney.toFixed(2);
    },
    allMoney() {
      let allMoney = 0;
      allMoney =
        Number(this.modifiedAmountInfo.refundGoodsTotalAmount) +
        Number(this.modifiedAmountInfo.refundTransFee) +
        Number(this.modifiedAmountInfo.BackTransFee) +
        Number(this.modifiedAmountInfo.refundTaxAmount);
      return allMoney.toFixed(2);
    },
    allMoney1() {
      let allMoney = 0;
      allMoney =
        Number(this.modifiedAmountInfo.refundGoodsTotalAmount) +
        Number(this.modifiedAmountInfo.refundTransFee) +
        Number(this.modifiedAmountInfo.refundTaxAmount);
      return allMoney.toFixed(2);
    },
    //丢件 和订单超时 售中 RSC011
    checkAfterSell() {
      let flag = false;
      if (this.RefundType == 2) {
        if (
          this.afterSaleInfo.RefundReasonCode !== "RRC016" ||
          this.afterSaleInfo.RefundReasonCode !== "RRC005"
        ) {
          flag = !flag;
        }
      }
      return flag;
    }
  },
  methods: {
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    //切换table
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
            this.getGoodsInfo();
            this.getRefundAmount();
            break;
          case 3:
            this.getAfterSaleInfo();
            break;
          case 4:
            this.getImageInfo();
            break;
          case 5:
            this.getExpInfo();
            break;
          case 6:
            this.getHistoryInfo();
            break;
        }
        this.activedDatas.push(obj);
      }
    },

    //修改金额
    modifiedAmount() {
      var reg = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
      if (
        this.modifiedAmountInfo.refundGoodsTotalAmount >
          this.AmountInfo.MostRefundGoodsTotalAmount ||
        reg.test(this.modifiedAmountInfo.refundGoodsTotalAmount) == false
      ) {
        this.$message.error("请填入正确的退款金额");
        return;
      }
      if (this.modifiedAmountInfo.refundTransFee !== "") {
        if (
          this.modifiedAmountInfo.refundTransFee >
            this.AmountInfo.MostRefundTransFee ||
          reg.test(this.modifiedAmountInfo.refundTransFee) == false
        ) {
          this.$message.error("请填入正确的退款运费");
          return;
        }
      }
      if (this.modifiedAmountInfo.refundTaxAmount !== "") {
        if (
          this.modifiedAmountInfo.refundTaxAmount >
            this.AmountInfo.MostRefundTaxAmount ||
          reg.test(this.modifiedAmountInfo.refundTaxAmount) == false
        ) {
          this.$message.error("请填入正确的退款税金");
          return;
        }
      }
      let p = Object.assign(
        {
          token: localStorage.Token,
          refundOrderCode: this.RefundOrderCode
        },
        this.modifiedAmountInfo
      );
      p.refundGoodsTotalAmount = Number(p.refundGoodsTotalAmount);
      p.refundTaxAmount = Number(p.refundTaxAmount);
      p.BackTransFee = Number(p.BackTransFee);
      p.refundTransFee = Number(p.refundTransFee);
      modifyMoney(p).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.getGoodsInfo();
        this.modifiedAmountdialog = false;
      });
    },
    beforeAvatarUpload(file, index) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        // this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        // this.clearFiles();
      }
      return isJPG && isLt2M;
    },
    //自定義圖片上傳方法
    uploadImg(option) {
      this.uploadfiles = [];
      this.imgNames = [];
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      this.$forceUpdate();
      setTimeout(() => {
        let signUrl = window.ali_oss_data.URL_IMG_SHOW + imgFileNameList[0];
        this.financeReviewInfo.PayProof = imgFileNameList[0];
        this.picShow = signUrl;
      }, 500);
    },
    //上传到ali-OSS
    uploadImgToOSS(file, imgName) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function put() {
        try {
          let result = await client.put(imgName, file);
        } catch (e) {
          console.log(e);
        }
      }
      put();
    },
    //获取基本信息
    getOrderInfo() {
      getOrderInfo({
        orderCode: this.OrderCode,
        refundOrderCode: this.RefundOrderCode
      }).then(res => {
        let obj = Object.assign(this.baseInfo, res);
        this.baseInfo = {};
        this.baseInfo = obj;
        this.showButton = obj.RefundOrderButton[0];
      });
    },
    getGoodsInfo() {
      getGoods({
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      }).then(res => {
        this.goodsInfo = res;
        this.modifiedAmountInfo.BackTransFee = Number(
          this.goodsInfo.BaseInfo.BackTransFee
        ).toFixed(2);
        let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
        this.goodsInfo.Items.forEach(element => {
          if (element.ProImage != "") {
            let signUrl = window.ali_oss_data.URL_IMG_SHOW + element.ProImage;
            element.ProImage = signUrl;
          }
        });
        this.goodsInfo.Items.push({
          id: "all",
          name: "合计",
          dinggouliang: "",
          tuihuanshuliang: "",
          shangpinjine: "",
          yunfei: "",
          zongheshuifei: "",
          zongjijine: ""
        });
      });
    },
    //获取售后图片信息
    getImageInfo() {
      const p = {
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      };
      getImage(p).then(res => {
        //申请补偿  憋罐  包装破损   商品保质期与平台描述不符   //退货退款 爆罐（仅奶粉）  ||  包装破损
        if (
          res.RefundReasonCode == "RRC001" ||
          res.RefundReasonCode == "RRC002" ||
          res.RefundReasonCode == "RRC004" ||
          res.RefundReasonCode == "RRC008" ||
          res.RefundReasonCode == "RRC009"
        ) {
          let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
          let signUrl1 =
            window.ali_oss_data.URL_IMG_SHOW + res.ExpressDeliverySheetImage;
          let signUrl2 = window.ali_oss_data.URL_IMG_SHOW + res.ExpressboxImage;
          let signUrl3 = window.ali_oss_data.URL_IMG_SHOW + res.DamagedImage;
          let signUrl4 =
            window.ali_oss_data.URL_IMG_SHOW + res.MerchandiseFrontImage;
          let signUrl5 =
            window.ali_oss_data.URL_IMG_SHOW + res.BatchNumberOrExpiryDateImage;
          let signUrl6 = window.ali_oss_data.URL_IMG_SHOW + res.CartonImage;
          this.imageInfo = [
            { name: "快递面单照片", pic: signUrl1 },
            { name: "快递外箱照片", pic: signUrl2 },
            { name: "商品破损处照片", pic: signUrl3 },
            { name: "商品正面照片", pic: signUrl4 },
            {
              name: "产品批次号和效期处照片",
              pic: signUrl5
            },
            { name: "气泡柱照片", pic: signUrl6 }
          ];
          return;
        }
        //申请补偿  商品瑕疵
        if (
          res.RefundReasonCode == "RRC003" ||
          res.RefundReasonCode == "RRC010"
        ) {
          let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
          let signUrl1 =
            window.ali_oss_data.URL_IMG_SHOW + res.ExpressDeliverySheetImage;
          let signUrl2 = window.ali_oss_data.URL_IMG_SHOW + res.ExpressboxImage;
          let signUrl3 = window.ali_oss_data.URL_IMG_SHOW + res.DamagedImage;
          let signUrl4 =
            window.ali_oss_data.URL_IMG_SHOW + res.MerchandiseFrontImage;
          let signUrl5 =
            window.ali_oss_data.URL_IMG_SHOW + res.BatchNumberOrExpiryDateImage;
          let signUrl6 = window.ali_oss_data.URL_IMG_SHOW + res.CartonImage;
          this.imageInfo = [
            { name: "快递面单照片", pic: signUrl1 },
            { name: "快递外箱照片", pic: signUrl2 },
            { name: "商品瑕疵处照片", pic: signUrl3 },
            { name: "商品正面照片", pic: signUrl4 },
            {
              name: "产品批次号和效期处照片",
              pic: signUrl5
            },
            { name: "气泡柱照片", pic: signUrl6 }
          ];
          return;
        }
        //仅退款 少件
        if (res.RefundReasonCode == "RRC006") {
          let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
          let signUrl1 =
            window.ali_oss_data.URL_IMG_SHOW + res.ExpressDeliverySheetImage;
          let signUrl2 = window.ali_oss_data.URL_IMG_SHOW + res.ExpressboxImage;
          let signUrl3 = window.ali_oss_data.URL_IMG_SHOW + res.UnpackingImage;
          this.imageInfo = [
            { name: "快递面单照片", pic: signUrl1 },
            { name: "快递外箱照片", pic: signUrl2 },
            { name: "开箱照", pic: signUrl3 }
          ];
          return;
        }
        //仅退款 拒收
        if (res.RefundReasonCode == "RRC007") {
          let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
          let signUrl1 =
            window.ali_oss_data.URL_IMG_SHOW + res.ExpressDeliverySheetImage;
          let signUrl2 = window.ali_oss_data.URL_IMG_SHOW + res.ExpressboxImage;
          console.log(res.ExpressDeliverySheetImage);
          console.log(signUrl2);

          this.imageInfo = [
            { name: "快递面单照片", pic: signUrl1 },
            { name: "快递外箱照片", pic: signUrl2 }
          ];
          return;
        }
        //退货退款  商品保质期与平台描述不符   || 错发RRC012
        if (
          res.RefundReasonCode == "RRC012" ||
          res.RefundReasonCode == "RRC008" ||
          res.RefundReasonCode == "RRC009" ||
          res.RefundReasonCode == "RRC011"
        ) {
          let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
          let signUrl1 =
            window.ali_oss_data.URL_IMG_SHOW + res.ExpressDeliverySheetImage;
          let signUrl2 = window.ali_oss_data.URL_IMG_SHOW + res.ExpressboxImage;
          let signUrl3 = window.ali_oss_data.URL_IMG_SHOW + res.DamagedImage;
          let signUrl4 =
            window.ali_oss_data.URL_IMG_SHOW + res.MerchandiseFrontImage;
          let signUrl5 =
            window.ali_oss_data.URL_IMG_SHOW + res.BatchNumberOrExpiryDateImage;
          this.imageInfo = [
            { name: "快递面单照片", pic: signUrl1 },
            { name: "快递外箱照片", pic: signUrl2 },
            { name: "商品破损处照片", pic: signUrl3 },
            { name: "商品正面照片", pic: signUrl4 },
            {
              name: "产品批次号和效期处照片",
              pic: signUrl5
            }
          ];
          return;
        }
      });
    },
    //获取售后信息
    getAfterSaleInfo() {
      const p = {
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      };
      getAfterSale(p).then(res => {
        res.DateAdded = formatDateTime(res.DateAdded);
        res.RefundGoodsTotalAmount = res.RefundGoodsTotalAmount.toFixed(2);
        this.afterSaleInfo = res;
      });
    },
    //获取物流信息
    getExpInfo() {
      const p = {
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      };
      getExp(p).then(res => {
        this.expInfo = Object.assign(this.expInfo, res);
        this.expInfo.BackTransFee = this.expInfo.BackTransFee.toFixed(2);
        if (this.expInfo.ExpDesc !== "") {
          this.expInfo.ExpDesc = JSON.parse(this.expInfo.ExpDesc);
          this.expInfo.ExpDesc = this.expInfo.ExpDesc.reverse();
        } else {
          this.expInfo.ExpDesc = [];
        }
        //设置回显
        this.financeReviewInfo.expCode = res.ThridExpressCode;
        this.financeReviewInfo.expNum = res.ExpNum;

        this.confirmReceiptInfo.expCode = res.ThridExpressCode;
        this.confirmReceiptInfo.expNum = res.ExpNum;
        this.confirmReceiptInfo.AssumeBackTransFee = res.AssumeBackTransFee;
        this.financeReviewInfo.PayProof = res.PayProof;
        if (res.PayProof != "") {
          this.picShow = window.ali_oss_data.URL_IMG_SHOW + res.PayProof;
        }
        this.confirmReceiptInfo.BackTransFee = res.BackTransFee.toFixed(2);
      });
    },
    //获取协商历史
    getHistoryInfo() {
      getHistory({
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      }).then(res => {
        res.map(item => {
          item.DateAdded = formatDateTime(item.DateAdded);
        });
        this.historyInfo = res;
      });
    },
    //获取退款金额
    getRefundAmount() {
      getRefundAmount({
        refundOrderCode: this.RefundOrderCode,
        token: localStorage.Token
      }).then(res => {
        res.FinnalMoney = Number(res.FinnalMoney).toFixed(2);
        res.TransFee = Number(res.TransFee).toFixed(2);
        res.TaxAmount = Number(res.TaxAmount).toFixed(2);
        this.modifiedAmountInfo.refundGoodsTotalAmount = Number(
          res.RefundGoodsTotalAmount
        ).toFixed(2);
        this.modifiedAmountInfo.refundTransFee = Number(
          res.RefundTransFee
        ).toFixed(2);
        this.modifiedAmountInfo.refundTaxAmount = Number(
          res.RefundTaxAmount
        ).toFixed(2);
        this.AmountInfo = res;
      });
    },
    //客服审核
    serviceReview() {
      if (this.serviceReviewInfo.isAdopt == "") {
        this.$message.error("请选择通过或拒绝");
        return;
      }
      if (
        this.afterSaleInfo.RefundTypeDesc == "售后退款" &&
        this.serviceReviewInfo.isAdopt == "通过"
      ) {
        if (this.serviceReviewInfo.ResponsibleBody == "") {
          this.$message.error("请选择责任主体");
          return;
        }
      }
      if (
        this.serviceReviewInfo.refuseReason == "" &&
        this.serviceReviewInfo.isAdopt == "拒绝"
      ) {
        this.$message.error("拒绝理由不能为空");
        return;
      }
      this.serviceReviewInfo.isAdopt =
        this.serviceReviewInfo.isAdopt == "拒绝" ? 0 : 1;
      let p = Object.assign(
        {
          token: localStorage.Token,
          refundOrderCode: this.RefundOrderCode
        },
        this.serviceReviewInfo
      );
      serviceReview(p).then(res => {
        setTimeout(() => {
          this.$message.success("操作成功！");
          this.getOrderInfo();
        }, 500);
      });
      this.serviceReviewInfo = { isAdopt: "", refuseReason: "" };
      this.serviceReviewdialog = false;
    },

    //财务审核
    financeReview() {
      if (this.financeReviewInfo.isAdopt == "") {
        this.$message.error("请选择通过或拒绝");
        return;
      }
      if (
        this.financeReviewInfo.PayProof == "" &&
        this.financeReviewInfo.isAdopt == "通过" &&
        this.afterSaleInfo.RefundMethodDesc == "退货退款" &&
        this.expInfo.AssumeBackTransFee == 2
      ) {
        this.$message.error("支付凭证不能为空");
        return;
      }
      if (
        this.financeReviewInfo.refuseReason == "" &&
        this.financeReviewInfo.isAdopt == "拒绝"
      ) {
        this.$message.error("拒绝理由不能为空");
        return;
      }
      this.financeReviewInfo.isAdopt =
        this.financeReviewInfo.isAdopt == "拒绝" ? 0 : 1;
      let par = Object.assign(
        {
          token: localStorage.Token,
          refundOrderCode: this.RefundOrderCode
        },
        this.financeReviewInfo
      );
      financeReview(par).then(res => {
        setTimeout(() => {
          this.$message.success("操作成功！");
          this.getOrderInfo();
        }, 500);
      });

      this.financeReviewdialog = false;
    },
    showConfirmReceipt() {
      this.getExpInfo();
      this.confirmReceiptdialog = true;
    },

    //确认收货
    confirmReceipt() {
      if (this.confirmReceiptInfo.isAdopt == "") {
        this.$message.error("请选择通过或拒绝");
        return;
      }
      if (
        this.confirmReceiptInfo.isAdopt == "通过" &&
        this.confirmReceiptInfo.expCode == ""
      ) {
        this.$message.error("请选择物流公司");
        return;
      }
      if (
        this.confirmReceiptInfo.isAdopt == "通过" &&
        this.confirmReceiptInfo.expNum == ""
      ) {
        this.$message.error("请输入物流单号");
        return;
      }
      if (
        this.confirmReceiptInfo.refuseReason == "" &&
        this.confirmReceiptInfo.isAdopt == "拒绝"
      ) {
        this.$message.error("拒绝理由不能为空");
        return;
      }
      this.confirmReceiptInfo.isAdopt =
        this.confirmReceiptInfo.isAdopt == "拒绝" ? 0 : 1;
      let p = Object.assign(
        {
          token: localStorage.Token,
          refundOrderCode: this.RefundOrderCode
        },
        this.confirmReceiptInfo
      );
      confirmReceipt(p).then(res => {
        setTimeout(() => {
          this.$message.success("操作成功！");
          this.getOrderInfo();
        }, 500);
      });
      location.reload();
      this.confirmReceiptdialog = false;
    }
  }
};
</script>
<style scoped>
.bottom0 {
  margin-bottom: 0;
}
.spanLeft {
  margin-left: 10px;
}
img {
  width: 200px;
  height: 250px;
}
.btnRight {
  text-align: right;
}
.pm {
  width: 150px;
  margin: 0;
}
.historyNew {
  color: #f56c6c;
  font-weight: 500;
}
.addskuupload {
  display: flex;
  width: 100%;
}
.elheight {
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
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
.infoDesc {
  padding: 18px;
  padding-bottom: 0;
}
.nm {
  margin: 0;
}
.addskuuploadItem {
  display: inline-block;
  width: 130px;
  position: relative;
  border: 1px dashed #eeeeee;
}
.mb0 {
  margin-bottom: 0 !important;
}
.upload h5 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #666;
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