import { FC } from 'react'
import style from './header.module.scss'

const Header: FC = () => {
  return (
    <header className={style.header}>
      <div className={style.header__container}>
        <div className={style.header__logo}>
          <img src="/logo.webp" alt="logo" />
        </div>
        <div className={style.header__title}>
          <h1>Путівник пам’яті вулицями Кам’янського</h1>
        </div>
      </div>
    </header>
  )
}

export default Header