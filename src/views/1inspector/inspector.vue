<template>
  <div class="dooya-container">
    <Row :gutter="16">

      <!-- QC1 -->
      <Col :md="12"
           :sm="24"
           :xs="24">
      <Card>
        <p slot="title">QC1 综合测试</p>
        <p slot="extra">
          <span v-if="user1!==''">
            当前检测员：{{user1}}
          </span>
        </p>
        <Form v-if="!formQC1Login_1"
              ref="formQC1_1"
              :rules="formQC1Rule_1"
              :model="formQC1_1"
              :label-width="100">
          <FormItem label="QC1 账号："
                    prop="username">
            <Input v-model="formQC1_1.username"
                   placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="QC1 密码："
                    prop="password">
            <Input v-model="formQC1_1.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC1 产线："
                    prop="lineNo">
            <Input v-model="formQC1_1.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC1 工位："
                    prop="qcid">
            <Input v-model="formQC1_1.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC1_1')">登录</Button>
          </FormItem>
        </Form>
        <Form v-if="formQC1Login_1"
              ref="formQC1_1"
              :rules="formQC1Rule_1"
              :model="formQC1_1"
              :label-width="100">
          <FormItem label="QC1 账号："
                    prop="username">
            <Input v-model="formQC1_1.username"
                   placeholder="请输入账号"
                   @on-change="formQC1Login_1=false"></Input>
          </FormItem>
          <FormItem label="QC1 密码："
                    prop="password">
            <Input v-model="formQC1_1.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC1 产线："
                    prop="lineNo">
            <Input v-model="formQC1_1.lineNo"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC1 工位："
                    prop="qcid">
            <Input v-model="formQC1_1.qcid"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC1_1')">重新登录</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>

      <Col :md="12"
           :sm="24"
           :xs="24">
      <Card>
        <p slot="title">QC1 综合测试</p>
        <p slot="extra">
          <span v-if="user2!==''">
            当前检测员：{{user2}}
          </span>
        </p>
        <Form v-if="!formQC1Login_2"
              ref="formQC1_2"
              :rules="formQC1Rule_2"
              :model="formQC1_2"
              :label-width="100">
          <FormItem label="QC1 账号："
                    prop="username">
            <Input v-model="formQC1_2.username"
                   placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="QC1 密码："
                    prop="password">
            <Input v-model="formQC1_2.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC1 产线："
                    prop="lineNo">
            <Input v-model="formQC1_2.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC1 工位："
                    prop="qcid">
            <Input v-model="formQC1_2.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC1_2')">登录</Button>
          </FormItem>
        </Form>
        <Form v-if="formQC1Login_2"
              ref="formQC1_2"
              :rules="formQC1Rule_1"
              :model="formQC1_1"
              :label-width="100">
          <FormItem label="QC1 账号："
                    prop="username">
            <Input v-model="formQC1_2.username"
                   placeholder="请输入账号"
                   @on-change="formQC1Login_2=false"></Input>
          </FormItem>
          <FormItem label="QC1 密码："
                    prop="password">
            <Input v-model="formQC1_2.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC1 产线："
                    prop="lineNo">
            <Input v-model="formQC1_2.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC1 工位："
                    prop="qcid">
            <Input v-model="formQC1_2.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC1_2')">重新登录</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>

      <!-- QC2 -->
      <Col :md="12"
           :sm="24"
           :xs="24">
      <Card>
        <p slot="title">QC2 静音间测试</p>
        <p slot="extra">
          <span v-if="user3!==''">
            当前检测员：{{user3}}
          </span>
        </p>
        <Form v-if="!formQC2Login"
              ref="formQC2"
              :rules="formQC2Rule"
              :model="formQC2"
              :label-width="100">
          <FormItem label="QC2 账号："
                    prop="username">
            <Input v-model="formQC2.username"
                   placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="QC2 密码："
                    prop="password">
            <Input v-model="formQC2.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC2 产线："
                    prop="lineNo">
            <Input v-model="formQC2.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC2 工位："
                    prop="qcid">
            <Input v-model="formQC2.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC2')">登录</Button>
          </FormItem>
        </Form>
        <Form v-if="formQC2Login"
              ref="formQC2"
              :rules="formQC2Rule"
              :model="formQC2"
              :label-width="100">
          <FormItem label="QC2 账号："
                    prop="username">
            <Input v-model="formQC2.username"
                   placeholder="请输入账号"
                   @on-change="formQC2Login=false"></Input>
          </FormItem>
          <FormItem label="QC2 密码："
                    prop="password">
            <Input v-model="formQC2.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC2 产线："
                    prop="lineNo">
            <Input v-model="formQC2.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC2 工位："
                    prop="qcid">
            <Input v-model="formQC2.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC2')">重新登录</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>

      <!-- QC3 -->
      <Col :md="12"
           :sm="24"
           :xs="24">
      <Card>
        <p slot="title">QC3 外观测试</p>
        <p slot="extra">
          <span v-if="user4!==''">
            当前检测员：{{user4}}
          </span>
        </p>
        <Form v-if="!formQC3Login"
              ref="formQC3"
              :rules="formQC3Rule"
              :model="formQC3"
              :label-width="100">
          <FormItem label="QC3 账号："
                    prop="username">
            <Input v-model="formQC3.username"
                   placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem label="QC3 密码："
                    prop="password">
            <Input v-model="formQC3.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC3 产线："
                    prop="lineNo">
            <Input v-model="formQC3.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC3 工位："
                    prop="qcid">
            <Input v-model="formQC3.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC3')">登录</Button>
          </FormItem>
        </Form>
        <Form v-if="formQC3Login"
              ref="formQC3"
              :rules="formQC3Rule"
              :model="formQC3"
              :label-width="100">
          <FormItem label="QC3 账号："
                    prop="username">
            <Input v-model="formQC3.username"
                   placeholder="请输入账号"
                   @on-change="formQC3Login=false"></Input>
          </FormItem>
          <FormItem label="QC3 密码："
                    prop="password">
            <Input v-model="formQC3.password"
                   type="password"
                   placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="QC3 产线："
                    prop="lineNo">
            <Input v-model="formQC3.lineNo"
                   type="number"
                   placeholder="请输入产线"></Input>
          </FormItem>
          <FormItem label="QC3 工位："
                    prop="qcid">
            <Input v-model="formQC3.qcid"
                   type="number"
                   placeholder="请输入工位"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="formLogin('QC3')">重新登录</Button>
          </FormItem>
        </Form>
      </Card>
      </Col>

    </Row>
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
      // QC1
      formQC1_1: {
        username: "tuwenxuan",
        password: "123456",
        lineNo: "22",
        qcid: "1"
      },
      formQC1Rule_1: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        lineNo: [{ required: true, message: "请输入产线", trigger: "blur" }],
        qcid: [{ required: true, message: "请输入工位", trigger: "blur" }]
      },
      formQC1Login_1: false,
      formQC1_2: {
        username: "zhangjiahui",
        password: "123456",
        lineNo: "22",
        qcid: "2"
      },
      formQC1Rule_2: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        lineNo: [{ required: true, message: "请输入产线", trigger: "blur" }],
        qcid: [{ required: true, message: "请输入工位", trigger: "blur" }]
      },
      formQC1Login_2: false,
      // QC2
      formQC2: {
        username: "liuchaofan",
        password: "123456",
        lineNo: "22",
        qcid: "3"
      },
      formQC2Rule: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      formQC2Login: false,
      // QC3
      formQC3: {
        username: "wangmingxue",
        password: "123456",
        lineNo: "22",
        qcid: "4"
      },
      formQC3Rule: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      formQC3Login: false,
      // 获取已登录用户名
      user1: "",
      user2: "",
      user3: "",
      user4: ""
    };
  },
  created() {
    this.getUsers();
    if (localStorage.getItem("formQC1_1") !== null) {
      this.formQC1_1 = JSON.parse(params(this, "formQC1_1"));
    }
    if (localStorage.getItem("formQC1_2") !== null) {
      this.formQC1_2 = JSON.parse(params(this, "formQC1_2"));
    }
    if (localStorage.getItem("formQC2") !== null) {
      this.formQC2 = JSON.parse(params(this, "formQC2"));
    }
    if (localStorage.getItem("formQC3") !== null) {
      this.formQC3 = JSON.parse(params(this, "formQC3"));
    }
  },
  methods: {
    // 获取登录信息
    async getUsers() {
      // console.log((await getLineUsers()).data);
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
    },
    // 登录
    formLogin(formName) {
      switch (formName) {
        case "QC1_1":
          this.$refs.formQC1_1.validate(async valid => {
            if (valid) {
              await loginLineUser(this.formQC1_1);
              if ((await loginLineUser(this.formQC1_1)).data.status === 200) {
                this.$Message.success("登录成功！");
                this.formQC1Login_1 = true;
                localStorage.setItem(
                  "formQC1_1",
                  JSON.stringify(this.formQC1_1)
                );
                this.getUsers();
              } else {
                this.$Message.error(
                  (await loginLineUser(this.formQC1_1)).data.message
                );
              }
            }
          });
          break;
        case "QC1_2":
          this.$refs.formQC1_2.validate(async valid => {
            if (valid) {
              await loginLineUser(this.formQC1_2);
              if ((await loginLineUser(this.formQC1_2)).data.status === 200) {
                this.$Message.success("登录成功！");
                this.formQC1Login_2 = true;
                localStorage.setItem(
                  "formQC1_2",
                  JSON.stringify(this.formQC1_2)
                );
                this.getUsers();
              } else {
                this.$Message.error(
                  (await loginLineUser(this.formQC1_2)).data.message
                );
              }
            }
          });
          break;
        case "QC2":
          this.$refs.formQC2.validate(async valid => {
            if (valid) {
              await loginLineUser(this.formQC2);
              if ((await loginLineUser(this.formQC2)).data.status === 200) {
                this.$Message.success("登录成功！");
                this.formQC2Login = true;
                localStorage.setItem("formQC2", JSON.stringify(this.formQC2));
                this.getUsers();
              } else {
                this.$Message.error(
                  (await loginLineUser(this.formQC2)).data.message
                );
              }
            }
          });
          break;
        case "QC3":
          this.$refs.formQC3.validate(async valid => {
            if (valid) {
              await loginLineUser(this.formQC3);
              if ((await loginLineUser(this.formQC3)).data.status === 200) {
                this.$Message.success("登录成功！");
                this.formQC3Login = true;
                localStorage.setItem("formQC3", JSON.stringify(this.formQC3));
                this.getUsers();
              } else {
                this.$Message.error(
                  (await loginLineUser(this.formQC3)).data.message
                );
              }
            }
          });
          break;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-card {
    margin-bottom: 20px;
    .ivu-card-body {
      padding: 10px;
    }
  }
  .ivu-form {
    label {
      font-weight: bold;
    }
  }
}
</style>
