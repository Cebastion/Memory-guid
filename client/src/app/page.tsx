'use client'
import Header from '@/components/Header/Header'
import Main from '@/components/Main/Main'
import { useState } from 'react'


export default function Home() {
  const [Active, SetActive] = useState<boolean>(false)
  return (
    <>
      <Header Active={Active} SetActive={SetActive}/>
      <Main SetActive={SetActive} Active={Active}/>
    </>
  )
}
