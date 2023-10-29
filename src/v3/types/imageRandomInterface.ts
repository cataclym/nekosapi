import { Tags } from "./Tags";

export interface ImageRandomInterface {
  id: number
  image_url: string
  sample_url: string
  image_size: number
  image_width: number
  image_height: number
  sample_size: number
  sample_width: number
  sample_height: number
  source: string
  source_id: number
  rating: string
  verification: string
  hash_md5: string
  hash_perceptual: string
  color_dominant: number[]
  color_palette: number[][]
  duration: number
  is_original: boolean
  is_screenshot: boolean
  is_flagged: boolean
  is_animated: boolean
  artist: Artist
  characters: Character[]
  tags: Tag[]
  created_at: number
  updated_at: number
}

export interface Artist {
  id: number
  name: string
  aliases: string[]
  image_url: string
  links: string[]
  policy_repost: boolean
  policy_credit: boolean
  policy_ai: boolean
}

export interface Character {
  id: number
  name: string
  aliases: string[]
  description: string
  ages: number[]
  height: number
  weight: number
  gender: string
  species: string
  birthday: string
  nationality: string
  occupations: string[]
}

export interface Tag {
  id: Tags,
  name: `${Tags}`,
  description: string
  sub: string
  is_nsfw: boolean
}
