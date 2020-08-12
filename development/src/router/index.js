import Vue from 'vue'
import Router from 'vue-router'
import test from '@/page/test'
import index from '@/page/index'
import manage from '@/page/manage'
import login from '@/page/login'

Vue.use(Router)

const router =  new Router({
    routes: [{
            path: '/test',
            name: 'test',
            component: test
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/manage',
            name: 'manage',
            component: manage
        },
        // {
        //     path: '/slideVerify',
        //     name: 'slideVerify',
        //     component: slideVerify
        // }
    ]
})
// 路由守卫做登录判断
router.beforeEach((to,from,next)=>{
    if(to.path ==='/'){
        next()
    }else{
        const token = localStorage.getItem('token')
        if(!token){
            next('/')
        }else{
            next()
        }
    }
})

export default router
