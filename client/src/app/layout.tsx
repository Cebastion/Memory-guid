import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Путівник пам’яті вулицями Кам’янського',
  description: 'Путівник пам’яті вулицями Кам’янського',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
