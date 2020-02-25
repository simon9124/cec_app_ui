<template>
  <div class="dooya-container">
    <Row :gutter="16"
         v-if="!spinShow">

      <Col :span="12">
      <Card>
        <p slot="title">
          <Icon type="md-person" />
          QC1 综合测试
        </p>

        <span v-if="user1!==''">
          当前检测员：<span style="color:#19be6b">{{user1}}</span>
        </span>
        <span v-else
              style="color:#ed4014">检测员未登录</span>
      </Card>
      </Col>

      <Col :span="12">
      <Card>
        <p slot="title">
          <Icon type="md-person" />
          <span>QC1 综合测试</span>
        </p>

        <span v-if="user2!==''">
          当前检测员：<span style="color:#19be6b">{{user2}}</span>
        </span>
        <span v-else
              style="color:#ed4014">检测员未登录</span>
      </Card>
      </Col>
    </Row>

    <br>

    <Row :gutter="16"
         v-if="!spinShow">
      <Col :span="12">
      <Card>
        <p slot="title">
          <Icon type="md-person" />
          <span>QC2 静音间测试</span>
        </p>

        <span v-if="user3!==''">
          当前检测员：<span style="color:#19be6b">{{user3}}</span>
        </span>
        <span v-else
              style="color:#ed4014">检测员未登录</span>
        </span>
      </Card>
      </Col>

      <Col :span="12">
      <Card>
        <p slot="title">
          <Icon type="md-person" />
          <span>QC3 外观测试</span>
        </p>

        <span v-if="user4!==''">
          当前检测员：<span style="color:#19be6b">{{user4}}</span>
        </span>
        <span v-else
              style="color:#ed4014">检测员未登录</span>
        </span>
      </Card>
      </Col>
    </Row>

    <Spin size="large"
          fix
          v-if="spinShow"></Spin>

  </div>
</template>

<script>
// function
import { params } from "@/libs/params";
// api
import { loginLineUser, getLineUsers } from "@/api/inspect";

export default {
  name: "inspector",
  data() {
    return {
      // 获取已登录用户名
      user1: "",
      user2: "",
      user3: "",
      user4: "",
      // loading
      spinShow: false
    };
  },
  created() {
    // 产线号
    this.getUsers();
  },
  methods: {
    // 获取登录信息
    async getUsers() {
      this.spinShow = true;
      const usersData = (await getLineUsers()).data.data;
      if (usersData.length !== 0) {
        usersData.forEach(user => {
          switch (user.qcid) {
            case 1:
              this.user1 = user.username;
              break;
            case 2:
              this.user2 = user.username;
              break;
            case 3:
              this.user3 = user.username;
              break;
            case 4:
              this.user4 = user.username;
              break;
          }
        });
      }
      this.spinShow = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-card {
    &-head {
      padding: 10px 16px;
    }
  }
}
</style>
