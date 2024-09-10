import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/lib/apiClient";
import { IBudget, ICategory } from "@/lib/interface";
import axios from "axios";
import { ApiUrl, DateFormatInput, formatNumberToRupiah } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailBudget = () => {
  const { id } = useParams();
  const [editable, setEditable] = useState(true);
  const [form, setForm] = useState({
    categoryid: "",
    description: "",
    amount: 0,
    start_date: '',
    end_date: ''
  })
  const [budget, setBudget] = useState<IBudget | null>(null);
  const [category, setCategory] = useState<ICategory[]>([]);
  const urlApi = ApiUrl();
  const fetchBudget = async () => {
    const endpoint = `${urlApi}/budget/${id}`;
    const queryParams = {};

    try {
      const data = await fetchData<{ budget: IBudget }>({
        endpoint,
        queryParams,
      });
      setBudget(data.budget);
      setForm({
        categoryid: data.budget.categoryid ?? "",
        description: data.budget.description,
        amount: data.budget.amount,
        start_date: DateFormatInput(data.budget.start_date),
        end_date: DateFormatInput(data.budget.end_date)
      })
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchCategory = async () => {
    const endpoint = `${urlApi}/category`;
    const queryParams = {
      type: "expenses",
    };

    try {
      const data = await fetchData<{ categories: ICategory[] }>({
        endpoint,
        queryParams,
      });
      setCategory(data.categories);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBudget();
    fetchCategory();
  }, []);

  const handleUpdateBudget = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }

    const formData = new FormData()

    
    formData.append('category_id', form.categoryid)
    formData.append('description', form.description)
    formData.append('amount', form.amount.toString())
    formData.append('start_date', form.start_date)
    formData.append('end_date', form.end_date)
    try {
      const response = await axios.put(`${urlApi}/budget/${id}`, formData, config)
      if(response.status == 200) {
        alert('Budget berhasil diubah')
        window.location.href='/budget'
      }
    }catch(error: any) {
      console.error(error)
    }
  }

  const handleDeleteBudget = (id: string) => {
    console.log(id)
    const confirmDelete = window.confirm('Anda yakin ingin menghapus budget?')

    if(!confirmDelete) return
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }
    axios.delete(`${urlApi}/budget/${id}`, config)
    .then(response => {
      if(response.status == 200) {
        alert('Budget berhasil di hapus')
        window.location.reload()
      }
    })
    .catch(error => {
      console.error(error)
    })
  }

  const handleEdit = () => {
    setEditable(!editable)
  }
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-col tw-flex-wrap tw-gap-4 tw-mt-4 tw-mb-4 sm:tw-gap-2">
          <Card>
            <CardHeader>
                <div className="tw-flex tw-flex-row tw-justify-between tw-align-center">
                <CardTitle>Detail budget {budget?.description}</CardTitle>
                <div>
                    <button className="tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2" onClick={handleEdit}>
                        Edit Data
                    </button>
                </div>
                </div>
            </CardHeader>
            <CardContent>
              <form className="tw-mt-5" onSubmit={handleUpdateBudget}>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label className="tw-text-lg tw-font-bold tw-mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={form.categoryid}
                    disabled={editable}
                    onChange={(e) => setForm({...form, categoryid: e.target.value})}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  >
                    {category.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label className="tw-text-lg tw-font-bold tw-mb-2">
                    Deskripsi
                  </label>
                  <Input
                    name="desription"
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    disabled={editable}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  />
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label className="tw-text-lg tw-font-bold tw-mb-2">
                    Amount
                  </label>
                  <Input
                    name="amount"
                    type="number"
                    value={form.amount}
                    disabled={editable}
                    onChange={(e) => setForm({...form, amount: parseInt(e.target.value)})}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  />
                 {formatNumberToRupiah(form.amount ?? 0)}
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label className="tw-text-lg tw-font-bold tw-mb-2">
                    Tanggal mulai
                  </label>
                  <Input
                    name="desription"
                    type="date"
                    value={DateFormatInput(form.start_date ?? "")}
                    onChange={(e) => setForm({...form, start_date: e.target.value})}
                    disabled={editable}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  />
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label className="tw-text-lg tw-font-bold tw-mb-2">
                    Tanggal Selesai
                  </label>
                  <Input
                    name="desription"
                    type="date"
                    value={DateFormatInput(form.end_date ?? "")}
                    onChange={(e) => setForm({...form, end_date: e.target.value})}
                    disabled={editable}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  />
                </div>
                <div className="tw-flex tw-flex-row tw-gap-4 tw-mt-6">
                  <button
                    className={
                      editable
                        ? "tw-bg-gray-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                        : "tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                    }
                    disabled={editable}
                  >
                    Ubah Budget
                  </button>
                  <button
                    className={
                      !editable
                        ? "tw-bg-gray-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                        : "tw-bg-red-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                    }
                    disabled={!editable}
                    onClick={() => handleDeleteBudget(id ?? "")}
                  >
                    Hapus budget
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DetailBudget;
