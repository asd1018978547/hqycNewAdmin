<template>
  <div class="main content_box orderdetail roleadd od pdt15">
    <el-collapse :value="['1','2','3']">
      <el-collapse-item title="账户信息" name="1">
        <div class="item">
          <div class="title">账户状态：</div>
          <div class="item_desc">
            <span class="Success" v-if="info.AccountInfo.Status == 1">正常</span>
            <span class="Warning" v-if="info.AccountInfo.Status == 2">冻结</span>
          </div>
        </div>
        <div class="item">
          <div class="title">商户登录名：</div>
          <div class="item_desc">{{ info.AccountInfo.UserName }}</div>
        </div>
        <div class="item">
          <div class="title">商户分类：</div>
          <div class="item_desc">{{ info.AccountInfo.Channel }}</div>
        </div>
        <div class="item">
          <div class="title">商户编号：</div>
          <div class="item_desc">{{ info.AccountInfo.UserSN }}</div>
        </div>
        <div class="item">
          <div class="title">商户等级：</div>
          <div class="item_desc">{{ info.AccountInfo.RetailerLevel }}</div>
        </div>
        <div class="item">
          <div class="title">绑定手机：</div>
          <div class="item_desc">{{ info.AccountInfo.Phone }}</div>
        </div>
        <div class="item">
          <div class="title">注册方式：</div>
          <div class="item_desc">{{ info.AccountInfo.RegisterType }}</div>
        </div>
        <div class="item">
          <div class="title">注册时间：</div>
          <div class="item_desc">{{ info.AccountInfo.RegisterDateAdded }}</div>
        </div>
        <div class="item">
          <div class="title">认证时间：</div>
          <div class="item_desc">{{ info.AccountInfo.AuthenticationDateAdded }}</div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="商户资料" name="2" v-if="info.MerchantsInfo">
        <div class="item" v-if="info.MerchantsInfo.AuthTypeDesc">
          <div class="title">认证类型：</div>
          <div class="item_desc">{{ info.MerchantsInfo.AuthTypeDesc }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.City">
          <div class="title">企业/门店地址：</div>
          <div
            class="item_desc"
          >{{info.MerchantsInfo.Province}}- {{ info.MerchantsInfo.City}}-{{info.MerchantsInfo.District}}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.Platform">
          <div class="title">销售平台：</div>
          <div class="item_desc">{{ info.MerchantsInfo.Platform }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.License">
          <div class="title">营业执照号码：</div>
          <div class="item_desc">{{ info.MerchantsInfo.License }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.ShopName">
          <div class="title">店铺/微商名称：</div>
          <div class="item_desc">{{ info.MerchantsInfo.ShopName }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.WebLink">
          <div class="title">店铺/平台网址：</div>
          <div class="item_desc">{{ info.MerchantsInfo.WebLink }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.Address">
          <div class="title">联系地址：</div>
          <div class="item_desc">{{ info.MerchantsInfo.Address}}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.Phone">
          <div class="title">联系电话：</div>
          <div class="item_desc">{{ info.MerchantsInfo.Phone }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.UserName">
          <div class="title">店主/法人姓名：</div>
          <div class="item_desc">{{ info.MerchantsInfo.UserName }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.IdCardNo">
          <div class="title">店主/法人身份证号：</div>
          <div class="item_desc">{{ info.MerchantsInfo.IdCardNo }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.CompanyName">
          <div class="title">公司名称：</div>
          <div class="item_desc">{{ info.MerchantsInfo.CompanyName }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.Sales > 0">
          <div class="title">月销量：</div>
          <div class="item_desc">{{ info.MerchantsInfo.Sales }}万</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.ShopCount > 0">
          <div class="title">分店数量：</div>
          <div class="item_desc">{{ info.MerchantsInfo.ShopCount }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.BusinessTypeDesc">
          <div class="title">贸易类型：</div>
          <div class="item_desc">{{ info.MerchantsInfo.BusinessTypeDesc }}</div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.OperationCategory.length > 0">
          <div class="title">经营品类：</div>
          <div class="item_desc">
            <el-tag
              style="margin-right:10px;"
              v-for="(item,index) in info.MerchantsInfo.OperationCategory"
              :key="index"
            >{{ item.OperationCategoryName }}</el-tag>
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.InterestCategory.length > 0">
          <div class="title">感兴趣类目：</div>
          <div class="item_desc">
            <el-tag
              style="margin-right:10px;"
              v-for="(item,index) in info.MerchantsInfo.InterestCategory"
              :key="index"
            >{{ item.InterestCategoryName }}</el-tag>
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.StorePort.length > 0">
          <div class="title">保税仓储：</div>
          <div class="item_desc">
            <el-tag
              style="margin-right:10px;"
              v-for="(item,index) in info.MerchantsInfo.StorePort"
              :key="index"
            >{{ item.storePort }}</el-tag>
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.IdCardFrontImg">
          <div class="title">法人身份证正面照片：</div>
          <div class="item_desc">
            <el-button @click="jumpBigImg(info.MerchantsInfo.IdCardFrontImg)" type="text">查看大图</el-button>
            <br />
            <img :src="info.MerchantsInfo.IdCardFrontImg" alt />
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.IdCardBehindImg">
          <div class="title">法人身份证反面照片：</div>
          <div class="item_desc">
            <el-button @click="jumpBigImg(info.MerchantsInfo.IdCardBehindImg)" type="text">查看大图</el-button>
            <br />
            <img :src="info.MerchantsInfo.IdCardBehindImg" alt />
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.LicensImg">
          <div class="title">营业执照照片：</div>
          <div class="item_desc">
            <el-button @click="jumpBigImg(info.MerchantsInfo.LicensImg)" type="text">查看大图</el-button>
            <br />
            <img :src="info.MerchantsInfo.LicensImg" alt />
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.SaleCenterImg">
          <div class="title">卖家中心照片：</div>
          <div class="item_desc">
            <el-button @click="jumpBigImg(info.MerchantsInfo.SaleCenterImg)" type="text">查看大图</el-button>
            <br />
            <img :src="info.MerchantsInfo.SaleCenterImg" alt />
          </div>
        </div>
        <div class="item" v-if="info.MerchantsInfo.ShopImg">
          <div class="title">店铺/门店照片：</div>
          <div class="item_desc">
            <el-button @click="jumpBigImg(info.MerchantsInfo.ShopImg)" type="text">查看大图</el-button>
            <br />
            <img :src="info.MerchantsInfo.ShopImg" alt />
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="资金账户" name="3">
        <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column label="账户类型" prop="FundAccountId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.FundAccountType == 1">预付款账户</span>
              <span v-if="scope.row.FundAccountType == 2">保证金账户</span>
              <span v-if="scope.row.FundAccountType == 3">授信账户</span>
            </template>
          </el-table-column>
          <el-table-column label="账户ID" prop="FundAccountId" align="center"></el-table-column>
          <el-table-column label="账户状态" prop="FundAccountId" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.Status == 1">开通</el-tag>
              <el-tag type="warning" v-if="scope.row.Status == 2">冻结</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="账户余额(元)" prop="FundAccountId" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.FundAccountType != 3">{{ scope.row.BalanceMoney }}</span>
              <span v-else>授信额度：{{ scope.row.BalanceMoney }}/已使用：{{ scope.row.UsedMoney }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
let OSS = require("ali-oss");
import { getRetailerDesc } from "@/api/retailer";
export default {
  data() {
    return {
      list: [],
      baseUrl: window.ali_oss_data.URL_IMG_SHOW,
      info: {
        AccountInfo: {},
        CapitalAccounts: [],
        MerchantsInfo: {
          InterestCategory: [],
          OperationCategory: [],
          StorePort: [],
          StorePort: []
        }
      }
    };
  },
  methods: {
    jumpBigImg(url) {
      window.open(url, "_blank");
    },
    showImage(url) {
      window.open(this.baseUrl + url, "_blank");
    }
  },
  activated() {
    getRetailerDesc({
      Id: this.$route.query.id
    }).then(res => {
      this.list = res.CapitalAccounts;
      this.info = res;
      let client = new OSS(window.ali_oss_data.URL_IMG_SHOW);
      if (this.info.MerchantsInfo.IdCardFrontImg) {
        let signUrl =
          window.ali_oss_data.URL_IMG_SHOW +
          this.info.MerchantsInfo.IdCardFrontImg;
        this.info.MerchantsInfo.IdCardFrontImg = signUrl;
      }
      if (this.info.MerchantsInfo.IdCardBehindImg) {
        let signUrl1 =
          window.ali_oss_data.URL_IMG_SHOW +
          this.info.MerchantsInfo.IdCardBehindImg;
        this.info.MerchantsInfo.IdCardBehindImg = signUrl1;
      }
      if (this.info.MerchantsInfo.LicensImg) {
        let signUrl2 =
          window.ali_oss_data.URL_IMG_SHOW + this.info.MerchantsInfo.LicensImg;
        this.info.MerchantsInfo.LicensImg = signUrl2;
      }
      if (this.info.MerchantsInfo.SaleCenterImg) {
        let signUrl3 =
          window.ali_oss_data.URL_IMG_SHOW +
          this.info.MerchantsInfo.SaleCenterImg;
        this.info.MerchantsInfo.SaleCenterImg = signUrl3;
      }
      if (this.info.MerchantsInfo.ShopImg) {
        let signUrl4 =
          window.ali_oss_data.URL_IMG_SHOW + this.info.MerchantsInfo.ShopImg;
        this.info.MerchantsInfo.ShopImg = signUrl4;
      }
    });
  }
};
</script>

<style>
.pdt15 {
  padding-top: 15px;
}
</style>
<style scoped>
a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
}

.item {
  line-height: 45px;
  display: flex;
  font-size: 14px;
}

.item .title {
  flex: 0 0 150px;
  text-align: right;
  padding-right: 10px;
}

.item .item_desc {
  flex: 1;
}

.item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
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
  flex: 0 0 70px;
  text-align: right;
}

.addres .nm span:nth-child(2) {
  flex: 0 0 300px;
}

.addres p.nm {
  display: flex;
  height: 36px;
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