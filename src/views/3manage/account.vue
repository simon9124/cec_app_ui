<template>
  <div class="dooya-container">
    <Card>
      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Button type="success"
                icon="md-add"
                @click="insert">新增用户</Button>
      </div>

      <!-- 表格 -->
      <Table :data="tableData"
             :columns="tableColumns"
             stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-sizer
                :total="tableDataOrg.length"
                :current="1"
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Card>

    <!-- Modal -->
    <Modal v-model="modalShow"
           :mask-closable="false"
           :closable="false"
           footer-hide
           title="账号详情"
           @on-ok="handleSubmit">
      <Form ref="formModalData"
            :model="modalData"
            :rules="formModalRule"
            :label-width="100"
            @submit.native.prevent>
        <FormItem label="账号："
                  prop="user_name">
          <Input type="text"
                 v-model="modalData.user_name"></Input>
        </FormItem>
        <FormItem label="姓名："
                  prop="display_name">
          <Input type="text"
                 v-model="modalData.display_name"></Input>
        </FormItem>
        <FormItem label="手机号："
                  prop="user_phone">
          <Input type="text"
                 v-model="modalData.user_phone"></Input>
        </FormItem>
        <FormItem label="用户组："
                  prop="group_id">
          <Select v-model="modalData.group_id">
            <Option v-for="group in userGroup"
                    :value="group.group_id"
                    :key="group.group_id">{{ group.group_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色："
                  prop="user_access">
          <Select v-model="modalData.user_access"
                  multiple
                  :max-tag-count="3">
            <Option value="super_admin">超级管理员</Option>
            <Option value="admin">管理员</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSubmit('formModalData')">确定</Button>
          <Button @click="handleReset('formModalData')"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// import list from './mockData/account';
// import axios from 'axios';
import {
  getUserList,
  getUserData,
  insertUser,
  updateUser,
  deleteUser
} from "@/api/user/index";
import { getUseGroupList } from "@/api/userGroup/index";
import { validateTel } from "@/libs/validate";

export default {
  data() {
    return {
      // 原始数据
      tableDataOrg: [],
      // 处理后的当页数据
      tableData: [],
      // 表头列项
      tableColumns: [
        {
          title: "账号",
          key: "user_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "姓名",
          key: "display_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "电话",
          key: "user_phone",
          align: "center",
          minWidth: 120
        },
        {
          title: "用户组",
          key: "group_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  icon: "ios-create-outline"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.edit(params.row);
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "warning",
                  size: "small",
                  icon:
                    params.row.lock_flag === "0" ? "ios-key-outline" : "ios-key"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.lock(params.row);
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "error",
                  size: "small",
                  icon: "md-close"
                },
                on: {
                  click: () => {
                    this.delete(params.row);
                  }
                }
              })
            ]);
          }
        }
      ],
      // 页码
      pageNum: 1,
      // 每页显示数量
      pageSize: 10,
      // modal弹框 - 是否显示
      modalShow: false,
      // modal弹框 - 数据
      modalData: {},
      // modal弹框 - form规则
      formModalRule: {
        user_name: [
          { required: true, message: "请输入账户名", trigger: "blur" },
          { type: "string", max: 20, message: "账户名过长", trigger: "change" }
        ],
        user_phone: [
          {
            required: true,
            trigger: "blur",
            validator: function(rule, value, callback) {
              if (!validateTel(value)) {
                callback(new Error("手机号格式不正确"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // modal弹框 - 用户组数据
      userGroup: [],
      // modal弹框 - 类型
      modalDataType: ""
    };
  },
  async created() {
    this.getData();
    // 用户组 -> select选框用
    this.userGroup = (await getUseGroupList()).data.data;
  },
  methods: {
    // 获取首页数据
    async getData() {
      // 用户
      this.tableDataOrg = (await getUserList()).data.data;
      this.refreshData();
    },
    // 根据条件刷新数据
    refreshData() {
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.refreshData();
    },
    // 每页条数变化
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.refreshData();
    },
    // 点击按钮 - 新增
    insert() {
      this.modalDataType = "insert";
      this.modalData = {};
      this.modalShow = true;
    },
    // 点击按钮 - 详情
    async edit(row) {
      if (!this.isMock) {
        // 非mock时
        this.modalDataType = "edit";
        this.modalData = (await getUserData(row.user_id)).data.data;
        this.modalShow = true;
      } else {
        // mock时
        this.modalDataType = "edit";
        this.modalData = row;
        this.modalData.group_id =
          this.modalData.group_name === "开发组" ? "001" : "002";
        this.modalShow = true;
      }
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          this.modalData.userAccess = this.modalData.user_access.join(",");
          switch (this.modalDataType) {
            case "insert":
              if (!this.isMock) {
                // 非mock时
                this.modalData.user_avator = "";
                await insertUser(this.modalData);
                this.modalShow = false;
                this.getData();
              } else {
                // mock时
                this.modalData.group_name =
                  this.modalData.group_id === "001" ? "开发组" : "产品组";
                this.modalData.user_id = (
                  this.tableDataOrg.length + 1
                ).toString();
                this.tableDataOrg.push(this.modalData);
                this.refreshData();
                this.$Message.success("添加成功!");
                this.modalShow = false;
              }
              break;
            case "edit":
              if (!this.isMock) {
                // 非mock时
                this.modalData.user_avator = "";
                await updateUser(this.modalData);
                this.modalShow = false;
                this.getData();
              } else {
                // mock时
                // console.log(this.modalData.user_id);
                this.tableData.forEach(list => {
                  if (this.modalData.user_id === list.user_id) {
                    this.$set(
                      list,
                      "group_name",
                      this.modalData.group_id === "001" ? "开发组" : "产品组"
                    );
                  }
                });
                this.refreshData();
                this.$Message.success("修改成功!");
                this.modalShow = false;
              }
              break;
          }
        }
      });
    },
    // 点击表单按钮 - 取消
    handleReset() {
      // this.$refs.formModalData.validate(valid => {
      //   if (valid) {
      this.modalShow = false;
      this.modalData = {};
      //   } else {
      //     this.$Message.error('有未填写的内容！');
      //   }
      // });
    },
    // 点击按钮 - 锁定/解锁
    async lock(row) {
      row.lock_flag = row.lock_flag === "0" ? "1" : "0";
      if (!this.isMock) {
        // 非mock时
        await updateUser(row);
      } else {
        // mock时
        this.$Message.success("修改成功!");
      }
    },

    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除该用户？",
        onOk: async () => {
          if (!this.isMock) {
            // 非mock时
            await deleteUser(row.user_id);
            this.getData();
          } else {
            // mock时
            this.tableData.forEach(list => {
              if (row.user_id === list.user_id) {
                const index = this.tableDataOrg.indexOf(list);
                this.tableDataOrg.splice(index, 1);
              }
            });
            this.$Message.success("删除成功");
            this.refreshData();
          }
        },
        closable: true
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
