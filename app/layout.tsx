import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ExamPredictor - AI Powered Question Forecast',
  description: 'Upload past papers and textbooks to predict upcoming exam questions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur z-50">
            <h1 className="text-xl font-bold">ExamPredictor</h1>
            <ThemeToggle />
          </header>
          <main className="container mx-auto max-w-4xl p-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}