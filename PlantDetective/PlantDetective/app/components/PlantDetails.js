import ImagePreview from './ImagePreview';

export default function PlantDetails({ data, imageUrl, onReset }) {
  // Check if this is sample data
  const isSampleData = data._notice !== undefined;
  
  return (
    <div className="card max-w-4xl mx-auto dark:bg-gray-800 dark:shadow-xl">
      {/* Sample Data Alert Banner */}
      {isSampleData && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-600">
          <p className="font-bold mb-1">⚠️ Demo Mode Active</p>
          <p className="text-sm">
            This is sample data for demonstration purposes. The application is showing the same 
            plant regardless of your image. To enable real plant identification, a valid OpenAI API key is required.
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/5">
          <ImagePreview imageUrl={imageUrl} />
          <button onClick={onReset} className="btn-secondary w-full dark:text-green-400 dark:border-green-600 dark:hover:bg-gray-700">
            Identify Another Plant
          </button>
        </div>
        
        <div className="md:w-3/5">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">{data.commonName}</h2>
          <p className="text-gray-500 dark:text-gray-400 italic mb-4">{data.scientificName}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{data.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Care Tips</h3>
            <div className="space-y-3">
              {data.careTips && data.careTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-green-500 dark:text-green-400 mr-2">•</span>
                  <p className="text-gray-700 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
          
          {data.funFacts && data.funFacts.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Fun Facts</h3>
              <div className="space-y-2">
                {data.funFacts.map((fact, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 dark:text-green-400 mr-2">•</span>
                    <p className="text-gray-700 dark:text-gray-300">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
