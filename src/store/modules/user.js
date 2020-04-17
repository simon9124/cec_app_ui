// import { login, logout, getInfo } from "@/api/user";
import { login, getUserInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: ""
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, lineNo } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, lineNo: lineNo })
        .then(response => {
          const data = response.data;
          if (data.status === 200) {
            commit("SET_TOKEN", data.data);
            setToken(data.data);
          }
          // const { data } = response;
          // commit("SET_TOKEN", data.token);
          // setToken(data.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token)
      getUserInfo(state.token)
        .then(response => {
          // const { data } = response;
          const { data } = response.data;

          if (!data) {
            reject("Verification failed, please Login again.");
          }
          console.log(data);

          const { userName, user_avator } = data;
          commit("SET_NAME", userName);
          commit("SET_AVATAR", user_avator);
          resolve(data);
        })
        .catch(error => {
          // reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token)
      //   .then(() => {
      //     commit("SET_TOKEN", "");
      //     removeToken();
      //     resetRouter();
      //     resolve();
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
      commit("SET_TOKEN", "");
      removeToken();
      resetRouter();
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
