import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [{
    path: '/login',
    component: _import('login/index'),
    hidden: true,
    meta: {
      parentName: true
    }
  },
  {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/main',
    meta: {
      role: false
    },
    children: [{
        path: '/main',
        component: _import('dashboard/index'),
        name: 'main',
        meta: {
          role: false,
          title: '首页'
        }
      }, {
        path: '/order',
        component: _import('order/order'),
        name: 'order',
        meta: {
          role: true,
          title: '订单列表'
        }
      }, {
        path: '/DMDepartureBillManage',
        component: _import('DMDepartureBillManage/DMDepartureBillList'),
        name: 'DMDepartureBillList',
        meta: {
          title: '直邮打包单',
          parent: 'DMDepartureBillManage'
        }
      }, {
        path: '/createDM',
        component: _import('DMDepartureBillManage/createDM'),
        name: 'createDM',
        meta: {
          title: '新增直邮打包单',
          parent: 'DMDepartureBillManage'
        }
      }, {
        path: '/DMDetail',
        component: _import('DMDepartureBillManage/DMDetail'),
        name: 'DMDetail',
        meta: {
          title: '直邮打包单详情',
          parent: 'DMDepartureBillManage'
        }
      }, {
        path: '/orderDetail',
        component: _import('order/orderDetail'),
        name: 'orderDetail',
        meta: {
          role: true,
          title: '订单详情',
          parent: 'order'
        }
      }, {
        path: '/addorder',
        component: _import('order/addOrder'),
        name: 'addOrder',
        meta: {
          role: true,
          title: '新增订单',
          parent: 'order'
        }
      }, {
        path: '/customer',
        component: _import('customer/customer'),
        name: 'customer',
        meta: {
          role: true,
          title: '客户经理管理'
        }
      }, {
        path: '/retailer',
        component: _import('retailer/retailer'),
        name: 'retailer',
        meta: {
          role: true,
          title: '商户列表'
        }
      }, {
        path: '/retailerDesc',
        component: _import('retailer/retailerDesc'),
        name: 'retailerDesc',
        meta: {
          role: true,
          title: '商户详情',
          parent: 'retailer'
        }
      }, {
        path: '/retailerAuth',
        component: _import('retailer/retailerAuth'),
        name: 'retailerAuth',
        meta: {
          role: true,
          title: '商户认证管理'
        }
      }, {
        path: '/retailerLevel',
        component: _import('retailer/retailerLevel'),
        name: 'retailerLevel',
        meta: {
          role: true,
          title: '商户级别管理'
        }
      }, {
        path: '/retailerAuthDesc/:id',
        component: _import('retailer/retailerAuthDesc'),
        name: 'retailerAuthDesc',
        meta: {
          role: true,
          title: '商户认证详情',
          parent: 'retailerAuth'
        }
      }, {
        path: '/brand',
        component: _import('brand/brand'),
        name: 'brand',
        meta: {
          role: true,
          title: '品牌管理'
        }
      }, {
        path: '/origin',
        component: _import('brand/origin'),
        name: 'origin',
        meta: {
          role: true,
          title: '原产地管理'
        }
      }, {
        path: '/unit',
        component: _import('brand/unit'),
        name: 'unit',
        meta: {
          role: true,
          title: '计量单位管理'
        }
      }, {
        path: '/storemanage',
        component: _import('storeManage/storemanage'),
        name: 'storemanage',
        meta: {
          role: true,
          title: '仓库管理'
        }
      }, {
        path: '/adv',
        component: _import('adv/adv'),
        name: 'adv',
        meta: {
          role: true,
          title: '广告管理'
        }
      }, {
        path: '/addAdv',
        component: _import('adv/addAdv'),
        name: 'addAdv',
        meta: {
          role: true,
          title: '广告详情',
          parent: 'adv'
        }
      }, {
        path: '/recGoods',
        component: _import('adv/recGoods'),
        name: 'recGoods',
        meta: {
          role: true,
          title: '推荐商品管理'
        }
      }, {
        path: '/usermanage',
        component: _import('role/usermanage'),
        name: 'usermanage',
        meta: {
          role: true,
          title: '用户管理'
        }
      }, {
        path: '/rolemanage',
        component: _import('role/rolemanage'),
        name: 'rolemanage',
        meta: {
          role: true,
          title: '角色管理'
        }
      }, {
        path: '/roleadd',
        component: _import('role/roleadd'),
        name: 'roleadd',
        meta: {
          role: true,
          title: '新增角色',
          parent: 'rolemanage'
        }
      }, {
        path: '/merchandisecategories',
        component: _import('merchandisecategories/index'),
        name: 'merchandisecategories',
        meta: {
          role: true,
          title: '商品类别管理'
        }
      }, {
        path: '/merchandisecontrol',
        component: _import('merchandisecategories/goodsManageList'),
        name: 'merchandisecontrol',
        meta: {
          role: true,
          title: '商品管理'
        }
      }, {
        path: '/addGoods',
        component: _import('merchandisecategories/addGoods'),
        name: 'addGoods',
        meta: {
          role: true,
          title: '添加商品',
          parent: 'merchandisecontrol'
        }
      }, {
        path: '/refund',
        component: _import('refund/refund'),
        name: 'refund',
        meta: {
          role: true,
          title: '退款订单管理',
          keepalive: false
        }
      },

      {
        path: '/refundOrderManage',
        component: _import('refundOrderManage/refundOrderManage'),
        name: 'refundOrderManage',
        meta: {
          role: true,
          title: '退款订单管理'
        }
      },
      {
        path: '/refundOrderManageDetail',
        component: _import('refundOrderManage/refundOrderManageDetail'),
        name: 'refundOrderManageDetail',
        meta: {
          role: true,
          title: '退款详情',
          parent: '退款订单管理'
        }
      },

      {
        path: '/afterSaleRuleManage',
        component: _import('afterSaleRuleManage/afterSaleRuleManage'),
        name: 'afterSaleRuleManage',
        meta: {
          role: true,
          title: '售后规则管理'
        }
      },
      {
        path: '/addRule',
        component: _import('afterSaleRuleManage/addRule'),
        name: 'addRule',
        meta: {
          role: true,
          title: '添加规则',
          parent: 'merchandisecontrol'
        }
      },
      {
        path: '/skucategorymanage',
        component: _import('sku/skucategorymanage'),
        name: 'skucategorymanage',
        meta: {
          role: true,
          title: 'SKU类别设置'
        }
      }, {
        path: '/skuspec',
        component: _import('sku/skuspec'),
        name: 'skuspec',
        meta: {
          role: true,
          title: 'SKU规格定义'
        }
      }, {
        path: '/prop',
        component: _import('sku/skuprop'),
        name: 'prop',
        meta: {
          role: true,
          title: 'SKU关联属性规格'
        }
      }, {
        path: '/skulist',
        component: _import('sku/skulist'),
        name: 'skulist',
        meta: {
          role: true,
          title: 'SKU列表'
        }
      }, {
        path: '/sku',
        component: _import('sku/sku'),
        name: 'sku',
        meta: {
          role: true,
          title: '新增SKU',
          parent: 'skulist'
        }
      }, {
        path: '/profit',
        component: _import('profit/profit'),
        name: 'Profit',
        meta: {
          role: true,
          title: '销售毛利报表'
        }
      }, {
        path: '/orderReport',
        component: _import('profit/orderReport'),
        name: 'orderReport',
        meta: {
          role: true,
          title: '订单报表统计'
        }
      }, {
        path: '/skuSalesReport',
        component: _import('profit/skuSalesReport'),
        name: 'skuSalesReport',
        meta: {
          role: true,
          title: 'SKU销售报表'
        }
      }, {
        path: '/BrandReach',
        component: _import('profit/BrandReach'),
        name: 'BrandReach',
        meta: {
          role: true,
          title: '品牌达成报表'
        }
      }, {
        path: '/news',
        component: _import('news/newsList'),
        name: 'news',
        meta: {
          role: true,
          title: '新闻列表'
        }
      }, {
        path: '/newsInfo',
        component: _import('news/newsInfo'),
        name: 'newsInfo',
        meta: {
          role: true,
          title: '新闻编辑',
          parent: 'news'
        }
      }, {
        path: '/labels',
        component: _import('news/labels'),
        name: 'labels',
        meta: {
          role: true,
          title: '新闻标签列表'
        }
      }, {
        path: '/button',
        component: _import('button/button'),
        name: 'button',
        meta: {
          role: true,
          title: '按钮管理'
        }
      }, {
        path: '/auditLog',
        component: _import('auditLog/auditLog'),
        name: 'auditLog',
        meta: {
          role: true,
          title: '操作日志管理'
        }
      }, {
        path: '/auditInfo',
        component: _import('auditLog/auditInfo'),
        name: 'auditInfo',
        meta: {
          role: true,
          title: '操作日志详情',
          parent: 'auditLog'
        }
      }, {
        path: '/keyword',
        component: _import('keyword/keyword'),
        name: 'keyword',
        meta: {
          role: true,
          title: '关键字管理'
        }
      }, {
        path: '/transFeeTemplate',
        component: _import('transFeeTemplate/transFeeTemplate'),
        name: 'transFeeTemplate',
        meta: {
          role: true,
          title: '运费模版'
        }
      }, {
        path: '/transFeeTemplateInfo',
        component: _import('transFeeTemplate/transFeeTemplateInfo'),
        name: 'transFeeTemplateInfo',
        meta: {
          role: true,
          title: '运费模版详情',
          parent: 'transFeeTemplate'
        }
      }, {
        path: '/retailTraderSkuManage',
        component: _import('retailTraderSkuManage/retailTraderSkuManage'),
        name: 'retailTraderSkuManage',
        meta: {
          role: true,
          title: '分销商SKU上架管理'
        }
      }, {
        path: '/retailTraderSkuManageInfo',
        component: _import('retailTraderSkuManage/retailTraderSkuManageInfo'),
        name: 'retailTraderSkuManageInfo',
        meta: {
          role: true,
          title: '分销商SKU上架详情',
          parent: '/retailTraderSkuManage'
        }
      }, {
        path: '/merchantRecharge',
        component: _import('ChildMerchantRecharge/ChildMerchantRecharge'),
        name: 'ChildMerchantRecharge',
        meta: {
          title: '商户充值管理'
        }
      }, {
        path: '/bondMoneyManage',
        component: _import('ChildMerchantRecharge/bondMoneyManage'),
        name: 'bondMoneyManage',
        meta: {
          title: '保证金配置'
        }
      }, {
        path: '/childMarginManage',
        component: _import('ChildMerchantRecharge/childMarginManage'),
        name: 'childMarginManage',
        meta: {
          title: '保证金账户管理'
        }
      }, {
        path: '/childMerchantWallet',
        component: _import('ChildMerchantRecharge/childMerchantWallet'),
        name: 'childMerchantWallet',
        meta: {
          title: '商户钱包'
        }
      }, {
        path: '/childMerchantWalletDesc',
        component: _import('ChildMerchantRecharge/childMerchantWalletDesc'),
        name: 'childMerchantWalletDesc',
        meta: {
          title: '商户钱包流水明细',
          parent: 'childMerchantWallet'
        }
      }, {
        path: '/childMarginManageDesc',
        component: _import('ChildMerchantRecharge/childMarginManageDesc'),
        name: 'childMarginManageDesc',
        meta: {
          title: '保证金账户明细',
          parent: 'childMarginManage'
        }
      }, {
        path: '/SettleSetting',
        component: _import('settle/SettleSetting'),
        name: 'SettleSetting',
        meta: {
          title: '结算设置'
        }
      }, {
        path: '/BillSearch',
        component: _import('settle/BillSearch'),
        name: 'BillSearch',
        meta: {
          title: '账单列表'
        }
      }, {
        path: '/BillSearchDesc',
        component: _import('settle/BillSearchDesc'),
        name: 'BillSearchDesc',
        meta: {
          title: '账单详情',
          parent: 'BillSearch'
        }
      }, {
        path: '/Transaction',
        component: _import('settle/BillSearchDesc'),
        name: 'Transaction',
        meta: {
          title: '交易记录'
        }
      }, {
        path: '/ActivityArea',
        component: _import('ActivityArea/ActivityArea'),
        name: 'ActivityArea',
        meta: {
          title: '活动列表'
        }
      }, {
        path: '/addActivityArea',
        component: _import('ActivityArea/addActivityArea'),
        name: 'addActivityArea',
        meta: {
          title: '活动编辑'
        }
      }, {
        path: '/skuListManagement',
        component: _import('Partner/skulist'),
        name: 'skuListManagement',
        meta: {
          title: '合伙人SKU列表'
        }
      }, {
        path: '/partneraddsku',
        component: _import('Partner/partneraddsku'),
        name: 'partneraddsku',
        meta: {
          title: '合伙人SKU管理',
          parent: 'skuListManagement'
        }
      }, {
        path: '/copartnerListManagement',
        component: _import('Partner/copartnerListManagement'),
        name: 'copartnerListManagement',
        meta: {
          title: '合伙人管理'
        }
      }, {
        path: '/SupplierCustomer',
        component: _import('Partner/SupplierCustomer'),
        name: 'SupplierCustomer',
        meta: {
          title: '顾客管理'
        }
      }, {
        path: '/orderListManagement',
        component: _import('Partner/orderListManagement'),
        name: 'orderListManagement',
        meta: {
          title: '合伙人订单管理'
        }
      }, {
        path: '/orderInfoManagement',
        component: _import('Partner/orderInfoManagement'),
        name: 'orderInfoManagement',
        meta: {
          title: '合伙人订单详情'
        }
      }, {
        path: '/settleAccountsManagement',
        component: _import('Partner/settleAccountsManagement'),
        name: 'settleAccountsManagement',
        meta: {
          title: '合伙人结算管理'
        }
      }, {
        path: '/storeSetting',
        component: _import('Partner/storeSetting'),
        name: 'storeSetting',
        meta: {
          title: '合伙人店铺端配置'
        }
      }, {
        path: '/evaluateDataManagent',
        component: _import('Partner/evaluateDataManagent'),
        name: 'evaluateDataManagent',
        meta: {
          title: '合伙人商品评价管理'
        }
      }, {
        path: '/saleData',
        component: _import('Partner/saleData'),
        name: 'saleData',
        meta: {
          title: '合伙人销售数据'
        }
      }, {
        path: '/shopkeeperSetting',
        component: _import('Partner/shopkeeperSetting'),
        name: 'shopkeeperSetting',
        meta: {
          title: '合伙人掌柜端配置'
        }
      }, {
        path: '/baseSetting',
        component: _import('Partner/baseSetting'),
        name: 'baseSetting',
        meta: {
          title: '合伙人基础配置'
        }
      }, {
        path: '/auth',
        component: _import('Partner/auth'),
        name: 'auth',
        meta: {
          title: '合伙人一键授权'
        }
      }, {
        path: '/wechatConfig',
        component: _import('Partner/wechatConfig'),
        name: 'wechatConfig1',
        meta: {
          title: '合伙人小程序配置'
        }
      }, {
        path: '/thirdSkuCategoryStandard',
        component: _import('retailer/thirdSkuCategoryStandard'),
        name: 'wechatConfig2',
        meta: {
          title: '分销商分类规格设置'
        }
      }, {
        path: '/customerManagement',
        component: _import('retailer/customerManagement'),
        name: 'customerManagement',
        meta: {
          title: '客户管理'
        }
      }, {
        path: '/monthSellReach',
        component: _import('retailer/monthSellReach'),
        name: 'monthSellReach',
        meta: {
          title: '月度销售报表'
        }
      },
      {
        path: '/costReport',
        component: _import('costReport/costReport'),
        name: 'costReport',
        meta: {
          title: '成本计划报表'
        }
      },
      {
        path: '/costReportHistory',
        component: _import('costReport/costReportHistory'),
        name: 'costReportHistory',
        meta: {
          title: '历史成本',
          parent: 'costReport'
        }
      },
      {
        path: '/goodsStockManage',
        component: _import('merchandisecategories/goodsStockManage'),
        name: 'goodsStockManage',
        meta: {
          title: '商品库存管理'
        }
      },
      {
        path: '/goodsBatchStockManage',
        component: _import('merchandisecategories/goodsBatchStockManage'),
        name: 'goodsBatchStockManage',
        meta: {
          title: '商品批次库存管理'
        }
      },
      {
        path: '/batchStockDetail',
        component: _import('merchandisecategories/batchStockDetail'),
        name: 'batchStockDetail',
        meta: {
          title: '批次库存详情',
          parent: 'goodsBatchStockManage'
        }
      },
      {
        path: '/goodsAllocationBill',
        component: _import('stockManagement/goodsAllocationBill'),
        name: 'goodsAllocationBill',
        meta: {
          title: '商品调拨单'
        }
      },
      {
        path: '/POMaintainManage',
        component: _import('stockManagement/POMaintainManage'),
        name: 'POMaintainManage',
        meta: {
          title: 'PO单管理'
        }
      },
      {
        path: '/creatPOList',
        component: _import('stockManagement/creatPOList'),
        name: 'creatPOList',
        meta: {
          title: '新建PO单'
        }
      },
      {
        path: '/PODetail',
        component: _import('stockManagement/PODetail'),
        name: 'PODetail',
        meta: {
          title: 'PO单详情'
        }
      },
      {
        path: '/goodsAllocationDetail',
        component: _import('stockManagement/goodsAllocationDetail'),
        name: 'goodsAllocationDetail',
        meta: {
          title: '调拨单详情'
        }
      },
      {
        path: '/addAllocationBill',
        component: _import('stockManagement/addAllocationBill'),
        name: 'addAllocationBill',
        meta: {
          title: '商品调拨开单',
          parent: 'goodsAllocationBill'
        }
      },
      {
        path: '/afterSaleCreate',
        component: _import('afterSale/afterSaleCreate'),
        name: 'afterSaleCreate',
        meta: {
          title: '申请售后',
          parent: 'afterSale'
        }
      },

    ]
  }
]

// skuSalesReport
export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

]
