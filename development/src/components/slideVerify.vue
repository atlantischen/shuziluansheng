<template>
  <div class="SlideVerifyPlug">
    <div class="verify-wrap" id="verify-wrap"></div>
  </div>
</template>
<script>
import SlideVerifyPlug from '../../static/js/slideVerify'
export default {
  data() {
    return {
      boolur:false,
    }
  },
  watch:{
    boolur(){
      this.$emit('boolur', slideVerify.slideFinishState);
    }
  },
  mounted() {
    let that = this;
    var slideVerify = new SlideVerifyPlug('#verify-wrap', {
      wrapWidth: '332', //设置 容器的宽度 ,不设置的话，会设置成100%，需要自己在外层包层div,设置宽度，这是为了适应方便点；
      initText: '请按住滑块，拖动到最右边', //设置  初始的 显示文字
      sucessText: '验证通过', //设置 验证通过 显示的文字
      getSuccessState: function(res) {
        //当验证完成的时候 会 返回 res 值 true，只留了这个应该够用了 
        console.log(res);
        that.$emit('boolur', slideVerify.slideFinishState);
      }
    });
  }
}
</script>
<style lang="less">
.SlideVerifyPlug{
  width: 336px;
  height: 42px;
  text-align: center;
  box-sizing: border-box;
  // border-radius: 5px;
  .verify-wrap{
    width: 336px;
    height: 42px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    // border-radius: 5px;
  }
  .verify-wrap .drag-btn{
    position: absolute;
    top: -2px;
    height: 45px;
    // border-radius: 5px;
  }
  .verify-wrap .fix-tips, .verify-msg{
    left: 0;
    // background:rgba(71,71,71,1);
    color: #FFFFFF;
    // border-radius: 5px;
    // border: 1px solid rgba(71,71,71,1);
  }
  .verify-wrap .verify-msg{
    background: #66b1ff;
  }
  .SlideVerifyPlug .verify-wrap .fix-tips, .SlideVerifyPlug .verify-msg{
    border-radius: 5px;
  }
  // .verify-wrap .suc-drag-btn{
  //   background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAiCAYAAAApkEs2AAAA/UlEQ…0Kw1BrMyHkXyj/3BHiUGocSo1DqXEota8Jvb/18hP16Z7qL3h/w53n4AAAAABJRU5ErkJggg==) no-repeat center center;
  // }
}
</style>

