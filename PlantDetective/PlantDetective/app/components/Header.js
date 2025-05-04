import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="/img/leaf-icon.svg" 
            alt="PlantID Logo" 
            width={36} 
            height={36} 
            className="mr-3"
          />
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">PlantID</h1>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="mr-2">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200">
                  About
                </a>
              </li>
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
