import { IArticle, IArticleAll } from '@/interface/Article.interface'
import { ArticleService } from '@/service/Article.service'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import style from '@/app/admin/components/Dashboard/dasboard.module.scss'
import { AdminService } from '../../service/Admin.service'

export default function Dashboard() {
  const [ArticleAll, SetArticleAll] = useState<IArticleAll>({ articles: [] })
  const [Loading, SetLoading] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      SetLoading(true)
      const articleService = new ArticleService()
      const ArticleAll = await articleService.GetArticleAll()
      SetArticleAll(ArticleAll)
      SetLoading(false)
    })()
  }, [])

  const DeleteArticle = async (article: IArticle) => {
    const adminService = new AdminService()
    const new_article_all = await adminService.DeleteArticle(article)
    SetArticleAll(new_article_all)
  }

  return (
    <div className={style.admin__block}>
      <header className={style.header}>
        <div className={style.header__title}>
          <h1>Адмін-панель</h1>
        </div>
        <button className={style.header__button}>
          <Link href="/admin/Add">Добавити вулицю</Link>
        </button>
      </header>
      {Loading ? <div className={style.loading}>Завантаження...</div> :
      <main className={style.content}>
        <div className={style.content__title}>
          <h2>Вулиці</h2>
        </div>
        <div className={style.content__articles}>
          {ArticleAll.articles.map((article) => {
            return (
              <div className={style.articles__article} key={article.article.name}>
                <div className={style.articles__article__title}>
                  <h3>{article.article.name}</h3>
                </div>
                <div className={style.articles__article__button}>
                  <Link href={`/admin/Edit/${article.article.name}`}>
                    <button className={style.articles__article__button__edit}>Редагувати</button>
                  </Link>
                  <button className={style.articles__article__button__delete} onClick={() => DeleteArticle(article)}>
                    Видалити
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      }
    </div>
  )
}
