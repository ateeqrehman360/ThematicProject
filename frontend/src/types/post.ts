export interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
  likes: number
  isLiked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
}

export interface CreatePostPayload {
  content: string
}
