<template>
  <div class="dooya-container">
    <Card>

      <Row :gutter="30">
        <Col :span="8">

        <Form ref="formData"
              :model="formItem"
              :rules="formRule"
              :label-width="80">
          <FormItem label="日期">
            <Input v-model="formItem.date"
                   disabled></Input>
          </FormItem>
          <FormItem label="型号"
                    prop="productClass">
            <Input v-model="formItem.productClass"></Input>
          </FormItem>
          <FormItem label="数量"
                    prop="taskCount">
            <Input v-model="formItem.taskCount"
                   type="number"
                   class="input-number"></Input>
          </FormItem>
          <FormItem label="SOP1"
                    prop="qc1Selected">
            <Select v-model="formItem.qc1Selected"
                    placeholder="综合测试的SOP">
              <Option v-for="(item,i) in formItem.qc1List"
                      :value="item.sop"
                      :key="i">{{ item.sop }}</Option>
            </Select>
          </FormItem>
          <FormItem label="SOP2"
                    prop="qc2Selected">
            <Select v-model="formItem.qc2Selected"
                    placeholder="静音检测的SOP">
              <Option v-for="(item,i) in formItem.qc2List"
                      :value="item.sop"
                      :key="i">{{ item.sop }}</Option>
            </Select>
          </FormItem>
          <FormItem label="SOP3"
                    prop="qc3Selected">
            <Select v-model="formItem.qc3Selected"
                    placeholder="外观检测的SOP">
              <Option v-for="(item,i) in formItem.qc3List"
                      :value="item.sop"
                      :key="i">{{ item.sop }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="sopSubmit">派发</Button>
          </FormItem>
        </Form>
        <Spin size="large"
              fix
              v-if="spinShow">
        </Spin>

        </Col>

        <Col :span="8">
        <div class="result"
             v-if="distributed">
          {{formCopy.date}}：
          <Tag color="success">派发成功</Tag>
        </div>
        <div class="result"
             v-if="distributed">
          型号：{{formCopy.productClass}}
        </div>
        <div class="result"
             v-if="distributed">
          数量：{{formCopy.taskCount}}件
        </div>
        <div class="result"
             v-else>
          <Tag color="error">未派发任务</Tag>
        </div>
        </Col>

      </Row>

    </Card>
  </div>
</template>

<script>
// function
import { formatDate } from "@/libs/getDate";
import { params } from "@/libs/params";
// api
import { getSopByQcIndex, setProductLineSnBySop } from "@/api/process";

export default {
  data() {
    return {
      // 派发表单数据
      formItem: {
        date: formatDate(new Date()),
        productClass: "",
        taskCount: "",
        qc1List: [
          {
            sop: "JS-9-1.123",
            sopDescribe: "DM35RQL086[CM278](230V)综合测试",
            code: 0,
            describe: null
          }
        ],
        qc1Selected: "",
        qc2List: [],
        qc2Selected: "",
        qc3List: [],
        qc3Selected: ""
      },
      // 派发表单规则
      formRule: {
        productClass: [
          { required: true, message: "型号不能为空", trigger: "blur" }
        ],
        taskCount: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        qc1Selected: [
          { required: true, message: "请选择SOP1", trigger: "blur" }
        ],
        qc2Selected: [
          { required: true, message: "请选择SOP2", trigger: "blur" }
        ],
        qc3Selected: [
          { required: true, message: "请选择SOP3", trigger: "blur" }
        ]
      },
      // 派发成功显示的内容
      formCopy: {},
      // 是否已派发过任务
      distributed: false,
      // loading
      spinShow: false
    };
  },
  async created() {
    this.getData();
    // 如果派发过任务 -> 缓存里找数据
    if (localStorage.getItem("taskDistribution") !== null) {
      this.formItem = JSON.parse(params(this, "taskDistribution"));
      this.formCopy = JSON.parse(JSON.stringify(this.formItem));
    }
    if (localStorage.getItem("distributed") === "true") {
      this.distributed = true;
    }
  },
  methods: {
    // 分别获取3个下拉框数据
    async getData() {
      this.formItem.qc1List = (await getSopByQcIndex("1")).data.data;
      this.formItem.qc2List = (await getSopByQcIndex("2")).data.data;
      this.formItem.qc3List = (await getSopByQcIndex("3")).data.data;
    },
    // 按钮 - 派发
    async sopSubmit() {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          this.spinShow = true;
          const result = (await setProductLineSnBySop({
            productClass: this.formItem.productClass,
            taskCount: this.formItem.taskCount,
            qc1Sop: this.formItem.qc1Selected,
            qc2Sop: this.formItem.qc2Selected,
            qc3Sop: this.formItem.qc3Selected
          })).data;

          // 放入缓存
          localStorage.setItem(
            "taskDistribution",
            JSON.stringify(this.formItem)
          );

          // 判断回文
          if (result.data !== "0000") {
            this.$Message.success(`派发成功，SN码为${result.data}`);
            this.distributed = true;
            localStorage.setItem("distributed", this.distributed);
            this.formCopy = JSON.parse(JSON.stringify(this.formItem));
            this.spinShow = false;
          } else {
            this.$Message.error("派发失败，请重新选择相应的SOP");
            // 如果从没有派发成功过，那么distributed的值仍未false
            // 如果曾经派发成功过，那么distributed的值为true，派发任务为上一次的任务
            if (localStorage.getItem("distributed") === null) {
              this.distributed = false;
            }
            this.spinShow = false;
          }
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-card {
    .ivu-card-body {
      padding: 30px 10px;
    }
    .ivu-form {
      &-item:last-child {
        margin-bottom: 0;
      }
    }
    .result {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}
</style>
