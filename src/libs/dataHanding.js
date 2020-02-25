/**
 * js前端数据处理
 */
"use strict";
// import Vue from 'vue';
export function listToCascader(data) {
  let cascaderValue = [];
  let casList1 = [];
  let casList2 = [];

  // 转成 key-value 对象
  data.forEach(string => {
    // casList1：取前4位 + 去重 -> 最外层
    casList1.push(string.substring(0, 4));
    casList1 = Array.from(new Set(casList1));

    // casList2：按 "-" 分割 + 去重 -> 第二层
    casList2.push(string.split("-")[0]);
    casList2 = Array.from(new Set(casList2));

    // data：第三层（最内层）
  });

  // 塞入数据
  casList1.forEach(string1 => {
    const casList2Value = [];
    casList2.forEach(string2 => {
      const casList3Value = [];
      data.forEach(string3 => {
        if (string3.indexOf(string2) > -1) {
          casList3Value.push({
            value: string3,
            label: string3
          });
        }
      });
      if (string2.indexOf(string1) > -1) {
        casList2Value.push({
          value: string2,
          label: string2,
          children: casList3Value
        });
      }
    });
    cascaderValue.push({
      value: string1,
      label: string1,
      children: casList2Value
    });
  });

  return cascaderValue;
}
