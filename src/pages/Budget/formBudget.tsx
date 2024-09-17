import { createBudget } from "@/api/fetchBudget";
import { fetchCategory } from "@/api/fetchCategory";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/interface";
import { DateFormatInput, DateToday, formatNumberToRupiah } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";


export default function FormBudget() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ICategory[]>([]);
  const [formBudget, setFormBudget] = useState({
    category: "",
    amount: 0,
    description: '',
    start_date: DateToday(),
    end_date: DateToday()
  })

  const getAllCategory = async () => {
    try {
      const data = await fetchCategory();
      setFormBudget({
        ...formBudget,
        category: data[0].id
      })
      setCategory(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleBack = () => {
    navigate("/budget");
  }

  const handleCreateBudget = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {

      if(formBudget.description === '') {
        toast.error('Description still blank!', {
          position: 'bottom-right',
          theme: 'colored',
          transition: Bounce
        })
        return
      }

      if(formBudget.amount <= 0 || isNaN(formBudget.amount)) {
        toast.error('Amount still blank or less than zero', {
          position: 'bottom-right',
          theme: 'colored',
          transition: Bounce
        })
        return
      }

      if(DateFormatInput(formBudget.start_date) > DateFormatInput(formBudget.end_date)) {
        toast.error('Tanggal mulai tidak boleh lebih dari tanggal selesai', {
          position: 'bottom-right',
          theme: 'colored',
          transition: Bounce
        })

        return
      }
      
      const formData = new FormData()
      
      formData.append('category_id', formBudget.category)
      formData.append('description', formBudget.description)
      formData.append('amount', formBudget.amount.toString())
      formData.append('start_date', formBudget.start_date)
      formData.append('end_date', formBudget.end_date)

      await createBudget(formData)
      
      toast.success('Success create budget!', {
        position: "bottom-right",
        theme: 'colored',
        transition: Bounce
      })
      setTimeout(() => {
        handleBack()
      }, 2500)
    }catch(err: any) {
      toast.error('Error while creating new budget!', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })
    }
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <h2 className="tw-font-bold tw-mb-4">Buat Anggaran</h2>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleCreateBudget}>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1 tw-align-center"
                  htmlFor="category"
                >
                  Kategori:
                </label>
                <select
                  id="category"
                  value={formBudget.category}
                  onChange={(e) => setFormBudget({...formBudget, category: e.target.value})}
                  className="tw-border tw-rounded tw-mt-2 tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                >
                  {category.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} | {c.name}{" "}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="description"
                >
                  Deskripsi:
                </label>
                <textarea
                  id="description"
                  value={formBudget.description}
                  onChange={(e) => setFormBudget({...formBudget, description: e.target.value})}
                  placeholder="Deskripsi anggaran"
                  cols={20}
                  rows={5}
                  maxLength={100}
                  wrap="hard"
                  className="tw-w-[100%] tw-h-[150px] tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                ></textarea>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="description"
                >
                  Jumlah:
                </label>

                <Input 
                  type="number"
                  min={0}
                  value={formBudget.amount}
                  onChange={(e) => setFormBudget({...formBudget, amount: parseInt(e.target.value)})}
                  />
                  <p>{formatNumberToRupiah(isNaN(formBudget.amount) ? 0 : formBudget.amount)}</p>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="start_date"
                >
                  Tanggal mulai:
                </label>
                <Input 
                  type="date" 
                  id="start_date" 
                  value={formBudget.start_date}
                  onChange={(e) => setFormBudget({...formBudget, start_date: e.target.value})}
                  />
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="end_date"
                >
                  Tanggal selesai:
                </label>
                <Input 
                  type="date" 
                  id="end_date" 
                  value={formBudget.end_date}
                  onChange={(e) => setFormBudget({...formBudget, end_date: e.target.value})}
                  />
              </div>

              <div className="tw-flex tw-flex-row tw-gap-2 tw-mb-2 tw-mt-10">
                <button 
                  className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                  type="submit"
                  >
                  Simpan
                </button>
                <button
                  className="tw-bg-red-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                  onClick={handleBack}
                >
                  Kembali
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
