import { FC } from 'react'
import style from './gallery.module.scss'
import { IArticle } from '@/interface/Article.interface'

const Gallery: FC<IArticle> = ({ article }) => {
  const URL = 'https://memory-guid.vercel.app/'

  return (
    <div className={style.row__img_hero}>
      <div key={article._id} className={style.img__hero}>
          <img src={URL + article._id} alt="hero" />
      </div>
    </div>
  )
}

export default Gallery