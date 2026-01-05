import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/queries";
import type { IProduct } from "../../utils/types";
import { HiEye } from "react-icons/hi";
import { ArrowRight, Star } from "lucide-react";
import type { ICategory } from "../../api/category.api";
import { Spinner } from "flowbite-react";

const FeatureProducts = () => {
  const { data, isPending } = useProducts();
  const navigate = useNavigate();

  const featuredProducts = data?.products?.filter(
    (product: IProduct) => product.isFeatured
  );
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-2 py-12 animate-fade-in">
      <div className="flex items-end justify-between mb-8 pr-2 lg:pr-0">
        <div>
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
            Our Top Picks
          </span>
          <h2 className="text-3xl md:text-4xl text-slate-900 font-bold mt-1">
            Featured Products
          </h2>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          View All Products <ArrowRight size={18} />
        </Link>
      </div>

      {/* Product Grid */}
      {!isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: IProduct) => (
            <div
              key={product._id}
              className="group relative bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image Placeholder */}
              <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                  NEW
                </div>
                <img
                  src={`http://localhost:3000/uploads/product-images/${product.images[0]}`}
                  alt={product.title}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                  {(product.category as ICategory).name}
                </p>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm text-slate-600 font-medium">
                    {product.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3">
                  {product.discountPrice ? (
                    <p className="text-xl font-black text-slate-900">
                      ${product.discountPrice}
                      <span className="line-through text-gray-500 ml-2 text-lg font-medium">
                        ${product.price}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xl font-black text-slate-900">
                      ${product.price}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <HiEye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-50">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-700 font-semibold">
            fetching product...
          </p>
          <p className="text-sm text-gray-500 mt-1">Please wait</p>
        </div>
      )}

      {/* Mobile View All Button */}
      <div className="mt-8 sm:hidden">
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 w-full py-4 border-2 border-slate-100 rounded-xl font-bold text-slate-800"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeatureProducts;
