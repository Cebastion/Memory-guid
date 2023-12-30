import dotenv from 'dotenv'
import { promises as fsPromises } from 'fs'
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

    private async findImages(name: string, subFolder: string): Promise<string[]> {
      const images: string[] = []
      const directoryPath = path.resolve(__dirname, '..', 'img', name, subFolder)
      
      try {
        const files = await fsPromises.readdir(directoryPath)
        
        let currentIndex = 0;
    
        files.forEach((file) => {
          const fileExtension = file.toLowerCase()
          if (fileExtension.endsWith('.webp') || fileExtension.endsWith('.png') || fileExtension.endsWith('.jpg')) {
            currentIndex += 1;
            images.push(`/${name}/${subFolder}/${currentIndex}`);
          }
        });
      } catch (error) {
        console.error(`Error reading directory ${directoryPath}: ${error}`)
      }
      
      return images;
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
            const [imageStreet, imageHero] = await Promise.all([
              this.findImages(element.name, 'street'),
              this.findImages(element.name, 'hero'),
            ])
            return {
              article: {
                name: element.name,
                image_street: imageStreet,
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
}
