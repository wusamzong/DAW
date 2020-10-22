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
    },
    {
      path:'/Dragging',
      name:'Dragging',
      component:()=>import('../views/Dragging')
    },
    {
      path:'/shapes',
      name:'shapes',
      component:()=>import('../views/shapes')
    }
    ,
    {
      path:'/lightOut',
      name:'lightOut',
      component:()=>import('../views/lightOut')
    }

]

const router = new VueRouter({
  routes
})

export default router
