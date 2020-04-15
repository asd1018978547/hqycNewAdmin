<template>
  <div class="adv">
      <h2 class="big_title">客户经理管理</h2>
    <div class="searchBox">
      <el-row>
        <el-col :span='8'>
          <span class="timed">客户经理名称</span>
          <el-input class="search_title" v-model="search.customerManager" size='mini' placeholder="请输入客户经理名称">
          </el-input>
          <el-button size="mini" type="primary" @click="getData" v-if='checkBtn("func_common_search")'>查询</el-button>
          <el-button size="mini" type="primary" @click="add" v-if='checkBtn("func_common_add")'>新增客户经理</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column :show-overflow-tooltip="true" prop="Id" label="ID" align='center' width='80'></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop='Name' label="姓名" align='center'></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="Desc" label="描述" align='center'></el-table-column>
      <el-table-column label="操作" width="150" align='center'>
        <template slot-scope="scope">
          <el-button @click="editUser(scope.row)" type="success" size="mini" v-if='checkBtn("func_common_edit")'>编辑</el-button>
          <el-button @click="deleteUser(scope.row)" type="danger" size="mini" v-if='checkBtn("func_common_delete")'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:right;margin-top:10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[15, 50, 100, 200]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
    <div class="clearfix"></div>
    <el-dialog :close-on-click-modal='false' v-if="dialogVisible" title="新增客户经理" :visible.sync="dialogVisible" width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">姓名：</div>
          <div class="info_right">
            <el-input v-model='customerManager' placeholder="请输入姓名" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">描述：</div>
          <div class="info_right">
            <el-input v-model='desc' placeholder="请输入描述" size='mini'></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="saveUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getCustomer, editCustomer, delCustomer } from '@/api/customer/index'
  export default {
    data() {
      return {
        defaultActive: '1',
        tableData: [],
        dialogVisible: false,
        search: {
          customerManager: ''
        },
        customerManager: '',
        desc: '',
        id: '',
        currentPage: 1,
        totalRow: 0,
        totalPage: 0,
        passInfo: '',
        status: 1,
        infoRow: {},
        pageSize: 15,
        pageIndex: 1,
        roleBtn: []
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
    },
    watch: {
      'dialogVisible': function(nv, ov) {
        if (!nv) {
          this.customerManager = ''
          this.desc = ''
          this.id = ''
        }
      }
    },
    methods: {
      checkBtn(str) {
        let f = false
        this.roleBtn.forEach(item => {
          if (item.FunctionCode === str) {
            f = true
          }
        })
        return f
      },
      editUser(row) {
        this.customerManager = row.Name
        this.desc = row.Desc
        this.id = row.Id
        this.dialogVisible = true
      },
      deleteUser(row) {
        this.$confirm('确定要删除改客户经理吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCustomer({ id: row.Id }).then(res => {
            this.$message.success('删除成功')
            this.getData()
          })
        })
      },
      saveUser() {
        if (this.customerManager === '') {
          this.$message.error('请输入客户经理姓名')
          return false
        } else {
          editCustomer({
            customerManagerName: this.customerManager,
            desc: this.desc,
            id: this.id === '' ? 0 : this.id
          }).then(res => {
            this.$message.success(this.id === '' ? '新增成功' : '编辑成功')
            this.getData()
            this.dialogVisible = false
          })
        }
      },
      add() {
        this.dialogVisible = true
      },
      // 分页相关
      handleSizeChange(v) {
        this.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.pageIndex = v
        this.getData()
      },
      // 获取数据
      getData() {
        const p = this.search
        p.pageIndex = this.pageIndex
        p.pageSize = this.pageSize
        getCustomer(p).then(res => {
          res.Data.map(v => {
            if (v.Desc === '') {
              v.Desc = '无'
            }
          })
          this.currentPage = res.PageIndex
          this.totalPage = res.TotalPages
          this.totalRow = res.TotalRows
          this.tableData = res.Data
        })
      }
    }
  }
</script>

<style scoped>
  .tag {
    margin-bottom: 10px
  }

  .tag:nth-last-child(1) {
    margin-bottom: 0 !important
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

  .search_title {
    width: 36%;
    margin-right: 10px;
  }

  .el-input-group {
    display: inline-block;
  }

  .timed {
    margin-left: 15px;
    margin-right: 5px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .timePicker {
    width: 380px !important;
  }

  .clearfix {
    clear: both;
    height: 20px;
    width: 100%;
  }

  .add {
    margin-bottom: 10px;
  }

  .searchBox {
    clear: both;
    padding: 10px;
  }

  .time {
    text-align: center;
  }

  .adv {
    padding: 10px;
  }

  .adv th {
    font-weight: 400;
  }

  .adv_img {
    max-width: 200px;
    max-height: 150px;
  }

  .adv td {
    font-size: 13px;
  }

  .adv .status {
    text-align: center;
  }

  .online {
    color: #67c23a;
  }

  .online,
  .offline {
    text-align: center;
  }

  .offline {
    color: #f56c6c;
  }
</style>