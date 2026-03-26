<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center px-4">
    <div class="text-center text-white max-w-2xl">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">Kinship</h1>
      <p class="text-xl md:text-2xl mb-4">Hyper-local Community Discovery for TCG Hobbyists</p>
      <p class="text-lg md:text-xl opacity-90 mb-8">Connect with Pokemon, Yu-Gi-Oh, Magic: The Gathering, Sports Cards, and One Piece TCG collectors near you.</p>
      
      <div class="flex gap-4 flex-col sm:flex-row justify-center">
        <router-link v-if="authStore.isAuthenticated" to="/feed" class="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Go to Feed
        </router-link>
        <router-link v-else to="/signup" class="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </router-link>
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="px-8 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors">
          Login
        </router-link>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
          <div class="text-4xl mb-4">🎴</div>
          <h3 class="text-xl font-semibold mb-2">Find Players</h3>
          <p class="opacity-90">Discover TCG collectors and players in your area with shared interests.</p>
        </div>
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
          <div class="text-4xl mb-4">💬</div>
          <h3 class="text-xl font-semibold mb-2">Connect & Chat</h3>
          <p class="opacity-90">Message other collectors, organize game nights, and build friendships.</p>
        </div>
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
          <div class="text-4xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold mb-2">Share Passion</h3>
          <p class="opacity-90">Post about your collection, find events, and join your local community.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
