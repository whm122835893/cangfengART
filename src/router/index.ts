import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/store/useStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
    { path: '/register', name: 'register', component: () => import('@/pages/RegisterPage.vue') },
    { path: '/market', name: 'market', component: () => import('@/pages/MarketPage.vue') },
    { path: '/market/:id', name: 'market-detail', component: () => import('@/pages/MarketDetailPage.vue') },
    { path: '/nft/:id', name: 'nft-detail', component: () => import('@/pages/NFTDetailPage.vue') },
    { path: '/payment/:id', name: 'payment', component: () => import('@/pages/PaymentPage.vue'), meta: { protected: true } },
    { path: '/order-pay/:orderId', name: 'market-pay', component: () => import('@/pages/MarketPaymentPage.vue'), meta: { protected: true } },
    { path: '/sale-pay/:orderId', name: 'sale-pay', component: () => import('@/pages/SalePaymentPage.vue'), meta: { protected: true } },
    { path: '/discover', name: 'discover', component: () => import('@/pages/DiscoverPage.vue') },
    { path: '/discover/:id', name: 'announcement', component: () => import('@/pages/AnnouncementDetailPage.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/pages/ProfilePage.vue') },
    { path: '/checkin', name: 'checkin', component: () => import('@/pages/CheckInPage.vue'), meta: { protected: true } },
    { path: '/lottery', name: 'lottery', component: () => import('@/pages/LotteryPage.vue'), meta: { protected: true } },
    { path: '/synthesis', name: 'synthesis', component: () => import('@/pages/SynthesisPage.vue'), meta: { protected: true } },
    { path: '/swap', name: 'swap', component: () => import('@/pages/SwapPage.vue'), meta: { protected: true } },
    { path: '/supply', name: 'supply', component: () => import('@/pages/SupplyPage.vue'), meta: { protected: true } },
    { path: '/assets', name: 'assets', component: () => import('@/pages/AssetsPage.vue'), meta: { protected: true } },
    { path: '/wallet', name: 'wallet', component: () => import('@/pages/WalletPage.vue'), meta: { protected: true } },
    { path: '/orders', name: 'orders', component: () => import('@/pages/OrdersPage.vue'), meta: { protected: true } },
    { path: '/personal-info', name: 'personal-info', component: () => import('@/pages/PersonalInfoPage.vue'), meta: { protected: true } },
    { path: '/security', name: 'security', component: () => import('@/pages/SecurityPage.vue'), meta: { protected: true } },
    { path: '/invite', name: 'invite', component: () => import('@/pages/InvitePage.vue'), meta: { protected: true } },
    { path: '/settings', name: 'settings', component: () => import('@/pages/SettingsPage.vue'), meta: { protected: true } },
    { path: '/verification', name: 'verification', component: () => import('@/pages/VerificationPage.vue'), meta: { protected: true } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  if (to.meta.protected) {
    const store = useStore()
    if (!store.isLoggedIn) {
      setTimeout(() => store.setShowAuthModal(true), 0)
      next('/')
      return
    }
  }
  next()
})

export default router
