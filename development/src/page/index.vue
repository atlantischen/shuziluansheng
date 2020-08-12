<template>
  <div class="index" id="index">
    <!-- 头部 -->
    <v-login :realload="realloads" v-if="login_loading"></v-login>
    <header>
      <!-- logo位置 -->
      <p class="logo">
        <img src="../assets/image/logo.png" alt="云端场景开发平台" />
      </p>
      <span class="comenack" @click="comeback()"></span>
    </header>
    <!-- 主体部分 -->
    <div class="content flex">
      <!-- 3D模型位置 -->
      <div class="TD_tit">
        <!-- 上下拖拽     Drag-drop-->
        <div class="TD_top">
          <div class="CP_scenario">
            <p class="CP_scenario_tit">
              <img src="../assets/image/icon-wp.png" alt />
              <span>物体列表</span>
            </p>
            <ul class="CPr_left_ul">
              <li class="CPr_left_li CPr_left_select" @click="CP_scenario('场景编辑器')">场景编辑器</li>
              <li
                class="CPr_left_li CPr_left_liEC"
                @click="CP_scenario('图表库')"
                v-show="CP_Echarts"
              >图表库</li>
              <li
                class="CPr_left_li CPr_left_href"
                @click="CP_scenario('链接管理')"
                v-show="CPr_href"
              >链接管理</li>
              <li
                class="CPr_left_li CPr_left_icon"
                @click="CP_scenario('标签管理')"
                v-show="CPr_icon"
              >标签管理</li>
              <li class="foldingHide" @click="polesplay('场景编辑器')">
                <img src="../assets/image/index-zhedie.png" />
              </li>
            </ul>
            <!-- 树状图 -->
            <div class="CPr_content" @dblclick="celldbclick" v-show="CP_scenario_select">
              <el-tree
                v-if="istreedata"
                :default-checked-keys="defaultcheckedkeys"
                current-node-key="10001-Light"
                node-key="id"
                ref="tree1"
                :id="treeid"
                :data="treedata"
                @node-click="handleNodeClick"
                highlight-current
                :expand-on-click-node="true"
                :default-expand-all="false"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                draggable
                :default-expanded-keys="['Camera']"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i :class="data.className"></i>
                  <span class="span_tit" :title="node.label">{{ node.label }}</span>
                  <span v-if="node.level == '1' || node.data.isCanDelete == true">
                    <i
                      class="del-icon element-icon icon-cameraicon-test"
                      @click="remove(node, data)"
                    ></i>
                    <!-- <el-button
                                    type="text"
                                    size="mini"
                                    @click="() => remove(node, data)">
                                    Delete
                    </el-button>-->
                  </span>
                </span>
                <!--  default-expand-all -->
              </el-tree>
              <el-tree
                v-show="!istreedata"
                :default-checked-keys="defaultcheckedkeys"
                current-node-key="10001-Light"
                node-key="id"
                :data="treedata"
                @node-click="handleNodeClick"
                highlight-current
                :default-expand-all="false"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                draggable
                :default-expanded-keys="['Camera']"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <i :class="data.className"></i>
                  <span class="span_tit" :title="node.label">{{ node.label }}</span>
                  <span v-if="node.level == '1' || node.data.isCanDelete == true">
                    <i class="del-icon" :class="data.className" @click="remove(node, data)"></i>
                    <!-- <el-button
                                    type="text"
                                    size="mini"
                                    @click="() => remove(node, data)">
                                    Delete
                    </el-button>-->
                  </span>
                </span>
              </el-tree>
            </div>
            <!-- echart图表库列表 -->
            <div class="CPr_content CPr_Econtent" v-show="CP_Echarts_select">
              <ul class="CPr_Econtent_echarts">
                <li
                  v-for="(itemEc , key) in echartsLibrary"
                  :key="key"
                  :data-id="itemEc.key"
                  @click="selectLibrary(itemEc.peizhidata,itemEc.key)"
                >
                  <p class="CPr_Econtent_left">
                    <span>
                      <img src="../assets/image/icon_bar.png" alt="柱状图" v-if="itemEc.type == '柱状图'" />
                      <img
                        src="../assets/image/icon_lines.png"
                        alt="折线图"
                        v-else-if="itemEc.type == '折线图'"
                      />
                      <img
                        src="../assets/image/icon_pier.png"
                        alt="饼状图"
                        v-else-if="itemEc.type == '饼状图'"
                      />
                    </span>
                    <input
                      type="text"
                      :value="itemEc.name"
                      @click="btnnameblur(key,'echart')"
                      @keyup.enter="echarts_name($event,itemEc.key,key,itemEc.peizhidata)"
                      @blur="echarts_name($event,itemEc.key,key,itemEc.peizhidata)"
                    />
                  </p>
                  <p class="CPr_Econtent_right">
                    <span>
                      <span
                        class="icon_show_fff"
                        v-if="itemEc.show"
                        @click.stop="echarts_sh('show',itemEc.key, key)"
                      ></span>
                      <span
                        class="icon_hide_fff"
                        v-else
                        @click.stop="echarts_sh('hide',itemEc.key, key)"
                      ></span>
                    </span>
                    <span>
                      <span class="icon_delete_fff" @click.stop="echars_delete(itemEc.key,key)"></span>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
            <!-- 链接管理列表 -->
            <div v-show="CP_Echarts_btn" class="CPr_content CPr_Econtent_btn">
              <ul>
                <li
                  v-for="(itembtn , key) in btnLibrary"
                  :key="key"
                  @click="selectbtn(itembtn.peizhidata,itembtn.key)"
                >
                  <p class="CPr_Econtent_left">
                    <span>
                      <img src="../assets/image/index-lj.png" alt />
                    </span>
                    <input
                      type="text"
                      :value="itembtn.name"
                      @click="btnnameblur(key,'btn')"
                      @keyup.enter="btn_name($event,itembtn.key,key,itembtn.peizhidata)"
                      @blur="btn_name($event,itembtn.key,key,itembtn.peizhidata)"
                    />
                  </p>
                  <p class="CPr_Econtent_right">
                    <span>
                      <span
                        class="icon_show_fff"
                        v-if="itembtn.show"
                        @click.stop="btn_sh('show',itembtn.key, key)"
                      ></span>
                      <span
                        class="icon_hide_fff"
                        v-else
                        @click.stop="btn_sh('hide',itembtn.key, key)"
                      ></span>
                    </span>
                    <span>
                      <span class="icon_delete_fff" @click.stop="btn_delete(itembtn.key)"></span>
                    </span>
                  </p>
                </li>
              </ul>
            </div>
            <!-- 标签管理列表 -->
            <div v-show="CP_icon" class="CPr_content CPr_biaoqian">
              <ul>
                <li @click="selectIcon(item,index)" v-for="(item,index) in tabList" :key="item.id">
                  <span>
                    <img src="../assets/image/biqoqian.png" alt />
                  </span>
                  <input
                    type="text"
                    v-model="item.name"
                    @change="changeName('name',item.id,item.name)"
                  />
                  <div class="list_right">
                    <span class="show"></span>
                    <span class="delete" @click="handleDeletes(item.id)"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="TD_con">
            <div class="vrd_shadow"></div>
            <ul class="nav_ul">
              <v-secHeader
                ref="secHeader"
                :secHeader="fnwebEdior"
                :ullists="ullist"
                :delettreeLID="delettreeLID"
                @openpanel="openpanel"
                @setdragDropList="setdragDropList"
                @bounced_shYn="bounced_shYn"
                @install="install"
                @sceneRUL_shYn="sceneRUL_shYn"
                @FB_panel="FB_panel"
                @dragDropList_shYn="dragDropList_shYn"
                @bounced_shopen="bounced_shopen"
                @New_src="New_src"
                @New_icon="New_icon"
                :headerone="headerone"
              ></v-secHeader>
            </ul>
            <!-- 工具栏 -->
            <div class="toolbar">
              <ul class="toolbarimg">
                <li
                  v-for="(item, key) in toolbarlist"
                  :key="key"
                  @click="selects(item.name,key)"
                  @mouseover="smallon(item.name,key)"
                  @mouseleave="small(item.name,key)"
                >
                  <!-- :src="['../assets/image/'+ item.key +'.png']"  ../assets/image/  ./static/img/-->
                  <img :src="item.src" v-if="item.hoversmall_sh" />
                  <img :src="item.hoverSrc" v-else />
                  <div class="mytitle">{{ item.name }}</div>
                </li>
              </ul>
              <!-- <p class="install" @click="install()"><img src="../assets/image/install.png" alt="设置"></p> -->
            </div>
            <!-- vr模型title -->
            <div class="vr_3d">
              <!-- vr :id="vr_idname" -->
              <div class="vr_div plane">
                <div id="viewport" @drop="drop" @dragover.prevent></div>
                <!-- echart编辑 -->
                <div
                  class="show chartG_box"
                  v-for="(item, key) in dragDropList"
                  :key="key"
                  @click="echarts(echartsDatalist[key], key)"
                  :data-id="'echart'+key"
                  :class="['box'+key]"
                  :style="'top: '+ item.miniAttribute.position.y +'px;left:'+ item.miniAttribute.position.x+'px;width:'+item.miniAttribute.size.x+'px;height:'+item.miniAttribute.size.y+'px'"
                >
                  <div id="coor" class="coor" :data-index="key"></div>
                  <!-- <div class="deleteimg" @click.stop="deletechart(key)"></div> -->
                  <v-piering
                    class="ipad-title"
                    :ref="'echart'+key"
                    :echartsListData="echartsDatalist[key]"
                    :ekey="key"
                    :eid="'echart'+key"
                    :echartdata="item"
                    @callIndex="peizhiEDB"
                    v-if="item == '饼状图' || item.type == 'pie'"
                  ></v-piering>
                  <v-lines
                    class="ipad-title"
                    :ref="'echart'+key"
                    :echartsListData="echartsDatalist[key]"
                    :ekey="key"
                    :eid="'echart'+key"
                    :echartdata="item"
                    @callIndex="peizhiEDB"
                    v-else-if="item == '折线图' || item.type == 'line'"
                  ></v-lines>
                  <v-bar
                    class="ipad-title"
                    :ref="'echart'+key"
                    :echartsListData="echartsDatalist[key]"
                    :ekey="key"
                    :eid="'echart'+key"
                    :echartdata="item"
                    @callIndex="peizhiEDB"
                    v-else-if="item == '柱状图' || item.type == 'bar'"
                  ></v-bar>
                  <div
                    class="img"
                    v-else-if="item == 'liebiao'||item == 'shu'"
                    :style="{backgroundImage: 'url(./static/img/' + item + '.png)',backgroundRepeat:'no-repeat', backgroundSize:'100% 100%',backgroundPosition:'center'}"
                  ></div>
                </div>
                <!-- 链接列表编辑 -->
                <div class="newsrc_btn">
                  <div class="switch" data-switch="0" v-if="New_srcbtnlist.length > 0">
                    <img class="image1" src="@/assets/image/right_btn.png" />
                    <img class="image2" style="display: none" src="@/assets/image/down_btn.png" />
                  </div>
                  <div class="newsrc_btn-box">
                    <div class>
                      <span v-for="(item, key) in New_srcbtnlist" :key="key">
                        <button @click="srckey(item,key)" :item="item">{{item.title}}</button>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- 模型详细信息 -->
                <v-mapping v-if="map_sh" :idname="idname"></v-mapping>
              </div>
            </div>
          </div>
        </div>
        <div class="TD_bottom">
          <!-- 资源 -->
          <div class="VR_resources">
            <div class="slider"></div>
            <div class="VR_reTitle">
              <span class="spanP">
                <img src="../assets/image/index-zy.png" alt />资源管理器
              </span>
              <span class="addever" @click="addever()">
                <img src="../assets/image/icon-42x_1.png" alt />
              </span>
              <input type="text" v-model="VR_research" placeholder="查询模型" @keydown="search_ZY" />
              <span class="imgsearch" @click="search_ZY"></span>
            </div>
            <div class="VR_reConte">
              <div class="addlist"></div>
              <ul>
                <li
                  v-for="(item, key) in resourceslist"
                  :key="key"
                  @dragstart="dragstart"
                  @load="imgLad(key)"
                >
                  <!-- <img :src="[resourcesimgSrc+item.iconPath ]"/>     resourcesimgSrc+ -->
                  <div class="img">
                    <img :id="item.uuid" :src="item.iconPath" :title="item.name" />
                  </div>
                  <!-- <div class="img" :id="item.name+key" :style="{backgroundImage: 'url(./static/img/' + item.key + '.png)', backgroundSize:'cover',backgroundPosition:'center'}"></div> -->
                  <span>{{item.name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--场景编辑器    属性检查器,新增样式， -->
      <div class="CProperties">
        <!-- 控制宽度滑块 -->
        <div class="cp-coor"></div>
        <div class="CPr_left">
          <ul class="CPr_left_ul">
            <li class="CPr_left_li CPr_left_select" @click="CPr_switch('属性检查器')">属性检查器</li>
            <li class="CPr_left_li" @click="CPr_switch('图表设置')" v-show="CP_Echarts">图表设置</li>
            <li class="CPr_left_li CPr_left_href" @click="CPr_switch('链接设置')" v-show="CPr_href">链接设置</li>
            <li class="CPr_left_li" @click="CPr_switch('基础设置')" v-show="CPr_basis">基础设置</li>

            <li class="CPr_left_li" @click="CPr_switch('历史记录')">历史记录</li>
            <li class="CPr_left_li" @click="CPr_switch('标签设置')" v-show="CPr_tag">标签设置</li>
            <li class="iconplay" @click="polesplay('属性检查器')">
              <img src="../assets/image/icon-5.png" />
            </li>
            <!-- <li class="EX_effect" @click.stop="EX_effect('属性')">
                            <img src="../assets/image/shrinkagechang.png" v-if="effect_SX"/>
                            <img src="../assets/image/spreadshu.png" v-else/>
            </li>-->
          </ul>
          <div class="CPr_content">
            <div class="CPr_contDiv" v-show="CPr_contDiv">
              <ul class="CPr_contDiv_ul">
                <v-basis
                  ref="kejian"
                  :markbasis="markbasis"
                  :basis="fnwebEdior"
                  :clickid="aiid"
                  :treeclicknode="treeclicknode"
                  :labelname="labelname"
                  :delettreeLIDs="delettreeLID"
                  :see_YN="see_YN"
                  v-show="basiscomp"
                ></v-basis>
                <v-skyBox :skyBox="fnwebEdior" v-show="skyBox_sh"></v-skyBox>
                <v-material
                  :materialList="materialList"
                  :material="fnwebEdior"
                  :delettreeLID="delettreeLID"
                  v-show="material_sh"
                ></v-material>
                <v-light :light="fnwebEdior" :lightdata="lightdata" v-show="lingtcomp"></v-light>
                <v-camera :camera="fnwebEdior" v-show="cameracomp"></v-camera>
                <v-incident
                  :incident="fnwebEdior"
                  :treeclickdata="treeclickdata"
                  :machineType="clickType"
                  :clickIndex="clickIndex"
                  :treeclickD="treeclickD"
                  :machineTypeIn="clickTypeXH"
                  :isShowModelDetail="isShowModelDetail"
                  :isShowMaxiPanel="isShowMaxiPanel"
                  :datapanel="incidentpanel"
                  @clickselect="clickselect"
                  v-if="incidentcomp"
                ></v-incident>
              </ul>
            </div>
            <div class="CPr_newStyle" v-show="CPr_newStyle">
              <v-chartsEditor
                v-if="chartsEditor_sh"
                :echartsData="echartsData"
                :echartsKey="echartsKey"
                @titleCharts="titleCharts"
                @stylecharts="stylecharts"
                @colorKind="colorKind"
                @Xaxis="Xaxis"
                @Yaxis="Yaxis"
                @Wkuan="Wkuan"
                @Hgao="Hgao"
                @deleEch_fn="deleEch_fn"
                @saveEch_fn="saveEch_fn"
                @intensity="intensity"
                @coloropacity="coloropacity"
              ></v-chartsEditor>
              <v-srcedit
                :src_key="src_key"
                :src_data="src_data"
                @dele_srcone="dele_srcone"
                @save_srcone="save_srcone"
                v-if="srcedit_sh"
              ></v-srcedit>
            </div>
            <div class="CPr_basis" v-show="CPr_basis">
              <v-bgBox :bgBox="fnwebEdior"></v-bgBox>
              <!-- 基础设置集合组件 -->
              <v-installBasis
                :installBasis="fnwebEdior"
                :showSetData="showSetData"
                v-if="statu_show"
                @install_url="install_url"
              ></v-installBasis>
              <!-- 状态设置组件 -->
              <v-StatuSetting :showSetData="showSetData" v-if="statu_show"></v-StatuSetting>
            </div>
            <div class="Hisdata" v-show="CPr_Hostriy">
              <div class="ptit">历史记录</div>
              <ul>
                <!--  :class="[ contextmenuKey >=0 && contextmenuKey < key ? 'gary' : 'Hisselect']" -->
                <li
                  v-for="(item, key) in hisDatalist"
                  :key="key"
                  @contextmenu="contextmenu(key, $event)"
                >
                  <input
                    type="checkbox"
                    :checked="contextmenuKey >=0 && contextmenuKey >= key"
                    name
                    :id="key"
                    @click="hisDatalistFn(item,key)"
                  />
                  <label></label>
                  <img src="../assets/image/index-jl.png" alt />
                  <span>{{item.name}}</span>
                  <div v-if="key === rightclick&&key === rightclick" class="rightshow">
                    <p @click="delHost('删除',0,key)">删除</p>
                    <p @click="delHost('清除历史记录',1)">清除历史记录</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="CPr_selectIcon" v-show="CPr_selectIcon_show">
              <div class="tag_name">
                <span>标签名称:</span>
                <input type="text" v-model="tagName" @change="changeTag('name',tagId,tagName)" />
              </div>
              <div class="tag_coordinate">
                <div class="coordinate">
                  <label for="x" class="coordinate_x">
                    X轴:
                    <input
                      type="text"
                      id="x"
                      v-model="coordinateX"
                      @blur="changePositionX('positionX',tagId,coordinateX)"
                    />
                  </label>
                  <label for="y" class="coordinate_y">
                    Y轴:
                    <input
                      type="text"
                      id="y"
                      v-model="coordinateY"
                      @blur="changePositionY('positionY',tagId,coordinateY)"
                    />
                  </label>
                  <label for="z" class="coordinate_Z">
                    Z轴:
                    <input
                      type="text"
                      id="z"
                      v-model="coordinateZ"
                      @blur="changePositionZ('positionZ',tagId,coordinateZ)"
                    />
                  </label>
                </div>
              </div>
              <div class="tag_select">
                <span>标签类型:</span>
                <select name id @change="selectFn($event)">
                  <option v-for="item in tagType" :key="item.uuid" :value="item.uuid">{{item.name}}</option>
                </select>
              </div>
              <div class="tag_style">
                <span>标签样式:</span>
                <div v-for="(item,index) in imgList" :key="item.uuid">
                  <img class="tag_img" :class="selectImg===index?'active':''" :src="item.tagLocation" alt @click="clickImg(index)" />
                </div>
              </div>
            </div>
          </div>
          <div id="maskLayer" v-if="maskLayerTF">运行中...</div>
        </div>
      </div>
    </div>
    <!-- 右键显示隐藏删除弹框 -->
    <div class="Rightclick" v-if="Rightclick_sh">
      <ul>
        <li @click="hiddenModul()">隐藏</li>
        <li @click="deleModul()">删除</li>
      </ul>
    </div>
    <!-- 弹框 删除模型-->
    <v-deleteM
      :deleteM="fnwebEdior"
      :treeclickD="treeclickD"
      :index="Zindex"
      :delet_kind="delet_kind"
      @closepanel="closepanel"
      v-if="deleteM_sh"
    ></v-deleteM>
    <!-- 创建面板工具 -->
    <v-definePanel
      :index="Zindex"
      :definePanel="fnwebEdior"
      :incidentcomps="incidentcomp"
      @closepanel="closepanel"
      @save_refresh="save_refresh"
      @No_change="No_change"
      v-if="definePanel_sh"
    ></v-definePanel>
    <!-- 发布场景说明面板 -->
    <v-saveScenario
      :index="Zindex"
      :openNI="openNI"
      :manageitemdata="manageitemdata"
      :type_url="type_url"
      :comebacked="comebacked"
      @closepanel="closepanel"
      v-if="saveScen_sh"
    ></v-saveScenario>
    <!-- 保存场景确认面板 -->
    <v-bouncedYN
      :index="Zindex"
      @closepanel="closepanel"
      @bounced_shYnend="bounced_shYnend"
      v-if="saveScence"
    ></v-bouncedYN>
    <!-- 清除历史记录面板 -->
    <v-clearHost
      :index="Zindex"
      :clearHost="fnwebEdior"
      @closepanel="closepanel"
      v-if="clearHost_sh"
    ></v-clearHost>
    <!-- 选项  渲染器弹框 -->
    <v-renderer :index="Zindex" :renderer="fnwebEdior" @closepanel="closepanel" v-if="renderer_sh"></v-renderer>
    <!-- 选项  常规弹框-->
    <v-convention
      :index="Zindex"
      :convention="fnwebEdior"
      @closepanel="closepanel"
      v-if="convention_sh"
    ></v-convention>
    <!-- 选项  滤镜弹框 -->
    <v-filterC :index="Zindex" :filterC="fnwebEdior" @closepanel="closepanel" v-if="filterC_sh"></v-filterC>
    <div :class="{ 'And-not':!goondata}">
      <p>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <!-- loading.. -->
      </p>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import echarts from "echarts";
import pie_ring from "@/echarts/pie_ring";
import lines from "@/echarts/lines";
import bar from "@/echarts/bar";
import chartsEditor from "@/echarts/chartsEditor";
import basis from "../components/basis.vue";
import light from "../components/light.vue";
import camera from "../components/camera.vue";
import skyBox from "../components/skyBox.vue";
import material from "../components/material.vue";
import incident from "../components/incident.vue";
import srcedit from "../components/srcedit.vue";
import loading from "@/components/loading.vue"; //加载
import installBasis from "../components/installBasis.vue"; //基础设置集合
import StatuSetting from "../components/StatuSetting.vue"; //状态设置组件
import bgBox from "../components/bgBox.vue"; //背景盒
import secHeader from "../components/secHeader.vue";
import mapping from "../components/mapping.vue";
import echartsDrag from "../../static/js/echartsDrag";
import { setTimeout } from "timers";
// import { webEdior } from '../../static/js/webEdior'
import { webEdior } from "../../static/js/webEdior";
import HashTable from "../../static/js/HashTable.js";
import { Message } from "element-ui";
// 弹框
import deleteM from "../panel/deleteM.vue"; //删除模型
import definePanel from "../panel/definePanel.vue";
import saveScenario from "../panel/saveScenario.vue";
import bouncedYN from "../panel/bounced_YN.vue";
import clearHost from "../panel/clearHost.vue";
import renderer from "../panel/renderer.vue";
import convention from "../panel/convention.vue";
import filterC from "../panel/filterC.vue";
// import api from '../../static/api/api.js'
import { server } from "../assets/js/http-server";
export default {
  name: "index",
  data() {
    return {
      iconIpt: "创建标签",
      CPr_tag: false, //标签设置显示
      tagType: "",
      tagTypeUUid: "",
      tagIcon: "",
      tagName: "", //标签名称
      tagNames:'',
      tagId: "", //标签ID
      imgList: "", //标签样式列表
      selectImg:0,
      coordinateX: "",
      coordinateY: "",
      coordinateZ: "", //坐标位置
      tabList: [],
      rightclick: "-1",
      goondata: true, //拖拽模型加载时的阴影
      contextmenuKey: -1,
      CPr_Hostriy: false, // 历史按钮 cp_left 显示
      CPr_selectIcon_show: false, //标签管理编辑显示
      convention_sh: false, //选项  常规弹框
      renderer_sh: false, // 选项  渲染器弹框
      filterC_sh: false, // 选项  滤镜弹框
      clearHost_sh: false, //清空历史记录面板
      delet_kind: "", //删除弹框类型（删除模型，删除场景）
      Rightclick_sh: false, //右键弹框的显示隐藏
      CPr_href: false, //链接管理文字tab选项的显示
      CP_Echarts: false, //图表管理文字tab选项的显示
      CPr_icon: false, //创建标签文字tab选项的显示
      deleteM_sh: false, //删除模型弹框显示隐藏
      treeclicknode: "", //树状图点击node数据
      comebacked: false,
      manageitemdata: "", //项目管理跳转拿到的想要item数据
      httpdata: "", //http集合
      CPr_basis: false, //基础设置显示隐藏
      type_url: "2", //基础设置 发布场景时，后面的type类型值
      isShowMaxiPanel: true, //树状图点击，控制 事件组件，大面板是否选中
      isShowModelDetail: true, //树状图点击 控制 事件组件，单机台是否选中
      clickIndex: "", //点击树状图，当前对象的下标值
      see_YN: true, //点击树状图，显示基础属性组件里的是否可见
      clickTypeXH: "", //点击的具体机器型号
      CP_Echarts_btn: true, //图表库，新建按钮的显示
      CP_icon: false,
      realloads: "", //加载动画的值
      login_loading: true, //加载登录页面显示隐藏
      // loadingCom: "",
      echartsName: "输入标题",
      CP_Echarts_select: false, //图表库是否显示
      CP_scenario_select: true,
      echartsLibrary: [], //图表库，echarts列表
      btnLibrary: [], //图表库，新建按钮 列表
      materialList: [],
      materialLists: [],
      // select_box_sh:false,// 场景编辑器 是否显示
      // selectItem:"电光源",//下拉框选中
      // selectList:[{name:"点光源",key:"point"},{name:"环境光",key:"ambient"},{name:"太阳光",key:"directional"},{name:"3D相机",key:"camera"},{name:"组",key:"group"}],// 场景编辑器 list内容
      New_srcbtnlist: [],
      map_sh: false, //作废
      idname: "test",
      markbasis: "basis",
      echartsDatalist: {}, //echartdata传参到编辑页的数据集合
      echartsData: {}, //单个渲染编辑的echarts数据
      maskLayerTF: false, //运行时，属性检查器禁止操作
      lingtcomp: false, //灯光组件显示
      cameracomp: true, //相机组件显示
      dataBindcomp: false, //绑定数据时间
      incidentcomp: false, //事件组件显示
      srceditcomp: false, //新建链接地址编辑显示
      basiscomp: true, //基础组件显示
      skyBox_sh: true, //天空盒显示
      material_sh: false, //材质
      CPr_contDiv: true, //场景检查器
      CPr_newStyle: false, //属性编辑器
      chartsEditor_sh: false, //echarts配置页显示
      srcedit_sh: false, //链接设置页显示
      // vr_idname:"viewport",//3D渲染div的id名称
      definePanel_sh: false, //创建小面板的工具弹框
      saveScen_sh: false, //保存场景说明面板
      saveScence: false, //是否。弹框
      navlist: ["场景", "编辑", "视图", "工具栏", "面板库"], //导航内容,'窗口'
      ullist: [
        { key: "新建场景", nextrue: false },
        { key: "打开场景", nextrue: true },
        { key: "保存场景", nextrue: false },
        { key: "发布场景", nextrue: false },
        { key: "删除场景", nextrue: false },
      ],
      ullists: [],
      dragDropList: {}, //导航栏三级菜单内容点击生成的img
      toolbarlist: [
        //旁边的小图标
        {
          name: "选中",
          key: "selected",
          src: "./static/img/selected.png",
          hoverSrc: "./static/img/selectedHover.png",
          hoversmall_sh: true,
          clickE: false,
        },
        {
          name: "旋转",
          key: "icon-refresh",
          src: "./static/img/icon-refresh.png",
          hoverSrc: "./static/img/icon-refreshover.png",
          hoversmall_sh: true,
          clickE: false,
        },
        {
          name: "锁定",
          key: "lock",
          src: "./static/img/lock.png",
          hoverSrc: "./static/img/lockHover.png",
          hoversmall_sh: true,
          clickE: false,
        },
        {
          name: "位移",
          key: "move",
          src: "./static/img/move.png",
          hoverSrc: "./static/img/moveHover.png",
          hoversmall_sh: true,
          clickE: false,
        },
        {
          name: "运行",
          key: "icon-play",
          src: "./static/img/icon-play.png",
          hoverSrc: "./static/img/icon-playHover.png",
          hoversmall_sh: true,
          clickE: false,
        },
      ],
      hovericon: "", //旁边的小图标src
      vr_title: ["查看", "摄像机", "显示", "选项", "过滤", "面板", "ProRender"], //vr上面的tit
      VR_research: "", //搜索资源输入框默认绑定数据
      resourceslist: [
        //VR三维资源图片列表
        {
          attribute: { modelInteractive: [0], modelChildrenType: [0] },
          iconPath: "CAD.png",
          id: "10001",
          modePath: "CAD.FBX",
          name: "地面",
        },
        {
          attribute: {
            modelInteractive: [1, 0, 0, 1],
            modelChildrenType: ["包装机辅机", "卷烟机", "管道", "包装机主机"],
            modePath: "JZ.FBX",
          },
          iconPath: "JZ.png",
          id: "10002",
          modePath: "JZ.FBX",
          name: "GDX1-PT70机组",
        },
      ],
      effect_CJ: true, //场景编辑器显示隐藏
      effect_SX: true, //属性编辑器，新增样式显示隐藏
      treedata: [
        {
          id: "Camera",
          label: "Camera",
          className: "element-icon icon-cameraelement-xiangji tree-icon",
        },
        {
          id: "10001-Light",
          label: "DefaultLight",
          className: "element-icon icon-cameraai251 tree-icon",
        },
      ], //树状图
      fnwebEdior: {}, //js注册
      MyWebEdior: {}, //js注册
      sourceId: "",
      resourcesimgSrc: "/Resource-Management-Service/getResources/test/", //资源图片的请求地址
      // shuUrl:"http://111.230.241.106:9084/DataitemFile-Management-Service/getDataitemSettings/test/MachineStateItems",//属性请求
      // ziyuanUrl:'http://111.230.241.106:9081/Resource-Management-Service/getResourceSettings/test',//请求资源管理数据
      // panelBGUrl:'http://111.230.241.106:9083/StyleFile-Management-Service/getStyleSettings/test/miniplane',//数据背景请求地址
      ziyuandata: "", //资源data
      istreedata: true,
      openattribute: false,
      treeid: "0",
      delettreeLID: "", //树状图点击当前的节点的id
      incidentpanel: "", //传值给事件组件
      shudata: "", //属性数据保存
      clickType: "", //点击树状图，包装机，辅机，主机
      bingDatade: "", //默认数据绑定对象,例，包装机辅机   不用的数据421
      treeclickD: "", //树状图双击需要拿到的id数据
      treeclickDindex: "", //树状图双击需要拿到的index数据
      hashTable: "",
      headerone: 1, //点击header的index值下标
      treeclickdata: {}, //tree点击当前获取的数据
      Headershow: false, //下拉列表数据显示
      kindheader: "", //弹框弹出是 新建触发还是打开场景触发
      judgesave: false, //判断是否是保存
      judgesaveing: "", //监听判断是否的实时的值
      aiid: "", //传值改变名称的id接受
      labelname: "floor", //页面渲染时，名称与点击的值一致
      // objectBelondName:"",//树状图默认数据绑定的input值
      openNI: "", //传参给保存场景的数据
      chlidtreeid: "", //点击传值id选中高光
      echartsId: "", //选中的echartsId
      echartsKey: 0, //选中的echartsKey
      clickkey: "", //选中的echarts的下标值
      src_data: "", //点击新建链接按钮，按钮的数据
      src_key: "", //点击新建链接按钮，下标值
      lightdata: "", //light组件传值
      loadingImage: 0, // 资源管理器图片加载完成个数
      Zindex: 10000, // 控制弹框层级
      treeclick: false, //判断是否是点击之后的id值
      defaultcheckedkeys: [],
      navIndex: -1,
      statuLSList: [],
      showSetData: false,
      statu_show: true, //状态设置的显示隐藏
      newSceneDataT: "",
      hisDatalist: [], //接受历史记录的数组对象
    };
  },
  components: {
    "v-StatuSetting": StatuSetting, //状态设置组件
    "v-installBasis": installBasis, //基础设置集合
    "v-mapping": mapping, //模型详细信息
    "v-login": loading, //加载组件
    "v-secHeader": secHeader, //二级表头
    "v-deleteM": deleteM, //删除模型
    "v-basis": basis, //基础位置设置
    "v-light": light, //灯光设置
    "v-skyBox": skyBox, //天空盒
    "v-bgBox": bgBox, //背景盒
    "v-material": material, //材质
    "v-camera": camera, //相机设置
    "v-incident": incident, //事件设置
    "v-srcedit": srcedit, //新建链接地址编辑数据
    "v-definePanel": definePanel, //创建面板
    "v-bouncedYN": bouncedYN, //保存场景弹框
    "v-saveScenario": saveScenario, //发布场景弹框
    "v-clearHost": clearHost, //清空历史记录弹框
    "v-renderer": renderer, //选项 渲染器弹框
    "v-convention": convention, //选项  常规弹框
    "v-filterC": filterC, //选项  滤镜弹框
    "v-piering": pie_ring,
    "v-lines": lines,
    "v-bar": bar,
    "v-chartsEditor": chartsEditor, //echarts编辑组件
  },
  watch: {
    realloads() {
      if (this.realloads == "100") {
        this.login_loading = false;
      }
    },
    treedata() {
      //树状图数据监听改变
      // console.log(this.treedata);
      this.istreedata = false;
      // this.defaultcheckedkeys = [this.treedata[this.treedata.length - 1].id];
      // console.log(this.defaultcheckedkeys);
      // console.log(this.treedata.length);
      if (this.treedata.length > "2") {
        this.saveloaclstuta();
        setTimeout(() => {
          this.statu_show = true;
        }, 50);
      } else if (this.treedata.length == "2") {
        this.statu_show = false;
        this.showSetData = false;
      }
      setTimeout(() => {
        this.treedata = this.fnwebEdior.objectTree().treeData;
        // console.log(this.treedata);
        this.istreedata = true;
        this.$nextTick(() => {
          this.filter(this.fnwebEdior.objectTree().ID);
        });
      }, 50);
    },
    treeid() {
      // console.log(this.treeid, 1111111);
      if (this.treeid !== undefined) {
        // console.log(this.treeid)
        this.filter(this.treeid);
        this.aiid = this.treeid;
      }
    },
    chlidtreeid() {
      // console.log(this.chlidtreeid);
      this.filter(this.chlidtreeid);
    },
    VR_research() {
      if (this.VR_research == "") {
        this.resourceslist = this.ziyuandata;
        return;
      }
    },
    ullist() {
      this.ullists = this.ullist;
    },
    judgesave() {
      if (this.judgesave == true || this.judgesaveing == "yes") {
        if (this.kindheader.changj == "打开场景") {
          this.fnwebEdior.loadServerScene(this.kindheader.data);
        } else if (this.kindheader.changj == "新建场景") {
          this.fnwebEdior.createScene();
        }
      }
    },
    materialList() {
      // console.log(this.materialList);
      // this.materialLists = [];
      // this.materialLists = this.materialList;
    },
    dragDropList: {
      // 数据变化时执行的逻辑代码
      handler(newName, oldName) {
        // console.log(this.dragDropList);
        if (this.dragDropList) {
          this.CP_Echarts = true;
          this.echartsLibrary = [];
          console.log(this.dragDropList, "this.dragDropList");
          let keys = Object.keys(this.dragDropList);
          keys.forEach((i) => {
            console.log(i);
            let item = {
              name: this.dragDropList[i].miniAttribute.panelTitle, //标题
              type: this.dragDropList[i].miniAttribute.chartsKind, //类型
              key: i, //下标值
              show: this.dragDropList[i].miniAttribute.show, //显示隐藏
              peizhidata: this.dragDropList[i],
            };
            this.echartsLibrary.push(item);
          });
        }
      },
      // 开启深度监听
      deep: true,
    },
    New_srcbtnlist: {
      handler(newName, oldName) {
        if (this.New_srcbtnlist) {
          // this.CP_Echarts = true;
          this.btnLibrary = [];
          let keys = Object.keys(this.New_srcbtnlist);
          keys.forEach((i) => {
            // console.log(i);
            let item = {
              name: this.New_srcbtnlist[i].title, //标题
              key: i, //下标值
              show: true, //显示隐藏
              peizhidata: this.New_srcbtnlist[i],
            };
            this.btnLibrary.push(item);
          });
        }
      },
      // 开启深度监听
      deep: true,
    },
    goondata() {
      console.log(this.goondata);
    },
  },
  methods: {
    // 获取标签类型
    getTagType() {
      this.$server.getTagType().then((res) => {
        console.log(res);
        this.tagType = res.data.data;
        this.tagTypeUUid = this.tagType[0].uuid;
        this.init(this.tagTypeUUid);
      });
    },
    init(tagTypeUUid) {
      this.$server.getTagLocation(tagTypeUUid).then((res) => {
        this.tagIcon = res.data.data[0].tagLocation;
        console.log(res.data.data);
        this.imgList = res.data.data;
      });
    },
    selectFn(e) {
      this.tagTypeUUid = e.target.value;
      this.init(this.tagTypeUUid);
      console.log(this.tagType);
      this.tagType.forEach(item=>{
          if(item.uuid ===this.tagTypeUUid){
                this.tagNames=item.name
          }
      })
      this.selectImg=0
      console.log(this.tagNames);
    },
    // 标签管理
    selectIcon(item,index) {
        this.init(this.tagTypeUUid);
      this.CPr_selectIcon_show = true;
      this.CPr_tag = true;
      this.CPr_contDiv = false;
      this.CPr_newStyle = false;
      this.CPr_basis = false;
      this.CPr_Hostriy = false;
      $(".CPr_left .CPr_left_ul .CPr_left_li:eq(5)")
        .addClass("CPr_left_select")
        .siblings()
        .removeClass("CPr_left_select");
      this.tagName = item.name;
      this.tagId = item.id;
      this.coordinateX = item.position.x;
      this.coordinateY = item.position.y;
      this.coordinateZ = item.position.z;
      if (this.tabList.length === 0) {
        this.CPr_selectIcon_show = false;
      }
    },
    // 创建新的标签
    New_icon() {
      this.CPr_icon = true;
      this.CP_scenario("标签管理");
      this.fnwebEdior.addSceneLabel("标签01", "报警", this.tagIcon);
    },
    // 删除标签
    handleDeletes(id) {
        console.log(id);
      this.fnwebEdior.deleteSceneLabel(id);
      console.log(this.tabList);

    },
    // 标签名称修改
    changeName(name, id, value) {
      this.tagName = value;
      this.fnwebEdior.updateSceneLabel(name, id, value);
    },
    //修改右边标签属性
    changeTag(name, id, value) {
      console.log(name, id, value);
      this.fnwebEdior.updateSceneLabel(name, id, value);
      this.tabList.forEach((item) => {
        if (item.id === id) {
          item.name = value;
        }
      });
    },
    //修改X轴属性
    changePositionX(name, id, value) {
      console.log(name, id, value);
      this.fnwebEdior.updateSceneLabel(name, id, value);
      this.tabList.forEach((item) => {
        if (item.id === id) {
          item.position.x = value;
        }
      });
    },
    //修改Y轴属性
    changePositionY(name, id, value) {
      console.log(name, id, value);
      this.fnwebEdior.updateSceneLabel(name, id, value);
      this.tabList.forEach((item) => {
        if (item.id === id) {
          item.position.y = value;
        }
      });
    },
     //修改Z轴属性
    changePositionZ(name, id, value) {
      console.log(name, id, value);
      this.fnwebEdior.updateSceneLabel(name, id, value);
      this.tabList.forEach((item) => {
        if (item.id === id) {
          item.position.z = value;
        }
      });
    },
    clickImg(index){
        this.selectImg=index
        console.log(';;;;;;;;;');
    },
    // handleInput(e) {
    //   this.val = e.target.value.replace(/[^\d]/g, "");
    // },

    openpanel(item) {
      //菜单栏点击出现弹框的点击触发方法 清空历史记录 小面板库 渲染器 常规 滤镜 保存场景 发布场景
      if (item == "清空历史记录") {
        this.clearHost_sh = true;
      } else if (item == "小面板库") {
        this.Zindex = this.Zindex + 1;
        this.definePanel_sh = true;
      } else if (item == "渲染器") {
        this.Zindex = this.Zindex + 1;
        this.renderer_sh = true;
        this.convention_sh = false;
        this.filterC_sh = false;
      } else if (item == "常规") {
        this.Zindex = this.Zindex + 1;
        this.renderer_sh = false;
        this.convention_sh = true;
        this.filterC_sh = false;
      } else if (item == "滤镜") {
        this.Zindex = this.Zindex + 1;
        this.convention_sh = false;
        this.renderer_sh = false;
        this.filterC_sh = true;
      } else if (item == "保存场景") {
        this.saveScen_sh = false;
        this.saveScence = true;
      } else if (item == "发布场景") {
        this.saveScen_sh = false;
        setTimeout(() => {
          this.Zindex = this.Zindex + 1;
          this.saveScen_sh = true;
          this.saveScence = false;
          this.convertAction(); // 暂时不添加数据
        });
      }
    },
    closepanel(item) {
      //所有弹框关闭的方法
      if (item == "保存场景") {
        this.saveScence = false;
      } else if (item == "小面板库") {
        this.definePanel_sh = false;
      } else if (item == "渲染器") {
        this.renderer_sh = false;
      } else if (item == "常规") {
        this.convention_sh = false;
      } else if (item == "滤镜") {
        this.filterC_sh = false;
      } else if (item == "清空历史") {
        this.clearHost_sh = false;
      } else if (item == "发布场景") {
        this.saveScen_sh = false;
      } else if (item == "模型") {
        this.deleteM_sh = false;
        this.Rightclick_sh = false;
      } else if (item == "save") {
        this.judgesave = true;
      }
    },
    delHost(data, key, index) {
      //清除历史记录的方法
      $(".rightshow p:eq(" + key + ")")
        .addClass(".pselect")
        .siblings()
        .removeClass(".pselect");
      if (data == "删除") {
        this.fnwebEdior.deleteHistoryItem(this.rightclick);
      } else if (data == "清除历史记录") {
        this.clearHost_sh = true;
      }
    },
    contextmenu(key, e) {
      //历史记录右键删除弹框触发
      e.preventDefault();
      this.rightclick = "";
      this.rightclick = key;
      this.contextmenuKey = -1;
      $(".Hisdata ul li:eq(" + key + ") input[type=checkbox]").attr(
        "checked",
        "checked"
      );
      document.body.removeEventListener("click", () => {
        this.rightclick = -1;
      });
      document.body.addEventListener("click", () => {
        this.rightclick = -1;
      });
    },
    hisDatalistFn(item, key) {
      //历史记录删除勾选
      console.log(item, key);
      this.contextmenuKey = key;
      console.log(this.contextmenuKey);
      var CGridV = $("#" + key + "").prop("checked");
      this.fnwebEdior.showHistory(this.contextmenuKey);
      if (CGridV == true) {
        //选中
        this.hisDatalist[key].checked = true;
      } else if (CGridV == false) {
        this.hisDatalist[key].checked = false;
      }
    },
    deleModul() {
      //右键删除模型方法
      this.deleteM_sh = true;
      this.delet_kind = "模型";
      $(".Rightclick ul li:eq(1)")
        .addClass("RC_select")
        .siblings()
        .removeClass("RC_select");
    },
    hiddenModul() {
      //右键隐藏模型的方法
      console.log(this.treeclickD);
      $(".Rightclick ul li:eq(0)")
        .addClass("RC_select")
        .siblings()
        .removeClass("RC_select");
      this.fnwebEdior.setVisible(false, this.treeclickD);
      this.Rightclick_sh = false;
    },
    comeback() {
      //点击返回项目管理页面
      console.log("返回分页");
      this.comebacked = true;
      let publics = localStorage.getItem("publics");
      console.log(publics);
      if (publics == "false") {
        this.saveScence = true;
        this.saveScen_sh = false;
      } else if (publics == null || publics == "" || publics == "true") {
        // this.saveScence = true;
        alert("将跳转到管理页面");
        let login_3 = true;
        let host = location.host;
        this.$router.push({
          path: "/manage",
          query: { login_3: login_3, type: "reload" },
        });
        // location.reload();
      }
    },
    async optenScene() {
      // 打开场景
      console.log("打开场景");
      let item = localStorage.getItem("ys-opten-scene")
        ? JSON.parse(localStorage.getItem("ys-opten-scene"))
        : "";
      console.log(item);
      if (item) {
        let opendataNI = item;
        this.manageitemdata = item;
        this.openNI = item;
        console.log(item);
        let type = "test/";
        let name = item.id;
        let arrdatas = {};
        let dataopennew = {};
        let uuid = item.uuid;
        console.log(uuid);
        await this.$server
          .sceneinfogetByScene(uuid)
          .then((data) => {
            //根据id查询场景信息
            let dataopen = data.data.data.json;
            console.log(dataopen);
            localStorage.setItem("sceneData", JSON.stringify(dataopen));
            arrdatas = {
              changj: "打开场景",
              data: dataopen,
              opendataNI: item,
            };
            // 同时将数据的配置文件发送到服务器
            console.log(
              opendataNI,
              "opendataNIopendataNIopendataNIopendataNIopendataNIopendataNI"
            );
            this.bounced_shopen(opendataNI);
            let publics = localStorage.getItem("publics");
            if (publics == "true") {
              this.fnwebEdior.loadServerScene(arrdatas.data);
            } else if (publics == null || publics == "" || publics == "false") {
              this.Zindex = this.Zindex + 1;
              this.saveScence = false;
              this.kindheader = arrdatas;
              if (this.kindheader.changj == "打开场景") {
                console.log(3333);
                this.fnwebEdior.loadServerScene(this.kindheader.data);
              }
            }
            console.log(this.openNI);
            var newSceneData = localStorage.getItem("sceneData");
            var echarts = newSceneData.scene3D.sceneData.echarts;
            var sceneRUL = newSceneData.scene3D.sceneData.sceneRUL;
            console.log(sceneRUL);
            if (sceneRUL) {
              this.sceneRUL_shYn(sceneRUL);
            }
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
            let dragDropLists = JSON.parse(JSON.stringify(dragDropList));
            // this.$emit('dragDropList_shYn', dragDropLists);
            this.dragDropList_shYn(dragDropLists);
            // return
            localStorage.setItem("dragKey", dragKey);
          })
          .catch((res) => {});
        setTimeout(() => {
          localStorage.setItem("ys-opten-scene", "");
        }, 2000);
      }
    },
    install() {
      //基础设置按钮点击方法
      this.CPr_basis = true;
      this.CPr_switch("基础设置");
      this.saveloaclstuta();
    },
    saveloaclstuta() {
      //保存状态设置的数据到local里面
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      // console.log(newSceneData);
      if (newSceneData) {
        if (
          newSceneData.scene3D.sceneData.StateColor == "" ||
          newSceneData.scene3D.sceneData.StateColor == null ||
          newSceneData.scene3D.sceneData.StateColor == undefined
        ) {
          // console.log("创建")
          newSceneData.scene3D.sceneData.StateColor = [];
          this.statuLSList = [
            {
              isUse: true,
              name: "警报",
              color: "rgb(32,161,129)",
              colorInput: "#20A181",
              id: "",
              value: "0",
            }, //#ff6784
            {
              isUse: true,
              name: "未开机",
              color: "rgb(235,61,157)",
              colorInput: "#EB3D9D",
              id: "",
              value: "1",
            }, //#0096ff
            {
              isUse: true,
              name: "待机",
              color: "rgb(102,106,214)",
              colorInput: "#666AD6",
              id: "",
              value: "2",
            }, //#eeeccc
          ];
          for (var i = 0; i < this.statuLSList.length; i++) {
            let newidadd, idadd;
            idadd = (((1 + Math.random()) * 0x10000) | 0)
              .toString(16)
              .substring(1);
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
            this.statuLSList[i].id = newidadd;
            newSceneData.scene3D.sceneData.StateColor.push(this.statuLSList[i]);
          }
          // console.log(newSceneData.scene3D.sceneData.StateColor)
        }
        if (
          newSceneData.scene3D.sceneData.API == "" ||
          newSceneData.scene3D.sceneData.API == null ||
          newSceneData.scene3D.sceneData.API == undefined
        ) {
          newSceneData.scene3D.sceneData.API = [];
          let urllist = [
            {
              name: "restful",
              key: "0",
              url:
                "http://192.168.89.101:7087/Data-Interface-Service-Restful/getDataByJsonFile/test/",
              id: "",
              checked: true,
            },
            {
              name: "normal",
              key: "1",
              url:
                "http://192.168.89.101:9086/Data-Interface-Service/Connect/test/",
              id: "",
              checked: false,
            },
          ];
          for (var i = 0; i < urllist.length; i++) {
            let newidadd, idadd;
            idadd = (((1 + Math.random()) * 0x10000) | 0)
              .toString(16)
              .substring(1);
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
            urllist[i].id = newidadd;
            newSceneData.scene3D.sceneData.API.push(urllist[i]);
          }
          // console.log(newSceneData.scene3D.sceneData.API);
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
      this.showSetData = true;
    },
    install_url(data) {
      //基础设置  组件内，链接地址数据传参
      // console.log(data);
      this.type_url = data;
    },
    imgLad(key) {
      // 监听资源管理器图片加载
      let listLength = this.resourceslist.length; // 资源管理器图片总个数
      this.loadingImage = this.loadingImage + 1; // 资源管理器图片加载个数
      console.log(this.loadingImage);
      let num = (this.loadingImage / listLength) * 100; // 加载个比例
      // console.log(num);
      this.loading(num);
    },
    loading(realnum) {
      //页面打开加载动画做的请求拿到值，判断显示的实际
      // console.log(realnum);
      this.realloads = realnum;
      if (this.realloads == "100") {
        this.login_loading = false;
      }
    },
    selectLibrary(item, key) {
      //调用echarts点击方法
      this.echarts(item, key);
    },
    selectbtn(item, key) {
      //点击新建
      this.srckey(item, key);
      this.CPr_switch("图表设置");
      this.chartsEditor_sh = false;
      this.srcedit_sh = true;
      $(".CPr_left .CPr_left_ul .CPr_left_li:eq(2)")
        .addClass("CPr_left_select")
        .siblings()
        .removeClass("CPr_left_select");

      // $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(1)").addClass('CPr_left_select').siblings().removeClass('CPr_left_select');
    },
    echars_delete(data, key) {
      //图表库控制删除
      console.log(key);
      console.log(data);
      this.$delete(this.echartsDatalist, data);
      this.$delete(this.dragDropList, data);
      this.echartsLibrary.splice(data, 1);
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        if (
          newSceneData.scene3D.sceneData.echarts !== "" ||
          null ||
          undefined
        ) {
          newSceneData.scene3D.sceneData.echarts.splice(key, 1);
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    btn_delete(data) {
      //图表库,新建链接，控制删除
      console.log(data);
      this.$delete(this.New_srcbtnlist, data);
      this.btnLibrary.splice(data, 1);
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        if (
          newSceneData.scene3D.sceneData.sceneRUL !== "" ||
          null ||
          undefined
        ) {
          newSceneData.scene3D.sceneData.sceneRUL.splice(data, 1);
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    echarts_sh(item, key, index) {
      //图表库控制显示隐藏
      console.log(item, key, index);
      // console.log(keys);
      if (item == "show") {
        console.log("show");
        this.echartsLibrary[index].show = false;
        this.echartsDatalist[key].miniAttribute.show = false;
        this.dragDropList[key].miniAttribute.show = false;
        this.echartsLibrary[index].show = false;
        $(".vr_div .chartG_box[data-id='echart" + key + "']").hide();
        console.log(this.echartsLibrary[index]);
      } else if (item == "hide") {
        console.log("hide");
        this.echartsLibrary[index].show = true;
        this.echartsDatalist[key].miniAttribute.show = true;
        this.dragDropList[key].miniAttribute.show = true;
        this.echartsLibrary[index].show = true;
        $(".vr_div .chartG_box[data-id='echart" + key + "']").show();
        // $(".vr_div .chartG_box[data-id='echart"+ key +"']").width(348);
        // $(".vr_div .chartG_box[data-id='echart"+ key +"']").height(186);
      }
      let idchart = "echart" + key;
      console.log(this.echartsDatalist, "this.echartsDatalist");
      this.echartsData = "";
      setTimeout(() => {
        this.echartsData = this.echartsDatalist[key];
        let dataE = {
          data: this.echartsData,
        };
        this.saveloacl(dataE);
        // this.echarts(this.echartsData,key);
      });
    },
    btn_sh(item, key, index) {
      //图表库，新建按钮，控制显示隐藏
      console.log(item, key, index);
      if (item == "show") {
        console.log("show");
        this.btnLibrary[index].show = false;
        $(".newsrc_btn span:eq(" + key + ")").hide();
      } else if (item == "hide") {
        console.log("hide");
        this.btnLibrary[index].show = true;
        $(".newsrc_btn span:eq(" + key + ")").show();
      }
    },
    echarts_name(val, key, keys, item) {
      //图表库控制图表的标题
      // console.log(val);
      console.log(key, keys, 2222222);
      let keyval = $(
        ".CPr_Econtent .CPr_Econtent_echarts li:eq(" + keys + ") p input"
      ).val();
      $(
        ".CPr_Econtent .CPr_Econtent_echarts li:eq(" + keys + ") p input"
      ).blur();
      $(".CP_scenario .CPr_Econtent li:eq(" + keys + ")").removeClass(
        "inputseclect"
      );
      let datas = {
        type: "titleText",
        data: keyval,
      };
      let idchart = "echart" + key;
      console.log(this.echartsDatalist, "this.echartsDatalist");
      this.echartsDatalist[key].miniAttribute.panelTitle = keyval;
      this.dragDropList[key].miniAttribute.panelTitle = keyval;
      this.echartsData = "";
      setTimeout(() => {
        this.echartsData = this.echartsDatalist[key];
        let dataE = {
          data: this.echartsData,
        };
        this.saveloacl(dataE);
        // this.echarts(this.echartsData,key);
      });
      this.echartsLibrary[keys].name = keyval;
      console.log(datas, "datasdatas");
      this.$refs[idchart][0].Ereset(datas); // 调用子组件方法
    },
    btn_name(val, key, keys, item) {
      //图表库，新建按钮，修改标题
      console.log(key, keys, item);
      let btnval = $(
        ".CP_scenario .CPr_Econtent_btn li:eq(" + keys + ") p input"
      ).val();
      // console.log(btnval);
      $(".CP_scenario .CPr_Econtent_btn li:eq(" + keys + ") p input").blur();
      $(".CP_scenario .CPr_Econtent_btn li:eq(" + keys + ")").removeClass(
        "inputseclect"
      );
      // this.btnLibrary[key].name = keyval;
      this.New_srcbtnlist[key].title = btnval;
      setTimeout(() => {
        this.src_data = this.New_srcbtnlist[key];
        var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
        console.log(newSceneData);
        if (newSceneData) {
          if (
            newSceneData.scene3D.sceneData.sceneRUL !== "" ||
            null ||
            undefined
          ) {
            newSceneData.scene3D.sceneData.sceneRUL[key].title = btnval;
          }
        }
        localStorage.setItem("sceneData", JSON.stringify(newSceneData));
      });
    },
    btnnameblur(key, val) {
      //点击输入框，有选中效果
      console.log(key);
      if (val == "echart") {
        $(".CP_scenario .CPr_Econtent li:eq(" + key + ")")
          .addClass("inputseclect")
          .siblings()
          .removeClass("inputseclect");
      } else if (val == "btn") {
        $(".CP_scenario .CPr_Econtent_btn li:eq(" + key + ")")
          .addClass("inputseclect")
          .siblings()
          .removeClass("inputseclect");
      }
    },
    dragDropList_shYn(data) {
      //添加每一项到echarts里
      // console.log(data, 'dragDropList_shYn')
      // console.log(data);
      this.dragDropList = {};
      this.echartsDatalist = {};
      this.echartsData = {};
      // return
      this.$nextTick(() => {
        this.dragDropList = data;
        this.echartsDatalist = data;
        this.echartsData = data;
        this.openDrag(this.dragDropList); // 开启拖拽
      });
    },
    echarts(item, key) {
      //点击echarts
      console.log(item, key, 222);
      // if(item == "饼状图" || item == "折线图" ||item == "柱状图"){
      $(".vr_div .chartG_box[data-id='echart" + key + "']")
        .css({
          background: "url('../../static/img/echarts_border.png')",
          "background-size": "100% 100%",
          "background-repeat": "no-repeat",
          "background-position": "100% 100%",
        })
        .attr("data-drag", 1);
      $(".vr_div .chartG_box[data-id='echart" + key + "']")
        .siblings()
        .css("background", "none")
        .attr("data-drag", 0);
      //切换到图表库
      $(
        ".CP_scenario .CPr_Econtent .CPr_Econtent_echarts li[data-id='" +
          key +
          "']"
      )
        .addClass("CPr_EcontentliH")
        .siblings()
        .removeClass("CPr_EcontentliH");
      $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(1)")
        .addClass("CPr_left_select")
        .siblings()
        .removeClass("CPr_left_select");
      this.CP_scenario("图表库");
      this.CPr_switch("图表设置");
      // }b
      console.log(this.echartsData);
      this.echartsData = this.echartsDatalist[key];
      localStorage.setItem("ys-echartsData", JSON.stringify(this.echartsData));
      // console.log(this.echartsData, 'this.echartsData')
      this.clickkey = key;
      $(".CPr_left .CPr_left_ul .CPr_left_li:eq(1)")
        .addClass("CPr_left_select")
        .siblings()
        .removeClass("CPr_left_select");
      this.CPr_contDiv = false;
      // this.CPr_newStyle = true;
      // this.chartsEditor_sh = true;
      this.srcedit_sh = false;
      this.echartsId = "echart" + key; // 存储ID
      this.echartsKey = key; // 存储key
      // console.log(this.echartsKey);
    },
    titleCharts(data) {
      //编辑传值echarts，标题
      let datas = {
        type: "titleText",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas); // 调用子组件方法
    },
    stylecharts(data) {
      //数据显示风格,默认，强调，简洁
      // console.log(data);
      let datas = {
        type: "stylecharts",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    intensity(data) {
      //文字大小，进度条
      let datas = {
        type: "intensity",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    coloropacity(data) {
      //透明度，进度条
      let datas = {
        type: "coloropacity",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    Xaxis(data) {
      //X轴间距
      let datas = {
        type: "Xaxis",
        data: data,
      };
      $("div[data-id=" + this.echartsId + "]").css("left", data + "px");
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    Yaxis(data) {
      //Y轴间距
      let datas = {
        type: "Yaxis",
        data: data,
      };
      $("div[data-id=" + this.echartsId + "]").css("top", data + "px");
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    Wkuan(data) {
      //图表宽度
      $(".vr_div .chartG_box[data-id=" + this.echartsId + "]").width(data);
      $("#" + this.echartsId + "").width(data);
      let datas = {
        type: "Wkuan",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    Hgao(data) {
      //图表高度
      $(".vr_div .chartG_box[data-id=" + this.echartsId + "]").height(data);
      $("#" + this.echartsId + "").height(data);
      let datas = {
        type: "Hgao",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    colorKind(data) {
      //配色方案
      let datas = {
        type: "colorKind",
        data: data,
      };
      this.$refs[this.echartsId][0].Ereset(datas);
    },
    deleEch_fn(data) {
      //删除选中的echarts
      console.log(data);
      // this.echartsDatalist.splice(data,1);
      this.$delete(this.echartsDatalist, data);
      this.$delete(this.dragDropList, data);
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        newSceneData.scene3D.sceneData.echarts.splice(data, 1);
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
      // $(".vr_div .chartG_box:eq("+data+")").empty();
    },
    saveEch_fn(data) {
      //保存当前选中的echarts
      console.log(data);
      this.echartsDatalist[data.key] = data.data;
      console.log(this.echartsDatalist);
      data.data.miniAttribute.cavaseW = $("#viewport").width();
      data.data.miniAttribute.cavaseH = $("#viewport").height();
      console.log(data.data);
      localStorage.setItem("echarts", JSON.stringify(this.echartsDatalist));
      localStorage.setItem("ys-echartsData", JSON.stringify(data.data));
      this.saveloacl(data);
      console.log(this.openNI);
      if (this.openNI !== undefined) {
        var type = "test";
        var name = this.openNI.name;
        var info = this.openNI.info;
        var JsonData = JSON.parse(localStorage.getItem("sceneData"));
        console.log(name, info);
        // return
        this.$http(
          this.httpdata.SceneFileManagementService +
            "/SceneFile-Management-Service/updateScene/" +
            type +
            "/" +
            name +
            "/" +
            info +
            "/JsonData",
          JsonData,
          "POST"
        )
          .then((res) => {
            // 同时将数据的配置文件发送到服务器
            // alert("保存成功!");
          })
          .catch((res) => {});
      }
    },
    saveloacl(data) {
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        if (!newSceneData.scene3D.sceneData.echarts) {
          newSceneData.scene3D.sceneData.echarts = [];
          console.log("无");
          newSceneData.scene3D.sceneData.echarts.push(data.data);
        } else {
          let key = -1;
          for (
            var i = 0;
            i < newSceneData.scene3D.sceneData.echarts.length;
            i++
          ) {
            if (
              newSceneData.scene3D.sceneData.echarts[i].miniID ==
              data.data.miniID
            ) {
              key = i;
            }
          }
          if (key > -1) {
            newSceneData.scene3D.sceneData.echarts.splice(key, 1, data.data);
          } else {
            console.log("有");
            // console.log(newSceneData.scene3D.sceneData.echarts);
            newSceneData.scene3D.sceneData.echarts.push(data.data);
          }
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    peizhiEDB(data, key) {
      //Echarts图传参
      this.echartsDatalist[key] = data;
      // if (!type) {
      //     this.echartsDatalist.splice(this.echartsKey, 1, data)
      // } else {
      //     this.echartsDatalist.push(data)
      // }
      // console.log(this.echartsDatalist, 'echartsDatalist', key)
    },
    New_src(data) {
      //新建链接，创建按钮
      // console.log(data);

      let idadd;
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
      this.src_data = {
        title: "链接标题",
        url: "http://www.baidu.com", //链接地址
        width: "80", //屏幕占比
        id: newidadd,
        layer: 1, //layer
        defaultVisible: true,
      };
      this.New_srcbtnlist.push(this.src_data);
      this.New_saveUrl(this.src_data);
      this.CPr_href = true;

      this.CP_scenario("链接管理");
    },

    srckey(item, key) {
      //按钮点击
      // console.log(item,key);
      // console.log(this.New_srcbtnlist);
      // this.srceditcomp = true;
      this.CPr_newStyle = true;
      this.chartsEditor_sh = false;
      this.srcedit_sh = true;
      this.src_data = this.New_srcbtnlist[key];
      // console.log(this.src_data);
      this.x = key;
      $(".CP_scenario .CPr_Econtent_btn li:eq(" + key + ")")
        .addClass("CPr_EcontentliH")
        .siblings()
        .removeClass("CPr_EcontentliH");
      this.CP_scenario("链接管理");
      this.CPr_switch("链接设置");
      // this.New_srcbtnlist=[];
    },
    dele_srcone(data) {
      //新建链接按钮，删除
      // console.log(data);
      this.New_srcbtnlist.splice(data, 1);
      this.srceditcomp = false;
      this.CPr_newStyle = true;
      this.chartsEditor_sh = true;
      this.srcedit_sh = false;
    },
    save_srcone(dataV) {
      //新建链接按钮，保存
      // console.log(dataV);
      // this.srceditcomp = false;
      let data = dataV.data;
      // console.log(data);
      this.New_srcbtnlist.splice(dataV.key, 1, data);
      this.New_saveUrl(data);
    },
    New_saveUrl(data) {
      // console.log(data);
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      console.log(newSceneData);
      if (newSceneData) {
        if (!newSceneData.scene3D.sceneData.sceneRUL) {
          newSceneData.scene3D.sceneData.sceneRUL = [];
          newSceneData.scene3D.sceneData.sceneRUL.push(data);
        } else {
          let key = -1;
          for (
            var i = 0;
            i < newSceneData.scene3D.sceneData.sceneRUL.length;
            i++
          ) {
            if (newSceneData.scene3D.sceneData.sceneRUL[i].id == data.id) {
              key = i;
            }
          }
          if (key > -1) {
            newSceneData.scene3D.sceneData.sceneRUL.splice(key, 1, data);
          } else {
            console.log(newSceneData.scene3D.sceneData.sceneRUL);
            newSceneData.scene3D.sceneData.sceneRUL.push(data);
          }
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    drop(event) {
      // 资源对象被拖拽时触发
      if (this.sourceId) {
        // 调用三维的加载方式   loadResourceObject
        // resource
        console.log(event);
        console.log(this.sourceId);
        this.fnwebEdior.loadResourceObject(this.resourceslist, this.sourceId);
      }
    },
    dragstart(event) {
      // 资源对象被拖拽到cavans中触发
      this.sourceId = event.target.id;
      console.log(this.sourceId);
    },
    moduleXYZ(data) {
      //XYZ 输入框的默认值
      console.log(data);
    },
    remove(node, data) {
      // 删除tree
      // console.log(data.isCanDelete);
      if (data.isCanDelete == true) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.id === data.id);
        children.splice(index, 1);
        // console.log(data.id);
        this.fnwebEdior.deleteObjectFromElement(data.id);
      }
    },
    filter(filterid) {
      // 过滤tree id
      if (!filterid) {
        this.$refs.tree1.setCurrentKey("Camera");
        return;
      }
      try {
        this.treeclickD = filterid;
        this.delettreeLID = filterid;
        let data = this.treedata,
          arr = [],
          label = "";
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let filterObj = [];
          if (data[i].children && data[i].children.length >= 1) {
            // 判断是否有子级
            if (data[i].id == filterid) {
              arr.push(data[i].id);
              label = data[i].label;
              break;
            } else {
              filterObj.push(data[i].id);
              depthFilter(data[i].children, filterObj);
            }
          } else {
            if (data[i].id == filterid) {
              arr.push(data[i].id);
              label = data[i].label;
            }
          }
        }
        // console.log(label);
        // this.labelname = label;
        // console.log(this.labelname,"labelname")
        function depthFilter(depthData, filterObj) {
          //
          // console.log(depthData);
          for (let y = 0; y < depthData.length; y++) {
            if (depthData[y].children && depthData[y].children.length >= 1) {
              // 判断是否有子级
              if (depthData[y].id == filterid) {
                arr.push(...filterObj, depthData[y].id);
                break;
              } else {
                filterObj.push(depthData[y].id);
                depthFilter(depthData[y].children, filterObj);
              }
            } else {
              if (depthData[y].id == filterid) {
                arr.push(...filterObj, depthData[y].id);
              }
            }
          }
        }
        // console.log(filterid, 'filteridfilteridfilteridfilterid')
        if (this.$refs.tree1 && !this.treeclick) {
          // 高亮显示
          this.$refs.tree1.setCurrentKey(filterid);
          let getCurrentNodedata = this.$refs.tree1.getCurrentNode();
          let getNodedata = this.$refs.tree1.getNode(getCurrentNodedata);
          this.handleNodeClick(getCurrentNodedata, getNodedata);
          // console.log(getCurrentNodedata,"")
          // console.log(getNodedata, 222) // 这里面应该有level
        }
        this.treeclick = false;
        // console.log(this.$refs.tree1.store._getAllNodes());
        for (var i = 0; i < this.$refs.tree1.store._getAllNodes().length; i++) {
          // 获取所有树节点
          if (this.$refs.tree1.store._getAllNodes().length > 3) {
            this.lingtcomp = false;
            this.cameracomp = false;
          }
          if (this.$refs.tree1.store._getAllNodes()[i].level == 2) {
            this.$refs.tree1.store._getAllNodes()[
              i
            ].data.belondName = this.shudata;
          }
          for (let x = 0; x < arr.length; x++) {
            if (this.$refs.tree1.store._getAllNodes()[i].key == arr[x]) {
              this.$refs.tree1.store._getAllNodes()[i].expanded = true;
            }
          }
        }
        // console.log("没问题")
      } catch (res) {
        // console.warn(res)
      }
    },
    celldbclick() {
      //树状图双击事件
      console.log("双击");
      this.fnwebEdior.getFocusObject(this.treeclickD, this.treeclickDindex);
    },
    handleNodeClick(data, node, value) {
      //树状图点击
      // console.log("点击树状图");
      // console.log(node);
      this.treeclicknode = node;
      this.see_YN = data.visible;
      // console.log(this.see_YN);
      this.$refs.kejian.shifoukejian(this.see_YN);
      // this.materialLists = this.materialList;
      this.treeclick = true;
      // console.log(data.isShowMaxiPanel);
      this.isShowModelDetail = data.isShowModelDetail;
      this.isShowMaxiPanel = data.isShowMaxiPanel;
      this.CPr_switch("属性检查器");
      this.CP_scenario("场景编辑器");
      this.delettreeLID = data.id; //点击当前id
      // this.objectBelondName = data.objectBelondName;、、、、421不用
      this.incidentcomp = false;
      this.clickIndex = data.index;
      // console.log(data.ModelChildrenMechineType);
      // this.filter(this.delettreeLID);
      // console.log(data);
      this.labelname = "";
      this.labelname = data.label;
      // console.log(this.labelname)
      this.treeclickdata = data;
      this.clickType = data.machineType;
      this.clickTypeXH = data.ModelChildrenMechineType;
      let level = node.level,
        parent = node;
      // console.log(parent);
      // 如果当前对象是单独的机器组，那么用以下的方式获取父级对象     2-28
      // 如果当前对象是某个对象的子对象，那么需要返回当前模型的id
      this.markbasis = "basis";
      if (level > 1 && parent.parent !== null) {
        // 获取 点击 父级id
        if (parent.data.children && parent.data.children.length > 0) {
          parent = parent;
        } else {
          parent = parent.parent;
        }
      }
      this.treeclickD = parent.key;
      // console.log(this.treeclickD);
      this.treeclickDindex = data.index;
      this.fnwebEdior.lookAtObject(this.treeclickD, null, this.treeclickDindex);
      // console.log(this.treeclickD);
      this.incidentpanel = {
        level: level,
        id: this.treeclickD,
        index: data.index,
        belondName: this.bingDatade,
      };
      // console.log(this.incidentpanel);
      this.basiscomp = false;
      this.material_sh = false;
      if (data.isCanNamed == true) {
        //点击可以修改名称
        this.basiscomp = true;
      } else if (data.isCanNamed == false) {
        this.basiscomp = false;
      }
      if (data.label == "Camera") {
        this.skyBox_sh = true;
        this.basiscomp = true;
        if (this.basiscomp == true) {
          this.markbasis = "Camera";
        }
      } else {
        this.skyBox_sh = false;
      }
      if (data.label == "Camera") {
        this.lingtcomp = false;
        this.cameracomp = true;
      } else if (data.type == "light") {
        this.basiscomp = true;
        this.lingtcomp = true;
        this.cameracomp = false;
        if (this.basiscomp == true) {
          this.markbasis = "Camera";
        }
        this.lightdata = {
          color: data.color,
          opacity: data.opacity,
        };
        // console.log(this.lightdata);
      } else {
        this.lingtcomp = false;
        this.cameracomp = false;
      }
      if (data.label == "JZ") {
        // console.log(data.label);
        this.lingtcomp = false;
        this.cameracomp = false;
      } else if (data.label == "floor") {
        this.lingtcomp = false;
        this.cameracomp = false;
        // console.log(this.materialList);
        if (this.materialList.length > 0) {
          this.material_sh = true;
        } else {
          this.material_sh = false;
        }
      }
      if (data.InteractiveEvent == true) {
        //树状图属性为true，显示事件组件，为false，不显示事件组件

        this.incidentcomp = false;
        this.lingtcomp = false;
        this.cameracomp = false;
        setTimeout(() => {
          // console.log(this.incidentcomp);
          this.incidentcomp = true;
          // console.log(this.incidentcomp);
        });
      } else if (data.InteractiveEvent == false) {
        this.incidentcomp = false;
        this.dataBindcomp = false;
      }
      if (data.InteractiveControl == true) {
        this.basiscomp = true;
        this.lingtcomp = false;
        this.cameracomp = false;
      } else if (data.InteractiveControl == false) {
        this.basiscomp = false;
      }
      if (data.belond == true) {
        //点击当前，是belond，就展示数据绑定组件
        this.lingtcomp = false;
        this.cameracomp = false;
        this.dataBindcomp = false;
        setTimeout(() => {
          this.dataBindcomp = true;
        });
      } else {
        this.dataBindcomp = false;
      }
      if (data.belond == false) {
        this.dataBindcomp = false;
      }
    },
    handleDragStart(node, ev) {
      // console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // 拖拽进入其他节点时触发的事件
      // console.log('tree drag enter: ', dropNode.label,"拖拽进去触发的事件");
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // 拖拽离开某个节点时触发的事件
      // console.log('tree drag leave: ',"拖拽离开某个节点时触发的事件")
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // 拖拽结束的方法
      // console.log(draggingNode.level);
      if (draggingNode.level == "2") {
        if (dropType == "before" || dropType == "after") {
          console.log(draggingNode.label, dropType);
          if (!dropNode) return;
          if (draggingNode.data.isCanMove == true) {
            let childrenData = {
              key: draggingNode.key,
              label: draggingNode.label,
            };
            // console.log(childrenData,"childrenDatachildrenDatachildrenData");
            this.fnwebEdior.setParent("moveOut", childrenData);
          }
        }
      }

      if (dropType == "inner") {
        // console.log("进入父级！")
        if (!dropNode) return;
        if (draggingNode.data.isCanMove == true) {
          let ParentData = {
              key: dropNode.key,
              label: dropNode.label,
            },
            childrenData = {
              key: draggingNode.key,
              label: draggingNode.label,
            };
          // console.log(ParentData,"ParentDataParentDataParentData");
          // console.log(childrenData,"childrenDatachildrenDatachildrenData");
          this.fnwebEdior.setParent(ParentData, childrenData);
        }
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      //树状图 ：拖拽时判定目标节点能否被放置
      // console.log(dropNode.data.isCanAccept,draggingNode.data.isCanMove)
      // console.log(dropNode.level);
      if (dropNode.data.isCanAccept == true) {
        // && draggingNode.data.isCanMove == true
        return true;
      } else {
        return false;
      }
    },
    allowDrag(draggingNode) {
      //树状图 ：判断是否可以拖拽
      // console.log(draggingNode,"draggingNodedraggingNodedraggingNodedraggingNodedraggingNodedraggingNode");
      return draggingNode.data.isCanMove;
    },
    bounced_shYn(data) {
      //点击新建场景，打开场景时，页面出现弹框选择  是否当前已编辑场景 true or false 弹框
      console.log("打开");
      console.log(data);
      if (data.changj == "打开场景") {
        this.openNI = data.opendataNI;
      } else if (data.changj == "新建场景") {
        this.dragDropList = {};
        this.echartsDatalist = [];
        this.CP_scenario("场景编辑器");
        this.CPr_switch("属性检查器");
        this.openNI = {};
      }
      this.Zindex = this.Zindex + 1;
      this.saveScence = true;
      this.saveScen_sh = false;
      this.kindheader = data;
    },
    FB_panel(data) {
      if (data == false) {
        this.$nextTick(() => {
          console.log("新建场景");
          this.openNI = {};
          this.manageitemdata = {};
        });
      }
    },
    sceneRUL_shYn(data) {
      //打开场景，页面显示新建链接按钮的数据传输
      console.log(data);
      this.New_srcbtnlist = [];
      this.$nextTick(() => {
        this.New_srcbtnlist = data;
      });
    },
    bounced_shopen(data) {
      //场景名称与说明
      this.openNI = data;
    },
    bounced_shYnend(data) {
      //弹框是否点击
      this.saveScence = false;
      this.judgesaveing = data;
      if (data == "yes") {
        this.saveScen_sh = false;
        setTimeout(() => {
          this.Zindex = this.Zindex + 1;
          this.saveScen_sh = true;
        });
      } else if (data == "no") {
        if (this.kindheader.changj == "打开场景") {
          console.log(3333);
          this.fnwebEdior.loadServerScene(this.kindheader.data);
        } else if (this.kindheader.changj == "新建场景") {
          console.log("新建场景");
          this.fnwebEdior.createScene();
          var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
          if (newSceneData) {
            newSceneData.scene3D.sceneData.echarts = [];
          }
          console.log(newSceneData);
          localStorage.setItem("sceneData", JSON.stringify(newSceneData));
        }
        if (this.comebacked == true) {
          let login_3 = true;
          let host = location.host;
          this.$router.push({
            path: "/manage",
            query: { login_3: login_3, type: "reload" },
          });
          // location.reload();
        }
      }
    },
    No_change(data) {
      //小面板修改数据取消
      this.definePanel_sh = false;
      setTimeout(() => {
        this.Zindex = this.Zindex + 1;
        this.definePanel_sh = true;
      });
    },
    clickselect(data) {
      //事件组件，点击事件勾选
      console.log(data);
      console.log(this.treedata);
      console.log(this.delettreeLID);
      for (var i = 0; i < this.treedata.length; i++) {
        if (this.treedata[i].id == this.delettreeLID) {
          // $('.el-tree-node:eq('+i+') .element-icon').addClass('icon-camerae')
          // this.treedata[i].className = "element-icon icon-camerae tree-icon";  // 0810 修改，不用更改模型的图标
          // console.log(this.treedata);
        }
      }
    },
    save_refresh(data) {
      //小面板创建保存成功,data为事件组件是否显示
      console.log(data);
      if (data == true) {
        if (this.incidentcomp == true) {
          this.incidentcomp = false;
          setTimeout(() => {
            this.incidentcomp = true;
          });
        }
      }
      this.definePanel_sh = false;
    },
    convertAction() {
      // 用于拼接场景里的 vrkey
      var data = JSON.parse(localStorage.getItem("sceneData"));
      // console.log(data);
      var objects = data.scene3D.object;
      var action = data.actions;
      var warningItem = {
        datas: [],
        id: "mechinewarningstatePanel",
      };
      action[0].datas = [];
      for (var i = 0; i < objects.length; i++) {
        if (objects[i].DefaultName.indexOf("floor") < 0) {
          var machineNum = objects[i].Name;
          objects[i].modelContent.data.filter((data) => {
            if (data.ModelChildrenMechineType != null) {
              var machineType = data.ModelChildrenMechineType;
              // if(machineNum.indexOf('T') == 0){
              //     machineNum = '';
              // }
              if (machineType != null) {
                var vrkey = machineNum + "-" + machineType + "-" + "运行状态";
                var warningVrkey =
                  machineNum + "-" + machineType + "-" + "机器状态信息";
                var dataPoint = { vrkey: vrkey, value: 0 };
                var warningdataPoint = { vrkey: warningVrkey, value: 0 };
                warningItem.datas.push(warningdataPoint);
                action[0].datas.push(dataPoint);
              }
            }
          });
        }
      }
      console.log(action);
      action.filter((actions) => {
        return actions.id != "mechinewarningstatePanel";
      });
      action.push(warningItem);
      console.log(action);
      var newSceneData = JSON.parse(localStorage.getItem("sceneData"));
      if (newSceneData) {
        if (newSceneData.actions !== "" || null || undefined) {
          newSceneData.actions = action;
        }
      }
      localStorage.setItem("sceneData", JSON.stringify(newSceneData));
    },
    setdragDropList(data, key) {
      //新建echarts
      // console.log(data, key , '111111');
      this.$set(this.dragDropList, key, data);
      this.CP_Echarts = true;
      // this.dragDropList[key] = data
      // console.log(this.dragDropList, 'dragDropListdragDropListdragDropList');
      let E_Width = $("#viewport").width() / 3;
      let E_height = $("#viewport").height() / 4;
      // console.log(E_height);
      $(".vr_div .chartG_box").css("min-height", E_height + "px");
      // console.log(itemval,arrlast);
      this.$nextTick(() => {
        if (data == "line") {
          $(".vr_div .chartG_box[data-id='echart" + key + "']").css({
            top: E_height + "10",
            right: "10px",
          });
        } else if (data == "bar") {
          $(".vr_div .chartG_box[data-id='echart" + key + "']").css({
            top: "20px",
            right: "10px",
          });
        } else if (data == "pie") {
          $(".vr_div .chartG_box[data-id='echart" + key + "']").css({
            top: E_height * 2 + "10",
            right: "10px",
          });
        }
        this.openDrag(this.dragDropList); // 开启拖拽
      });
    },
    openDrag(dragDropList) {
      //拖拽echarts
      console.log(dragDropList, "dragDropListdragDropListdragDropList");
      let keys = Object.keys(dragDropList);
      // console.log(keys);
      // let echartsData = this.echartsData
      let that = this;
      setTimeout(() => {
        let timeout;
        for (let i = 0; i < keys.length; i++) {
          echartsDrag("vr_div", keys[i], (res) => {
            if (res.id && res.id.indexOf("echart") >= 0) {
              // console.log(this.echartsData);
              console.log(res, 1111111111111);
              // if (res.id) this.$refs[res.id][0].Ereset(this.echartsData) // 调用子组件方法
              // let top = $(".vr_div .chartG_box[data-id='"+ res +"']").offset().top;
              // let left = $(".vr_div .chartG_box[data-id='"+ res +"']").offset().left;
              // console.log(width, height)
              // if(timeout) clearTimeout(timeout)
              // let timeout = setTimeout(()=>{
              // let echartsData = that.echartsData;
              let echartsData = JSON.parse(
                localStorage.getItem("ys-echartsData")
              );
              echartsData.miniAttribute
                ? echartsData.miniAttribute
                : (echartsData.miniAttribute = {});
              if (res.type == "drag") {
                // 更新定位信息
                echartsData.miniAttribute.position
                  ? echartsData.miniAttribute.position
                  : (echartsData.miniAttribute.position = {});
                echartsData.miniAttribute.position
                  ? (echartsData.miniAttribute.position.x = parseInt(res.left))
                  : "";
                echartsData.miniAttribute.position
                  ? (echartsData.miniAttribute.position.y = parseInt(res.top))
                  : "";
              }
              if (res.type == "coor") {
                // 更新宽高

                let width = $(
                  ".vr_div .chartG_box[data-id='" + res.id + "']"
                ).width();
                let height = $(
                  ".vr_div .chartG_box[data-id='" + res.id + "']"
                ).height();
                if (res.id) this.$refs[res.id][0].Ereset(this.echartsData); // 调用子组件方法
                console.log(width, height, 11111111111111);
                echartsData.miniAttribute.size
                  ? (echartsData.miniAttribute.size.x = parseInt(width))
                  : "";
                echartsData.miniAttribute.size
                  ? (echartsData.miniAttribute.size.y = parseInt(height))
                  : "";
              }

              console.log(echartsData);
              setTimeout(() => {
                this.echartsData = echartsData;
                console.log(this.echartsData);
                // let keys = Object.keys(list);
                // for(var i = 0;i<keys.length;i++){
                //     if(this.dragDropList[i+1].miniID === echartsData.miniID){
                //         this.dragDropList[i+1] = echartsData;
                //     }
                // }
                let datas = {
                  key: this.clickkey,
                  data: echartsData,
                };
                this.saveEch_fn(datas);
              }, 50);
              localStorage.setItem(
                "ys-echartsData",
                JSON.stringify(echartsData)
              );
              $eventBus.$emit("echartsDatasUpdata", echartsData);
              // }, 50)
            }
          });
        }
      }, 500);
    },
    // deletechart(key){//点击删除delete中的img
    //     console.log(key);
    //     console.log(this.dragDropList);
    //     this.dragDropList.splice(key, 1);
    // },
    selects(item, key) {
      //工具栏小图标选中事件seclectli
      this.$nextTick(() => {
        for (var i = 0; i < this.toolbarlist.length; i++) {
          this.toolbarlist[i].hoversmall_sh = true;
          this.toolbarlist[i].clickE = false;
        }

        this.toolbarlist[key].hoversmall_sh = false;
        this.toolbarlist[key].clickE = !this.toolbarlist[key].clickE;
      });
      if (item == "锁定") {
        this.fnwebEdior.lockObject();
      } else {
        if (item == "暂停") {
          this.toolbarlist[4].key = "icon-play"; //./static/img/icon-play.png
          this.toolbarlist[4].name = "运行";
          this.toolbarlist[4].src = "./static/img/icon-play.png";
          this.maskLayerTF = false;
        }
        if (item == "运行") {
          this.toolbarlist[4].key = "icon-suspended";
          this.toolbarlist[4].name = "暂停";
          this.toolbarlist[4].src = "./static/img/icon-suspended.png";
          this.maskLayerTF = true;
          let BGdata = {}; // 请求参数
          this.$http(
            this.httpdata.StyleFileManagementService +
              "/StyleFile-Management-Service/getStyleSettings/test/miniplane",
            BGdata,
            "get"
          )
            .then((res) => {
              // 请求小面板里面已有的样式小图标
              let getSttleData = res.data;
              console.log(getSttleData);
              localStorage.setItem("miniPanel", getSttleData);
            })
            .catch((res) => {});
          var JsonData = JSON.parse(localStorage.getItem("sceneData"));
          var type = "test";
          var name = "defaultData";
          this.$http(
            this.httpdata.DataFilesManagementService +
              "/DataFiles-Management-Service/updateDataFileSettings/" +
              type +
              "/" +
              name +
              "/JsonData",
            JsonData.actions,
            "POST"
          )
            .then((res) => {
              // console.log(res);
              // 同时将数据的配置文件发送到服务器
              if (!!window.EventSource) {
                //判断浏览器是否支持SSE
                var clientid = "cb33feb3-fe5f-cdd7-5009-afa43e5e9fac"; //客户端ID,最好用uuid
                var source = new EventSource(
                  this.httpdata.ResourceManagementService +
                    "/Data-Interface-Service/Connect/test/defaultData/" +
                    clientid
                ); //数据接口对象
                source.addEventListener("message", function (e) {
                  let data = JSON.parse(e.data);
                  console.log(data);
                  window.$eventBus.$emit("getRealDatas", data);
                }); //注册接收数据方法
                source.addEventListener(
                  "open",
                  function (e) {
                    console.log("连接打开.");
                  },
                  false
                ); //注册连接成功回调方法
                source.addEventListener(
                  "error",
                  function (e) {
                    if (e.readyState == EventSource.CLOSED) {
                      console.log("连接关闭");
                    } else {
                      console.log(e.readyState);
                    }
                  },
                  false
                ); //注册服务器连接失败方法
                source.addEventListener(
                  "close",
                  function (e) {
                    source.close();
                  },
                  false
                ); //注册服务器关闭连接方法
                window.onunload = function () {
                  $.ajax({
                    type: "POST",
                    url:
                      this.httpdata.ResourceManagementService +
                      "/Data-Interface-Service/Close/test/defaultData/" +
                      clientid,
                    data: "",
                    dataType: "json",
                    crossDomain: true,
                    success: function (jsonResult) {},
                  }); //主动与服务器断开连接
                };
              } else {
                console.log("该浏览器不支持SSE");
              }
            })
            .catch((res) => {}); // this.fnwebEdior.playScene();
        }
        if (item == "位移") {
          this.fnwebEdior.changeToTranslate();
        }
        if (item == "旋转") {
          this.fnwebEdior.changeToRotation();
        }
        // if(item == '定位'){
        // if(!this.toolbarlist[key].clickE){
        //     this.fnwebEdior.getFocusObject(this.treeclickD,-1);
        // }
        // }
        if (this.toolbarlist[2].clickE == true) {
          this.toolbarlist[2].hoversmall_sh = false;
        } else {
          this.toolbarlist[2].hoversmall_sh = true;
        }
      }
    },
    smallon(item, key) {
      //工具栏小图标hover事件
      this.toolbarlist[key].hoversmall_sh = false;
    },
    small(item, key) {
      //工具栏小图标hoverLeavl事件;
      if (!this.toolbarlist[key].clickE) {
        this.toolbarlist[key].hoversmall_sh = true;
      }
    },
    vrtit(item, key) {
      //点击vr3d 上面tit 触发的点击方法
      console.log(item, key);
    },
    resourceschoose(name, index) {
      //VR资源点击选择
      console.log(name, index);
    },
    search_ZY() {
      //点击资源搜索输入框
      setTimeout(() => {
        console.log(this.VR_research);
        let arrResourceslist = this.arrResourceslist,
          arr = [];
        if (this.VR_research == "") {
          this.resourceslist = arrResourceslist;
          return;
        }
        for (let i = 0; i < arrResourceslist.length; i++) {
          // console.log(arrResourceslist[i].name.indexOf(this.VR_research), arrResourceslist[i].name)
          if (arrResourceslist[i].name.indexOf(this.VR_research) >= 0) {
            arr.push(arrResourceslist[i]);
          }
        }
        this.resourceslist = arr;
      }, 50);
    },
    CP_scenario(item) {
      //场景编辑器点击方法
      if (item == "场景编辑器") {
        $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(0)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CP_Echarts_select = false;
        this.CP_scenario_select = true;
        this.CP_Echarts_btn = false;
        this.CP_icon = false;
      } else if (item == "图表库") {
        $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(1)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CP_Echarts_select = true;
        this.CP_scenario_select = false;
        this.CP_Echarts_btn = false;
        this.CP_icon = false;
      } else if (item == "链接管理") {
        $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(2)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CP_Echarts_select = false;
        this.CP_scenario_select = false;
        this.CP_Echarts_btn = true;
        this.CP_icon = false;
      } else if (item == "标签管理") {
        $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(3)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CP_Echarts_btn = false;
        this.CP_Echarts_select = false;
        this.CP_scenario_select = false;
        this.CP_icon = true;

        //  $(".CP_scenario .CPr_left_ul .CPr_left_li:eq(3)").addClass('CPr_left_select').siblings().removeClass('CPr_left_select');
        // this.CP_Echarts_select = false;
        // this.CP_scenario_select = false;
        // this.CP_Echarts_btn = true;
      }
    },
    CPr_switch(item) {
      //属性检查器，新增样式切换
      if (item == "属性检查器") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(0)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CPr_contDiv = true;
        this.CPr_newStyle = false;
        this.CPr_basis = false;
        this.CPr_Hostriy = false;
        this.CPr_selectIcon_show = false;
      } else if (item == "图表设置") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(1)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CPr_contDiv = false;
        this.CPr_newStyle = true;
        this.CPr_basis = false;
        this.CPr_Hostriy = false;
        this.chartsEditor_sh = true;
        this.CPr_selectIcon_show = false;
      } else if (item == "基础设置") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(3)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CPr_contDiv = false;
        this.CPr_newStyle = false;
        this.CPr_basis = true;
        this.CPr_Hostriy = false;
        this.CPr_selectIcon_show = false;
      } else if (item == "历史记录") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(4)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CPr_contDiv = false;
        this.CPr_newStyle = false;
        this.CPr_basis = false;
        this.CPr_Hostriy = true;
        this.CPr_selectIcon_show = false;
      } else if (item == "链接设置") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(2)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");

        this.CPr_contDiv = false;
        this.CPr_newStyle = true;
        this.CPr_basis = false;
        this.CPr_Hostriy = false;
        this.CPr_selectIcon_show = false;
      } else if (item == "标签设置") {
        $(".CPr_left .CPr_left_ul .CPr_left_li:eq(5)")
          .addClass("CPr_left_select")
          .siblings()
          .removeClass("CPr_left_select");
        this.CPr_contDiv = false;
        this.CPr_newStyle = false;
        this.CPr_basis = false;
        this.CPr_Hostriy = false;
        this.CPr_selectIcon_show = true;
      }
    },
    EX_effect(item) {
      //属性选择器，隐藏
      console.log(item);
      let that = this;
      if (item == "属性") {
        this.openattribute = true;
        $(".CPr_left").animate({ width: "0%" }, 1000, function () {
          $(this).hide();
          that.effect_SX = false;
        });
      }
    },
    backplayCpr() {
      //点击 属性 显示
      $(".CPr_left").show();
      let that = this;
      this.effect_SX = true;
      $(".CPr_left").animate({ width: "60%" }, 1000, function () {
        that.openattribute = false;
      });
    },
    polesplay(data) {
      //点击侧边栏tit上面的小图表  三
      console.log(date);
    },
    slideWidth() {
      //拖拽改变div的width宽度
      let Timeout;
      let move = false,
        pageX = 0;
      $(".cp-coor").on("mousedown", function (e) {
        move = true;
      });
      let that = this;
      $(document)
        .mousemove(function (e) {
          if (move) {
            let bodyWidth = $("body").width(); // 获取body宽度
            let pageX = bodyWidth - e.pageX;
            // let width = 100-(pageX/flexBox * 100);
            $(".CProperties").css("width", pageX + "px");
            // console.log(e.pageX, 'e.pageX', pageX)
            that.fnwebEdior.onContainerResize();

            $("#viewport canvas").width("100%");
            // }, 100)
          }
        })
        .mouseup(function (e) {
          move = false;
          pageX = 0;
        });
    },
    slideHeight() {
      let move = false,
        pageX = 0,
        that = this;
      $(".slider").on("mousedown", function (e) {
        move = true;
      });
      $(document)
        .mousemove(function (e) {
          if (move) {
            let Dragdrop = $(".TD_tit").height(); // 获取父高度
            // let toolbar = $('.toolbar').width(); // 获取左侧导航宽度
            var header = $("header") ? $("header").height() : 0; // 获取顶部导航高度
            let pageY = e.pageY - header - 20;
            let height = (pageY / Dragdrop) * 100;
            $(".TD_bottom").css(
              { height: 100 - height + "%" },
              { "min-height": "200px" }
            );
            $(".TD_top").css("height", height + "%");
            $("#viewport canvas").height("100%");
            that.fnwebEdior.onContainerResize();
          }
        })
        .mouseup(function (e) {
          move = false;
          pageX = 0;
        });
    },
    addever() {
      //资源管理器添加内容按钮  +
    },
  },
  created() {
    $eventBus.$on("labelList", (msg) => {
        console.log(msg);
      this.tabList = msg;
    
    });
  },
  mounted() {
    this.getTagType(); //调用获取标签类型的方法
    $("body").on("click", () => {
      //点击任意位置，删除隐藏弹框隐藏
      if (this.Rightclick_sh == true) {
        this.Rightclick_sh = false;
      }
    });
    let gbdefultdata = {};
    this.$http("./static/api/api.json", gbdefultdata, "get")
      .then((data) => {
        // 请求本地，背景名称
        this.httpdata = data.baseroot;
        // console.log(this.httpdata);
        this.resourcesimgSrc =
          this.httpdata.ResourceManagementService + this.resourcesimgSrc;
        let data1 = {};
        this.$server
          .resourcesList()
          .then((data) => {
            console.log(data.data.data);
            // this.$http(this.httpdata.ResourceManagementService+'/Resource-Management-Service/getResourceSettings/test',data1,  'get').then((res) => {// 请求资源管理数据
            this.ziyuandata = data.data.data;
            let srclist = this.ziyuandata;
            console.log(this.ziyuandata);
            this.resourceslist = this.ziyuandata;
            this.arrResourceslist = this.ziyuandata;
          })
          .catch((res) => {});
        let datashu = {};
        // this.$http(this.httpdata.DataitemFileManagementService+"/DataitemFile-Management-Service/getDataitemSettings/test/MachineStateItems",datashu,'get').then((res) => {// 请求成功回调 res 结果
        //     let data;
        //     data = JSON.parse(res.data);
        //     // console.log(data);
        //     this.shudata = data[0].name;
        //     // this.treedata
        // }).catch((res)=>{});
      })
      .catch((res) => {});
    this.loading(100);
    this.hashTable = new HashTable();
    let login_3 = this.$route.query.login_3;
    this.slideWidth(); // 滑动左右div大小
    this.slideHeight(); // 滑动上下div大小
    // this.webEdior = webEdior();          // 初始化三维对象
    let that = this;
    that.fnwebEdior = webEdior(function (res) {
      console.log(res, "resres");
      if (res.type == "positionxyz") {
        //点击3D图方法
        if (res.data != null) {
          that.moduleXYZ(res.data); //执行点击3D，拿到数据输入框
        }
      }
    });
    that.treedata = that.fnwebEdior.objectTree().treeData; //这里拿到treedata
    that.treeid = that.fnwebEdior.objectTree().ID;
    that.chlidtreeid = that.fnwebEdior.objectTree().childID;
    that.materialList = [];
    $eventBus.$on("sourceTree", (res) => {
      that.treedata = res.treeData;
      that.treeid = res.ID;
      that.chlidtreeid = res.childID;
      that.materialList = res.material;
      that.hisDatalist = res.history;
      // console.log(that.treeid);
      that.Rightclick_sh = res.isRightButtonClick;
      that.goondata = res.loaded;
    });
    // 收起、展开新建链接
    $(".newsrc_btn").on("click", ".switch", function () {
      if ($(this).data("switch")) {
        // 展开
        $(this).data("switch", 0);
        $(this).find(".image1").show().siblings().hide();
        $(this)
          .nextAll(".newsrc_btn-box")
          .find("div")
          .animate({ left: `0px` }, 500);
      } else {
        // 收起
        $(this).data("switch", 1);
        $(this).find(".image2").show().siblings().hide();
        let width = $(this).nextAll(".newsrc_btn-box").width();
        console.log(width, "width");

        $(this)
          .nextAll(".newsrc_btn-box")
          .find("div")
          .animate({ left: `-${width}px` }, 500);
      }
    });
    setTimeout(() => {
      localStorage.setItem("echarts", "");
      this.echartsData = {};
      this.optenScene();
    }, 500);
  },
};
</script>
<style lang="less" scoped>
.index {
  .flex {
    display: flex;
    width: 97.16%;
    overflow: hidden;
  }
  width: 100%;
  min-width: 1280px;
  height: 100%;
  // position: relative;
  min-height: 720px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
  header {
    position: relative;
    width: 100%;
    min-width: 1280px;
    height: 4%;
    min-height: 40px;
    display: flex;
    background: #242424;
    .logo {
      width: 212px;
      height: 32px;
      margin: 0;
      padding: 0;
      margin-left: 15px;
      line-height: 39px;
      img {
        width: 230px;
        height: 32px;
      }
    }
    .comenack {
      position: absolute;
      right: 20px;
      top: 12px;
      display: inline-block;
      width: 18px;
      height: 19px;
      line-height: 19px;
      text-align: center;
      color: #fff;
      background: url("../assets/image/index-tc.png") no-repeat;
      background-size: cover;
      background-position: center;
      z-index: 99;
    }
    .comenack:hover {
      background: url("../assets/image/index-tc-2.png") no-repeat;
      background-size: cover;
      background-position: center;
    }
  }
  .content {
    display: flex;
    width: 100%;
    min-width: 1280px;
    height: 96.1%;
    min-height: 678px;
    display: flex;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    .TD_tit {
      // width: 79.2%;
      flex: 1;
      min-width: 950px;
      height: 100%;
      box-sizing: border-box;
      .TD_top {
        width: 100%;
        display: flex;
        height: 70%;
        // max-height: 70%;
        box-sizing: border-box;
        overflow: hidden;
        .CP_scenario {
          flex: 1;
          position: relative;
          width: 261px;
          min-width: 261px;
          border: 1px solid #000000;
          border-right: none;
          border-bottom: none;
          box-sizing: border-box;
          background: #383838;
          overflow: hidden;
          .CP_scenario_tit {
            width: 100%;
            height: 29px;
            line-height: 29px;
            font-size: 12px;
            background: #2d2d30;
            color: aliceblue;
            box-sizing: border-box;
            img {
              width: 17px;
              height: 17px;
              margin-left: 74px;
              margin-right: 6px;
            }
          }
          // .addzu{
          //     color: #fff;
          //     margin-left: 44px;
          //     margin-top: 2px;
          //     font-size: 16px;
          // }
          .content {
            min-width: 216px;
          }
          .CPr_content {
            width: 100%;
            margin-top: 6px;
          }
          .CPr_Econtent,
          .CPr_Econtent_btn {
            margin-left: 3px;
            ul {
              height: 45%;
              p {
                color: #0096ff;
                font-size: 14px;
              }
              li {
                width: 100%;
                min-width: 210px;
                height: 32px;
                line-height: 32px;
                display: flex;
                p {
                  color: #fff;
                  font-size: 14px;
                }
                .CPr_Econtent_left {
                  width: 68%;
                  height: 32px;
                  line-height: 32px;
                  span {
                    display: inline-block;
                    margin-left: 8px;
                    margin-right: 8px;
                    img {
                      width: 17px;
                      height: 17px;
                      vertical-align: -3px;
                    }
                  }
                  input {
                    width: 120px;
                    height: 22px;
                    padding-left: 5px;
                    font-size: 12px;
                    color: #fff;
                    background: #272727 !important;
                    border: 1px solid #272727;
                    border-radius: 2px;
                    box-sizing: border-box;
                  }
                }
                .CPr_Econtent_right {
                  margin-left: 16px;
                  span:nth-child(1) {
                    display: inline-block;
                    margin-right: 4px;
                    margin-top: 2px;
                    .icon_show_fff {
                      display: inline-block;
                      width: 20px;
                      height: 13px;
                      line-height: 20px;
                      // padding-top: 3px;
                      background: url("../assets/image/icon_show.png") no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                    }
                    .icon_show_fff:hover {
                      width: 20px;
                      height: 13px;
                      background: url("../assets/image/icon_show_H.png")
                        no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                    }
                    .icon_hide_fff {
                      display: inline-block;
                      width: 20px;
                      height: 10px;
                      line-height: 20px;
                      background: url("../assets/image/icon_hide.png") no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                      // vertical-align:-3px;
                    }
                    .icon_hide_fff:hover {
                      width: 20px;
                      height: 10px;
                      background: url("../assets/image/icon_hide_H.png")
                        no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                    }
                  }
                  span:nth-child(2) {
                    .icon_delete_fff {
                      display: inline-block;
                      width: 17px;
                      height: 18px;
                      background: url("../assets/image/icon_delete.png")
                        no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                      vertical-align: -2px;
                    }
                    .icon_delete_fff:hover {
                      background: url("../assets/image/icon_delete_H.png")
                        no-repeat;
                      background-size: 100% 100%;
                      background-position: 100% 100%;
                    }
                  }
                }
              }
              li:hover {
                background: rgba(56, 55, 55, 1);
              }
              .CPr_EcontentliH {
                background: rgba(56, 55, 55, 1);
              }
            }
          }
          .CPr_left_li {
            width: 75px;
            min-width: 60px;
          }
          .CPr_left_liEC {
            width: 50px;
            min-width: 55px;
            border-left: none;
          }
          .CPr_left_href {
            width: 70px;
          }
          .foldingHide {
            position: absolute;
            top: 30px;
            right: 8px;
          }
        }
        .TD_con {
          position: relative;
          width: 84%;
          .vrd_shadow {
            position: absolute;
            left: 0;
            top: 0;
            width: 22px;
            height: 100%;
            background: rgba(45, 45, 48, 0.6);
            z-index: 9;
          }
          .toolbar {
            width: 100%;
            // height: 100%;
            height: 28px;
            min-height: 28px;
            line-height: 28px;
            background: #3e3e42;
            border: 1px solid #000;
            border-top: none;
            border-bottom: none;
            box-sizing: border-box;
            .toolbarimg {
              width: 100%;
              height: 100%;
              li {
                display: inline-block;
                position: relative;
                width: 6%;
                height: 28px;
                text-align: center;
                img {
                  width: 16px;
                  height: 16px;
                }
                .mytitlebox {
                  position: absolute;
                  height: 100%;
                  width: 100%;
                  top: 0px;
                  left: 0px;
                }
                .mytitle {
                  display: none;
                  position: absolute;
                  top: 29px;
                  left: 40px;
                  width: 60px;
                  line-height: 20px;
                  color: #000;
                  max-width: 160px;
                  font-size: 14px;
                  padding: 4px;
                  background: rgba(255, 255, 255, 0.8);
                  border: solid 1px #000;
                  border-radius: 4px;
                  z-index: 2;
                }
                &:hover .mytitle {
                  display: block;
                }
              }
              li:first-child {
                margin-left: 20px;
              }
            }
            // .install{
            //     width: 100%;
            //     height: 6%;
            //     text-align: center;
            //     img{
            //         width: 30px;
            //         height: 28px;
            //     }
            // }
          }
          .nav_ul {
            // display: flex;
            height: 31px;
            width: 100%;
            margin: 0;
            padding: 0;
            background: #2d2d30;
            cursor: pointer;
            border: 1px solid #000;
            // border-left: none;
            box-sizing: border-box;
          }
          .vr_3d {
            // width: 73%;
            flex: 1;
            position: relative;
            min-width: 600px;
            height: 92%;
            min-height: 420px;
            background: #383838;
            box-sizing: border-box;
            // border-left: 2px solid hsl(0, 0%, 27%);
            box-sizing: border-box;
            overflow: hidden;
            #viewport {
              width: 100%;
              height: 100%;
            }
            .vr_div {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: 1px solid #000;
              box-sizing: border-box;
              overflow: hidden;
              .chartG_box {
                position: absolute;
                top: 10px;
                left: 20px;
                width: 25.6%;
                height: 25.4%;
                z-index: 1;
                .img {
                  width: 100%;
                  height: 100%;
                }
              }
              .newsrc_btn {
                position: absolute;
                bottom: 5px;
                left: 22px;
                display: flex;
                .switch {
                  margin-left: 1px;
                  margin-right: 6px;
                  img {
                    width: 30px;
                    height: 30px;
                  }
                }
                .newsrc_btn-box {
                  overflow: hidden;
                  div {
                    position: relative;
                  }
                }
                span {
                  display: inline-block;
                  // width: 80px;
                  height: 30px;
                  margin-right: 6px;
                  button {
                    // width: 60px;
                    height: 30px;
                    padding: 0 5px;
                    border: none;
                    color: #fff;
                    font-size: 14px;
                    background: #0096ff;
                    border-radius: 5px;
                  }
                }
              }
            }
          }
        }
      }
      .TD_bottom {
        position: relative;
        width: 100%;
        height: 30%;
        min-height: 200px;
        .VR_resources {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          min-height: 200px;
          border: 1px solid #000;
          border-top: 1px solid #000;
          box-sizing: border-box;
          background: #252526;
          .slider {
            height: 4px;
            width: 100%;
            background: #3e3e42;
            cursor: n-resize;
          }
          .VR_reTitle {
            position: relative;
            width: 100%;
            height: 30px;
            line-height: 26px;
            padding-left: 9px;
            // background: url("../../static/img/index-1.png");
            background: #3e3e42;
            background-size: cover;
            color: #fff;
            font-size: 12px;
            border-bottom: 1px solid #000;
            box-sizing: border-box;
            input {
              position: absolute;
              top: 0px;
              right: 55px;
              width: 326px;
              height: 25px;
              padding-left: 6px;
              border: none;
              border-radius: 3px;
              background: #2d2d30;
              font-size: 12px;
              line-height: 25px;
            }
            .imgsearch {
              width: 15px;
              height: 15px;
              top: 7px;
              right: 60px;
              position: absolute;
              background: url("../../static/img/serach.png") no-repeat;
              background-position: 98% 50%;
            }
            .spanP {
              img {
                width: 22px;
                height: 19px;
                margin-left: 68px;
                margin-right: 8px;
                vertical-align: -3px;
              }
            }
            .addever {
              display: inline-block;
              width: 14px;
              height: 14px;
              margin-left: 62px;
              vertical-align: 1px;
              img {
                width: 14px;
                height: 14px;
              }
            }
          }
          .VR_reConte {
            width: 100%;
            height: 86.7%;
            display: flex;
            box-sizing: border-box;
            // overflow: hidden;
            ul {
              width: 84%;
              height: 100%;
              display: flex;
              flex-wrap: wrap;
              overflow-y: auto;
              &::-webkit-scrollbar {
                width: 4px;
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
                background-color: #525050;
                /*滚动条的背景颜色*/
              }
              /*定义滑块 内阴影+圆角*/
              &::-webkit-scrollbar-thumb {
                width: 4px;
                /*滚动条宽度*/
                height: 26px;
                /*滚动条高度*/
                border-radius: 2px;
                /*滚动条的圆角*/
                box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
                background-color: #8c8c8c;
                /*滚动条的背景颜色*/
              }
              li {
                width: 106px;
                height: 107px;
                margin-top: 18px;
                margin-left: 20px;
                background: rgba(47, 47, 47, 1);
                border: 1px solid rgba(0, 0, 0, 1);
                border-radius: 3px;
                text-align: center;
                .img {
                  width: 64px;
                  height: 64px;
                  margin-top: 8px;
                  margin-left: 21px;
                }
                span {
                  display: inline-block;
                  white-space: nowrap;
                  width: 100%;
                  text-align: center;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              li:hover {
                border: 1px solid rgba(0, 164, 255, 1);
              }
            }
            .addlist {
              width: 261px;
              min-width: 261px;
              height: 100%;
              border-right: 1px solid #000;
            }
          }
        }
      }
    }
    .Drag-drop {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding-top: 26px;
      box-sizing: border-box;
    }
    .CProperties {
      //470px;
      position: relative;
      width: 19%;
      min-width: 321px;
      height: 100%;
      display: flex;
      background: #383838;
      color: #a0a0a0;
      border: 1px solid #000000;
      border-left: none;
      box-sizing: border-box;
      overflow: hidden;
      .cp-coor {
        position: absolute;
        height: 100%;
        width: 5px;
        top: 0;
        left: 0;
        cursor: w-resize;
        z-index: 999;
      }
    }
    .CPr_left {
      position: relative;
      width: 99%;
      min-width: 321px;
      .CPr_content {
        min-width: 321px;
        .Hisdata {
          width: 100%;
          height: 100%;
          .ptit {
            width: 90%;
            height: 4%;
            margin-left: 15px;
            line-height: 40px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
          ul {
            width: 100%;
            height: 96%;
            box-sizing: border-box;
            li {
              width: 100%;
              position: relative;
              padding-left: 15px;
              height: 30px;
              line-height: 30px;
              box-sizing: border-box;
              color: rgba(255, 255, 255, 1);
              span {
                margin-left: 3px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
              }
              img {
                margin-left: 30px;
              }
              input[type="checkbox"] {
                position: absolute;
                left: 15px;
                top: 7px;
                width: 15px;
                height: 15px;
                opacity: 0;
                z-index: 2;
              }
              label {
                position: absolute;
                left: 15px;
                top: 7px;
                width: 15px;
                height: 15px;
                border-radius: 3px;
                border: 1px solid #999;
              }
              input:checked + label {
                background-color: #006eb2;
                border: 1px solid #006eb2;
              }
              input:checked + label::after {
                position: absolute;
                content: "";
                width: 5px;
                height: 10px;
                left: 4px;
                top: 0px;
                border: 2px solid #fff;
                border-top: none;
                border-left: none;
                transform: rotate(45deg);
                text-align: center;
                display: block;
                color: white;
              }
            }
            .gary {
              color: #999999;
            }
            li:hover,
            .Hisselect {
              background: rgba(75, 75, 76, 1);
            }
            li {
              position: relative;
              .rightshow {
                position: absolute;
                top: 15px;
                left: 120px;
                width: 132px;
                height: 60px;
                padding: 0;
                margin: 0;
                background: rgba(194, 194, 194, 1);
                box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.35);
                z-index: 5;
                p {
                  height: 30px;
                  padding-left: 10px;
                  line-height: 30px;
                  color: #333333;
                }
                p:hover,
                .pselect {
                  color: #ffffff;
                  background: rgba(0, 164, 255, 1);
                }
              }
            }
          }
        }
      }
      #maskLayer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        line-height: 900px;
        font-size: 22px;
        color: #fff;
        z-index: 222222222;
      }
      .CPr_left_li {
        width: 64px;
        min-width: 60px;
      }
      .CPr_left_li:nth-child(1) {
        width: 75px;
      }
      .CPr_left_liEC {
        width: 70px;
        min-width: 55px;
        border-right: none;
      }
      .foldingHide {
        width: 80px;
        position: relative;
        border-left: 1px solid #000;
        img {
          position: absolute;
          top: 9px;
          left: 60px;
          width: 13px;
          height: 11px;
        }
      }
    }
    .CP_scenario,
    .CPr_left {
      position: relative;
      height: 100%;
      // margin-left: 4px;
      // margin-top: 2px;
      .CPr_left_ul {
        width: 100%;
        // min-width: 316px;
        height: 30px;
        display: flex;
        line-height: 30px;
        background: #2d2d30;
        border: 1px solid #000000;
        border-left: none;
        border-right: none;
        box-sizing: border-box;
        .CPr_left_li {
          height: 29px;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid #000000;
          border-top: none;
          border-left: none;
          box-sizing: border-box;
        }
        .iconplay,
        .foldingHide {
          position: absolute;
          top: 0px;
          right: 8px;
          width: 13px;
          height: 11px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .backBute {
          position: absolute;
          right: 10px;
          top: 0px;
          width: 14px;
          height: 7px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .EX_effect {
          position: absolute;
          right: 40px;
          top: 0px;
          width: 13px;
          height: 7px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        // .
        .CPr_left_select {
          background: #383838;
          color: #fff;
          border: none;
          border-right: 1px solid #000;
        }
      }
      .CPr_content {
        width: 100%;
        height: 93.7%;
        background: #383838;
        overflow: hidden;
        overflow-y: auto;
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
          background-color: rgba(0, 0, 0, 0.2);
          /*滚动条的背景颜色*/
        }
        .CPr_contDiv {
          width: 100%;
          min-width: 326px;
          height: 100%;
          overflow: hidden;

          .CPr_contDiv_ul {
            width: 100%;
            height: 100%;
          }
        }
        .CPr_newStyle {
          width: 100%;
          min-width: 326px;
          height: 100%;
          overflow: hidden;
          box-sizing: border-box;
          overflow-y: auto;
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
        }
      }
    }
  }
  .show {
    display: block;
  }
  .hide {
    display: none;
  }
  .inputseclect {
    p {
      input {
        border: 1px solid #00a4ff !important;
      }
    }
  }
  .Rightclick {
    position: absolute;
    top: 500px;
    left: 500px;
    width: 122px;
    height: 60px;
    text-align: left;
    color: #333333;
    font-size: 12px;
    background: #c2c2c2;
    li {
      height: 30px;
      padding-left: 20px;
      line-height: 30px;
    }
    li:hover,
    .RC_select {
      background: #00a4ff;
      color: #ffffff;
    }
  }
}
.And-not {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  p {
    position: absolute;
    top: 415px;
    left: 864px;
    width: 110px;
    height: 60px;
    color: antiquewhite;
    font-size: 40px;
    span {
      display: inline-block;
      width: 8px;
      height: 40px;
      border-radius: 4px;
      background: lightgreen;
      -webkit-animation: load 1s ease infinite;
      animation: load 1s ease infinite;
    }
    @keyframes load {
      0%,
      100% {
        height: 40px;
        background: lightgreen;
      }
      50% {
        height: 70px;
        margin: -15px 0;
        background: lightblue;
      }
    }
    span:nth-child(2) {
      -webkit-animation-delay: 0.2s;
      animation-delay: 0.2s;
    }
    span:nth-child(3) {
      -webkit-animation-delay: 0.4s;
      animation-delay: 0.4s;
    }
    span:nth-child(4) {
      -webkit-animation-delay: 0.6s;
      animation-delay: 0.6s;
    }
    span:nth-child(5) {
      -webkit-animation-delay: 0.8s;
      animation-delay: 0.8s;
    }
  }
}

// 增加的Css
.CPr_biaoqian ul > li {
  width: 100%;
  height: 32px;
  // background-color: red;
  display: flex;
  align-items: center;
  position: relative;
  & > span > img {
    width: 17px;
    height: 17px;
    margin: 0 8px;
  }
  & > input {
    width: 120px;
    height: 22px;
    padding-left: 5px;
    font-size: 12px;
    color: #fff;
    background: #272727 !important;
    border: 1px solid #272727;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .list_right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 14px;
    .show {
      display: inline-block;
      width: 20px;
      height: 13px;
      line-height: 20px;
      background: url("../assets/image/icon_show.png") no-repeat;
      background-size: 100% 100%;
      background-position: 100% 100%;
      margin-right: 12px;
      &:hover {
        background: url("../assets/image/icon_show_H.png") no-repeat;
      }
    }
    .delete {
      display: inline-block;
      width: 17px;
      height: 18px;
      background: url("../assets/image/icon_delete.png") no-repeat;

      background-size: 100% 100%;
      background-position: 100% 100%;
      vertical-align: -2px;
      &:hover {
        background: url("../assets/image/icon_delete_H.png") no-repeat;
      }
    }
  }
}
.CPr_selectIcon {
  padding: 10px;
  box-sizing: border-box;
  .tag_name {
    color: #fff;
    & > input {
      margin-left: 10px;
      outline-style: none;
      border: none;
      background-color: #272727;
      padding-left: 5px;
      border-radius: 3px;
      height: 22px;
      color: #fff;
    }
  }
  .tag_coordinate {
    display: flex;
    & > span {
      color: #fff;
    }
    .coordinate {
      display: flex;
      justify-content: center;
      margin-left: 10px;
      .coordinate_x,
      .coordinate_y,
      .coordinate_Z {
        color: #fff;
        & > input {
          outline-style: none;
          border: none;
          width: 45px;
          height: 22px;
          text-align: center;
          background-color: #272727;
          color: #fff;
          border-radius: 3px;
          margin-left: 5px;
        }
      }
      .coordinate_y {
        margin: 0 20px;
      }
    }
  }
  .tag_select {
    margin: 10px 0;
  }
  .tag_select,
  .tag_style {
    & > span {
      color: #fff;
    }
    & > select {
      margin-left: 10px;
      border: none;
      border-radius: 3px;
      width: 80px;
      height: 22px;
      background-color: #272727;
      color: #fff;
    }
  }
  .tag_style {
    display: flex;
    .tag_img {
      width: 40px;
      height: 40px;
      display: block;
      margin-left: 16px;
      border-radius: 4px;
    }
    .active{
        border:1px solid red
    }
  }
}
</style>
<style lang="less">
body,
#app {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
body {
  .el-color-picker__panel {
    // position: absolute;
    // top: 326px!important;
    // left: 1591px!important;
    background: #161616;
    border: 1px solid #383838;
  }
  .el-color-dropdown {
    width: 206px;
    height: 194px;
  }
  .el-color-svpanel {
    position: relative;
    width: 180px;
    height: 160px;
    border: 1px solid rgba(64, 64, 64, 1);
    box-sizing: border-box;
    .el-color-svpanel__cursor > div {
      width: 7px;
      height: 7px;
    }
  }
  .el-color-hue-slider.is-vertical {
    width: 19px;
    height: 160px;
  }
  .el-color-dropdown__link-btn {
    width: 92px;
    height: 26px;
    background: rgba(16, 16, 16, 1);
    border: 1px solid rgba(64, 64, 64, 1);
    border-radius: 3px;
  }
  .el-color-dropdown__btns {
    position: relative;
    padding: 0;
    .el-color-dropdown__value {
      position: absolute;
      left: 77px;
      top: 0;
      width: 88px;
      margin-top: -4px;
    }
    .el-color-dropdown__link-btn {
      position: absolute;
      left: 0;
      top: 0;
      width: 68px;
      height: 28px;
      font-size: 0 !important;
      vertical-align: top;
    }
    // .el-color-dropdown__link-btn {
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    // }
  }
  .el-input--mini .el-input__inner {
    width: 88px;
    height: 28px;
    padding: 4px;
    margin-top: 4px;
    line-height: 28px;
    border-radius: 3px;
    border: 1px solid rgba(64, 64, 64, 1);
    background: none;
    // font-size: 0 !important;
  }
  .el-color-dropdown__btn {
    width: 32px;
    height: 26px;
    margin-left: 7px;
    padding: 0;
    background: rgba(16, 16, 16, 1);
    border: 1px solid rgba(64, 64, 64, 1);
    border-radius: 3px;
    vertical-align: 1px;
  }
}
.index {
  .el-tree__empty-block {
    background: #4a4a4a;
    color: #fff;
  }
  .custom-tree-node {
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .custom-tree-node .del-icon {
    // float: right;
    position: absolute;
    // right: 3px;
    left: 88%;
    top: 2px;
    z-index: 22;
    // margin-right: 3px;
    display: none;
  }
  .custom-tree-node:hover .del-icon {
    display: inline-block;
  }
  .CP_scenario {
    .CPr_content {
      .el-tree-node,
      .el-tree-node__content {
        background: #383838;
        color: #fff;
      }
      // .el-tree-node__content,.selectedtree{
      //     color: #1296DB;
      // }
      // .el-tree-node:focus > .el-tree-node__content {
      //    color: #1296DB!important;
      // }
      .el-tree-node.is-current > .el-tree-node__content {
        background: #4a4a4a;
        color: #1296db !important;
      }
      .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 4px;
      }
      .span_tit {
        position: relative;
        top: 0px;
        padding: 0;
        width: 68%;
        height: 28px;
        line-height: 28px;
        overflow: hidden;
      }
      // .icon-camerae{
      //     padding-left: 20px;
      //     color: red;
      //     font-size: 20px;
      //     z-index: 999999999999;
      // }
    }
  }
  .CPr_left {
    .CPr_content {
      .CPr_newStyle {
        .el-tree-node,
        .el-tree-node__content {
          background: #4a4a4a;
          color: #fff;
        }
      }
    }
  }
  // .el-slider__button{
  //     width:18px;
  //     height:18px;
  //     background:linear-gradient(0deg,rgba(231,227,225,1),rgba(244,241,236,1));
  //     box-shadow:0px 1px 3px 0px rgba(41,35,32,0.3);
  //     border: none;
  //     border-radius:50%;
  // }
  .el-slider {
    display: inline-block;
    width: 81%;
    height: 20px;
    z-index: 10;
  }
  .el-slider__bar {
    height: 4px;
    background-color: #0096ff;
  }
  .el-slider__runway {
    height: 4px;
    background-color: #333333;
  }
  .el-slider__button-wrapper {
    z-index: 1;
  }
  .el-slider__button {
    width: 18px;
    height: 18px;
    background-color: #e5e5e6;
    border: 4px solid #fff;
  }
  .tree-icon {
    display: inline-block;
    width: 29px;
    height: 20px;
    line-height: 20px;
    vertical-align: -2px;
    font-size: 18px;
  }
  .icon-camerag1 {
    padding-left: 4px;
    width: 25px;
    vertical-align: -1px;
    font-size: 14px;
  }
  .icon-cameraai251 {
    vertical-align: -3px;
  }
  .chartG_box {
    width: 348px;
    height: 186px;
    min-width: 300px;
    position: absolute;
    top: -300px;
    z-index: 49;
  }
  .coor {
    width: 10px;
    height: 10px;
    overflow: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    cursor: se-resize;
    z-index: 20;
  }
  .show {
    display: block;
  }
  .hide {
    display: none;
  }
}
</style>

