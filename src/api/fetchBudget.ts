import { IBudget } from "@/lib/interface";
import axios from "axios";

const urlApi = import.meta.env.VITE_APP_URI as string;
const config = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
}

export const fetchBudget = async(params?: {
    category?: string;
    start_date?: string;
    end_date?: string
}): Promise<IBudget[]> => {
    const url = `${urlApi}/budget`;
    try {
        const {data }= await axios.get(url, {
            params,
            ...config
        })

       return data.data?.budget
        
    }catch(error) {
        if(error instanceof Error) {
            console.error(`Error fetching budget: ${error.message}`)
        }else {
            console.error('Error fetching budget: unknown error')
        }
        throw error
    }
}

export const getBudgetById = async(id: string): Promise<IBudget> => {
    const url = `${urlApi}/budget/${id}`
    const data = await axios.get(url, config)
    return data.data.budget
}

export const createBudget = async(formData: FormData) => {
    const url = `${urlApi}/budget`
    const data = await axios.post(url, formData, config)
    return data.data
}

export const updateBudget = async(id: string,formData: FormData) => {
    const url = `${urlApi}/budget/${id}`
    const data = await axios.put(url, formData, config)
    return data.data
}

export const deleteBudget = async(id: string): Promise<void> => {
    const url = `${urlApi}/budget/${id}`
    const data = await axios.delete(url, config)
    return data.data
}

