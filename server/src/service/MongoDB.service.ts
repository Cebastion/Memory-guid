import dotenv from 'dotenv'
import fs, { promises as fsPromises } from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import {
  IArticle,
  IArticleAll,
  IArticleName,
  IArticleNames,
  IArticleSchema,
} from '../interface/article.interface'
import { ArticleModule } from '../module/article.module'

dotenv.config()

export class MongoDB {
  private MongooseDB: string =
    process.env.URL_DB ||
    'mongodb+srv://UserList:14881488@cluster0.ai3eiek.mongodb.net/article?retryWrites=true&w=majority';

  private findImg(_id: string): string {
    const supportedFormats = ['webp', 'png', 'jpg']
    const dir = path.join('src', 'images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const files = fs.readdirSync(dir);
    const file = files.find(name => {
      for (const format of supportedFormats) {
        if (name.endsWith(`.${format}`) && name.split(`.${format}`)[0] === _id) {
          return true;
        }
      }
      return false;
    })

    return file as string;
  }

  private async DeleteImage(_id: string): Promise<void> {
    const supportedFormats = ['webp', 'png', 'jpg']
    const files = fs.readdirSync(path.join('src', 'images'))
    const file = files.find(name => {
      for (const format of supportedFormats) {
        if (name.endsWith(`.${format}`) && name.split(`.${format}`)[0] === _id) {
          return true;
        }
      }
      return false;
    });
    const pathImg = path.join('src', 'images', file)
    fs.unlinkSync(pathImg)
  }


  private async disconnect() {
    await mongoose.disconnect()
  }

  private async connect() {
    try {
      await mongoose.connect(this.MongooseDB)
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error}`)
    }
  }

  async articles(): Promise<IArticleAll> {
    try {
      await this.connect()
      const articles: IArticleSchema[] = await ArticleModule.find()
      const article_all: IArticleAll = {
        articles: await Promise.all(
          articles.map(async (element) => {
            const imageHero = await Promise.all([
              this.findImages(element._id),
            ])
            return {
              article: {
                _id: element._id,
                name: element.name,
                image_hero: imageHero,
                map_url: element.map_url,
                text: element.text,
              },
            } as IArticle
          })
        ),
      }
      return article_all
    } finally {
      await this.disconnect()
    }
  }

  async article(_id: string): Promise<IArticle> {
    try {
      await this.connect()

      const [article_part, imageHero] = await Promise.all([
        ArticleModule.findOne({ _id: _id }),
        this.findImages(_id)
      ])

      if (!article_part) {
        throw new Error(`Article not found with name: ${_id}`)
      }

      const article: IArticle = {
        article: {
          _id: article_part._id,
          name: article_part.name,
          image_hero: imageHero,
          map_url: article_part.map_url,
          text: article_part.text
        }
      }

      return article
    } finally {
      await this.disconnect()
    }
  }



  async namesArticles(): Promise<IArticleNames> {
    try {
      await this.connect()
      const names_articles = await ArticleModule.find()
      const names: IArticleNames = {
        names: names_articles.map((article) => ({ name: article.name } as IArticleName)),
      }
      return names
    } finally {
      await this.disconnect()
    }
  }

  async AddStreet({ article }: IArticle) {
    try {
      await this.connect()
      await ArticleModule.create({ _id: article._id, name: article.name, map_url: article.map_url, text: article.text })
    } finally {
      await this.disconnect()
    }
  }

  async EditStreet({ article }: IArticle) {
    try {
      await this.connect()
      await ArticleModule.updateOne({ _id: article._id }, { name: article.name, text: article.text, map_url: article.map_url })
    } finally {
      await this.disconnect()
    }
  }

  async DeleteStreet({ article }: IArticle) {
    try {
      await this.connect()
      await ArticleModule.deleteOne({ _id: article._id })
      await this.DeleteImage(article._id)
    } finally {
      await this.disconnect()
    }
  }
}
