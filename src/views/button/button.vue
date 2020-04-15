<template>
  <div class="content_box">
    <m-title title='云仓快报管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">按钮名称：</span>
          <el-input v-model='name' clearable class="search_title" size='small' placeholder="请输入按钮名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click='getData()' class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button type="info" @click='addBtn()' class="search_btn pan-btn green-btn" icon="el-icon-plus">新增按钮</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='名称' prop='FunctionName' align='center'></el-table-column>
      <el-table-column label='编码' prop='FunctionCode' align='center'></el-table-column>
      <el-table-column label='备注' prop='Remark' align='center'></el-table-column>
      <el-table-column label='操作' align='center' width='220'>
        <template slot-scope="scope">
          <el-button class="pan-btn blue-btn" @click='editBtn(scope.row)' type="success" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button class="pan-btn red-btn" @click='delBtn(scope.row)' type="primary" size="mini" icon="el-icon-close">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="TotalRows">
      </el-pagination>
    </div>
    <el-dialog title="按钮管理" :visible.sync="dialogFormVisible" width='500px'>
      <el-form :model="addObj">
        <el-form-item label="按钮名称" :label-width="formLabelWidth" required>
          <el-input v-model="addObj.name" placeholder='请输入按钮名称'></el-input>
        </el-form-item>
        <el-form-item label="按钮编码" :label-width="formLabelWidth" required>
          <el-input :disabled='addId != null' v-model="addObj.functionCode" placeholder='请输入按钮编码'></el-input>
        </el-form-item>
        <el-form-item label="按钮备注" :label-width="formLabelWidth" required>
          <el-input :disabled='addId != null' v-model="addObj.remark" placeholder='请输入按钮备注'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getBtnList, delBtn, addBtn, editBtn } from '@/api/button/button'
  export default {
    components: { MTitle },
    data() {
      return {
        list: [],
        name: '',
        formLabelWidth: '120px',
        dialogFormVisible: false,
        pageSize: 15,
        addId: null,
        addObj: {
          name: '',
          functionCode: '',
          remark: ''
        },
        pageIndex: 1,
        TotalRows: 0
      }
    },
    activated() {
    },
    created() {
      this.getData()
    },
    methods: {
      editBtn(row) {
        this.addObj.name = row.FunctionName
        this.addObj.functionCode = row.FunctionCode
        this.addObj.remark = row.Remark
        this.addId = row.FunctionId
        this.dialogFormVisible = true
      },
      add() {
        if (this.addObj.name === '') {
          this.$message.error('请输入按钮名称')
          return
        } else if (this.addObj.functionCode === '') {
          this.$message.error('请输入按钮编码')
          return
        } else if (this.addObj.remark === '') {
          this.$message.error('请输入按钮备注')
          return
        } else {
          if (this.addId) {
            editBtn({
              functionId: this.addId,
              name: this.addObj.name
            }).then(res => {
              this.$message.success('编辑成功！')
              this.dialogFormVisible = false
              this.pageIndex = 1
              this.pageSize = 15
              this.addObj = {
                name: '',
                functionCode: '',
                remark: ''
              }
              this.addId = null
              this.getData()
            })
          } else {
            addBtn(this.addObj).then(res => {
              this.$message.success('新增成功！')
              this.dialogFormVisible = false
              this.pageIndex = 1
              this.pageSize = 15
              this.addObj = {
                name: '',
                functionCode: '',
                remark: ''
              }
              this.addId = null
              this.getData()
            })
          }
        }
      },
      addBtn() {
        this.addObj.name = ''
        this.addObj.functionCode = ''
        this.addObj.remark = ''
        this.addId = null
        this.dialogFormVisible = true
      },
      delBtn(row) {
        this.$confirm('此操作将永久删除该按钮, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBtn({
            functionId: row.FunctionId
          }).then(() => {
            this.$message.success('删除成功！')
            this.pageIndex = 1
            this.pageSize = 15
            this.getData()
          })
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
      getData() {
        getBtnList({
          name: this.name,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        }).then(res => {
          this.list = res.Data
          this.TotalRows = res.TotalRows
        })
      }
    }
  }
</script>
<style scoped>
  .addbtn {
    margin-top: 15px;
    margin-bottom: 15px;
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

  .align_left {
    text-align: left;
  }

  .goods_con {
    display: flex;
    box-sizing: border-box;
    align-items: center;
  }

  .goods_con img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
</style>