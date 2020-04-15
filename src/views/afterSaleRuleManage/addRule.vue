<template>
  <div class="content_box">
    <h2 class="big_title">{{big_title}}规则</h2>
    <!-- 退款方式 -->
    <el-col class="marginTop">
      <span class="timed">*退款方式：</span>
      <el-select
        size="small"
        placeholder="请选择退款方式"
        :disabled="isEdit"
        @change="changeMethod"
        v-model="base.RefundMethodCode"
      >
        <el-option
          :key="index"
          v-for="(item,index) in refundList"
          :label="item.RefundMethodDesc"
          :value="item.RefundMethodCode"
        ></el-option>
      </el-select>
    </el-col>
    <br />
    <el-col class="marginTop">
      <span class="timed">*退款原因：</span>
      <el-select
        size="small"
        placeholder="请选择退款原因"
        @change="changeReason"
        :disabled="isEdit"
        v-model="base.RefundReasonCode"
      >
        <el-option
          v-for="(obj,index) in reasonsList"
          :key="index"
          :label="obj.RefundReasonDesc"
          :value="obj.RefundReasonCode"
        ></el-option>
      </el-select>
    </el-col>
    <br />
    <el-col class="marginTop">
      <span class="timed">*说明：</span>
      <span v-if=" this.base.RefundReasonExplain ">{{ this.base.RefundReasonExplain }}</span>
      <span>{{ explain }}</span>
      <!-- <el-input disabled :value="this.base.RefundReasonExplain"></el-input> -->
    </el-col>

    <br />

    <el-col class="marginTop">
      <span class="timed">赔付细则：</span>
    </el-col>
    <el-table class="marginTop" border :data="base.RuleStandard" style="width: 100%;">
      <el-table-column label="*退款标准" align="center">
        <template slot-scope="scope">
          <el-select size="small" placeholder="退款标准：" v-model="scope.row.RefundStandardCode">
            <el-option
              v-for="(obj,index) in standardList"
              :key="index"
              :label="obj.RefundStandardDesc"
              :value="obj.RefundStandardCode"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="*赔付款项" align="center">
        <template slot-scope="scope">
          <el-select
            size="small"
            placeholder="赔付款项"
            v-for="(item,index) in scope.row.RuleStandardDetail"
            :key="index"
            v-model="item.CompensationMoneyType"
          >
            <el-option label="商品金额" :value="1"></el-option>
            <!-- <el-option label="运费" :value="2"></el-option>
            <el-option label="税费" :value="3"></el-option>-->
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="*赔付方式" align="center">
        <template slot-scope="scope">
          <el-select
            size="small"
            placeholder="请选择赔付方式"
            v-for="(item,index) in scope.row.RuleStandardDetail"
            :key="index"
            v-model="item.CompensationMethod"
          >
            <el-option label="固定金额" :value="1"></el-option>
            <el-option label="百分比" :value="2"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="赔付金额" align="center">
        <template slot-scope="scope">
          <el-input
            type="number"
            v-for="(item,index) in scope.row.RuleStandardDetail"
            :key="index"
            v-model="item.CompensationValue"
            :placeholder="item.CompensationMethod == 1 ? '元' :'%'"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delRule(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button class="right" size="mini" type="primary" @click="addRule">新增</el-button>
    <el-col class="marginTop">
      <span class="timed"></span>
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </el-col>

  </div>
</template>

<script>
import { search } from "../../api/afterSaleRuleManage/index";
import {
  addRule,
  editRule,
  getEditRule
} from "../../api/afterSaleRuleManage/addRule";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      big_title: "", //标题
      isEdit: false,
      tableData: [],
      refundList: [], //退款方式列表
      reasonsList: [], //退款原因
      standardList: [], //退款标准列表
      explain: "",
      base: {
        RefundMethodCode: "", //退款方式
        RefundReasonCode: "", //退款原因
        RuleStandard: [
          {
            RefundStandardCode: "", //退款标准
            RuleStandardDetail: [
              {
                CompensationMoneyType: "", //赔付款项
                CompensationMethod: "", //赔付方式
                CompensationValue: "" //赔付金
              }
            ]
          }
        ]
      }
    };
  },

  created() {
    this.getRefundList();
    //判断编辑还是新增
    if (parseInt(this.$route.query.id) === -1) {
      this.big_title = "新增";
    } else {
      this.big_title = "编辑";
      this.isEdit = true;
      const p = {
        token: localStorage.Token,
        ruleId: this.$route.query.id
      };
      getEditRule(p).then(res => {
        this.getRefundList();
        this.base = res;
        setTimeout(() => {
          //根据一级回填二级
          this.refundList.map(item => {
            if (item.RefundMethodCode == res.RefundMethodCode) {
              this.reasonsList = item.RefundOrderReasons;
            }
          });
          //根据二级回填三级
          this.reasonsList.map(item => {
            if (item.RefundReasonCode == res.RefundReasonCode) {
              this.standardList = item.RefundOrderStandards;
              this.explain = item.RefundReasonExplain;
            }
          });
        }, 200);
      });
    }
  },
  activated(){
    this.explain=''
    
    if (parseInt(this.$route.query.id) === -1) {
        this.base= {
        RefundMethodCode: "", //退款方式
        RefundReasonCode: "", //退款原因
        RuleStandard: [
          {
            RefundStandardCode: "", //退款标准
            RuleStandardDetail: [
              {
                CompensationMoneyType: "", //赔付款项
                CompensationMethod: "", //赔付方式
                CompensationValue: "" //赔付金
              }
            ]
          }
        ]
      }
    }
    this.getRefundList()
    
  },
  destroyed(){
  },
  methods: {
    getRefundList() {
      const p = { refundType: 2 };
      search(p).then(res => {
        this.refundList = res;
      });
    },
    //改变一级菜单状态联动二级
    changeMethod(e) {
      this.refundList.map(item => {
        if (item.RefundMethodCode == e) {
          this.reasonsList = item.RefundOrderReasons;
          this.base.RefundReasonCode = "";
          this.explain = ''
          this.base.RuleStandard.map(item=>{
            item.RefundStandardCode = ""
          })
        }
      });
    },
    //改变二级菜单状态联动三级
    changeReason(e) {
      this.reasonsList.map(item => {
        if (item.RefundReasonCode == e) {
          this.standardList = item.RefundOrderStandards;
          this.explain = item.RefundReasonExplain;
          this.base.RuleStandard.map(item=>{
            item.RefundStandardCode = ""
          })
        }
      });
    },
    addRule() {
      this.base.RuleStandard.push({
        RefundStandardCode: "", //退款金额标准
        RuleStandardDetail: [
          {
            CompensationMoneyType: "", //赔付款项
            CompensationMethod: "", //赔付方式
            CompensationValue: "" //赔付金
          }
        ]
      });
    },
    delRule(index, rows) {
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.base.RuleStandard.splice(index, 1)){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    save() {
      if (this.base.RefundMethodCode === "") {
        this.$message.error("请输入退款方式");
        return;
      }
      if (this.base.RefundReasonCode === "") {
        this.$message.error("请输入退款原因");
        return;
      }
      for (let item of this.base.RuleStandard) {
        if (item.RefundStandardCode == "") {
          this.$message.error("请输入退款标准");
          return;
        }
      }

      const codelist = [];
      for (let item of this.base.RuleStandard) {
        codelist.push(item.RefundStandardCode);
        var code = codelist.sort();
        for (var i = 0; i < codelist.length; i++) {
          if (code[i] == code[i + 1]) {
            this.$message.error("退款标准不能相同");
            return;
          }
        }
      }
      for (let item of this.base.RuleStandard) {
        for (let obj of item.RuleStandardDetail) {
          if (obj.CompensationMethod == "") {
            this.$message.error("请输入赔付方式");
            return;
          }
        }
      }
      for (let item of this.base.RuleStandard) {
        for (let obj of item.RuleStandardDetail) {
          if (obj.CompensationMoneyType == "") {
            this.$message.error("请输入赔付款项");
            return;
          }
        }
      }
      for (let item of this.base.RuleStandard) {
        for (let obj of item.RuleStandardDetail) {
          var reg= /^[0-9]+\.{0,1}[0-9]{0,2}$/ ;
          //进固定金额判断
          if (obj.CompensationMethod == 1) {
            if (obj.CompensationValue < 0 || obj.CompensationValue == "" ||  reg.test(obj.CompensationValue) == false) {
              this.$message.error("请输入正确赔付金额");
              return;
            }
          }
          if (obj.CompensationMethod == 2) {
            if (obj.CompensationValue < 0 || obj.CompensationValue == "" ||  reg.test(obj.CompensationValue) == false) {
              this.$message.error("请输入正确赔付百分比");
              return;
            }
          }
        }
      }
      if (this.isEdit) {
        //修改
        const p = Object.assign(this.base, {
          token: localStorage.Token,
          ruleId: this.base.Id
        });
        editRule(p).then(res => {
          this.$message.success(this.big_title + "成功");
          this.$router.push('/afterSaleRuleManage')
          location.reload()
        });
      } else {
        //新增
        const p = Object.assign(this.base, {
          token: localStorage.Token
        });
        addRule(p).then(res => {
          this.$message.success(this.big_title + "成功");
          this.$router.push('/afterSaleRuleManage')
          location.reload()
        });
      }
    
      // this.base= {
      //   RefundMethodCode: "", //退款方式
      //   RefundReasonCode: "", //退款原因
      //   RuleStandard: [
      //     {
      //       RefundStandardCode: "", //退款标准
      //       RuleStandardDetail: [
      //         {
      //           CompensationMoneyType: "", //赔付款项
      //           CompensationMethod: "", //赔付方式
      //           CompensationValue: "" //赔付金
      //         }
      //       ]
      //     }
      //   ]
      // } 
    }
  }
};
</script>

<style  scoped>
.marginTop {
  margin-top: 20px;
}
.right {
  margin-top: 20px;
  position:fixed;
  right: 9%;
}
</style>