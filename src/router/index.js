import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

  const routes = [
    {
      path:'/Todo',
      name: 'Todolist',
      component:()=>import('../views/Todos.vue')
    },
    {
      path:'/DAW',
      name: 'DAW',
      component:()=>import('../views/DAW.vue')
    },
    {
      path:'/APITest',
      name:'APITest',
      component:()=>import('../views/APITest')
    },
    {
      path:'/ThreeEX',
      name:'ThreeEX',
      component:()=>import('../views/ThreeEX')
    }

]

const router = new VueRouter({
  routes
})

export default router
