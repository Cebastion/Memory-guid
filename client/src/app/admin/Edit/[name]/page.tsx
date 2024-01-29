'use client'
import { IArticle } from '@/interface/Article.interface'
import { useEffect, useState } from 'react'
import { ArticlePage } from '../../components/Article/ArticlePage'
import Link from 'next/link'
import { AdminService } from '../../service/Admin.service'
import style from './edit.module.scss'

export default function page({ params }: { params: { name: string } }) {
  const article: IArticle = {
    article: {
      name: '',
      image_street: [],
      image_hero: [],
      map_url: '',
      text: []
    }
  }

  const [EditArticle, SetEditArticle] = useState<IArticle>(article)

  const SaveEditArticle = async () => {
    const adminService = new AdminService()
    const article:IArticle = await adminService.SaveEditArticle(EditArticle)
    SetEditArticle(article)
  }

  const GetArticle = async () => {
    const adminService = new AdminService()
    const article:IArticle = await adminService.GetArticle(decodeURIComponent(params.name))
    SetEditArticle(article)
  }

  useEffect(() => {
    GetArticle()
  }, [])

  return (
    <div className={style.admin__block}>
      <header className={style.admin__header}>
        <button className={style.admin__exit} onClick={() => SetEditArticle(article)}>
          <Link href='/admin'>Вийти</Link>
        </button>
        <div className={style.admin__title}>
          <h1>Редагування вулиці</h1>
        </div>
        <button className={style.admin__button} onClick={SaveEditArticle}>
          Зберегти
        </button>
      </header>
      <main className={style.admin__content}>
        {EditArticle ? <ArticlePage EditArticle={EditArticle} SetEditArticle={SetEditArticle} /> : 
        <div className={style.admin__error}>Помилка в видачі данних</div>}
      </main>
    </div>
  )
}