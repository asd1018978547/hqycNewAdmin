<template>
  <div class="content_box roleadd goodsManage">
    <div class="box_top">
      <el-button
        type="success"
        size="mini"
        :disabled="multipleList.length == 0"
        @click="setStatus(1)"
      >开通</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="multipleList.length == 0"
        @click="setStatus(0)"
      >停用</el-button>
      <el-button
        type="success"
        size="mini"
        :disabled="multipleList.length == 0"
        @click="setGoodsStatus(1)"
      >展示全部商品</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="multipleList.length == 0"
        @click="setGoodsStatus(0)"
      >不展示全部商品</el-button>
      <el-button type="success" size="mini" @click="exportxml">导出</el-button>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">合伙人管理</div>
        <div class="searchBox">
          <el-row>
            <el-col :span="4">
              <span class="timed">合伙人状态：</span>
              <el-select class="search_title" v-model="search.Status" size="mini">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="已开通" :value="1"></el-option>
                <el-option label="已停用" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span class="timed" style="flex:0 0 150px;">合伙人/手机号/邀请人：</span>
              <el-input
                style="margin-left:10px;"
                clearable
                v-model="search.keys"
                class="search_title"
                size="mini"
                placeholder="合伙人/手机号/邀请人"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <span class="timed">认证类型：</span>
              <el-select class="search_title" v-model="search.authType" size="mini">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="微商代购" :value="1"></el-option>
                <el-option label="网络店铺" :value="2"></el-option>
                <el-option label="实体店铺" :value="3"></el-option>
                <el-option label="电商平台" :value="4"></el-option>
                <el-option label="贸易公司" :value="5"></el-option>
                <el-option label="个人" :value="6"></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <span class="timed">时间段：</span>
              <el-date-picker
                size="mini"
                v-model="time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
              ></el-date-picker>
              <el-button class="search_btn" @click="getSearch" type="success" size="mini">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table
            ref="tables"
            @selection-change="changeFun"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column label="合伙人" prop="NickName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="绑定手机" prop="Phone" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="上线商品" prop="SkuCount" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="伙伴"
              prop="InvitedCountByMe"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="顾客数" prop="CustomerCount" align="center" show-overflow-tooltip></el-table-column>
            <!--            <el-table-column label='显示全部商品' align='center' show-overflow-tooltip>-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-switch @change='(val) => { showallgoods(scope.row,val) }' v-model="scope.row.IsShowAllGoods"-->
            <!--                  active-color="#13ce66" inactive-color="#ff4949">-->
            <!--                </el-switch>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="邀请码" prop="InviteCode" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="来源" prop="InvitedByDesc" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="邀请人" prop="InvitedBy" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="佣金" prop="CommissionMethodDesc" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="认证类型" prop="AuthTypeDesc" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.Status == 1">已开通</el-tag>
                <el-tag type="warning" v-if="scope.row.Status == 0">未开店</el-tag>
                <el-tag type="danger" v-if="scope.row.Status == 2">已停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="DateAdded" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button @click=" openDialog(scope.$index)" size="small" type="primary" class="pan-btn blue-btn">佣金设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="佣金设置" :visible.sync="centerDialogVisible" width="30%" center>
            <div class="infoBox">
              <div class="info_item">
                <div class="info_title">
                  <span>*</span>佣金方式：
                </div>
                <div class="info_right">
                  <el-radio v-model="dialogData.commissionMethod"  :label="1">固定零售价</el-radio>
                </div>
              </div>
              <div class="info_item">
                <div class="info_title"></div>
                <div class="info_right">
                  <span>按掌柜建议零售价设置金额或百分比结算</span>
                </div>
              </div>
              <div class="info_item">
                <div class="info_title"></div>
                <div class="info_right">
                  <el-radio v-model="dialogData.commissionMethod" :label="2">区间零售价</el-radio>
                </div>
              </div>
              <div class="info_item">
                <div class="info_title"></div>
                <div class="info_right">
                  <span>按店铺零售价-掌柜建议零售价+建议零售价设置金额或百分比结算</span>
                </div>
              </div>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="check">确 定</el-button>
            </span>
          </el-dialog>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[15,30,50,100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalRows"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getPartnerList,
  setPartnerShowAll,
  setPartnerStatus,
  exportxml,
  CommissionMethodSet
} from "@/api/Partner/copartnerListManagement";
import { formatDateTime } from "@/utils/index";
import moment from "moment";

