<template>
  <div class="dooya-container">
    <Card>

      <div style="margin-bottom: 10px;font-weight:bold">
        当前使用的标准（产品型号）：{{mNumberSelected}}
      </div>

      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Cascader :data="mNumberList"
                  v-model="mNumberSelect"
                  trigger="hover"
                  :render-format="format"
                  style="width:150px;margin-right: 10px;display:inline-block"
                  @on-change="selectOnChange"></Cascader>

        <Button type="warning"
                icon="md-add"
                style="margin-right: 10px"
                @click="mNumberStandardVisible = true">新增标准</Button>
        <Button type="success"
                icon="md-arrow-up"
                style="margin-right: 10px"
                @click="updateStandard">更新标准</Button>
        <Button type="primary"
                icon="md-checkmark"
                @click="useStandard">使用标准</Button>
      </div>

      <!-- 表格 -->
      <Table border
             disabled-hover
             :data="tableData"
             :columns="tableColumns"
             :loading="tableLoading"
             stripe>
      </Table>

      <!-- 检测标准form -->
      <Modal v-model="mNumberStandardVisible"
             title="请填写电机型号"
             footer-hide>
        <!-- @on-visible-change="proLineFormVisibleChange" -->
        <Form :model="mNumberStandardForm"
              :label-width="80"
              ref="mNumberStandardForm"
              :rules="proLineRule">
          <FormItem label="电机型号"
                    prop="mNumber">
            <Input v-model="mNumberStandardForm.mNumber"
                   placeholder="请输入产品型号"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="insertLine">确定</Button>
            <Button style="margin-left: 8px"
                    @click="mNumberStandardVisible=false">取消</Button>
          </FormItem>
        </Form>
      </Modal>

    </Card>
  </div>
</template>

<script>
// function
import { listToCascader } from "@/libs/dataHanding";
// api
import {
  findByProductClass,
  findAllProductClass,
  editByProductClass,
  activeByProductClass
} from "@/api/standard";

