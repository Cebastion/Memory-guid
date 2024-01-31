'use client'
import Link from 'next/link'
import style from './edit.module.scss'
import { IArticle } from '@/interface/Article.interface'
import { ChangeEvent, useState, useEffect } from 'react'
import { AdminService } from '../service/Admin.service'
import axios from 'axios'

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
  const [SelectPhoto, SetSelectPhoto] = useState<File | null>(null)

  const AddPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhoto = e.target.files[0]
      SetArticle({
        ...Article,
        article: {
          ...Article.article,
          image_hero: [...Article.article.image_hero, URL.createObjectURL(e.target.files[0])]
        }
      })
      SetSelectPhoto((prevSelectPhoto) => {
        return newPhoto
      })
    }
  }

  const AddArticle = async () => {
    const adminService = new AdminService()
    try {
      if (SelectPhoto) {
        const formData = new FormData()
        formData.append(`images`, SelectPhoto);

        await axios.post(`http://localhost:8800/upload/${Article.article.name}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
    } catch (error) {
      console.log(error)
    }
    const article = await adminService.AddArticle(Article)
    SetArticle(article)
  }

  const DeletePhoto = (indexToRemove: number) => {
    SetArticle((prevArticle) => ({
      ...prevArticle,
      article: {
        ...prevArticle.article,
        image_hero: prevArticle.article.image_hero.filter((_, index) => index !== indexToRemove),
      },
    }));
    SetSelectPhoto(null);
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
                <div key={index} className={style.img_blur} onClick={() => DeletePhoto(index)}>
                  <span>X</span>
                  <img src={img.startsWith('blob:') ? img : 'http://localhost:8800' + img} alt="hero" />
                </div>
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
          {Article.article.map_url && (
            <div className={style.preview__map}>
              <iframe src={Article.article.map_url} width="600" height="450" />
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
