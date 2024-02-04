import axios from 'axios'
import { IArticle, IArticleAll, IArticleNames } from '@/interface/Article.interface'

export class ArticleService {
  private URL = 'https://memory-guid-server.vercel.app/'
  
  async GetArticleNames(): Promise<IArticleNames> {
    const { data } = await axios.get<IArticleNames>(this.URL +'names_streets')
    return data
  }

  async GetArticleAll(): Promise<IArticleAll> {
    const { data } = await axios.get<IArticleAll>(this.URL + 'all_article')
    return data
  }

  async GetArticle(ArticleAll: IArticleAll, name: string): Promise<IArticle> {
    const article: IArticle | undefined = ArticleAll.articles.find(
      (articles) => articles.article.name === name
    )

    if(article){
      return article
    } else {
      throw new Error(`Article with name ${name} not found`);
    }
  }
}