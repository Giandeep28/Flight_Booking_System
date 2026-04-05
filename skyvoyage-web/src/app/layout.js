import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/common/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkyVoyage — Premium Flight Booking',
  description: 'Experience the world with SkyVoyage. Premium flight booking with real-time tracking, AI assistance, and exclusive deals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main id="app">
            {children}
          </main>
          {/* Footer would go here */}
        </AuthProvider>

        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </body>
    </html>
  );
}
