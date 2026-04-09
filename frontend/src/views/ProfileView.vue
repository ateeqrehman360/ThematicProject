<template>
  <div class="max-w-4xl mx-auto py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else-if="!viewedProfile" class="text-center py-12">
      <p class="text-gray-500 text-lg">Profile not found</p>
    </div>

    <div v-else>
      <ProfileHeader
        :profile="viewedProfile"
        :isOwnProfile="isOwnProfile"
        @edit="goToEdit"
      />

      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Posts</h2>
          
<<<<<<< HEAD
          <div v-if="profile.is_private && !isOwnProfile && !isFriend" class="text-center py-12 bg-gray-50 rounded-xl">
=======
          <div v-if="viewedProfile.is_private && !isOwnProfile && !isFriend" class="text-center py-12 bg-gray-50 rounded-xl">
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p class="text-gray-500">This profile is private. Add as friend to see posts.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-if="userPosts.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
              <p class="text-gray-500">No posts yet</p>
            </div>
            <PostCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              @like="handleLikePost"
              @delete="handleDeletePost"
            />
          </div>
        </div>

        <div>
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
            <div class="flex flex-wrap gap-2">
              <InterestTag
<<<<<<< HEAD
                v-for="interest in (profile.tcgInterests || [])"
=======
                v-for="interest in viewedProfile.tcg_interests"
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
                :key="interest"
                :interest="interest"
              />
            </div>
          </div>
<<<<<<< HEAD

          <div v-if="(profile.favouriteCards || []).length > 0" class="mt-6 bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Favourite Cards</h3>
            <div class="space-y-2">
              <FavouriteCard
                v-for="card in (profile.favouriteCards || [])"
                :key="card"
                :card="card"
              />
            </div>
          </div>
=======
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
=======
import { ref, onMounted } from 'vue'
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useFriendStore } from '@/stores/friendStore'
import { useFeedStore } from '@/stores/feedStore'
import { supabase } from '@/services/supabaseClient'
import type { User } from '@/types/user'
import type { Post } from '@/types/post'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import InterestTag from '@/components/profile/InterestTag.vue'
import PostCard from '@/components/feed/PostCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const friendStore = useFriendStore()
const feedStore = useFeedStore()

const loading = ref(false)
<<<<<<< HEAD
const profile = computed(() => userStore.profile)
const userId = ref<string | null>(null)
const isOwnProfile = computed(() => !!userId.value && userStore.profile?.id === userId.value)
const isFriend = computed(() => false)
const userPosts = computed(() => [])
=======
const viewedProfile = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const isOwnProfile = ref(false)
const isFriend = ref(false)

const userId = route.params.id as string
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)

onMounted(async () => {
  loading.value = true
  try {
<<<<<<< HEAD
    const routeId = route.params.id as string | undefined

    if (routeId && routeId !== 'undefined') {
      userId.value = routeId
    } else {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!data.user) throw new Error('No logged-in user found')
      userId.value = data.user.id
=======
    // Get the auth user ID
    const { data: authData } = await supabase.auth.getUser()
    const authId = authData.user?.id
    isOwnProfile.value = authId === userId

    // Fetch the viewed user's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profileData) {
      viewedProfile.value = null
      userPosts.value = []
      return
    }

    viewedProfile.value = profileData as User

    // Check friend status if not own profile
    if (!isOwnProfile.value && authId) {
      await friendStore.checkFriendStatus(authId, userId)
      isFriend.value = friendStore.status[userId] === 'friends'
    }

    // Fetch user's posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!postsError && posts) {
      userPosts.value = posts as Post[]
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
    }

    if (!userId.value) {
      throw new Error('Profile ID is missing')
    }
    
    console.log('ProfileView userId being fetched:', userId.value)
    await userStore.fetchUser(userId.value)
  } catch (err) {
    console.error('Failed to load profile:', err)
    viewedProfile.value = null
    userPosts.value = []
  } finally {
    loading.value = false
  }
})

const goToEdit = () => {
  if (isOwnProfile.value) {
    router.push('/profile/edit')
  }
}

<<<<<<< HEAD
const handleLikePost = async (postId: number) => {
  console.warn('Like post not wired to new profile model yet')
}

const handleDeletePost = async (postId: number) => {
  console.warn('Delete post not wired to new profile model yet')
=======
const handleLikePost = async (postId: string) => {
  if (!userStore.profile) return
  const post = feedStore.posts.find(p => p.id === postId)
  if (post?.isLiked) {
    await feedStore.unlikePost(postId, userStore.profile.id)
  } else {
    await feedStore.likePost(postId, userStore.profile.id)
  }
}

const handleDeletePost = async (postId: string) => {
  if (!userStore.profile) return
  await feedStore.deletePost(postId, userStore.profile.id)
>>>>>>> 9cc979e (Fixed frontend build, matched with schema, and typescript errors)
}
</script>
