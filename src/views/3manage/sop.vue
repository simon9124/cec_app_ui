<template>
  <div class="dooya-container">
    <Card>

      <Tabs value="qc1"
            @on-click="tabSelect">

        <!-- 综合检测 -->
        <TabPane label="综合检测"
                 name="qc1">

          <!-- 操作 -->
          <div style="margin: 10px 0">
            <Button type="success"
                    icon="md-add"
                    style="margin-right: 10px"
                    @click="insert">新增SOP</Button>
          </div>

          <!-- 表格 -->
          <Table border
                 disabled-hover
                 :loading="tableLoading"
                 :data="isMock?tableData:dataResult.pageData"
                 :columns="tableColumns"
                 stripe>
          </Table>

          <!-- 分页 -->
          <div v-if="!isMock"
               style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-sizer
                    :total="dataResult.dataCount"
                    :current="1"
                    :page-size-opts="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
          </div>

        </TabPane>

        <!-- 静音检测 -->
        <TabPane label="静音检测"
                 name="qc2">

          <!-- 操作 -->
          <div style="margin: 10px 0">
            <Button type="success"
                    icon="md-add"
                    style="margin-right: 10px"
                    @click="insert">新增SOP</Button>
          </div>

          <!-- 表格 -->
          <Table border
                 disabled-hover
                 :loading="tableLoading"
                 :data="isMock?tableData:dataResult.pageData"
                 :columns="tableColumns"
                 stripe>
          </Table>

          <!-- 分页 -->
          <div v-if="!isMock"
               style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-sizer
                    :total="dataResult.dataCount"
                    :current="1"
                    :page-size-opts="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
          </div>

        </TabPane>

      </Tabs>

    </Card>

    <!-- Modal -->
    <Modal v-model="modalShow"
           :mask-closable="false"
           :closable="false"
           footer-hide
           :title="modalDataType==='edit'?'编辑SOP':'新增SOP'"
           @on-ok="handleSubmit">
      <Form ref="formModalData"
            :model="modalData"
            :rules="formModalRule"
            :label-width="60"
            @submit.native.prevent>
        <FormItem label="名称："
                  prop="sop">
          <Input type="text"
                 v-model="modalData.sop"
                 placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="描述："
                  prop="sopDescription">
          <Input type="text"
                 v-model="modalData.sopDescription"
                 placeholder="请输入描述，30字以内"></Input>
        </FormItem>
        <FormItem label="工序："
                  prop="describe"
                  style="margin-bottom: 14px">
          <Row v-for="(item,i) in modalDataDescribe"
               :key="i"
               style="margin-bottom: 10px">
            <Col span="12"
                 style="margin-right: 10px">
            <Input :value="item"
                   @on-blur="inputBlur(i)"
                   placeholder="请输入工序名称"></Input>
            </Col>
            <Col span="8">
            <Button type="info"
                    icon="md-arrow-up"
                    size="small"
                    style="margin-right: 5px"
                    @click="processToggle(i,'up')"></Button>
            <Button type="info"
                    icon="md-arrow-down"
                    size="small"
                    style="margin-right: 5px"
                    @click="processToggle(i,'down')"></Button>
            <Button type="success"
                    icon="md-add"
                    size="small"
                    style="margin-right: 5px"
                    @click="modalDataDescribe.push('')"></Button>
            <Button type="error"
                    icon="md-close"
                    size="small"
                    :disabled="modalDataDescribe.length===1"
                    @click="modalDataDescribe.splice(i, 1);"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSubmit('formModalData')">确定</Button>
          <Button @click="modalShow=false"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
// mockData
import sopList from "./mockData/sop";
// api
import { findSopByPage, addSop, editSop, removeSop } from "@/api/process";

