import { Schema } from 'mongoose'

export const ArticleSchema = new Schema({
  name: String,
  map_url: String,
  text: Array,
})