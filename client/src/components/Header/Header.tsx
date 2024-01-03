'use client'

import { IActiveBurger } from '@/interface/ActiveBurger.interface'
import { FC, useEffect, useState } from 'react'
import style from './header.module.scss'

const Header: FC<IActiveBurger> = ({ Active, SetActive }) => {
  const BreakPoint = 575
  const [screenWidth, SetScreenWidth] = useState<number>(0)
  const [Title, setTitle] = useState<string>('')

  const updateScreenWidth = () => {
    SetScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    updateScreenWidth()
    window.addEventListener('resize', updateScreenWidth)

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
    }
  }, [screenWidth])

  useEffect(() => {
    setTitle(screenWidth > BreakPoint ? 'Путівник пам‘яті «Вулицями Кам‘янського»' : 'ППВК')
  }, [screenWidth])

  return (
    <header className={style.header}>
      <div className={style.header__container}>
        <div className={style.header__logo}>
          <img src="/logo.webp" alt="logo" />
        </div>
        <div className={style.header__title}>
          <h1>{Title}</h1>
        </div>
        <div className={Active ? `${style.burger} ${style.active}` : style.burger} onClick={() => SetActive(!Active)}>
          <span></span>
        </div>
      </div>
    </header>
  )
}

export default Header