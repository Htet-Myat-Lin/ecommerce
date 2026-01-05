import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/queries";
import { useState, useEffect } from "react";
import type { IVariant } from "../../utils/types";
import { Star, Truck, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Header } from "../../components/header/Header";
import { useCartStore } from "../../store/cartStore";
import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} from "../../hooks/mutations";
import { isInWishlistApi } from "../../api/wishlist.api";
import { ReviewComponent } from "../../components/ui/ReviewComponent";

const IMAGE_BASE = "http://localhost:3000/uploads/product-images/";

export function ProductDetail() {
  const { id } = useParams();
  const { data, isPending } = useProduct(id as string);
  const { mutate: addToWishlist, isPending: addingToWishlist } =
    useAddWishlistMutation();
  const { mutate: removeFromWishlist, isPending: removingFromWishlist } =
    useRemoveWishlistMutation();
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addItem } = useCartStore();

  // Sync active image when data loads
  useEffect(() => {
    if (data?.product?.images?.length > 0) {
      setActiveImage(data.product.images[0]);
    }
    if (data?.product?.variants?.length > 0) {
      setSelectedVariant(data.product.variants[0]);
    }
  }, [data]);

  const checkWishlistStatus = () => {
    isInWishlistApi(id as string).then((res) => {
      setIsInWishlist(res.isInWishlist);
    })
  };

  useEffect(() => {
    checkWishlistStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select one variant");
      return;
    }
    addItem({
      product: data.product,
      quantity,
      variantSku: selectedVariant.sku,
      price: selectedVariant.price
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(data.product._id as string,{ onSuccess: () =>  setIsInWishlist(false)});
    } else {
      addToWishlist(data.product._id as string, { onSuccess: () =>  setIsInWishlist(true)});
    }
  };

  if (isPending)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );

  const product = data?.product;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 shadow-inner">
              <img
                src={`${IMAGE_BASE}${activeImage}`}
                alt={product?.title}
                className="h-full w-full object-contain p-8 mix-blend-multiply transition-opacity duration-300"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product?.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all border-2 
                  ${
                    activeImage === img
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={`${IMAGE_BASE}${img}`}
                    className="h-full w-full object-cover"
                    alt="thumbnail"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                {product?.brand}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {product?.title}
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-md">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-700 font-bold text-sm">
                    {product?.rating}
                  </span>
                </div>
                <div className="h-4 w-1px bg-gray-200" />
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <Truck size={18} />
                  <span>Fast & Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Wishlist Button */}
            <div className="mt-4">
              <button
                onClick={handleWishlistToggle}
                disabled={addingToWishlist || removingFromWishlist}
              >
                {isInWishlist ? (<Heart className="fill-red-600 text-red-600" />) : (<Heart className="text-gray-600" />)}
              </button>
            </div>

            {/* Pricing */}
            <div className="mt-6 p-4 rounded-2xl bg-gray-50 flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">
                ${selectedVariant?.price}
              </span>
              {product?.price > product?.discountPrice && (
                <span className="text-xl text-gray-400 line-through font-medium">
                  ${product?.price}
                </span>
              )}
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                SAVE ${(product?.price - product?.discountPrice).toFixed(0)}
              </span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed italic">
              "{product?.description}"
            </p>

            {/* Variants Selection */}
            {product?.variants && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900">
                  Choose Variant
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {product.variants.map((v: IVariant, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-4 text-left border-2 rounded-2xl transition-all 
                      ${
                        selectedVariant === v
                          ? "border-blue-600 bg-blue-50/30"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <p className="font-bold text-gray-900 leading-none">
                        {v.color} {v.storage}
                      </p>
                      <p className="mt-2 text-xs font-medium text-gray-500">
                        {v.stock > 0
                          ? `${v.stock} units available`
                          : "Out of stock"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-100 rounded-xl px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-blue-600"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:text-blue-600"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Specs Accordion-style */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase">
                  Product Details
                </h3>
              </div>
              <div className="px-5 py-3">
                <dl className="divide-y divide-gray-50">
                  {product?.specifications &&
                    Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-3 text-sm"
                        >
                          <dt className="text-gray-500 font-medium">{key}</dt>
                          <dd className="font-semibold text-gray-900">
                            {value as string}
                          </dd>
                        </div>
                      )
                    )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 mt-12">
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <button
              onClick={() => {
                const element = document.getElementById("review-form");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Write a Review
            </button>
          </div>
        </div>
        <ReviewComponent productId={id as string} />
      </div>
    </>
  );
}
