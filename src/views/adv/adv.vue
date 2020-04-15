<template>
  <div class="adv content_box">
    <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">上线广告</el-menu-item>
      <el-menu-item index="0">下线广告</el-menu-item>
    </el-menu>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">广告标题：</span>
          <el-input class="search_title" v-model="search.title" size='small' placeholder="请输入广告标题">
          </el-input>
        </el-col>
        <!-- <el-col :span='6'>
          <span class="timed">发布日期：</span>
          <el-date-picker v-model="search.time" class="timePicker search_title" size="small" type="daterange" align="right" unlink-panels
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-col> -->
        <el-col :span='4'>
          <span class="timed">广告平台：</span>
          <el-select v-model="search.plate" class='search_title' size="small" @change='platechange' placeholder="请选择广告平台">
            <el-option v-for="item in options1" :key="item.Id" :label="item.Plateform" :value="item.Id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">广告位置：</span>
          <el-select v-model="search.location" class='search_title' size="small" placeholder="请选择广告位置">
            <el-option v-for="item in options2" :key="item.Id" :label="item.Location" :value="item.Id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-button v-if='checkBtn("func_common_search")' size="small" type="primary" @click="getsearch" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button v-if='checkBtn("func_common_add")' @click='addAdv' class="pan-btn green-btn addbtn" type="primary" size="mini" icon="el-icon-plus">新增广告</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column prop="Plateform" label="平台" align='center'></el-table-column>
      <el-table-column prop="Weight" label="权重" align='center'></el-table-column>
      <el-table-column prop="Location" label="广告位" align='center'></el-table-column>
      <el-table-column prop="Title" label="标题" align='center'></el-table-column>
      <el-table-column prop="DateAdded" label="发布时间" width="200" align='center'>
        <template slot-scope="scope">
          <div class="time">{{scope.row.DateAdded}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align='center'>
        <template slot-scope="scope">
          <el-tag :type='scope.row.Status == 1 ? "success" : "danger" '>{{scope.row.StatusDesc}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align='center'>
        <template slot-scope="scope">
          <el-button v-if='checkBtn("func_common_edit")' @click="editAdv(scope.row)" type="primary" size="small" class="pan-btn blue-btn" icon="el-icon-edit">编辑</el-button>
          <el-button v-if="scope.row.Status == 1 && checkBtn('func_advertising_down')" @click="downAdv(scope.row)" class="pan-btn red-btn" icon="el-icon-download" type="danger"
            size="small">下线</el-button>
          <el-button v-if="scope.row.Status == 0 && checkBtn('func_advertising_down')" @click="downAdv(scope.row)" type="success" class="pan-btn green-btn" icon='el-icon-upload2' size="small">上线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:right;margin-top:10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[15, 50, 100, 200]" :page-size="15" layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow">
    </el-pagination>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  import { getAdvList, disAdv, getAdvPlate, getAdvLocation } from '@/api/adv'
  export default {
    data() {
      return {
        defaultActive: '1',
        tableData: [],
        options1: [],
        options2: [],
        search: {
          title: '',
          location: '',
          plate: ''
        },
        currentPage: 1,
        totalRow: 0,
        roleBtn: [],
        totalPage: 0,
        status: 1,
        pageSize: 15,
        pageIndex: 1
      }
    },
    created() {
      this.getPlate()
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
    },
    activated() {
      this.getData()
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
      getsearch() {
        this.pageSize = 15
        this.pageIndex = 1
        this.getData()
      },
      // 新增广告
      addAdv() {
        this.$router.push({
          path: '/addAdv',
          query: {
            id: -1
          }
        })
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
      platechange(val) {
        this.getLocation(val)
      },
      // 标签选择
      handleSelect(v) {
        this.status = v
        this.getData()
      },
      // 编辑广告
      editAdv(row) {
        this.$router.push({
          path: '/addAdv',
          query: {
            id: row.Id
          }
        })
      },
      // 上下架广告
      downAdv(row) {
        const status = parseInt(row.Status) === 1 ? 0 : 1
        disAdv({
          id: row.Id,
          status: status
        }).then(res => {
          this.$message.success('操作成功')
          this.pageIndex = 1
          this.pageSize = 15
          this.getData()
        })
      },
      //  获取数据
      getData() {
        const s = {}
        s.title = this.search.title
        s.plateformId = this.search.plate
        s.locationId = this.search.location
        s.status = this.status
        s.pageSize = this.pageSize
        s.pageIndex = this.pageIndex
        getAdvList(s).then(res => {
          this.currentPage = res.PageIndex
          this.totalPage = res.TotalPages
          this.totalRow = res.TotalRows
          this.tableData = res.Data
        })
      },
      // 获取广告位置
      getLocation(val) {
        this.search.location = ''
        this.options2 = []
        getAdvLocation({ plateformId: val }).then(res => {
          this.options2 = res
        })
      },
      // 获取广告平台
      getPlate() {
        getAdvPlate().then(res => {
          this.options1 = res
        })
      }
    }
  }
</script>

<style>
</style>