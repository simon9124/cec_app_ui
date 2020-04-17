<template>
  <div class="dooya-container">

    <!-- 操作 -->
    <div style="margin-bottom:10px;position:relative">
      <Button style="margin-right:5px"
              type="primary"
              size="small"
              :disabled="row.barcode===undefined"
              @click="sendToMqtt">识别</Button>
      <span v-if="canBeSubmit">
        编号：{{qc3_form.barcode}}&nbsp;&nbsp;识别结果：{{ qc3_form.result}}
        <!-- <Button type="success"
                size="small"
                style="margin-left:5px"
                @click="submitResult">确认</Button>
        <Button type="warning"
                size="small"
                @click="canBeSubmit=!canBeSubmit">重新识别</Button> -->
      </span>
      <Spin size="large"
            fix
            v-if="spinShow"></Spin>
    </div>

    <!-- 表格 -->
    <Table :data="this.isMock?tableData:tableData.pageData"
           :columns="tableColumns"
           :loading="tableLoading"
           :ellipsis="true"
           stripe></Table>
    <div style="margin-top:10px;overflow: hidden">
      <div style="float: right;">
        <Page show-sizer
              simple
              :total="this.isMock?tableDataOrg.length:tableData.dataCount"
              :current="1"
              @on-change="changePage"
              @on-page-size-change="changePageSize"></Page>
      </div>
    </div>

  </div>
</template>

