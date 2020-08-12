<template>
  <div class="manage">
    <div class="header">
      <div class="header_logo">
        <img src="../assets/image/logo.png" alt="木星数字孪生开发平台" />
      </div>
      <div class="header_desc">
        <span @click="uploadClientFile()" alt="下载客户端">
          <img src="../assets/image/upload.png" alt />
          <i>下载客户端</i>
        </span>
        <div class="username">
          <span>
             <img src="../assets/image/index-d-t.png" alt />
          </span>
          <div class="user_show">
            <div class="user_email">
              <img src="../assets/image/index-yx.png" alt />
              <span>{{userEmail}}</span>
            </div>
            <div class="user_name">
              <img src="../assets/image/index-yhm.png" alt />
              <span>{{userName}}</span>
            </div>
            <div class="logout" @click="logoOut()">
              <img src="../assets/image/index-dc.png" alt />
              退出
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="neck" v-if="searchDiv">
      <div class="searchDiv">
        <span class="inputName">
          <input
            type="text"
            :class="[inputclick?'inputclick':'']"
            v-model="searchName"
            placeholder="请输入场景名称"
          />
          <img class="search_icon" src="../assets/image/index-ss.png" alt />
          <span v-if="searchName != ''" @click="clearInputv()" class="clearinput"></span>
        </span>
        <el-date-picker
          v-model="startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>
        <span class="zhi">一</span>
        <el-date-picker v-model="endTime" type="date" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
        <span class="sd_btn" @click="search_()">查询</span>
        <span class="sd_btn sd_btnexit" @click="exitsearch()">退出搜索</span>
      </div>
    </div>
    <div class="content">
      <div class="aside">
        <p>
          <!-- <input type="text" name="" id="" placeholder="主页"/> -->
        </p>
        <p>
          <img src="../assets/image/allimg.png" alt="华龙讯达" />
        </p>
        <ul>
          <li>
            <span>企业名称:</span>
            <span>华龙讯达</span>
          </li>
          <li>
            <span>企业权限:</span>
            <span>会员</span>
          </li>
          <li>
            <span>行业所属:</span>
            <span>工业互联网</span>
          </li>
          <li>
            <button :class="[edit ?'btnhover':'nobtnhover']" @click="editmessage()">设置</button>
          </li>
        </ul>
      </div>
      <div class="main">
        <div class="switchItem">
          <span class="spanhover">项目列表</span>
          <span>|</span>
          <span>统计信息</span>
          <span>|</span>
          <span :class="[searchDiv ? 'spanhover':'nospanhover']" @click="search()">搜索</span>
          <p @click="addScene()">添加项目</p>
        </div>
        <div class="mainList">
          <ul class="bigList">
            <li class="List_item" v-for="(item , key) in totalMainList" :key="key">
              <p class="item_img">
                <img :src="item.iconUrl" alt />
              </p>
              <ul class="list_CJ_item">
                <li>
                  <span @click="dellietone(key,item)"></span>
                </li>
                <li>
                  <span>场景名称:</span>
                  <span>{{item.sceneName}}</span>
                </li>
                <li>
                  <span>创建日期:</span>
                  <span>{{item.createTime}}</span>
                </li>
                <li>
                  <span>修改日期:</span>
                  <span>{{item.createTime}}</span>
                </li>
                <li>
                  <!-- <span>场景描述: </span><span>{{item.info}}</span> -->
                  <span>场景作者:</span>
                  <span>{{item.createBy}}</span>
                </li>
              </ul>
              <span class="Btn_list">
                <!-- <button style="display:none;" @click="editscene(key,item)">编辑</button> -->
                <button @click="openscene(key,item)">编辑</button>
                <button @click="checkscene(key,item)">查看</button>
              </span>
            </li>
          </ul>
        </div>
        <div class="paging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="pageSize"
            layout="prev, pager, next , total"
            :total="listlength"
          ></el-pagination>
        </div>
      </div>
    </div>
    <v-setUpM :index="Zindex" v-if="edit" @setup_M="setup_M"></v-setUpM>
    <div class="editpanel" v-if="editpanel">
      <p @click="hidepanel()">
        <img src="../assets/image/delpanel.png" alt />
      </p>
      <div class="imglist">
        <span>
          <span class="jiahao"></span>
        </span>
      </div>
      <ul class="editone">
        <li>
          <input type="text" v-model="edited_name" placeholder="请输入场景名称" />
        </li>
        <li>
          <input type="text" v-model="edited_info" placeholder="请输入场景描述" />
        </li>
        <li>
          <button @click="save_edited()">保存</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import drag from "../../static/js/drag";
