export interface IArticle {
  article: {
    _id: string
    name: string
    image_hero: string
    map_url: string
    text: string[]
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

export interface IArticleSchema extends Document {
  _id: string
  name: string
  map_url: string
  text: string[]
}