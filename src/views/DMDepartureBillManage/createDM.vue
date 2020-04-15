<template>
  <div class="content_box">
    <m-title v-if="this.$route.query.id" title="直邮打包单管理>编辑"></m-title>
    <m-title v-else title="直邮打包单管理>新增"></m-title>
    <div style="font-size:16px;margin:10px 0 0 0">基本信息</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      size="mini"
      label-position="left"
      style="margin-top:20px"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="关区代码:" prop="CustomsCode" label-width="85px">
            <el-input
              maxlength="20"
              @keyup.native="proving1"
              placeholder="请输入关区代码(正整数)"
              v-model="ruleForm.CustomsCode"
              style="width:242px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起运国:" prop="StartCountry" label-width="70px">
            <el-input
              maxlength="30"
              placeholder="请输入起运国"
              v-model="ruleForm.StartCountry"
              style="width:198px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总运单号:" prop="AlwaysAwb" label-width="85px">
            <el-input
              maxlength="30"
              placeholder="请输入总运单号"
              v-model="ruleForm.AlwaysAwb"
              style="width:220px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="运输方式:" prop="TrafModeCode" label-width="85px">
            <el-input
              maxlength="30"
              placeholder="请输入运输方式"
              v-model="ruleForm.TrafModeCode"
              style="width:242px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="航班航次号:" prop="VoyageNo" label-width="100px">
            <el-input
              maxlength="30"
              v-model="ruleForm.VoyageNo"
              placeholder="请输入航班航次号"
              style="width:169px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输工具编号:" prop="TrafNo" label-width="115px">
            <el-input
              maxlength="30"
              placeholder="请输入运输工具编号"
              v-model="ruleForm.TrafNo"
              style="width:190px"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <span style="color:red;margin:0 5px 0 0">*</span>
          <el-form-item label="总运单PDF扫描件:" label-width="130px">
            <el-upload
              v-if="pdfName == ''"
              class="upload-demo"
              action
              accept=".pdf, .PDF"
              :http-request="uploadPdf"
              :limit="1"
            >
              <el-button type="text">上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <a
              v-if="pdfName !=''"
              :href="pdfName"
              target="_blank"
              rel="noopener noreferrer"
            >{{showName}}</a>
            <el-button v-if="pdfName !=''" type="text" @click="removePDF">删除</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          &nbsp;&nbsp;&nbsp;
          <el-form-item label=" 备注:" label-width="50px">
            <el-input maxlength="30" v-model="ruleForm.Memo" style="width:210px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="device-line"></div>
      <div style="font-size:16px;margin:10px 0 20px 0">订单信息</div>
      <el-button size="mini" type="primary" @click="addOrder">添加订单</el-button>
      <el-button size="mini" type="primary" @click="delOrder" :disabled="flag_deleteOder">删除订单</el-button>
      <el-table
        :data="DMDepartureBillItems"
        border
        style="width: 776px;margin-top:10px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" header-align="center"></el-table-column>
        <el-table-column
          prop="SONO"
          label="报关订单号"
          header-align="center"
          align="center"
          width="180px"
        ></el-table-column>
        <el-table-column
          prop="WaybillNumber"
          label="运单号"
          width="180px"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="ProductQty"
          label="商品数量"
          width="180px"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="SOAmount"
          label="订单金额(￥)"
          width="180px"
          align="center"
          header-align="center"
        ></el-table-column>
      </el-table>
      <el-form-item style="margin-top:20px">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button type="primary" @click="submitFormandSB('ruleForm')">保存并申报</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择订单" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-row>
        <el-col :span="8">
          <span class="timed">报关订单号：</span>
          <el-input
            v-model="search.OutTradeNo"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入报关订单号"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <span class="timed">运单号：</span>
          <el-input
            v-model="search.ExpNum"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入运单号"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <span class="timed">条码：</span>
          <el-input
            v-model="search.sn"
            clearable
            class="search_title"
            size="mini"
            placeholder="请输入条码"
          ></el-input>
        </el-col>
        <!-- <el-col :span="24">
        </el-col>-->
      </el-row>
      <div style="text-align:right;margin:0 0 10px 0">
        <el-button
          size="mini"
          type="primary"
          @click="searchClick()"
          class="search_btn pan-btn blue-btn"
          icon="el-icon-search"
        >查询订单</el-button>
      </div>
      <el-table
        :data="orderList"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange1"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column align="center" label="报关订单号">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.SONO}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="运单号">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.WaybillNumber}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品数量">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.ProductQty}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单金额(￥)">
          <template slot-scope="scope">
            <div class="align_left">
              <span>{{ scope.row.SOAmount}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <div class="align_left">
              <span v-if="scope">待出库</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.PageIndex"
          :page-sizes="[15,30,50,100]"
          :page-size="search.PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalRows"
        ></el-pagination>
      </div>

      <span slot="footer" style="text-align:center;display:block;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="flag_chooseOder" @click="chooseOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDMList,
  createDM,
  delDM,
  editDMList,
  getDMDetail
} from "../../api/order/DMDeparture";
import { OrderList } from "@/api/order/orderCenter";
import MTitle from "@/components/MTitle";
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "DMDepartureBill/pdf/" +
  moment().format("YYYYMM") +
  "/img/";
