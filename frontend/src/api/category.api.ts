import { axiosInstance } from "./axios.instance";

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  parent?: string | ICategory | null
}

export const createCategoryApi = async (categoryData: ICategory) => {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data;
};

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

export const getCategoryApi = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const updateCategoryApi = async ({id, categoryData}:{id: string, categoryData: Partial<ICategory>}) => {
  const response = await axiosInstance.patch(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategoryApi = async (id: string) => {
  const response = await axiosInstance.delete(`/categories/${id}`);
  return response.data;
};
