'use client'
import { FC, useState } from 'react'
import Navigation from '../Navigation/Navigation'
import Article from '../Article/Article'
import { IArticle } from '@/interface/Article.interface'
import style from './main.module.scss'
import { IActiveBurger } from '@/interface/ActiveBurger.interface'

const Main: FC<IActiveBurger> = ({Active, SetActive}) => {
  const [ActiveArticle, SetActiveArticle] = useState<IArticle>(
    {
      article: {
        _id: '',
        name: '',
        image_hero: '',
        map_url: '',
        text: [],
      }
    }
  )

  return (
    <main className={style.content}>
      <div className={style.content__container}>
        <Navigation SetActive={SetActive} Active={Active} SetActiveArticle={SetActiveArticle} />
        <Article article={ActiveArticle.article} />
      </div>
    </main>
  )
}

export default Main