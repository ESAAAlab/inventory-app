import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/lend/:user',
      name: 'lend',
      component: require('@/components/Lend').default,
      props: true
    },
    {
      path: '/inventory/:tool',
      name: 'inventory',
      component: require('@/components/Inventory').default,
      props: true
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
