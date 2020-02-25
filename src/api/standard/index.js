// import axios from '@/libs/api.request.mock';
import axios from "@/libs/api.request";

// 获取所有标准项
export const findByProductClass = (data) => {
  return axios.request({
    url: "/api/standardValues/findByProductClass",
    method: "post",
    data
  });
};

// 获取所有电机型号
export const findAllProductClass = () => {
  return axios.request({
    url: "/api/standardValues/findAllProductClass",
    method: "get"
  });
};

// 编辑标准项
export const editByProductClass = (data) => {
  return axios.request({
    url: "/api/standardValues/editByProductClass",
    method: "post",
    data
  });
};

// 使用标准项
export const activeByProductClass = (data) => {
  return axios.request({
    url: "/api/standardValues/activeByProductClass",
    method: "post",
    data
  });
};
