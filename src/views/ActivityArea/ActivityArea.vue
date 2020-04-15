<template>
    <div class="adv content_box">
    <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">上线活动</el-menu-item>
      <el-menu-item index="0">下线活动</el-menu-item>
    </el-menu>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">活动标题：</span>
          <el-input class="search_title" v-model="name" size='small' placeholder="请输入活动标题">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button size="small" type="primary" @click="getSearch" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button class="pan-btn green-btn addbtn" type="primary" @click="add" size="mini" icon="el-icon-plus">新增活动</el-button>
        </el-col>
      </el-row>
    </div>
        <el-table border :data="tableData">
      <el-table-column prop="Name" label="活动标题" align='center'></el-table-column>
      <el-table-column label="状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tag :type='scope.row.Status == 1 ? "success" : "danger" '>{{scope.row.StatusDesc}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row)" size="small" class="pan-btn blue-btn" icon="el-icon-edit">编辑</el-button>
          <el-button v-if="scope.row.Status == 1" @click="downAdv(scope.row)" class="pan-btn red-btn" icon="el-icon-download" type="danger"
            size="small">下线</el-button>
          <el-button v-if="scope.row.Status == 0" @click="downAdv(scope.row)" type="success" class="pan-btn green-btn" icon='el-icon-upload2' size="small">上线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:right;margin-top:10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :page-sizes="[15, 50, 100, 200]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
    </div>
</template>

<script>
import { getActivityAreaList, setActivityArea } from '@/api/ActivityArea/ActivityArea'
export default {
  data() {
    return {
      defaultActive: '1',
      name: '',
      status: '1',
      tableData: [],
      totalRow: 0,
      pageSize: 15,
      pageIndex: 1
    }
  },
  created() {
    this.getData()
  },
  activated() {
    this.getData()
  },
  methods: {
    add() {
      this.$router.push('/addActivityArea')
    },
    edit(row) {
      this.$router.push({
        path: '/addActivityArea',
        query: {
          id: row.Id
        }
      })
    },
    downAdv(row) {
      setActivityArea({
        id: row.Id,
        Status: row.Status == 1 ? 0 : 1
      }).then(res => {
        this.$message.success('操作成功')
        this.pageIndex = 1
        this.getData()
      })
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.getData()
    },
    handleCurrentChange(v) {
      this.pageIndex = v
      this.getData()
    },
    handleSelect(v) {
      this.defaultActive = v
      this.status = v
      this.getData()
    },
    getSearch() {
      this.pageIndex = 1
      this.getData()
    },
    getData() {
      getActivityAreaList({
        name: this.name,
        status: this.status,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }).then(res => {
        this.tableData = res.Data
        this.totalRow = res.TotalRows
      })
    }
  }
}
</script>

<style>

</style>
