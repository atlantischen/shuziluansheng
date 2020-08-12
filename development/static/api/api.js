let baseroot = {
  ResourceManagementService: "http://192.168.89.213:9081",
  SceneFileManagementService: "http://192.168.89.213:9082",
  StyleFileManagementService: "http://192.168.89.213:9083",
  DataitemFileManagementService: "http://192.168.89.213:9084",
  DataFilesManagementService: "http://192.168.89.213:9085",
  DataInterfaceService: "http://192.168.89.213:9086",
  DataInterfaceRestfulService: "http://192.168.89.213:9087",
  ViewerServer: "http://192.168.89.213:8081",
  CClient:"http://192.168.89.213:8081/VRControl.rar"

  // ResourceManagementService : 'http://111.230.241.106:9081',
  // SceneFileManagementService : 'http://111.230.241.106:9082',
  // StyleFileManagementService : 'http://111.230.241.106:9083',
  // DataitemFileManagementService :'http://111.230.241.106:9084',
  // DataFilesManagementService : 'http://111.230.241.106:9085',
  // DataInterfaceService : 'http://111.230.241.106:9086',
  // DataInterfaceRestfulService: 'http://111.230.241.106:9087',
  // ViewerServer:"http://111.230.241.106:8081",

  // 192.168.10.36
};
/*生产环境*/

// let pro_ResourceManagementService = 'http://111.230.241.106:9081';
// let pro_SceneFileManagementService = 'http://111.230.241.106:9082';
// let pro_StyleFileManagementService = 'http://111.230.241.106:9083';
// let pro_DataitemFileManagementService = 'http://111.230.241.106:9084';
// let pro_DataFilesManagementService = 'http://111.230.241.106:9085';
// let pro_DataInterfaceService = 'http://111.230.241.106:9086';
// let pro_DataInterfaceRestfulService = 'http://111.230.241.106:9087';
// let pro_ViewerServer = "http://111.230.241.106:8081";

// let pro_ResourceManagementService = 'http://192.168.89.101:9081';
// let pro_SceneFileManagementService = 'http://192.168.89.101:9082';
// let pro_StyleFileManagementService = 'http://192.168.89.101:9083';
// let pro_DataitemFileManagementService = 'http://192.168.89.101:9084';
// let pro_DataFilesManagementService = 'http://192.168.89.101:9085';
// let pro_DataInterfaceService = 'http://192.168.89.101:9086';
// let pro_DataInterfaceRestfulService = 'http://192.168.89.101:9087';
// let pro_ViewerServer = "http://192.168.89.101:8081";

let pro_ResourceManagementService = "http://192.168.10.36:9081";
let pro_SceneFileManagementService = "http://192.168.10.36:9082";
let pro_StyleFileManagementService = "http://192.168.10.36:9083";
let pro_DataitemFileManagementService = "http://192.168.10.36:9084";
let pro_DataFilesManagementService = "http://192.168.10.36:9085";
let pro_DataInterfaceService = "http://192.168.10.36:9086";
let pro_DataInterfaceRestfulService = "http://192.168.10.36:9087";
let pro_ViewerServer = "http://192.168.10.36:8081";
// if (process.env.NODE_ENV == 'production') {
baseroot = {
  ResourceManagementService: pro_ResourceManagementService,
  SceneFileManagementService: pro_SceneFileManagementService,
  StyleFileManagementService: pro_StyleFileManagementService,
  DataitemFileManagementService: pro_DataitemFileManagementService,
  DataFilesManagementService: pro_DataFilesManagementService,
  DataInterfaceService: pro_DataInterfaceService,
  DataInterfaceRestfulService: pro_DataInterfaceRestfulService,
  ViewerServer: pro_ViewerServer
};
// }

//   for api.json
// "ResourceManagementService": "http://111.230.241.106:9081",
// "SceneFileManagementService": "hhttp://111.230.241.106:9082",
// "StyleFileManagementService": "http://111.230.241.106:9083",
// "DataitemFileManagementService": "http://111.230.241.106:9084",
// "DataFilesManagementService": "http://111.230.241.106:9085",
// "DataInterfaceService": "http://111.230.241.106:9086",
// "DataInterfaceRestfulService": "http://111.230.241.106:9087",
// "ViewerServer" : "http://111.230.241.106:8081",

// "ResourceManagementService": "http://192.168.10.36:9081",
//  "SceneFileManagementService": "http://192.168.10.36:9082",
// "StyleFileManagementService": "http://192.168.10.36:9083",
// "DataitemFileManagementService": "http://192.168.10.36:9084",
// "DataFilesManagementService": "http://192.168.10.36:9085",
// "DataInterfaceService": "http://192.168.10.36:9086",
// "DataInterfaceRestfulService": "http://192.168.10.36:9087",
//  "ViewerServer" : "http://192.168.10.36:8081"

export default baseroot;
