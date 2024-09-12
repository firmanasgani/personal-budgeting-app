import axios from 'axios'

const urlApi = import.meta.env.VITE_APP_URI as string

export const authLogin = async(formData: FormData) => {
    const url = `${urlApi}/login`
    const { data } = await axios.post(url, formData)
    return data
}

export const authRegister = async(formData: FormData) => {
    const url = `${urlApi}/user`
    const { data } = await axios.post(url, formData)
    return data
}