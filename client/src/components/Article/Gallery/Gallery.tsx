import { FC } from 'react'
import style from './gallery.module.scss'
import { IArticle } from '@/interface/Article.interface'

const Gallery: FC<IArticle> = ({ article }) => {
  const URL = 'https://memory-guid.vercel.app'

  return (
    <div className={style.row__img_hero}>
      {article.image_hero.map((url_hero, id) => (
        <div key={id} className={style.img__hero}>
          <img src={URL + url_hero} alt="hero" />
        </div>
      ))}
    </div>
  )
}

export default Gallery