<template>
  <div class="main content_box orderdetail roleadd addsku ao">
    <sticky class="subTitle">
      <h2 class="big_title">新增订单
        <el-button @click='onsave' class="title_btn pan-btn green-btn" type="success" size='mini' icon='el-icon-check'>保存</el-button>
      </h2>
    </sticky>
    <el-form :model="info" :rules="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="贸易类型" prop='TypeOfTradeId'>
                <el-select v-model='info.TypeOfTradeId' placeholder="请选择" size='mini'>
                  <el-option v-for='item in TypeOfTradeList' :key='item.Id' :label='item.AliasValue' :value='item.Value'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户名称" prop='UserSN_R'>
                <el-select v-model='info.UserSN_R' filterable placeholder="请选择" size='mini'>
                  <el-option v-for='item in userList' :key='item.Id' :label='item.Company' :value='item.UserSN_R'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型" prop='StoreTypeDesc'>
                <el-input v-model='info.StoreTypeDesc' size='mini' disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="订单渠道" prop='ChannelId'>
                <el-select v-model='info.ChannelId' placeholder="请选择" size='mini' @change='channelChange'>
                  <el-option v-for='item in channelList' :key='item.Id' :label='item.AliasValue' :value='item.Code'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="外部订单号" prop='ExtOrderCode'>
                <el-input v-model='info.ExtOrderCode' size='mini'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单金额">
                <el-input v-model='allPrice' size='mini' disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="订购人">
                <el-input v-model='info.Subscriber' size='mini'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原始下单时间" prop='ExtDateAdded'>
                <el-date-picker v-model='info.ExtDateAdded' size='mini' type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item size='mini' class="w200 mb18" label="买家备注">
            <el-input v-model='info.MemoOfSubscriber' type="textarea" resize='none' :rows='4'></el-input>
          </el-form-item>
          <el-form-item size='mini' class="w200 mb0" label="卖家备注">
            <el-input v-model='info.MemoOfSupplier' type="textarea" resize='none' :rows='4'></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="订购商品信息" name="2">
          <el-row :gutter="20" class="mb18" style="width: 1500px">
            <el-col :span="3">
              <el-form-item label="运费">
                <el-input v-model='goodsInfo.BaseInfo.TransFee1' size='mini'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="选择仓库：" prop='StoreCode' required>
                <el-select size='mini' v-model="store.Code" placeholder="请选择仓库" @change='changeStore'>
                  <el-option v-for="item in store.storeList" :key="item.Code" :label="item.Name" :value="item.Code">
                  </el-option>
                </el-select>
                <el-button @click='saveChangeStore' :disabled='store.Code == ""' style="margin-left: 15px" class="pan-btn blue-btn" type="primary" size="mini">选择SKU</el-button>
                <span class="Danger">【注意】在跨境直邮和保税备货两种仓库之间切换时，会清除SKU与商品的已有关联，您将需要重新选择关联商品。</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table class="gdInfo" :data="goodsInfo.Items" border ref="multipleTable" style="width: 100%">
            <el-table-column align='center' label="SKU信息" width='400'>
              <template slot-scope="scope">
                <div class="goodsInfoBox" v-if='scope.row.id != "all"'>
                  <img :src="baseUrl + scope.row.ProImage" />
                  <div class="goodsCon">
                    <p>{{ scope.row.Name }}</p>
                    <p>编号：{{ scope.row.Code }}</p>
                  </div>
                </div>
                <p v-else>{{ scope.row.name }}</p>
              </template>
            </el-table-column>
            <el-table-column align='center' width='70' label="订购量">
              <template slot-scope="scope">
                <p v-if='scope.row.id != "all"'>
                  <el-input @change='numOnChange' v-model='scope.row.ProCount' size='mini'></el-input>
                </p>
                <p v-else>{{ scope.row.ac }}</p>
              </template>
            </el-table-column>
            <el-table-column align='center' label="单价" width='100'>
              <template slot-scope="scope">
                <p v-if='scope.row.id != "all"'>
                  <el-input @change='numOnChange' v-model='scope.row.Price' size='mini'></el-input>
                </p>
              </template>
            </el-table-column>
            <el-table-column align='center' label="销售结算" width='150'>
              <template slot-scope="scope">
                <div v-if='scope.row.id != "all"'>
                  <p>商品金额：{{ scope.row.Price }}</p>
                  <p>综合税率：{{ scope.row.TaxRate }}%</p>
                  <p>商品税费：{{ (scope.row.Price * scope.row.TaxRate / 100).toFixed(2) }}</p>
                </div>
                <div v-else>
                  <p>商品金额：{{ scope.row.ss.FinnalMoney1.toFixed(2) }}</p>
                  <p>运费：{{ scope.row.ss.yf.toFixed(2) }}</p>
                  <p>代扣税金：{{ scope.row.ss.TaxAmount1.toFixed(2) }}</p>
                  <p>合计金额：{{ (scope.row.ss.FinnalMoney1 + scope.row.ss.yf + scope.row.ss.TaxAmount1).toFixed(2) }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center' label="商品信息" width='400'>
              <template slot-scope="scope">
                <div class="goodsInfoBox" v-if='scope.row.id != "all"'>
                  <img v-if='scope.row.goodsItems.Image != ""' :src="baseUrl + scope.row.goodsItems.Image" />
                  <img v-else src="/static/img/no_goods_image.jpg" />
                  <div class="goodsCon">
                    <p>{{ scope.row.goodsItems.Name4Customs }}</p>
                    <p>编号：{{ scope.row.goodsItems.Code }}</p>
                    <p v-if='scope.row.goodsItems.StandardInfo != ""'>规格：{{ scope.row.goodsItems.StandardInfo}}
                    </p>
                    <el-button @click='changeStoreGoods(scope)' class="changeGoods" type='primary' plain size='mini'>修改关联</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center' width='70' label="数量">
              <template slot-scope="scope">
                <p v-if='scope.row.id != "all"'>
                  <el-input @change='numOnChange' v-model='scope.row.ProCount1' size='mini'></el-input>
                </p>
                <p v-else>{{ scope.row.acc }}</p>
              </template>
            </el-table-column>
            <el-table-column align='center' width='60' label="单位">
              <template slot-scope="scope">
                <p v-if='scope.row.id != "all"'>{{ scope.row.Unit }}</p>
              </template>
            </el-table-column>
            <el-table-column align='left' label="清关申报">
              <template slot-scope="scope">
                <div v-if='scope.row.id != "all"'>
                  <p>申报名称：{{ scope.row.goodsItems.Name4Customs }}</p>
                  <p>申报税号：{{ scope.row.goodsItems.SN4Customs }}</p>
                  <p>申报税率：{{ scope.row.goodsItems.TaxRate1 }}%</p>
                  <p>申报单价：{{ scope.row.goodsItems.Price4Customs.toFixed(2) }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center' label="申报小计" width='150'>
              <template slot-scope="scope">
                <div v-if='scope.row.id != "all"'>
                  <p>申报金额：{{ (scope.row.goodsItems.Price4Customs * scope.row.goodsItems.ProCount1).toFixed(2) }}</p>
                  <p>申报税金：{{ ((scope.row.goodsItems.Price4Customs * scope.row.goodsItems.TaxRate / 100) * scope.row.goodsItems.ProCount1).toFixed(2)
                    }}
                  </p>
                </div>
                <div v-else>
                  <p>申报金额：{{ scope.row.allPrice.toFixed(2) }}</p>
                  <p>申报税金：{{ scope.row.allTax.toFixed(2) }}</p>
                  <p>合计申报：{{ (scope.row.allPrice + scope.row.allTax).toFixed(2) }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center' width='70' label="操作">
                <template slot-scope="scope">
                    <el-button v-if='scope.row.id != "all"' @click='delGoods(scope)' type="danger" size='mini'>删除</el-button>
                </template>
              </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="订购人信息" name="3">
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="会员编号">
                <el-input v-model='info.CustId' size='mini' disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件类型">
                <el-select value='身份证' placeholder="请选择" size='mini'>
                  <el-option value='身份证' label='身份证'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件号码" prop='IdNum'>
                <el-input v-model='info.IdNum' size='mini'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="订购人姓名" prop='Receiver'>
                <el-input size='mini' v-model='info.Receiver'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订购人电话" prop='Phone'>
                <el-input v-model='info.Phone' size='mini'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="16">
              <el-form-item v-model='def' label="订购人地址" prop='addressInfo'>
                  <el-cascader class="dz" size='mini' v-model="info.addressInfo" separator="-" placeholder="请选择地址" :props='areaOptions'
                  :options="areaData" filterable></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="16">
              <el-form-item label="详细地址" prop='Address'>
                <el-input v-model='info.Address' size='mini'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="支付信息" name="4">
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="16">
              <el-form-item label="支付时间" prop='PayDate'>
                <el-date-picker v-model='info.PayInfo.PayDate' size='mini' type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="支付方式" prop='PayType'>
                <el-select v-model='info.PayInfo.PayType' placeholder="请选择" size='mini'>
                  <el-option v-for='(item, key) of payTypeList' :key='key' :label='item' :value='key'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="物流信息" name="5" v-if='store.Code'>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8">
              <el-form-item label="起运国" required>
                <el-input v-model='ExpCountryName' size='mini' disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输方式">
                <el-select :disabled='info.ExpCountry == 142' v-model='info.TransMode' placeholder="请选择" size='mini'>
                  <el-option v-for='item in ExpModeList' :key='item.Id' :label='item.AliasValue' :value='item.Code'></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if='info.ExpCountry != 142'>
              <el-form-item label="航班航次号">
                <el-input v-model='info.VoyageNum' size='mini'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mb18" style="width: 900px">
            <el-col :span="8" v-if='info.ExpCountry != 142'>
              <el-form-item label="运输工具">
                <el-input v-model='info.TransDevice' size='mini'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if='info.ExpCountry != 142' prop='BillNum'>
              <el-form-item label="提运单号">
                <el-input v-model='info.BillNum' size='mini'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报关运费">
                <el-input v-model='info.TransFee1' size='mini'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <GoodsDialog :orderType='goodsInfo.BaseInfo.StoreType' :goodsVisible='goodsVisible' @choice='choiceGoods' @close='onclose'></GoodsDialog>
    <SkuDialog :goodsVisible='skuVisible' @choice='choiceSku' @close='skuclose'></SkuDialog>
  </div>
</template>
<script>
  import Sticky from '@/components/Sticky'
  import GoodsDialog from '@/components/Goods/GoodsDialog.vue'
  import SkuDialog from '@/components/Goods/SkuDialog.vue'
  import { getStoreGoodsInfo } from '@/api/order/order'
  import { getStoreList } from '@/api/storeManage'
  import { getAllUsers, sumitAdd } from '@/api/order/add'
  import { regIdCard } from '@/utils/auth.js'
  const payType = {
    7: '支付宝',
    9: '微信',
    2: '授信额度',
    4: '预付款',
    11: '返点'
  }
  export default {
    components: { Sticky, GoodsDialog, SkuDialog },
    data() {
      const storeRule = (rule, value, callback) => {
        if (this.info.StoreCode !== '') {
          callback()
        } else {
          callback(new Error('请选择仓库'))
        }
      }
      const payDateRule = (rule, value, callback) => {
        if (this.info.PayInfo.PayDate !== '') {
          callback()
        } else {
          callback(new Error('请选择支付时间'))
        }
      }
      const payTypeRule = (rule, value, callback) => {
        if (this.info.PayInfo.PayType !== '') {
          callback()
        } else {
          callback(new Error('请选择支付方式'))
        }
      }
      const nameRule = (rule, value, callback) => {
        const reg = /[u4e00-u9fa5]/
        if (value === '') {
          callback(new Error('请输入姓名'))
        } else if (reg.test(value)) {
          callback(new Error('请输入中文名称'))
        } else {
          callback()
        }
      }
      const phoneRule = (rule, value, callback) => {
        const reg = /^1[3|4|5|7|8|9]\d{9}$/
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else if (!reg.test(value)) {
          callback('请输入正确手机号码')
        } else {
          callback()
        }
      }
      const idRule = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号码'))
        } else if (!regIdCard(value)) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
      const addressRule = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('请选择地址'))
        } else {
          callback()
        }
      }
      return {
        areaData: window._areaDatas,
        def: '',
        areaOptions: {
          value: 'code',
          label: 'name'
        },
        goodsVisible: false,
        skuVisible: false,
        selectedIndex: -1,
        baseUrl: window.ali_oss_data.URL_IMG_SHOW,
        ExpCountryName: '',
        info: {
          Address: '',
          addressInfo: [],
          AreaCode: '',
          VoyageNum: '',
          BillNum: '',
          Channel: '',
          ChannelId: '',
          City: '',
          CustId: '',
          Detail: [],
          District: '',
          TransDevice: '',
          ExpCountry: '',
          ExpName: '',
          ExpNum: '',
          ExtDateAdded: '',
          ExtOrderCode: '',
          IdNum: '',
          MemoOfSubscriber: '',
          MemoOfSupplier: '',
          PayInfo: {
            PayType: '',
            PayDate: ''
          },
          Phone: '',
          Province: '',
          Receiver: '',
          Store: '',
          StoreCode: '',
          StoreTypeDesc: '',
          storeTypeId: '',
          Subscriber: '',
          TransFee: '',
          TransFee1: '',
          TransMode: 'Y',
          TypeOfTradeId: '',
          UserSN_R: '',
          PayType: '',
          PayDate: ''
        },
        userList: [],
        ExpModeList: [],
        payTypeList: payType,
        goodsInfo: {
          BaseInfo: {
            StoreType: 2,
            yf: 0,
            FinnalMoney1: 0,
            TransFee1: 0,
            TaxAmount1: 0
          },
          Items: []
        },
        store: {
          Code: '',
          storeList: []
        },
        ruleForm: {
          TypeOfTradeId: [{ required: true, message: '请选择贸易类型', trigger: 'change' }],
          UserSN_R: [{ required: true, message: '请选择商户', trigger: 'change' }],
          StoreTypeDesc: [{ required: true, message: '请选择仓库', trigger: 'change' }],
          ExtOrderCode: [{ required: true, message: '请输入外部订单号', trigger: 'blur' }],
          ChannelId: [{ required: true, message: '请选择订单渠道', trigger: 'change' }],
          ExtDateAdded: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
          StoreCode: [{ validator: storeRule }],
          Receiver: [{ required: true, validator: nameRule, trigger: 'blur' }],
          IdNum: [{ required: true, validator: idRule, trigger: 'blur' }],
          Phone: [{ required: true, validator: phoneRule, trigger: 'blur' }],
          Address: [{ required: true, message: '请输入订购人地址', trigger: 'blur' }],
          PayDate: [{ required: true, validator: payDateRule }],
          PayType: [{ required: true, validator: payTypeRule }],
          addressInfo: [{ required: true, validator: addressRule, trigger: 'change' }],
          BillNum: [{ required: true, message: '请输入提运单号', trigger: 'blur' }]
        },
        activeNames: ['1', '2', '3', '4', '5'],
        TypeOfTradeList: [],
        channelList: [],
        allPrice: '0'
      }
    },
    watch: {
      'goodsInfo.BaseInfo.TransFee1': function(val) {
        if (this.goodsInfo.Items.length > 1) {
          this.calcExpPrice()
        }
      }
    },
    created() {
      this.getStoreList()
      this.getAllUsers()
      const OPTIONS = this.$store.getters.selectOptions
      this.TypeOfTradeList = OPTIONS.TypeOfTrade
      this.channelList = OPTIONS.OrderChannel
      this.ExpModeList = OPTIONS.ExpMode
    },
    activated() {
      this.getStoreList()
      this.getAllUsers()
      const OPTIONS = this.$store.getters.selectOptions
      this.TypeOfTradeList = OPTIONS.TypeOfTrade
      this.channelList = OPTIONS.OrderChannel
      this.ExpModeList = OPTIONS.ExpMode
    },
    methods: {
      delGoods(item) {
        this.$confirm('确定要删除这个SKU吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if (this.goodsInfo.Items.length === 2) {
            this.goodsInfo.Items = []
            this.goodsInfo.BaseInfo.yf = 0
            this.goodsInfo.BaseInfo.FinnalMoney1 = 0
            this.goodsInfo.BaseInfo.TransFee1 = 0
            this.goodsInfo.BaseInfo.TaxAmount1 = 0
          } else {
            this.goodsInfo.Items.splice(item.$index, 1)
            this.goodsInfo.Items.pop()
            this.setGoodsItem(this.goodsInfo, true).then(res => {
              this.goodsInfo = res
              this.calcExpPrice()
            })
          }
        })
      },
      onsave() {
        this.$refs.ruleForm.validate(res => {
          if (!res) return
          if (this.goodsInfo.Items.length < 2) {
            this.$message.error('请至少选择一个SKU')
            return false
          }
          this.goodsInfo.Items.map(v => {
            if (v.id !== 'all') {
              this.info.Detail.push({
                SkuId: v.SkuId,
                GoodsId: v.goodsItems.GoodsId,
                TaxRate: v.TaxRate,
                TaxRate1: v.goodsItems.TaxRate1,
                ProCount: v.ProCount,
                ProCount1: v.ProCount1,
                Price: v.Price,
                Price4Customs: v.goodsItems.Price4Customs
              })
            }
          })
          this.info.AreaCode = this.info.addressInfo[2]
          sumitAdd(this.info).then(res => {
            this.$message.success('新增成功')
            this.$router.back(-1)
          })
        })
      },
      channelChange(v) {
        this.channelList.map(item => {
          if (item.Code === v) {
            this.info.Channel = item.Value
          }
        })
      },
      getAllUsers() {
        getAllUsers().then(res => {
          this.userList = res
        })
      },
      changeStoreGoods(item) {
        this.selectedIndex = item.$index
        this.goodsVisible = true
      },
      numOnChange(v) {
        this.goodsInfo.Items.pop()
        this.setGoodsItem(this.goodsInfo, true).then(res => {
          this.goodsInfo = res
          this.calcExpPrice()
        })
      },
      choiceGoods(data) {
        this.goodsInfo.Items[this.selectedIndex].goodsItems = data.cd
        this.goodsInfo.Items.pop()
        this.setGoodsItem(this.goodsInfo, true).then((res) => {
          this.goodsInfo = res
          this.calcExpPrice()
          this.goodsVisible = false
        })
      },
      onclose() {
        this.goodsVisible = false
      },
      choiceSku(item) {
        this.goodsInfo.Items.pop()
        this.goodsInfo.Items.push(item)
        this.setGoodsItem(this.goodsInfo, true).then((data) => {
          this.goodsInfo = data
          this.calcExpPrice()
          this.skuVisible = false
        })
      },
      setBaseInfo() {
      },
      calcExpPrice() {
        let ap = 0
        let at = 0
        this.goodsInfo.Items.map(v => {
          if (v.id !== 'all') {
            ap += parseInt(v.Price) * v.ProCount
            at += ((parseInt(v.Price) * v.TaxRate) / 100) * v.ProCount
          }
        })
        if (this.goodsInfo.Items.length > 0) {
          at += this.goodsInfo.BaseInfo.TransFee1 * this.goodsInfo.Items[0].TaxRate / 100
        }
        this.goodsInfo.BaseInfo.FinnalMoney1 = ap
        this.goodsInfo.BaseInfo.TaxAmount1 = at
        this.goodsInfo.Items[this.goodsInfo.Items.length - 1].ss.FinnalMoney1 = ap
        this.goodsInfo.Items[this.goodsInfo.Items.length - 1].ss.yf = this.goodsInfo.BaseInfo.TransFee1 !== '' ? parseInt(this.goodsInfo.BaseInfo.TransFee1) : 0
        this.goodsInfo.Items[this.goodsInfo.Items.length - 1].ss.TaxAmount1 = at
        this.allPrice = ap + at + (this.goodsInfo.BaseInfo.TransFee1 !== '' ? parseInt(this.goodsInfo.BaseInfo.TransFee1) : 0)
        this.allPrice = this.allPrice.toFixed(2)
      },
      setGoodsItem(res, f) {
        return new Promise((re) => {
          const a = res
          let ap = 0
          let at = 0
          let ac = 0
          let acc = 0
          for (let x = 0; x < a.Items.length; x++) {
            const v = a.Items[x]
            const index = x
            if (f) {
              ap += v.goodsItems.Price4Customs * parseInt(v.ProCount1)
              at += (v.goodsItems.Price4Customs * v.goodsItems.TaxRate1 / 100) * parseInt(v.ProCount1)
              ac += parseInt(v.ProCount)
              acc += parseInt(v.ProCount1)
              if (index === res.Items.length - 1) {
                const loading = this.$loading({
                  fullscreen: true,
                  text: '努力加载中...',
                  background: 'rgba(0,0,0,.6)',
                  lock: true
                })
                at += a.BaseInfo.TransFee1 * v.goodsItems.TaxRate1 / 100
                setTimeout(() => {
                  a.Items.push({
                    id: 'all',
                    name: '合计',
                    ac: ac,
                    acc: acc,
                    ss: a.BaseInfo,
                    allPrice: ap,
                    allTax: at
                  })
                  loading.close()
                  re(a)
                }, 500)
              }
            } else {
              getStoreGoodsInfo({
                goodsId: v.GoodsId,
                SN: '',
                Name: '',
                BrandCode: '',
                orderType: a.BaseInfo.StoreType
              }).then(data => {
                data.Data[0].Childs.length === 0 ? data.Data[0].Childs[0] = data.Data[0] : true
                v.goodsItems = data.Data[0]
                ap += v.goodsItems.Childs[0].Price4Customs * parseInt(v.ProCount1)
                at += (v.goodsItems.Childs[0].Price4Customs * v.goodsItems.Childs[0].TaxRate1 / 100) * parseInt(v.ProCount1)
                ac += parseInt(v.ProCount)
                acc += parseInt(v.ProCount1)
                if (index === res.Items.length - 1) {
                  const loading = this.$loading({
                    fullscreen: true,
                    text: '努力加载中...',
                    background: 'rgba(0,0,0,.6)',
                    lock: true
                  })
                  at += a.BaseInfo.TransFee1 * v.goodsItems.TaxRate1 / 100
                  setTimeout(() => {
                    a.Items.push({
                      id: 'all',
                      name: '合计',
                      ac: ac,
                      acc: acc,
                      ss: a.BaseInfo,
                      allPrice: ap,
                      allTax: at
                    })
                    loading.close()
                    re(a)
                  }, 500)
                }
              })
            }
          }
        })
      },
      skuclose() {
        this.skuVisible = false
      },
      getStoreList() {
        getStoreList().then(res => {
          this.store.storeList = res.Data
        })
      },
      changeStore(val) {
        const a = this.store.storeList.find(v => {
          return v.Code === val
        })
        this.info.ExpCountry = a.CountryCode
        this.ExpCountryName = a.Country
        this.info.Store = a.Name
        this.info.StoreCode = a.Code
        this.info.storeTypeId = a.StoreType
        this.info.StoreTypeDesc = a.StoreTypeDesc
        if (a.StoreType !== this.goodsInfo.BaseInfo.StoreType) {
          this.goodsInfo.Items = []
          this.goodsInfo.BaseInfo.yf = 0
          this.goodsInfo.BaseInfo.FinnalMoney1 = 0
          this.goodsInfo.BaseInfo.TransFee1 = 0
          this.goodsInfo.BaseInfo.TaxAmount1 = 0
          this.goodsInfo.BaseInfo.StoreType = a.StoreType
        }
      },
      saveChangeStore() {
        this.skuVisible = true
      }
    }
  }
