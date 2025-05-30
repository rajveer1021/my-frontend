export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 animate-pulse">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-6">
        <div className="h-12 bg-white/20 rounded w-3/4 mx-auto"></div>
        <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
        <div className="h-12 bg-white/20 rounded-lg w-48 mx-auto"></div>
      </div>
    </div>
  </div>
);

export const FilterSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-24"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded w-20"></div>
        ))}
      </div>
    </div>
  </div>
);