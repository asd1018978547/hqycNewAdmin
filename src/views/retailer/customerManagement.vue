<template>
  <div class="content_box roleadd goodsManage">
    <div class="searchBox">
      <el-row style="margin-bottom:0">
        <el-col :span='4'>
          <span class="timed">客户名称：</span>
          <el-input clearable v-model='partnerName' class="search_title" size='small' placeholder="请输入客户名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button class="search_btn pan-btn green-btn" @click='getListData' type="success" size='mini'
            icon='el-icon-search'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_left">
        <el-tree accordion @node-click='getGoodsData' :highlight-current='1 === 1' :data="typelist"
          :props="defaultProps" ref="tree"></el-tree>
      </div>
      <div class="box_right" style="padding:20px;">
        <div v-if="partnerId != ''">
        <p class="year_plate"><i class="el-icon-d-arrow-left" @click="del_year"></i>{{ name }}----{{ year.toString() + '年销售计划' }} <i
            class="el-icon-d-arrow-right" @click="add_year"></i></p>
        <el-table border :data="tableData" width='100%'>
          <el-table-column :label="item" align='center' :key='index'
            v-for="(item,index) in ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']">
            <template slot-scope="scope">
              <template v-if="scope.row['m_' + (index + 1)].PlanDate > month && year == new Date().getFullYear()">
                {{ defaultPrice }}
              </template>
              <template v-else-if="scope.row['m_' + (index + 1)].PlanDate == month && year == new Date().getFullYear()">
                <template v-if="!scope.row['m_' + (index + 1)].isedit">
                  <span>{{ scope.row['m_' + (index + 1)].SellPlanMoney }}</span>万
                  <el-button type="text" @click="edit_price((index + 1))">编辑</el-button>
                </template>
                <template v-else>
                  <el-input style="width:70px;" size="mini" v-model="scope.row['m_' + (index + 1)].SellPlanMoney">
                  </el-input>万
                  <el-button type="text" @click="sbu_price((index + 1))">提交</el-button>
                </template>
              </template>
              <template v-else>{{ scope.row['m_' + (index + 1)].SellPlanMoney }}万</template>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getmanalist, getkehujihua,editjihua } from "@/api/retailer";
export default {
  data() {
    return {
      typelist: [],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      tableData: [],
      partnerName: "",
      partnerId: "",
      name: '',
      defaultPrice: '',
      defaultProps: {
        children: "ChildPartner",
        label: "Name",
        isLeaf: "IsLeaf"
      }
    };
  },
  created() {
    this.getData().then(res => {
      this.typelist = res;
    });
  },
  methods: {
    getListData() {
      this.getData().then(res => {
      this.typelist = res;
    });
    },
    edit_price(index) {
      this.tableData[0]["m_" + index].isedit = true;
    },
    sbu_price(index) {
        if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(this.tableData[0]['m_' + index].SellPlanMoney) || this.tableData[0]['m_' + index].SellPlanMoney > 999.99) {
          this.$message.error('请输入正确的销售额')
          return
        } else {
          editjihua({
            partnerId: this.partnerId,
            sellPlanMoney: this.tableData[0]['m_' + index].SellPlanMoney * 10000
          }).then(() => {
            this.$message.success('修改成功')
            this.tableData[0]['m_' + index].isedit = false
          })
        }
      },
    getBrandScales() {
      getkehujihua({
        partnerId: this.partnerId,
        year: this.year
      }).then(res => {
        let a = [];
        let b = {
          m_1: null,
          m_2: null,
          m_3: null,
          m_4: null,
          m_5: null,
          m_6: null,
          m_7: null,
          m_8: null,
          m_9: null,
          m_10: null,
          m_11: null,
          m_12: null
        };
        for (let index = 0; index < 12; index++) {
          if (res.length > 0) {
            res.map(v => {
              if (v.PlanDate == index + 1) {
                v.isedit = false;
                v.SellPlanMoney = v.SellPlanMoney / 10000;
                b["m_" + (index + 1)] = v;
              } else {
                b["m_" + (index + 1)] = {
                  isedit: false,
                  PartnerId: this.partnerId,
                  PlanDate: index + 1,
                  SellPlanMoney: "0.00"
                };
              }
            });
          } else {
            b["m_" + (index + 1)] = {
              isedit: false,
              PartnerId: this.partnerId,
              PlanDate: index + 1,
              SellPlanMoney: "0.00"
            };
          }
        }
        a.push(b);
        this.tableData = a;
      });
    },
    del_year() {
      this.year = this.year - 1;
      this.getBrandScales();
    },
    add_year() {
      if (this.year + 1 > new Date().getFullYear()) {
      } else {
        this.year = this.year + 1;
        this.getBrandScales();
      }
    },
    getGoodsData(e) {
      if (e.ChildPartner.length > 0) return;
      this.name = e.Name
      this.partnerId = e.PartnerId;
      this.getBrandScales();
    },
    getData() {
      return new Promise((rs, rj) => {
        getmanalist({
          partnerName: this.partnerName
        }).then(res => {
          rs(res);
        });
      });
    }
  }
};
</script>
<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.year_plate {
  width: 100%;
  text-align: center;
  font-size: 18px;
}
.year_plate i {
  font-size: 20px;
  cursor: pointer;
}
.box {
  display: flex;
  min-height: calc(100vh - 84px);
  padding: 20px 0;
}

.box_left {
  flex: 0 0 250px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}

.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  margin-left: 10px;
}
</style>