'use client'
import { IActiveArticle } from '@/interface/ActiveArticle.interface'
import { IArticleAll, IArticleName, IArticleNames } from '@/interface/Article.interface'
import { ArticleService } from '@/service/Article.service'
import { FC, useEffect, useState } from 'react'
import style from './navigation.module.scss'
import { IActiveBurger } from '@/interface/ActiveBurger.interface'

const Navigation: FC<IActiveArticle & IActiveBurger> = ({ SetActiveArticle, Active, SetActive }) => {

  const [ArticleNames, SetArticleNames] = useState<IArticleNames>({ names: [] })
  const [ArticleAll, SetArticleAll] = useState<IArticleAll>({ articles: [] })
  const [activeArticle, setActiveArticle] = useState<string>()
  const [Loading, SetLoading] = useState<boolean>(false)

  async function GetArticle(name: string) {
    const articleService = new ArticleService()
    const article = await articleService.GetArticle(ArticleAll, name)
    SetActiveArticle(article)
    setActiveArticle(name)
  }

  useEffect(() => {
    (async () => {
      const articleService = new ArticleService()
      const ArticleNames = await articleService.GetArticleNames()
      const ArticleAll = await articleService.GetArticleAll()
      SetArticleNames(ArticleNames)
      SetArticleAll(ArticleAll)
      SetLoading(true)
    })()
  }, [])

  function HandleClick(article: IArticleName) {
    GetArticle(article.name) 
    SetActive(false)
  }

  return (
    <aside className={Active ? `${style.content__aside} ${style.active}` : style.content__aside}>
      {Loading ?
        ArticleNames.names.map((article) => (
          <div className={`${style.aside__block} ${activeArticle === article.name ? style.active : ''}`} key={article.name} onClick={() => HandleClick(article)}>
            <span>{article.name}</span>
          </div>
        ))
        :
        <div className={style.aside__block}>
          <span>Завантаження...</span>
        </div>
      }
    </aside>
  )
}

export default Navigation