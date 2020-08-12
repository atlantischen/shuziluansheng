<template>
  <div class="secHeader">
    <ul class="nav_ul">
      <li class="nav_li" v-for="(item, index) in ullist" :key="index">
        <span class="nav_tit">{{ item.name }}</span>
        <ul class="li_tit">
          <!--  v-if="titlist" -->
          <li
            class="li_list"
            v-for="(lilist,key) in item.child"
            :key="key"
            @click.stop="secondnav(lilist.nextrue,lilist.key,key)"
          >
            <span>{{lilist.key}}</span>
            <img src="../../static/img/next.png" v-if="lilist.nextrue" />
            <ul class="nav_second">
              <li
                class="second_li"
                v-for="(second,indexT) in lilist.child"
                :title="second.info"
                :key="indexT"
                @click.stop="navend(lilist.key,second,indexT,key)"
              >{{second.name}}</li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="nav_li" @click="shezhi()">设置</li>
    </ul>
  </div>
</template>
<script>
import $ from "jquery";
// import api from '../../static/api/api.js'
// import { webEdior } from '../../static/js/webEdior.js'
export default {
  name: "secHeader",
  props: ["secHeader", "ullists", "delettreeLID", "headerone"],
  data() {
    return {
      //下拉框显示内容
      httpdata: "",
      ullist: [
        {
          name: "场景",
          child: [
            { key: "新建场景", nextrue: false },
            // {key:'打开场景',nextrue:true,child: []},
            { key: "保存场景", nextrue: false },
            { key: "发布场景", nextrue: false },
            // {key:'删除场景',nextrue:true,child: []}
          ],
        },
        {
          name: "编辑",
          child: [
            { key: "撤销", nextrue: false },
            { key: "重做", nextrue: false },
            { key: "删除", nextrue: false },
            { key: "清空历史记录", nextrue: false },
          ],
        },
        {
          name: "视图",
          child: [
            { key: "左视图", nextrue: false },
            { key: "俯视图", nextrue: false },
            { key: "正视图", nextrue: false },
          ],
        },
        {
          name: "工具栏",
          child: [
            { key: "创建灯光", nextrue: false },
            {
              key: "创建二维图形",
              nextrue: true,
              child: [
                { info: "", name: "柱状图" },
                { info: "", name: "折线图" },
                { info: "", name: "饼状图" },
              ],
            },
            { key: "新建链接", nextrue: false },
            { key: "创建标签", nextrue: false },
          ],
        },

        {
          name: "面板库",
          child: [{ key: "小面板库", nextrue: false }],
        },
        {
          name: "光源",
          child: [
            { key: "环境光", nextrue: false, val: "ambient" },
            { key: "平行光", nextrue: false, val: "directional" },
            { key: "点光源", nextrue: false, val: "point" },
          ],
        },
        {
          name: "选项",
          child: [
            { key: "渲染器", nextrue: false },
            { key: "常规", nextrue: false },
            { key: "滤镜", nextrue: false },
          ],
        },
      ],
      navsecond: [], //导航栏二级菜单具体内容
      dtreeLID: "", //要删除的节点的id
      headerindex: 1, //一级表头的下标
      fnwebEdior: {}, //js注册
      treeid: "", //接收树状图的id值
      nextlistHead: [], //接受下一层的数据
      dragDropList: [], //echarts列表信息
      arrdatas: {}, //传参给后台的值
      opendatanameinfo: "",
      dragKey: -1,
      srckey: 0,
      srckeylist: [],
    };
  },
  watch: {
    headerone() {
      this.headerindex = this.headerone; //下标
    },
    delettreeLID() {
      this.dtreeLID = this.delettreeLID; //树状图点击当前id
      // console.log(this.delettreeLID);
    },
    // ullists(){
    //     this.ullist = this.ullists;
    // },
    dragDropList() {
      // console.log(this.dragDropList);
    },
    navsecond() {
      // console.log(this.navsecond);
    },
    opendatanameinfo() {
      // console.log(this.opendatanameinfo);
    },
  },
  methods: {
    saveloacl(data) {
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        if (!newSceneData.scene3D.sceneData.echarts) {
          newSceneData.scene3D.sceneData.echarts = [];
          console.log("无");
          newSceneData.scene3D.sceneData.echarts.push(data);
        } else {
          let key = -1;
          for (
            var i = 0;
            i < newSceneData.scene3D.sceneData.echarts.length;
            i++
          ) {
            if (
              newSceneData.scene3D.sceneData.echarts[i].miniID == data.miniID
            ) {
              key = i;
            }
          }
          if (key > -1) {
            newSceneData.scene3D.sceneData.echarts.splice(key, 1, data);
          } else {
            console.log("有");
            console.log(newSceneData.scene3D.sceneData.echarts);
            newSceneData.scene3D.sceneData.echarts.push(data);
          }
        }
        let datas_e,
          data_point,
          data_pointList = [];
        // for(var j=0;j<data.miniAttribute.datapoint.length;j++){
        //     data_point = data.miniAttribute.datapoint[j];
        //     delete data_point.name;
        //     data_point.value =0;
        //     data_point.unit = "";
        //     data_pointList.push(data_point);
        // }
        datas_e = {
          type: data.type,
          id: data.miniID,
          datas: [],
        };
        let keyaction = -1;
        for (var i = 0; i < newSceneData.actions.length; i++) {
          if (newSceneData.actions[i].id == datas_e.id) {
            keyaction = i;
          }
        }
        if (keyaction > -1) {
          newSceneData.actions.splice(keyaction, 1, datas_e);
        } else {
          newSceneData.actions.push(datas_e); // data 表示当前二维echart 组合出来的对象
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    async secondnav(judge, item, key) {
      //导航栏二级
      // $("secHeader .li_list .nav_second").css('display','none');
      // $(".nav_second").hide();
      // this.srckey = 0;
      if (item == "创建标签") {
        // this.srckey = this.srckey + 1;
        // this.srckeylist.push(this.srckey);
        // this.$emit('New_src', this.srckeylist);
        this.$emit("New_icon", "222");
      }
      if (item == "新建链接") {
        this.srckey = this.srckey + 1;
        this.srckeylist.push(this.srckey);

        this.$emit("New_src", this.srckeylist);
      }
      if (item == "创建灯光") {
        this.secHeader.addSceneLight("directional");
      }
      if (item == "删除") {
        let that = this;
        this.$confirm("此操作将删除该对象, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let YNdelete = that.secHeader.deleteObjectFromElement(
              that.dtreeLID
            );
            console.log(YNdelete);
            if (YNdelete == false) {
              this.$message({
                type: "success",
                message: "子对象删除失败",
              });
            } else {
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
      }
      if (item == "重做") {
        // console.log(this.dtreeLID);
        this.secHeader.review();
      }
      if (item == "清空历史记录") {
        this.$emit("openpanel", "清空历史记录");
      }
      if (item == "小面板库") {
        this.$emit("openpanel", "小面板库");
      }
      if (item == "环境光") {
        this.secHeader.addSceneLight("ambient");
      } else if (item == "平行光") {
        this.secHeader.addSceneLight("directional");
      } else if (item == "点光源") {
        this.secHeader.addSceneLight("point");
      }
      if (item == "渲染器") {
        this.$emit("openpanel", "渲染器");
      }
      if (item == "常规") {
        this.$emit("openpanel", "常规");
      }
      if (item == "滤镜") {
        this.$emit("openpanel", "滤镜");
      }
      if (item == "左视图") {
        this.secHeader.tweenToLeftPosition();
      }
      if (item == "俯视图") {
        this.secHeader.tweenToTopPosition();
      }
      if (item == "正视图") {
        this.secHeader.tweenToRightPosition();
      }
      if (item == "保存场景") {
        // 保存场景，查看场景列表，保存数据配置文件     接口测试通过
        this.secHeader.saveSceneForReview();
        this.$emit("openpanel", "保存场景");
      }
      if (item == "新建场景") {
        // 新建场景，查看场景列表，保存数据配置文件
        let publics = localStorage.getItem("publics");
        let arrdata = {
          changj: "新建场景",
          data: "",
          opendataNI: "",
        };
        // console.log(publics);
        if (publics == "true") {
          // console.log("新建场景");
          this.secHeader.createScene();
        } else if (publics == null || publics == "" || publics == "false") {
          // console.log(arrdata);
          this.$emit("bounced_shYn", arrdata);
        }
        this.$emit("FB_panel", false);
      }
      if (item == "发布场景") {
        this.$emit("openpanel", "发布场景");
      }
      // if(item == "删除场景"){

      // }
      // $(".nav_li .li_tit").removeClass("show").addClass("hide");
      // $(".nav_li:eq("+this.headerindex+")").removeClass('selectnav').siblings().removeClass("selectnav");
      // $(".nav_li:eq("+this.headerindex+") .li_tit").removeClass("show").addClass('hide');
      // $(".nav_li .li_list .nav_second").css("display","none");
    },
    async navend(lastitem, item, indexT, key) {
      //导航栏二级  // 功能废弃，编辑页面打开场景取消
      // console.log(item,"itemitemitemitemitemitemitemitemitemitemitemitemitemitemitem");
      console.log("1111");
      let opendataNI = item;
      this.opendatanameinfo = item;
      let type = "test/";
      let name = item.name;
      let dataopennew = {}; // http://111.230.241.106:9082
      await this.$http(
        this.httpdata.SceneFileManagementService +
          "/SceneFile-Management-Service/getSceneSettings/" +
          type +
          name,
        dataopennew,
        "get"
      )
        .then((res) => {
          // console.log(res);
          let dataopen;
          dataopen = JSON.parse(res.data);
          localStorage.setItem("sceneData", res.data);
          this.arrdatas = {
            changj: "打开场景",
            data: dataopen,
            opendataNI: item,
          };
          // 同时将数据的配置文件发送到服务器
        })
        .catch((res) => {});
      if (lastitem == "打开场景") {
        console.log(
          opendataNI,
          "opendataNIopendataNIopendataNIopendataNIopendataNIopendataNI"
        );
        this.$emit("bounced_shopen", opendataNI);
        let publics = localStorage.getItem("publics");
        //    console.log(publics)
        if (publics == "true") {
          this.secHeader.loadServerScene(this.arrdatas.data);
          // console.log("dakai")
        } else if (publics == null || publics == "" || publics == "false") {
          this.$emit("bounced_shYn", this.arrdatas);
          console.log("打开22222222222222");
        }
        var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
        var echarts = newSceneData.scene3D.sceneData.echarts;
        var sceneRUL = newSceneData.scene3D.sceneData.sceneRUL;
        console.log(sceneRUL);
        if (sceneRUL) {
          this.$emit("sceneRUL_shYn", sceneRUL);
        }
        // console.log(echarts, 'echartsechartsecharts');
        let dragDropList = {},
          dragKey = 0;
        if (echarts) {
          console.log(echarts);
          for (let i = 0; i < echarts.length; i++) {
            console.log(echarts[i]);
            dragDropList[i] = echarts[i];
            dragKey = i;
          }
        }
        // console.log(dragDropList, 'dragDropListdragDropListdragDropList');
        // return
        let dragDropLists = JSON.parse(JSON.stringify(dragDropList));
        this.$emit("dragDropList_shYn", dragDropLists);
        // return
        localStorage.setItem("dragKey", dragKey);
        // console.log(dragDropList, 'dragDropListdragDropListdragDropList');
      }
      if (lastitem == "删除场景") {
        console.log(this.opendatanameinfo);
        this.$confirm("此操作将删除该场景, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (
              this.opendatanameinfo.name !== "" &&
              this.opendatanameinfo.name !== undefined
            ) {
              let data = {};
              let id = this.opendatanameinfo.id;
              this.$http(
                this.httpdata.SceneFileManagementService +
                  "/SceneFile-Management-Service/deleteScene/test/" +
                  id,
                data,
                "POST"
              )
                .then((res) => {
                  console.log(123);
                  this.secHeader.createScene();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  // console.log(this.navsecond);
                })
                .catch((res) => {});
            } else {
              // console.log(this.navsecond);
              this.secHeader.createScene();
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
      }
      let dragKey = localStorage.getItem("dragKey") || 0;
      dragKey = Number(dragKey);
      if (item.name == "列表") {
        //拖拽生成echarts图形
        dragKey = dragKey + 1;
        // this.dragDropList.push('liebiao');

        this.$emit("setdragDropList", "liebiao", dragKey);
      }
      if (item.name == "树状图") {
        //拖拽生成echarts图形
        dragKey = dragKey + 1;
        // this.dragDropList.push('shu')
        this.$emit("setdragDropList", "shu", dragKey);
      }
      if (item.name == "饼状图") {
        //拖拽生成echarts图形
        let idadd, width, height;
        height = "186";
        width = "348";
        idadd = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        let newidadd;
        newidadd =
          idadd +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          idadd +
          idadd;
        let data = {
          miniID: newidadd,
          type: "pie",
          miniBackground: "",
          layer: 1,
          miniAttribute: {
            show: true,
            cavaseW: "1085",
            cavaseH: "600",
            chartsKind: "饼状图",
            stylePlan: 1, //配色方案
            panelTitle: "输入标题",
            fontSize: 12,
            colorStyle: "默认",
            position: { x: "21", y: "440" },
            size: { x: width, y: height },
            dataStyple: "纯色",
            opacity: 50,
            dataitem: "产量", //数据项
            // datapoint:[//数据点
            //     {mcid: "1_1_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_1_卷烟机产量"},
            //     {mcid: "1_3_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_3_卷烟机产量"},
            //     {mcid: "1_4_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_4_卷烟机产量"},
            // ],
            machineTpye: "卷烟机产量",
          },
        };
        dragKey = dragKey + 1;
        // this.dragDropList.push('饼状图')
        this.$emit("setdragDropList", data, dragKey);
        this.saveloacl(data);
      }
      if (item.name == "折线图") {
        let idadd, width, height;
        height = "186";
        width = "348";
        idadd = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        let newidadd;
        newidadd =
          idadd +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          idadd +
          idadd;
        let data = {
          miniID: newidadd,
          type: "line",
          miniBackground: "",
          layer: 1,
          miniAttribute: {
            show: true,
            cavaseW: "1085",
            cavaseH: "600",
            chartsKind: "折线图",
            stylePlan: "0", //配色方案
            panelTitle: "输入标题",
            fontSize: 12,
            colorStyle: "默认",
            position: { x: "21", y: "230" },
            size: { x: width, y: height },
            dataStyple: "纯色",
            opacity: 50,
            dataitem: "产量", //数据项
            // datapoint:[//数据点
            //     {mcid: "1_1_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_1_卷烟机产量"},
            //     {mcid: "1_3_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_3_卷烟机产量"},
            //     {mcid: "1_4_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_4_卷烟机产量"},
            // ],
            machineTpye: "卷烟机产量",
          },
        };
        dragKey = dragKey + 1;
        // this.dragDropList.push('折线图');
        this.$emit("setdragDropList", data, dragKey);
        this.saveloacl(data);
      }
      if (item.name == "柱状图") {
        let idadd, width, height;
        height = "186";
        width = "348";
        idadd = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        let newidadd;
        newidadd =
          idadd +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          "-" +
          idadd +
          idadd +
          idadd;
        let data = {
          miniID: newidadd,
          type: "bar",
          miniBackground: "",
          layer: 1,
          miniAttribute: {
            show: true,
            cavaseW: "1085",
            cavaseH: "600",
            chartsKind: "柱状图", //图表类型
            stylePlan: "0", //配色方案
            panelTitle: "输入标题", //标题
            fontSize: 12, //文字大小
            colorStyle: "默认", //数据显示风格
            position: { x: "21", y: "20" },
            size: { x: width, y: height },
            dataStyple: "纯色", //数据显示风格
            opacity: 50, //透明度
            dataitem: "产量", //数据项
            // datapoint:[//数据点
            //     {mcid: "1_1_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_1_卷烟机产量"},
            //     {mcid: "1_3_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_3_卷烟机产量"},
            //     {mcid: "1_4_卷烟机",sckey: "设备产量",unit: "",value: 0,vrkey: "1_4_卷烟机产量"},
            // ],
            machineTpye: "卷烟机产量",
          },
        };
        dragKey = dragKey + 1;
        this.dragDropList.push("柱状图");
        this.$emit("setdragDropList", data, dragKey);
        this.saveloacl(data);
      }
      localStorage.setItem("dragKey", dragKey);
      // $(".nav_li:eq("+this.headerindex+")").removeClass('selectnav').siblings().removeClass("selectnav");
      // $(".nav_li:eq("+this.headerindex+") .li_list:eq("+key+") .nav_second").removeClass("show").addClass("hide");
      // $(".nav_ul .li_tit").removeClass("show").addClass("hide");
      // $(".nav_ul .nav_second").css("display","none");
    },
    opendatahttp() {
      let that = this;
      var type = "test";
      let dataopen = {};
      return this.$http(
        this.httpdata.SceneFileManagementService +
          "/SceneFile-Management-Service/getSceneList/" +
          type,
        dataopen,
        "get"
      )
        .then((res) => {
          // console.log(res);
          that.nextlistHead = JSON.parse(res.data);
          let navsecond = [];
          for (var i = 0; i < that.nextlistHead.length; i++) {
            if (that.nextlistHead[i].name.indexOf("client_") == -1) {
              navsecond.push(that.nextlistHead[i]);
            }
          }

          that.ullist[0].child[1].child = navsecond;
          that.ullist[0].child[4].child = navsecond;
          // 同时将数据的配置文件发送到服务器
        })
        .catch((res) => {});
    },
    shezhi() {
      //设置按钮点击
      this.$emit("install", true);
    },
  },

  mounted: function () {
    // $('body').on('click', ()=>{
    //     $(".nav_li .li_tit").removeClass("show").addClass("hide");
    //     $(".nav_li:eq("+this.headerindex+")").removeClass('selectnav').siblings().removeClass("selectnav");
    //     $(".nav_li:eq("+this.headerindex+") .li_tit").removeClass("show").addClass('hide');
    //     $(".nav_li .li_list .nav_second").css("display","none");
    // });
    // console.log(this.delettreeLID);
    let gbdefultdata = {};
    this.$http("./static/api/api.json", gbdefultdata, "get")
      .then((data) => {
        // 请求本地，背景名称
        this.httpdata = data.baseroot;
        // console.log(this.httpdata);
        // this.opendatahttp();
      })
      .catch((res) => {});
    this.dtreeLID = this.delettreeLID;
  },
};
</script>
<style lang="less" scoped>
.secHeader {
  // z-index: 666666666666666666666;
  .nav_ul {
    display: flex;
    height: 28px;
    width: 100%;
    margin-left: 22px;
    cursor: pointer;
  }
  .nav_li {
    position: relative;
    width: 65px;
    height: 28px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color: aliceblue;
  }
  .nav_li:hover {
    color: aliceblue;
    background: #00a4ff;
    box-sizing: border-box;
    .li_tit {
      display: block;
    }
  }
  .nav_li:nth-child(4) .li_tit {
    width: 120px;
    .secHeader {
      .li_list {
        padding-left: 25px;
        text-align: left;
        .nav_second {
          left: 120px;
        }
      }
    }
  }
  .nav_li:nth-child(5) .li_tit {
    width: 110px;
    .secHeader {
      z-index: 66;
      .li_list {
        .nav_second {
          left: 110px;
        }
      }
    }
  }
  .li_tit {
    // display: none;
    position: absolute;
    top: 28px;
    left: 0px;
    width: 110px;
    padding-top: 3px;
    padding-bottom: 3px;
    text-align: left;
    background: #c2c2c2;
    z-index: 666666666666666666666;
    display: none;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    .li_list {
      position: relative;
      height: 30px;
      padding-left: 20px;
      line-height: 30px;
      font-size: 12px;
      color: #333333;
      z-index: 6666666666666666666666;
      img {
        position: absolute;
        top: 9px;
        right: 10px;
      }
      .nav_second {
        position: absolute;
        top: 0px;
        left: 120px;
        width: 110px;
        max-height: 224px;
        text-align: center;
        background: #c2c2c2;
        overflow-y: auto;
        z-index: 6666666666666666666666;
        display: none;
        &::-webkit-scrollbar {
          width: 3px;
          /*滚动条宽度*/
          height: 6px;
          /*滚动条高度*/
          margin: 0;
          padding: 0;
        }
        /*定义滚动条轨道 内阴影+圆角*/
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
          border-radius: 2px;
          /*滚动条的背景区域的圆角*/
          background-color: #777;
          /*滚动条的背景颜色*/
        }
        /*定义滑块 内阴影+圆角*/
        &::-webkit-scrollbar-thumb {
          width: 3px;
          /*滚动条宽度*/
          height: 26px;
          /*滚动条高度*/
          border-radius: 2px;
          /*滚动条的圆角*/
          box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
          background-color: #fff;
          /*滚动条的背景颜色*/
        }
        .second_li {
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          color: #333333;
          overflow: hidden;
        }
        .second_li:hover {
          background: #00a4ff;
          color: #fff;
        }
      }
    }
    .li_list:hover {
      background: #00a4ff;
      color: #fff;
      .nav_second {
        display: block;
      }
    }
  }

  .selectnav {
    color: aliceblue;
    background: #303135;
    border: 1px solid #444549;
    border-radius: 4px;
    box-sizing: border-box;
  }
}
</style>
<style lang="less">
.el-message-box {
  background-color: #303135;
  border: #303135;
  text-align: center;
  .el-message-box__header {
    padding: 15px 15px 0px;
  }
  .el-message-box__content {
    padding: 10px 15px 25px 15px;
    .el-icon-warning {
      display: none;
    }
    .el-message-box__message {
      padding-left: 12px;
    }
  }
  .el-message-box__btns {
    padding: 5px 15px 18px;
    text-align: center;
    .el-button--primary {
      margin-left: 40px;
    }
  }
}
</style>
