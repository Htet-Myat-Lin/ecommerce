import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "../../../utils/schema";
import { AlertCircle, X, Upload } from "lucide-react";
import { useCategories } from "../../../hooks/queries";
import { Select } from "flowbite-react";
import type { ICategory } from "../../../api/category.api";
import { useState, useEffect, type ChangeEvent } from "react";

const StepGeneral = () => {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<ProductFormValues>();

  const { data: categories } = useCategories();

  const images = watch("images");
  const existingImages = watch("existingImages")
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!images || images.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviews([]);
      return;
    }
    // Create object URLs
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    // Cleanup function to revoke URLs to avoid memory leaks
    return () => urls.forEach(URL.revokeObjectURL);
  }, [images]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentFiles = (images as File[]) || [];

    if (currentFiles.some((file) => file.name === files[0].name)) {
      return;
    }
    if (files[0].size > MAX_FILE_SIZE) {
      alert("This file is larger than 2MB");
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(files[0].type)) {
      alert("Only .jpg, .jpeg, .png and .webp formats are supported.");
      return;
    }
    // Combine and slice to max 5
    const combinedFiles = [...currentFiles, files[0]]
    if (combinedFiles.length + existingImages!.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    // Update form state manually
    setValue("images", combinedFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // Clear the input value
    e.target.value = "";
  };

  // 2. Handle removing a specific file
  const removeImage = (indexToRemove: number) => {
    const currentFiles = (images as File[]) || [];
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setValue("images", newFiles, { shouldValidate: true, shouldDirty: true });
  };

  const removeExistingImage = (img: string) => {
    const updated = existingImages?.filter((existing) => existing !== img)
    setValue("existingImages", updated, {shouldDirty: true, shouldValidate: true})
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Existing Images */}
      {existingImages!.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Existing Product Images
          </label>
          <div className="flex items-center gap-2 mb-6">
            {existingImages?.map((img, index) => (
              <div
                key={img}
                className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
              >
                <img
                  src={`http://localhost:3000/uploads/product-images/${img}`}
                  alt={`img ${index + 1}`}
                  className="w-44 h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img as string)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Images <span className="text-red-500">*</span>
          <span className="text-xs font-normal text-gray-500 ml-2">
            (Max 5 images, 2MB each, JPG/PNG/WebP)
          </span>
        </label>

        {/* Image preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
          {/* Upload Button - Only show if less than 5 images */}
          {(!images || images.length < 5) && (
            <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors hover:border-blue-400">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">
                  Click to upload
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple
                onChange={handleFileChange}
                // Note: removed {...register("images")}
              />
            </label>
          )}

          {previews.map((preview, index) => (
            <div
              key={preview} // Use preview URL as key to prevent re-render flicker
              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {errors.images && (
          <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.images.message}</span>
          </div>
        )}
      </div>
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder="e.g. iPhone 15 Pro Max"
        />
        {errors.title && (
          <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.title.message}</span>
          </div>
        )}
      </div>

      {/* Slug & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Slug <span className="text-red-500">*</span>
          </label>
          <input
            {...register("slug")}
            className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.slug
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="iphone-15-pro-max"
          />
          {errors.slug && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.slug.message}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            {...register("brand")}
            className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.brand
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Apple"
          />
          {errors.brand && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.brand.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Category & Prices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("category")}
            className={`w-full ${
              errors.category
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">None (Top-level category)</option>
            {(categories?.categories as ICategory[])?.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.category.message}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Base Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="999.99"
          />
          {errors.price && (
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.price.message}</span>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Discount Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("discountPrice", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="899.99"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.description
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          placeholder="Enter detailed product description..."
        />
        {errors.description && (
          <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.description.message}</span>
          </div>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center">
        <div className="flex items-center gap-3 h-full">
          <input
            type="checkbox"
            {...register("isFeatured")}
            id="feat"
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="feat"
            className="text-sm font-semibold text-gray-700 cursor-pointer"
          >
            Mark as Featured Product
          </label>
        </div>
      </div>
    </div>
  );
};

export default StepGeneral;
