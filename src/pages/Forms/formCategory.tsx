import Layout from "@/components/layout/layout";
import { useState } from "react";

export default function FormCategory() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    tipe: "",
  });

  const handleCategory = () => {
    alert(`This is name: ${form.code} and ${form.name} with tipe ${form.tipe}`);
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <h1 className="tw-mt-2 tw-font-bold">Form Tambah Category</h1>
        <form className="tw-mt-5">
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
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
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="type">tipe</label>
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
              onClick={handleCategory}
              className="tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
            >
              Tambah Category
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
