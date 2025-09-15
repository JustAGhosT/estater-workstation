import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Estate Research Workstation',
  description: 'South African estate files research platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Estate Research Workstation</h1>
        </header>
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}