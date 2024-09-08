import Layout from "@/components/layout/layout";
import { ApiUrl } from "@/lib/utils";
import axios from "axios";
import React, { useState } from "react";

export default function FormCategory() {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    code: "",
    tipe: "expenses",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }

  const handleCategory = async(e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      if(form.name == '') {
        alert('Name required')
        return
      }

      if(form.code == '') {
        alert('Code required')
        return
      }

      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('code', form.code)
      formData.append('type', form.tipe)
      const responses = await axios.post(`${ApiUrl()}/category`, formData, config)
      console.log(formData)
      if(responses.status == 201) {
        alert('Category saved successfully')
        setForm({
          name: '',
          code: '',
          tipe: 'expenses',
        })
      }
    }catch(err: any) {
      console.error(err)
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <h1 className="tw-mt-2 tw-font-bold">Form Tambah Category</h1>
        <form className="tw-mt-5" onSubmit={handleCategory}>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Ex: Rumah, Listrik, etc"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="code">Kode</label>
            <input
              type="text"
              name="code"
              placeholder="Ex: R, L, etc"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="type">tipe</label>
            {form.tipe}
            <select
              className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
              value={form.tipe}
              onChange={(e) => setForm({...form, tipe: e.target.value})}
            >
              <option value="expenses">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="tw-flex tw-flex-col tw-mt-6">
            <button
              disabled={isLoading}
              className="tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
            >
              {isLoading ? 'Loading ...' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