export default {
  data() {
    return {
      dialogData: {
        partnerId :'',
        commissionMethod : null
      },
      centerDialogVisible: false,
      multipleList: [],
      time: [
        moment()
          .subtract(7, "d")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      ],
      search: {
        Status: "",
        keys: "",
        StartDate: "",
        EndDate: "",
        authType: ""
      },
      list: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  activated() {
    this.getdata();
  },
  methods: {
    openDialog(index) {
      this.centerDialogVisible = true;
      this.dialogData.partnerId = this.list[index].Id;
      this.dialogData.commissionMethod = this.list[index].CommissionMethod;
    },
    check(){
      CommissionMethodSet(this.dialogData).then(res=>{
        this.$message({
          message: '佣金方式设置成功',
          type: 'success'
        });
        this.getdata()
      })
      this.centerDialogVisible = false;
    },
    //导出
    exportxml() {
      exportxml(this.search).then(res => {
        window.open(res, "_blank");
      });
    },
    getSearch() {
      this.pageIndex = 1;
      this.getdata();
    },
    setStatus(v) {
      let partnerIds = [];
      this.multipleList.map(v => {
        partnerIds.push(v.Id);
      });
      partnerIds = partnerIds.join(",");
      let status = v;
      setPartnerStatus({ partnerIds, status }).then(res => {
        this.$message.success("设置成功");
        this.getdata();
      });
    },
    setGoodsStatus(v) {
      let partnerIds = [];
      this.multipleList.map(v => {
        partnerIds.push(v.Id);
      });
      partnerIds = partnerIds.join(",");
      let IsShowAll = v;
      setPartnerShowAll({ partnerIds, IsShowAll }).then(res => {
        this.$message.success("设置成功");
        this.getdata();
      });
    },
    showallgoods(row, val) {
      setPartnerShowAll({
        partnerIds: row.Id,
        IsShowAll: val ? 1 : 0
      }).then(() => {
        this.$message.success("设置成功");
        this.getdata();
      });
    },
    changeFun(val) {
      this.multipleList = val;
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getdata();
    },
    getdata() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      if (this.time) {
        p.StartDate = this.time[0];
        p.EndDate = this.time[1];
      } else {
        (p.StartDate = ""), (p.EndDate = "");
      }
      getPartnerList(p).then(res => {
        res.Data.map(v => {
          v.AuthTypeDesc = "";
          v.IsShowAllGoods = v.IsShowAllGoods == 1 ? true : false;
          v.DateAdded = formatDateTime(v.DateAdded);
          switch (v.AuthType) {
            case 1:
              v.AuthTypeDesc = "微商代购";
              break;
            case 2:
              v.AuthTypeDesc = "网络店铺";
              break;
            case 3:
              v.AuthTypeDesc = "实体店铺";
              break;
            case 4:
              v.AuthTypeDesc = "电商平台";
              break;
            case 5:
              v.AuthTypeDesc = "贸易公司";
              break;
            case 6:
              v.AuthTypeDesc = "个人";
              break;
          }
        });
        this.list = res.Data;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style scoped lang="scss">
.chebox_list {
  padding: 0 10px;
}
.chebox_list p,
.el-radio-group,
.chebox_list .chebox_radio {
  width: 100%;
}
.inb_120 {
  display: inline-block;
  width: 120px;
}
.box_top {
  height: 50px;
  line-height: 50px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}
.choice_group {
  width: 100%;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;

  .input_group {
    flex: 1;
  }

  #fileEl {
    position: absolute;
    width: 265px;
    height: 36px;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
  }

  .file_text {
    width: 265px;
    height: 36px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-circle-close {
    cursor: pointer;
    font-size: 15px;
    position: relative;
    left: -32px;
    color: #aaa;
    z-index: 10000;
  }

  .pan-btn {
    padding: 10px 20px;
  }
}
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.box {
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
}

.box_left {
  flex: 0 0 150px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.content_box {
  width: 100%;
  box-sizing: border-box;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
  box-sizing: border-box;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.skuItem {
  display: flex;
}

.skuItem img {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
}

.skuItem p {
  line-height: 25px;
  padding-left: 10px;
  text-align: left;
  margin: 0;
}

.mb {
  margin-bottom: 5px;
}
.info_item {
  display: flex;
  height: 30px;
}

.info_title span {
  color: #ff0000;
  padding-right: 5px;
}

.info_item .info_title {
  flex: 0 0 100px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
}
</style>
