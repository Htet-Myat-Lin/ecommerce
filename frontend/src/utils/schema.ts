import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative(),
  category: z.string().min(1, "Category is required"),
  images: z.any().array().optional(),
  existingImages: z.array(z.string()).optional(),
  isFeatured: z.boolean(),
  rating: z.number().min(0).max(5),
  variants: z.array(
    z.object({
      sku: z.string().min(1, "SKU is required"),
      storage: z.string(),
      price: z.number().nonnegative(),
      stock: z.number().int().nonnegative(),
      color: z.string().optional(),
      ram: z.string().optional(),
    })
  ),
  specifications: z.array(z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required")
    })
  )
}).superRefine((data, ctx) => {
    const hasNewImages = data.images && data.images.length > 0;
    const hasExistingImages = data.existingImages && data.existingImages.length > 0;

    if (!hasNewImages && !hasExistingImages) {
      ctx.addIssue({
        path: ["images"],
        message: "At least one image is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;