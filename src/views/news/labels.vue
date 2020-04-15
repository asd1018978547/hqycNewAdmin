<template>
  <div class="content_box">
    <m-title title='云仓快报标签管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">标签名称：</span>
          <el-input v-model='name' clearable class="search_title" size='small' placeholder="请输入标签名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button v-if='checkBtn("func_common_search")' type="primary" @click='getLabelList()' class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button v-if='checkBtn("func_common_add")' type="info" @click='addNews' class="search_btn pan-btn green-btn" icon="el-icon-plus">新增标签</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="labelList" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" label='序号' width="50" align='center'></el-table-column>
      <el-table-column label='名称' prop='Name' align='center'></el-table-column>
      <el-table-column label='权重' prop='Weight' align='center'></el-table-column>
      <el-table-column label='创建时间' prop='DateAdded' align='center'></el-table-column>
      <el-table-column label='操作' align='center' width='220'>
        <template slot-scope="scope">
          <el-button v-if='checkBtn("func_common_edit")' class="pan-btn blue-btn" type="success" @click="jumpDesc(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button v-if='checkBtn("func_common_delete")' class="pan-btn red-btn" type="primary" @click='delNews(scope.row)' size="mini" icon="el-icon-close">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="标签管理" :visible.sync="dialogFormVisible" width='500px'>
      <el-form :model="add">
        <el-form-item label="标签名称" :label-width="formLabelWidth" >
          <el-input v-model="add.name" placeholder='请输入标签名称'></el-input>
        </el-form-item>
        <el-form-item label="标签权重" :label-width="formLabelWidth">
          <el-input v-model="add.weight" @keyup.native='checkIsInt1'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTag">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getLabelList, delTag, addTag } from '@/api/news/news.js'
  export default {
    components: { MTitle },
    data() {
      return {
        name: '',
        add: {
          id: -1,
          name: '',
          weight: 0
        },
        formLabelWidth: '80px',
        roleBtn: [],
        dialogFormVisible: false,
        labelList: []
      }
    },
    watch: {
      dialogFormVisible: function(val) {
        if (!val) {
          this.add = {
            id: -1,
            name: '',
            weight: 0
          }
        }
      }
    },
    activated() {
      this.getLabelList()
    },
    created() {
      this.getLabelList()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
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
      jumpDesc(row) {
        this.add.id = row.Id
        this.add.name = row.Name
        this.add.weight = row.Weight
        this.dialogFormVisible = true
      },
      checkIsInt1() {
        this.add.weight = this.add.weight.replace(/[^\.\d]/g, '0')
        this.add.weight = this.add.weight.replace('.', '')
        this.add.weight = parseInt(this.add.weight).toString() === 'NaN' ? 0 : parseInt(this.add.weight).toString()
      },
      addTag() {
        if (this.add.name === '') {
          this.$message.error('请输入标签名称')
          return
        } else if (parseInt(this.add.weight) < 0 || parseInt(this.add.weight) > 9999) {
          this.$message.error('权重为0到9999之间的正整数')
          return
        } else {
          addTag({
            id: this.add.id === -1 ? 0 : this.add.id,
            name: this.add.name,
            weight: this.add.weight
          }).then(res => {
            this.$message.success('新增成功')
            this.getLabelList()
            this.dialogFormVisible = false
          })
        }
      },
      delNews(row) {
        this.$confirm('确定删除这个标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTag({ id: row.Id }).then(res => {
            this.$message.success('删除成功')
            this.getLabelList()
          })
        })
      },
      addNews(row) {
        this.add.id = row.Id
        this.dialogFormVisible = true
      },
      getLabelList() {
        getLabelList({
          name: this.name
        }).then(res => {
          this.labelList = res
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