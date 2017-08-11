import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home')
    },
    {
      path: '/lend',
      name: 'lend',
      component: require('@/components/Lend')
    },
    {
      path: '/inventory',
      name: 'return',
      component: require('@/components/Inventory')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
