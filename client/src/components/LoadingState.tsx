export function LoadingState() {
  return (
    <>
      <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              
              <div className="flex items-center">
                <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="ml-6">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-750 p-4 rounded-lg">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hourly Forecast Loading Skeleton */}
      <div className="mb-10">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-4">
          <div className="flex space-x-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 min-w-[80px]">
                <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Daily Forecast Loading Skeleton */}
      <div className="mb-10">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 md:p-6 flex items-center justify-between">
                <div className="w-24 md:w-36">
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
