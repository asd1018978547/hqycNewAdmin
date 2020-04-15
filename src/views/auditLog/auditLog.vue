<template>
  <div class="adv content_box">
    <m-title title='操作日志管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">操作模块：</span>
          <el-select v-model="search.moduleCode" clearable class='search_title' size="small" @change='platechange' placeholder="请选择操作模块">
            <el-option v-for="item in plateList" :key="item.Id" :label="item.Module" :value="item.ModuleCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">操作菜单：</span>
          <el-select v-model="search.menuCode" clearable class='search_title' size="small" placeholder="请先选择操作模块">
            <el-option v-for="item in plateInfo" :key="item.Id" :label="item.MenuName" :value="item.MenuCode">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">操作类型：</span>
          <el-select v-model="search.operationType" clearable class='search_title' size="small" placeholder="请选择操作类型">
            <el-option label="所有" value="-1"></el-option>
            <el-option label="新增" value="0"></el-option>
            <el-option label="编辑" value="1"></el-option>
            <el-option label="删除" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <span class="timed">操作ID：</span>
          <el-input v-model='search.resourceId' clearable class="search_title" size='small' placeholder="请输入操作ID">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">操作人：</span>
          <el-input v-model='search.userName' clearable class="search_title" size='small' placeholder="请输入操作人">
          </el-input>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span='4'>
              <span class="timed">操作人姓名：</span>
              <el-input v-model='search.UserRealName' clearable class="search_title" size='small' placeholder="请输入操作姓名">
              </el-input>
            </el-col>
        <el-col :span='6'>
          <span class="timed">操作时间：</span>
          <el-date-picker value-format='yyyy-MM-dd' v-model='time' class="search_time" size="small" type="daterange"
            align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span='4'>
          <el-button @click='getSearch' size="small" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column prop="ResourceId" label="操作ID" align='center'></el-table-column>
      <el-table-column prop="UserName" label="操作人" align='center'></el-table-column>
      <el-table-column prop="UserRealName" label="操作人姓名" align='center'></el-table-column>
      <el-table-column prop="ApiCodeDesc" label="操作类型" align='center'>
        <template slot-scope="scope">
          <el-tag type="success" v-if='scope.row.ApiCodeDesc == "新增" || scope.row.ApiCodeDesc == "添加"'>{{
            scope.row.ApiCodeDesc }}</el-tag>
          <el-tag type="warning" v-else-if='scope.row.ApiCodeDesc == "新增/编辑" || scope.row.ApiCodeDesc == "添加/编辑"'>{{
            scope.row.ApiCodeDesc }}</el-tag>
          <el-tag type="danger" v-else-if='scope.row.ApiCodeDesc == "删除"'>{{ scope.row.ApiCodeDesc }}</el-tag>
          <el-tag v-else-if='scope.row.ApiCodeDesc == "更新"'>{{ scope.row.ApiCodeDesc }}</el-tag>
          <el-tag type="info" v-else>{{ scope.row.ApiCodeDesc }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="MenuName" label="操作模块" align='center'></el-table-column>
      <el-table-column prop="ModuleName" label="操作菜单" align='center'></el-table-column>
      <el-table-column prop="StartDate" label="操作时间" align='center'></el-table-column>
      <el-table-column label="操作" width="250" align='center'>
        <template slot-scope="scope">
          <el-button @click='jumpDesc(scope.row)' type="primary" size="small" class="pan-btn blue-btn" icon="el-icon-search">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search.pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="search.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { PKoptions } from '@/assets/pickerOptions'
  import { getAuditLog, getAuditPlate, getAuditPlateInfo } from '@/api/auditLog/auditLog'
  export default {
    components: { MTitle },
    created() {
      this.getPlate()
      this.getList()
    },
    methods: {
      jumpDesc(row) {
        this.$router.push({
          path: '/auditInfo',
          query: {
            id: row.Id
          }
        })
      },
      getSearch() {
        this.search.pageIndex = 1
        this.getList()
      },
      handleCurrentChange(v) {
        this.search.pageIndex = v
        this.getList()
      },
      handleSizeChange(v) {
        this.search.pageSize = v
        this.getList()
      },
      platechange(data) {
        if (data !== '') {
          this.getPlateInfo(data)
        }
      },
      getList() {
        getAuditLog(Object.assign(this.search, {
          startDate: this.time !== null ? this.getTime(this.time[0]) : this.getDay(-7),
          endDate: this.time !== null ? this.getTime(this.time[1]) + ' 23:59:59' : this.getDay(0) + ' 23:59:59'
        })).then(res => {
          this.TotalRows = res.TotalRows
          this.tableData = res.Data
        })
      },
      getPlate() {
        getAuditPlate().then(res => {
          this.plateList = res
        })
      },
      getPlateInfo(id) {
        getAuditPlateInfo({
          moduleCode: id
        }).then(res => {
          this.plateInfo = res
        })
      },
      getDay(day) {
        const today = new Date()
        const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday_milliseconds)
        const tYear = today.getFullYear()
        let tMonth = today.getMonth()
        let tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      getTime(time) {
        const today = new Date(time)
        const targetday_milliseconds = today.getTime()
        today.setTime(targetday_milliseconds)
        const tYear = today.getFullYear()
        let tMonth = today.getMonth()
        let tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      doHandleMonth(month) {
        var m = month
        if (month.toString().length === 1) {
          m = '0' + month
        }
        return m
      }
    },
    data() {
      return {
        time: null,
        TotalRows: 0,
        plateList: [],
        plateInfo: [],
        tableData: [],
        search: {
          moduleCode: null,
          menuCode: null,
          pageIndex: 1,
          pageSize: 15,
          UserRealName: '',
          operationType: '-1',
          resourceId: null,
          userName: null
        },
        pickerOptions: PKoptions
      }
    }
  }
</script>