<template>
  <div class="max-w-4xl mx-auto py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else-if="isBlockedByUser || isBlockingUser" class="text-center py-12">
      <div class="bg-red-50 rounded-xl p-12 max-w-md mx-auto">
        <svg class="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ blockedStateTitle }}</h2>
        <p class="text-gray-600 mb-6">{{ blockedStateMessage }}</p>
        <router-link
          to="/discovery"
          class="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Discovery
        </router-link>
      </div>
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
          
          <div v-if="viewedProfile.is_private && !isOwnProfile && !isFriend" class="text-center py-12 bg-gray-50 rounded-xl">
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
                v-for="interest in (viewedProfile.tcg_interests || [])"
                :key="interest"
                :interest="interest"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useFriendStore } from '@/stores/friendStore'
import { useFeedStore } from '@/stores/feedStore'
import { supabase } from '@/services/supabaseClient'
import { friendService } from '@/services/friendService'
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
const viewedProfile = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const isOwnProfile = ref(false)
const isFriend = ref(false)
const isBlockedByUser = ref(false)
const isBlockingUser = ref(false)

const blockedStateTitle = computed(() =>
  isBlockedByUser.value ? 'Access Denied' : 'Profile Hidden'
)

const blockedStateMessage = computed(() =>
  isBlockedByUser.value
    ? 'This user has blocked you. You cannot view their profile.'
    : 'You have blocked this user. Unblock them to view their profile again.'
)

const loadProfile = async () => {
  const currentUserId = route.params.id as string
  console.log('Loading profile for userId:', currentUserId)
  loading.value = true
  isBlockedByUser.value = false
  isBlockingUser.value = false
  viewedProfile.value = null
  isFriend.value = false
  try {
    // Get the auth user ID
    const { data: authData } = await supabase.auth.getUser()
    const authId = authData.user?.id
    isOwnProfile.value = authId === currentUserId

    // Ensure current user profile is loaded in store
    if (authId && !userStore.profile) {
      console.log('Loading current user profile in ProfileView...')
      try {
        await useCurrentUser()
      } catch (err) {
        console.error('Failed to load current user profile:', err)
      }
    }

    // Fetch the viewed user's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUserId)
      .limit(1)

    if (profileError || !profileData || profileData.length === 0) {
      console.log('Profile not found')
      viewedProfile.value = null
      userPosts.value = []
      return
    }

    // Check if there's a block between current user and profile owner BEFORE setting profile
    if (!isOwnProfile.value && authId) {
      const blockRelationship = await friendService.getBlockRelationships(authId, currentUserId)

      console.log('Block check:', blockRelationship)

      if (blockRelationship.isBlocked) {
        console.log('Block relationship found - preventing profile access')
        viewedProfile.value = null
        userPosts.value = []
        isBlockedByUser.value = blockRelationship.blockedByTargetUser
        isBlockingUser.value = blockRelationship.blockedByCurrentUser
        return
      }
    }

    viewedProfile.value = profileData[0] as User
    console.log('Profile loaded:', viewedProfile.value.username)

    // Check friend status if not own profile
    if (!isOwnProfile.value && authId) {
      await friendStore.checkFriendStatus(authId, currentUserId)
      isFriend.value = friendStore.status[currentUserId] === 'friends'
    }

    // Fetch user's posts with proper structure
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })

    if (!postsError && posts) {
      // Get like counts for these posts
      const postIds = posts.map(p => p.id)
      const { data: likeCounts } = await supabase
        .from('post_likes')
        .select('post_id, user_id')
        .in('post_id', postIds)

      const likesMap: Record<string, number> = {}
      const userLikesMap: Set<string> = new Set()

      likeCounts?.forEach((like: any) => {
        likesMap[like.post_id] = (likesMap[like.post_id] || 0) + 1
        if (authId && like.user_id === authId) {
          userLikesMap.add(like.post_id)
        }
      })

      userPosts.value = posts.map(post => ({
        ...post,
        likes: likesMap[post.id] || 0,
        isLiked: userLikesMap.has(post.id)
      })) as Post[]
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
    viewedProfile.value = null
    userPosts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})

// Watch for route changes to reload profile when user ID changes
watch(() => route.params.id, () => {
  console.log('Route params changed, reloading profile')
  loadProfile()
})

const goToEdit = () => {
  if (isOwnProfile.value) {
    router.push('/profile/edit')
  }
}

const handleLikePost = async (postId: string) => {
  if (!userStore.profile) return
  const post = userPosts.value.find(p => p.id === postId)
  if (!post) return

  if (post.isLiked) {
    await feedStore.unlikePost(postId, userStore.profile.id)
    post.isLiked = false
    post.likes = Math.max(0, post.likes - 1)
  } else {
    await feedStore.likePost(postId, userStore.profile.id)
    post.isLiked = true
    post.likes = (post.likes || 0) + 1
  }
}

const handleDeletePost = async (postId: string) => {
  if (!userStore.profile) return
  await feedStore.deletePost(postId, userStore.profile.id)
  userPosts.value = userPosts.value.filter(p => p.id !== postId)
}
</script>