<script>
// mockData
import checkList from "./mockData/index.js";
// api
import { getCheckListByPage, updateQc3 } from "@/api/check";
// mqtt
import { mqtt, MQTT_SERVICE, options } from "@/libs/sysconstant.js";
import { resultCallback } from "@/libs/dataHanding"; // 根据请求的status执行回调函数
// vuex
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      /* eslint-disable*/
      tableColumns: [
        {
          width: 60,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Checkbox", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    // console.log(e);
                    /* 1.取消所有对象的勾选，checkBox设置为false */
                    this.tableData.pageData.forEach(items => {
                      this.$set(items, "checkBox", false);
                    });
                    /* 2.将勾选的对象的checkBox设置为true */
                    this.tableData.pageData[params.index].checkBox = e;
                    this.row =
                      e === true ? this.tableData.pageData[params.index] : {};
                  }
                }
              })
            ]);
          }
        },
        {
          title: "编号",
          key: "barcode",
          align: "center",
          minWidth: 150
        },
        {
          title: "线号",
          key: "lineno",
          align: "center",
          render: (h, params) => {
            const text = params.row.lineno + "线";
            return h("div", text);
          },
          minWidth: 80
          // minWidth: document.body.clientWidth <= 1280 ? 0 : 80
        },
        {
          title: "综合测试",
          key: "qc1_result",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.qc1_result === 0
                ? "default"
                : row.qc1_result === 1
                ? "success"
                : "error";
            const text =
              row.qc1_result === 0
                ? "未检测"
                : row.qc1_result === 1
                ? "合格"
                : "不合格";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          },
          minWidth: 100
        },
        {
          title: "综合测试开始时间",
          key: "qc1_time",
          align: "center",
          minWidth: 150
        },
        {
          title: "综合测试检测人",
          key: "qc1_user_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "静音结果",
          key: "qc2_result",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.qc2_result === 0
                ? "default"
                : row.qc2_result === 1
                ? "success"
                : "error";
            const text =
              row.qc2_result === 0
                ? "未检测"
                : row.qc2_result === 1
                ? "合格"
                : "不合格";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          },
          minWidth: 100
        },
        {
          title: "静音测试开始时间",
          key: "qc2_time",
          align: "center",
          minWidth: 150
        },
        {
          title: "静音间检测人",
          key: "qc2_user_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "外观结果",
          key: "qc3_result",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.qc3_result === 0
                ? "default"
                : row.qc3_result === 1
                ? "success"
                : "error";
            const text =
              row.qc3_result === 0
                ? "未检测"
                : row.qc3_result === 1
                ? "合格"
                : "不合格";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          },
          minWidth: 100
        },
        {
          title: "外观测试时间",
          key: "qc3_time",
          align: "center",
          minWidth: 150
        },
        {
          title: "外观检测人",
          key: "qc3_user_name",
          align: "center",
          minWidth: 120
        },
        {
          title: "检测结果",
          key: "result",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.qc1_result === 2 ||
              row.qc2_result === 2 ||
              (row.qc3_result !== 0 && row.qc3_result !== 1)
                ? "error"
                : row.qc1_result === 0 ||
                  row.qc2_result === 0 ||
                  row.qc3_result === 0
                ? "default"
                : row.qc1_result === 1 &&
                  row.qc2_result === 1 &&
                  row.qc3_result === 1
                ? "success"
                : "warning";
            const text =
              row.qc1_result === 2 ||
              row.qc2_result === 2 ||
              (row.qc3_result !== 0 && row.qc3_result !== 1)
                ? "不合格"
                : row.qc1_result === 0 ||
                  row.qc2_result === 0 ||
                  row.qc3_result === 0
                ? "未检测"
                : row.qc1_result === 1 &&
                  row.qc2_result === 1 &&
                  row.qc3_result === 1
                ? "合格"
                : "异常";
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          },
          minWidth: 100
        }
        // {
        //   title: "操作",
        //   key: "action",
        //   fixed: "right",
        //   minWidth: 100,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small"
        //           },
        //           on: {
        //             click: () => {
        //               this.show(params.row);
        //             }
        //           }
        //         },
        //         // "详情"
        //         "外观检测"
        //       )
        //     ]);
        //   }
        // }
      ], // 表头列项
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false, //table
      spinShow: false, //spin
      /* qcs提交 */
      row: {}, //当前选择的行,
      qc3_form: {}, //要提交的qc3表单
      canBeSubmit: false //是否能够提交
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  async mounted() {
    // 监听浏览器的返回按钮：向历史记录中插入了当前页
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  created() {
    this.getMqttData();
    this.getData();
  },
  methods: {
    // 获取首页数据
    async getData() {
      this.tableLoading = true;
      if (this.isMock) {
        // mock数据
        const list = checkList.checkList;

        // 数据处理
        this.tableDataOrg = list;
        this.tableData = list.slice(
          (this.pageNum - 1) * this.pageSize,
          this.pageNum * this.pageSize
        );
        this.tableLoading = false;
      } else {
        // 接口数据
        const list = (await getCheckListByPage(this.pageNum, this.pageSize))
          .data.data;

        // 适配1024px现场小屏幕
        if (document.body.clientWidth <= 1280) {
          const noneArray = [
            "线号",
            "综合测试开始时间",
            "综合测试检测人",
            "静音测试开始时间",
            "静音间检测人",
            "外观测试时间",
            "外观检测人"
          ];
          for (var i = this.tableColumns.length - 1; i >= 0; i--) {
            if (noneArray.indexOf(this.tableColumns[i].title) > -1) {
              this.tableColumns.splice(i, 1);
            }
          }
        }

        // 数据处理
        this.tableData = this.tableDataOrg = list;

        // this.tableData = list.slice(
        //   (this.pageNum - 1) * this.pageSize,
        //   this.pageNum * this.pageSize
        // );

        this.tableLoading = false;
      }
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
    // 连接mqtt服务并订阅消息
    getMqttData() {
      // this.spinShow = true;
      this.client = mqtt.connect(MQTT_SERVICE, options);

      // mqtt连接
      this.client.on("connect", e => {
        console.log("mqtt连接成功");

        // 先退订其他消息
        // this.client.unsubscribe("data/lab/cam", { qos: 1 }, () => {
        //   console.log("取消订阅data/lab/cam");
        // });

        // 订阅消息
        this.client.subscribe("data/lab/cam/123", { qos: 1 }, error => {
          if (!error) {
            // 订阅成功
            console.log("订阅成功：data/lab/cam/123");
          } else {
            // 订阅失败
          }
        });

        // 接收消息处理
        this.client.on("message", (topic, message) => {
          const msg = JSON.parse(message.toString());
          console.log(topic, msg);
          this.qc3_form = {
            barcode: msg.barcode,
            user: msg.user,
            result: msg.result,
            time: msg.time,
            start: msg.start
          };
          this.canBeSubmit = true;
          this.spinShow = false;
          this.submitResult();
        });
      });
    },
    // 顶部按钮 - 识别
    sendToMqtt() {
      this.spinShow = true;
      const sendMsg = {
        barcode: this.row.barcode,
        user: this.name,
        result: 1,
        start: 1,
        time: new Date().toLocaleTimeString()
      };
      // console.log(sendMsg);
      // 发布消息
      this.client.publish("cmd/lab/cam/123", JSON.stringify(sendMsg), () => {
        console.log("发布成功", JSON.stringify(sendMsg));
      });
    },
    // 顶部按钮 - 确认
    async submitResult() {
      const result = (await updateQc3(this.qc3_form)).data.status;
      resultCallback(
        result,
        "识别成功",
        () => {
          this.getData();
          // this.canBeSubmit = false;
          this.row = {};
        },
        () => {
          // this.canBeSubmit = false;
          this.row = {};
        }
      );
    },
    // 点击按钮 - 详情
    show(row) {
      // this.$router.push({
      //   // path: "/systemManage/checkSearch",
      //   path: "/check/checkSearch",
      //   name: "checkSearch",
      //   params: {
      //     checkSearchNumber: row.barcode
      //   }
      // });
    },
    // 浏览器返回
    goBack() {
      this.client.unsubscribe("data/lab/cam/123");
      this.client.end();
    }
  },
  destroyed() {
    this.client.unsubscribe("data/lab/cam/123");
    this.client.end();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-table-cell {
    padding: 0;
  }
  .acs {
    width: 300px !important;
  }
}
</style>
