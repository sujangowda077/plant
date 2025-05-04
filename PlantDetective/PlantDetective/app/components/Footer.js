export default function Footer() {
  return (
    <footer className="bg-green-800 dark:bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">PlantID</h3>
            <p className="text-green-200 dark:text-green-300 text-sm">
              Powered by Google Gemini AI
            </p>
          </div>
          <div>
            <p className="text-green-200 dark:text-green-300 text-sm">
              © {new Date().getFullYear()} PlantID. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
