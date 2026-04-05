import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import PageLoader from '@/components/PageLoader'
import ChatbotWidget from '@/components/ChatbotWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SkyVoyage — Premium Flight Booking',
  description: 'Experience the world with SkyVoyage. Premium flight booking with real-time tracking, AI assistance, and exclusive deals.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PageLoader />
          <div id="app">
            <div id="loader" className="loader">
              <div style={{ textAlign: 'center' }}>
                <div className="loader-logo">✈️</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '5px', color: 'var(--text-muted)', marginTop: '2rem' }}>
                  PREPARING SKYVOYAGE
                </div>
              </div>
            </div>
            {children}
            <ChatbotWidget />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--glass-bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
