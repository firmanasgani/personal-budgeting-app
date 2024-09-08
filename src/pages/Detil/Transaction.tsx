import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchData } from "@/lib/apiClient";
import { ICategory, IDetailTransaction } from "@/lib/interface";
import { ApiUrl, DateFormatInput, formatDate, formatNumberToRupiah } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



const DetailTransaction = () => {
  const [form, setForm] = useState({
    id: "",
    category: "",
    description: "",
    amount: 0,
    date_transaction: "",
  })
  const { id } = useParams();
  const [transaction, setTransaction] = useState<IDetailTransaction | null>(
    null
  );
  const [category, setCategory] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const urlApi = ApiUrl();
  const [isEdit, setIsEdit] = useState(true);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const endpoint = `${urlApi}/transaction/${id}`;
      const queryParams = {};
      const data = await fetchData<{ transaction: IDetailTransaction }>({
        endpoint,
        queryParams,
      });
      setTransaction(data.transaction);
      setForm({
        id: data.transaction.id,
        category: data.transaction.categoryid,
        description: data.transaction.description,
        amount: data.transaction.amount,
        date_transaction: DateFormatInput(data.transaction.date_transaction),
      })
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      if (err.status == 404) {
        setErrorMsg("Transaksi tidak ditemukan");
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async() => {
    try {
        const endpoint = `${urlApi}/category`
        const queryParams = {}
        const data = await fetchData<{ categories: ICategory[] }>({
            endpoint,
            queryParams,
        })
        setCategory(data.categories)
    }catch(err: any) {
        console.log(err)
    }
  }

  useEffect(() => {
    fetchCategories()
    setTimeout(() => {
        fetchTransactions();
    }, 1500)
  }, []);

  const handleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleUpdateTransaction = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmEdit = window.confirm("Anda yakin ingin mengubah transaksi?")
    if(!confirmEdit) return

    const urlApi = ApiUrl();
    const formData = new FormData()
    formData.append('category_id', form.category)
    formData.append('description', form.description)
    formData.append('amount', form.amount.toString())
    formData.append('date_transaction', form.date_transaction)
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const response = await axios.put(`${urlApi}/transaction/${id}`, formData, config)
      if(response.status === 200) {
        alert("Transaksi berhasil diubah")
        navigate('/transaction')
      }
    } catch (error) {
      console.error(error)
      alert("Gagal mengubah transaksi")
    }
  }

  const handleDelete = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const confimrDelete = window.confirm(
      "Anda yakin ingin menghapus transaksi?"
    );
    if (!confimrDelete) return;
    try {
      const response = await axios.delete(`${urlApi}/transaction/${id}`, config);
      if (response.status === 200) {
        alert("Transaksi berhasil di hapus");
        navigate("/transaction");
      }
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-col tw-flex-wrap tw-gap-4 tw-mt-4 tw-mb-4 sm:tw-gap-2">
          {error ? (
            errorMsg != "" ? (
              <>
                <div className="tw-text-center">
                  {errorMsg}. Klik <a href="/category">disini</a> untuk kembali
                  ke kategori
                </div>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {loading ? (
            <div className="tw-text-center">Sedang mengambil data...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{transaction?.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="tw-flex tw-flex-col tw-gap-4">
                  <p>
                    Jumlah: {formatNumberToRupiah(transaction?.amount ?? null)}
                  </p>
                  <p>
                    Tanggal Transaksi:
                    {formatDate(transaction?.date_transaction ?? null)}
                  </p>
                  <p>Kategori: {transaction?.categoryName}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="tw-flex tw-flex-row tw-gap-4 tw-align-center tw-justify-between">
                  <button
                    className="tw-bg-yellow-500 tw-text-black tw-text-sm tw-font-semibold tw-text-black tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-yellow-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                    onClick={handleIsEdit}
                  >
                    Edit
                  </button>
                  <button
                    className={
                      isEdit
                        ? "tw-bg-red-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                        : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                    }
                    disabled={!isEdit}
                    onClick={handleDelete}
                  >
                    Hapus
                  </button>
                </div>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ubah Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="tw-mt-5" onSubmit={handleUpdateTransaction}>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label htmlFor="category">Kategori</label>
                  <select
                    name="category"
                    value={form.category}
                    disabled={isEdit}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  >
                    {category.map((c) => (
                        <option value={c.id} key={c.id}>{c.name}</option>
                    ))}

                  </select>
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label htmlFor="description">Deskripsi</label>
                  <input
                    type="text"
                    name="description"
                    disabled={isEdit}
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Deskripsi"
                    className="tw-border tw-rounded tw-p-2"
                  />
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label htmlFor="type">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    disabled={isEdit}
                    value={form.amount}
                    onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
                    placeholder="Amount"
                    className="tw-border tw-rounded tw-p-2"
                  />
                  {formatNumberToRupiah(form.amount)}
                </div>
                <div className="tw-flex tw-flex-col tw-mt-2">
                  <label htmlFor="date_transaction">Tanggal Transaksi</label>
                  <input
                    type="date"
                    name="date_transaction"
                    disabled={isEdit}
                    value={form.date_transaction}
                    onChange={(e) => setForm({...form, date_transaction: e.target.value})}
                    placeholder="Tanggal Transaksi"
                    className="tw-border tw-rounded tw-p-2"
                  />
                </div>
                <div className="tw-flex tw-flex-col tw-mt-6">
                  <button
                    className={
                      isEdit
                        ? "tw-bg-gray-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                        : "tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                    }
                    disabled={isEdit}
                  >
                    Ubah Transaksi
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

export default DetailTransaction;
