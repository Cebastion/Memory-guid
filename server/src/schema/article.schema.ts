import { Schema } from 'mongoose'

export const ArticleSchema = new Schema({
  _id: String,
  name: String,
  map_url: String,
  text: Array,
})