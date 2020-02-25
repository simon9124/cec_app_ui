<template>

  <div class="dooya-container">
    <Card>

      <Tabs value="qc1"
            @on-click="tabSelect">

        <!-- 综合检测 -->
        <TabPane label="综合检测"
                 name="qc1">
          <Table :columns="tableColumn"
                 :data="tableData"></Table>
          <!-- <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-sizer
                    :total="tableDataFilter.length"
                    :current="1"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
          </div> -->
        </TabPane>

        <!-- 静音检测 -->
        <TabPane label="静音检测"
                 name="qc2">
          <Table :columns="tableColumn"
                 :data="tableData"></Table>
          <!-- <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-sizer
                    :total="tableDataFilter.length"
                    :current="1"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
          </div> -->
        </TabPane>

        <!-- 外观检测 -->
        <TabPane label="外观检测"
                 name="qc3">
          <Table :columns="tableColumn"
                 :data="tableData"></Table>
          <!-- <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-sizer
                    :total="tableDataFilter.length"
                    :current="1"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
            </div>
          </div> -->
        </TabPane>

      </Tabs>

    </Card>
  </div>
  <!-- <div>
    <Table :columns="tableColumn"
           :data="tableData"></Table>
  </div> -->
</template>

<script>
import mqtt from "mqtt";
import {
  MQTT_SERVICE,
  MQTT_USERNAME,
  MQTT_PASSWORD
} from "@/libs/sysconstant.js";
var client;
const options = {
  connectTimeout: 40000,
  // clientId: 'mqtitId-Home',
  clientId:
    "mqttjs_" +
    Math.random()
      .toString(16)
      .substr(2, 8),
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clean: true
};
client = mqtt.connect(MQTT_SERVICE, options);

export default {
  name: "viewtest",
  data() {
    return {
      // 顶部切换
      tabSelected: "QC1",
      // 数据行
      tableColumn: [
        {
          title: "key",
          key: "key",
          align: "center"
        },
        {
          title: "value",
          key: "value",
          align: "center"
        },
        {
          title: " ",
          key: "user",
          align: "center"
        },
        {
          title: " ",
          key: "number",
          align: "center"
        },
        {
          title: " ",
          key: "phone",
          align: "center"
        }
      ],
      // 表格数据
      tableData: [],
      // 接收到的mqtt即时消息
      msg: ""
    };
  },
  created() {
    this.mqttMSG();
  },
  methods: {
    // 顶部切换
    tabSelect(name) {
      this.tabSelected =
        name === "qc1" ? "QC1" : name === "qc2" ? "QC2" : "QC3";
    },
    // mqtt实时数据采集
    mqttMSG() {
      // mqtt连接
      client.on("connect", e => {
        // console.log('连接成功:');
        client.subscribe("data/message", { qos: 0 }, error => {
          if (!error) {
            // console.log('订阅成功');
          } else {
            console.log("订阅失败");
          }
        });
      });

      // 接收消息处理
      client.on("message", (topic, message) => {
        const msg = JSON.parse(message.toString());
        this.msg = msg;
        console.log(this.msg);
        // console.log(this.msg[this.tabSelected]);

        // 处理数据
        const tableData = [];
        this.msg[this.tabSelected].forEach(item => {
          tableData.push({
            key: Object.keys(item)[0],
            value: item[Object.keys(item)]
          });
        });
        this.tableData = tableData;
      });

      // 断开发起重连
      client.on("reconnect", error => {
        console.log("正在重连:", error);
      });
      // 链接异常处理
      client.on("error", error => {
        console.log("连接失败:", error);
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
  .ivu-table-cell {
    padding: 0;
  }
}
</style>
