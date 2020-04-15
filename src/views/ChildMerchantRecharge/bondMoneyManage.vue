<template>
  <div class="searchBox" style="padding-top:25px;">
    <el-row style="margin-bottom:20px;">
      <el-col :span="4">
        <span class="timed">合作者：</span>
        <el-select filterable clearable @change='seletechange' v-model="partnerId" class="search_title" size="small" placeholder="请选择合作者" >
          <el-option v-for='item in rlist' :label="item.Description" :value="item.PartnerId" :key='item.Id'></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-button style="margin-left:20px;" type="primary" @click="add">新增设置</el-button>
      </el-col>
    </el-row>
    <div style="padding:15px">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column label="序号" type="index" width="50"  align='center'></el-table-column>
          <el-table-column label='合作者' prop='Name' align='center'></el-table-column>
          <el-table-column label='是否缴纳保证金' prop='IsPayBond' align='center'>
            <template slot-scope='scope'>
              <el-tag v-if="scope.row.IsPayBond == true" type="success">是</el-tag>
              <el-tag v-if="scope.row.IsPayBond == false" type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='保证金' prop='BondMoney' align='center'></el-table-column>
          <el-table-column label='状态' prop='Status' align='center'>
            <template slot-scope='scope'>
              <el-tag v-if="scope.row.Status == 2" type="success">已缴纳</el-tag>
              <el-tag v-if="scope.row.Status == 1" type="warning">未缴纳</el-tag>
              <el-tag v-if="scope.row.Status == 3">无须缴纳</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='操作' prop='UserName' align='center'>
            <template slot-scope="scope">
              <el-button v-if='scope.row.Status == 1 || scope.row.Status == 3' type="primary" size='mini' @click="edit(scope.row)">编辑设置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
            :page-sizes="[15,30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="TotalRows">
          </el-pagination>
        </div>
    </div>
    <el-dialog title="新增设置" :visible.sync="dialogFormVisible" :close-on-click-modal='false' @close='add_esc'>
      <el-row>
      <el-col :span="8">
        <span class="timed" style="flex:0 0 150px">合作者：</span>
        <el-select v-if='!is_edit' filterable clearable v-model="add_partnerId" class="search_title" size="small" placeholder="请选择合作者" >
          <el-option v-for='(item,index) in newList' :label="item.Description" :value="item.PartnerId" :key='index'></el-option>
        </el-select>
        <el-input v-else :value="edit_name" size="small" disabled></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <span class="timed" style="flex:0 0 150px">是否缴纳保证金：</span>
          <el-radio style="margin-top:10px;" size="mini" v-model="add_IsPayBond" label="true">是</el-radio>
          <el-radio style="margin-top:10px;" size='mini' v-model="add_IsPayBond" label="false">否</el-radio>
      </el-col>
    </el-row>
     <el-row v-if='add_IsPayBond == "true"'>
      <el-col :span="8">
        <span class="timed" style="flex:0 0 150px">保证金金额：</span>
        <el-input @change="setPrice" v-model="add_bondMoney" size="small" placeholder="请输入保证金金额"></el-input>
      </el-col>
    </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_esc">取 消</el-button>
        <el-button type="primary" @click="add_bond">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBondMoneyList, getAddBondMoneyList, addBondMoney, editBondMoney } from '@/api/ChildMerchantRecharge/bondMoneyManage.js'
import { getRetailTraderList } from '@/api/retailTraderSkuManage/retailTraderSkuManage.js'
export default {
  data() {
    return {
      list: [],
      add_bondMoney: '',
      edit_id: '',
      partnerId: '',
      edit_name: '',
      add_partnerId: '',
      add_IsPayBond: 'true',
      dialogFormVisible: false,
      is_edit: false,
      pageIndex: 1,
      rlist: [],
      pageSize: 15,
      newList: [],
      TotalRows: 0
    }
  },
  created() {
    this.getRetailTraderList()
    this.getAddBondMoneyList()
    this.getData()
  },
  methods: {
    setPrice() {
      this.add_bondMoney = this.add_bondMoney.match(/\d+(\.\d{0,2})?/)
        ? this.add_bondMoney.match(/\d+(\.\d{0,2})?/)[0] : ''
    },
    add_bond() {
      if (this.add_partnerId === '') {
        this.$message.error('请选择合作者')
        return
      } else if (this.add_IsPayBond === 'true' && this.add_bondMoney === '') {
        this.$message.error('请输入保证金')
        return
      } else if (this.add_bondMoney > 99999) {
        this.$message.error('保证金金额不可大于99999，请从新输入')
        this.add_bondMoney = 0
        return
      } else if (!this.is_edit) {
        addBondMoney({
          isPayBond: this.add_IsPayBond === 'true' ? 1 : 0,
          bondMoney: this.add_bondMoney,
          partnerId: this.add_partnerId
        }).then(res => {
          this.$message.success('新增成功')
          this.init_add()
          this.dialogFormVisible = false
          this.pageIndex = 1
          this.getData()
        })
      } else {
        editBondMoney({
          isPayBond: this.add_IsPayBond === 'true' ? 1 : 0,
          bondMoney: this.add_bondMoney,
          partnerId: this.add_partnerId,
          id: this.edit_id
        }).then(res => {
          this.$message.success('编辑成功')
          this.init_add()
          this.dialogFormVisible = false
          this.pageIndex = 1
          this.getData()
        })
      }
    },
    add_esc() {
      this.dialogFormVisible = false
      this.init_add()
    },
    init_add() {
      this.add_bondMoney = 0
      this.add_partnerId = ''
      this.is_edit = false
      this.isPayBond = 'true'
      this.add_IsPayBond = 'true'
      this.edit_id = ''
      this.edit_name = ''
    },
    edit(row) {
      this.edit_id = row.Id
      this.edit_name = row.Name
      this.add_partnerId = row.PartnerId
      this.add_IsPayBond = row.IsPayBond.toString()
      this.add_bondMoney = row.BondMoney
      this.is_edit = true
      this.dialogFormVisible = true
    },
    add() {
      this.dialogFormVisible = true
    },
    getData() {
      getBondMoneyList({
        partnerId: this.partnerId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.TotalRows = res.TotalRows
        this.list = res.Data
      })
    },
    getAddBondMoneyList() {
      getAddBondMoneyList().then(res => {
        this.newList = res
      })
    },
    getRetailTraderList() {
      getRetailTraderList({
        pageIndex: 1,
        pageSize: 999999,
        supplyType: -1
      }).then(res => {
        this.rlist = res.Data
      })
    },
    seletechange() {
      this.getData()
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.getData()
    },
    handleCurrentChange(v) {
      this.pageIndex = v
      this.getData()
    }
  }
}
</script>

<style>

</style>
