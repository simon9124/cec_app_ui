<template>
  <div class="dooya-container">
    <Card>

      <!-- 筛选 -->
      <div style="margin: 10px 0">
        <Button style="margin-right: 10px"
                type="success"
                :disabled="tableLoading"
                @click="proLineFormVisible=true">生成条形码</Button>
        <!-- <Button v-if="isMock"
                type="primary"
                :disabled="!canPrint || tableLoading"
                @click="printMountMock">批量打印</Button> -->
        <!-- v-else -->
        <Button type="primary"
                :disabled="!canPrint || tableLoading"
                @click="printMount">批量打印</Button>
      </div>

      <!-- 表格 -->
      <Table :data="tableData"
             :columns="tableColumns"
             stripe
             :loading="tableLoading"
             ref="numberTable"
             @on-selection-change="onSelectChange">
      </Table>

      <!-- 分页 -->
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-sizer
                :total="tableDataOrg.length"
                :current="1"
                :page-size-opts="[100, 200, 300, 400]"
                :page-size="pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
        </div>
      </div>

      <!-- 生成条码form -->
      <Modal v-model="proLineFormVisible"
             title="请填写产品线和生成个数"
             footer-hide
             @on-visible-change="proLineFormVisibleChange">
        <Form :model="proLineForm"
              :label-width="80"
              ref="proLineForm"
              :rules="proLineRule">
          <FormItem label="产品线"
                    prop="proLine">
            <Input v-model="proLineForm.proLine"
                   placeholder="请输入产品线"></Input>
          </FormItem>
          <FormItem label="生成个数"
                    prop="proNumber">
            <Input v-model.number="proLineForm.proNumber"
                   type="number"
                   placeholder="请输入生成个数"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="createCode">确定</Button>
            <Button style="margin-left: 8px"
                    @click="proLineFormVisible=false">取消</Button>
          </FormItem>
        </Form>
      </Modal>

      <!-- 图片放大 -->
      <div class="bigMask"
           v-if="picBigShow"
           @click.prevent.stop="picBigShow=!picBigShow">
        <img class="bigMask-img"
             style="width:400px"
             :src="picUrl"
             @click.prevent.stop="picBigShow=!picBigShow">
      </div>

    </Card>
  </div>
</template>

