const processList = [

  {
    description: "前置工序",
    params: []
  },
  {
    description: "顺转一",
    params: [

      {
        description: "行程",
        code: "1"
      },
      {
        description: "转速",
        code: "2"
      },
      {
        description: "电压",
        code: "3"
      },
      {
        description: "电流",
        code: "4"
      },
      {
        description: "功率",
        code: "5"
      }
    ]
  },
  {
    description: "顺转二",
    params: [

      {
        description: "行程",
        code: "1"
      },
      {
        description: "转速",
        code: "2"
      },
      {
        description: "电压",
        code: "3"
      },
      {
        description: "电流",
        code: "4"
      },
      {
        description: "功率",
        code: "5"
      }
    ]
  },
  {
    description: "顺转三",
    params: [

      {
        description: "行程",
        code: "1"
      },
      {
        description: "转速",
        code: "2"
      },
      {
        description: "电压",
        code: "3"
      },
      {
        description: "电流",
        code: "4"
      }
    ]
  },
  {
    description: "逆转一",
    params: [

      {
        description: "转速",
        code: "2"
      },
      {
        description: "电压",
        code: "3"
      }

    ]
  },
  {
    description: "逆转二",
    params: []
  },
  {
    description: "逆转三",
    params: [

      {
        description: "行程",
        code: "1"
      },
      {
        description: "转速",
        code: "2"
      },
      {
        description: "电压",
        code: "3"
      },
      {
        description: "电流",
        code: "4"
      }
    ]
  },
  {
    description: "后续工序",
    params: []
  }
];

const sopSelectList = [

  {
    sop: "JS-9-1-588",
    sopDescription: "综合测试",
    qc: 1
  },
  {
    sop: "JS-9-2.146",
    sopDescription: "综合测试",
    qc: 1
  },
  {
    sop: "JS-9-1-639",
    sopDescription: "综合测试",
    qc: 1
  },
  {
    sop: "JS-9-9-610",
    sopDescription: "SOP",
    qc: 1
  },
  {
    sop: "JS-9-1-9",
    sopDescription: "S型-M型-Q型综合测试",
    qc: 1
  },
  {
    sop: "JS-9-1.12",
    sopDescription: "R型电机",
    qc: 1
  }
];

const processSelectList = [

  {
    "id": 1,
    "code": 1,
    "qc": 1,
    "description": "行程(CM)"
  }, {
    "id": 2,
    "code": 2,
    "qc": 1,
    "description": "转速(RPM)"
  }, {
    "id": 3,
    "code": 3,
    "qc": 1,
    "description": "电压(V)"
  }, {
    "id": 4,
    "code": 4,
    "qc": 1,
    "description": "电流(A)"
  }, {
    "id": 5,
    "code": 5,
    "qc": 1,
    "description": "功率(W)"
  }
];

export {
  processList,
  sopSelectList,
  processSelectList
};
