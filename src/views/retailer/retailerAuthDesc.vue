<template>
  <div class="content_box">
    <sticky class="sub-navbar">
      认证详情
      <el-button
        @click="success"
        class="pan-btn green-btn"
        v-if="info.Status == 0 && checkBtn('func_order_audit')"
        style="margin-left: 10px;"
        type="success"
        size="small"
      >通过</el-button>
      <el-button
        @click="errors"
        class="pan-btn red-btn"
        v-if="info.Status == 0 && checkBtn('func_order_audit')"
        type="danger"
        size="small"
      >拒绝</el-button>
    </sticky>
    <div class="desc">
      <div class="item">
        <div class="title">申请状态：</div>
        <div class="item_desc">
          <el-tag :type="info.statusType">{{ info.statusdesc }}</el-tag>
        </div>
      </div>
      <div class="item" v-if="info.AuthTypeDesc">
        <div class="title">合作者：</div>
        <div class="item_desc" v-if="info.Status == 0">
          <el-select size="mini" v-model="PartnerId" placeholder="请选择">
            <el-option
              v-for="item in rList"
              :key="item.PartnerId"
              :label="item.Description"
              :value="item.PartnerId"
            ></el-option>
          </el-select>
        </div>
        <div class="item_desc" v-else>{{ Parter == '' ? '无' : Parter }}</div>
      </div>
      <div class="item" v-if="info.AuthTypeDesc">
        <div class="title">认证类型：</div>
        <div class="item_desc">{{ info.AuthTypeDesc }}</div>
      </div>
      <div class="item" v-if="info.Platform">
        <div class="title">经营平台：</div>
        <div class="item_desc">{{ info.Platform }}</div>
      </div>
      <div class="item" v-if="info.ShopName">
        <div class="title">店铺/微商名称：</div>
        <div class="item_desc">{{ info.ShopName }}</div>
      </div>
      <div class="item" v-if="info.WebLink">
        <div class="title">店铺/平台网址：</div>
        <div class="item_desc">{{ info.WebLink }}</div>
      </div>
      <div class="item" v-if="info.Address">
        <div class="title">联系地址：</div>
        <div class="item_desc">{{ info.Address}}</div>
      </div>
      <div class="item" v-if="info.Phone">
        <div class="title">联系电话：</div>
        <div class="item_desc">{{ info.Phone }}</div>
      </div>
      <div class="item" v-if="info.UserName">
        <div class="title">店主/法人姓名：</div>
        <div class="item_desc">{{ info.UserName }}</div>
      </div>
      <div class="item" v-if="info.IdCardNo">
        <div class="title">店主/法人身份证号：</div>
        <div class="item_desc">{{ info.IdCardNo }}</div>
      </div>
      <div class="item" v-if="info.License">
        <div class="title">营业执照号码：</div>
        <div class="item_desc">{{ info.License }}</div>
      </div>
      <div class="item" v-if="info.CompanyName">
        <div class="title">公司名称：</div>
        <div class="item_desc">{{ info.CompanyName }}</div>
      </div>
      <div class="item" v-if="info.Sales > 0">
        <div class="title">月销量：</div>
        <div class="item_desc">{{ info.Sales }}万</div>
      </div>
      <div class="item" v-if="info.ShopCount > 0">
        <div class="title">分店数量：</div>
        <div class="item_desc">{{ info.ShopCount }}</div>
      </div>
      <div class="item" v-if="info.BusinessTypeDesc">
        <div class="title">贸易类型：</div>
        <div class="item_desc">{{ info.BusinessTypeDesc }}</div>
      </div>
      <div class="item" v-if="info.OperationCategory.length > 0">
        <div class="title">经营品类：</div>
        <div class="item_desc">
          <el-tag
            style="margin-right:10px;"
            v-for="(item,index) in info.OperationCategory"
            :key="index"
          >{{ item.OperationCategoryName }}</el-tag>
        </div>
      </div>
      <div class="item" v-if="info.InterestCategory.length > 0">
        <div class="title">感兴趣类目：</div>
        <div class="item_desc">
          <el-tag
            style="margin-right:10px;"
            v-for="(item,index) in info.InterestCategory"
            :key="index"
          >{{ item.InterestCategoryName }}</el-tag>
        </div>
      </div>
      <div class="item" v-if="info.StorePort.length > 0">
        <div class="title">保税仓储：</div>
        <div class="item_desc">
          <el-tag
            style="margin-right:10px;"
            v-for="(item,index) in info.StorePort"
            :key="index"
          >{{ item.storePort }}</el-tag>
        </div>
      </div>
      <div class="item" v-if="info.IdCardFrontImg">
        <div class="title">法人身份证正面照片：</div>
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.IdCardFrontImg)" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.IdCardFrontImg" alt />
        </div>
      </div>
      <div class="item" v-if="info.IdCardBehindImg">
        <div class="title">法人身份证反面照片：</div>
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.IdCardBehindImg)" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.IdCardBehindImg" alt />
        </div>
      </div>
      <div class="item" v-if="info.LicensImg">
        <div class="title">营业执照照片：</div>
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.LicensImg)" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.LicensImg" alt />
        </div>
      </div>
      <div class="item" v-if="info.SaleCenterImg">
        <div class="title">卖家中心照片：</div>
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.SaleCenterImg)" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.SaleCenterImg" alt />
        </div>
      </div>
      <div class="item" v-if="info.ShopImg">
        <div class="title">店铺/门店照片：</div>
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.ShopImg.split(',')[0])" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.ShopImg.split(',')[0]" alt />
        </div>
      </div>
      <div class="item" style="margin-left:150px" v-if="info.ShopImg">
        <div class="item_desc">
          <el-button @click="jumpBigImg(fu + info.ShopImg.split(',')[1])" type="text">查看大图</el-button>
          <br />
          <img :src="fu + info.ShopImg.split(',')[1]" alt />
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="rankVisible" width="30%">
      <div style="height: 40px;line-height: 40px">
        <div style="display: flex;">
          <div style="flex: 0 0 120px">请选择用户等级：</div>
          <el-select size="mini" class="sect" v-model="successvalue" placeholder="请选择用户等级">
            <el-option
              v-for="item in rankoptions"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rankVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitSuccess" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="errorVisible" width="30%">
      <div class="er" style="height: 40px;line-height: 40px">
        <div style="display: flex;">
          <div style="flex: 0 0 120px">请选择拒绝原因：</div>
          <el-select size="mini" class="sect sect2" v-model="errorvalue" placeholder="请选择拒绝原因">
            <el-option
              v-for="item in errorptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div style="width: 50%;margin-left: 135px;">
          <el-input
            class="input"
            size="mini"
            v-if="errorvalue == '其他'"
            v-model="errorinput"
            placeholder="请输入拒绝理由"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitError" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAuthDesc,
  getUserRank,
  submitAuth,
  getRetailerList
} from "@/api/retailer";
import Sticky from "@/components/Sticky";
export default {
  components: { Sticky },
  data() {
    return {
      roleBtn: [],
      errorvalue: "",
      successvalue: "",
      errorinput: "",
      fu: window.ali_oss_data.URL_IMG_SHOW,
      errorptions: [
        {
          name: "网店地址无法打开",
          id: 1
        },
        {
          name: "营业执照不符或模糊",
          id: 2
        },
        {
          name: "无法与申请人取得联系",
          id: 3
        },
        {
          name: "其他",
          id: 4
        }
      ],
      PartnerId: "",
      Parter: "",
      rList: [],
      rankVisible: false,
      errorVisible: false,
      rankoptions: [],
      info: {
        OperationCategory: [],
        InterestCategory: [],
        StorePort: []
      }
    };
  },
  methods: {
    getList() {
      getRetailerList().then(res => {
        this.rList = res;
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
    submitError() {
      if (this.errorvalue === "其他" && this.errorinput === "") {
        return;
      } else {
        submitAuth({
          id: this.info.Id,
          failreason:
            this.errorvalue === "其他" ? this.errorinput : this.errorvalue,
          levelId: "",
          status: 2
        }).then(res => {
          this.$message.success("操作成功！");
          this.getData();
          this.errorVisible = false;
        });
      }
    },
    submitSuccess() {
      if (this.successvalue !== "") {
        submitAuth({
          id: this.info.Id,
          failreason: "",
          PartnerId: this.PartnerId,
          levelId: this.successvalue,
          status: 1
        }).then(res => {
          this.$message.success("操作成功！");
          this.getData();
          this.rankVisible = false;
        });
      }
    },
    success() {
      getUserRank().then(res => {
        this.rankoptions = res;
      });
      this.rankVisible = true;
    },
    errors() {
      this.errorVisible = true;
    },
    jumpBigImg(url) {
      window.open(url, "_blank");
    },
    getTag(code) {
      code = parseInt(code);
      if (code === 0) {
        return "warning";
      } else if (code === 1) {
        return "success";
      } else if (code === 2) {
        return "danger";
      }
    },
    getData() {
      this.getList();
      getAuthDesc({
        id: this.$route.params.id
      }).then(res => {
        res.statusType = this.getTag(res.Status);
        res.Status = parseInt(res.Status);
        if (res.Status === 0) {
          res.statusdesc = "待审核";
        } else if (res.Status === 1) {
          res.statusdesc = "审核通过";
        } else if (res.Status === 2) {
          res.statusdesc = "已拒绝";
        }
        // const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
        // const objExp = new RegExp(Expression)
        // if (!objExp.test(res.WebLink)) {
        //   res.WebLink = 'http://' + res.WebLink
        // }
        this.Parter = res.Parter;
        this.info = res;
      });
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getData();
      this.roleBtn = this.$store.getters.getMenuForId("/retailerAuthDesc");
    } else {
      this.$router.push("/main");
    }
  },
  activated() {
    if (this.$route.params.id) {
      this.getData();
    } else {
      this.$router.push("/main");
    }
  }
};
</script>
<style scoped>
a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
}

.desc .item {
  line-height: 45px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 150px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 1;
}

.desc .item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
}
</style>