</script>
<style scoped>
  .mb18 {
    margin-bottom: 20px;
  }
  .subTitle {
    padding-bottom: 20px;
    z-index: 2 !important;
  }

  .subTitle h2 {
    margin: 0;
    height: 45px;
    line-height: 45px;
    background: #fff;
    border-bottom: 1px solid #e6e6e6;
  }

  .flex1000 {
    flex: 0 0 900px !important;
    display: flex
  }
.dz {
    width: 480px;
  }
  .flex1000 .dzinfo {
    width: 300px;
  }

  .flex1000 .dz,
  .flex1000 .dzinfo {
    display: inline-block !important
  }

  .addres .nm span {
    display: block
  }

  .addres .nm span:nth-child(1) {
    flex: 0 0 70px;
    text-align: right
  }

  .addres .nm span:nth-child(2) {
    flex: 0 0 300px;
  }

  .addres p.nm {
    display: flex;
    height: 36px;
    line-height: 36px;
  }

  .w200 {
    width: 600px !important;
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
    flex: 0 0 90px;
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
    background: #F56C6C;
    color: #fff;
    font-size: 12px;
    padding: 3px 5px;
    font-weight: 500
  }

  .nm {
    margin: 0
  }

  .mb0 {
    margin-bottom: 0 !important
  }

  .fwb {
    font-weight: bolder
  }

  .expinfo {
    border: 1px solid #1c1c1c;
    padding: 5px;
    border-radius: 5px;
    width: 800px
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