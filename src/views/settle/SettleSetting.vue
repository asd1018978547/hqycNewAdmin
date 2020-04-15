<template>
  <div class="searchBox" style="padding-top:25px;">
    <el-row>
      <el-col :span="4">
        <span class="timed">分销商：</span>
        <el-select
          @change="getdata"
          filterable
          v-model="search.partnerId"
          class="search_title"
          size="mini"
          placeholder="请选择分销商"
        >
          <el-option
            v-for="(item, index) in parentList"
            :key="index"
            size="mini"
            :label="item.PartnerName"
            :value="item.PartnerId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button @click="add" type="success" class="search_btn pan-btn green-btn">新增</el-button>
      </el-col>
    </el-row>
    <div style="padding:15px">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column label="序号" prop="RowNumber" width="50" align="center"></el-table-column>
        <el-table-column label="分销商" prop="PartnerName" align="center"></el-table-column>
        <el-table-column label="结算周期" prop="SettlementPeriodTypeDesc" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="DateAdded" align="center"></el-table-column>
        <el-table-column label="操作" prop="Status" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.pageIndex"
          :page-sizes="[15,30,50,100]"
          :page-size="search.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalRows"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="editMsg" :visible.sync="centerDialogVisible" width="50%" center :show-close='false'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">分销商：</div>
          <div class="info_right">
            <el-select
              filterable
              v-if="editInfo.id == 0"
              v-model="editInfo.partnerId"
              class="search_title"
              size="small"
              placeholder="请选择分销商"
            >
              <el-option
                v-for="(item, index) in editParent"
                :key="index"
                :label="item.PartnerName"
                :value="item.PartnerId"
              ></el-option>
            </el-select>
            <span v-else>{{ editInfo.pname }}</span>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">结算周期：</div>
          <div class="info_right">
            <el-radio-group class="raodiClass" v-model="editInfo.settlementPeriodType">
              <el-radio :label="1">周结</el-radio>
              <el-radio :label="2">月结</el-radio>
              <el-radio :label="3">固定期限</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="info_item" v-if="editInfo.settlementPeriodType == 3">
          <div class="info_title">固定期限：</div>
          <div class="info_right">
            从&nbsp;
            <el-date-picker
              style="width:190px;"
              size="mini"
              :disabled="editInfo.id != 0"
              v-model="editInfo.startSettlementTime"
              align="center"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>&nbsp;起，每隔&nbsp;
            <el-input
              @change="typevaluechange"
              size="mini"
              align="center"
              style="width:60px;"
              v-model="editInfo.typeValue"
            ></el-input>
            <el-select @change="tchange" size="mini" style="width:65px;" v-model="editInfo.type">
              <el-option label="天" :value="1"></el-option>
              <el-option label="月" :value="2"></el-option>
            </el-select>&nbsp;结算一次
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeD">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getParentList,
  checkTime,
  getList,
  getAddParentList,
  addSettle
} from "@/api/settle/settleSetting.js";
export default {
  data() {
    return {
      editInfo: {
        id: 0,
        partnerId: null,
        pname: '',
        settlementPeriodType: null,
        type: 1,
        typeValue: "",
        startSettlementTime: null
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      search: {
        pageIndex: 1,
        pageSize: 15,
        partnerId: 0
      },
      editMsg: "新增结算设置",
      centerDialogVisible: false,
      TotalRows: 0,
      editParent: [],
      list: [],
      parentList: []
    };
  },
  methods: {
    addInfo() {
      if (this.editInfo.partnerId == null) {
        this.$message.error("请选择分销商");
        return false;
      } else if (this.editInfo.settlementPeriodType == null) {
        this.$message.error("请选择结算周期");
        return false;
      } else if (this.editInfo.settlementPeriodType == 3) {
        if (this.editInfo.startSettlementTime == null) {
          this.$message.error("请选择固定日期");
          return false;
        }
        if (this.editInfo.typeValue == "") {
          this.$message.error("请输入间隔时间");
          return false;
        }
      }
      addSettle(this.editInfo).then(res => {
        this.$message.success(this.editInfo.id ? "编辑成功" : "新增成功");
        this.pageIndex = 1;
        this.getdata();
        this.getAddParentList()
        this.centerDialogVisible = false;
        this.editInfo = {
          id: 0,
          partnerId: null,
          settlementPeriodType: null,
          type: 1,
          pname: '',
          typeValue: "",
          startSettlementTime: null
        };
      });
    },
    closeD() {
      this.centerDialogVisible = false;
        this.editInfo = {
          id: 0,
          partnerId: null,
          settlementPeriodType: null,
          type: 1,
          pname: '',
          typeValue: "",
          startSettlementTime: null
        };
    },
    typevaluechange() {
      let v = this.editInfo.typeValue.replace(/\D/g, "");
      if (v < 1) v = 1;
      if (v > 999 && this.editInfo.type == 1) v = 999;
      if (v > 12 && this.editInfo.type == 2) v = 12;
      this.editInfo.typeValue = v;
    },
    tchange() {
      this.editInfo.typeValue = ''
    },
    add() {
      this.editMsg = "新增结算设置";
      this.pickerOptions.disabledDate = time => {
        return false;
      }
      this.centerDialogVisible = true
    },
    handleSizeChange(v) {
      this.search.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
      this.getdata();
    },
    edit(row) {
      this.editInfo.id = row.Id
      this.editInfo.settlementPeriodType = parseInt(row.SettlementPeriodType)
      this.editInfo.partnerId = row.PartnerId
      this.editInfo.type = parseInt(row.Type) == 0 ? 1 : parseInt(row.Type)
      this.editInfo.typeValue = row.TypeValue
      this.editInfo.startSettlementTime = row.StartSettlementTime
      this.editInfo.pname = row.PartnerName
      checkTime({
        PartnerId: row.PartnerId
      }).then(res => {
        if (res.EndTime != '') {
          this.editInfo.startSettlementTime = res.EndTime
          this.pickerOptions.disabledDate = time => {
            return time.getTime() < new Date(res.EndTime + ' 00:00:00').getTime();
          }
        }
        this.centerDialogVisible = true
      })
      
    },
    getdata() {
      getList(this.search).then(res => {
        this.list = res.Data;
        this.TotalRows = res.TotalRows;
      });
    },
    getAddParentList() {
      getAddParentList({
        thirdPayType: 1
      }).then(res => {
        this.editParent = res
      })
    },
    getParentList() {
      getParentList({
        thirdPayType: 1
      }).then(res => {
        this.parentList = res;
        this.parentList.unshift({
          PartnerId: 0,
          PartnerName: "全部"
        });
      });
    }
  },
  created() {
    this.getParentList();
    this.getAddParentList()
    this.getdata();
  }
};
</script>

<style>
.raodiClass .el-radio__label {
  font-size: 12px !important;
}
</style>

<style scoped>
.info_item {
  display: flex;
  height: 50px;
  line-height: 50px;
}

.info_item .info_title {
  flex: 0 0 80px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
}
</style>
