import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import CreateEditView from '@/views/CreateEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: "/post/:id",
      "name": "post",
      component: PostView
    },

    {
      path: "/editpost/:id",
      name: "editpost",
      component: CreateEditView,
      props: {
        "edit": true
      }
    },
    {
      path: "/newpost",
      name: "newpost",
      component: CreateEditView,
      props: {
        "edit": false
      }
    }
  ],
})

export default router
