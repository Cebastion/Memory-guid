import { FC } from 'react'
import style from './gallery.module.scss'
import { IArticle } from '@/interface/Article.interface'

const Gallery: FC<IArticle> = ({ article }) => {
  const URL = 'http://localhost:8800'

  return (
    article.text.length <= 6 ?
      <div className={style.row__img_hero}>
        {article.image_hero.map((url_hero, id) => (
          <div key={id} className={style.img__hero}>
            <img src={URL + url_hero} alt="hero" />
          </div>
        ))}
      </div> :
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