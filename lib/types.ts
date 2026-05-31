export type WishStatus = 'have' | 'want'

export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Wish {
  id: string
  user_id: string
  body: string
  status: WishStatus
  upvote_count: number
  created_at: string
  profiles?: Profile
}

export interface Upvote {
  user_id: string
  wish_id: string
  created_at: string
}
