import { useFormContext } from 'react-hook-form';
import type { ProductFormValues } from '../../../utils/schema';
import { Package, DollarSign, Tag, Image, FileText, Star } from 'lucide-react';

const StepReview = () => {
  const { getValues, watch } = useFormContext<ProductFormValues>();
  const values = getValues();
  const newImages = values?.images?.map((image) => URL.createObjectURL(image))
  const existingImages = watch("existingImages")

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Card */}
      <div className="from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-2xl text-gray-800">{values.title}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {values.slug}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">{values.brand}</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-medium">{values.category}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{values.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-700">${values.price}</span>
            {values.discountPrice > 0 && (
              <span className="text-lg text-gray-500 line-through">${values.discountPrice}</span>
            )}
          </div>
          {values.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-700">{values.rating.toFixed(1)}</span>
            </div>
          )}
          {values.isFeatured && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Featured</span>
          )}
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          Product Variants ({values.variants.length})
        </h4>
        {values.variants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-3 text-left font-semibold text-gray-700">SKU</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Color</th>
                  <th className="p-3 text-left font-semibold text-gray-700">RAM</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Storage</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Price</th>
                  <th className="p-3 text-left font-semibold text-gray-700">Stock</th>
                </tr>
              </thead>
              <tbody>
                {values.variants.map((v, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono text-xs">{v.sku}</td>
                    <td className="p-3">{v.color || '-'}</td>
                    <td className="p-3">{v.ram || '-'}</td>
                    <td className="p-3 font-medium">{v.storage}</td>
                    <td className="p-3 font-semibold text-green-700">${v.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        v.stock > 50 ? 'bg-green-100 text-green-700' : 
                        v.stock > 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {v.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No variants configured</p>
        )}
      </div>

      {/* Specifications Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-700" />
          Technical Specifications ({values.specifications.length})
        </h4>
        {values.specifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {values.specifications.map((spec, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700 text-sm">{spec.key}</span>
                <span className="text-gray-900 text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No specifications added</p>
        )}
      </div>

      {/* Images Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-gray-700" />
          Product Images ({values?.images?.length})
        </h4>
        {newImages && newImages.length > 0 && (
          <div className='mb-3.5'>
            <p className='mb-2 text-gray-600'>New Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {newImages?.map((img, i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                  <img 
                    src={img} 
                    alt={`Product ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate" title={img}>Image {i + 1}</p>
              </div>
            ))}
          </div>
          </div>
        )}
        {existingImages && existingImages.length > 0 && (
          <div>
            <p className='mb-2 text-gray-600'>Existing Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
                  <img 
                    src={`http://localhost:3000/uploads/product-images/${img}`} 
                    alt={`Product ${i + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate" title={img}>Image {i + 1}</p>
              </div>
            ))}
          </div>
          </div>
        )} 
        {!existingImages && !newImages &&(
          <p className="text-gray-500 text-sm italic">No images added</p>
        )}
      </div>
    </div>
  );
};

export default StepReview;