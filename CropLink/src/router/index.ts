import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/profilesetup',
      name: 'profile-setup',
      component: () => import('../views/ProfileSetupView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../views/FeedView.vue'),
    },
    {
      path: '/seller/:sellerName/:id',
      name: 'seller-ads',
      component: () => import('../views/SellerAdsView.vue'),
      props: true,
    },
    {
      path: '/ad/:adId',
      name: 'ad',
      component: () => import('../views/AdView.vue'),
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/userboard',
      name: 'userboard',
      component: () => import('../views/UserBoardView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/messaging/:adId',
      name: 'messaging',
      component: () => import('../views/MessagingView.vue'),
      meta: {requiresAuth: true},
      props: true,
    },
    {
      path: '/banking/:adId',
      name: 'banking',
      component: () => import('../views/BankingView.vue'),
      meta: {requiresAuth: true},
      props: true,
    }
  ]
})
export default router
