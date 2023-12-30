import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { promises as fsPromises } from 'fs'
import path from 'path'
import { ArticleModule } from '../module/article.module'
import { IArticle, IArticleAll, IArticleName, IArticleNames, IArticleSchema } from '../interface/article.interface'
dotenv.config()

export class MongoDB {
  private MongooseDB: string = process.env.URL_DB!

  private async FindStreetImg(name: string): Promise<string[]> {
    const images: string[] = []
    const directoryPath = path.resolve(__dirname, '..', 'img', name, 'street')
    const files = await fsPromises.readdir(directoryPath)
    for (let i = 0; i < files.length; i++) {
      if (files[i] !== undefined) {
        const fileExtension = files[i].toLowerCase()
        if (fileExtension.endsWith('.webp') || fileExtension.endsWith('.png') || fileExtension.endsWith('.jpg')) {
          images.push(`/${name}/street/${i + 1}`)
        }
      }
    }
    return images
  }

  private async FindHeroImg(name: string): Promise<string[]> {
    const images: string[] = []
    const directoryPath = path.resolve(__dirname, '..', 'img', name, 'hero')
    const files = await fsPromises.readdir(directoryPath)
    for (let i = 0; i <= files.length; i++) {
      if (files[i] !== undefined) {
        const fileExtension = files[i].toLowerCase()
        if (fileExtension.endsWith('.webp') || fileExtension.endsWith('.png') || fileExtension.endsWith('.jpg')) {
          images.push(`/${name}/hero/${i + 1}`)
        }
      }
    }
    return images
  }

  private Exit = async () => {
    await mongoose.disconnect()
    process.exit(0)
  }

  async Connect() {
    await mongoose.connect(this.MongooseDB).then(() => console.log('Connected!!!'))
    process.on('SIGINT', this.Exit)
  }

  async Articles(): Promise<IArticleAll> {
    const articles: IArticleSchema[] = await ArticleModule.find()
    const article_all: IArticleAll = {
      articles: []
    }
    await Promise.all(
      articles.map(async (element) => {
        const image_street = await this.FindStreetImg(element.name)
        const image_hero = await this.FindHeroImg(element.name)
        const article: IArticle = {
          article: {
            name: element.name,
            image_street: image_street,
            image_hero: image_hero,
            map_url: element.map_url,
            text: element.text,
          }
        }

        article_all.articles.push(article)
      })
    )

    return article_all
  }

  async Names_Articles(): Promise<IArticleNames> {
    let names: IArticleNames = {
      names: []
    }
    const names_articles = await ArticleModule.find()

    names_articles.map((article) => {
      const articleName: IArticleName = {
        name: article.name,
      }
      names.names.push(articleName)
    })

    return names
  }

}