export default {
  data() {
    return {
      // 顶部tab切换
      tabSelected: 1,
      // table外层对象
      dataResult: {},
      // table数据
      tableData: [],
      // table表头
      tableColumns: [
        {
          title: "名称",
          key: "sop",
          align: "center",
          minWidth: 100
        },
        {
          title: "描述",
          key: "sopDescription",
          // align: "center",
          minWidth: 180
        },
        {
          title: "工序",
          key: "describe",
          // align: "center",
          render: (h, params) => {
            return h("div", [
              params.row.items.split(",").map(item => {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "blue"
                    }
                  },
                  item
                );
              })
            ]);
          },
          minWidth: 500
        },
        {
          title: "操作",
          key: "action",
          minWidth: 120,
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
      // loading
      tableLoading: false,
      // 页码
      pageNum: 1,
      // 每页显示数量
      pageSize: 10,
      // modal弹框 - 是否显示
      modalShow: false,
      // modal弹框 - 数据
      modalData: {
        items: "前置工序,顺转一,顺转二,顺转三,逆转一,逆转二,逆转三"
      },
      // 编辑SOP工序顺序时临时的数组
      modalDataDescribe: [
        "前置工序",
        "顺转一",
        "顺转二",
        "顺转三",
        "逆转一",
        "逆转二",
        "逆转三"
      ],
      // 编辑SOP工序顺序时临时的数组 - copy
      processTemporary: [],
      // modal弹框 - form规则
      formModalRule: {
        sop: [{ required: true, message: "请输入SOP名称", trigger: "blur" }],
        sopDescription: [
          { required: true, message: "请输入SOP描述", trigger: "blur" },
          {
            type: "string",
            max: 30,
            message: "描述过长",
            trigger: "change"
          }
        ]
      },
      // modal弹框 - 类型
      modalDataType: ""
    };
  },
  async created() {
    this.getData();
  },
  methods: {
    // 顶部tab被选择
    tabSelect(name) {
      this.tabSelected = name === "qc1" ? 1 : 2;
      this.getData();
    },
    // 获取首页数据
    async getData() {
      if (!this.isMock) {
        // 非mock时
        this.tableLoading = true;
        this.dataResult = (await findSopByPage(
          this.pageNum,
          this.pageSize,
          this.tabSelected
        )).data.data;
        this.tableLoading = false;
      } else {
        // mock时
        this.tableData = sopList;
      }
      this.refreshData();
    },
    // 根据条件刷新数据
    refreshData() {
      // this.tableData = this.tableData;
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    // 每页条数变化
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getData();
    },
    // 点击按钮 - 新增
    insert() {
      this.modalDataType = "insert";
      this.modalData = {
        items: "前置工序,顺转一,顺转二,顺转三,逆转一,逆转二,逆转三"
      };
      this.modalDataDescribe = this.modalData.items.split(",");
      this.processTemporary = this.modalDataDescribe;
      this.modalShow = true;
    },
    // 点击按钮 - 详情
    async edit(row) {
      this.modalDataType = "edit";
      this.modalData = JSON.parse(JSON.stringify(row));
      this.modalDataDescribe = this.modalData.items.split(",");
      this.processTemporary = this.modalDataDescribe;
      this.modalShow = true;
    },
    // 工序重新排序
    processToggle(index, handle) {
      if (handle === "up") {
        // 上移
        if (index !== 0) {
          const toExchange = this.processTemporary[index - 1];
          this.$set(
            this.modalDataDescribe,
            index - 1,
            this.processTemporary[index]
          );
          this.$set(this.modalDataDescribe, index, toExchange);
        }
      } else {
        // 下移
        if (index !== this.modalDataDescribe.length - 1) {
          const toExchange = this.processTemporary[index + 1];
          this.$set(
            this.modalDataDescribe,
            index + 1,
            this.processTemporary[index]
          );
          this.$set(this.modalDataDescribe, index, toExchange);
        }
      }
    },
    // 工序input输入框失去焦点
    inputBlur(index) {
      this.$set(this.modalDataDescribe, index, event.target.value);
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          if (this.modalDataDescribe.some(item => item === "")) {
            this.$Message.error("工序未填写完整");
          } else {
            this.modalData.items = this.modalDataDescribe;
            this.modalData.qc = this.tabSelected;
            // console.log(this.modalData);
            switch (this.modalDataType) {
              case "insert":
                if (!this.isMock) {
                  // 非mock时
                  const result = (await addSop(this.modalData)).data.status;
                  if (result === 200) {
                    this.$Message.success("添加成功！");
                  }
                  this.modalShow = false;
                  this.getData();
                } else {
                  // mock时
                  this.$Message.success("添加成功！");
                  this.getData();
                  this.modalShow = false;
                }
                break;
              case "edit":
                if (!this.isMock) {
                  // 非mock时
                  const result = (await editSop(this.modalData)).data.status;
                  if (result === 200) {
                    this.$Message.success("修改成功！");
                  }
                  this.modalShow = false;
                  this.getData();
                } else {
                  // mock时
                  this.$Message.success("修改成功！");
                  this.getData();
                  this.modalShow = false;
                }
                break;
            }
          }
        }
      });
    },
    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除该SOP？",
        onOk: async () => {
          if (!this.isMock) {
            // 非mock时
            const result = (await removeSop(row.sop)).data.status;
            if (result === 200) {
              this.$Message.success("删除成功！");
            }
            this.getData();
          } else {
            // mock时
            this.tableData.forEach(list => {
              if (row.sop === list.sop) {
                const index = this.tableData.indexOf(list);
                this.tableData.splice(index, 1);
              }
            });
            this.$Message.success("删除成功");
            this.getData();
          }
        },
        closable: true
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-table-body {
    overflow: hidden;
  }
  .ivu-table {
    th {
      text-align: center;
    }
  }
  // .ivu-table-cell {
  // padding: 0;
  // }
}
</style>
