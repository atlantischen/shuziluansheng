<template>
  <div class="index" id="logining">
    <img src="../../static/img/big-bg.png" alt id="login" />
    <div class="title_ZE">
      <img src="../../static/img/logo.png" alt id="login" />
    </div>

    <div class="loginbox" v-if="islogin">
      <h1>
        用户登录
        <!-- <span >注册</span> -->
        <!-- <span>
                    <img src="../assets/imageI/index-7.png" alt="关闭">
        </span>-->
      </h1>
      <p class="inputli firstp">
        <input type="text" placeholder="用户名" v-model="user" />
        <span class="error" id="error_U" style="display: none">不能为空&nbsp;!</span>
      </p>
      <p class="inputli">
        <input type="text" placeholder="密码" v-model="password" />
        <span class="error" id="error_P" style="display: none">不能为空&nbsp;!</span>
      </p>
      <div class="operation">
        <p>
          <input type="checkbox" v-model="rememberPW" id="rememberP" @change="rememberP()" />
          <span>记住密码</span>
        </p>
        <p>
          <span @click="forget_PW()">忘记密码</span>
          <span @click="tab('注册')">注册</span>
        </p>
      </div>
      <div class="buttonbox">
        <el-button
          type="primary"
          @click="openFullScreen(user,password)"
          class="login_UP"
        >登&nbsp;&nbsp;录</el-button>
        <!-- <button @click="submitForm(user,password)">登&nbsp;&nbsp;录</button> -->
      </div>
    </div>
    <div class="signUp reg" v-else>
      <h1>
        用户注册
        <!-- <span @click="tab">登录</span> -->
      </h1>

      <p class="inputli">
        <input
          type="text"
          placeholder="邮箱"
          class="email"
          v-model="email"
          @keyup.enter="enterinput('邮箱',email)"
        />
      </p>
      <p class="inputli">
        <select @change="industryFn()" class="selectla" v-model="industry">
          <option value selected disabled style="display:none color:#ccc">所属行业</option>
          <option
            :value="item.industry"
            v-for="(item, key) in industryList"
            :key="key"
          >{{item.industry}}</option>
        </select>
      </p>
      <p class="inputli">
        <input type="text" placeholder="用户名" class="reguser" v-model="username" />
      </p>
      <!-- <p class="inputli">
                <input type="password" placeholder="密码" class="regpassword" v-model="regpassword" />
            </p>
            <p class="inputli">
                <input type="password" placeholder="确认密码" class="verifypassword" v-model="verifypassword" />
      </p>-->
      <p class="inputli">
        <input type="text" placeholder="手机号" class="phone" v-model="phone" />
      </p>
      <p class="inputli">
        <input type="text" placeholder="名称" class="nickName" v-model="nickName" />
      </p>
      <p class="inputli code">
        <input type="text" placeholder="验证码" class="code" v-model="code" />
        <img class="code-img" :src="codeImg" alt @click="refresh()" />
      </p>
      <p class="inputli agreeTerms">
        <input type="checkbox" v-model="agreeY" id="agree" @change="agree()" />
        <span>我已阅读并接受条款</span>
        <span @click="tab('登录')" class="tab-login">已有账号？请登录</span>
      </p>
      <div class="buttonbox">
        <el-button type="primary" @click="registered()" class="login_UP">注&nbsp;&nbsp;册</el-button>
      </div>
    </div>
    <div class="panelsu" v-if="succeed">
      <div class="panel">
        <p class="hesderP">
          <span>{{panel_tit}}</span>
          <span @click="closePanel()"></span>
        </p>
        <div class="p_concent">
          <p class="tishi" v-if="tishi">
            <img src="../assets/imageI/icon-14.png" alt />
            {{panel_c}}
          </p>
          <p class="welcome" v-if="gologin" :class="[imggan ? 'updown':'']">
            <img src="../assets/imageI/icon-11.png" alt v-if="imggan" />
            {{contend}}
          </p>
          <div class="inputli" v-if="inputshow">
            <input
              type="text"
              placeholder="注册邮箱/用户名"
              class="email"
              v-model="regetemail"
              @keyup.enter="enterinput('用户名',reguser)"
            />
            <!-- <div class="verify-wrap" id="verify-wrap" style="margin-top:300px;"></div> -->
            <v-slideVerify class="slideVerifyD" @boolur="boolur"></v-slideVerify>
          </div>
        </div>
        <p class="p_foot">
          <el-button
            type="primary"
            @click="closePanel()"
            class="login_UP"
            v-if="loginshow"
          >立&nbsp;即&nbsp;登&nbsp;录</el-button>
          <el-button type="primary" @click="chongzhi()" class="login_UP" v-else>{{btnval}}</el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import slideVerify from "../components/slideVerify.vue";
