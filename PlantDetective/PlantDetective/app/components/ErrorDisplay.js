export default function ErrorDisplay({ message, onReset }) {
  return (
    <div className="text-center py-8 max-w-md mx-auto">
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Identification Failed</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
        <button onClick={onReset} className="btn-primary bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
          Try Again
        </button>
      </div>
    </div>
  );
}
