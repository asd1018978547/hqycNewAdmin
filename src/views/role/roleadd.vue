<template>
  <div class="content_box roleadd">
    <sticky className="sub-navbar">
      {{ $route.meta.title }}
      <el-button class="pan-btn green-btn" type="success" @click='save' size='small'>提交保存</el-button>
    </sticky>
    <div class="desc">
      <div class="item">
        <div class="title">角色名称：</div>
        <div class="item_desc">
          <el-input v-model="Role" size='small' placeholder="请输入角色名称"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="title">说明：</div>
        <div class="item_desc">
          <el-input v-model="Desc" resize='none' size='small' type='textarea' :rows='3' placeholder="请输入角色说明"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="title">角色功能：</div>
        <div class="item_desc">
          <el-tree show-checkbox :highlight-current='true' :data="list" node-key='ItemId' :props="defaultProps"
            :default-expanded-keys='[0]' ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if='data.Level > 2'>
                <el-button type="text" size="mini" @click="() => showBtn(node, data)">查看权限按钮</el-button>
              </span>
            </span>
          </el-tree>
        </div>
        <div class="tree_desc" v-if='btn != null'>
          <p class="tree_title">{{ btn.Item }}-权限按钮列表</p>
          <div class="tree_add">
            <el-select class="te_a" v-model="btnAddVal" filterable placeholder="请选择按钮">
              <el-option v-for="item in btnList" :key="item.FunctionId" :label="item.FunctionName" :value="item.FunctionId">
              </el-option>
            </el-select>
            <el-input v-model="add_weight" placeholder="请输入权重"></el-input>
            <el-input v-model="add_url" placeholder="请输入URL"></el-input>
            <el-button type="primary" @click='btnAdd'>添加</el-button>
          </div>
          <div class="tree_list">
            <el-tag class="tree_tag" v-for="tag in btn.MenuFunction" :key="tag.FunctionName" closable :type="tag.isCheck ? '' : 'info'"
              @close='removeTag(tag)'>
              <el-checkbox class='fz12' v-model="tag.isCheck">{{tag.FunctionName}}（备注：{{tag.Remark}}）（URL：{{
                tag.ActionUrl }}）</el-checkbox>
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Sticky from '@/components/Sticky'
  import { getRole, addRole, getRoleInfo, editRole } from '@/api/role/roleadd'
  import { getBtnList, addMenuBtn, delMenuBtn } from '@/api/button/button'
  export default {
    components: { Sticky },
    data() {
      return {
        Role: '',
        Desc: '',
        btnAddVal: '',
        filterText: '',
        list: [],
        isedit: false,
        add_weight: '',
        add_url: '',
        roleId: '',
        btn: null,
        btnList: [],
        defaultProps: {
          children: 'ChildMenu',
          label: 'Item'
        }
      }
    },
    methods: {
      btnAdd() {
        if (this.btnAddVal === '') {
          this.$message.error('请选择按钮')
          return
        } else if (this.add_weight === '') {
          this.$message.error('请填写权重')
          return
        } else if (this.add_url === '') {
          this.$message.error('请填写url')
          return
        } else {
          addMenuBtn({
            menuId: this.btn.ItemId,
            functionId: this.btnAddVal,
            weight: this.add_weight,
            actionUrl: this.add_url
          }).then(res => {
            this.$message.success('添加成功')
            this.btnList.map(v => {
              if (parseInt(v.FunctionId) === parseInt(this.btnAddVal)) {
                this.checkList(this.btn, v, false)
              }
            })
            this.btnAddVal = ''
            this.add_weight = ''
            this.add_url = ''
            this.showBtn(null, this.btn)
          })
        }
      },
      checkList(node, data, isDel) {
        this.list[0].ChildMenu.map(level_1 => {
          level_1.ChildMenu.map(level_2 => {
            level_2.ChildMenu.map(level_3 => {
              if (node.Level === 3) {
                if (node.ItemId === level_3.ItemId && node.PItemId === level_3.PItemId) {
                  let f = false
                  level_3.MenuFunction.map((v, i) => {
                    if (v.FunctionId === data.FunctionId) {
                      f = true
                      if (isDel) {
                        level_3.MenuFunction.splice(i, 1)
                      }
                    }
                  })
                  if (!f) {
                    level_3.MenuFunction.push(data)
                  }
                  return
                }
              } else {
                level_3.ChildMenu.map(level_4 => {
                  if (node.ItemId === level_4.ItemId && node.PItemId === level_4.PItemId) {
                    let f = false
                    level_4.MenuFunction.map((v, index) => {
                      if (v.FunctionId === data.FunctionId) {
                        f = true
                        if (isDel) {
                          level_4.MenuFunction.splice(index, 1)
                        }
                      }
                    })
                    if (!f) {
                      level_4.MenuFunction.push(data)
                    }
                    return
                  }
                })
              }
            })
          })
        })
      },
      removeTag(item) {
        this.$confirm('确定要解绑按钮吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delMenuBtn({
            menuId: this.btn.ItemId,
            functionId: item.FunctionId
          }).then(res => {
            this.$message.success('解绑成功')
            this.checkList(this.btn, item, true)
            this.showBtn(null, this.btn)
          })
        })
      },
      showBtn(node, data) {
        let par = ''
        data.MenuFunction.map(v => {
          par += v.FunctionId + ','
        })
        getBtnList({
          pageIndex: 1,
          pageSize: 99999,
          notfunctionIds: par
        }).then(res => {
          res.Data.map(v => {
            v.isCheck = false
          })
          this.btnList = res.Data
          this.btn = data
        })
      },
      formatMenuIs() {
        const id = this.$refs.tree.getCheckedKeys()
        const arr = this.$refs.tree.getHalfCheckedNodes()
        arr.map(v => {
          if (v.ItemId !== 0) {
            id.push(v.ItemId)
          }
        })
        const ids = []
        for (let x = 0; x < id.length; x++) {
          if (ids.indexOf(id[x]) === -1) {
            ids.push(id[x])
          }
        }
        const para = []
        for (let x = 0; x < ids.length; x++) {
          if (ids[x] === 0) continue
          const o = this.getListItem(ids[x])
          const obj = {}
          obj.menuId = o.ItemId
          obj.functionIds = ''
          o.MenuFunction.map(v => {
            if (v.isCheck) {
              obj.functionIds += v.FunctionId + ','
            }
          })
          if (obj.functionIds.length > 0) {
            obj.functionIds = obj.functionIds.substring(0, obj.functionIds.length - 1)
          }
          para.push(obj)
        }
        return para
      },
      getListItem(id) {
        let obj = null
        this.list[0].ChildMenu.map(level_1 => {
          if (level_1.ItemId === id) {
            obj = level_1
            return
          } else {
            level_1.ChildMenu.map(level_2 => {
              if (level_2.ItemId === id) {
                obj = level_2
                return
              } else {
                level_2.ChildMenu.map((level_3, i) => {
                  if (level_3.ItemId === id) {
                    obj = level_3
                    return
                  } else {
                    level_3.ChildMenu.map(level_4 => {
                      if (level_4.ItemId === id) {
                        obj = level_4
                        return
                      }
                    })
                  }
                })
              }
            })
          }
        })
        return obj
      },
      save() {
        if (this.Role === '') {
          this.$message.error('请输入角色名称')
          return
        }
        if (this.$refs.tree.getCheckedKeys().length < 1) {
          this.$message.error('请至少选择一个权限')
          return
        }
        if (this.isedit) {
          editRole({
            Id: this.roleId,
            Role: this.Role,
            Desc: this.Desc,
            menuFunction: this.formatMenuIs()
          }).then(res => {
            const _this = this
            this.$message.success({
              message: '修改成功',
              duration: 1500,
              onClose() {
                _this.$store.dispatch('delVisitedViews', {
                  name: 'roleadd',
                  path: '/roleadd',
                  title: '编辑角色'
                }).then(res => {
                  _this.$router.push('/rolemanage')
                })
              }
            })
          })
        } else {
          addRole({
            Role: this.Role,
            Desc: this.Desc,
            menuFunction: this.formatMenuIs()
          }).then(res => {
            const _this = this
            this.$message.success({
              message: '添加成功',
              duration: 1500,
              onClose() {
                _this.$store.dispatch('delVisitedViews', {
                  name: 'roleadd',
                  path: '/roleadd',
                  title: '新增角色'
                }).then(res => {
                  _this.$router.push('/rolemanage')
                })
              }
            })
          })
        }
      },
      getData() {
        return new Promise((rs, rj) => {
          getRole().then(res => {
            res.map(level_1 => {
              level_1.ChildMenu.map(level_2 => {
                level_2.ChildMenu.map(level_3 => {
                  level_3.MenuFunction.map(v => {
                    v.isCheck = false
                  })
                  level_3.ChildMenu.map(level_4 => {
                    level_4.MenuFunction.map(i => {
                      i.isCheck = false
                    })
                  })
                })
              })
            })
            const a = []
            a[0] = {}
            a[0].ItemId = 0
            a[0].Item = '全部'
            a[0].ChildMenu = res
            this.list = a
            rs()
          })
        })
      },
      getInfo(id) {
        getRoleInfo({ Id: id }).then(res => {
          res.MenuIds.map(level_1 => {
            if (level_1.Function.length > 0) {
              level_1.Function.map(function_item => {
                this.list[0].ChildMenu.map(list_level_1 => {
                  list_level_1.ChildMenu.map(list_level_2 => {
                    list_level_2.ChildMenu.map(list_level_3 => {
                      if (list_level_3.ItemId === level_1.ItemId) {
                        list_level_3.MenuFunction.map(menu_item => {
                          if (function_item.FunctionId === menu_item.FunctionId) {
                            menu_item.isCheck = true
                          }
                        })
                      }
                    })
                  })
                })
              })
            }
            level_1.Menus.map(level_4 => {
              if (level_4.Function.length > 0) {
                level_4.Function.map(function_item => {
                  this.list[0].ChildMenu.map(list_level_1 => {
                    list_level_1.ChildMenu.map(list_level_2 => {
                      list_level_2.ChildMenu.map(list_level_3 => {
                        list_level_3.ChildMenu.map(list_level_4 => {
                          list_level_4.MenuFunction.map(menu_item => {
                            if (list_level_4.ItemId === menu_item.MenuId) {
                              list_level_4.MenuFunction.map(menu_item => {
                                if (function_item.FunctionId === menu_item.FunctionId) {
                                  menu_item.isCheck = true
                                }
                              })
                            }
                          })
                        })
                      })
                    })
                  })
                })
              }
            })
          })
          this.Role = res.Role
          this.Desc = res.Desc
          this.isedit = true
          this.roleId = id
          this.$refs.tree.setCheckedNodes(res.MenuIds)
        })
      }
    },
    created() {
      this.getData().then(() => {
        if (parseInt(this.$route.query.id) !== -1) {
          this.getInfo(this.$route.query.id)
        } else {
          this.isedit = false
          this.roleId = ''
        }
      })
    },
    activated() {
      // this.getData().then(() => {
      //   if (parseInt(this.$route.query.id) !== -1) {
      //     this.getInfo(this.$route.query.id)
      //   } else {
      //     this.isedit = false
      //     this.roleId = ''
      //   }
      // })
    }
  }
</script>
<style scoped>
  .fz12 {
    font-size: 12px;
  }

  .zw {
    padding: 0 5px;
  }

  .tree_tag {
    margin-bottom: 5px;
    display: block;
  }

  .tree_list {
    box-sizing: border-box;
    padding: 10px;
  }

  .tree_add {
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;
  }

  .te_a {
    width: 100%;
  }

  .tree_title {
    font-size: 16px;
    height: 35px;
    line-height: 35px;
    margin: 0 auto;
    padding: 0 15px;
    border-bottom: 1px solid #e6e6e6;
  }

  .tree_desc {
    margin-left: 10px;
    border: 1px solid #e6e6e6;
    flex: 0 0 600px;
    box-sizing: border-box;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .pan-btn {
    margin-left: 15px;
  }

  a {
    color: #558fe3 !important;
  }

  .desc {
    padding: 0 15px;
    padding-top: 10px;
  }

  .desc .item {
    line-height: 45px;
    display: flex;
    font-size: 14px;
    margin-bottom: 10px
  }

  .desc .item .title {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 10px
  }

  .desc .item .item_desc {
    flex: 0 0 600px;
  }
</style>