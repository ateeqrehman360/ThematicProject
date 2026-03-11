<template>
  <div class="max-w-4xl mx-auto py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <div v-else-if="!profile" class="text-center py-12">
      <p class="text-gray-500 text-lg">Profile not found</p>
    </div>

    <div v-else>
      <ProfileHeader
        :profile="profile"
        :isOwnProfile="isOwnProfile"
        @edit="goToEdit"
      />

      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Posts</h2>
          
          <div v-if="profile.isPrivateProfile && !isOwnProfile && !isFriend" class="text-center py-12 bg-gray-50 rounded-xl">
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
              :key="post.postId"
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
                v-for="interest in profile.tcgInterests"
                :key="interest"
                :interest="interest"
              />
            </div>
          </div>

          <div v-if="profile.favouriteCards.length > 0" class="mt-6 bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Favourite Cards</h3>
            <div class="space-y-2">
              <FavouriteCard
                v-for="card in profile.favouriteCards"
                :key="card"
                :card="card"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useFriendStore } from '@/stores/friendStore'
import { useFeedStore } from '@/stores/feedStore'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import InterestTag from '@/components/profile/InterestTag.vue'
import FavouriteCard from '@/components/profile/FavouriteCard.vue'
import PostCard from '@/components/feed/PostCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const friendStore = useFriendStore()
const feedStore = useFeedStore()

const loading = ref(false)
const profile = computed(() => userStore.profile)
const userId = computed(() => parseInt(route.params.id as string))
const isOwnProfile = computed(() => userStore.profile?.userId === userId.value)
const isFriend = computed(() => friendStore.status[userId.value] === 'friends')
const userPosts = computed(() => feedStore.posts.filter(p => p.authorId === userId.value))

onMounted(async () => {
  loading.value = true
  try {
    await userStore.fetchUser(userId.value)
    if (!isOwnProfile.value) {
      await friendStore.checkFriendStatus(userStore.profile?.userId || 0, userId.value)
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
  } finally {
    loading.value = false
  }
})

const goToEdit = () => {
  if (isOwnProfile.value) {
    router.push('/profile/edit')
  }
}

const handleLikePost = async (postId: number) => {
  if (!userStore.profile) return
  const post = feedStore.posts.find(p => p.postId === postId)
  if (post?.isLiked) {
    await feedStore.unlikePost(postId, userStore.profile.userId)
  } else {
    await feedStore.likePost(postId, userStore.profile.userId)
  }
}

const handleDeletePost = async (postId: number) => {
  if (!userStore.profile) return
  await feedStore.deletePost(postId, userStore.profile.userId)
}
</script>
