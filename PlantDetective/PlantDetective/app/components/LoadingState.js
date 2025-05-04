export default function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 dark:border-green-400 mb-4"></div>
      <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Identifying your plant...</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds</p>
    </div>
  );
}