export default {
  components: { MTitle },
  data() {
    return {
      flag_chooseOder: true,
      flag_deleteOder: true,
      //订单数组
      DMDepartureBillItems: [],
      ruleForm: {
        CustomsCode: "",
        StartCountry: "",
        AlwaysAwb: "",
        TrafModeCode: "",
        VoyageNo: "",
        TrafNo: "",
        Memo: ""
      },
      rules: {
        CustomsCode: [
          { required: true, message: "请输入关区代码", trigger: "change" }
        ],
        StartCountry: [
          { required: true, message: "请输入起运国", trigger: "change" }
        ],
        AlwaysAwb: [
          { required: true, message: "请输入总运单号", trigger: "change" }
        ],
        TrafModeCode: [
          { required: true, message: "请输入运输方式", trigger: "change" }
        ],
        VoyageNo: [
          { required: true, message: "请输入航班航次号", trigger: "change" }
        ],
        TrafNo: [
          { required: true, message: "请输入运输工具编号", trigger: "change" }
        ]
      },
      search: {
        addressInfo: [],
        Province: "",
        City: "",
        District: "",
        DateRange1: [
          "1999-01-01 00:00:00",
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)
        ], // 下单时间
        DateRange2: null, // 原始下单时间
        ChannelId: "-1",
        OutTradeNo: "",
        Status: "40",
        sn: "",
        OrderCode: "",
        ExtOrderCode: "",
        UserSN_R: "",
        Retailer: "",
        OrderSource: "-1",
        ChannelOrderCode: "",
        StoreType: "-1",
        StoreCode: "",
        IdNum: "",
        Consignee: "",
        ConsigneePhone: "",
        ExpCode: "",
        ExpNum: "",
        IsMfd: -1, // 1是作废，0是正常
        PageIndex: 1,
        PageSize: 15
      },
      pdfName: "",
      multipleSelection: [],
      multipleSelection1: [],
      dialogVisible: false,
      MasterWaybillPdf: "",
      TotalRows: 0,
      orderList: [],
      showName: "",
      uploadfiles: [],
      imgNames: []
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getDMDetail({
        DMDepartureBillId: this.$route.query.id,
        token: localStorage.Token
      }).then(res => {
        this.ruleForm.CustomsCode = res.CustomsCode;
        this.ruleForm.StartCountry = res.StartCountry;
        console.log(this.ruleForm.StartCountry);
        
        this.ruleForm.AlwaysAwb = res.AlwaysAwb;
        this.ruleForm.TrafModeCode = res.TrafModeCode;
        this.ruleForm.VoyageNo = res.VoyageNo;
        this.ruleForm.TrafNo = res.TrafNo;
        this.ruleForm.Memo = res.Memo;
        this.MasterWaybillPdf = res.MasterWaybillPdf;
        this.showName = this.MasterWaybillPdf.substring(
          this.MasterWaybillPdf.indexOf("/img/") + 5
        );
        this.pdfName = window.ali_oss_data.URL_IMG_SHOW + res.MasterWaybillPdf;
        this.DMDepartureBillItems = res.Detail;
      });
    }
  },
  methods: {
    delOrder() {
      this.multipleSelection.forEach((item, index) => {
        this.DMDepartureBillItems.splice(0, 1);
      });
    },
    chooseOrder() {
      this.DMDepartureBillItems = [
        ...this.DMDepartureBillItems,
        ...this.multipleSelection1
      ];
      this.dialogVisible = false;
    },
    searchClick(PageIndex = 1) {
      this.search.PageIndex = PageIndex;
      this.getOrderList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleSizeChange(v) {
      this.search.PageSize = v;
      this.getOrderList();
    },
    handleCurrentChange(v) {
      this.search.PageIndex = v;
      this.getOrderList();
    },
    //验证只能输入正整数
    proving1() {
      this.ruleForm.CustomsCode = this.ruleForm.CustomsCode.replace(
        /[^\.\d]/g,
        ""
      );
      this.ruleForm.CustomsCode = this.ruleForm.CustomsCode.replace(".", "");
    },

    getOrderList() {
      this.search.DateRange1[1] = moment(this.search.DateRange1[1] + "").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      OrderList(this.search).then(res => {
        this.TotalRows = res.TotalRows;
        let arr = [];
        res.Data.forEach(item => {
          if (item.OrderTypeDesc == "跨境直邮") {
            if (this.DMDepartureBillItems.length > 0) {
              let arry = this.DMDepartureBillItems.map(i => {
                return i.WaybillNumber;
              });
              if (arry.indexOf(item.ExpNum) == -1) {
                let goodsAmunt = 0;
                item.Detail.forEach(item => {
                  goodsAmunt = goodsAmunt + Number(item.Count);
                });
                const totalMoney =
                  item.GoodsMoney + item.TaxAmount + item.TransFee;
                let m = {
                  SONO: item.OutTradeNo,
                  WaybillNumber: item.ExpNum,
                  ProductQty: totalMoney,
                  SOAmount: goodsAmunt
                };
                arr.push(m);
              }
            } else {
              let goodsAmunt = 0;
              item.Detail.forEach(item => {
                goodsAmunt = goodsAmunt + Number(item.Count);
              });
              const totalMoney =
                item.GoodsMoney + item.TaxAmount + item.TransFee;
              let m = {
                SONO: item.OutTradeNo,
                WaybillNumber: item.ExpNum,
                ProductQty: totalMoney,
                SOAmount: goodsAmunt
              };
              arr.push(m);
            }
          }
        });
        this.orderList = arr;
        this.search.PageIndex = res.PageIndex;
      });
    },
    //选择表格数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 0) {
        this.flag_deleteOder = false;
      }
    },
    //选择订单
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
      if (this.multipleSelection1.length > 0) {
        this.flag_chooseOder = false;
      }
    },
    //添加订单
    addOrder() {
      this.dialogVisible = true;
      this.getOrderList();
    },
    //删除oss上的图片
    deleteOssPic(picArr) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function deleteMulti() {
        try {
          let result = await client.deleteMulti(picArr, {
            quiet: true
          });
        } catch (e) {
          console.log(e);
        }
      }

      deleteMulti();
    },
    //删除pdf
    removePDF() {
      let arry = [];
      arry.push(this.MasterWaybillPdf);
      this.deleteOssPic(arry);
      this.MasterWaybillPdf = "";
      this.pdfName = "";
    },
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
    //上传pdf
    uploadPdf(option) {
      this.uploadfiles = [];
      this.imgNames = [];
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        this.showName = name + "." + imageType;
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.MasterWaybillPdf = element;
          this.pdfName = signUrl;
        });
      }, 1000);
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.DMDepartureBillItems.length == 0) {
            this.$message.error("请至少选择一条订单信息");
            return;
          }
          if (this.MasterWaybillPdf == "") {
            this.$message.error("请上传pdf文件");
            return;
          }

          let para = {
            ...this.ruleForm,
            token: localStorage.Token,
            DMDepartureBillItems: this.DMDepartureBillItems,
            MasterWaybillPdf: this.MasterWaybillPdf
          };

          if (this.$route.query.id) {
            editDMList({
              ...para,
              DMDepartureBillId: this.$route.query.id
            })
              .then(res => {
                this.$message.success("编辑成功！");
                this.$router.push({ path: "/DMDepartureBillManage" });
              })
              .catch(err => {
                this.$message.success("编辑失败！");
              });
          } else {
            createDM(para)
              .then(res => {
                this.$message.success("新增成功！");
                this.$router.push({ path: "/DMDepartureBillManage" });
              })
              .catch(err => {
                this.$message.success("新增失败！");
              });
          }
        } else {
          return false;
        }
      });
    },
    submitFormandSB(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/DMDepartureBillManage" });
    }
  }
};
</script>
<style lang="scss">
.content_box {
  .el-upload-list__item-name {
    display: none;
  }
}
</style>
<style scoped>
.device-line {
  margin: 0 0 15px 0;
  border-style: solid;
  border-width: 0.5px;
  opacity: 0.3;
  border-color: #999999;
}
</style>