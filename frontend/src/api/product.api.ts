import { axiosInstance } from "./axios.instance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProductApi = async (formData: any) => {
  const response = await axiosInstance.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductsApi = async (filters?: any) => {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach((id: string) =>
        params.append("categoryIds", id)
      );
    }
    if (filters.brand && filters.brand.length > 0) {
      filters.brand.forEach((b: string) => params.append("brand", b));
    }
    if (
      filters.priceRange &&
      (filters.priceRange.min > 0 || filters.priceRange.max < 10000)
    ) {
      params.append("priceRange", JSON.stringify(filters.priceRange));
    }
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
  }

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : "/products";
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getProductApi = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const updateProductApi = async ({
  id,
  data,
}: {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}) => {
  const response = await axiosInstance.patch(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProductApi = async (id: string) => {
  const response = await axiosInstance.delete("/products/" + id);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareProductFormData = (data: any): FormData => {
  const formData = new FormData();

  // Handle images
  if (data.images && data.images.length > 0) {
    data.images.forEach((image: File) => {
      formData.append("productImages", image);
    });
  }

  // Handle other fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, variants, existingImages, specifications, ...rest } = data;

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  // Handle variants if they exist
  if (variants && variants.length > 0) {
    formData.append("variants", JSON.stringify(variants));
  }
  if (existingImages && existingImages.length > 0) {
    formData.append("existingImages", JSON.stringify(existingImages));
  }
  // Handle specifications if they exist
  if (specifications) {
    formData.append("specifications", JSON.stringify(specifications));
  }

  return formData;
};
