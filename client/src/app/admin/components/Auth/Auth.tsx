'use client'
import { IAuth } from '../../interface/Auth.inteface'
import style from '@/app/admin/components/Auth/Auth.module.scss'
import { AdminService } from '../../service/Admin.service'
import { useState } from 'react'
import { IAdmin } from '../../interface/Admin.interface'

export default function Auth({SetIsAdmin}: IAuth) {
  const admin: IAdmin = {
    email: '',
    password: ''
  }

  const [Admin, SetAdmin] = useState<IAdmin>(admin)
  const [Email, SetEmail] = useState<string>('')
  const [Password, SetPassword] = useState<string>('')

  const SendAuth = async () => {
      SetAdmin({email: Email, password: Password})
      const adminService = new AdminService()
      const resualt = await adminService.SignIn(Admin)
      if(resualt === true) {
        SetIsAdmin(true)
      }
      else {
        SetIsAdmin(false)
      }
  }

  return (
    <form className={style.form__auth}>
      <div className={style.auth__title}>
        <h1>Вхід в Адмінку</h1>
      </div>
      <div className={style.auth__input}>
        <label htmlFor="">Почта:</label>
        <input type="text" value={Email} onChange={e => SetEmail(e.target.value)}/>
      </div>
      <div className={style.auth__input}>
        <label htmlFor="">Пароль:</label>
        <input type="password" value={Password}  onChange={e => SetPassword(e.target.value)}/>
      </div>
      <button className={style.auth__button} onClick={SendAuth}>
        Увійти
      </button>
    </form>
  )
}