<script>
// JsBarcode
import JsBarcode from "jsbarcode";
// Print.js
import printJS from "print-js";
// api
import { getNumberList, createCodes, printBarCodes } from "@/api/number";
// function
import { validateNumber } from "@/libs/validate";

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
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标识",
          key: "identification",
          align: "center",
          minWidth: 120
        },
        {
          title: "同步时间",
          key: "synchroTime",
          align: "center",
          minWidth: 150
        },
        {
          title: "编号",
          key: "number",
          align: "center",
          minWidth: 150
        },
        {
          title: "是否使用",
          key: "isUsed",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            const row = params.row;
            const color = row.isUsed === true ? "success" : "warning";
            const text = row.isUsed === true ? "已使用" : "未使用";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "条码",
          key: "code",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  position: "relative",
                  width: "137px",
                  height: "82px",
                  margin: "auto"
                },
                on: {
                  mouseover: () => {
                    this.$set(params.row, "onMouseOver", true);
                  },
                  mouseout: () => {
                    this.$set(params.row, "onMouseOver", false);
                  }
                }
              },
              [
                h("img", {
                  attrs: {
                    src: this.isMock ? "" : ""
                    // params.row.codeUrl !== ''
                    // ? 'data:image/png;base64,' + params.row.codeUrl
                    // : ''
                  },
                  style: {
                    width: "130px"
                  },
                  // class: 'barcode-' + params.row.number
                  class: "barcode barcode-" + params.row.number.slice(-10)
                }),
                h("Button", {
                  props: {
                    type: "default",
                    size: "small",
                    shape: "circle",
                    icon: "ios-add"
                  },
                  style: {
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    display: params.row.onMouseOver ? "block" : "none"
                  },
                  on: {
                    click: () => {
                      this.picBigShow = true;
                      this.picUrl = params.row.codeUrl;
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 120,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small",
                    disabled: this.isMock
                      ? params.row.isUsed === true || !params.row.isCreateCode
                      : params.row.isUsed === true ||
                        params.row.synchroTime.indexOf(this.nowTime) === -1
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.print(params.row);
                    }
                  }
                },
                "打印"
              )
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'primary',
              //       size: 'small'
              //     },
              //     on: {
              //       click: () => {
              //         this.show(params.row);
              //       }
              //     }
              //   },
              //   '详情'
              // )
            ]);
          }
        }
      ],
      // 页码
      pageNum: 1,
      // 每页显示数量
      pageSize: 100,
      // 选中的选项 - 当前
      selectionChange: [],
      // modal弹框 - 是否显示
      proLineFormVisible: false,
      // modal弹框 - 产品线form
      proLineForm: {
        proLine: "22Y",
        proNumber: 10
      },
      // modal弹框 - 产品线form规则
      proLineRule: {
        proLine: [
          { required: true, message: "请输入产品线", trigger: "change" }
        ],
        proNumber: [
          {
            required: true,
            validator: function(rule, value, callback) {
              if (value <= 0) {
                callback(new Error("请输入生成个数"));
              } else if (!validateNumber(value)) {
                callback(new Error("请输入整数"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      // jsBarcode
      JsBarcodeFormat: "ROC12345",
      // loading
      tableLoading: false,
      // 页面全局变量 - 是否为mock
      isMock: this.isMock,
      // 当前时间
      nowTime: "",
      // 要生成条形码的codes
      createdCodes: [],
      // 要打印条形码的codes
      printedCodes: [],
      // 单张图片url（放大）
      picUrl: "",
      // 单张图片放大，默认隐藏
      picBigShow: false
    };
  },
  computed: {
    // 是否可打印
    canPrint() {
      if (this.isMock) {
        // mock时
        return this.tableData.some(
          row => row.isUsed === false && row.isCreateCode === true
        );
      } else {
        // 非mock时
        return this.tableData.some(
          row =>
            row.isUsed !== true || row.synchroTime.indexOf(this.nowTime) > -1
        );
      }
    }
  },
  async created() {
    this.getData();

    // 如果地址栏给出了lineNo和count两个参数，则直接生成条形码并调出打印机
    if (
      this.$route.query.lineNo !== undefined &&
      this.$route.query.count !== undefined
    ) {
      this.proLineForm = {
        lineNo: this.$route.query.lineNo + "Y",
        proNumber: this.$route.query.count
      };
      const data = {
        format: "CODE128",
        codeType: {
          width: "130px",
          height: "60px"
        },
        num: this.proLineForm.proNumber,
        proLine: this.proLineForm.proLine
      };
      this.createdCodes = (await createCodes(data)).data.data;
      await this.getData();
      await this.JsBarcodeCreateCode();
      this.printMount();
    }
  },
  methods: {
    // 当前时间匹配
    getTime() {
      var now = new Date();
      var year = now.getFullYear();
      var month =
        now.getMonth() + 1 >= 10
          ? now.getMonth() + 1
          : "0" + (now.getMonth() + 1);
      var day = now.getDate() >= 10 ? now.getDate() : "0" + now.getDate();
      this.nowTime = year + "-" + month + "-" + day;
    },
    // 获取首页数据
    async getData() {
      // 根据现在的时间，设置默认勾选
      this.getTime();
      this.tableLoading = true;
      this.tableDataOrg = (await getNumberList()).data.data;
      this.tableDataOrg = this.tableDataOrg.map(row => {
        this.$set(row, "isCreateCode", false);
        this.$set(row, "onMouseOver", false);
        if (
          row.synchroTime.indexOf(this.nowTime) > -1 &&
          row.number !== "" &&
          row.isUsed === false
        ) {
          this.$set(row, "_checked", true);
          this.selectionChange.push(row.identification);
        }
        if (
          row.isUsed === true ||
          row.synchroTime.indexOf(this.nowTime) === -1
        ) {
          this.$set(row, "_disabled", true);
        }
        return row;
      });
      // console.log(this.tableData);
      await this.refreshData();
      this.tableLoading = false;
    },
    // 根据条件刷新数据
    refreshData() {
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      // 生成条形码
      this.tableData.forEach(row => {
        this.$nextTick(() => {
          JsBarcode(".barcode-" + row.number.slice(-10), row.number, {
            format: "CODE128", // 选择要使用的条形码类型
            // lineColor: '#0aa', // 条形码颜色
            width: 1, // 条形码宽度
            height: 60, // 条形码高度
            text: row.number, // 文本内容
            fontSize: 12,
            value: "123",
            displayValue: true, // 是否在条形码下方显示文字
            textPosition: "bottom" // 设置文本的垂直位置
          });
        });
      });
      // 整合生成条形码的base64码
      this.$nextTick(() => {
        for (var i = 0; i < this.tableData.length; i++) {
          this.$set(
            this.tableData[i],
            "codeUrl",
            document.getElementsByClassName("barcode")[i].src
          );
        }
      });
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
    // 选项发生变化
    onSelectChange(selection) {
      this.selectionChange = [];
      selection.forEach(row => {
        this.selectionChange.push(row.identification);
      });
    },
    // modal显示状态发生变化
    proLineFormVisibleChange(visible) {
      if (visible === false) {
        this.$refs["proLineForm"].resetFields();
      }
    },
    // 点击按钮 - 详情
    show(row) {
      // console.log(row);
      // const result = row.result === 1 ? '合格' : '不合格';
      // this.$Modal.info({
      //   title: row.number,
      //   content: `线号：${row.lineNumber}<br>综合测试检测人：${row.testInspector}<br>静音间检测人：${row.muteInspector}<br>外观检测人：${row.appearanceInspector}<br>检测结果：${result}`,
      //   closable: true
      // });
    },
    // JsBarcode生成条形码
    JsBarcodeCreateCode() {
      if (!this.isMock) {
        this.createdCodes.forEach(code => {
          this.$nextTick(() => {
            JsBarcode(".barcode-" + code.slice(-10), code, {
              format: "CODE128", // 选择要使用的条形码类型
              // lineColor: '#0aa', // 条形码颜色
              width: 1, // 条形码宽度
              height: 60, // 条形码高度
              text: code, // 文本内容
              value: "123",
              fontSize: 12,
              displayValue: true, // 是否在条形码下方显示文字
              textPosition: "bottom" // 设置文本的垂直位置
            });
          });
        });
      } else {
        this.tableData.forEach(row => {
          this.$nextTick(() => {
            JsBarcode(".barcode-" + row.number.slice(-10), row.number, {
              format: "CODE128", // 选择要使用的条形码类型
              // lineColor: '#0aa', // 条形码颜色
              width: 1, // 条形码宽度
              height: 60, // 条形码高度
              text: row.number, // 文本内容
              value: "123",
              fontSize: 12,
              displayValue: true, // 是否在条形码下方显示文字
              textPosition: "bottom" // 设置文本的垂直位置
            });
          });
        });
      }
    },
    // PrintJs调用打印机
    printCodes(printable) {
      printJS({
        printable: printable,
        type: "image",
        // header: 'Multiple Images',
        // imageStyle: 'width:50%;margin-bottom:20px;'
        imageStyle: "width:100%"
      });
    },
    // 打印接口
    async printBarCodes(codes) {
      await printBarCodes(codes);
      this.getData();
      this.selectionChange = [];
    },
    // 批量生成条形码
    async createCode() {
      this.$refs["proLineForm"].validate(async valid => {
        if (valid) {
          if (!this.isMock) {
            // 接口
            const data = {
              format: "CODE128",
              codeType: {
                width: "130px",
                height: "60px"
              },
              num: this.proLineForm.proNumber,
              proLine: this.proLineForm.proLine
            };
            this.createdCodes = (await createCodes(data)).data.data;
            // console.log(this.createdCodes);
            await this.getData();
            this.JsBarcodeCreateCode();
            this.proLineFormVisible = false;
          } else {
            // mock
            this.tableData.forEach(row => {
              row.isCreateCode = true;
              row.isUsed = false;
            });
            this.JsBarcodeCreateCode();
            this.proLineFormVisible = false;
          }
        }
      });
    },
    // 批量打印条形码
    async printMount() {
      if (this.selectionChange.length === 0) {
        this.$Message.error("请选择要打印的条形码");
      } else {
        if (!this.isMock) {
          // 接口
          const printable = [];
          this.tableData.forEach(row => {
            if (this.selectionChange.indexOf(row.identification) > -1) {
              printable.push(row.codeUrl);
            }
          });
          this.printCodes(printable);
          this.printBarCodes(this.selectionChange);
        } else {
          // mock
          const printable = [];
          this.tableData.forEach(row => {
            if (this.selectionChange.indexOf(row.identification) > -1) {
              row.isUsed = true;
              printable.push(row.codeUrl);
            }
          });
          this.printCodes(printable);
          await this.JsBarcodeCreateCode();
          this.selectionChange = [];
        }
      }
    },
    // 单独打印条形码
    async print(paramsRow) {
      if (!this.isMock) {
        // 接口
        const printable = [];
        const printIdentifications = [];
        this.tableData.forEach(row => {
          if (paramsRow.identification === row.identification) {
            printable.push(row.codeUrl);
            printIdentifications.push(row.identification);
          }
        });
        this.printCodes(printable);
        this.printBarCodes(printIdentifications);
      } else {
        // mock
        const printable = [];
        this.tableData.forEach(row => {
          if (paramsRow.identification === row.identification) {
            row.isUsed = true;
            printable.push(row.codeUrl);
          }
        });
        this.printCodes(printable);
        this.JsBarcodeCreateCode();
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.bigMask {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1003;
  &-img {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
    max-height: 80%; // transform: scale(1);
    // transition: all ease 0.2s;
  }
}

.dooya-container /deep/ {
  .ivu-table-body {
    // overflow: hidden;
  }
  .ivu-table-cell {
    padding: 0;
  }
}
</style>
