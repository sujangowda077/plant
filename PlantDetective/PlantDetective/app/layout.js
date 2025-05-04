import './globals.css';

export const metadata = {
  title: 'PlantID - Identify Plants with AI',
  description: 'Upload plant photos and get instant identification using Google Gemini AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
