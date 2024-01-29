import { IArticle } from '@/interface/Article.interface'

export interface IEditArticle {
  EditArticle: IArticle;
  SetEditArticle: React.Dispatch<React.SetStateAction<IArticle>>;
}