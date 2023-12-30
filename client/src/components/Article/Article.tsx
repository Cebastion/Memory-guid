import { FC } from 'react'
import { IArticle } from '@/interface/Article.interface'
import Map from './Map/Map'
import style from './article.module.scss'
import Gallery from './Gallery/Gallery'

const Article: FC<IArticle> = ({ article }) => {
  return (
    <article className={style.content__article}>
      <div className={style.article__container}>
        <div className={style.article__title}>
          <h2>{article.name}</h2>
        </div>
        <div className={style.article__row}>
          <Gallery article={article} />
          <div className={style.row__text}>
            {article.text.map((text, id) => (
              <div key={id} className={style.text}>
                <span>{text}</span>
              </div>
            ))}
            <Map article={article} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default Article