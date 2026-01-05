import { useEffect, useState } from "react";
import type { IProduct } from "../../utils/types";
import { Modal, ModalHeader } from "flowbite-react";

export function ProductDetailModal({
  product,
  openProductDetailModal,
  setOpenProductDetailModal,
}: {
  product: IProduct | null;
  openProductDetailModal: boolean;
  setOpenProductDetailModal: (open: boolean) => void;
}) {
  if(!openProductDetailModal || !product) return
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeImgage, setActiveImage] = useState<string>("")

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if(product.images.length > 0) setActiveImage(product.images[0])
  },[product])

  return (
    <Modal
      dismissible
      show={openProductDetailModal}
      onClose={() => setOpenProductDetailModal(false)}
      size="4xl"
    >
      <ModalHeader>{product?.title}</ModalHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img 
                src={`http://localhost:3000/uploads/product-images/${activeImgage}`} 
                alt={product?.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product?.images && product.images.map((img, idx) => (
                <button 
                  key={idx}
                  className={`shrink-0 w-20 h-20 rounded-lg transition-all border-2 border-gray-300`}
                >
                  <img onClick={() => setActiveImage(img)} src={`http://localhost:3000/uploads/product-images/${img}`} className="w-full h-full object-cover rounded-md" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-widest">{product?.brand}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product?.title}</h1>
            
            <div className="flex items-center mt-3 gap-4">
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                <span className="text-yellow-700 font-bold text-sm">★ {product?.rating}</span>
              </div>
              <span className="text-sm text-gray-500">Free Shipping Available</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">${product?.discountPrice}</span>
              {product?.price > product?.discountPrice && (
                <span className="text-lg text-gray-400 line-through">${product?.price}</span>
              )}
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {product?.description}
            </p>

            {/* Variants Selection */}
            {product?.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900">Select Options</h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {product.variants.map((v) => (
                    <button
                      className="p-3 text-left border rounded-lg transition-all border-gray-200 hover:border-gray-300"
                    >
                      <p className="text-xs font-bold text-gray-900">{v.color} {v.storage}</p>
                      <p className="text-xs text-gray-500 mt-1">{v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900">Specifications</h3>
              <dl className="mt-4 space-y-2">
                {product?.specifications && Object.entries(product.specifications)?.map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-50">
                    <dt className="text-gray-500">{key}</dt>
                    <dd className="font-medium text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
    </Modal>
  );
}
