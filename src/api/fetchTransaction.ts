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