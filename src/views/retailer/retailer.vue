<template>
  <div class="content_box">
    <m-title title='商户管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">帐号名称：</span>
          <el-input v-model='search.accountName' class="search_title" size='mini' clearable placeholder="请输入帐号名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户名称：</span>
          <el-input v-model='search.company' class="search_title" size='mini' clearable placeholder="请输入商户名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">绑定手机：</span>
          <el-input v-model='search.phone' class="search_title" size='mini' clearable placeholder="请输入绑定手机">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">帐号编码：</span>
          <el-input v-model='search.number' class="search_title" size='mini' clearable placeholder="请输入帐号编码">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='4'>
          <span class="timed">注册来源：</span>
          <el-select class="search_title" v-model='search.partnerId' size='mini' clearable placeholder="请选择注册来源">
            <el-option v-for="item in formList" :key="item.PartnerId" :label="item.Description" :value="item.PartnerId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">商户级别：</span>
          <el-select class="search_title" v-model='search.levelId' size='mini' clearable placeholder="请选择商户级别">
            <el-option v-for="item in levelList" :key="item.Id" :label="item.Name" :value="item.Id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='6'>
          <span class="timed">注册时间：</span>
          <el-date-picker value-format='yyyy-MM-dd' v-model='search.dateRange1' class="search_time" size='mini' clearable type="daterange" align="right"
            unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span='4'>
          <el-button v-if='checkBtn("func_common_search")' class="search_btn pan-btn green-btn" @click='getData' type="success" size='mini'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list_box">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column label='帐号编码' prop='UserAdded' align='center' width='100'></el-table-column>
        <el-table-column label='帐号名称' prop='UserName' align='center'></el-table-column>
        <el-table-column label='商户名称' align='center'>
          <template slot-scope="scope">
            <template v-if='scope.row.edit'>
              <el-input class="edit-input" size="mini" v-model="scope.row.Company"></el-input>
            </template>
            <span v-else>{{ scope.row.Company }}</span>
          </template>
        </el-table-column>
        <el-table-column label='商户级别' prop='Summary' align='center' width='150'>
          <template slot-scope="scope">
            <template v-if='scope.row.edit'>
              <el-select v-if='scope.row.LevelId !== 0 && scope.row.LevelId !== null && scope.row.LevelId !== NaN' class="search_title"
                v-model='scope.row.LevelId' size="small" placeholder="请选择商户级别">
                <el-option v-for="item in levelList" :key="item.Id" :label="item.Name" :value="item.Id">
                </el-option>
              </el-select>
              <span v-else>未认证商户
                <br/>无法修改级别</span>
            </template>
            <span v-else>{{ scope.row.Summary }}</span>
          </template>
        </el-table-column>
        <el-table-column label='绑定手机' prop='Phone' align='center' width='150'></el-table-column>
        <el-table-column label='注册时间' prop='DateAdded' align='center' width='180'></el-table-column>
        <el-table-column label='合作者' prop='Parter' align='center' width='180'></el-table-column>
        <el-table-column label='注册渠道' prop='ParterDesc' align='center'></el-table-column>
        <el-table-column label='是否认证' prop='AuthStatusDesc' align='center' width='100'></el-table-column>
        <el-table-column label='账户状态' align='center' width='100'>
          <template slot-scope='scope'>
            <el-tag :type='getTag(scope.row.Status)'>{{scope.row.StatusDesc}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label='操作' align='center' width='200'>
          <template slot-scope="scope">
            <el-button class="pan-btn green-btn" v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="mini" icon="el-icon-circle-check-outline">提交</el-button>
            <el-button class="pan-btn blue-btn" v-if='!scope.row.edit && checkBtn("func_common_edit")' type="primary" @click='hideOtherRow(scope.row)' size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button class="pan-btn blue-btn" type="primary" @click='getDesc(scope.row)' size="mini" icon="el-icon-search">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRow">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getList, editUser } from '@/api/retailer'
  import { PKoptions } from '@/assets/pickerOptions'
  export default {
    components: { MTitle },
    data() {
      return {
        list: [],
        pageSize: 15,
        totalRow: 0,
        pageIndex: 1,
        formList: [],
        levelList: [],
        pickerOptions: PKoptions,
        roleBtn: [],
        search: {
          accountName: '',
          company: '',
          phone: '',
          number: '',
          partnerId: '',
          levelId: '',
          dateRange1: ''
        }
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
    },
    methods: {
      getDesc(row) {
        this.$router.push({
          path: '/retailerDesc',
          query: {
            id: row.UserId
          }
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
      hideOtherRow(row) {
        this.list = this.list.map(v => {
          if (v.Id !== row.Id) {
            this.$set(v, 'edit', false)
          } else {
            this.$set(v, 'edit', true)
          }
          return v
        })
      },
      getTag(code) {
        code = parseInt(code)
        if (code === 1) {
          return 'danger'
        } else if (code === 2) {
          return 'warning'
        } else if (code === 3) {
          return 'success'
        } else {
          return ''
        }
      },
      // 提交修改
      confirmEdit(row) {
        editUser({
          id: row.Id,
          company: row.Company,
          levelId: row.LevelId
        }).then(res => {
          row.edit = false
          this.$message.success('修改成功！')
          this.getData()
        })
      },
      getData() {
        const p = Object.assign(this.search, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        if (p.dateRange1 && p.dateRange1.length === 2 && p.dateRange1[1].indexOf('23:59:59') === -1) {
          p.dateRange1[1] = p.dateRange1[1] + ' 23:59:59'
        }
        getList(p).then(res => {
          this.formList = res.ParterList
          this.levelList = res.RetailerLevelList
          this.list = res.RetailerList.Data.map(v => {
            this.$set(v, 'edit', false)
            v.LevelId !== '' ? v.LevelId = parseInt(v.LevelId) : v.LevelId = 0
            return v
          })
          this.totalRow = res.RetailerList.TotalRows
          this.pageIndex = res.RetailerList.PageIndex
        })
      }
    }
  }
</script>
<style scoped>
  .edit-input {
    flex: 0 0 150px
  }

  .flex {
    display: flex;
    justify-content: space-between
  }

  .flex_right {
    flex: 1;
  }

  .flex_right .cancelBtn {
    margin-right: 0 !important;
  }
</style>