import { useWishlistQuery } from "../hooks/queries"
import { useRemoveWishlistMutation, useClearWishlistMutation } from "../hooks/mutations"
import { Link, useNavigate } from "react-router-dom"
import type { IProduct } from "../utils/types"
import type { ICategory } from "../api/category.api"
import { HiEye, HiHeart, HiTrash } from "react-icons/hi"
import { ArrowRight, Star } from "lucide-react" // Removed ShoppingCart
import { Spinner } from "flowbite-react"

export function WishlistPage() {
  const { data, isPending } = useWishlistQuery()
  const removeWishlistMutation = useRemoveWishlistMutation()
  const clearWishlistMutation = useClearWishlistMutation()
  const navigate = useNavigate()

  const handleRemoveFromWishlist = (productId: string) => {
    removeWishlistMutation.mutate(productId)
  }

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlistMutation.mutate()
    }
  }

  const wishlistProducts = data?.wishlists[0]?.products || []

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-2 py-12 animate-fade-in">
      <div className="flex items-end justify-between mb-8 pr-2 lg:pr-0">
        <div>
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
            Your Collection
          </span>
          <h2 className="text-3xl md:text-4xl text-slate-900 font-bold mt-1">
            My Wishlist
          </h2>
          <p className="text-slate-600 mt-2">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={handleClearWishlist}
            disabled={clearWishlistMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <HiTrash size={18} />
            Clear All
          </button>
        )}
      </div>

      {isPending ? (
        <div className="bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-50 py-12">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-700 font-semibold">Loading your wishlist...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait</p>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <HiHeart size={40} className="text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Your wishlist is empty</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Start adding items to your wishlist and they'll appear here for easy access later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product: IProduct) => (
            <div
              key={product._id}
              className="group relative bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Remove from Wishlist Button */}
              <button
                onClick={() => handleRemoveFromWishlist(product._id)}
                disabled={removeWishlistMutation.isPending}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 shadow-sm"
                title="Remove from wishlist"
              >
                <HiHeart size={18} fill="currentColor" />
              </button>

              {/* Image */}
              <div 
                className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <img
                  src={`http://localhost:3000/uploads/product-images/${product.images[0]}`}
                  alt={product.title}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                  {(product.category as ICategory).name}
                </p>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm text-slate-600 font-medium">
                    {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {product.discountPrice ? (
                    <p className="text-xl font-black text-slate-900">
                      ${product.discountPrice}
                      <span className="line-through text-gray-400 ml-2 text-sm font-normal">
                        ${product.price}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xl font-black text-slate-900">
                      ${product.price}
                    </p>
                  )}
                </div>

                {/* Single Full-Width Action Button */}
                <div className="pt-3">
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 font-medium shadow-sm active:scale-95"
                  >
                    <HiEye size={20} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}