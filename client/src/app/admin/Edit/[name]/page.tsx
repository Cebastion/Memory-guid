'use client'
import { IArticle } from '@/interface/Article.interface'
import { ChangeEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminService } from '../../service/Admin.service'
import style from './edit.module.scss'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function page({ params }: { params: { name: string } }) {
  const article: IArticle = {
    article: {
      _id: '',
      name: '',
      image_hero: '',
      map_url: '',
      text: []
    }
  }

  const [EditArticle, SetEditArticle] = useState<IArticle>(article)
  const [Preview, SetPreview] = useState<string>('')
  const [Photo, SetPhoto] = useState<File | null>(null)
  const router = useRouter() 

  const SaveEditArticle = async () => {
    try {
      if (Photo && !!Photo) {
        const formData = new FormData()
        formData.append(`image`, Photo)
        formData.append(`_id`, EditArticle.article._id)
        formData.append('name', EditArticle.article.name)
        EditArticle.article.text.map((el, index) => {
          formData.append(`text[${index}]`, el)
        })
        formData.append('map_url', EditArticle.article.map_url)

        axios.post(`https://memory-guid-server.vercel.app/edit/?_id=${EditArticle.article._id}`, formData).then(res => {
          if(res.data === "Successfully")
            router.push('/admin')
        })
      } else {
        const formData = new FormData()
        formData.append(`_id`, EditArticle.article._id)
        formData.append('name', EditArticle.article.name)
        EditArticle.article.text.map((el, index) => {
          formData.append(`text[${index}]`, el)
        })
        formData.append('map_url', EditArticle.article.map_url)

        axios.post(`https://memory-guid-server.vercel.app/edit`, formData).then(res => {
          if(res.data === "Successfully")
            router.push('/admin')
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const GetArticle = async () => {
    const adminService = new AdminService()
    const article: IArticle = await adminService.GetArticle(decodeURIComponent(params.name))
    SetEditArticle(article)
  }

  useEffect(() => {
    GetArticle()
  }, [])


  const PreviewPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      SetPreview(URL.createObjectURL(e.target.files[0]))
      SetPhoto(e.target.files[0])
    }
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
                <label className={style.add_img}>
                  <input type="file" style={{ display: 'none' }} onChange={PreviewPhoto} />
                  <div className={style.add_img_block} style={{ backgroundImage: `url(${Preview ? Preview : `https://memory-guid-server.vercel.app/${EditArticle.article._id}`})` }}>
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