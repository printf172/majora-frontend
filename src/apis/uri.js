export default {
  login: "/majora-api/user-info/login post query", // 登录
  register: "/majora-api/user-info/register post query", // 注册
  refreshToken: "/majora-api/user-info/refreshToken get", // 刷新 token
  regenerateAPIToken: "/majora-api/user-info/regenerateAPIToken get", // 刷新 api token
  setAuth: "/majora-api/user-info/setupAuthAccount get", // 设置 auth 账号
  updatePassword: "/majora-api/user-info/resetPassword get", // 修改密码
  getUser: "/majora-api/user-info/userInfo get", // 获取用户信息
  notice: "/majora-api/user-info/notice get", // 系统通知
  userAdd: "/majora-api/user-info/createUser get", // 创建用户
  userList: "/majora-api/user-info/listUser get", // 用户列表
  setConfig: "/majora-api/system/setConfig post", // config 单条
  setConfigs: "/majora-api/system/setConfigs post", // config all
  allConfig: "/majora-api/system/allConfig get", // 所有 config

  whiteList: "/majora-api/user-op/listAuthWhiteIp get", // 白名单列表
  whiteListAdd: "/majora-api/user-op/addWhiteIp get", // 白名单新增
  whiteListDelete: "/majora-api/user-op/deleteAuthWhiteIp get", // 白名单删除

  endpointList: "/majora-api/endpoint/listDevice get",  // 终端设备列表
  bindMappingPort: "/majora-api/endpoint/bindMappingPort get",  // 终端绑定固定出口
  unBindingMappingPort: "/majora-api/endpoint/unBindingMappingPort get",  // 移除固定出口绑定
  deleteEndpoint: "/majora-api/endpoint/deleteEndpoint get",  // 删除终端

  getAuthPushMessage: "/majora-api/system/getAuthPushMessage get", // 查看系统信息
  listClient: "/majora-api/system-info/listClient get", // 列出客户端

  vendorBillList: "/majora-api/report/listVendorBill get", // 查询供应商流水
  vendorBillExport: "/majora-api/report/exportVendorBill get", // 供应商流水导出
  consumerBillList: "/majora-api/report/listConsumerBill get", // 用户流水
  consumerBillExport: "/majora-api/report/exportConsumerBill get", // 用户流水代导出
  searchAccessRecord: "/majora-api/report/searchAccessRecord get", // 用户流水代导出

  // 授权信息
  getIntPushMsg: "/yint-stub/certificate/getIntPushMsg get", // 授权信息
  getNowCertificate: "/yint-stub/certificate/getNowCertificate get" // 授权证书
}
