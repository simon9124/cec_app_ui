<template>
  <div class="dooya-container">
    <Card>
      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Upload action=""
                :before-upload="handleBeforeUpload"
                accept=".xls, .xlsx, csv"
                style="display:inline-block;margin-right: 10px">
          <Button type="success"
                  icon="ios-cloud-upload-outline"
                  :loading="uploadLoading"
                  @click="handleUploadFile">上传标准</Button>
        </Upload>
        <Button type="warning"
                icon="ios-cloud-upload-outline">下载模板</Button>
        <Button style="float:right"
                type="primary"
                icon="md-checkmark"
                @click="confirm">确认标准</Button>
      </div>

      <!-- 表格 -->
      <Table border
             disabled-hover
             :data="tableData"
             :columns="tableColumns"
             :loading="tableLoading"
             no-data-text="请上传检测标准"
             stripe></Table>
    </Card>

    <!-- Modal -->
    <!-- <Modal v-model="modalShow"
           :mask-closable="false"
           :closable="false"
           footer-hide
           title="账号详情"
           @on-ok="handleSubmit">
      <Form ref="formModalData"
            :model="modalData"
            :rules="formModalRule"
            :label-width="100"
            @submit.native.prevent>
        <FormItem label="所属步骤："
                  prop="check_name">
          <Select v-model="modalData.check_name"
                  :disabled="selectDisabled">
            <Option value="综合检测">综合检测</Option>
            <Option value="静音检测">静音检测</Option>
            <Option value="外观检测">外观检测</Option>
          </Select>
        </FormItem>
        <FormItem label="不良品项："
                  prop="reject_item">
          <Input type="text"
                 v-model="modalData.reject_item"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSubmit('formModalData')">确定</Button>
          <Button @click="handleReset('formModalData')"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal> -->
  </div>
</template>

<script>
import excel from '@/libs/excel';
export default {
  name: 'upload-excel',
  data () {
    return {
      // 上传的文件
      file: null,
      // 表格数据
      tableData: [],
      // 表格列项
      tableColumns: [
        {
          title: '描述',
          key: '描述',
          align: 'center',
          minWidth: 120
        },
        {
          title: '项目',
          key: '项目',
          align: 'center',
          minWidth: 120
        },
        {
          title: '上/下限',
          key: '上/下限',
          align: 'center',
          minWidth: 120
        },
        {
          title: '值',
          key: '值',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                {
                  style: {
                    display: params.row.edit === false ? 'inline-block' : 'none'
                  }
                },
                params.row['值']
              ),
              h('Input', {
                props: {
                  value: params.row['值']
                },
                style: {
                  display: params.row.edit === true ? 'inline-block' : 'none',
                  width: '150px',
                  marginRight: '5px'
                },
                nativeOn: {
                  change: event => {
                    // console.log(event.srcElement.value);
                    this.$set(
                      this.tableData[params.row._index],
                      '值',
                      event.srcElement.value
                    );
                    params.row.edit = false;
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: 'md-checkmark'
                },
                style: {
                  display: params.row.edit === true ? 'inline-block' : 'none',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    params.row.edit = false;
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small',
                  icon: 'md-close'
                },
                style: {
                  display: params.row.edit === true ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    params.row.edit = false;
                  }
                }
              })
            ]);
          },
          minWidth: 180
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-create-outline'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row);
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'md-close'
                },
                on: {
                  click: () => {
                    this.delete(params.row);
                  }
                }
              })
            ]);
          },
          align: 'center'
        }
      ],
      tableLoading: false,
      // loading - 上传
      uploadLoading: false
    };
  },
  methods: {
    // 初始化
    initUpload () {
      this.file = null;
      this.tableData = [];
    },
    // 上传文件
    handleUploadFile () {
      // this.initUpload();
    },
    // 上传之前的钩子
    handleBeforeUpload (file) {
      const fileExt = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase();
      if (fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv') {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc:
            '文件：' +
            file.name +
            '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        });
      }
      return false;
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadstart = e => {
        this.uploadLoading = true;
        this.tableLoading = true;
      };
      reader.onerror = e => {
        this.$Message.error('文件读取出错');
      };
      reader.onload = e => {
        this.$Message.info('上传成功');
        const data = e.target.result;
        const { results } = excel.read(data, 'array');
        this.tableData = results;
        this.tableData = this.tableData.map(row => {
          this.$set(row, 'edit', false);
          return row;
        });
        this.uploadLoading = false;
        this.tableLoading = false;
      };
    },
    // 编辑单条标准
    edit (row) {
      // console.log(row);
      row.edit = true;
    },
    // 删除单条标准
    delete (row) {
      this.$Modal.confirm({
        title: '确定删除这条标准？',
        onOk: async () => {
          this.tableData.splice(row._index, 1);
        },
        closable: true
      });
    },
    // 确认标准
    confirm () {
      console.log(this.tableData);
    }
  }
  // watch: {
  //   tableData: {
  //     handler (val) {
  //       this.tableData = val;
  //     },
  //     deep: true
  //   }
  // }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
