'use client'
import { IArticle } from '@/interface/Article.interface'
import { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminService } from '../../service/Admin.service'
import style from './edit.module.scss'
import axios from 'axios'

export default function page({ params }: { params: { name: string } }) {
  const article: IArticle = {
    article: {
      _id: '',
      name: '',
      image_street: [],
      image_hero: [],
      map_url: '',
      text: []
    }
  }

  const [EditArticle, SetEditArticle] = useState<IArticle>(article)
  const [SelectPhoto, SetSelectPhoto] = useState<File | null>(null)

  const SaveEditArticle = async () => {
    const adminService = new AdminService()

    try {
      if (SelectPhoto) {
        const formData = new FormData()
          formData.append(`images`, SelectPhoto)

        await axios.post(`http://localhost:8800/upload/${EditArticle.article.name}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
    } catch (error) {
      console.log(error)
    }

    const article: IArticle = await adminService.SaveEditArticle(EditArticle)
    SetEditArticle(article)
  }

  const GetArticle = async () => {
    const adminService = new AdminService()
    const article: IArticle = await adminService.GetArticle(decodeURIComponent(params.name))
    SetEditArticle(article)
  }

  useEffect(() => {
    GetArticle()
  }, [])


  const AddPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhoto = e.target.files[0]
      SetEditArticle({
        ...EditArticle,
        article: {
          ...EditArticle.article,
          image_hero: [...EditArticle.article.image_hero, URL.createObjectURL(e.target.files[0])]
        }
      })
      SetSelectPhoto((prevSelectPhoto) => {
        return newPhoto
      })
    }
  }

  useEffect(() => {
    console.log(SelectPhoto);
  }, [SelectPhoto])

  const DeletePhoto = (indexToRemove: number) => {
    axios.post(`http://localhost:8800/delete_img/${indexToRemove}`)
      .then((res) => {
        if (res.status === 200) {
          SetEditArticle((prevArticle) => ({
            ...prevArticle,
            article: {
              ...prevArticle.article,
              image_hero: prevArticle.article.image_hero.filter((_, index) => index !== indexToRemove),
            },
          }))
          SetSelectPhoto(null)
        }
      })
      .catch(error => {
        console.error('Ошибка при отправке запроса:', error)
      })
  }

  return (
    <div className={style.admin__block}>
      <header className={style.admin__header}>
        <button className={style.admin__exit} onClick={() => SetEditArticle(article)}>
          <Link href='/admin'>Вийти</Link>
        </button>
        <div className={style.admin__title}>
          <h1>Редагування вулиці</h1>
        </div>
        <button className={style.admin__button} onClick={SaveEditArticle}>
          Зберегти
        </button>
      </header>
      <main className={style.admin__content}>
        {EditArticle ?
          <form className={style.admin__form}>
            <div className={style.form__group}>
              <label className={style.form__label}>Назва вулици</label>
              <input className={style.form__input} type="text" value={EditArticle.article.name} onChange={(e) => SetEditArticle({ ...EditArticle, article: { ...EditArticle.article, name: e.target.value } })} />
            </div>
            <div className={style.form__group}>
              <label className={style.form__label}>Картинки</label>
              <div className={style.form__row}>
                {EditArticle.article.image_hero && EditArticle.article.image_hero.map((img, index) => (
                  <div key={index} className={style.img_blur} onClick={() => DeletePhoto(EditArticle.article._id)}>
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
          :
          <div className={style.admin__error}>Помилка в видачі данних</div>}
      </main>
    </div>
  )
}