<template>
  <div class="dooya-container">
    <Card>

      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Button type="success"
                icon="md-add"
                style="margin-right: 10px"
                @click="insert">新增sn码</Button>
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
            :label-width="80"
            @submit.native.prevent>
        <FormItem label="SOP1："
                  prop="qc1Sop">
          <Select v-model="modalData.qc1Sop"
                  placeholder="请输入SOP1">
            <Option v-for="(item,i) in qc1List"
                    :value="item.sop"
                    :key="i">{{ item.sop }}</Option>
          </Select>
        </FormItem>
        <FormItem label="SOP2："
                  prop="qc2Sop">
          <Select v-model="modalData.qc2Sop"
                  placeholder="请输入SOP2">
            <Option v-for="(item,i) in qc2List"
                    :value="item.sop"
                    :key="i">{{ item.sop }}</Option>
          </Select>
        </FormItem>
        <FormItem label="SOP2："
                  prop="qc3Sop">
          <Select v-model="modalData.qc3Sop"
                  placeholder="请输入SOP3">
            <Option v-for="(item,i) in qc3List"
                    :value="item.sop"
                    :key="i">{{ item.sop }}</Option>
          </Select>
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
import snCodeList from "./mockData/snCode";
// api
import { getSopByQcIndex } from "@/api/process";
import { findSnWithPage, addSn, editSn, removeSn } from "@/api/snCode";

export default {
  data() {
    return {
      // qc1、qc2、qc3的下拉列表
      qc1List: [],
      qc2List: [],
      qc3List: [],
      // table外层对象
      dataResult: {},
      // table数据
      tableData: [],
      // table表头
      tableColumns: [
        {
          title: "SOP1",
          key: "qc1Sop",
          align: "center",
          minWidth: 120
        },
        {
          title: "SOP2",
          key: "qc2Sop",
          align: "center",
          minWidth: 120
        },
        {
          title: "SOP3",
          key: "qc3Sop",
          align: "center",
          minWidth: 120
        },
        {
          title: "sn码",
          key: "sn",
          align: "center",
          minWidth: 100
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
      modalData: {},
      // modal弹框 - form规则
      formModalRule: {
        qc1Sop: [{ required: true, message: "请输入SOP1", trigger: "blur" }],
        qc2Sop: [{ required: true, message: "请输入SOP2", trigger: "blur" }],
        qc3Sop: [{ required: true, message: "请输入SOP3", trigger: "blur" }]
      },
      // modal弹框 - 类型
      modalDataType: ""
    };
  },
  async created() {
    this.getData();
    // 获取下拉数据
    this.getQcSelect();
  },
  methods: {
    // 分别获取3个下拉框数据
    async getQcSelect() {
      this.qc1List = (await getSopByQcIndex("1")).data.data;
      this.qc2List = (await getSopByQcIndex("2")).data.data;
      this.qc3List = (await getSopByQcIndex("3")).data.data;
    },
    // 获取首页数据
    async getData() {
      if (!this.isMock) {
        // 非mock时
        this.tableLoading = true;
        this.dataResult = (await findSnWithPage(
          this.pageNum,
          this.pageSize
        )).data.data;

        // 如果是在删除之后获取的数据 -> 如果删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
        if (
          this.dataResult.pageData.length === 0 &&
          this.dataResult.pageIndex !== 1
        ) {
          this.pageNum--;
          this.getData();
        }

        this.tableLoading = false;
      } else {
        // mock时
        this.tableData = snCodeList;
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
      this.modalData = {};
      this.modalShow = true;
    },
    // 点击按钮 - 详情
    async edit(row) {
      this.modalDataType = "edit";
      this.modalData = JSON.parse(JSON.stringify(row));
      this.modalShow = true;
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          switch (this.modalDataType) {
            case "insert":
              if (!this.isMock) {
                // 非mock时
                const result = (await addSn(this.modalData)).data.status;
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
                const result = (await editSn(this.modalData)).data.status;
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
      });
    },
    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除该sn码？",
        onOk: async () => {
          if (!this.isMock) {
            // 非mock时
            const result = (await removeSn(row.sn)).data.status;
            if (result === 200) {
              this.$Message.success("删除成功！");
            }
            this.getData();
          } else {
            // mock时
            this.tableData.forEach(list => {
              if (row.sn === list.sn) {
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
  // .ivu-table-body {
  // overflow: hidden;
  // }
  .ivu-table-cell {
    padding: 0;
  }
}
</style>
