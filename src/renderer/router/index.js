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
      path: '/lend/:user',
      name: 'lend',
      component: require('@/components/Lend'),
      props: true
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
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
