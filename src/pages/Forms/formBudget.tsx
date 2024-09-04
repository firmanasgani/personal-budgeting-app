import Layout from "@/components/layout/layout";
import { useState } from "react";

export default function FormBudget() {
  
  const date = new Date()
  const month = date.getMonth()
  const monthNow = month < 10 ? `0${month}` : `${month}`
  const monthNext = month + 1 ? `0${month+1}` : `${month+1}`
  const today = `${date.getFullYear()}-${monthNow}-25`
  const next = `${date.getFullYear()}-${monthNext}-24`

  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: 0,
    startDate: today,
    endDate: next
  });

  const handleBudget = () => {
  
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <h1 className="tw-mt-2 tw-font-bold">Buat Budget Baru</h1>
        <form className="tw-mt-5">
          
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="category">Kategori</label>
            <select
              className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
              value={form.category}
              id="category"
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option value="expenses">Expenses</option>
              <option value="income">Income</option>
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
              onClick={handleBudget}
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