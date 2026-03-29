# Kinship Service Layer

This directory contains the core logic for communicating with the Supabase backend. As the Role 2 lead, I have standardized these services to ensure consistent data flow across the application.

## Standard Usage Pattern

All services are designed to be imported directly into Vue components or Pinia stores.

```typescript
import { postService } from '@/services/postService'

// Example: Fetching the community feed
const fetchFeed = async () => {
  try {
    const posts = await postService.getFeed()
    // handle success
  } catch (error) {
    // handle standardized error
  }
}