<template>
  <div class="content_box user">
    <m-title title='用户管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">用户名称：</span>
          <el-input class="search_title" v-model="search.UserName" size='small' placeholder="请输入用户名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">用户姓名：</span>
          <el-input class="search_title" v-model="search.Real" size='small' placeholder="请输入用户姓名">
          </el-input>
        </el-col>
        <el-col :span='4'>
            <span class="timed">状态：</span>
            <el-select v-model="search.status" placeholder="请选择">
                <el-option label="正常" value="1"></el-option>
                <el-option label="停用" value="0"></el-option>
              </el-select>
          </el-col>
        <el-col :span='4'>
          <el-button size="small" type="primary" @click="searchBtn" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button @click='showmodel(1)' class="pan-btn green-btn" type="primary" size="mini" icon="el-icon-plus">新增用户</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='ID' prop='UserId' align='center' width='100'></el-table-column>
      <el-table-column label='用户名称' prop='UserName' align='center'></el-table-column>
      <el-table-column label='用户姓名' prop='Real' align='center'></el-table-column>
      <el-table-column label='联系电话' prop='Phone' align='center'></el-table-column>
      <el-table-column label='邮箱' prop='Email' align='center'></el-table-column>
      <el-table-column label='状态' align='center' width='100'>
        <template slot-scope="scope">
          <el-tag type='success' v-if='scope.row.SubRoles[0].Status == 1'>正常</el-tag>
          <el-tag type='warning' v-if='scope.row.SubRoles[0].Status == 0'>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作' align='center' width='300'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.SubRoles[0].Status == 1' class="pan-btn red-btn" @click='lockUser(scope.row)' type="warning" size="mini" icon="el-icon-edit">停用</el-button>
          <el-button v-if='scope.row.SubRoles[0].Status == 0' class="pan-btn red-btn" @click='lockUser(scope.row)' type="success" size="mini" icon="el-icon-edit">启用</el-button>
          <el-button class="pan-btn blue-btn" @click='showmodel(scope.row)' type="success" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button class="pan-btn blue-btn" @click='editPwd(scope.row)' type="success" size="mini" icon="el-icon-edit">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:right;margin-top:10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :page-sizes="[5,15, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRow">
    </el-pagination>
    <el-dialog :close-on-click-modal='1 == 0' v-if="pwdVisible" title="修改密码" :visible.sync="pwdVisible" width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">
            <span>*</span>用户密码：</div>
          <div class="info_right">
            <el-input v-model='pwd' type='password' placeholder="请输入用户密码" size='mini'></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="pwdVisible = false">取 消</el-button>
        <el-button size='mini' @click='subEditPwd' type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal='1 == 0' v-if="dialogVisible" :title="dialogTitle" :visible.sync="dialogVisible" width='50%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">
            <span>*</span>用户名称：</div>
          <div class="info_right">
            <el-input :disabled='isedit' v-model='info.UserName' placeholder="请输入用户名称" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">
            <span>*</span>用户密码：</div>
          <div class="info_right">
            <el-input :disabled='isedit' v-model='info.Pwd' type='password' placeholder="请输入用户密码" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">
            <span>*</span>用户姓名：</div>
          <div class="info_right">
            <el-input v-model='info.Real' placeholder="请输入用户姓名" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">联系电话：</div>
          <div class="info_right">
            <el-input v-model='info.Phone' placeholder="请输入联系电话" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">邮箱：</div>
          <div class="info_right">
            <el-input v-model='info.Email' placeholder="请输入邮箱" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item" style="height:auto;">
          <div class="info_title">
            <span>*</span>用户角色：</div>
          <div class="info_right flex1">
            <el-checkbox-group v-model="info.GroupIds" size='mini' class="checkG">
              <el-checkbox v-for='item in roleList' :key='item.Id' :label="item.Id" border>{{ item.Role }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogVisible = false">取 消</el-button>
        <el-button size='mini' @click='submit' type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  // getUserRoleList
  import { getRoleList, getUserRoleList, addUserRole, editUserInfo, getUserInfo, changePwd, lockUser } from '@/api/role'
  import { validatePhone, validateChinese, validateEmail } from '@/utils/validate.js'
  export default {
    components: { MTitle },
    data() {
      return {
        list: [],
        dialogTitle: '新增用户',
        dialogVisible: false,
        isedit: false,
        pwdVisible: false,
        totalRow: 0,
        roleList: [],
        pwd: '',
        pwdId: '',
        search: {
          UserName: '',
          Real: '',
          status: '1'
        },
        pageIndex: 1,
        pageSize: 15,
        info: {
          UserName: '',
          Pwd: '',
          Real: '',
          Phone: '',
          Email: '',
          GroupIds: []
        },
        baseInfo: {}
      }
    },
    activated() {
      this.getData()
      this.getRole()
    },
    created() {
      this.baseInfo = JSON.parse(JSON.stringify(this.info))
      this.getData()
      this.getRole()
    },
    methods: {
      lockUser(row) {
        // lockUser
        this.$confirm('确定要' + (row.SubRoles[0].Status === 1 ? '停用' : '启用') + '这个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          lockUser({
            userId: row.UserId,
            status: row.SubRoles[0].Status === 1 ? 0 : 1
          }).then(() => {
            this.$message.success(row.SubRoles[0].Status === 1 ? '停用' : '启用' + '成功！')
            this.pageIndex = 1
            this.getData()
          })
        })
      },
      editPwd(row) {
        this.pwdId = row.UserId
        this.pwdVisible = true
      },
      subEditPwd() {
        if (this.pwd === '' || this.pwd.length < 6) {
          this.$message.error('请输入正确的密码')
          return
        } else {
          const _this = this
          import('@/utils/md5').then(md5 => {
            changePwd({
              userId: _this.pwdId,
              pwd: md5(_this.pwd)
            }).then(res => {
              _this.$message.success('修改成功')
              _this.pwdVisible = false
            })
          })
        }
      },
      searchBtn() {
        this.pageIndex = 1
        this.getData()
      },
      submit() {
        if (this.info.UserName === '') {
          this.$message.error('请输入用户名称')
          return
        } else if (this.info.Pwd === '') {
          this.$message.error('请输入密码')
          return
        } else if (this.info.Real === '') {
          this.$message.error('请输入用户姓名')
          return
        } else if (this.info.GroupIds.length === 0) {
          this.$message.error('请选择用户角色')
          return
        } else if (this.info.Phone !== '' && !validatePhone(this.info.Phone)) {
          this.$message.error('请输入正确的电话号码')
          return
        } else if (this.info.Email !== '' && !validateEmail(this.info.Email)) {
          this.$message.error('请输入正确的邮箱')
          return
        } else if (!validateChinese(this.info.Real)) {
          this.$message.error('请输入正确的用户姓名')
          return
        }
        const p = this.info
        p.GroupIds = p.GroupIds.join(',')
        import('@/utils/md5').then(md5 => {
          p.Pwd = md5(p.Pwd)
          if (!this.isedit) {
            addUserRole(this.info).then(res => {
              this.$message.success('添加成功')
              this.dialogVisible = false
              this.getData()
            })
          } else {
            editUserInfo(this.info).then(res => {
              this.$message.success('编辑成功')
              this.dialogVisible = false
              this.getData()
            })
          }
        })
      },
      getUserInfo(id, cb) {
        getUserInfo({
          userId: id
        }).then(res => {
          cb(res)
        })
      },
      showmodel(data) {
        if (typeof data === 'object') {
          // 编辑
          this.getUserInfo(data.UserId, (res) => {
            this.info = Object.assign(this.info, res)
            this.info.GroupIds = this.info.SubRoles.map(v => {
              return v.RoleId
            })
            this.dialogTitle = '编辑用户'
            this.isedit = true
          })
        } else {
          this.info = JSON.parse(JSON.stringify(this.baseInfo))
          this.dialogTitle = '新增用户'
          this.isedit = false
        }
        this.dialogVisible = true
      },
      handleSizeChange(v) {
        this.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.pageIndex = v
        this.getData()
      },
      getRole() {
        getUserRoleList().then(res => {
          this.roleList = res
        })
      },
      getData() {
        const p = Object.assign(this.search, {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        getRoleList(p).then(res => {
          this.list = res.Data
          this.totalRow = res.TotalRows
          this.pageIndex = res.PageIndex
        })
      }
    }
  }
</script>
<style scoped>
  .checkG {
    padding-top: 5px;
  }

  .addbtn {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .info_item {
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .info_item .info_title span {
    color: #ff0000;
  }

  .info_item .info_title {
    flex: 0 0 120px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 0 0 200px;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .flex1 {
    flex: 1 !important;
    font-size: 12px;
  }
</style>