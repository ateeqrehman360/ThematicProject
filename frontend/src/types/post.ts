export interface Post {
  postId: number
  authorId: number
  authorName: string
  authorAvatar: string
  content: string
  imageUrl?: string
  timestamp: string
  likes: number
  commentCount: number
  isLiked?: boolean
}

export interface Comment {
  commentId: number
  postId: number
  authorId: number
  authorName: string
  authorAvatar: string
  content: string
  timestamp: string
}

export interface CreatePostPayload {
  content: string
  imageUrl?: string
}
