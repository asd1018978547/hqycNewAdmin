<template>
  <div class="menu-wrapper">
    <el-menu-item index='/main'>
        <template slot='title'>
            <svg-icon icon-class="dashboard"></svg-icon>
            <span slot="title">首页</span>
        </template>
    </el-menu-item>
    <el-submenu :index='toString(index)' v-for="(item,index) in routes" :key='index'>
      <template slot='title'>
          <svg-icon icon-class="zip"></svg-icon>
          <span slot="title">{{item.Item}}</span>
      </template>
      <el-menu-item-group :title="ite.Item" v-for='(ite,key) in item.ChildMenu' :key="key">
        <el-menu-item :disabled='i.Url == "#"' v-for='(i,idx) in ite.ChildMenu' :index="i.Url" :key='idx' :route='{ path: i.Url }'>{{i.Item}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toString(str) {
        return str.toString()
      }
    }
  }
</script>