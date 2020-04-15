<template>
  <div class="content_box">
    <m-title title="操作详情"></m-title>
    <div class="desc">
      <div class="item">
        <div class="title">操作时间：</div>
        <div class="item_desc">{{ StartDate }}</div>
      </div>
      <div class="item">
        <div class="title">操作类型：</div>
        <div class="item_desc">
          <el-tag v-if="target.Type == 0" type="success">新增</el-tag>
          <el-tag v-if="target.Type == 1" type="warning">编辑</el-tag>
          <el-tag v-if="target.Type == 2" type="danger">删除</el-tag>
        </div>
      </div>
      <div class="item">
        <div class="title">操作人：</div>
        <div class="item_desc">{{ user }}</div>
      </div>
      <el-table border :data="tableData" v-if="roleType != 'Role' && roleType != 'Sku'">
        <div v-for="(item,index) in show" :key="index">
          <template>
            <el-table-column :label="item.value" align="left">
              <template slot-scope="scope">
                <p v-if="roleType == 'OrderStoreAndGoodsChangeInfo' && item.key == 'OrderDetails'">
                  修改前：
                  <span v-for="(i,index) in scope.row[item.key].old" :key="index">
                    <template>
                      <p>
                        <span class="Danger">商品ID：</span>
                        {{ i.GoodsId }}
                      </p>
                      <p>
                        <span class="Danger">商品名：</span>
                        {{ i.NameCN }}
                      </p>
                      <p>
                        <span class="Danger">成本价：</span>
                        {{ i.CostPrice }}
                      </p>
                      <p>
                        <span class="Danger">商品价格：</span>
                        {{ i.Price4Customs }}
                      </p>
                    </template>
                  </span>
                </p>
                <p v-else>
                  修改前：
                  <span
                    class="Danger"
                    v-if="!isImg(scope.row[item.key].old)"
                  >{{ scope.row[item.key].old }}</span>
                  <img class="maxImg" v-else :src="baseUrl + scope.row[item.key].old" />
                </p>
                <p v-if="roleType == 'OrderStoreAndGoodsChangeInfo' && item.key == 'OrderDetails'">
                  修改后：
                  <span v-for="(i,index) in scope.row[item.key].new" :key="index">
                    <template>
                      <p>
                        <span class="Danger">商品ID：</span>
                        {{ i.GoodsId }}
                      </p>
                      <p>
                        <span class="Danger">商品名：</span>
                        {{ i.NameCN }}
                      </p>
                      <p>
                        <span class="Danger">成本价：</span>
                        {{ i.CostPrice }}
                      </p>
                      <p>
                        <span class="Danger">商品价格：</span>
                        {{ i.Price4Customs }}
                      </p>
                    </template>
                  </span>
                </p>
                <p v-else>
                  修改后：
                  <span
                    class="Danger"
                    v-if="!isImg(scope.row[item.key].new)"
                  >{{ scope.row[item.key].new }}</span>
                  <img class="maxImg" v-else :src="baseUrl + scope.row[item.key].new" />
                </p>
              </template>
            </el-table-column>
          </template>
        </div>
      </el-table>
      <el-table border :data="tableData" v-if="roleType == 'Sku'">
        <div v-for="(item,index) in show" :key="index">
          <template>
            <el-table-column :label="item.value" align="left">
              <template slot-scope="scope">
                <p v-if="item.key == 'SkuStandardDetails'">
                  <span class="Danger">修改前：</span>
                  <el-table border :data="scope.row[item.key].old">
                    <el-table-column label="SN" align="center" prop="SN"></el-table-column>
                    <el-table-column label="图片" align="center">
                      <template slot-scope="scope">
                        <img class="maxImg2" :src="baseUrl + scope.row.Image" />
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" align="center" prop="Amount"></el-table-column>
                    <el-table-column label="税率" align="center" prop="TaxRate"></el-table-column>
                    <el-table-column label="批发价" align="center" prop="Price"></el-table-column>
                    <el-table-column label="零售价" align="center" prop="RetailPrice"></el-table-column>
                    <el-table-column label="毛重" align="center" prop="GrossWeight"></el-table-column>
                    <el-table-column label="体积值" align="center" prop="BoxVolume"></el-table-column>
                    <el-table-column label="商品类型" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.OrderType == 1">跨境直邮</span>
                        <span v-if="scope.row.OrderType == 2">保税备货</span>
                        <span v-if="scope.row.OrderType == 3">一般贸易</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="快速预览" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :key="ssindex"
                          v-for="(scsp,ssindex) in scope.row.SkuChildStandardPreviews"
                        >{{ scsp.Amount + scsp.Desc }}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </p>
                <p v-else>
                  修改前：
                  <span
                    class="Danger"
                    v-if="!isImg(scope.row[item.key].old)"
                  >{{ scope.row[item.key].old }}</span>
                  <img class="maxImg" v-else :src="baseUrl + scope.row[item.key].old" />
                </p>
                <p v-if="item.key == 'SkuStandardDetails'">
                  <span class="Danger">修改后：</span>
                  <el-table border :data="scope.row[item.key].new">
                    <el-table-column label="SN" align="center" prop="SN"></el-table-column>
                    <el-table-column label="图片" align="center">
                      <template slot-scope="scope">
                        <img class="maxImg2" :src="baseUrl + scope.row.Image" />
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" align="center" prop="Amount"></el-table-column>
                    <el-table-column label="税率" align="center" prop="TaxRate"></el-table-column>
                    <el-table-column label="批发价" align="center" prop="Price"></el-table-column>
                    <el-table-column label="零售价" align="center" prop="RetailPrice"></el-table-column>
                    <el-table-column label="毛重" align="center" prop="GrossWeight"></el-table-column>
                    <el-table-column label="体积值" align="center" prop="BoxVolume"></el-table-column>
                    <el-table-column label="商品类型" align="center">
                      <template slot-scope="scope">
                        <span v-if="scope.row.OrderType == 1">跨境直邮</span>
                        <span v-if="scope.row.OrderType == 2">保税备货</span>
                        <span v-if="scope.row.OrderType == 3">一般贸易</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="快速预览" align="center">
                      <template slot-scope="scope">
                        <el-tag
                          :key="ssindex"
                          v-for="(scsp,ssindex) in scope.row.SkuChildStandardPreviews"
                        >{{ scsp.Amount + scsp.Desc }}</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </p>
                <p v-else>
                  修改后：
                  <span
                    class="Danger"
                    v-if="!isImg(scope.row[item.key].new)"
                  >{{ scope.row[item.key].new }}</span>
                  <img class="maxImg" v-else :src="baseUrl + scope.row[item.key].new" />
                </p>
              </template>
            </el-table-column>
          </template>
        </div>
      </el-table>
      <div class="role" v-if="roleType == 'Role'">
        <div class="r">
          <h3>修改前数据：</h3>
          <ul>
            <li>{{ target.Olds.Role }}</li>
            <li class="lsnone">
              <ul>
                <div v-for="(i,index) in target.Olds.MenuIds" :key="index">
                  <template>
                    <li>{{ i.Item }}</li>
                    <li class="Info">
                      按钮：
                      <el-tag
                        class="rmr"
                        v-for="ii in i.Function"
                        :key="ii.FunctionId"
                      >{{ii.FunctionName}}</el-tag>
                    </li>
                    <li class="lsnone">
                      <ul>
                        <div v-for="(iii,index) in i.Menus" :key="index"></div>
                        <template>
                          <li>{{ iii.Item }}</li>
                          <li class="Info">
                            按钮：
                            <el-tag
                              class="rmr"
                              v-for="iiii in iii.Function"
                              :key="iiii.FunctionId"
                            >{{iiii.FunctionName}}</el-tag>
                          </li>
                        </template>
                      </ul>
                    </li>
                  </template>
                </div>
              </ul>
            </li>
          </ul>
        </div>
        <div class="r">
          <h3>修改后数据：</h3>
          <ul>
            <li>{{ target.News.Role }}</li>
            <li class="lsnone">
              <ul>
                <div v-for="(i,index) in target.News.MenuIds" :key="index">
                  <template>
                    <li>{{ i.Item }}</li>
                    <li class="Info">
                      按钮：
                      <el-tag
                        class="rmr"
                        v-for="ii in i.Function"
                        :key="ii.FunctionId"
                      >{{ii.FunctionName}}</el-tag>
                    </li>
                    <li class="lsnone">
                      <ul>
                        <div v-for="(iii,index) in i.Menus" :key="index">
                          <template>
                            <li>{{ iii.Item }}</li>
                            <li class="Info">
                              按钮：
                              <el-tag
                                class="rmr"
                                v-for="iiii in iii.Function"
                                :key="iiii.FunctionId"
                              >{{iiii.FunctionName}}</el-tag>
                            </li>
                          </template>
                        </div>
                      </ul>
                    </li>
                  </template>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuditLogInfo } from "@/api/auditLog/auditLog";
