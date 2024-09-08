import axios, { AxiosRequestConfig } from 'axios'

interface FetchDataParams {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean >
    headers?: Record<string, string> | null
}

interface FetchPublicDataParams {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean>
}

function stringifyQueryParams(params: Record<string, string | number | boolean>): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);
  }

export async function fetchData<T>({ endpoint, queryParams = {}, headers = null } : FetchDataParams ) :Promise<T> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Unauthorized: missing token');
    }

    const defaultHeaders = headers ? {
        Authorization: `Bearer ${token}`,
        ...headers
    } : {
        Authorization: `Bearer ${token}`,
    }
    
    const stringifiedParams = stringifyQueryParams(queryParams)
    const queryString = new URLSearchParams(stringifiedParams).toString()
    const url = `${endpoint}?${queryString ? `${queryString}` : ''}`
    
    const config : AxiosRequestConfig =  {
        headers: defaultHeaders
    }

    try {
        const response = await axios.get<T>(url, config)
        return response.data
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching data: ${error.message}`);
        } else {
            console.error('Error fetching data: unknown error');
        }
        throw error
    }
}

export async function fetchPublicData<T>({ endpoint, queryParams = {}}: FetchPublicDataParams) : Promise<T> {
    const stringifiedParams = stringifyQueryParams(queryParams)
    const queryString = new URLSearchParams(stringifiedParams).toString()
    const url = `${endpoint}${queryString ? `${queryString}` : ''}`
    try {
        const response = await axios.get<T>(url)
        return response.data
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching data: ${error.message}`);
        } else {
            console.error('Error fetching data: unknown error');
        }
        throw error
    }
}
