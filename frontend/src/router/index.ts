import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignupView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/feed',
    name: 'Feed',
    component: () => import('@/views/FeedView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/views/EditProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/discovery',
    name: 'Discovery',
    component: () => import('@/views/DiscoveryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/MessagesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages/:userId',
    name: 'MessageChat',
    component: () => import('@/views/MessagesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('@/views/FriendsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/styleguide',
    name: 'StyleGuide',
    component: () => import('@/views/StyleGuide.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('Route guard - to:', to.name, 'authInitialized:', authStore.authInitialized, 'isAuthenticated:', authStore.isAuthenticated)

  // Wait for auth to be initialized before checking auth status
  if (!authStore.authInitialized) {
    console.log('Auth not initialized yet, allowing navigation to proceed')
    next()
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Route requires auth but not authenticated, redirecting to login')
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('Route requires guest but authenticated, redirecting to feed')
    next('/feed')
  } else {
    next()
  }
})

export default router
