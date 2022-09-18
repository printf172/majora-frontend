import uri from "./uri";
import axios from "axios";

const prefix = "";

let timer = null;

let reqs = {
  getStore: (isAdmin) => {
    const user = JSON.parse(localStorage.getItem("Majora-USER") || "{}");
    if (isAdmin) {
      return user;
    }
    const userMock = JSON.parse(localStorage.getItem("Majora-USER-MOCK") || "{}");
    return userMock.mock ? userMock : user;
  },
  setStore: (user, key) => {
    const userMock = JSON.parse(localStorage.getItem("Majora-USER-MOCK") || "{}");
    key = key || (userMock.mock ? "Majora-USER-MOCK" : "Majora-USER");
    localStorage.setItem(key, JSON.stringify(user));
  }
};

function redirectToLogin() {
  localStorage.removeItem("Majora-USER");
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    let href = window.location.href;
    if (href.indexOf("/#/sign-in") < 0) {
      localStorage.setItem("MajoraAfterSignTarget", href);
    }
    window.location.href = "/#/sign-in";
  }, 100);
}

function doGet(uri, params = "", route = false) {
  if (route) {
    uri += params ? ("/" + params) : "";
  } else {
    // 组装参数
    let p = [];
    for (let i of Object.keys({ ...params })) {
      p.push(`${i}=${params[i]}`);
    }
    if (p.length > 0) {
      uri += "?" + p.join("&");
    }
  }
  let user = reqs.getStore();
  return new Promise((resolve) => {
    axios({
      method: "get",
      url: prefix + uri,
      headers: {
        token: user.loginToken
      }
    })
      .then((response) => {
        if (response.data.status === -1 && response.data.message === "请重新登录") {
          redirectToLogin();
          return;
        }
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status !== 200 && uri.indexOf("yint-stub") > 0) {
            // 因体插桩代码，在源码售卖场景下接口正常会404，此时把状态打入下层业务
            resolve(error.response);
            return;
          }
          resolve(error.response?.data);
        }
      });
  });
}

function doPost(uri, data, query) {
  // 组装参数
  let p = [];
  for (let i of Object.keys({ ...data })) {
    p.push(`${i}=${data[i]}`);
  }
  let user = reqs.getStore();
  return new Promise((resolve) => {
    axios({
      method: "post",
      url: prefix + uri,
      data: query ? p.join("&") : data,
      headers: {
        token: user.loginToken
      }
    })
      .then((response) => {
        if (response.data.status === -1 && response.data.message === "请重新登录") {
          redirectToLogin();
          return;
        }
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          resolve(error.response?.data);
        }
      });
  });
}

function doForm(uri, data) {
  // 组装参数
  let form = new FormData();
  for (let i of Object.keys({ ...data })) {
    form.append(i, data[i]);
  }
  let user = reqs.getStore();
  return new Promise((resolve) => {
    axios({
      method: "post",
      url: prefix + uri,
      data: form,
      headers: {
        token: user.loginToken
      }
    })
      .then((response) => {
        if (response.data.status === -1 && response.data.message === "请重新登录") {
          redirectToLogin();
          return;
        }
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          resolve(error.response?.data);
        }
      });
  });
}

for (let i of Object.keys(uri)) {
  const [url, method, query] = uri[i].split(" ");
  if (method === "post") {
    reqs[i] = (body) => doPost(url, body, query);
  } else if (method === "form") {
    reqs[i] = (body) => doForm(url, body);
  } else {
    reqs[i] = (params) => doGet(url, params, query);
  }
}

export default reqs;
