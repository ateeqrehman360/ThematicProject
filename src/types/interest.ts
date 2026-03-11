export type TCGTag = 'Pokemon' | 'Yu-Gi-Oh' | 'Magic The Gathering' | 'Sports Cards' | 'One Piece TCG'

export const TCG_TAGS: TCGTag[] = [
  'Pokemon',
  'Yu-Gi-Oh',
  'Magic The Gathering',
  'Sports Cards',
  'One Piece TCG'
]

export interface Interest {
  interestId: number
  name: TCGTag
}
