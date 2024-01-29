import { IArticle } from './Article.interface'

export interface IActiveArticle {
  SetActiveArticle: React.Dispatch<React.SetStateAction<IArticle>>
}