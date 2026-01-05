import { useFormContext, useFieldArray } from 'react-hook-form';
import type { ProductFormValues } from '../../../utils/schema';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

const StepVariantsSpecs = () => {
  const { register, control, formState: { errors } } = useFormContext<ProductFormValues>();

  const { fields: variantFields, append: addVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants"
  });

  const { fields: specFields, append: addSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications"
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* VARIANTS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Product Variants</h3>
            <p className="text-sm text-gray-500 mt-1">Add different variations of this product (e.g., colors, sizes, storage)</p>
          </div>
        </div>
        <div className="space-y-4">
          {variantFields.map((field, index) => (
            <div key={field.id} className="p-5 border-2 border-gray-200 rounded-xl from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Variant #{index + 1}</span>
                <button 
                  type="button" 
                  onClick={() => removeVariant(index)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input 
                    {...register(`variants.${index}.sku`)} 
                    placeholder="e.g. IPH15-BLK-128" 
                    className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.variants?.[index]?.sku ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.variants?.[index]?.sku && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.variants[index].sku?.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Color</label>
                  <input 
                    {...register(`variants.${index}.color`)} 
                    placeholder="e.g. Black" 
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">RAM</label>
                  <input 
                    {...register(`variants.${index}.ram`)} 
                    placeholder="e.g. 8GB" 
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Storage <span className="text-red-500">*</span>
                  </label>
                  <input 
                    {...register(`variants.${index}.storage`)} 
                    placeholder="e.g. 128GB" 
                    className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.variants?.[index]?.storage ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.variants?.[index]?.storage && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.variants[index].storage?.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    {...register(`variants.${index}.price`, { valueAsNumber: true })} 
                    placeholder="999.99" 
                    className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.variants?.[index]?.price ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.variants?.[index]?.price && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.variants[index].price?.message}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })} 
                    placeholder="50" 
                    className={`w-full px-3 py-2 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.variants?.[index]?.stock ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.variants?.[index]?.stock && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.variants[index].stock?.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {variantFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">No variants added yet. Click below to add your first variant.</p>
          </div>
        )}
        <button 
          type="button" 
          onClick={() => addVariant({ sku: '', storage: '', price: 0, stock: 0 })}
          className="mt-4 w-full px-4 py-3 border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Variant
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* SPECIFICATIONS SECTION */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800">Technical Specifications</h3>
          <p className="text-sm text-gray-500 mt-1">Add key technical details and features</p>
        </div>
        <div className="space-y-3">
          {specFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input 
                  {...register(`specifications.${index}.key`)} 
                  placeholder="Key (e.g. Screen Size)" 
                  className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.specifications?.[index]?.key ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {errors.specifications?.[index]?.key && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.specifications[index].key?.message}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input 
                  {...register(`specifications.${index}.value`)} 
                  placeholder="Value (e.g. 6.7 inches)" 
                  className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.specifications?.[index]?.value ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {errors.specifications?.[index]?.value && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.specifications[index].value?.message}</span>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={() => removeSpec(index)} 
                className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Remove specification"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        {specFields.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">No specifications added yet.</p>
          </div>
        )}
        <button 
          type="button" 
          onClick={() => addSpec({ key: '', value: '' })}
          className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Specification
        </button>
      </div>

    </div>
  );
};

export default StepVariantsSpecs;