export default {
  name: "check-standard",
  data() {
    return {
      // 电机型号list
      mNumberList: [
        {
          label: "DM35",
          value: "DM35",
          children: []
        }
      ],
      // 被选择的型号 - 级联选择
      mNumberSelect: [],
      // 被选择的型号 - 顶部当前使用
      mNumberSelected: "",
      // 型号标准form
      productClass: {
        LineNo: "22",
        productClass: ""
      },
      // 表格数据
      tableData: [
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转一',
        //   testItemCode: '1010',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转一',
        //   testItemCode: '1011',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转一',
        //   testItemCode: '1012',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转一',
        //   testItemCode: '1013',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转一',
        //   testItemCode: '1014',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转二',
        //   testItemCode: '1020',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转二',
        //   testItemCode: '1021',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转二',
        //   testItemCode: '1022',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转二',
        //   testItemCode: '1023',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转二',
        //   testItemCode: '1024',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转三',
        //   testItemCode: '1030',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转三',
        //   testItemCode: '1031',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转三',
        //   testItemCode: '1032',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转三',
        //   testItemCode: '1033',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '顺转三',
        //   testItemCode: '1034',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转一',
        //   testItemCode: '1040',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转一',
        //   testItemCode: '1041',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转一',
        //   testItemCode: '1042',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转一',
        //   testItemCode: '1043',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转一',
        //   testItemCode: '1044',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转二',
        //   testItemCode: '1050',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转二',
        //   testItemCode: '1051',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转二',
        //   testItemCode: '1052',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转二',
        //   testItemCode: '1053',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转二',
        //   testItemCode: '1054',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转三',
        //   testItemCode: '1060',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转三',
        //   testItemCode: '1061',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转三',
        //   testItemCode: '1062',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转三',
        //   testItemCode: '1063',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '综合测试',
        //   testItemName: '逆转三',
        //   testItemCode: '1064',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '静音测试',
        //   testItemName: '顺转噪音',
        //   testItemCode: '2010',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '静音测试',
        //   testItemName: '逆转噪音',
        //   testItemCode: '2020',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '静音测试',
        //   testItemName: '交耐质量',
        //   testItemCode: '2030',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // },
        // {
        //   lineNo: '22',
        //   testItemGroup: '静音测试',
        //   testItemName: '接地质量',
        //   testItemCode: '2040',
        //   productClass: 'DM35R-6/28',
        //   isActive: false,
        //   minValue: 50,
        //   maxValue: 100
        // }
      ],
      /* eslint-disable */
      // 表格列项
      tableColumns: [
        {
          title: "分类",
          key: "testItemGroup",
          align: "center",
          minWidth: 120
        },
        {
          title: "描述",
          key: "testItemName",
          align: "center",
          minWidth: 120
        },
        {
          title: "项目",
          key: "testItemCode",
          align: "center",
          render: (h, params) => {
            if (params.row.testItemCode.toString().substring(0, 2) === "10") {
              return h(
                "span",
                params.row.testItemCode.toString().substr(3, 1) === "0"
                  ? "行程"
                  : params.row.testItemCode.toString().substr(3, 1) === "1"
                  ? "转速"
                  : params.row.testItemCode.toString().substr(3, 1) === "2"
                  ? "电压"
                  : params.row.testItemCode.toString().substr(3, 1) === "3"
                  ? "电流"
                  : "功率"
              );
            } else {
              return h(
                "span",
                params.row.testItemCode === 2020
                  ? "顺转噪音"
                  : params.row.testItemCode === 2030
                  ? "接地质量"
                  : params.row.testItemCode === 2040
                  ? "交耐质量"
                  : "逆转噪音"
              );
            }
          },
          minWidth: 120
        },
        {
          title: "上限",
          key: "maxValue",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display:
                      params.row.editMax === false ? "inline-block" : "none"
                  }
                },
                params.row.maxValue
              ),
              h("Input", {
                props: {
                  value: params.row.maxValue
                },
                style: {
                  display:
                    params.row.editMax === true ? "inline-block" : "none",
                  width: "150px",
                  marginRight: "5px"
                },
                nativeOn: {
                  change: event => {
                    this.$set(
                      this.tableData[params.row._index],
                      "maxValue",
                      event.srcElement.value
                    );
                    params.row.editMax = false;
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "success",
                  size: "small",
                  icon: "md-checkmark"
                },
                style: {
                  display:
                    params.row.editMax === true ? "inline-block" : "none",
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    params.row.editMax = false;
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "warning",
                  size: "small",
                  icon: "md-close"
                },
                style: {
                  display: params.row.editMax === true ? "inline-block" : "none"
                },
                on: {
                  click: () => {
                    params.row.editMax = false;
                  }
                }
              })
            ]);
          },
          minWidth: 180
        },
        {
          title: "下限",
          key: "minValue",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display:
                      params.row.editMin === false ? "inline-block" : "none"
                  }
                },
                params.row.minValue
              ),
              h("Input", {
                props: {
                  value: params.row.minValue
                },
                style: {
                  display:
                    params.row.editMin === true ? "inline-block" : "none",
                  width: "150px",
                  marginRight: "5px"
                },
                nativeOn: {
                  change: event => {
                    this.$set(
                      this.tableData[params.row._index],
                      "minValue",
                      event.srcElement.value
                    );
                    params.row.editMin = false;
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "success",
                  size: "small",
                  icon: "md-checkmark"
                },
                style: {
                  display:
                    params.row.editMin === true ? "inline-block" : "none",
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    params.row.editMin = false;
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "warning",
                  size: "small",
                  icon: "md-close"
                },
                style: {
                  display: params.row.editMin === true ? "inline-block" : "none"
                },
                on: {
                  click: () => {
                    params.row.editMin = false;
                  }
                }
              })
            ]);
          },
          minWidth: 180
        },
        {
          title: "操作",
          key: "action",
          minWidth: 150,
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
                    params.row.editMax = true;
                    params.row.editMin = true;
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
          },
          align: "center"
        }
      ],
      // loading - table
      tableLoading: false,
      // modal弹框 - 是否显示
      mNumberStandardVisible: false,
      // modal弹框 - 电机型号form
      mNumberStandardForm: {
        mNumber: "DM35R-3/28"
      },
      // modal弹框 - 电机型号form规则
      proLineRule: {
        mNumber: [
          { required: true, message: "请输入电机型号", trigger: "change" }
        ]
      }
    };
  },
  async created() {
    // 初始化数据
    await this.init();
    // 根据级联选择初始化表格
    this.getData();
  },
  methods: {
    /* eslint-disable */
    async init() {
      // 电机型号list
      this.mNumberList = listToCascader(
        (await findAllProductClass()).data.data
      );
      // 被选择的选项 - 顶部当前使用
      this.mNumberSelected = localStorage.getItem("mNumberSelected");
      // 判断是否使用过标准
      this.mNumberSelect =
        this.mNumberSelected === null
          ? [
              this.mNumberList[0].value,
              this.mNumberList[0].children[0].value,
              this.mNumberList[0].children[0].children[0].value
            ]
          : [
              this.mNumberSelected.substring(0, 4),
              this.mNumberSelected.split("-")[0],
              this.mNumberSelected
            ];
      this.productClass.productClass = this.mNumberSelect[2];
    },
    // 被选择的选项 - 级联选择器
    async getData() {
      // 根据productClass表单 -> 获取标准项列表
      this.tableLoading = true;
      this.tableData = (await findByProductClass(this.productClass)).data.data;
      this.tableData = this.tableData.map(row => {
        this.$set(row, "editMax", false);
        this.$set(row, "editMin", false);
        return row;
      });
      this.tableLoading = false;
    },
    // 自定义级联选择器选项
    format(labels, selectedData) {
      const index = labels.length - 1;
      return labels[index];
    },
    // 选项发生变化
    selectOnChange(value) {
      this.productClass.productClass = value[2];
      this.getData();
    },
    // 删除单条标准
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除这条标准？",
        onOk: async () => {
          this.tableData.splice(row._index, 1);
        },
        closable: true
      });
    },
    // 新增产品标准并保存 -> 为select选框增加产品线
    async insertLine() {
      this.tableData.map(row => {
        this.$set(row, "productClass", this.mNumberStandardForm.mNumber);
        return row;
      });
      if ((await editByProductClass(this.tableData)).data.status === 200) {
        this.$Message.success("新增成功");
      }
      // 重新获取电机型号list
      this.mNumberList = listToCascader(
        (await findAllProductClass()).data.data
      );
      // 被选择的选项 -> 即新增的标准
      this.mNumberSelect = [
        this.mNumberStandardForm.mNumber.substring(0, 4),
        this.mNumberStandardForm.mNumber.split("-")[0],
        this.mNumberStandardForm.mNumber
      ];
      this.productClass.productClass = this.mNumberStandardForm.mNumber;
      this.mNumberStandardVisible = false;
    },
    // 确认标准
    async updateStandard() {
      // console.log(this.tableData);
      this.tableLoading = true;
      if ((await editByProductClass(this.tableData)).data.status === 200) {
        this.$Message.success("更新成功");
      }
      this.tableLoading = false;
    },
    // 使用标准项
    async useStandard() {
      this.tableLoading = true;
      if ((await activeByProductClass(this.productClass)).data.status === 200) {
        this.$Message.success("切换成功");
      }
      localStorage.setItem("mNumberSelected", this.productClass.productClass);
      this.mNumberSelected = this.productClass.productClass;
      this.tableLoading = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-card-body {
    .ivu-table {
      max-height: calc(100vh - 260px);
      overflow-y: auto;
      overflow: overlay;
    }
  }
}
</style>
