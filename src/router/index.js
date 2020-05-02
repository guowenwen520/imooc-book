import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    component: () => import('../views/Ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/Ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    redirect: '/store/shelf',
    component: () => import('../views/Store/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import('../views/Store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('../views/Store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('../views/Store/StoreDetail.vue')
      },
      {
        path: 'shelf',
        component: () => import('../views/Store/StoreShelf.vue')
      },
      {
        path: 'category',
        component: () => import('../views/Store/StoreCategory.vue')
      },
      {
        path: 'speaking',
        component: () => import('../views/Store/StoreSpeaking.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
