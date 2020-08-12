<template>
    <div class="pie_ring">
        <!-- <header class="title" >{{titlevalues}}</header> -->
        <div v-if="isEcharts" :id="eid"></div>
    </div>
</template>

<script>
import $ from 'jquery';
import echarts from 'echarts';
import commen from'@/assets/js/commen.js';
    export default {
        name: 'pie',
        mixins: [commen],
        props:["onlyid", "eid", "ekey","echartdata", "echartsListData"],
        data() {
            return{
                backgroundColor: 'rgba(0,0,0,0.5)',
                pie_ringNEI:'50%',
                pie_ringWAI:"50%",
                pie_ringdata:[
                    {value:560, name:'类别一'},
                    {value:340, name:'类别二'},
                    {value:140, name:'类别三'},
                    {value:350, name:'类别四'},
                    {value:460, name:'类别五'},
                    {value:286, name:'类别六'},
                ],
                titlevalues:'默认echarts',
                option:{},
                piedatas:[],
                pie_rings:"",
                isEcharts: true,
                titleText:"输入标题",
                peizhi_ED:{//编辑传参
                },
                Xmargin:"10",
                Ymargin:"440",
                peizhicolor:["#0386F5","#3FECFF","#4C63F2","#ED5400","#7351E3","#FF4873","#1FB5A5"],
                titFonts:"12",
                XY_fonts:"9"
            }
        },
        watch:{
            onlyid(){//实时监听父级数据的变化
            	this.isEcharts = false
            	this.$nextTick(()=>{
            		this.isEcharts = true
            		this.chulishuju();
            	})
            },
            // peizhi_ED: {
               
            //      handler(newName, oldName) {
            //         console.log(this.peizhi_ED);
            //         this.$emit('peizhiEDR', this.peizhi_ED);
            //     },
            //     immediate: true
            // }
        },
        methods:{
            callIndex (data) { // 回调index页面， data 数据， type 添加or替换 Echarts
                this.$emit('callIndex', data, this.ekey); 
            },
            Ereset (data) { // 用于重新渲染
                // console.log(data);
                if (this.echartsListData) this.peizhi_ED = this.echartsListData
                if(data !== "" && data !== undefined){
                    if(data.type == "titleText"){
                        this.titleText = data.data;
                    }
                    if(data.type == "colorKind"){//配色方案
                        if(data.data == "0"){//
                            this.peizhicolor = ["#0386F5","#3FECFF","#4C63F2","#ED5400","#7351E3","#FF4873","#1FB5A5"]
                            this.peizhi_ED.miniAttribute.stylePlan = "0";
                        }else if(data.data == "1"){
                            this.peizhicolor = ["#FF7A83","#14FF00","#4C63F2","#ED5400","#9664E8","#9CFF6E","#0CF2F7"];
                            this.peizhi_ED.miniAttribute.stylePlan = "1";
                        }else if(data.data == "2"){
                            this.peizhicolor = ["#FDD100","#14FF00","#4C63F2","#ED5400","#7351E3","#9CFF6E","#14FF00"];
                            this.peizhi_ED.miniAttribute.stylePlan = "2";
                        }
                    }
                    if(data.type == "intensity"){//文字大小
                        // console.log(data.data)
                        this.titFonts = data.data;
                        this.XY_fonts = data.data;
                        this.peizhi_ED.miniAttribute.fontSize = data.data;
                    }
                    if(data.type == "coloropacity"){//透明度
                        // console.log(data.data);
                        this.peizhi_ED.miniAttribute.opacity = data.data;
                        let valR = data.data/100;
                        console.log(valR);
                        this.backgroundColor = "rgba(0,0,0,"+valR+")";

                    }
                    if(data.type == "Xaxis"){//X轴间距
                        // this.Xmargin = data.data;
                        this.peizhi_ED.miniAttribute.position.x = data.data;
                        console.log(this.peizhi_ED);
                    }
                    if(data.type == "Yaxis"){//Y轴间距
                        // this.Ymargin = data.data;
                        this.peizhi_ED.miniAttribute.position.y = data.data;
                    }
                    if(data.type == "Wkuan"){//图表宽度
                        this.Xmargin = $("#"+this.eid).width(data.data);
                        this.Xmargin="12"
                        this.Ymargin="9"
                        this.peizhi_ED.miniAttribute.size.x = data.data;
                    }
                    if(data.type == "Hgao"){//图表高度
                        this.Xmargin = $("#"+this.eid).height(data.data);
                        this.peizhi_ED.miniAttribute.size.y = data.data;
                        this.Xmargin="12"
                        this.Ymargin="9"
                    }
                }
                this.isEcharts = false;
                let colorlists = this.peizhicolor;
                this.$nextTick(()=>{
                    this.isEcharts = true
                    this.$nextTick(()=> {
                        this.pie_rings = echarts.init(document.getElementById(this.eid));
                        this.option = {
                            backgroundColor:this.backgroundColor,
                            title: {
                                text: this.titleText,
                                left: '12',
                                top: 10,
                                textStyle: {
                                    color: '#0096ff',
                                    fontSize:this.titFonts,
                                }
                            },
                            tooltip : {show:false},
                            series: [
                                {
                                    name:'',
                                    type:'pie',
                                    center:["50%","60%"],
                                    radius: ["8%", '12%'],
                                    data:[1],
                                    hoverAnimation:false,
                                    itemStyle:{color:"#222E39"}
                                },{
                                    // name:'',
                                    type:'pie',
                                    center:["50%","60%"],
                                    radius: ["0", '4%'],
                                    data:[1],
                                    labelLine:{
                                        show:false
                                    },
                                    hoverAnimation:false,
                                    itemStyle:{color:"#2B8FA2"}
                                },{
                                    name:'',
                                    type:'pie',
                                    center:["50%","60%"],
                                    radius: ["7%", '8%'],
                                    data:[1],
                                    hoverAnimation:false,
                                    itemStyle:{color:"#255A69"}
                                },{
                                    name:'',
                                    type:'pie',
                                    center:["50%","60%"],
                                    radius: ["12%", "45%"],
                                    roseType : 'radius',
                                    hoverAnimation:false,
                                    data:this.pie_ringdata,
                                    itemStyle: {
                                        normal:{
                                            color:function(params) {
                                            //自定义颜色
                                            var colorList = colorlists;
                                                return colorList[params.dataIndex]
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            textStyle: {
                                                fontSize: this.XY_fonts
                                            }
                                        },
                                    },
                                }
                            ]
                        };
                        if (this.onlyid) {
                            this.chulishuju();
                        } else {
                            this.pie_rings.setOption(this.option);
                        }
                    })
                })
            },
        },
        mounted: function() {
            // this.callback(); // 回调初始化数据
            let width,height;
            if(this.echartdata == ""){
                let idadd;
                idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                let newidadd; 
                newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
                this.peizhi_ED = {
                    miniID:newidadd,
                    type:"pie",
                    miniBackground:"",
                    layer:1,
                    miniAttribute:{
                        chartsKind:"饼状图",
                        stylePlan:1,//配色方案
                        panelTitle:"输入标题",
                        fontSize:12,
                        colorStyle:"默认",
                        position:{"x":this.Xmargin,"y":this.Ymargin},
                        size:{"x":width,"y":height},
                        dataStyple:"纯色",
                        opacity:50,
                        dataitem:"产量",//数据项
                        // datapoint:[//数据点
                        //     {mcid:"1_1_卷烟机",vrkey:"",sckey:"",name:""},
                        //     {mcid:"1_3_卷烟机",vrkey:"",sckey:"",name:""},
                        //     {mcid:"1_4_卷烟机",vrkey:"",sckey:"",name:""},
                        // ],
                        machineTpye:"卷烟机产量"
                    }
                }
            }else{
                this.peizhi_ED = this.echartdata;
                // console.log(this.peizhi_ED);
                // $("#"+this.eid).width(this.echartdata.miniAttribute.size.x);
                // $("#"+this.eid).height(this.echartdata.miniAttribute.size.y);
                // width = $(".pie_ring").width();
                // height = $(".pie_ring").height();
                // this.peizhi_ED.miniAttribute.size={
                //     "x":width,
                //     "y":height//图表的宽高
                // }
                this.titleText = this.echartdata.miniAttribute.panelTitle;
                this.titFonts = this.echartdata.miniAttribute.fontSize;
                this.XY_fonts = this.echartdata.miniAttribute.fontSize;
                let valR = this.echartdata.miniAttribute.opacity/100;
                this.backgroundColor = "rgba(0,0,0,"+valR+")";
                if(this.echartdata.miniAttribute.stylePlan == "0"){//
                    this.peizhicolor = ["#0386F5","#3FECFF","#4C63F2","#ED5400","#7351E3","#FF4873","#1FB5A5"];
                }else if(this.echartdata.miniAttribute.stylePlan == "1"){
                    this.peizhicolor = ["#FF7A83","#14FF00","#4C63F2","#ED5400","#9664E8","#9CFF6E","#0CF2F7"];
                }else if(this.echartdata.miniAttribute.stylePlan == "2"){
                    this.peizhicolor = ["#FDD100","#14FF00","#4C63F2","#ED5400","#7351E3","#9CFF6E","#14FF00"];
                }
            }
            
            this.Ereset();
            this.callIndex(this.peizhi_ED);
            console.log(this.peizhi_ED);
        }
        
    }
</script>

<style lang="less" scoped>
.pie_ring{
    width: 100%;
    height:100%;
    border: 1px solid #0096ff;
    box-sizing: border-box;
}
.pie_ring, .pie_ring > div{
    width: 100%;
    height: 100%;
}
.title {
    height: 5%;
    // margin: 5px 0 0 0;
    text-align: center;
    font-size: 20px;
}
</style>