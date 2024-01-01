'use client'

import { FC, useState, useEffect } from 'react'
import style from './header.module.scss'
import { IActiveBurger } from '@/interface/ActiveBurger.interface'

const Header: FC<IActiveBurger> = ({Active, SetActive}) => {
  const BreakPoint = 575
  const [screenWidth, SetScreenWidth] = useState(0)

  useEffect(() => {
    const updateScreenWidth = () => {
      SetScreenWidth(window.innerWidth)
    }
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth)
    return () => {
      window.removeEventListener('resize', updateScreenWidth)
    }
  }, [])

  return (
    <header className={style.header}>
      <div className={style.header__container}>
        <div className={style.header__logo}>
          <img src="/logo.webp" alt="logo" />
        </div>
        <div className={style.header__title}>
          <h1>{screenWidth === BreakPoint ? 'Путівник пам’яті вулицями Кам’янського' : 'ППВК'}</h1>
        </div>
        <div className={Active ? `${style.burger} ${style.active}` : style.burger} onClick={() => SetActive(!Active)}>
          <span></span>
        </div>
      </div>
    </header>
  )
}

export default Header