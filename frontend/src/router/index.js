import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import PostList from '@/views/PostList.vue'
import CreateEditView from '@/views/CreateEditView.vue'
import LoginView from '@/views/UserViews/LoginView.vue'
import ProfileView from '@/views/UserViews/ProfileView.vue'
import SignUpView from '@/views/UserViews/SignUpView.vue'
import SearchUserView from '@/views/UserViews/SearchUserView.vue'
import ExampleView from '@/views/UserViews/ExampleView.vue'

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
      name: "post",
      component: PostView
    },
    {
      path: "/posts",
      name: "post-list",
      component: PostList
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
    },
    { 
      path: "/login",
      name: "login",
      component: LoginView,
      },

      {
        path: "/profile",
        name: "profile",
        component: ProfileView,
      },
      {
        path: "/signup",
        name: "signup",
        component: SignUpView,
      },
      {
        path: "/searchUser",
        name: "searchUser",
        component: SearchUserView,
        props: true, // enables route props
      },
      {
        path: "/example",
        name: "example",
        component: ExampleView,
      }
  ],
})

export default router
