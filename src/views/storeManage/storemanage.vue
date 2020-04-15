<template>
  <div class="content_box storeManager">
    <m-title title="仓库管理"></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">仓库名称：</span>
          <el-input v-model="search.Name" class="search_title" size="small" placeholder="请输入仓库名称"></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">仓库编号：</span>
          <el-input v-model="search.Code" class="search_title" size="small" placeholder="请输入仓库编号"></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">仓库类型：</span>
          <el-select
            class="search_title"
            v-model="search.StoreType"
            size="small"
            placeholder="请选择仓库类型"
          >
            <el-option
              v-for="item in storeType"
              :key="item.Id"
              :label="item.Value"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="checkBtn('func_common_search')"
            class="search_btn pan-btn green-btn"
            @click="getData"
            type="success"
            size="mini"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            v-if="checkBtn('func_common_add')"
            @click="showmodel(1)"
            class="pan-btn green-btn addbtn"
            type="primary"
            size="mini"
            icon="el-icon-plus"
          >新增仓库</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="编号" prop="Code" align="center" width="100"></el-table-column>
      <el-table-column label="仓库名称" prop="Name" align="center"></el-table-column>
      <el-table-column label="仓库类型" prop="StoreTypeDesc" align="center"></el-table-column>
      <!-- <el-table-column label="仓库类别" prop="StoreCategory" align="center"></el-table-column> -->
      <el-table-column label="管理员" prop="StoreAdminName" align="center"></el-table-column>
      <el-table-column label="所在地" align="center" prop="addressInfo" width="700"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="checkBtn('func_common_edit')"
            class="pan-btn blue-btn"
            @click="showmodel(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            v-if="checkBtn('func_common_delete')"
            class="pan-btn red-btn"
            @click="delStore(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-close"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15,30,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRow"
      ></el-pagination>
    </div>
    <el-dialog
      :close-on-click-modal="1 == 0"
      v-if="dialogVisible"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">仓库编号：</div>
          <div class="info_right">
            <el-input disabled v-model="info.Code" placeholder="待生成" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">
            <span>*</span>仓库名称：
          </div>
          <div class="info_right">
            <el-input v-model="info.Name" placeholder="请输入仓库名称" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">
            <span>*</span>仓库类型：
          </div>
          <div class="info_right">
            <el-select
              class="search_title"
              v-model="info.StoreType"
              size="small"
              placeholder="请选择仓库类型"
            >
              <el-option
                v-for="item in storeType"
                :key="item.Code"
                :label="item.Value"
                :value="item.Code"
              ></el-option>
            </el-select>
          </div>
        </div>
        <!-- <div class="info_item">
          <div class="info_title">
            <span>*</span>仓库类别：
          </div>
          <div class="info_right">
            <el-select
              class="search_title"
              v-model="info.storeCategory"
              size="small"
              placeholder="请选择仓库类别"
            >
              <el-option
                v-for="item in storeCategory"
                :key="item.Code"
                :label="item.Value"
                :value="item.Code"
              ></el-option>
            </el-select>
          </div>
        </div> -->
        <div class="info_item">
          <div class="info_title">
            <span>*</span>仓库地址：
          </div>
          <div class="info_right">
            <el-select v-model="info.CountryCode" size="small" placeholder="请选择仓库地址">
              <el-option
                v-for="item in storeAddress"
                :key="item.Id"
                :label="item.name"
                :value="item.Code"
              ></el-option>
            </el-select>
            <el-cascader
              size="small"
              v-if="info.CountryCode == 142"
              v-model="info.addressCode"
              separator="-"
              placeholder="请选择地址"
              :props="areaOptions"
              :options="address"
              filterable
            ></el-cascader>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title"></div>
          <div class="info_right">
            <el-input class="info_address" v-model="info.Address" placeholder="请输入详细地址" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">管理员姓名：</div>
          <div class="info_right">
            <el-input v-model="info.StoreAdminName" placeholder="请输入管理员姓名" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">管理员电话：</div>
          <div class="info_right">
            <el-input v-model="info.StoreAdminPhone" placeholder="请输入管理员电话" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">备注：</div>
          <div class="info_right">
            <el-input type="textarea" :rows="3" v-model="info.Desc" placeholder size="mini"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="editStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MTitle from "@/components/MTitle";
