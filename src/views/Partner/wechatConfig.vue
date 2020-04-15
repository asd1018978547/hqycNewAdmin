<template>
  <div class="content_box roleadd goodsManage">
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">合伙人小程序配置管理
        </div>
        <el-select class="search_title" style="flex:0 0 200px;margin:15px;margin-top:10px" v-model="search.type"
          size="mini" @change="getdata">
          <el-option label="店铺端" :value="2"></el-option>
          <el-option label="掌柜端" :value="3"></el-option>
        </el-select>
        <el-button type="primary" size="mini" :disabled="multipleList.length != 1" @click="getSubCodeTemp">提交代码
        </el-button>
        <el-button type="primary" size="mini" :disabled="multipleList.length != 1" @click="getTempMsgList">设置模板消息
        </el-button>
        <el-button type="success" size="mini" :disabled="multipleList.length != 1" @click="getAuditInfo">审核</el-button>
        <el-button type="warning" size="mini" :disabled="multipleList.length != 1" @click="unAudit">撤销审核</el-button>
        <el-button type="primary" size="mini" :disabled="multipleList.length != 1" @click="setDomain">设置域名</el-button>
        <el-button type="success" size="mini" :disabled="multipleList.length != 1" @click="onReleaseCode">发布</el-button>
        <el-button type="warning" size="mini" :disabled="multipleList.length != 1" @click="onRollbackCode">版本回退</el-button>
        <el-button type="primary" size="mini" :disabled="multipleList.length != 1" @click="onGetStatus">状态查询</el-button>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table ref='tables' :data="list" border fit highlight-current-row style="width: 100%" @row-click='rowClick'
            @selection-change="changeFun">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column label='公司编码' prop='CompanyCode' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='公司名称' prop='alias' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='小程序昵称' prop='nick_name' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='AppID' prop='authorization_appid' align='center' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label='原始ID' prop='user_name' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='主体名称' prop='principal_name' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='版本号' prop='user_version' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='版本描述' prop='user_desc' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='审核ID' prop='auditid' align='center' show-overflow-tooltip></el-table-column>
            <el-table-column label='审核状态' prop='audit_status_txt' align='center' show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageIndex" :page-sizes="[15,30,50,100]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalRows">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--提交代码-->
    <el-dialog title="提交代码" :visible.sync="subCodeTemp" width="60%" :show-close='false' :close-on-click-modal='false'
      :close-on-press-escape='false'>
      <el-table :data="subCodeTempList" border fit highlight-current-row>
        <el-table-column property="template_id" align="center" label="模板ID"></el-table-column>
        <el-table-column property="user_version" align="center" label="版本"></el-table-column>
        <el-table-column property="user_desc" label="描述"></el-table-column>
      </el-table>
      <p><i style="display:inline-block;width:80px;text-align:right;font-style: normal;">模板ID：</i>
        <el-input size="mini" style="width:300px;" v-model="subCodeObj.template_id" placeholder="请输入上方表格模板ID">
        </el-input>
      </p>
      <p><i style="display:inline-block;width:80px;text-align:right;font-style: normal;"><span
            style="color:#ff0000">*</span>版本号：</i>
        <el-input size="mini" style="width:300px;" v-model="subCodeObj.user_version" placeholder="请填写以V开头的版本号">
        </el-input>
      </p>
      <p><i style="display:inline-block;width:80px;text-align:right;font-style: normal;"><span
            style="color:#ff0000">*</span>版本描述：</i>
        <el-input size="mini" style="width:300px;" v-model="subCodeObj.user_desc" placeholder="请填写版本号"></el-input>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onSubCodeClose" size="mini">取 消</el-button>
        <el-button :disabled="subCodeObj.user_version == '' || subCodeObj.user_desc == ''" type="primary"
          @click="onSubCode" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!--设置模板消息-->
    <el-dialog title="设置模板消息" :visible.sync="setTempVis" width="60%" :show-close='false' :close-on-click-modal='false'
      :close-on-press-escape='false'>
      <el-table :data="tempMsgList" border fit highlight-current-row>
        <el-table-column align="center" label="类型" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.Type == 2 ? '店铺端' : '掌柜端' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="Title" align="center" label="标题"></el-table-column>
        <el-table-column property="KeywordIdList" label="关键词ID列表"></el-table-column>
        <el-table-column property="KeywordNameList" label="关键词Name列表"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setTempVis = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="onSubTemMsg" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!--提交审核-->
    <el-dialog title="提交审核" :visible.sync="auditVis" width="80%" :show-close='false' :close-on-click-modal='false'
      :close-on-press-escape='false'>
      <div style='display:flex;justify-content:space-between'>
        <el-table :data="category_list" border fit highlight-current-row style="flex:0 0 49%;" ref="multipleTable2"
          @select-all="dialogCheck" @select="dialogCheck" @selection-change="dialogCheckChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="一类(ID)">
            <template slot-scope="scope">
              {{ scope.row.first_class }}({{ scope.row.first_id }})
            </template>
          </el-table-column>
          <el-table-column property="KeywordIdList" label="二类(ID)">
            <template slot-scope="scope">
              {{ scope.row.second_class }}({{ scope.row.second_id }})
            </template>
          </el-table-column>
          <el-table-column label="三类(ID)"></el-table-column>
        </el-table>
        <el-table :data="page_list" border fit highlight-current-row style="flex:0 0 49%;" ref="multipleTable3"
          @select-all="dialogCheck2" @select="dialogCheck2" @selection-change="dialogCheckChange2">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="val" align="center" label="页面地址">
          </el-table-column>
        </el-table>
      </div>
      <p><i style="display:inline-block;width:80px;text-align:right;font-style: normal;"><span
            style="color:#ff0000">*</span>标题：</i>
        <el-input size="mini" style="width:300px;" v-model="auditobj.tag" placeholder="请填写标题">
        </el-input>
      </p>
      <p><i style="display:inline-block;width:80px;text-align:right;font-style: normal;"><span
            style="color:#ff0000">*</span>标签：</i>
        <el-input size="mini" style="width:300px;" v-model="auditobj.title" placeholder="请填写标签"></el-input>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAuditClose" size="mini">取 消</el-button>
        <el-button :disabled="auditobj.tag == '' || auditobj.title == ''" type="primary" @click="onSubAudit" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAuthCodeAppList,
  auditStatusCode,
  SetSupplierTmpMsg,
  rollbackCode,
  releaseCode,
  setSetAuthDomain,
  unAuditCode,
  setPageCode,
  setCategoryCode,
  SubmitAuditCode,
  getTemplateMsgList,
  comcode,
  getTemplateList
} from "@/api/Partner/wechatConfig";
export default {
  data() {
    return {
      search: {
        type: 2
      },
      auditobj: {
        title: '',
        tag: ''
      },
      category_list: [],
      page_list: [],
      auditVis: false,
      tempMsgList: [],
      setTempVis: false,
      subCodeObj: {
        auth_token_id: "",
        template_id: "",
        user_version: "",
        user_desc: ""
      },
      tempMsgObj: {
        CompanyCode: ""
      },
      subCodeTemp: false,
      subCodeTempList: [],
      multipleList: [],
      list: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      selectioned: null,
      selectioned2: null
    };
  },
  activated() {
    this.getdata();
  },
  methods: {
    onGetStatus() {
      auditStatusCode({
        data: [this.multipleList[0]]
      }).then(res => {
        this.$message.success('当前状态：' + res[0].status_info)
      })
    },
    onRollbackCode(){
      rollbackCode({
        data: [{ auth_token_id:  this.multipleList[0].auth_token_id }]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("回退成功");
        }
      })
    },
    unAudit(){
      unAuditCode({
        data: [{ auth_token_id:  this.multipleList[0].auth_token_id }]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("撤销成功");
        }
      })
    },
    setDomain(){
      setSetAuthDomain({
        data: [{ auth_token_id:  this.multipleList[0].auth_token_id }]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("设置成功");
        }
      })
    },
    onReleaseCode(){
      releaseCode({
        data: [{ auth_token_id:  this.multipleList[0].auth_token_id }]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("发布成功");
        }
      })
    },
    onAuditClose() {
      this.auditobj.tag = ''
      this.auditobj.title = ''
      this.auditVis = false
    },
    onSubAudit() {
      if (this.selectioned2 == null) {
        this.$message.error('请选择页面地址')
        return
      } 
      if (this.selectioned == null) {
        this.$message.error('请选择分类')
        return
      }
      let par = {
        auth_token_id:  this.multipleList[0].auth_token_id,
        tag: this.auditobj.tag,
        title: this.auditobj.title,
        category_index: this.selectioned.index,
        page_index: this.selectioned2.index
      }
      SubmitAuditCode({
        data: [par]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("提交成功");
          this.auditobj.tag = ''
          this.auditobj.title = ''
          this.selectioned2 = null
          this.selectioned = null
          this.auditVis = false
          this.getdata()
        }
      })
    },
    dialogCheck(selection, row) {
      this.$refs.multipleTable2.clearSelection();
      if (selection.length === 0) {
        return;
      }
      if (row) {
        this.selectioned = row;
        this.$refs.multipleTable2.toggleRowSelection(row, true);
      }
    },
    dialogCheckChange(row) {
      if (row.length === 0) {
        this.selectioned = null;
      }
    },
    dialogCheck2(selection, row) {
      this.$refs.multipleTable3.clearSelection();
      if (selection.length === 0) {
        return;
      }
      if (row) {
        this.selectioned2 = row;
        this.$refs.multipleTable3.toggleRowSelection(row, true);
      }
    },
    dialogCheckChange2(row) {
      if (row.length === 0) {
        this.selectioned2 = null;
      }
    },
    getAuditInfo() {
      setCategoryCode({
        auth_token_id: this.multipleList[0].auth_token_id
      }).then(res => {
        let a1 = []
        res.category_list.map((v1,i1) => {
          v1.index = i1
          a1.push(v1)
        })
        this.category_list = a1;
        setPageCode({ auth_token_id: this.multipleList[0].auth_token_id }).then(
          data => {
            let a2 = []
            data.page_list.map((v2,i2) => {
              a2.push({
                val: v2,
                index: i2
              })
            })
            this.page_list = a2;
            this.auditVis = true;
          }
        );
      });
    },
    onSubTemMsg() {
      let arr = JSON.parse(JSON.stringify(this.tempMsgList));
      SetSupplierTmpMsg({
        Type: this.search.type,
        CompanyCode: this.tempMsgObj.CompanyCode,
        TmpMsgs: arr
      }).then(res => {
        this.$message.success("设置成功");
        this.setTempVis = false;
        this.getdata();
      });
    },
    getTempMsgList() {
      getTemplateMsgList({ type: this.search.type }).then(res => {
        this.tempMsgObj.CompanyCode = this.multipleList[0].CompanyCode;
        this.tempMsgList = res;
        this.setTempVis = true;
      });
    },
    onSubCode() {
      comcode({
        data: [this.subCodeObj]
      }).then(res => {
        if (res[0].errmsg != "ok") {
          this.$message.error(res[0].err_info);
        } else {
          this.$message.success("提交成功");
          this.onSubCodeClose();
        }
      });
    },
    onSubCodeClose() {
      this.subCodeObj = {
        auth_token_id: "",
        template_id: "",
        user_version: "",
        user_desc: ""
      };
      this.subCodeTemp = false;
      this.getdata();
    },
    getSubCodeTemp() {
      getTemplateList().then(res => {
        if (res.errmsg == "ok") {
          this.subCodeObj.auth_token_id = this.multipleList[0].auth_token_id;
          this.subCodeTempList = res.template_list;
          this.subCodeTemp = true;
        }
      });
    },
    rowClick(row) {
      this.$refs.tables.toggleRowSelection(row);
    },
    changeFun(val) {
      this.multipleList = val;
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getdata();
    },
    getdata() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      getAuthCodeAppList(p).then(res => {
        this.list = res.Data;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style scoped lang="scss">
.img_item {
  width: 30px;
  height: 40px;
  cursor: pointer;
  margin-right: 10px;
}
.chebox_list {
  padding: 0 10px;
}
.chebox_list p,
.el-radio-group,
.chebox_list .chebox_radio {
  width: 100%;
}
.inb_120 {
  display: inline-block;
  width: 120px;
}
.box_top {
  height: 50px;
  line-height: 50px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}
.choice_group {
  width: 100%;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;

  .input_group {
    flex: 1;
  }

  #fileEl {
    position: absolute;
    width: 265px;
    height: 36px;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
  }

  .file_text {
    width: 265px;
    height: 36px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-circle-close {
    cursor: pointer;
    font-size: 15px;
    position: relative;
    left: -32px;
    color: #aaa;
    z-index: 10000;
  }

  .pan-btn {
    padding: 10px 20px;
  }
}
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.box {
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
}

.box_left {
  flex: 0 0 150px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.content_box {
  width: 100%;
  box-sizing: border-box;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
  box-sizing: border-box;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.skuItem {
  display: flex;
}

.skuItem img {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
}

.skuItem p {
  line-height: 25px;
  padding-left: 10px;
  text-align: left;
  margin: 0;
}

.mb {
  margin-bottom: 5px;
}
</style>