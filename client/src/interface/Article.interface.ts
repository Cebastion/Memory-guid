export interface IArticle {
  article: {
    name: string,
    image_street: string[],
    image_hero: string[],
    map_url: string,
    text: string[],
  }
}

export interface IArticleAll {
  articles: IArticle[]
}

export interface IArticleName {
  name: string
}

export interface IArticleNames {
  names: IArticleName[]
}