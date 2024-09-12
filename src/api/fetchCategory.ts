import { ICategory } from "@/lib/interface";
import axios from "axios";

const urlApi = import.meta.env.VITE_APP_URI as string;
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
};

export const fetchCategory = async (params?: {
  type?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ICategory[]> => {
  const url = `${urlApi}/category`;
  try {
    const { data } = await axios.get<{categories: ICategory[]}>(url, {
      params,
      ...config,
    });
    return data.categories;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching categories: ${error.message}`);
    } else {
      console.error("Error fetching categories: unknown error");
    }
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const url = `${urlApi}/category/${id}`;
  const { data } = await axios.get<ICategory>(url, config);
  return data;
};

export const createCategory = async (formData: FormData): Promise<ICategory> => {
  const url = `${urlApi}/category`;
  const { data } = await axios.post<ICategory>(url, formData, config);
  return data;
};

export const updateCategory = async (
  id: string,
  formData: FormData
): Promise<ICategory> => {
  const url = `${urlApi}/category/${id}`;
  const { data } = await axios.put<ICategory>(url, formData, config);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const url = `${urlApi}/category/${id}`;
  await axios.delete(url, config);
};


