import { FC } from 'react'
import { IArticle } from '@/interface/Article.interface'
import style from './map.module.scss'

const Map: FC<IArticle> = ({article}) => {
  return (
    <>
      <iframe className={style.map} title="map" src={article.map_url} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </>
  )
}

export default Map