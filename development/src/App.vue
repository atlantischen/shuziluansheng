<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      console.log(555);
      this.isRouterAlive = false;
      this.$nextTick(function(){
        console.log(this.isRouterAlive)
        this.isRouterAlive = true;
      })
    }
  }
}
</script>

<style>
body{
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  overflow: hidden;
}
</style>