import setUpM from "../panel/setupM.vue";
import { webEdior } from "../../static/js/webEdior.js";
import { server } from "../assets/js/http-server";
import { colorRgb } from "../../static/js/utils";
export default {
  name: "manage",
  inject: ["reload"],
  data() {
    return {
      userName: "",
      userEmail: "",
      iplocal: "http://192.168.89.213:8000",
      inputclick: false,
      searchIcon: false,
      startTime: null,
      endTime: null,
      searchName: "08-10-001",
      searchDiv: false, //搜索板块的显示隐藏
      httpdata: "",
      edited_name: "", //弹框修改名称
      edited_describe: "", //弹框修改说明
      currentPage1: 1, //默认显示页数
      listlength: 0, //总页数
      edit: false, //侧边栏点击编辑显示下面企业可编辑的三项
      C_address: "", //地址
      Tel_phone: "", //电话
      Email: "", //email
      pageSize: 9,
      page: 1,
      mainList: [
        //列表信息
      ],
      totalMainList: [],
      editpanel: false, //弹框编辑
      fnwebEdior: {}, //js
      clickitemkey: "", //点击项的key值
      bselected: true,
      Zindex: 100, // 控制弹框层级
    };
  },
  components: {
    "v-setUpM": setUpM, //清空历史记录弹框
  },
  watch: {
    startTime() {
      if (this.startTime) return;
      if (this.endTime < this.startTime) {

        alert("开始时间不能大于结束时间");
      }
    },
    endTime() {
      if (this.endTime) return;
      console.log(this.endTime);
      if (this.endTime < this.startTime) {
        alert("结束时间不能小于开始时间");
      }
    },
  },
  methods: {
    // 获取存储的user信息
    getUser() {
      let user = JSON.parse(localStorage.getItem("user") || "");
      (this.userName = user.username), (this.userEmail = user.email||'');
    },
    // 推出登录
    logoOut() {
      localStorage.clear(), //清除localStorage 存储
        this.delCookie("token"); //清除cookie
      this.$router.push("/");
    },
    // 清除cookie的方法
    delCookie(name) {
      document.cookie = `${name}=;max-age=0`;
    },
    // 搜索功能
    search_() {
      let searchParams = {
        beginTime: this.startTime,
        endTime: this.endTime,
        sceneName: this.searchName,
      };
      this.$server
        .getByUser(this.page, this.pageSize, searchParams)
        .then((res) => {
          this.totalMainList = res.data.data.records;
        });
    },
    clearInputv() {
      this.searchName = "";
      this.getlistdata("1", "9");
    },
    exitsearch() {
      this.searchDiv = false;
      this.getlistdata("1", "9");
    },
    search() {
      //点击搜索触发
      this.searchDiv = true;
      // this.searchIcon = false;
    },
    searchFn() {
      if (this.searchIcon == false) {
        this.searchIcon = true;
      }
    },
    addScene() {
      //添加项目按钮
      let login_3 = true;
      let host = location.host;
      this.$router.push({
        path: "/index",
        query: { login_3: login_3, type: "reload" },
      });
    },
    uploadClientFile() {
      window.open("http://192.168.89.101:9005/DeviceModels/test/CSClient.zip");
    },
    editmessage() {
      //设置按钮
      console.log(this.edit);
      if (this.edit == false) {
        this.edit = true;
      } else if (this.edit == true) {
        this.edit = false;
      }
    },
    setup_M(data) {
      this.edit = false;
    },
    save() {
      //保存编辑后的会员信息
      console.log(this.C_address);
    },
    dellietone(key, item) {
      //每一项的删除图标
      this.$confirm("此操作将删除该场景,返回到第一页, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            // console.log('555');
            // let id = item
            //  this.$server.deleteScene(id)
          if (item.sceneName !== "" && item.sceneName !== undefined) {
            let data = {};
            let id = item.uuid;
            this.$server
              .deleteScene(id)
              .then((data) => {
                this.$message({
                  type: "success",
                  message: "删除成功",
                });
                this.reload();
              })
              .catch((res) => {});
          } else {
            this.fnwebEdior = webEdior();
            this.fnwebEdior.createScene();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editscene(key, item) {
      //编辑场景
      this.editpanel = true;
      this.clickitemkey = key;
      this.edited_name = item.name;
      this.edited_info = item.info;
    },
    save_edited() {
      //编辑场景点击，弹框修改后数据
      console.log(this.edited_name, this.edited_info);
      this.totalMainList[this.page - 1][
        this.clickitemkey
      ].name = this.edited_name;
      this.totalMainList[this.page - 1][
        this.clickitemkey
      ].info = this.edited_info;
      this.editpanel = false;
    },
    openscene(key, item) {
      //打开场景
      console.log("打开场景");
      console.log(key, item);
      item.imgdata = "";
      let login_3 = true;
      let host = location.host;
      localStorage.setItem("ys-opten-scene", JSON.stringify(item));
      // this.$router.push({ path: '/index' });
      this.$router.push({
        path: "/index",
        query: { login_3: login_3, type: "reload" },
      });
      // location.reload();
    },
    checkscene(key, item) {
      //查看场景
      console.log(key, item);
      window.open(
        this.httpdata.ViewerServer +
          "/viewer/index.html?scenename=" +
          item.uuid +
          "&controls=3&type=2"
      );
    },
    handleSizeChange(val) {
      this.getlistdata(val, "9");
      this.page = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getlistdata(val, "9");

    },
    hidepanel() {
      this.editpanel = false;
    },
    async getlistdata(page, pagesize) {
      //拿到数据渲染
      var type = "test",
        dataopen = "";
      return this.$server
        .getpaginglist(page, pagesize)
        .then((data) => {
          console.log(data);
          this.totalMainList = [];
          this.totalMainList = data.data.data.records;
          this.listlength = data.data.data.total;
          this.pageSize = data.data.data.size;
          this.page = data.data.data.pages;
        })
        .catch((res) => {});
    },
    async setImgdata(page = 1) {
      let mainList = this.totalMainList[page - 1];
      //处理请求
      for (let x = 0; x < mainList.length; x++) {
        let type = "test";
        let name = mainList[x].image;
        let data = {};
        await this.$http(
          `${this.httpdata.SceneFileManagementService}/SceneFile-Management-Service/getSceneIcon/${type}/${name}`,
          data,
          "get"
        )
          .then((res) => {
            // console.log(res);
            mainList[x].imgdata = res.data;
          })
          .catch((res) => {});
      }
      this.$set(this.totalMainList, page - 1, mainList);
    },
    setData(mainList) {
      let totalMainList = [];
      // 处理分页数据
      console.log(mainList.length);
      for (let y = 0; y < mainList.length; y += this.pageSize) {
        totalMainList.push(mainList.slice(y, y + this.pageSize));
      }

      console.log(totalMainList);
      this.totalMainList = totalMainList;
      console.log(this.totalMainList);
      this.listlength = mainList.length;
    },
  },
  created() {
    this.getUser();
  },
  mounted: function () {
    this.getlistdata("1", "9");
    let gbdefultdata = {};
    this.$http("./static/api/api.json", gbdefultdata, "get")
      .then((data) => {
        // 请求本地，背景名称
        this.httpdata = data.baseroot;
        // console.log(this.httpdata);
      })
      .catch((res) => {});
  },
};
</script>
<style lang="less" scoped>
.manage {
  position: relative;
  width: 100vw;
  min-width: 1280px;
  height: 100vh;
  min-height: 720px;
  margin: 0;
  padding: 0;
  background: #1b1b1b;
  overflow: hidden;
  box-sizing: border-box;
  .header {
    width: 19.2rem;
    height: 0.4rem;
    display: flex;
    min-height: 42px;
    line-height: 42px;
    background: #242424;
    box-sizing: border-box;
    .header_logo {
      width: 83%;
      height: 100%;
      padding-left: .1rem;
      box-sizing: border-box;
    }
    .header_desc {
      width: 15%;
      height: 100%;
      color: #fff;
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
      & > span {
        display: inline-block;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        width: 32%;
        color: #0386f5;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .username {
        width: 32%;
        font-size: 18px;
        text-align: center;
        position: relative;
        .user_show {
          position: absolute;
          bottom: -1.55rem;
          left: -190%;
          transform: translateX(50%);
          width: 2.2rem;
          height: 1.5rem;
          background-color: #373d5e;
          z-index: 999;
          display: none;
          border-radius: 5px;
          font-size: 16px;
          & > div {
            height: 33.33%;
            display: flex;
            padding-left: 0.24rem;
            box-sizing: border-box;
            align-items: center;
            & > img {
              margin-right: 0.1rem;
            }
          }
          &::before {
            content: "";
            display: block;
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 8px solid #373d5e;
          }
        }
        &:hover > .user_show {
          display: block;
        }
      }
    }
  }
  .neck {
    position: relative;
    width: 19.2rem;
    height: 0.68rem;
    display: flex;
    background: #1b1b1b;
    // line-height: .46rem;
    // border: 1px solid red;
    box-sizing: border-box;
    .searchDiv {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 15.5rem;
      //   height: 0.44rem;
      // border: 1px solid red;
      box-sizing: border-box;
      .inputName {
        position: relative;
        display: inline-block;
        width: 8.08rem;
        height: 0.4rem;
        margin-right: 0.14rem;
        // border: 1px solid red;
        box-sizing: border-box;
        input {
          width: 8.08rem;
          height: 0.4rem;
          padding-left: 0.42rem;
          background: rgba(56, 56, 56, 1);
          border-radius: 6px;
          // color: aliceblue;
          border: 1px solid rgba(56, 56, 56, 1);
          box-sizing: border-box;
        }
        input::-webkit-input-placeholder {
          color: #999999;
          //这里修改placeholder的样式
        }
        .search_icon {
          position: absolute;
          left: 0.14rem;
          top: 0.1rem;
          width: 0.19rem;
          height: 0.2rem;
        }
        .clearinput {
          position: absolute;
          right: 0.14rem;
          top: 0.09rem;
          width: 20px;
          height: 20px;
          background: url("../assets/image/icon-x1.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
        .clearinput:hover {
          background: url("../assets/image/icon-x.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
      }
      .sd_btn {
        display: inline-block;
        width: 0.8rem;
        height: 0.38rem;
        margin-left: 0.17rem;
        line-height: 0.38rem;
        text-align: center;
        color: #ffffff;
        font-size: 0.12rem;
        background: rgba(85, 85, 86, 1);
        border-radius: 4px;
      }
      .sd_btnexit {
        width: 1.1rem;
        margin-left: 0.14rem;
      }
      .sd_btn:hover,
      .spanhover {
        color: #ffffff;
        background: url("../assets/image/manage_1.png") no-repeat;
        background-size: 100% 100%;
        background-position: center;
      }
      .zhi {
        display: inline-block;
        margin-left: 0.05rem;
        margin-right: 0.05rem;
        width: 10px;
        height: 100%;
        text-align: center;
        // border: 1px solid red;
      }
    }
    .searchIcon {
      position: absolute;
      top: 0.05rem;
      right: 0.5rem;
      display: inline-block;
      width: 0.25rem;
      height: 0.25rem;
      margin-top: 0.14rem;
      // border: 1px solid red;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .inputclick {
      border: 1px solid #00a4ff !important;
    }
  }
  .content {
    width: 19.2rem;
    height: 9rem;
    display: flex;
    margin: 0;
    padding: 0;
    margin-top: 0.15rem;
    background: #1b1b1b;
    // border: 1px solid red;
    box-sizing: border-box;
    overflow: hidden;
    .aside {
      width: 3.86rem;
      height: 9rem;
      padding-left: 0.6rem;
      color: rgba(255, 255, 255, 1);
      // border: 1px solid red;
      box-sizing: border-box;
      overflow: hidden;
      p {
        width: 2.8rem;
        height: 45px;
        margin-top: 25px;
        color: rgba(255, 255, 255, 1);
        // border: 1px solid red;
        input {
          width: 212px;
          height: 28px;
          padding-left: 8px;
          color: rgba(255, 255, 255, 1);
          background: rgba(50, 50, 50, 1);
          font-size: 15px;
          border: none;
        }
      }
      p:nth-child(2) {
        margin-top: 13px;
        margin-bottom: 15px;
      }
      ul {
        margin-top: 0.45rem;
        li {
          margin-bottom: 3px;
          button,
          .nobtnhover {
            display: inline-block;
            width: 100px;
            height: 34px;
            font-size: 14px;
            line-height: 34px;
            background: none;
            border: none;
            color: #fff;
            background: url("../assets/image/manage_9.png") no-repeat;
            background-size: 100% 100%;
            background-position: center;
          }
          button:hover,
          .btnhover {
            color: #069ff5;
            background: url("../assets/image/manage_8.png") no-repeat;
            background-size: 100% 100%;
            background-position: center;
          }
          input {
            display: inline-block;
            width: 140px;
            height: 20px;
            padding-left: 6px;
            margin-left: 5px;
            background: #ddd;
            line-height: 20px;
            border: none;
          }
        }
        li:nth-child(4),
        li:nth-child(8) {
          margin-top: 10px;
        }
      }
    }
    .main {
      width: 15.3rem;
      height: 9.46rem;
      background: #1b1b1b;
      color: #fff;
      // border: 1px solid red;
      box-sizing: border-box;
      .main_header {
        position: relative;
        width: 100%;
        height: 0.7rem;
        line-height: 0.7rem;
        // border: 1px solid red;
        box-sizing: border-box;
        p {
          text-align: center;
          font-style: "MicrosoftYaHei";
          font-size: 0.28rem;
          font-weight: 100;
        }
      }
      .switchItem {
        position: relative;
        width: 14.7rem;
        height: 0.3rem;
        margin-left: 0.14rem;
        line-height: 0.24rem;
        // border: 1px solid red;
        box-sizing: border-box;
        span {
          display: inline-block;
          height: 0.21rem;
          margin-right: 0.1rem;
          margin-bottom: 0.05rem;
          line-height: 0.16rem;
          text-align: center;
          font-size: 14px;
          // border: 1px solid red;
          box-sizing: border-box;
        }
        span:nth-child(1) {
          width: 56px;
          margin-right: 0.08rem;
        }
        span:nth-child(2),
        span:nth-child(4) {
          width: 1px;
          font-size: 0.18rem;
        }
        span:nth-child(3) {
          width: 56px;
        }
        span:nth-child(5) {
          width: 45px;
        }
        span:hover,
        .spanhover {
          color: #0386f5;
          border-bottom: 1px solid #0386f5;
        }
        .nospanhover {
          color: #ffffff !important;
          border: none !important;
        }
        p {
          position: absolute;
          right: 0.08rem;
          top: 0;
          display: block;
          width: 0.8rem;
          height: 0.3rem;
          text-align: center;
          line-height: 0.3rem;
          background: url("../assets/image/manage_4.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
          // border: 1px solid red;
        }
        p:hover {
          background: url("../assets/image/manage_1.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
        }
      }
      .mainList {
        width: 15rem;
        height: 7.86rem;
        margin-left: 0.1rem;
        margin-top: 0.14rem;
        box-sizing: border-box;
        overflow: hidden;
        .bigList {
          width: 15rem;
          height: 7.66rem;
          // height: 830px;
          overflow: hidden;
          .List_item {
            position: relative;
            width: 4.8rem;
            height: 2.4rem;
            display: inline-block;
            margin-bottom: 0.13rem;
            margin-right: 0.13rem;
            background: rgba(44, 44, 44, 1);
            border: 1px solid rgba(44, 44, 44, 1);
            border-radius: 2px;
            box-sizing: border-box;
            overflow: hidden;
            .item_img {
              position: absolute;
              top: 0.25rem;
              display: inline-block;
              width: 2.2rem;
              height: 1.36rem;
              // margin-top: 26px;
              margin-left: 0.18rem;
              border-radius: 2px;
              background: url("../assets/image/changjin_img.png") no-repeat;
              background-size: 100% 100%;
              background-position: center;
              img {
                width: 2.2rem;
                height: 1.36rem;
              }
            }
            .list_CJ_item {
              position: absolute;
              top: 0px;
              left: 2.43rem;
              display: inline-block;
              width: 2.3rem;
              height: 1.68rem;
              // border: 1px solid red;
              li {
                margin-left: 0.15rem;
                font-size: 0.14rem;
                margin-bottom: 2px;
              }
              li:nth-child(1) {
                position: relative;
                width: 2.3rem;
                height: 0.3rem;
                span {
                  position: absolute;
                  top: 0.12rem;
                  right: 0.34rem;
                  display: inline-block;
                  width: 0.16rem;
                  height: 0.18rem;
                  background: url("../assets/image/manage_10.png") no-repeat;
                  background-size: 100% 100%;
                  background-position: center;
                }
                span:hover {
                  background: url("../assets/image/manage_11.png") no-repeat;
                  background-size: 100% 100%;
                  background-position: center;
                }
              }
              li:nth-child(5) {
                span:nth-child(2) {
                  color: #0386f5;
                }
              }
            }
            .Btn_list {
              position: absolute;
              left: 50.3%;
              bottom: 1px;
              width: 2.4rem;
              height: 25%;
              button {
                width: 0.6rem;
                height: 0.26rem;
                margin-top: 0.08rem;
                margin-right: 0.15rem;
                text-align: center;
                line-height: 0.26rem;
                background: none;
                border: none;
                color: #fff;
                background: url("../assets/image/manage_4.png") no-repeat;
                background-size: 100% 100%;
                background-position: center;
              }
              button:hover {
                background: url("../assets/image/manage_1.png") no-repeat;
                background-size: 100% 100%;
                background-position: center;
              }
            }
          }
          .List_item:hover {
            border: 1px solid #108cd2;
            border-radius: 3px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
  .paging {
    position: absolute;
    bottom:.47rem;
    right: 1.12rem;
    width: 5rem;
    height: 0.4rem;
    margin-top: 8px;
    text-align: right;
    line-height: 0.4rem;
    z-index: 2;
  }
  .editpanel {
    position: absolute;
    top: 284px;
    left: 698px;
    width: 522px;
    height: 380px;
    background: #fff;
    box-sizing: border-box;
    p {
      height: 52px;
      width: 95%;
      line-height: 52px;
      text-align: right;
      border: 1px solid #fff;
      box-sizing: border-box;
    }
    .imglist {
      // position: relative;
      width: 75%;
      height: 100px;
      margin-left: 60px;
      text-align: center;
      span {
        position: relative;
        display: inline-block;
        width: 109px;
        height: 93px;
        background: url("../assets/image/changjin_img.png") no-repeat;
        background-size: cover;
        background-position: center;
        .jiahao {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      span:hover {
        background: url("../assets/image/changjintihuan.png") no-repeat;
        background-size: cover;
        background-position: center;
        .jiahao {
          position: absolute;
          top: 35px;
          left: 44px;
          width: 24px;
          height: 24px;
          background: url("../assets/image/icon-42x_1.png") no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
    }
    .editone {
      width: 100%;
      height: 200px;
      margin-top: 10px;
      li {
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        input {
          width: 270px;
          height: 38px;
          padding-left: 14px;
          font-size: 14px;
          color: #6b6b6b;
          background: transparent;
          border: 1px #6b6b6b dotted;
        }
        button {
          width: 284px;
          height: 38px;
          font-size: 14px;
          color: #fff;
          border: none;
          background: url("../assets/image/save_btn.png") no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
    }
  }
}
</style>
<style lang="less">
.manage {
  .el-input__inner {
    width: 2.25rem;
    height: 0.39rem;
    background: #383838;
    line-height: 0.39rem;
    border-radius: 6px;
    color: #999999;
    border: 1px solid #383838;
    box-sizing: border-box;
    vertical-align: -1px;
  }
  .el-input__icon {
    line-height: 0.39rem;
  }
  .el-pagination {
    button {
      background: transparent !important;
      color: #c0c4cc !important;
    }
    .el-pagination__total {
      color: #fff !important;
      margin-left: 15px !important;
    }
    .btn-prev {
      background: #1b1b1b !important;
      height: 30px !important;
    }
    .btn-next {
      background: #1b1b1b !important;
      height: 30px !important;
    }
    .el-pagination .btn-next,
    .el-pagination .btn-prev {
      color: #c0c4cc !important;
    }
    .el-pagination .btn-next,
    .el-pagination .btn-next {
      color: #c0c4cc !important;
    }
    .el-pager {
      height: 30px !important;
      background: #1b1b1b !important;
      li {
        width: 15px !important;
        height: 30px !important;
        min-width: auto !important;
        text-align: center !important;
        margin: 0 8px;
        line-height: 30px !important;
        color: #fff !important;
        background: #1b1b1b !important;
        &.active {
          // border: #1B1B1B;
          // border-radius: 50%;
          color: #0386f5 !important;
          // background: url("../assets/image/manage_5.png") no-repeat!important;
          border-bottom: 1px solid #0386f5;
        }
      }
    }
  }
  .el-date-editor {
    // margin-top: 04rem;
    width: 2.25rem !important;
    height: 0.2rem !important;
    // margin-left: .06rem;
    background: rgba(33, 33, 33, 1) !important;
    border-radius: 6px;
    // border: 1px solid red;
  }
}
</style>
