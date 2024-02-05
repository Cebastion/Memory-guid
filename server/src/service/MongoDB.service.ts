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
    const supportedFormats = ['webp', 'png', 'jpg', 'jpeg']
    const dir = path.join(__dirname, 'src', 'images');
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
    const supportedFormats = ['webp', 'png', 'jpg', 'jpeg']
    const files = fs.readdirSync(path.join(__dirname, 'src', 'images'))
    const file = files.find(name => {
      for (const format of supportedFormats) {
        if (name.endsWith(`.${format}`) && name.split(`.${format}`)[0] === _id) {
          return true;
        }
      }
      return false;
    });
    const pathImg = path.join(__dirname, 'src', 'images', file)
    console.log(pathImg)
    fs.unlinkSync(pathImg)
  }


  async disconnect() {
    await mongoose.disconnect().then(() => console.log("Disconnected"))
  }

  async connect() {
    try {
      await mongoose.connect(this.MongooseDB).then(() => console.log("Connected"))
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error}`)
    }
  }

  async articles(): Promise<IArticleAll> {
    try {
      
      const articles: IArticleSchema[] = await ArticleModule.find()
      const article_all: IArticleAll = {
        articles: await Promise.all(
          articles.map(async (element) => {
            const imageHero = this.findImg(element._id)
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
    } catch (error) {
      console.log(error)
    }
  }

  async article(name: string): Promise<IArticle> {
    try {
      

      const [article_part] = await Promise.all([
        ArticleModule.findOne({ name: name })
      ])

      if (!article_part) {
        throw new Error(`Article not found with name: ${name}`)
      }
      const imageHero = this.findImg(article_part._id)

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
    } catch (error) {
      console.log(error)
    }
  }



  async namesArticles(): Promise<IArticleNames> {
    try {
      
      const names_articles = await ArticleModule.find()
      const names: IArticleNames = {
        names: names_articles.map((article) => ({ name: article.name } as IArticleName)),
      }
      return names
    } catch (error) {
      console.log(error)
    }
  }

  async AddStreet(article: any) {
    try {
      await ArticleModule.create({ _id: article._id, name: article.name, map_url: article.map_url, text: article.text })
    } catch (error) {
      console.log(error)
    }
  }

  async EditStreet(article: any) {
    try {
      await ArticleModule.findOneAndUpdate({ _id: article._id }, { name: article.name, text: article.text, map_url: article.map_url })
    } catch (error) {
      console.log(error)
    }
  }

  async DeleteStreet({article}: IArticle) {
    try {
      await ArticleModule.findOneAndDelete({ _id: article._id })
      await this.DeleteImage(article._id)
    } catch (error) {
      console.log(error)
    }
  }
}
