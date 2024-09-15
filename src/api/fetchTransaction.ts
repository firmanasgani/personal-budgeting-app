import { ITranscations } from "@/lib/interface"
import axios from "axios";


const urlApi = import.meta.env.VITE_APP_URI as string
const config = {
    headers : {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
}

export const fetchTransactions = async(params?: {
    category?: string;
    start_date?: string;
    end_date?: string;
}): Promise<ITranscations[]> => {
    const url = `${urlApi}/transactions`
    try {
        const { data } = await axios.get<{transactions: ITranscations[]}>(url, {
            params,
            ...config
        })
        return data.transactions;
    }catch(error) {
        if(error instanceof Error) {
            console.error(`Error fetching transaction: ${error.message}`)
        }else {
            console.error("Error fetching transaction: unknown error")
        }
        throw error
    }
}

export const getTransactionById = async(id: string): Promise<ITranscations> => {
    const url = `${urlApi}/transaction/${id}`
    try {
        const data = await axios.get(url, config)
        return data.data.transaction
    }catch(error) {
        if(error instanceof Error) {
            console.error(`Error fetching transaction: ${error.message}`)
        }else {
            console.error("Error fetching transaction: unknown error")
        }
        throw error
    }
}

export const createTransaction = async(formData: FormData) => {
    const url =`${urlApi}/transaction`
    const data = await axios.post(url, formData, config)
    return data.data
}

export const updateTransaction = async(
    id: string,
    formData: FormData
): Promise<ITranscations[]> => {
    const url = `${urlApi}/transaction/${id}`
    try{
        const data =await axios.put<ITranscations[]>(url, formData, config)
        return data.data
    }catch(error: any) {
        if(error instanceof Error) {
            console.error(`Error updating transaction: ${error.message}`)
        }else {
            console.error("Error updating transaction: unknown error")
        }
        throw error
    }

}

export const deleteTransaction = async(id: string): Promise<void> => {
    const url = `${urlApi}/transaction/${id}`
    const data = await axios.delete(url, config)
    return data.data
}
