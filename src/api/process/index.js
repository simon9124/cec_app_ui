// import axios from '@/libs/api.request.mock';
import axios from "@/libs/api.request";

// 获取检测步骤的Sop
export const getSopByQcIndex = (qcIndex) => {
  return axios.request({
    url: `/api/testprocess/getSopByQcIndex?qcIndex=${qcIndex}`,
    method: "get"
  });
};

// 获取产品工序对应的SN编码
export const setProductLineSnBySop = (data) => {
  return axios.request({
    url: "/api/testprocess/setProductLineSnBySop",
    method: "post",
    data
  });
};

// 获取当前产线使用的Sn
export const getLineSn = () => {
  return axios.request({
    url: "/api/testprocess/getLineSn",
    method: "get"
  });
};

// 分页获取SOP列表
export const findSopByPage = (pageIndex, pageSize, qc) => {
  return axios.request({
    url: `/api/testprocess/findSopByPage?pageIndex=${pageIndex}&pageSize=${pageSize}&qc=${qc}`,
    method: "get"
  });
};

// 新增SOP
export const addSop = (data) => {
  return axios.request({
    url: "/api/testprocess/addSop",
    method: "post",
    data
  });
};

// 更新SOP
export const editSop = (data) => {
  return axios.request({
    url: "/api/testprocess/editSop",
    method: "post",
    data
  });
};

// 删除SOP
export const removeSop = (sop) => {
  return axios.request({
    url: `/api/testprocess/removeSop?sop=${sop}`,
    method: "get"
  });
};

// 查询工序详情
export const findSopItemBySop = (sop) => {
  return axios.request({
    url: `/api/testprocess/findSopItemBySop?sop=${sop}`,
    method: "get"
  });
};

// 查询sop列表
export const findSopByKey = (qcIndex, sop) => {
  return axios.request({
    url: `/api/testprocess/findSopByKey?qcIndex=${qcIndex}&sop=${sop}`,
    method: "get"
  });
};

// 查询工序参数列表
export const findAllItemParam = (qcIndex) => {
  return axios.request({
    url: `/api/testprocess/findAllItemParam?qcIndex=${qcIndex}`,
    method: "get"
  });
};

// 修改工序参数
export const editItemParam = (data) => {
  return axios.request({
    url: "/api/testprocess/editItemParam",
    method: "post",
    data
  });
};
