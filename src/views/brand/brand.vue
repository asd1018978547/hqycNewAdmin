<template>
  <div class="content_box">
    <m-title title='品牌管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">品牌名称：</span>
          <el-input v-model='search.BrandName' class="search_title" size='small' placeholder="请输入品牌名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button v-if='checkBtn("func_common_search")' class="search_btn pan-btn green-btn" @click='getData' type="success" size='mini' icon='el-icon-search'>查询</el-button>
          <el-button v-if='checkBtn("func_common_add")' @click='showmodel(1)' class="pan-btn green-btn addbtn" type="primary" size="mini" icon="el-icon-plus">新增品牌</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='ID' prop='Id' align='center' width='100'></el-table-column>
      <el-table-column label='品牌名称' prop='Name' align='center'></el-table-column>
      <el-table-column label='操作' align='center' width='320'>
        <template slot-scope="scope">
          <el-button class="pan-btn blue-btn" type="text" @click="showScale(scope.row)" size="mini">销售月度计划</el-button>
          <el-button v-if='checkBtn("func_common_edit")' class="pan-btn blue-btn" type="success" @click="showmodel(scope.row)" size="mini">编辑</el-button>
          <el-button v-if='checkBtn("func_common_delete")' class="pan-btn red-btn" type="primary" @click='deleteLevel(scope.row)' size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRow">
      </el-pagination>
    </div>
    <el-dialog :close-on-click-modal='1 == 0' v-if="dialogVisible" :title="dialogTitle" :visible.sync="dialogVisible" width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">品牌名称：</div>
          <div class="info_right">
            <el-input v-model='info.BrandName' placeholder="请输入品牌名称" size='mini'></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="销售月度计划"
      :visible.sync="scaledialog"
      :close-on-click-modal='false'
      width="1500px"
      >
      <p class="year_plate"><i class="el-icon-d-arrow-left" @click="del_year"></i>  {{ year }}  <i class="el-icon-d-arrow-right" @click="add_year"></i></p>
      <el-table border :data="tableData" width='100%'>
        <el-table-column :label="item" align='center' :key='index' v-for="(item,index) in ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']">
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
                <el-input style="width:70px;" size="mini" v-model="scope.row['m_' + (index + 1)].SellPlanMoney"></el-input>万
                <el-button type="text" @click="sbu_price((index + 1))">提交</el-button>
              </template>
            </template>
            <template v-else>{{ scope.row['m_' + (index + 1)].SellPlanMoney }}万</template>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="scaledialog = false">取 消</el-button>
        <el-button type="primary" @click="scaledialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getBrandList, addBrand, editBrand, delBrand, getBrandScale, addBrandScale } from '@/api/brand'
  export default {
    components: { MTitle },
    data() {
      return {
        pageIndex: 1,
        tableData: [],
        pageSize: 15,
        totalRow: 0,
        defaultPrice: '',
        month: new Date().getMonth() + 1,
        list: [],
        search: {
          BrandName: ''
        },
        year: new Date().getFullYear(),
        code: '',
        scaledialog: false,
        dialogTitle: '新增品牌',
        dialogVisible: false,
        isedit: false,
        roleBtn: [],
        info: {
          BrandName: '',
          id: ''
        }
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.getData()
    },
    methods: {
      del_year() {
        this.year = this.year - 1
        this.getBrandScales()
      },
      add_year() {
        if (this.year + 1 > new Date().getFullYear()) {
        } else {
          this.year =  this.year + 1
          this.getBrandScales()
        }
      },
      edit_price(index) {
        this.tableData[0]['m_' + index].isedit = true
      },
      sbu_price(index) {
        if (!/^\d+(\.\d*)?$|^\.\d+$/.test(this.tableData[0]['m_' + index].SellPlanMoney) || this.tableData[0]['m_' + index].SellPlanMoney > 9999.99) {
          this.$message.error('请输入正确的销售额')
          return
        } else {
          addBrandScale({
            brandCode: this.code,
            sellPlanMoney: this.tableData[0]['m_' + index].SellPlanMoney * 10000
          }).then(() => {
            this.$message.success('修改成功')
            this.tableData[0]['m_' + index].isedit = false
          })
        }
      },
      showScale(item) {
        this.code = item.Code
        this.scaledialog = true
        this.getBrandScales()
      },
      getBrandScales(year) {
        getBrandScale({
          brandCode: this.code,
          year: this.year
        }).then(res => {
          let a = []
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
          }
          for (let index = 0; index < 12; index++) {
            if (res.length > 0) {
              res.map(v => {
                if (v.PlanDate == (index +1)) {
                  v.isedit = false
                  v.SellPlanMoney = v.SellPlanMoney / 10000
                  b['m_' + (index + 1)] = v
                } else {
                  b['m_' + (index + 1)] = {
                    isedit: false,
                    BrandCode: this.code,
                    PlanDate: index + 1,
                    SellPlanMoney: '0.00'
                  }
                }
              })
            } else {
              b['m_' + (index + 1)] = {
                    isedit: false,
                    BrandCode: this.code,
                    PlanDate: index + 1,
                    SellPlanMoney: '0.00'
                  }
            }
            
          }
          a.push(b)
          this.tableData = a
        })
      },
      checkBtn(str) {
        let f = false
        this.roleBtn.forEach(item => {
          if (item.FunctionCode === str) {
            f = true
          }
        })
        return f
      },
      handleSizeChange(v) {
        this.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.pageIndex = v
        this.getData()
      },
      add() {
        if (this.info.BrandName === '') {
          this.$message.error('请输入品牌名称')
          return
        }
        if (this.isedit) {
          editBrand(this.info).then(res => {
            this.hideModel()
          })
        } else {
          addBrand(this.info).then(res => {
            this.hideModel()
          })
        }
      },
      hideModel() {
        this.$message.success(this.isedit ? '修改成功' : '新增成功')
        this.dialogVisible = false
        this.getData()
      },
      showmodel(data) {
        if (typeof data === 'object') {
          this.info.BrandName = data.Name
          this.info.id = data.Id
          this.isedit = true
          this.dialogTitle = '编辑品牌'
        } else {
          this.info.BrandName = ''
          this.info.id = ''
          this.isedit = false
          this.dialogTitle = '新增品牌'
        }
        this.dialogVisible = true
      },
      deleteLevel(row) {
        this.$confirm('确定删除这个品牌吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBrand({
            id: row.Id
          }).then(res => {
            this.$message.success('删除成功')
            this.getData()
          })
        }).catch()
      },
      getData() {
        getBrandList({ pageSize: this.pageSize, pageIndex: this.pageIndex, BrandName: this.search.BrandName }).then(res => {
          this.pageIndex = res.PageIndex
          this.totalRow = res.TotalRows
          this.list = res.Data
        })
      }
    }
  }
</script>
<style scoped>
.year_plate {
  width: 100%;
  text-align: center;
  font-size: 18px;
}
.year_plate i {
  font-size: 20px;
  cursor: pointer;
}
  .info_item {
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .info_item .info_title {
    flex: 0 0 80px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 0 0 200px;
  }
</style>