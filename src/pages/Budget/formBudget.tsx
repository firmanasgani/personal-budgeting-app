import Layout from "@/components/layout/layout";
import { fetchData } from "@/lib/apiClient";
import { ICategory } from "@/lib/interface";
import { ApiUrl, formatNumberToRupiah, UtilNextMonth, UtilToday } from "@/lib/utils";
import axios from "axios";
import {  useEffect, useState } from "react";

export default function FormBudget() {
  const [category, setCategory] = useState<ICategory[]>([])
  const [categoryId, setCategoryId] = useState('')
  const urlApi = ApiUrl()
  const fetchCategories = async() => {
    try {
      const endpoint = `${urlApi}/category`
      const queryParams = {
        type: 'expenses'
      }
      const data = await fetchData<{categories: ICategory[]}>({
        endpoint,
        queryParams
      })

      setCategory(data.categories)
    }catch(err: any) {
      console.error(err)
    }
  }

  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: 0,
    startDate: UtilToday(),
    endDate: UtilNextMonth()
  });

  useEffect(() => {
    fetchCategories()
  }, [])
  
  const handleBudget = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
        if(form.amount === 0) {
          alert('Jumlah harus diisi')
          return
        }
        const formData = new FormData()
        formData.append('category_id', form.category)
        formData.append('amount', form.amount.toString())
        formData.append('start_date', form.startDate)
        formData.append('end_date', form.endDate)
        formData.append('description', form.description)
        const responses = await axios.post(`${urlApi}/budget`, formData, {headers : {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }})
        if(responses.status === 200) {
          alert('Berhasil membuat budget')
          setForm({
            category: '',
            description: '',
            amount: 0,
            startDate: UtilToday(),
            endDate: UtilNextMonth()
          })
        }

    }catch(err: any) {
      console.error(err)
    }
  };

 

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <h1 className="tw-mt-2 tw-font-bold">Buat Budget Baru</h1>
        <form className="tw-mt-5" onSubmit={handleBudget}>
          {form.category}
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="category">Kategori</label>
            <select
              className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
              value={form.category}
              id="category"
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              {category.map((c) => (
                <option value={c.id} key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              name="name"
              id="description"
              value={form.description}
              placeholder="Jelaskan tujuan budgetmu"
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
            {formatNumberToRupiah(isNaN(form.amount) ? 0 : form.amount)}
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="startDate">Tanggal Mulai</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="endDate">Tanggal selesai</label>
            <input
              type="date"
              name="code"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-6">
            <button
             
              className="tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
            >
              Tambah Budget
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
