<template>
  <div class="dooya-container">
    <Row>
      <!-- 任务列表 -->
      <Col>

      <Row>
        <div>
          <div class="result"
               v-if="distributed">
            <Tag color="success">已派发任务</Tag>
          </div>
          <div class="result"
               v-if="distributed">
            sn码：{{formCopy.sn}}&nbsp;&nbsp;
            型号：{{ formCopy.productClass }}&nbsp;&nbsp;
            数量：{{ formCopy.taskCount }}件
          </div>
          <div class="result"
               v-else>
            <Tag color="error">未派发任务</Tag>
          </div>
        </div>
      </Row>

      <Row v-if="formData.workTime.length!==0 && todayTask.length!==0"
           class="task"
           :gutter="10">

        <!-- blocks -->
        <Col :span="12"
             v-for="(task, i) in todayTask"
             :key="i">
        <div class="task-block">
          <!-- 工作时间 -->
          <div class="task-block-time">
            {{ task.startTime }}-{{ task.endTime }}
            <Checkbox v-model="task.work"
                      :disabled="distributed">工作</Checkbox>
          </div>

          <!-- 工作量 -->
          <div class="task-block-task-title">
            <span v-if="distributed">
              任务量：{{ task.workTask }}件
            </span>
          </div>

          <!-- 工作性质 -->
          <Tag size="large"
               :color="task.work ? 'primary' : 'success'">{{ task.work ? '工作时间' : '休息时间' }}</Tag>
        </div>
        </Col>

      </Row>
      </Col>
    </Row>

    <Spin size="large"
          fix
          v-if="spinShow">
    </Spin>

  </div>
</template>

<script>
// mockData
import { qc1ListMock, qc2ListMock } from "./mockData";
// function
import { formatDate } from "@/libs/getDate"; // 格式化时间
import { params } from "@/libs/params"; // 获取localStorage里的数据
// api
import {
  // getSopTagFilteByEquipment, // 获取可使用的SOP级联选择
  // setProductLineSnBySop, // 任务派发
  getLineSn, // 获取任务信息
  removeTask // 删除任务
} from "@/api/process";

export default {
  data() {
    return {
      /* 今日任务 */
      formData: {
        workTime: [],
        workTimeStorage: [],
        productClass: "",
        taskCount: "",
        qc1Select: [],
        qc2Select: [],
        qc1SopId: "",
        qc1SopTagId: "",
        qc2SopId: "",
        qc2SopTagId: "",
        rest: []
      }, // 左侧 - 派发表单
      formCopy: {}, // 中部 - 派发成功显示的内容
      todayTask: [], // 右侧 - 分时列表
      distributed: false, // 是否已派发任务
      processId: "", // 已派发任务的id
      /* loading */
      spinShow: false
    };
  },
  async created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.spinShow = true;
      if (!this.isMock) {
        /* 接口数据：根据任务id，判断是否已派发任务 */
        const result = await getLineSn();
        this.distributed = result.data.data !== null;
        if (this.distributed) {
          // 如果派发过任务且派发成功 -> 接口里调数据
          this.processId = result.data.data.id;
          this.formCopy = result.data.data;
          this.formData = {
            workTimeStorage: [this.formCopy.startTime, this.formCopy.endTime],
            productClass: this.formCopy.productClass,
            taskCount: this.formCopy.taskCount.toString(),
            qc1Select: [
              this.formCopy.qc1SopId.toString(),
              this.formCopy.qc1SopTagId
            ],
            qc2Select: [
              this.formCopy.qc2SopId.toString(),
              this.formCopy.qc2SopTagId
            ]
          };
          // 自动显示任务列表
          this.timeOnChange(this.formData.workTimeStorage);
          this.todayTask.forEach((time, i) => {
            this.$set(time, "workTask", result.data.data.workingTimeTask[i]);
            this.$set(time, "work", result.data.data.workingTimeTask[i] !== 0);
          });
        } else {
          // 如果派发过任务却没有派发成功 -> 从缓存里找数据
          if (localStorage.getItem("taskDistribution") !== null) {
            this.formData = JSON.parse(params(this, "taskDistribution"));
          }
          if (localStorage.getItem("todayTask") !== null) {
            this.todayTask = JSON.parse(params(this, "todayTask"));
          }
          // 自动显示任务列表
          this.timeOnChange(this.formData.workTimeStorage);
        }
      } else {
        /* mock数据：根据缓存里的distributed，判断是否已派发任务 */
        // 如果派发过任务 -> 无论成功与否，都从缓存里找数据
        if (localStorage.getItem("taskDistribution") !== null) {
          this.formData = JSON.parse(params(this, "taskDistribution"));
        }
        if (localStorage.getItem("todayTask") !== null) {
          this.todayTask = JSON.parse(params(this, "todayTask"));
        }
        // 自动显示任务列表
        this.timeOnChange(this.formData.workTimeStorage);
        // 判断是否派发成功
        this.distributed = localStorage.getItem("distributed") === "true";
        // 模拟 creatTime 和 sn码
        this.formData.createTime = formatDate(new Date());
        this.formData.sn = 1001;
        this.formCopy = JSON.parse(JSON.stringify(this.formData));
      }
      this.spinShow = false;
    },
    // 时间选择器 - 时间发生变化
    timeOnChange(time) {
      // console.log(time);

      /* 根据workTime，给表单传值 */
      this.formData.workTime = time[0] !== "" ? time.join(",") : "";

      /* 根据workTimeStorage，计算并回显当天的任务列表 */
      if (this.formData.workTimeStorage.length !== 0) {
        // 1.开始时间转成数字：30分记为0.5
        const start1 = parseInt(this.formData.workTimeStorage[0]);
        const start2 =
          this.formData.workTimeStorage[0].substring(3, 5) === "00" ? 0 : 0.5;
        const startTime = start1 + start2;
        // 2.结束时间转成数字：30分记为0.5
        const end1 = parseInt(this.formData.workTimeStorage[1]);
        const end2 =
          this.formData.workTimeStorage[1].substring(3, 5) === "00" ? 0 : 0.5;
        const endTime = end1 + end2;
        // 3.界面右侧回显当天任务列表
        this.todayTask = [];
        for (var i = startTime, j = 0; i < endTime; i += 0.5, j++) {
          this.todayTask.push({
            startTime:
              (startTime + j * 0.5) % 1 === 0
                ? parseInt(startTime + j * 0.5) + ":" + "00"
                : parseInt(startTime + j * 0.5) + ":" + "30",
            endTime:
              (startTime + j * 0.5 + 0.5) % 1 === 0
                ? parseInt(startTime + j * 0.5 + 0.5) + ":" + "00"
                : parseInt(startTime + j * 0.5 + 0.5) + ":" + "30",
            work: true
          });
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  padding-bottom: 0;
  .result {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .task {
    box-sizing: border-box;
    &-block {
      min-height: 60px;
      border: 1px solid #e8eaec;
      padding: 8px 5px 5px 5px;
      margin-bottom: 10px;

      .ivu-checkbox-wrapper {
        vertical-align: top;
        margin-left: 5px;
      }

      &-time {
        font-size: 16px;
        font-weight: bold;
        height: 16px;
        line-height: 16px;
      }
      &-task {
        &-title {
          font-size: 14px;
          height: 30px;
          line-height: 32px;
        }
        &-number {
          font-size: 18px;
          height: 30px;
          line-height: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
