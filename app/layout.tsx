import { Toaster } from "sonner";
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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors closeButton position="top-center" />
          <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                ExamPredictor
              </h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="max-w-6xl mx-auto p-4 pt-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}