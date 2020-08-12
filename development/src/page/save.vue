<template>
    <div>
        <div class="idone" :style="{top: item.y+'px', left: item.x+'px'}" :id="['ipad'+key]" v-for="(item, key) in dragDropList" :key="key">
            <v-piering class="ipad-title" :onlyid="jsonData['echart'+key]" v-on:echarts="backpie" :eid="'echart'+key" v-if="item.text == '饼状图'"></v-piering>
            <v-lines class="ipad-title" :onlyid="jsonData['echart'+key]" v-on:echarts="backpie" :eid="'echart'+key" v-else-if="item.text == '折线图'"></v-lines>
            <v-bar class="ipad-title" :onlyid="jsonData['echart'+key]" v-on:echarts="backpie" :eid="'echart'+key" v-else-if="item.text == '柱状图'"></v-bar>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>