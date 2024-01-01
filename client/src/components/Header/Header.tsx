import { FC, useState } from 'react'
import style from './header.module.scss'
import { IActiveBurger } from '@/interface/ActiveBurger.interface'

const Header: FC<IActiveBurger> = ({Active, SetActive}) => {
  return (
    <header className={style.header}>
      <div className={style.header__container}>
        <div className={style.header__logo}>
          <img src="/logo.webp" alt="logo" />
        </div>
        <div className={style.header__title}>
          <h1>Путівник пам’яті вулицями Кам’янського</h1>
        </div>
        <div className={Active ? `${style.burger} ${style.active}` : style.burger} onClick={() => SetActive(!Active)}>
          <span></span>
        </div>
      </div>
    </header>
  )
}

export default Header