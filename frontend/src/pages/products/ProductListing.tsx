/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { useProducts } from "../../hooks/queries";
import { useCategories } from "../../hooks/queries";
import { Spinner, Checkbox } from "flowbite-react";
import { 
  Search,
  ChevronLeft, 
  ChevronRight,
  Star,
  SlidersHorizontal
} from "lucide-react";
import type { IProduct } from "../../utils/types";
import type { ICategory } from "../../api/category.api";
import { HiEye } from "react-icons/hi";

const IMAGE_BASE = "http://localhost:3000/uploads/product-images/";

export function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter values from URL
  const search = searchParams.get("search") || "";
  const selectedCategories = useMemo(() => searchParams.getAll("categoryIds"), [searchParams]);
  const selectedBrands = useMemo(() => searchParams.getAll("brand"), [searchParams]);
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const priceRangeParam = searchParams.get("priceRange");
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    priceRangeParam 
      ? JSON.parse(priceRangeParam)
      : { min: 0, max: 10000 }
  );
  
  const [localSearch, setLocalSearch] = useState(search);
  const [showFilters, setShowFilters] = useState(false);

  // Build filters object
  const filters = useMemo(() => {
    const filterObj: any = {
      page,
      limit: 6,
      sortBy,
    };
    
    if (localSearch) filterObj.search = localSearch;
    if (selectedCategories.length > 0) filterObj.categoryIds = selectedCategories;
    if (selectedBrands.length > 0) filterObj.brand = selectedBrands;
    if (priceRange.min > 0 || priceRange.max < 10000) {
      filterObj.priceRange = priceRange;
    }
    
    return filterObj;
  }, [localSearch, selectedCategories, selectedBrands, priceRange, sortBy, page]);

  const { data, isPending } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  
  const products = useMemo(() => data?.products || [], [data]);
  const totalPages = data?.totalPages || 1;
  const categories = categoriesData?.categories || [];

  // Get unique brands from products
  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p: IProduct) => brands.add(p.brand));
    return Array.from(brands).sort();
  }, [products]);

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      // Remove all existing instances of this key first
      newParams.delete(key);
      
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        // nothing to add
      } else if (Array.isArray(value)) {
        value.forEach(v => newParams.append(key, v));
      } else {
        // Set single value
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change (except when changing page itself)
    if (!updates.page) {
      newParams.set("page", "1");
    }
    
    setSearchParams(newParams);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = searchParams.getAll("categoryIds");
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    updateFilters({ categoryIds: newCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = searchParams.getAll("brand");
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    updateFilters({ brand: newBrands });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch || null });
  };

  const handleSortChange = (newSort: string) => {
    updateFilters({ sortBy: newSort });
  };

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    setPriceRange(newRange);
    updateFilters({ priceRange: JSON.stringify(newRange) });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    setPriceRange({ min: 0, max: 10000 });
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    search || 
    priceRange.min > 0 || 
    priceRange.max < 10000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">All Products</h1>
          <p className="text-slate-600">
            {isPending ? "Loading..." : `Found ${products.length} products`}
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } sm:block w-full sm:w-64 shrink-0 bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-3">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category: ICategory) => (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category._id || "")}
                      onChange={() => handleCategoryToggle(category._id || "")}
                    />
                    <span className="text-sm text-slate-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {uniqueBrands.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-slate-700 mb-3">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uniqueBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBrandToggle(brand);
                      }}
                    >
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        readOnly
                      />
                      <span className="text-sm text-slate-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-slate-700 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600 w-20">Min:</label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.min}
                      onChange={(e) => {
                        const newMin = Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRange.max));
                        handlePriceRangeChange({ ...priceRange, min: newMin });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600 w-20">Max:</label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) => {
                        const newMax = Math.min(10000, Math.max(parseInt(e.target.value) || 10000, priceRange.min));
                        handlePriceRangeChange({ ...priceRange, max: newMax });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">${priceRange.min}</span>
                  <span className="font-medium">${priceRange.max}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isPending ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size="xl" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-xl font-bold text-slate-900 mb-2">No products found</p>
                <p className="text-slate-600 mb-6">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: IProduct) => {
                    const category = typeof product.category === "object" 
                      ? product.category 
                      : null;
                    const displayPrice = product.discountPrice && product.discountPrice < product.price
                      ? product.discountPrice
                      : product.price;

                    return (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      >
                        {/* Image */}
                        <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                          {product.isFeatured && (
                            <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                              FEATURED
                            </div>
                          )}
                          <img
                            src={`${IMAGE_BASE}${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 font-medium uppercase">
                            {category?.name || "Uncategorized"}
                          </p>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.title}
                          </h3>

                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm text-slate-600 font-medium">
                              {product.rating || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              {product.discountPrice && product.discountPrice < product.price ? (
                                <div>
                                  <p className="text-xl font-black text-slate-900">
                                    ${product.discountPrice}
                                  </p>
                                  <p className="text-sm text-gray-500 line-through">
                                    ${product.price}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xl font-black text-slate-900">
                                  ${displayPrice}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/products/${product._id}`;
                              }}
                              className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                            >
                              <HiEye size={18} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateFilters({ page: (page - 1).toString() })}
                      disabled={page === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateFilters({ page: pageNum.toString() })}
                            className={`px-4 py-2 border rounded-lg font-medium ${
                              pageNum === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => updateFilters({ page: (page + 1).toString() })}
                      disabled={page === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

