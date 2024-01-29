import mongoose from 'mongoose'
import { IArticleSchema } from '../interface/article.interface'
import { ArticleSchema } from '../schema/article.schema'

export const ArticleModule = mongoose.model<IArticleSchema>('articles', ArticleSchema)