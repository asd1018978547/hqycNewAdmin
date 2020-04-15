<template>
  <div class="content_box">
    <el-tabs v-model="activeTab" @tab-click="tabClick" class="order_top">
      <el-tab-pane :name="item.name" v-for="(item,index) in orderStatusList" :key="index">
        <span v-if="item.name != '异常'" slot="label" class="fz14">{{ item.name }}</span>
        <el-badge
          v-else-if="item.name == '异常' && ycnum > 0"
          :value="ycnum"
          class="item"
          slot="label"
        >
          <span class="Warning fz14">{{ item.name }}</span>
        </el-badge>
        <span v-else slot="label" class="Warning fz14">{{ item.name }}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">订单来源：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.OrderSource"
            size="small"
            placeholder="请选择订单来源"
          >
            <el-option
              v-for="item in orderSourceList"
              :key="item.Codc"
              :label="item.AliasValue"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">订单类型：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.StoreType"
            size="small"
            placeholder="请选择订单类型"
          >
            <el-option
              v-for="item in storeTypeList"
              :key="item.Code"
              :label="item.AliasValue"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">仓库：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.StoreCode"
            size="small"
            placeholder="请选择仓库"
          >
            <el-option
              v-for="item in storeList"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">内部单号：</span>
          <el-input
            v-model="search.OrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入内部编号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">外部单号：</span>
          <el-input
            v-model="search.ExtOrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入外部编号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">渠道订单号：</span>
          <el-input
            v-model="search.ChannelOrderCode"
            clearable
            class="search_title"
            size="small"
            placeholder="渠道订单号"
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="timed">商户编号：</span>
          <el-input
            v-model="search.UserSN_R"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入商户编号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">商户名称：</span>
          <el-select
            class="search_title"
            filterable
            clearable
            multiple
            collapse-tags
            v-model="search.Retailer"
            size="mini"
            placeholder="请输入商户名称"
          >
            <el-option
              v-for="item in shopList"
              :label="item.Company"
              :value="item.Company"
              :key="item.Company"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">收件人：</span>
          <el-input
            v-model="search.Consignee"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入收件人名称"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">收件人电话：</span>
          <el-input
            v-model="search.ConsigneePhone"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入收件人电话"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">身份证号：</span>
          <el-input
            v-model="search.IdNum"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入身份证号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">物流公司：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.ExpCode"
            size="small"
            placeholder="请选择物流公司"
          >
            <el-option
              v-for="item in expList"
              :key="item.ExpCode"
              :label="item.ExpName"
              :value="item.ExpCode"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="timed">物流单号：</span>
          <el-input
            v-model="search.ExpNum"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入物流单号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">订货渠道：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.ChannelId"
            size="small"
            placeholder="请选择订货渠道"
          >
            <el-option
              v-for="item in channelIdList"
              :key="item.Code"
              :label="item.AliasValue"
              :value="item.Code"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="timed">下单时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="search.DateRange1"
            class="search_time"
            size="small"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="timed">原始下单时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange2"
            class="search_time"
            size="small"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <span class="timed">报关订单号：</span>
          <el-input
            v-model="search.OutTradeNo"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入报关订单号"
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <span class="timed">商品SN：</span>
          <el-input
            v-model="search.sn"
            clearable
            class="search_title"
            max="30"
            size="small"
            placeholder="请输入商品sn"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">地区：</span>
          <el-cascader
            class="search_time"
            :props="areaOptions"
            v-model="search.addressInfo"
            :options="areaData"
            size="small"
            separator="-"
            change-on-select
            placeholder="请选择地址"
            filterable
            clearable
          ></el-cascader>
        </el-col>

        <el-col :span="6">
          <span class="timed">申报发货时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange3"
            class="search_time"
            size="small"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>

        <el-col :span="8">
          <el-button
            v-if="checkBtn('func_common_search')"
            type="primary"
            @click="onPageChange(1)"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
          >查询订单</el-button>
          <!-- <el-button type="warning" @click="onAdd" class="search_btn pan-btn yellow-btn" icon="el-icon-circle-plus-outline">新增订单</el-button> -->
          <el-button
            v-if="checkBtn('func_order_export')"
            type="info"
            @click="onExport"
            class="search_btn pan-btn tiffany-btn"
          >导出订单</el-button>
          <el-button
            v-if="checkBtn('func_order_import')"
            type="info"
            @click="onImport"
            class="search_btn pan-btn tiffany-btn"
          >导入订单</el-button>
          <a class="a_load" href="static/file/import_order_template.xlsx">下载模板</a>
        </el-col>
      </el-row>
    </div>
    <div class="list_box">
      <div class="btn_group">
        <!-- <div class="btn_item" v-if='showBatchPay'>
          <el-button size='small' type="primary" :disabled='checkBox.length===0' @click='batchToPay'>魔宝批量支付</el-button>
        </div>-->
        <div class="btn_item">
          订单总数：
          <el-tag type="danger">{{ TotalRows }}</el-tag>&nbsp;&nbsp;&nbsp;&nbsp;商品总数：
          <el-tag type="danger">{{ GoodsCount }}</el-tag>
        </div>
        <div class="btn_item" v-if="search.Status == 25">
          <el-button
            size="small"
            v-if="checkBtn('func_order_batch_declare_payment')"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchToSendPayOrder"
          >批量申报支付单</el-button>
        </div>
        <div class="btn_item" v-if="showSendBtn">
          <el-button
            size="small"
            v-if="checkBtn('func_order_batch_declare_shipments')"
            type="primary"
            :disabled="sbfhbtn"
            @click="batchToSend"
          >批量申报发货</el-button>
          <el-button
            size="small"
            v-if="checkBtn('func_order_batch_declare_assignstore')"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchToSendStore"
          >批量选择仓库</el-button>
        </div>
        <div class="btn_item" v-if="showReceiveBtn">
          <el-button
            size="small"
            v-if="checkBtn('func_order_batch_sign')"
            type="primary"
            :disabled="checkBox.length===0"
            @click="showReceive = true"
          >批量签收</el-button>
        </div>
        <div class="btn_item" v-if="search.Status == 50">
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchSetYc"
          >批量标注异常</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchFX"
          >批量放行</el-button>
        </div>
        <div class="btn_item" v-if="search.IsMfd == 2">
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0 || disSBZFD"
            @click="batchSetZF"
          >批量申报支付单</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0 || disSBDD"
            @click="batchSetDD"
          >批量申报订单</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchExitYc"
          >批量取消异常标注</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchOverseas"
          >批量推送海外仓</el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="checkBox.length===0"
            @click="batchZuoFei"
          >批量作废</el-button>
        </div>
      </div>
      <el-table
        :data="orderList"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column align="center" width="600" label="商品信息">
          <template slot-scope="scope">
            <div
              class="align_left goods_con"
              v-for="(item, index) in scope.row.Detail"
              :key="index"
            >
              <img :src="item.Image" alt />
              <div class="info">
                <p>{{item.Name}}</p>
                <p v-if="item.SN">编码：{{item.SN}}</p>
                <p v-if="item.Standard">规格：{{item.Standard}}</p>
                <!-- <p v-if="item.Expiration">效期：{{item.Expiration}}</p> -->
                <p>￥{{item.Price.toFixed(2)}} * {{item.Count}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="订单信息" width="240">
          <template slot-scope="scope">
            <p
              class="align_left"
              v-for="(item, index) in scope.row.OrderInfo"
              :key="index"
              v-show="item.value"
            >
              <span v-if="item.name == '订单内部编号'">
                {{item.name}}：
                <span
                  @click="jumpDetail({OrderCode:item.value})"
                  style="color: #409eff;cursor: pointer;"
                >{{item.value}}</span>
              </span>
              <span v-else>{{item.name}}： {{item.value}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="订单金额">
          <template slot-scope="scope">
            <div class="align_left" v-for="(item, index) in scope.row.OrderPriceInfo" :key="index">
              <p>{{item.name}}：￥{{parseFloat(item.value).toFixed(2)}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="StoreTypeDesc"
          label="仓库"
        ></el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="OrderStatusDesc"
          width="120"
          label="状态"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.MFD==1">
              <p>
                <el-tag type="danger">作废</el-tag>
              </p>
            </template>
            <template v-if="scope.row.MFD==2">
              <p>
                <!-- <el-tooltip effect="dark" :content="scope.row.MFDDesc" placement="top">
                  <span>
                  <el-tag style="cursor:default" type="danger">异常</el-tag>
                  </span>
                </el-tooltip>-->
                <el-popover
                  placement="top-start"
                  title
                  width="200"
                  trigger="hover"
                  :content="scope.row.MFDDesc"
                >
                  <el-tag style="cursor:default" slot="reference" type="danger">异常</el-tag>
                </el-popover>
              </p>
            </template>
            <p>
              <el-tag :type="getTag(scope.row)">{{scope.row.OrderStatusDesc}}</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" width="180" label="物流">
          <template slot-scope="scope">
            <p
              class="align_left"
              v-for="(item, index) in scope.row.ExpInfo"
              :key="index"
              v-show="item.value"
            >{{item.name}}{{item.value}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <div class="cell_btn">
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="primary"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="scope.row.OrderStatus === 20 && scope.row.SourceId !== 1&&search.IsMfd!=1 && checkBtn('func_order_pay')"
                  @click="onPay(scope.row)"
                >支付</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn yellow-btn"
                  type="warning"
                  size="mini"
                  icon="el-icon-tickets"
                  v-if="scope.row.OrderStatus === 50 && scope.row.MFD === 0 "
                  @click="onYC(scope.row)"
                >异常标注</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="scope.row.OrderStatus === 50&&scope.row.MFD!=2 && scope.row.MFD!=1 "
                  @click="onFX(scope.row)"
                >放行</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn yellow-btn"
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  v-if="scope.row.OrderStatus === 20&&search.IsMfd!=1 && checkBtn('func_common_edit')"
                  @click="onEdit(scope.row)"
                >编辑</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="danger"
                  size="mini"
                  icon="el-icon-goods"
                  v-if="showRefundAction(scope.row) && scope.row.SourceId !== 3"
                  @click="onRefund(scope.row)"
                >退款</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn green-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-tickets"
                  v-if="(search.IsMfd !=1 && search.IsMfd!=2 && checkBtn('func_order_remark')) && (scope.row.OrderStatus !== 60&&scope.row.OrderStatus !== 70)"
                  @click="onRemarks(scope.row)"
                >备注</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn green-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-tickets"
                  v-if="(scope.row.OrderStatus === 30 || scope.row.OrderStatus === 70||scope.row.OrderStatus === 60)"
                  @click="onAddRemarks(scope.row)"
                >追加备注</el-button>
              </p>
              <!-- ============================================================================= -->
              <p>
                <el-button
                  class="pan-btn yellow-btn"
                  type="warning"
                  size="mini"
                  icon="el-icon-time"
                  v-if="showBackAction(scope.row) &&search.IsMfd!=2"
                  @click="onBack(scope.row)"
                >回退</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="(scope.row.OrderStatus === 50 || scope.row.OrderStatus === 25)&&search.IsMfd==2 && getOrderExceptions(scope.row.OrderExceptions, 1)&&scope.row.OrderStatus !== 40"
                  @click="reZF(scope.row)"
                >申报支付单</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="scope.row.MFD!=1 && search.IsMfd!=1 &&scope.row.OrderStatus == 40"
                  @click="reTSHWC(scope.row)"
                >推送海外仓</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn blue-btn"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="(scope.row.OrderStatus === 50 || scope.row.OrderStatus === 25)&&search.IsMfd==2 && getOrderExceptions(scope.row.OrderExceptions, 2)&&scope.row.OrderStatus !== 40"
                  @click="reDD(scope.row)"
                >申报订单</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn yellow-btn"
                  type="warning"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  v-if="(scope.row.OrderStatus === 50 || scope.row.OrderStatus === 25||scope.row.OrderStatus === 40)&&search.IsMfd==2"
                  @click="onExitYiChang(scope.row)"
                >取消异常标注</el-button>
              </p>
              <p>
                <el-button
                  class="pan-btn red-btn"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  v-if="showMfdAction(scope.row) && checkBtn('func_order_mfd') && scope.row.MFD != 1"
                  @click="onMfd(scope.row)"
                >作废</el-button>
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.PageIndex"
        :page-sizes="[15,30,50,100]"
        :page-size="search.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows"
      ></el-pagination>
    </div>
    <!-- 订单导入 -->
    <el-dialog title="订单导入" :visible.sync="showImport" width="24%" center>
      <div class="choice_group">
        <div class="input_group">
          <input type="file" ref="fileEl" id="fileEl" @change="fileChange($event)" />
          <input type="text" v-model="uploadFile.name" class="file_text" placeholder="选择文件" />
          <span class="el-icon-circle-close" @click="deleteFile" v-if="uploadFile.name"></span>
        </div>
        <el-button
          class="pan-btn blue-btn"
          type="primary"
          @click="upFile"
          icon="el-icon-upload"
          :disabled="fileLoading"
          :loading="fileLoading"
        >上传文件</el-button>
      </div>
      <div style="padding-top:15px;">
        <p style="color:#ff0000" v-for="(item, index) in upfileerror" :key="index">{{item}}</p>
      </div>
    </el-dialog>
    <!--异常标注-->
    <el-dialog title="选择异常类型" :visible.sync="ycmodelshow" width="30%" center>
      <div>
        <p v-for="(item,index) in ycRow" :key="index">订单编号：{{ item.orderCode }}</p>
        <br />
        <p>
          异常类型：
          <el-select v-model="ycDesc" placeholder="请选择" @change="setYcSeleted" size="mini">
            <el-option
              v-for="(item,index) in ycType"
              :key="index"
              :label="item.SubStatusDesc"
              :value="item.SubStatus"
            ></el-option>
          </el-select>
          <el-select v-model="ycDesc2" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index) in ycTypeDesc"
              :key="index"
              :label="item.ReceiptDesc"
              :value="item.ReceiptCode"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ycmodelshow = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subYCMark" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 备注 -->
    <el-dialog title="备注" :visible.sync="remarksModal" width="30%" center>
      <el-input v-model="remarks" placeholder="请输入备注信息"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarksModal = false">取 消</el-button>
        <el-button type="primary" @click="submitRemarks">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 追加备注 -->
    <el-dialog title="追加备注" :visible.sync="addRemarksModal" width="30%" center>
      <el-input v-model="addRemarks" placeholder="请输入追加备注信息"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRemarksModal = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRemarks">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 退款 -->
    <el-dialog title="选择退款原因" :visible.sync="refundOrderVisible" width="400px">
      <el-radio v-model="refundRadio" label="重复下单">重复下单</el-radio>
      <br />
      <br />
      <el-radio v-model="refundRadio" label="商品价格无优势">商品价格无优势</el-radio>
      <br />
      <br />
      <el-radio v-model="refundRadio" label="订单提交信息错误">订单提交信息错误</el-radio>
      <br />
      <br />
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="subRefund">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 作废 -->
    <el-dialog title="提示" :visible.sync="showMfd" width="30%" center>
      <el-input v-model="mfdDesc" placeholder="请输入作废原因"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMfd = false">取 消</el-button>
        <el-button type="primary" @click="subMfd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回退 -->
    <el-dialog title="提示" :visible.sync="showBack" width="30%" center>
      <el-input v-model="backDesc" placeholder="请输入回退原因"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBack = false">取 消</el-button>
        <el-button type="primary" @click="subBack">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 付款 -->
    <el-dialog title="选择支付方式" :visible.sync="payDialog" width="400px" center>
      <div
        class="payTypeItem"
        v-for="(item,index) in payWayList"
        :key="index"
        style="line-height:36px;"
      >
        <el-radio v-model="payType" :disabled="item.disabled" :label="item.type">{{item.title}}</el-radio>
        <p class="marginLeft10" style="color: #c0c4cc;" v-show="item.disabled">暂未开通</p>
        <p class="marginLeft10" style="color: #c0c4cc;" v-show="item.tip">{{item.tip}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payDialog = false">取 消</el-button>
        <el-button type="primary" @click="getPay">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog :title="payText" :visible.sync="qrCodeShow" width="20%" center>
      <div style="position:relative;height:150px;">
        <p></p>
        <span
          class="pay_code_img marginTop10"
          ref="wepayCode"
          style="width:150px;height:150px;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;"
        ></span>
      </div>
    </el-dialog>
    <el-dialog title="支付确认" :visible.sync="confirmBatchPay" width="30%" center>
      <p>支付完成前请不要关闭此窗口！</p>
      <p>请在新打开的网银支付页面完成支付后，根据支付结果选择</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="danger" @click="checkBatchPay">支付遇到问题</el-button>
        <el-button size="small" type="primary" @click="checkBatchPay">完成</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量申报发货" :visible.sync="showSend" width="30%" center>
      <p class="size14">
        已选择订单
        <b style="color:#e70422;">{{sendNum}}</b>个
      </p>
      <p class="size14" style="margin:10px 0">
        物流公司
        <el-select
          class="search_title"
          clearable
          v-model="ExpCode"
          size="mini"
          placeholder="请选择物流公司"
        >
          <el-option label="中通" value="10"></el-option>
          <el-option label="韵达" value="13"></el-option>
          <el-option label="EMS" value="3"></el-option>
          <el-option label="圆通" value="05"></el-option>
        </el-select>
      </p>
      <p class="size14">确认申报发货？</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSend = false">取消</el-button>
        <el-button size="small" type="primary" @click="goSend">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量选择仓库" :visible.sync="showSendStore" width="30%" center>
      <p class="size14">
        已选择订单
        <b style="color:#e70422;">{{sendNum}}</b>个
      </p>
      <p class="size14" style="margin-top:25px">
        选择仓库
        <el-select
          class="search_title"
          clearable
          v-model="batchSendStore"
          size="mini"
          placeholder="请选择仓库"
        >
          <el-option
            v-for="item in storeList"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showSendStore = false">取消</el-button>
        <el-button
          size="small"
          :disabled="batchSendStore == ''"
          type="primary"
          @click="goSendStore"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量签收" :visible.sync="showReceive" width="30%" center>
      <p>确认要签收吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showReceive = false">取消</el-button>
        <el-button size="small" type="primary" @click="batchToReceive">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import moment from "moment";
import { stringify } from "querystring";
import { PKoptions } from "@/assets/pickerOptions";
import axios from "axios";
import {
  getYCnum,
  batchExitYiChang,
  batchZuoFei,
  reZF,
  reDD,
  setFX,
  setYC,
  getYCType,
  batchSendStore,
  ExpCompany,
  OrderList,
  StoreList,
  getDictionary,
  getListFromDictionary,
  ExportOrder,
  UploadExcle,
  SubmitRemark,
  SubmitAddRemark,
  OrderRefund,
  SubMfd,
  SubBack,
  OrderPay,
  CheckBatChPay,
  BatchOrderSend,
  BatchOrderReceive,
  markYC,
  batchSendPayOrder
} from "@/api/order/orderCenter";
import { sendToOverseaStore } from "@/api/order/order";
const Ip = window._config.url;
const PartnerId = window._config.partnerId;
const Batch_url = "/payCenter/moPay/mopay_batch.aspx";
import { formatDateTime } from "@/utils/index";
import { getList } from "@/api/retailer";
export default {
  components: {},
  data() {
    return {
      shopList: [],
      areaOptions: {
        checkStrictly: true,
        value: "name",
        label: "name",
        children: "children"
      },
      areaData: window._areaDatas,
      ycmodelshow: false,
      sbfhbtn: true,
      ExpCode: "",
      showSendStore: false,
      upfileerror: [],
      batchSendStore: "",
      activeTab: "全部订单",
      orderStatusList: [
        { name: "全部订单", status: -1, IsMfd: -1 },
        { name: "待付款", status: 10, IsMfd: 0 },
        { name: "待申报支付", status: 20, IsMfd: 0 },
        { name: "待申报支付单", status: 25, IsMfd: 0 },
        { name: "待申报发货", status: 30, IsMfd: 0 },
        { name: "待发货", status: 35, IsMfd: 0 },
        { name: "待出库", status: 40, IsMfd: 0 },
        { name: "待清关", status: 50, IsMfd: 0 },
        { name: "待签收", status: 60, IsMfd: 0 },
        { name: "已完成", status: 70, IsMfd: 0 },
        { name: "已取消", status: 0, IsMfd: 0 },
        { name: "已作废", status: -1, IsMfd: 1 },
        { name: "异常", status: -1, IsMfd: 2 }
      ],
      search: {
        addressInfo: [],
        Province: "",
        City: "",
        District: "",
        DateRange1: [
          new Date(),
          new Date(new Date().getTime() + 3600 * 1000 * 24 * 7)
        ], // 下单时间
        DateRange2: null, // 原始下单时间
        ChannelId: "",
        OutTradeNo: "",
        Status: "",
        sn: "",
        OrderCode: "",
        ExtOrderCode: "",
        UserSN_R: "",
        Retailer: "",
        OrderSource: "",
        ChannelOrderCode: "",
        StoreType: "",
        StoreCode: "",
        IdNum: "",
        Consignee: "",
        ConsigneePhone: "",
        ExpCode: "",
        ExpNum: "",
        IsMfd: -1, // 1是作废，0是正常
        PageIndex: 1,
        PageSize: 15
      },
      GoodsCount: 0,
      dictionary: [],
      orderSourceList: [],
      storeTypeList: [],
      channelIdList: [],
      storeList: [],
      expList: [],
      pickerOptions: PKoptions,
      orderList: [],
      TotalRows: 0,
      showImport: false,
      uploadFile: {},
      fileLoading: false,
      remarks: "", //备注
      remarksOrder: "", //备注订单号
      remarksModal: false, //备注模态框
      addRemarks: "", //追加备注
      addRemarksOrder: "", //追加备注订单号
      addRemarksModal: false, //追加备注模态框
      refundOrderVisible: false,
      refundOrder: "",
      refundRadio: "",
      showMfd: false,
      mfdOrder: "",
      mfdDesc: "",
      showBack: false,
      backOrder: "",
      backDesc: "",
      payDialog: false,
      payWayList: [
        { type: 0, title: "支付宝支付", disabled: false, tip: "" },
        { type: 1, title: "微信支付", disabled: false, tip: "" },
        {
          type: 2,
          title: "银联支付",
          disabled: false,
          tip:
            "部分银行（工行、招商等）在线支付仅支持IE浏览器，若遇无法正常支付的情况，请您使用IE浏览器或及时联系客服"
        }
      ],
      payType: 0,
      payOrder: "",
      payText: "",
      qrCodeShow: false,
      checkBox: [],
      confirmBatchPay: false,
      batchOrderCodes: [],
      showSend: false,
      showReceive: false,
      roleBtn: [],
      ycRow: [],
      ycType: [],
      ycTypeDesc: [],
      ycDesc: "",
      ycDesc2: "",
      FXlist: [],
      reZFlist: [],
      reDDlist: [],
      disSBZFD: true,
      disSBDD: true,
      yclist: [],
      isBatchMfd: false,
      ycnum: 0
    };
  },
  watch: {
    checkBox: function(val) {
      if (val.length == 0) {
        this.disSBZFD = true;
        this.disSBDD = true;
        return;
      }
      let a1 = [];
      let a2 = [];
      let a3 = [];
      val.map(v => {
        if (v.OrderExceptions.length < 1) {
          a1.push(true);
          a2.push(true);
        } else {
          if (v.OrderExceptions.length > 1) {
            v.OrderExceptions.map(item => {
              if (item.ModeCode == 1 && item.IsResolve) {
                a1.push(true);
              } else if (item.ModeCode == 2 && item.IsResolve) {
                a2.push(true);
              } else if (item.ModeCode == 3 && item.IsResolve) {
                a3.push(true);
              }
            });
          } else {
            v.OrderExceptions.map(item => {
              if (item.ModeCode == 1 && !item.IsResolve) {
                a2.push(true);
              } else if (item.ModeCode == 2 && !item.IsResolve) {
                a1.push(true);
              } else if (item.ModeCode == 3 && !item.IsResolve) {
                a3.push(true);
              }
            });
          }
        }
      });
      if (a1.length > 0) {
        this.disSBZFD = true;
      } else {
        this.disSBZFD = false;
      }
      if (a2.length > 0) {
        this.disSBDD = true;
      } else {
        this.disSBDD = false;
      }
      if (a3.length > 0) {
        this.disSBDD = true;
        this.disSBZFD = true;
      }
    }
  },
  computed: {
    showBatchPay() {
      return this.search.Status === 20;
    },
    showSendBtn() {
      return this.search.Status === 30;
    },
    showReceiveBtn() {
      return this.search.Status === 60;
    },
    sendNum() {
      return this.checkBox.length;
    }
  },
  methods: {
    getShopList() {
      const p = {
        accountName: "",
        company: "",
        phone: "",
        number: "",
        partnerId: "",
        levelId: "",
        dateRange1: "",
        pageIndex: 1,
        pageSize: 99999
      };
      getList(p).then(res => {
        this.shopList = res.RetailerList.Data;
      });
    },
    getYCnum() {
      getYCnum().then(res => {
        this.ycnum = res;
      });
    },
    batchYC() {
      let a = [];
      this.yclist.map(v => {
        a.push(v.orderCode);
      });
      batchExitYiChang({
        OrderCodes: a.join(",")
      }).then(res => {
        this.$alert(res, "提示", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
        this.yclist = [];
        this.onPageChange(1);
      });
    },
    batchExitYc() {
      this.$confirm(
        "确定要取消这" + this.checkBox.length + "笔订单的异常标注吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        this.yclist = this.checkBox;
        this.batchYC();
      });
    },
    //批量推送海外仓--hjy
    batchOverseas() {
      this.$confirm(
        "确定要批量推送" + this.checkBox.length + "笔订单吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        let OrderCodes = [];
        let TSHECflag = [];
        this.checkBox.forEach(element => {
          OrderCodes.push(element.OrderCode);
          TSHECflag.push(element.OrderStatus);
        });
        OrderCodes = OrderCodes.join(",");
        if (
          TSHECflag.indexOf(0) != -1 ||
          TSHECflag.indexOf(10) != -1 ||
          TSHECflag.indexOf(20) != -1 ||
          TSHECflag.indexOf(21) != -1 ||
          TSHECflag.indexOf(25) != -1 ||
          TSHECflag.indexOf(30) != -1 ||
          TSHECflag.indexOf(35) != -1 ||
          TSHECflag.indexOf(50) != -1 ||
          TSHECflag.indexOf(60) != -1 ||
          TSHECflag.indexOf(70) != -1 ||
          TSHECflag.indexOf(80) != -1 ||
          TSHECflag.indexOf(90) != -1 ||
          TSHECflag.indexOf(100) != -1
        ) {
          this.$message({
            message: "只能选择订单状态为待出库的商品",
            type: "error",
            center: true,
            duration: 4000
          });
        } else {
          sendToOverseaStore({ OrderCodes: OrderCodes })
            .then(res => {
              this.$message({
                message: "正在推送订单至海外仓,请稍后查看推送是否成功",
                type: "success",
                center: true,
                duration: 2000
              });
              this.onPageChange(1);
            })
            .catch(err => {
              this.$message({
                message: "推送失败，请重试",
                type: "error",
                center: true,
                duration: 2000
              });
            });
        }
      });
    },
    batchZuoFei() {
      this.showMfd = true;
      this.mfdDesc = "";
      this.isBatchMfd = true;
    },
    onExitYiChang(row) {
      this.$confirm(
        "确定要取消订单：" + row.orderCode + "的异常标注吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        this.yclist.push(row);
        this.batchYC();
      });
    },
    batchSetZF() {
      this.$confirm(
        "确定要重推这" + this.checkBox.length + "笔订单的支付单吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.reZFlist = this.checkBox;
        this.btachReZF();
      });
    },
    batchSetDD() {
      this.$confirm(
        "确定要重推这" + this.checkBox.length + "笔订单的订单吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.reDDlist = this.checkBox;
        this.btachReDD();
      });
    },
    btachReZF() {
      let a = [];
      this.reZFlist.map(v => {
        a.push(v.orderCode);
      });
      reZF({
        OrderCodes: a.join(",")
      }).then(res => {
        this.$alert(res, "提示", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
        this.reZFlist = [];
        this.onPageChange(1);
      });
    },
    btachReDD() {
      let a = [];
      this.reDDlist.map(v => {
        a.push(v.orderCode);
      });
      reDD({
        OrderCodes: a.join(",")
      }).then(res => {
        this.$alert(res, "提示", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
        this.reDDlist = [];
        this.onPageChange(1);
      });
    },
    //推送海外仓----hjy
    reTSHWC(row) {
      this.$confirm("确定要推送" + row.orderCode + "至海外仓吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        sendToOverseaStore({ OrderCodes: row.OrderCode })
          .then(res => {
            this.$message({
              message: "正在推送订单至海外仓,请稍后查看推送是否成功",
              type: "success",
              center: true,
              duration: 2000
            });
            this.onPageChange(1);
          })
          .catch(err => {
            this.$message({
              message: "推送失败，请重试",
              type: "error",
              center: true,
              duration: 2000
            });
          });
      });
    },
    //结束
    reZF(row) {
      this.$confirm("确定要重推" + row.orderCode + "的支付单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.reZFlist = [];
        this.reZFlist.push(row);
        this.btachReZF();
      });
    },
    reDD(row) {
      this.$confirm("确定要重推" + row.orderCode + "订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.reDDlist = [];
        this.reDDlist.push(row);
        this.btachReDD();
      });
    },
    getOrderExceptions(exp, num) {
      let f = false;
      exp.map(v => {
        if (v.ModeCode == num) {
          f = !v.IsResolve;
        }
      });
      return f;
    },
    batchFX() {
      this.$confirm(
        "确定要放行这" + this.checkBox.length + "个订单吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(res => {
        this.FXlist = this.checkBox;
        this.batchFXs();
      });
    },
    batchFXs() {
      let a = [];
      this.FXlist.map(v => {
        a.push(v.orderCode);
      });
      setFX({
        OrderCodes: a.join(",")
      }).then(res => {
        this.$alert(res, "提示", {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        });
        this.FXlist = [];
        this.onPageChange(1);
      });
    },
    onFX(r) {
      this.FXlist.push(r);
      this.batchFXs();
    },
    batchSetYc() {
      this.ycRow = this.checkBox;
      this.ycmodelshow = true;
    },
    subYCMark() {
      if (this.ycDesc == "" || this.ycDesc2 == "") {
        this.$message.error("请选择异常类型");
        return;
      } else {
        let a = [];
        this.ycRow.map(v => {
          a.push(v.orderCode);
        });
        setYC({
          OrderCodes: a.join(","),
          SubStatus: this.ycDesc,
          ReceiptCode: this.ycDesc2
        }).then(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          });
          this.ycRow = [];
          this.ycDesc = "";
          this.ycDesc2 = "";
          this.ycmodelshow = false;
          this.onPageChange(1);
        });
      }
    },
    setYcSeleted(val) {
      this.getYcType(val);
    },
    getYcType(val) {
      let par = {};
      if (val) {
        par = { exceptionType: val };
      }
      getYCType(par).then(res => {
        if (val) {
          res.map(v => {
            if (v.SubStatus == val) {
              this.ycTypeDesc = v.Receipt;
            }
          });
        } else {
          this.ycType = res;
        }
      });
    },
    onYC(row) {
      this.ycRow = [];
      this.ycRow[0] = row;
      this.ycmodelshow = true;
    },
    onRefundApply(row) {
      console.log(row.Detail[0]);

      // todo 测试申请售后
      this.$router.push({
        path: "/afterSaleCreate",
        query: {
          SN: row.Detail[0].SN,
          OrderCode: row.Detail[0].OrderCode
        }
      });
    },
    goSendStore() {
      let n = "";
      this.storeList.map(v => {
        if (v.Code === this.batchSendStore) {
          n = v.Name;
        }
      });
      this.$confirm(
        "确定将" + this.sendNum + "个订单的仓库指定为" + n + "?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const c = this.checkBox.map(item => {
          return item.OrderCode;
        });
        batchSendStore({
          orderCodes: c,
          storeCode: this.batchSendStore
        }).then(res => {
          this.showSendStore = false;
          this.getOrderList();
        });
      });
    },
    batchToSendStore() {
      let a = [];
      this.checkBox.map(v => {
        v.OrderInfo.map(item => {
          if (item.name == "订单类型") {
            a.push(item.value);
          }
        });
      });
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      a.map(v => {
        if (v == "保税备货") {
          b1 += 1;
        } else if (v == "跨境直邮") {
          b2 += 1;
        } else if (v == "一般贸易") {
          b3 += 1;
        }
      });
      let f = false;
      if (b1 > 0) {
        if (b2 > 0 || b3 > 0) {
          f = true;
        }
      } else if (b2 > 0) {
        if (b1 > 0 || b3 > 0) {
          f = true;
        }
      } else if (b3 > 0) {
        if (b2 > 0 || b3 > 0) {
          f = true;
        }
      }
      if (f) {
        this.$message.error("订单中包含不同的贸易类型，请重新选择");
        return;
      }
      this.showSendStore = true;
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
    onAdd() {
      this.$router.push("/addorder");
    },
    jumpDetail(row) {
      this.$router.push({
        path: "/orderDetail",
        query: {
          id: row.OrderCode
        }
      });
    },
    tabClick(item) {
      const status = this.orderStatusList[item.index].status;
      const IsMfd = this.orderStatusList[item.index].IsMfd;
      this.search.Status = status;
      this.search.IsMfd = IsMfd;
      this.onPageChange();
    },
    handleSizeChange(v) {
      this.search.PageSize = v;
      this.getOrderList();
    },
    handleCurrentChange(v) {
      this.search.PageIndex = v;
      this.getOrderList();
    },
    handleSelectionChange(val) {
      let f = true;
      if (val.length > 0) {
        val.map(v => {
          if (v.StoreTypeDesc === "") {
            f = false;
          }
        });
        if (f) {
          this.sbfhbtn = false;
        } else {
          this.sbfhbtn = true;
        }
      } else {
        this.sbfhbtn = true;
      }
      this.checkBox = val;
    },
    paramsInit() {
      this.search = {
        addressInfo: [],
        Province: "",
        City: "",
        District: "",
        DateRange1: [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
          new Date()
        ], // 下单时间
        DateRange2: null, // 原始下单时间
        ChannelId: "",
        Status: "-1",
        OrderCode: "",
        ExtOrderCode: "",
        ExpCode: "",
        UserSN_R: "",
        sn: "",
        Retailer: "",
        OrderSource: "",
        OutTradeNo: "",
        StoreType: "",
        StoreCode: "",
        IdNum: "",
        Consignee: "",
        ConsigneePhone: "",
        ExpCode: "",
        ExpNum: "",
        IsMfd: -1, // 1是作废，0是正常
        PageIndex: 1,
        PageSize: 15
      };
    },
    getDictionary() {
      getDictionary().then(res => {
        this.orderSourceList = getListFromDictionary(res, "OrderSource");
        this.channelIdList = getListFromDictionary(res, "OrderChannel");
        this.storeTypeList = getListFromDictionary(res, "StoreType");
      });
      ExpCompany().then(res => {
        this.expList = res;
      });
      StoreList().then(res => {
        res.Data.unshift({ Code: "000", Name: "未选仓" });
        this.storeList = res.Data;
      });
    },
    onPageChange(PageIndex = 1) {
      this.search.PageIndex = PageIndex;
      this.getOrderList();
    },
    getOrderList() {
      const o = Object.assign({}, this.search);
      o.Retailer = o.Retailer.toString();
      if (o.addressInfo.length == 0) {
        o.Province = "";
        o.City = "";
        o.District = "";
      } else {
        o.Province = o.addressInfo[0];
        o.City = o.addressInfo[1];
        o.District = o.addressInfo[2];
      }
      delete o.addressInfo;
      if (this.search.DateRange3 != null) {
        this.search.DateRange3[1] =
          this.search.DateRange3[1].length === 10
            ? this.search.DateRange3[1] + " 23:59:59"
            : this.search.DateRange3[1];
      }
      if (o.OrderSource === "") o.OrderSource = "-1";
      if (o.StoreType === "") o.StoreType = "-1";
      if (o.ChannelId === "") o.ChannelId = "-1";
      if (o.DateRange1 !== null) {
        o.DateRange1[0] = moment(o.DateRange1[0] + "").format(
          "YYYY-MM-DD HH:mm:ss"
        );
        o.DateRange1[1] = moment(o.DateRange1[1] + "").format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      OrderList(o).then(res => {
        this.GoodsCount = res.GoodsCount;
        this.TotalRows = res.TotalRows;
        const arr = res.Data.map(item => {
          const OrderInfo = [
            { name: "订单内部编号", value: item.OrderCode },
            { name: "订单外部编号", value: item.ExtOrderCode },
            { name: "渠道订单号", value: item.ChannelOrderCode },
            { name: "报关订单号", value: item.OutTradeNo },
            { name: "订单来源", value: item.SourceDesc },
            { name: "订单类型", value: item.OrderTypeDesc },
            { name: "顾客昵称", value: item.Retailer },
            { name: "下单时间", value: formatDateTime(item.ExtDateAdded) },
            {
              name: "支付时间",
              value: item.PayTime !== "" ? formatDateTime(item.PayTime) : "暂无"
            }
          ];
          const orderCode = item.OrderCode;
          const totalMoney = item.GoodsMoney + item.TaxAmount + item.TransFee;
          let OrderPriceInfo = [];
          if (item.StoreTypeId === "3") {
            OrderPriceInfo = [
              { name: "订单金额", value: totalMoney },
              { name: "商品金额", value: item.GoodsMoney },
              { name: "订单运费", value: item.TransFee }
            ];
          } else {
            OrderPriceInfo = [
              { name: "订单金额", value: totalMoney },
              { name: "商品金额", value: item.GoodsMoney },
              { name: "订单运费", value: item.TransFee },
              { name: "综合税费", value: item.TaxAmount },
              { name: "抵扣金额", value: item.DisCount }
            ];
          }
          const ExpInfo = [
            { name: "收件人：", value: item.Consignee },
            { name: "电话：", value: item.ConsigneePhone },
            {
              name: "物流公司：",
              value: item.ExpName === "" ? "暂无" : item.ExpName
            },
            {
              name: "物流单号：",
              value: item.ExpNum === "" ? "暂无" : item.ExpNum
            },
            { name: "运输方式：", value: item.TransDevice },
            { name: "航班次：", value: item.VoyageNum },
            { name: "提运单号：", value: item.BillNum }
          ];
          const Detail = item.Detail;
          const StoreTypeDesc = item.StoreTypeDesc;
          const OrderStatusDesc = item.OrderStatusDesc;
          const OrderStatus = item.OrderStatus;
          const Channel = item.Channel;
          const Id = item.Id;
          const OrderCode = item.OrderCode;
          const SourceId = item.SourceId;
          const StoreTypeId = item.StoreTypeId;
          const PayType = item.PayType;
          const ExtOrderCode = item.ExtOrderCode;
          const MFD = item.MFD;
          const OrderExceptions = item.OrderExceptions;
          const MFDDesc = item.MFDDesc;
          const m = {
            MFDDesc,
            OrderExceptions,
            orderCode,
            OrderInfo,
            OrderPriceInfo,
            ExpInfo,
            Detail,
            StoreTypeDesc,
            OrderStatusDesc,
            OrderStatus,
            Channel,
            Id,
            OrderCode,
            SourceId,
            StoreTypeId,
            PayType,
            ExtOrderCode,
            MFD
          };
          return m;
        });
        this.orderList = arr;
        this.orderList.forEach(element => {
          element.Detail.forEach(item => {
            let signUrl = window.ali_oss_data.URL_IMG_SHOW + item.Image;
            item.Image = signUrl;
          });
        });
        this.search.PageIndex = res.PageIndex;
      });
       this.getYCnum();
    },
    isCheckAble(row, index) {
      const f = row.OrderStatus === 30 && row.StoreTypeDesc === "";
      return !f;
    },
    getTag(item) {
      const status = parseInt(item.Status);
      if (status === 10 || status === 20) {
        return "danger";
      } else if (
        status === 25 ||
        status === 30 ||
        status === 40 ||
        status === 50 ||
        status === 60
      ) {
        return "warning";
      } else if (status === 70) {
        return "success";
      } else if (status === 0) {
        return "info";
      } else {
        return "";
      }
    },
    showRefundAction(item) {
      if (this.search.IsMfd === 1) return false;
      const y =
        (parseInt(item.OrderStatus) === 25 ||
          parseInt(item.OrderStatus) === 30 ||
          parseInt(item.OrderStatus) === 40 ||
          parseInt(item.OrderStatus) === 50 ||
          parseInt(item.OrderStatus) === 60) &&
        (parseInt(item.SourceId) === 2 || parseInt(item.SourceId) === 3) &&
        parseInt(item.PayType) === 6;
      return y;
    },
    // 是否显示回退按钮
    showBackAction(item) {
      if (this.search.IsMfd === 1) return false;
      // const s = item.OrderStatus === 40 || item.OrderStatus === 50 || item.OrderStatus === 60
      let s = item.OrderStatus === 50;
      return s;
    },
    showMfdAction(item) {
      if (this.search.IsMfd === 1) return false;
      const s =
        item.OrderStatus === 70 ||
        this.search.IsMfd === 1 ||
        item.SourceId === 1;
      return !s;
    },
    onExport() {
      const Loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      const o = Object.assign({}, this.search);
      if (o.OrderSource === "") o.OrderSource = "-1";
      if (o.StoreType === "") o.StoreType = "-1";
      if (o.ChannelId === "") o.ChannelId = "-1";
      ExportOrder(o)
        .then(res => {
          Loading.close();
          const href = window._config.fileServer + res.fileName;
          window.open(href);
        })
        .catch(() => {
          Loading.close();
        });
    },
    onImport() {
      this.showImport = true;
    },
    fileChange(e) {
      const file = e.currentTarget.files[0];
      if (!file) return;
      this.uploadFile = file;
      const arr = this.uploadFile.name.split(".");
      if (
        !(arr[arr.length - 1] === "xls") &&
        !(arr[arr.length - 1] === "xlsx")
      ) {
        this.uploadFile = {};
        this.$message.error("请选择.xls或者.xlsx格式的表格文件！");
      }
    },
    deleteFile() {
      this.uploadFile = {};
      this.$refs.fileEl.value = "";
    },
    upFile() {
      if (!this.uploadFile.name) {
        this.$message.error("请先选择文件");
        return;
      }
      const f = new FormData();
      f.append(this.uploadFile.name, this.uploadFile);
      this.fileLoading = true;
      const token = window.localStorage.getItem("Token");
      const api =
        window._config.fileServer +
        "/f/upload/300002/?partnerId=10000&token=" +
        token;
      axios.post(api, f).then(res => {
        if (res.data.ResponseId === 0) {
          UploadExcle({
            fileName: res.data.Data.fileName
          })
            .then(response => {
              this.fileLoading = false;
              this.showImport = false;
              this.$message.success("订单导入成功");
              this.getOrderList();
            })
            .catch(msg => {
              this.upfileerror = msg.Data.Errors;
              // this.$message.error(str)
              this.fileLoading = false;
            });
        } else {
          this.fileLoading = false;
          this.$message.error(res.data.Message);
        }
      });
    },
    //备注
    onRemarks(item) {
      this.remarksModal = true;
      this.remarks = "";
      this.remarksOrder = item.OrderCode;
    },
    //确认备注
    submitRemarks() {
      if (this.remarks === "") {
        this.$message.error("请输入备注");
        return;
      }
      const p = {
        OrderCode: this.remarksOrder,
        Remarks: this.remarks
      };
      SubmitRemark(p).then(res => {
        this.$message.success("备注成功");
        this.remarksModal = false;
        this.getOrderList();
      });
    },
    //追加备注
    onAddRemarks(item) {
      this.addRemarksModal = true;
      this.addRemarks = "";
      this.addRemarksOrder = item.OrderCode;
    },
    //确认追加备注
    submitAddRemarks() {
      if (this.addRemarks === "") {
        this.$message.error("请输入追加备注");
        return;
      }
      const p = {
        OrderCode: this.addRemarksOrder,
        AppendMemoOfSupplier: this.addRemarks
      };
      SubmitAddRemark(p).then(res => {
        this.$message.success("追加备注成功");
        this.addRemarksModal = false;
        this.getOrderList();
      });
    },
    onRefund(item) {
      this.refundRadio = "";
      this.refundOrderVisible = true;
      this.refundOrder = item.OrderCode;
    },
    subRefund() {
      if (this.refundRadio === "") {
        this.$message.error("请选择退款理由");
      } else {
        const p = {
          remarks: this.refundRadio,
          refundType: 1,
          OrderCode: this.refundOrder
        };
        OrderRefund(p).then(res => {
          this.$message.success("申请退款成功");
          this.refundOrderVisible = false;
          this.getOrderList();
        });
      }
    },
    onMfd(item) {
      this.showMfd = true;
      this.mfdDesc = "";
      this.mfdOrder = item.OrderCode;
    },
    subMfd() {
      if (this.mfdDesc === "") {
        this.$message.error("请输入作废原因");
        return;
      }
      const p = {
        OrderCode: this.mfdOrder,
        mfdDesc: this.mfdDesc
      };
      if (this.isBatchMfd) {
        let a = [];
        this.checkBox.map(v => {
          a.push(v.orderCode);
        });
        batchZuoFei({
          OrderCodes: a.join(","),
          mfdDesc: this.mfdDesc
        }).then(res => {
          this.showMfd = false;
          this.isBatchMfd = false;
          this.$message.success(res);
          this.onPageChange(1);
        });
      } else {
        SubMfd(p).then(res => {
          this.showMfd = false;
          this.$message.success("订单作废成功");
          this.getOrderList();
        });
      }
    },
    onEdit(item) {
      this.$router.push({
        path: "/orderDetail",
        query: {
          id: item.OrderCode
        }
      });
    },
    //回退按钮触发事件
    onBack(item) {
      this.showBack = true;
      this.backDesc = "";
      this.backOrder = item.OrderCode;
    },
    //触发确认回退
    subBack() {
      if (this.backDesc === "") {
        this.$message.error("请输入回退原因");
        return;
      }
      const p = {
        orderCode: this.backOrder,
        desc: this.backDesc
      };
      SubBack(p).then(res => {
        this.showBack = false;
        this.$message.success("订单回退成功");
        this.getOrderList();
      });
    },
    onPay(item) {
      this.payOrder = item.OrderCode;
      this.payDialog = true;
    },
    getPay() {
      this.payDialog = false;
      switch (this.payType) {
        case 2:
          this.bankPay();
          break;
        default:
          this.tlPay();
          break;
      }
    },
    bankPay() {
      const u =
        "/payCenter/tonglianPay/operationAdmin/tlWebOperationAdminUnionPay.aspx/";
      const url =
        window._config.url +
        u +
        "?token=" +
        localStorage.getItem("Token") +
        "&orderNo=" +
        this.payOrder +
        "&partnerId=10000";
      window.open(url, "_blank");
      this.$alert("查询支付状态", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          this.checkPaySuccess();
        }
      });
    },
    tlPay() {
      this.payText = this.payType === 0 ? "支付宝扫码" : "微信扫码";
      OrderPay({
        payType: this.payType === 0 ? "A01" : "W01",
        orderNo: this.payOrder
      }).then(res => {
        const url = JSON.parse(res).Payinfo;
        this.qrCodeShow = true;
        this.$nextTick(() => {
          this.createCode(url);
        });
      });
    },
    createCode(url) {
      const el = this.$refs.wepayCode;
      el.innerHTML = "";
      this.wePayQrcode = new window.QRCode(el, {
        text: url,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
      this.rollCheck();
    },
    rollCheck() {
      let c = 0;
      window.clearInterval(window.RollCheck);
      window.RollCheck = setInterval(() => {
        this.checkPaySuccess();
        c++;
        if (c === 100) {
          window.clearInterval(window.RollCheck);
        }
      }, 3000);
    },
    checkPaySuccess() {
      axios
        .post(
          window._config.url +
            "/i/want/300142?partnerId=10000&token=" +
            window.localStorage.getItem("Token"),
          {
            OrderCode: this.payOrder
          }
        )
        .then(res => {
          if (res.data.ResponseId === 0) {
            this.qrCodeShow = false;
            this.$message.success("支付成功");
            this.getOrderList();
            window.clearInterval(window.RollCheck);
          } else {
            if (this.payType === 2) {
              this.$message.error(res.data.Message);
            }
          }
        });
    },
    batchToPay() {
      this.confirmBatchPay = true;
      let query = "";
      this.batchOrderCodes = this.checkBox.map(item => {
        return item.OrderCode;
      });
      query = stringify({
        partnerId: PartnerId,
        token: window.localStorage.getItem("Token"),
        orderCodes: this.batchOrderCodes.join(",")
      });
      const href = `${Ip}${Batch_url}?${query}`;
      window.open(href, "_blank");
    },
    checkBatchPay() {
      this.confirmBatchPay = false;
      CheckBatChPay({
        orderCodes: this.batchOrderCodes.join(",")
      }).then(res => {
        this.$message.success("批量支付成功");
        this.getOrderList();
      });
    },
    batchToSend() {
      let type;
      let b = true;
      this.checkBox.forEach(item => {
        if (type === void 0) {
          type = item.StoreTypeId;
        } else {
          if (type !== item.StoreTypeId || item.StoreTypeDesc === "") {
            b = false;
          }
        }
      });
      if (!b) {
        this.cantxt =
          "选中的待申报订单包含不同的保税仓或未选择仓库，请重新选择";
      } else {
        this.showSend = true;
      }
    },
    batchToSendPayOrder() {
      this.batchOrderCodes = this.checkBox.map(item => {
        return item.OrderCode;
      });
      batchSendPayOrder({
        orderCodes: this.batchOrderCodes.join(",")
      })
        .then(res => {
          this.$message.success("申报支付单成功");
          this.getOrderList();
        })
        .catch(res => {
          let str = "";
          res.Data.Errors.map(v => {
            str += v + "<br/>";
          });
          this.$alert(str, "申报支付单错误", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定"
          });
          return;
        });
    },
    goSend() {
      this.batchOrderCodes = this.checkBox.map(item => {
        return item.OrderCode;
      });
      if (this.ExpCode == "") {
        this.$message.error("请选择物流公司");
        return;
      }
      BatchOrderSend({
        orderCodes: this.batchOrderCodes.join(","),
        UserId: localStorage.getItem("UserId"),
        ExpCode: this.ExpCode
      })
        .then(res => {
          this.showSend = false;
          this.ExpCode = "";
          this.getOrderList();
        })
        .catch(res => {
          this.showSend = false;
        });
    },
    batchToReceive() {
      this.batchOrderCodes = this.checkBox.map(item => {
        return item.OrderCode;
      });
      BatchOrderReceive({
        orderCodes: this.batchOrderCodes.join(","),
        UserId: localStorage.getItem("UserId")
      })
        .then(res => {
          this.showReceive = false;
          this.getOrderList();
        })
        .catch(res => {
          this.showReceive = false;
        });
    }
  },
  created() {
    this.getShopList();
    this.getYcType();
    if (this.$route.query.id) {
      this.orderStatusList.map((v, index) => {
        if (v.status === parseInt(this.$route.query.id)) {
          this.activeTab = v.name;
          this.tabClick({
            index: index
          });
        }
      });
    } else {
      this.paramsInit();
      this.getDictionary();
      this.getOrderList();
    }
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  activated() {}
};
</script>
<style>
.order_top .el-tabs__nav-wrap {
  height: 60px;
}
.order_top .el-tabs__nav-scroll {
  margin-top: 10px;
  overflow: visible;
}
</style>

<style lang="scss" scoped>
.fz14 {
  font-size: 14px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}

.align_left {
  text-align: left;
}

.goods_con {
  display: flex;
  box-sizing: border-box;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
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

p {
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

.list_box {
  .btn_group {
    .btn_item {
      padding: 10px 0;
      border-top: 1px solid #eee;

      .pan-btn {
        line-height: 1.5;
      }
    }
  }
}

.text_center {
  text-align: center;
}

.size14 {
  font-size: 14px;
  line-height: 1.5;
}

.el-button--text {
  display: none !important;
}
</style>