// import {server} from '../assets/js/http-server';
// import slideVerifyPlug from '../../static/js/slideVerifyPlug.js'
export default {
  name: "login",
  data() {
    return {
      btnval: "重置",
      imggan: false,
      contend: "你已完成木星数字孪生平台的注册，欢迎登录！",
      loginshow: true,
      inputshow: false, //重置密码的input输入框
      succeed: false, //注册成功弹框
      panel_tit: "提示",
      gologin: true,
      tishi: false,
      panel_c: "注册成功",
      user: "ceshi", //用户
      regetemail: "706845@qq.com", //邮箱
      password: "123456", //密码
      fullscreenLoading: false, //加载动画
      islogin: true,
      username: "",
      email: "",
      phone: "",
      regpassword: "",
      rememberPW: false,
      verifypassword: "",
      agreeY: false,
      industryList: [],
      // industry:"烟草2222",
      selectdeal: false,
      querenhua: false,
      nickName: "",
      code: "",
      industry: "",
      codeImg: "",
      uuid: "",
      factory: "3861d92a28e46ffff9f4083e3dc968b4",
    };
  },
  components: {
    "v-slideVerify": slideVerify, //状态设置组件
  },
  methods: {
    boolur(data) {
      console.log(data);
      this.querenhua = data;
    },
    industryFn() {
      //选择行业
      console.log(this.industry);
    },
    refresh() {
      this.getCode();
    },
    enterinput(val, key) {
      var emyReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/; // 邮箱正则
      var pmyReg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/; // 手机号正则
      if (val == "用户名") {
        $(".firstp .reguser").blur();
        if (key == "") {
          this.$message("用户名不能为空");
          return;
        }
      } else if (val == "邮箱") {
        $(".firstp .email").blur();
        if (key == "" || !emyReg.test(key)) {
          this.$message("邮箱格式不正确!");
          return;
        }
      } else if (val == "手机号") {
        $(".firstp .phone").blur();
        if (key == "" || !pmyReg.test(key)) {
          this.$message("手机号不正确!");
          return;
        }
      } else if (val == "密码") {
        $(".firstp .regpassword").blur(); //
        if (key == "") {
          this.$message("密码不能为空");
          return;
        }
      }
    },
    //登录按钮点击登录
    openFullScreen(username, password) {
      if (username == "") {
        $("#error_U").show();
      } else {
        $("#error_U").hide();
      }
      if (password == "") {
        $("#error_P").show();
      } else {
        $("#error_P").hide();
      }
      if (username !== "" && password !== "") {
        this.$server.login(username, password).then((data) => {
          console.log(data.data);
          // 成功状态
          if (data.code === 200) {
            this.$message({
              message: "登录成功，请稍后~",
              type: "success",
              duration: 2000,
            });
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user.user));
            this.setCookie("token", data.data.token, 3600000); // 将token保存在cookie中
            this.$router.push("/manage");
          } else {
            //失败状态

            this.$message.error("用户名或密码不正确~");
          }
        });
        // let login_3 = true;
        // let host = location.host
        //
        // this.$router.replace({path: '/index', query: {'login_3': login_3, 'type': 'reload'}});
        // location.href = 'http://'+host+'/#/index?login_3=true&type=reload';
        // location.reload();
      }
    },
    setCookie(name, value, seconds) {
      seconds = seconds || 0;
      var expires = "";
      if (seconds != 0) {
        //设置cookie生存时间
        var date = new Date();
        date.setTime(date.getTime() + seconds * 1000);
        expires = "; expires=" + date.toGMTString();
      }
      document.cookie = name + "=" + escape(value) + expires + "; path=/"; //转码并赋值
    },
    // 注册
    registered() {
      const {
        username,
        industry,
        factory,
        email,
        phone,
        nickName,
        code,
        uuid,
      } = this;
      console.log(uuid);

      var emyReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/; // 邮箱正则
      var pmyReg = /^1[3456789]\d{9}$/; // 手机号正则
      if (email == "" || !emyReg.test(email)) {
        this.$message.error("邮箱格式不正确!");
        return;
      }
      if (this.industry == "") {
        this.$message.error("请选择所属行业");
        return;
      }
      if (username == "") {
        this.$message.error("用户名不能为空");
        return;
      }

      // if(regpassword == '') {
      //     this.$message.error('密码不能为空');
      //     return
      // }
      //   if(verPW==""||verPW!==password){
      //     this.$message.error('两次密码不一致');
      //     return
      // }
      if (phone == "" || !pmyReg.test(phone)) {
        this.$message.error("请输入正确手机号");
        return;
      }

      if (nickName == "") {
        this.$message.error("名称不能为空");
        return;
      }
      if (code == "") {
        this.$message.error("请输入验证码");
        return;
      }
      if (this.selectdeal == false) {
        this.$message.error("请阅读并接受条款");
        return;
      }
      // if(username !== '' && email !== '' && emyReg.test(email) &&  password !== ''&&verPW!==""&& this.selectdeal == true&&verPW==password){
      this.succeed = true;
      this.panel_tit = "提示";
      this.tishi = true;
      this.loginshow = true;
      this.gologin = true;
      this.imggan = false;
      this.inputshow = false;
      this.panel_c = "注册成功";
      this.contend = "你已完成木星数字孪生平台的注册，欢迎登录！";
      // }
      this.$server
        .register(
          username,
          industry,
          factory,
          email,
          phone,
          nickName,
          code,
          uuid
        )
        .then((res) => {
          console.log(res);
        });
    },
    tab(val) {
      this.islogin = !this.islogin;
      if (val == "注册") {
        // this.reguser =  '558585';
        // this.email =  '555@qq.com';
        // this.phone = '12345678910';
        // this.regpassword = '5855'
      }
    },
    rememberP() {
      //记住密码
      var checked = $("#rememberP").prop("checked");
      if (checked == true) {
        console.log("记住");
      }
      if (checked == false) {
        console.log("不记住");
      }
    },
    agree() {
      //同意条款
      var checked = $("#agree").prop("checked");
      if (checked == true) {
        console.log("同意");
        this.selectdeal = true;
      }
      if (checked == false) {
        console.log("不同意");
        this.selectdeal = false;
      }
    },
    closePanel() {
      //注册成功弹框关闭
      this.succeed = false;
      this.islogin = !this.islogin;
    },
    forget_PW() {
      //忘记密码
      this.succeed = true;
      this.panel_tit = "找回密码";
      this.gologin = false;
      this.tishi = false;
      this.loginshow = false;
      this.inputshow = true;
    },
    chongzhi() {
      //重置密码
      if (this.btnval == "重置" && this.querenhua == true) {
        this.succeed = true;
        this.panel_tit = "找回密码";
        this.gologin = true;
        this.tishi = false;
        this.loginshow = false;
        this.imggan = true;
        this.inputshow = false;
        this.btnval = "确定";
        this.contend =
          "重置密码的链接已被发送到你的邮箱，请 点击查收邮件 以重置密码。";
      } else if (this.btnval == "确定") {
        this.succeed = false;
        this.btnval = "重置";
      } else if (this.btnval == "重置" && this.querenhua == false) {
        this.$message("请滑动验证");
      }
    },
    huadong() {
      var SlideVerifyPlug = window.slideVerifyPlug;
      var slideVerify = new SlideVerifyPlug("#verify-wrap", {
        wrapWidth: "350", //设置 容器的宽度 ,不设置的话，会设置成100%，需要自己在外层包层div,设置宽度，这是为了适应方便点；
        initText: "请向右滑动滑块", //设置  初始的 显示文字
        sucessText: "验证通过", //设置 验证通过 显示的文字
        getSuccessState: function (res) {
          //当验证完成的时候 会 返回 res 值 true，只留了这个应该够用了
          console.log(res);
          // if (slideVerify.slideFinishState) {
          //     $('.value').html(slideVerify.slideFinishState)
          //     $('#resetBtn').removeClass('prohibit')
          // }
          slideVerify.resetVerify(); //可以重置 插件 回到初始状态
        },
      });
    },
    // 获取所属行业
    getIndustry() {
      this.$server.getIndustry().then((res) => {
        this.industryList = res.data.data;
      });
    },
    // 获取图片验证码
    getCode() {
      this.$server.getCode().then((res) => {
        console.log(res);
        this.uuid = res.data.uuid;
        this.codeImg = res.data.img;
      });
    },
  },
  mounted: function () {
    //    this.huadong();
    this.getIndustry();
    this.getCode();
  },
};
</script>
<style lang="less" scoped>
#logining {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  z-index: 200;
  .title_ZE {
    position: absolute;
    top: 150px;
    left: 1211px;
    width: 392px;
    height: 70px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  #login {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    // background: #15256B;
    background-size: cover;
    background-position: center;
    overflow: hidden;
  }
  .loginbox,
  .signUp {
    position: absolute;
    top: 250px;
    left: 1171px;
    margin: 0;
    padding: 0;
    border-radius: 8px;
    h1 {
      height: 98px;

      line-height: 98px;
      font-size: 24px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      position: relative;
      // span {
      //     position: absolute;
      //     right: 38px;
      //     font-size: 20px;
      // }
    }
    .inputli {
      position: relative;
      top: 0;
      padding: 0;
      margin-top: 26px;
      margin-left: 50px;
      margin-right: 50px;
      border-radius: 5px;
      background: none;
      select,
      input[type="text"],
      input[type="password"] {
        width: 350px;
        height: 43px;
        line-height: 43px;
        // margin-left: 15px;
        padding-left: 20px;
        border: none;
        font-size: 18px;
        color: #fff;
        border-radius: 4px;
        background: #474747;
      }
      .error {
        position: absolute;
        top: 40px;
        left: 282px;
        display: block;
        width: 166px;
        height: 32px;
        font-size: 14px;
        font-weight: 550;
        line-height: 32px;
        color: #e42b5a;
      }
    }
    .code {
      input[type="text"] {
        width: 200px;
      }
      .code-img {
        height: 36px;
        width: 110px;
        margin-left: 25px;
        outline: none;
        border: none;
        // border-radius: 6px;
      }
    }
    .firstp {
      margin-top: 0px;
    }
    .operation {
      width: 100%;
      height: 60px;
      line-height: 60px;
      p {
        position: relative;
        display: inline-block;
        width: 25%;
        margin-left: 11%;
        color: rgba(255, 255, 255, 1);
        input {
          vertical-align: -3px;
        }
        span {
          margin-left: 1px;
        }
      }
      p:nth-child(2) {
        margin-left: 30%;
        width: 23%;
        height: 45px;
        line-height: 45px;
        color: #186096;
        span:nth-child(1) {
          display: inline-block;
          width: 65px;
          height: 15px;
          line-height: 15px;
          text-align: center;
          border-right: 1px solid #186096;
        }
        span:nth-child(2) {
          margin-left: 5px;
        }
      }
    }
    .buttonbox {
      width: 357px;
      margin: 0 auto;
      // margin-top: 10px;
      .login_UP {
        width: 355px;
        height: 43px;
        background: url("../assets/imageI/icon-3.png");
        background-size: cover;
        background-position: center;
        border: none;
        font-size: 24px;
        color: #ffffff;
      }
    }
    .agreeTerms {
      margin-top: 10px;
      margin-bottom: 10px;
      .tab-login {
        float: right;
        color: #186096;
      }
    }
  }
  .block {
    position: absolute;
    top: 200px;
    left: 110px;
    width: 430px;
    height: 524px;
    overflow: hidden;
    .el-carousel {
      width: 430px;
      height: 524px;
    }
  }
  .loginbox {
    width: 451px;
    height: 383px;
    background: url("../assets/imageI/index-2.png");
    background-size: cover;
  }
  .signUp {
    width: 451px;
    height: 660px;
    background: url("../assets/imageI/index-2-1.png") no-repeat;
    background-size: 100% 100%;
    .inputli {
      margin-top: 26px;
    }
  }
  .panelsu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    .panel {
      position: absolute;
      top: calc(50% - 155px);
      left: calc(50% - 415px);
      width: 831px;
      height: 309px;
      background: url("../assets/imageI/index-9.png");
      background-size: 100% 100%;
      background-position: 100% 100%;
      .p_concent,
      .hesderP {
        width: 100%;
        height: 68px;
        line-height: 68px;
        font-size: 24px;
        border-bottom: 1px solid rgba(176, 176, 176, 0.1);
        color: aliceblue;
        span:nth-child(1) {
          display: inline-block;
          margin-left: 38px;
          width: 88%;
        }
        span:nth-child(2) {
          display: inline-block;
          width: 18px;
          height: 18px;
          // margin-left: 676px;
          background: url("../assets/imageI/index-7.png") no-repeat;
          background-size: cover;
          background-position: center;
        }
      }
      .p_concent {
        height: 129px;
        text-align: center;
        .tishi {
          font-size: 34px;
        }
        .welcome {
          font-size: 18px;
        }
        img {
          vertical-align: -3px;
          margin-right: 3px;
        }
        .inputli {
          position: relative;
          text-align: center;
          // border: 1px solid red;
          box-sizing: border-box;
          select,
          input[type="text"] {
            width: 350px;
            height: 43px;
            line-height: 43px;
            padding-left: 20px;
            border: none;
            font-size: 18px;
            color: #fff;
            border-radius: 4px;
            background: #474747;
          }
          .slideVerifyD {
            position: absolute;
            left: 250px;
            top: 75px;
            border-radius: 5px;
          }
        }
      }
      .p_foot {
        width: 100%;
        height: 110px;
        line-height: 110px;
        text-align: center;
        .el-button {
          width: 336px;
          height: 42px;
          font-size: 16px;
        }
      }
      .updown {
        padding-top: 20px;
        img {
          vertical-align: -8px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
<style>
.block .el-carousel__container {
  width: 430px;
  height: 524px !important;
}
</style>
