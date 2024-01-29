'use client'
import Link from 'next/link'
import style from './edit.module.scss'
import { IArticle } from '@/interface/Article.interface'
import { ChangeEvent, useState } from 'react'
import { AdminService } from '../service/Admin.service'

export default function Add() {
  const article: IArticle = {
    article: {
      name: '',
      image_street: [],
      image_hero: [],
      map_url: '',
      text: []
    }
  }

  const [Article, SetArticle] = useState<IArticle>(article)

  const AddPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      SetArticle({
        ...Article,
        article: {
          ...Article.article,
          image_hero: [...Article.article.image_hero, URL.createObjectURL(e.target.files[0])]
        }
      })
    }
  }

  const AddArticle = async () => {
    const adminService = new AdminService()
    const article: IArticle = await adminService.AddArticle(Article)
    SetArticle(article)
  }

  return (
    <div className={style.admin__block}>
      <header className={style.admin__header}>
        <button className={style.admin__exit} onClick={() => SetArticle(article)}>
          <Link href='/admin'>Вийти</Link>
        </button>
        <div className={style.admin__title}>
          <h1>Створити вулицю</h1>
        </div>
        <button className={style.admin__button} onClick={AddArticle}>
          Створити
        </button>
      </header>
      <main className={style.admin__content}>
        <form className={style.admin__form}>
          <div className={style.form__group}>
            <label className={style.form__label}>Назва вулици</label>
            <input className={style.form__input} type="text" value={Article.article.name} onChange={(e) => SetArticle({ ...Article, article: { ...Article.article, name: e.target.value } })} />
          </div>
          <div className={style.form__group}>
            <label className={style.form__label}>Картинки</label>
            <div className={style.form__row}>
              {Article.article.image_hero && Article.article.image_hero.map((img, index) => (
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
            <textarea value={Article.article.text.join('\n')} onChange={(e) => SetArticle({ ...Article, article: { ...Article.article, text: e.target.value.split('\n') } })} />
          </div>
          <div className={style.form__group}>
            <label className={style.form__label}>Посилання на карту</label>
            <input className={style.form__input} type="text" value={Article.article.map_url} onChange={(e) => SetArticle({ ...Article, article: { ...Article.article, map_url: e.target.value } })} />
          </div>
          <div className={style.preview__map}>
          {Article.article.map_url && (<iframe src={Article.article.map_url} width="600" height="450" />)}
          </div>
        </form>
      </main>
    </div>
  )
}
