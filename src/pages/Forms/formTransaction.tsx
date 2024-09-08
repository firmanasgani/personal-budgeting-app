import Layout from "@/components/layout/layout";
import { ICategory } from "@/lib/interface";
import { ApiUrl, formatNumberToRupiah } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FormTransaction() {
  const date = new Date()
  const month = date.getMonth()+1
  const monthNow = month < 10 ? `0${month}` : `${month}`
  const dateNow = date.getDate()
  const day = dateNow < 10 ? `0${dateNow}` : `${dateNow}`
  const today = `${date.getFullYear()}-${monthNow}-${day}`
  const [category, setCategory] = useState<ICategory[]>([])

  const [form, setForm] = useState({
    category_id: '',
    description: '',
    amount: 0,
    dateTransaction: today
  });

  const [isLoading, setIsLoading] = useState(false)
  const urlApi = ApiUrl()

  const token = localStorage.getItem('authToken')

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const fetchCategory = async() => {
    try {
      const { data } = await axios.get<{ categories: ICategory[]}>(`${urlApi}/category`, config)
      
      setCategory(data.categories.filter((c) => c.type === 'expenses'))
    }catch(err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handleTransaction = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true)
      e.preventDefault()
      if(form.description == '') {
        alert('Description isLoading required')
        return
      }
      if(form.amount == 0) {
        alert('Amount isLoading required')
        return
      }
      const formData = new FormData()
      formData.append('category_id', form.category_id)
      formData.append('description', form.description)
      formData.append('amount', form.amount.toString())
      formData.append('date_transaction', form.dateTransaction)

      const responses = await axios.post(`${urlApi}/transaction`, formData, config)
      if (responses.status === 200) {
        alert('Transaction saved successfully')
        setForm({
          category_id: '',
          description: '',
          amount: 0,
          dateTransaction: today
        });
      }

    }catch(err: any) {
      
      console.log(err)
  
    }
    finally{
      setIsLoading(false)
    }
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <h1 className="tw-mt-2 tw-font-bold">Tambah Transaksi baru</h1>
        <form className="tw-mt-5" onSubmit={handleTransaction}>
          
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="category">Kategori</label>
            <select
              className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
              value={form.category_id}
              id="category"
              onChange={(e) => setForm({...form, category_id: e.target.value})}
            >
            {category.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            </select>
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              name="name"
              id="description"
              value={form.description}
              placeholder="Jelaskan tujuan transaksimu"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })}
              className="tw-border tw-rounded tw-p-2"
            />
            {formatNumberToRupiah(form.amount)}
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="startDate">Tanggal Transaksi</label>
            <input
              type="date"
              name="startDate"
              value={form.dateTransaction}
              onChange={(e) => setForm({ ...form, dateTransaction: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
        
          <div className="tw-flex tw-flex-col tw-mt-6">
            <button
              disabled={isLoading}
              className="tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
            >
              {isLoading ? 'Loading...' : 'Buat pengeluaran baru'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
