export interface Post {
  id: string
  user_id: string
  author_name: string
  author_avatar: string
  content: string
  image_url?: string
  created_at: string
  likes: number
  commentCount: number
  isLiked?: boolean
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  author_name: string
  author_avatar: string
  content: string
  created_at: string
}

export interface CreatePostPayload {
  content: string
  imageUrl?: string
}