import MTitle from "@/components/MTitle";
export default {
  components: { MTitle },
  data() {
    return {
      baseUrl: window.ali_oss_data.URL_IMG_SHOW,
      StartDate: "",
      defaultProps: {
        children: "ChildMenu",
        label: "Item"
      },
      type: "",
      baseShow: [],
      roleType: "",
      tableData: [],
      show: [],
      stdInfo: {},
      user: "",
      target: {}
    };
  },
  methods: {
    isImg(str) {
      if (!str) return false;
      str = str.toString();
      return (
        str.indexOf("jpg") > -1 ||
        str.indexOf("png") > -1 ||
        str.indexOf("gif") > -1 ||
        str.indexOf("jpeg") > -1
      );
    }
  },
  activated() {
    getAuditLogInfo({
      id: this.$route.query.id
    }).then(res => {
      this.baseShow = JSON.parse(res.ShowField);
      this.roleType = res.MenuType;
      this.StartDate = res.StartDate;
      this.user = res.UserName;
      this.target = JSON.parse(res.Target);
      if (this.target.Olds === null) {
        this.target.Olds = [];
      }
      if (this.target.News === null) {
        this.target.News = [];
      }
      if (this.roleType === "Role") {
        return;
      }
      if (
        Object.prototype.toString.call(this.target.Olds) !== "[object Array]"
      ) {
        const o = this.target.Olds;
        const n = this.target.News;
        this.target.Olds = [];
        this.target.Olds[0] = o;
        this.target.News = [];
        this.target.News[0] = n;
      }
      const show = JSON.parse(res.ShowField);
      this.stdInfo = show.SkuStandardDetails
        ? JSON.parse(JSON.stringify(show.SkuStandardDetails))
        : null;
      show.StdDetail = "商品信息";
      const editArr = [];
      if (this.target.Olds.length === 0) {
        if (
          Object.prototype.toString.call(this.target.News) !== "[object Array]"
        ) {
          const n = this.target.News;
          this.target.News = [];
          this.target.News[0] = n;
        }
        this.target.News.map((item, index) => {
          const obj = {};
          for (const k in item) {
            if (k !== "SkuStandardDetails") {
              obj[k] = {};
              obj[k].old = "";
              obj[k].new = this.target.News[index][k];
            } else if (k === "SkuStandardDetails") {
              if (
                JSON.stringify(item[k]) !==
                JSON.stringify(this.target.News[index][k])
              ) {
                obj[k] = {};
                obj[k].old = item[k];
                obj[k].new = this.target.News[index][k];
              }
            }
          }
          editArr.push(obj);
        });
      } else if (this.target.News.length === 0) {
        this.target.Olds.map((item, index) => {
          const obj = {};
          for (const k in item) {
            if (k !== "SkuStandardDetails") {
              obj[k] = {};
              obj[k].old = item[k];
              obj[k].new = "";
            } else if (k === "SkuStandardDetails") {
              if (
                JSON.stringify(item[k]) !==
                JSON.stringify(this.target.News[index][k])
              ) {
                obj[k] = {};
                obj[k].old = item[k];
                obj[k].new = "";
              }
            }
          }
          editArr.push(obj);
        });
      } else {
        this.target.Olds.map((item, index) => {
          const obj = {};
          for (const k in item) {
            if (
              item[k] !== this.target.News[index][k] &&
              k !== "SkuStandardDetails"
            ) {
              obj[k] = {};
              obj[k].old = item[k];
              obj[k].new = this.target.News[index][k];
            } else if (k === "SkuStandardDetails") {
              if (
                JSON.stringify(item[k]) !==
                JSON.stringify(this.target.News[index][k])
              ) {
                obj[k] = {};
                obj[k].old = item[k];
                obj[k].new = this.target.News[index][k];
              }
            }
          }
          editArr.push(obj);
        });
      }
      const newShow = {};
      for (const k in show) {
        editArr.map(v => {
          if (v[k]) {
            const s = JSON.parse(JSON.stringify(show[k]));
            newShow[k] = {
              key: k,
              value: s
            };
          }
        });
      }
      this.show = newShow;
      this.tableData = editArr;
    });
  }
};
</script>
<style scoped>
.role {
  width: 100%;
  display: flex;
}

.rmr {
  margin-right: 10px;
}

.lsnone {
  list-style: none;
}

.role .r {
  flex: 0 0 50%;
}

.role .r h3 {
  font-size: 16px;
}

.role .r ul {
  padding-left: 15px;
}

.role .r li {
  line-height: 35px;
}

.maxImg {
  max-width: 500px;
}
.maxImg2 {
  max-width: 150px;
}
table {
  width: 100%;
}

a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
}

.desc .item {
  line-height: 40px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 150px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 1;
}

.desc .item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
}
</style>