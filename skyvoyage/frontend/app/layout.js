import './globals.css';
import { Inter } from 'next/font/google';
import ChatBot from './components/ui/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkyVoyage — Premium Flight Booking',
  description: 'Experience the world with SkyVoyage. Premium flight booking with real-time tracking, AI assistance, and exclusive deals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
