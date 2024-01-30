'use client'
import { ChangeEvent, FC, useState } from 'react'
import style from './article.module.scss'
import { IEditArticle } from '../../interface/EditArticle.interface'

const ArticlePage: FC<IEditArticle> = ({ EditArticle, SetEditArticle }) => {
  const AddPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      SetEditArticle({
        ...EditArticle,
        article: {
          ...EditArticle.article,
          image_hero: [...EditArticle.article.image_hero, URL.createObjectURL(e.target.files[0])]
        }
      })
    }
  }

  return (
    <form className={style.admin__form}>
      <div className={style.form__group}>
        <label className={style.form__label}>Назва вулици</label>
        <input className={style.form__input} type="text" value={EditArticle.article.name} onChange={(e) => SetEditArticle({ ...EditArticle, article: { ...EditArticle.article, name: e.target.value } })} />
      </div>
      <div className={style.form__group}>
        <label className={style.form__label}>Картинки</label>
        <div className={style.form__row}>
          {EditArticle.article.image_hero && EditArticle.article.image_hero.map((img, index) => (
            <img key={index} src={img.startsWith('blob:') ? img : 'http://localhost:8800' + img} alt="hero" />
          ))}
          <label className={style.add_img}>
            <input type="file" style={{ display: 'none' }} onChange={AddPhoto} />
            <div className={style.add_img_block}>
              <span>+</span>
            </div>
          </label>
        </div>
      </div>
      <div className={style.form__group}>
        <label className={style.form__label}>Опис</label>
        <textarea value={EditArticle.article.text.join('\n')} onChange={(e) => SetEditArticle({ ...EditArticle, article: { ...EditArticle.article, text: e.target.value.split('\n') } })} />
      </div>
      <div className={style.form__group}>
        <label className={style.form__label}>Посилання на карту</label>
        <input className={style.form__input} type="text" value={EditArticle.article.map_url} onChange={(e) => SetEditArticle({ ...EditArticle, article: { ...EditArticle.article, map_url: e.target.value } })} />
      </div>
      {EditArticle.article.map_url && (
        <div className={style.preview__map}>
          <iframe src={EditArticle.article.map_url} width="600" height="450" />
        </div>
      )}
    </form>
  )
}

export { ArticlePage }
