import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/index.vue'),
      children: [{
        path: '/index/detail/:id',
        name: 'detail',
        component: () => import('@/views/detail/detail.vue')
      } ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/search/search.vue')
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: () => import('@/views/search/searchResult.vue'),
      children: [
        {
          path: '/searchResult/detail/:id',
          name: 'detail',
          component: () => import('@/views/detail/detail.vue')
        }]
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video/index.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/index.vue')
    },
    {
      path: '/personalinfo',
      name: 'personalinfo',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/user/userinfo.vue')
    },
    {
      path: '/ask',
      name: 'ask',
      component: () => import('@/views/ask/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/collect',
      name: 'collect',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/collect/collect.vue'),
      children: [
        {
          path: '/collect/detail/:id',
          component: () => import('@/views/detail/detail.vue')
        }
      ]
    }, {
      path: '/follow',
      name: 'follow',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/follow/follow.vue')
    },
    {
      path: '/mywork',
      name: 'mywork',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/mywork/mywork.vue'),
      children: [
        {
          path: '/mywork/detail/:id',
          name: 'detail',
          component: () => import('@/views/detail/detail.vue')
        }]
    }, {
      path: '/robot',
      name: 'robot',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/robot/robot.vue')
    }, {
      path: '/message',
      name: 'message',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/user/message.vue')
    }, {
      path: '/people',
      name: 'people',
      meta: { needLogin: true }, // 是否需要登录的标记 如果需要的话 就跳转到登录页
      component: () => import('@/views/people/index.vue'),
      children: [{
        path: '/people/detail/:id',
        name: 'people',
        component: () => import('@/views/detail/detail.vue')
      }]
    }
  ]
})
