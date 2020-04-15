<!--直邮打包单详情-->
<template>
  <div class="content_box">
    <m-title title="直邮打包单管理>详情"></m-title>
    <div style="font-size:16px;margin:10px 0 0 0">基本信息</div>
    <el-form
      :model="ruleForm"
      size="mini"
      label-position="left"
      style="margin-top:20px"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="关区代码:" label-width="85px">
            <span style="color:#999999">{{this.ruleForm.CustomsCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="起运国:" label-width="70px">
            <span style="color:#999999">{{ruleForm.StartCountry}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总运单号:" label-width="85px">
            <span style="color:#999999">{{ruleForm.AlwaysAwb}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="运输方式:" label-width="85px">
            <span style="color:#999999">{{ruleForm.TrafModeCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="航班航次号:" label-width="100px">
            <span style="color:#999999">{{ruleForm.VoyageNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运输工具编号:" label-width="115px">
            <span style="color:#999999">{{ruleForm.TrafNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="总运单PDF扫描件:" label-width="130px">
            <a
              v-if="pdfName !=''"
              :href="pdfName"
              title="点击预览"
              target="_blank"
              style="color:#999999"
              rel="noopener noreferrer"
            >{{showName}}</a>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label=" 备注:" label-width="50px">
            <span style="color:#999999">{{ruleForm.Memo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="device-line"></div>
      <div style="font-size:16px;margin:10px 0 20px 0">订单信息</div>
      <el-table :data="DMDepartureBillItems" border style="width: 776px;margin-top:10px">
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
        <el-button @click="resetForm('ruleForm')">返回</el-button>
      </el-form-item>
    </el-form>
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
    this.getData();
  },
  methods: {
    getData() {
      getDMDetail({
        DMDepartureBillId: this.$route.query.id,
        token: localStorage.Token
      }).then(res => {
        console.log(res);

        this.ruleForm.CustomsCode = res.CustomsCode;
        this.ruleForm.StartCountry = res.StartCountry;
        this.ruleForm.AlwaysAwb = res.AlwaysAwb;
        this.ruleForm.TrafModeCode = res.TrafModeCode;
        this.ruleForm.VoyageNo = res.VoyageNo;
        this.ruleForm.TrafNo = res.TrafNo;
        this.ruleForm.Memo = res.Memo;
        this.MasterWaybillPdf = res.MasterWaybillPdf;
        this.showName = this.MasterWaybillPdf.substring(this.MasterWaybillPdf.indexOf("/img/")+5);
        this.pdfName = window.ali_oss_data.URL_IMG_SHOW + res.MasterWaybillPdf;
        this.DMDepartureBillItems = res.Detail;
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