import axios from "axios";

axios.defaults.timeout = 3000;

// var axios =Axios.create({
//     // withCredentials:true, //跨域过程中，客户端必须要设置，允许ajax 携带cookie到服务器；
//     baseURL:'http://192.168.89.213:8000'

//   });
const baseURL = "http://192.168.89.213:8000";
//http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: localStorage.getItem("token") || {}
      // 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.LuXz5joFpcO1DNRpf4MWEvAKmIpWEZon_JLfms2qtvz7vU8inwnH1ExMZXc9KP4O8Ur6GraazN2uAxirNmMnFQ'
    };
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    console.log(err);
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log("错误请求");
          break;
        case 401:
          console.log("未授权，请重新登录");
          break;
        case 403:
          console.log("拒绝访问");
          break;
        case 404:
          console.log("请求错误,未找到该资源");
          break;
        case 405:
          console.log("请求方法未允许");
          break;
        case 408:
          console.log("请求超时");
          break;
        case 500:
          console.log("服务器端出错");
          break;
        case 501:
          console.log("网络未实现");
          break;
        case 502:
          console.log("网络错误");
          break;
        case 503:
          console.log("服务不可用");
          break;
        case 504:
          console.log("网络超时");
          break;
        case 505:
          console.log("http版本不支持该请求");
          break;
        default:
          console.log(`连接错误${err.response.status}`);
      }
    } else {
      console.log("连接到服务器失败");
    }
    return Promise.resolve(err.response);
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, data)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 下面是获取数据的接口
 */
/**
 * 测试接口
 * 名称：exam
 * 参数：paramObj/null
 * 方式：fetch/post/patch/put
 */
export const server = {
  iplocal: function() {
    return fetch(baseURL);
  },
  login: function(username, password) {
    //登录
    return post(baseURL + "/auth/login", { username, password });
  },
  register: function(
    username,
    industry,
    factory,
    email,
    phone,
    nickName,
    code,
    uuid
  ) {
    //用户注册
    return post(baseURL + "/auth/registry", {
      username,
      industry,
      factory,
      email,
      phone,
      nickName,
      code,
      uuid
    });
  },
  getIndustry: function() {
    //获取所属行业
    return fetch(baseURL + "/industry/list");
  },
  getCode: function() {
    //获取图片验证码
    return fetch(baseURL + "/auth/code");
  },
  resourcesList: function() {
    //资源数据列表
    return fetch(baseURL + "/resources/list/");
  },
  getpaginglist: function(pageSize, pageNum) {
    //项目管理页面数据请求
    return fetch(baseURL + "/scene/conf/page/" + pageSize + "/" + pageNum);
  },
  addscene: function(paramObj) {
    //添加新场景
    console.log(paramObj);
    return post(baseURL + "/scene/conf/add", paramObj);
  },
  scenedataadd: function(paramObj) {
    //添加场景数据配置
    return post(baseURL + "/scene/data/add", paramObj);
  },
  sceneinfoadd: function(paramObj) {
    //添加场景配置信息
    return post(baseURL + "/scene/info/add", paramObj);
  },
  editscene: function(paramObj) {
    //再次编辑场景
    console.log(paramObj, "再次编辑接口");
    return post(baseURL + "/scene/conf/edit", paramObj);
  },
  sceneinfogetByScene: function(paramObj) {
    //根据id查询场景信息
    console.log(paramObj);
    return fetch(baseURL + "/scene/info/getByScene/" + paramObj);
  },
  deleteScene: function(id) {
    //删除场景
    return post(baseURL + "/scene/conf/delete/" + id);
  },
  addsmallpanel: function(paramObj) {
    //添加小面板
    console.log(paramObj);
    return post(baseURL + "/small/panel/add", paramObj);
  },
  editsmallpanel: function(paramObj) {
    //修改原有的小面板
    console.log(paramObj);
    return post(baseURL + "/small/panel/edit", paramObj);
  },
  smallpanelstylelist: function() {
    //获取小面板样式列表
    return fetch(baseURL + "/small/panel/style/list");
  },
  smallpanelgetid: function(id) {
    //根据id获取单个小面板的数据
    return fetch(baseURL + "/small/panel/get/" + id);
  },
  smallpanellist: function() {
    //获取单个小面板的数据列表
    return fetch(baseURL + "/small/panel/list");
  },
  smallpaneldeleteid: function(id) {
    //获取单个小面id删除
    return post(baseURL + "/small/panel/delete/" + id);
  },
  machinetype: function() {
    //根据当前用户行业获取设备类型列表
    return fetch(baseURL + "/machine/type/listByIndustry");
  },
  machinemodalgetByType: function(type) {
    //根据设备类型查询型号列表
    return fetch(baseURL + "/machine/modal/getByType/" + type);
  },
  bigpanelgetListByModelId: function(modalId) {
    //根据设备型号查询大面板数据列表
    return fetch(baseURL + "/big/panel/getListByModelId/" + modalId);
  },
  smallpanelgetListByModelId: function(modalId) {
    //根据设备型号查询小面板数据列表
    return fetch(baseURL + "/small/panel/data/getListByModelId/" + modalId);
  },
  machinemodalgetByUser: function() {
    return fetch(baseURL + "/machine/modal/getByUser");
  },
  saveUnityJsonData: function(paramObj) {
    return post(baseURL + "/scene/unity/data/add", paramObj);
  },
  getTagType: function() {
    // 获取标签类型
    return fetch(baseURL + "/tag/type/list");
  },
  getTagLocation: function(tagTypeId) {
    // 根据标签类型查询列表
    return fetch(baseURL + "/tag/getList/" + tagTypeId);
  },
  // 搜索功能
  getByUser(page, size, searchParams) {
    return axios({
      method: "get",
      url: baseURL + "/scene/conf/getByUser/" + page + "/" + size,
      params: {
        beginTime: searchParams.beginTime,
        endTime: searchParams.endTime,
        sceneName: searchParams.sceneName
      }
    });
  }
};