import {
  getStoreList,
  getStoreAddress,
  addStore,
  editStore,
  delStore
} from "@/api/storeManage";
import { getCityForCode, getCodeForCity } from "@/utils/city.js";
import { getAddressData } from "@/api/address/index";
import { validatePhone } from "@/utils/validate.js";
export default {
  components: { MTitle },
  data() {
    return {
      pageIndex: 1,
      pageSize: 15,
      totalRow: 0,
      edit: false,
      list: [],
      storeAddress: [],
      address: [],
      dialogVisible: false,
      dialogTitle: "新增仓库",
      storeType: [],
      storeCategory:[{
        Code:1,
        Value:'自营仓'
      },{
        Code:2,
        Value:'委外仓'
      }],
      areaOptions: {
        value: "Code",
        label: "Name",
        children: "Children"
      },
      info: {
        Name: "",
        // storeCategory: "",
        // 国家编码
        CountryCode: "",
        Country: "",
        // 地区编码
        AreaCode: "",
        Desc: "",
        Province: "",
        City: "",
        District: "",
        Address: "",
        StoreAdminName: "",
        StoreAdminPhone: "",
        StoreType: "",
        addressCode: []
      },
      search: {
        Code: "",
        Name: "",
        StoreType: ""
      },
      roleBtn: [],
      baseinfo: {}
    };
  },
  activated() {
    this.getAddressData(() => {
      this.storeType = JSON.parse(
        window.sessionStorage.getItem("selectOptions")
      ).StoreType;
      this.getData();
      this.getStoreAddress();
    });
  },
  created() {
    this.getAddressData(() => {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
      this.baseinfo = JSON.parse(JSON.stringify(this.info));
      this.storeType = JSON.parse(
        window.sessionStorage.getItem("selectOptions")
      ).StoreType;
      this.getData();
      this.getStoreAddress();
    });
  },
  methods: {
    getAddressData(cb) {
      getAddressData().then(res => {
        res.map(a => {
          a.Children.map(b => {
            b.Children.map(c => {
              delete c.Children;
            });
          });
        });
        this.address = res;
        cb();
      });
    },
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    delStore(row) {
      this.$confirm("确定删除该仓库吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delStore({
            Code: row.Code
          }).then(res => {
            this.$message.success("删除成功");
            this.getData();
          });
        })
        .catch();
    },
    editStore() {
      if (this.info.Name === "") {
        this.$message.error("请输入仓库名称");
        return false;
      } else if (this.info.StoreType === "") {
        this.$message.error("请选择仓库类型");
        return false;
      // } else if (this.info.storeCategory === "") {
      //   this.$message.error("请选择仓库类别");
      //   return false;
      } else if (this.info.CountryCode === "") {
        this.$message.error("请选择选择仓库地址");
        return false;
      } else if (this.info.Address === "") {
        this.$message.error("请输入仓库详细地址");
        return false;
      } else if (
        this.info.StoreAdminPhone !== "" &&
        !validatePhone(this.info.StoreAdminPhone)
      ) {
        this.$message.error("请输入正确的电话号码");
        return false;
      }
      if (parseInt(this.info.CountryCode) === 142) {
        const city = getCityForCode(this.info.addressCode, this.address);
        this.info.Province = city[0];
        this.info.City = city[1];
        this.info.District = city[2];
        this.info.AreaCode = this.info.addressCode[2];
      }
      if (!this.edit) {
        addStore(this.info).then(res => {
          this.$message.success("添加成功");
          this.dialogVisible = false;
          this.getData();
        });
      } else {
        editStore(this.info).then(res => {
          this.$message.success("编辑成功");
          this.dialogVisible = false;
          this.getData();
        });
      }
    },
    showmodel(obj) {
      if (typeof obj !== "object") {
        this.info = JSON.parse(JSON.stringify(this.baseinfo));
        this.edit = false;
      } else {
        const o = obj;
        o.addressCode = getCodeForCity(
          [o.Province, o.City, o.District],
          o.AreaCode,
          this.address
        );
        o.StoreType = o.StoreType + "";
        console.log(o.StoreType);
        this.info = Object.assign(this.info, o);
        this.edit = true;
      }
      this.dialogVisible = true;
    },
    getStoreAddress() {
      getStoreAddress({ pageSize: 9999, InUse: 1 }).then(res => {
        this.storeAddress = res.Data.map(v => {
          v.name = v.NameCN + " ( " + v.NameEN + " ) ";
          return v;
        });
      });
    },
    getData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      getStoreList(p).then(res => {
        res.Data.map(v => {
          v.addressInfo =
            v.Country + v.Province + v.City + v.District + v.Address;
        });
        console.log(res.Data);
        this.list = res.Data;
        this.totalRow = res.TotalRows;
        this.pageIndex = res.pageIndex;
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getData();
    }
  }
};
</script>
<style scoped>
.info_item {
  display: flex;
  height: 40px;
}

.info_title span {
  color: #ff0000;
  padding-right: 5px;
}

.info_item .info_title {
  flex: 0 0 100px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
}
</style>