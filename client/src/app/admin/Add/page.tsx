'use client'
import Link from 'next/link'
import style from './edit.module.scss'
import { IArticle } from '@/interface/Article.interface'
import { ChangeEvent, useState } from 'react'
import { randomBytes } from 'crypto'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Add() {
  const article: IArticle = {
    article: {
      _id: '',
      name: '',
      image_hero: '',
      map_url: '',
      text: []
    }
  }

  const [Article, SetArticle] = useState<IArticle>(article)
  const [Preview, SetPreview] = useState<string>('')
  const [Photo, SetPhoto] = useState<File | null>(null)
  const router = useRouter()

  const PreviewPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      SetPreview(URL.createObjectURL(e.target.files[0]))
      SetPhoto(e.target.files[0])
    }
  }

  const AddArticle = async () => {
    try {
      if (Photo) {
        const _id = randomBytes(12).toString('hex')
        const formData = new FormData()
        formData.append(`image`, Photo)
        formData.append(`_id`, _id)
        formData.append('name', Article.article.name)
        Article.article.text.map((el, index) => {
          formData.append(`text[${index}]`, el)
        })
        formData.append('map_url', Article.article.map_url)

        axios.post(`https://memory-guid-server.vercel.app/add/?_id=${_id}`, formData).then(res => {
          if (res.data === "Successfully")
            router.push('/admin')
        })
      }
    } catch (error) {
      console.log(error)
    }
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
              <label className={style.add_img}>
                <input type="file" style={{ display: 'none' }} onChange={PreviewPhoto} />
                <div className={style.add_img_block} style={{ backgroundImage: `url(${Preview ? Preview : `https://memory-guid-server.vercel.app/image/${Article.article._id}`})` }}>
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
