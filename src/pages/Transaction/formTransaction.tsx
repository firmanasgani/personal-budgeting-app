import { fetchCategory } from "@/api/fetchCategory";
import { createTransaction } from "@/api/fetchTransaction";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/interface";
import { DateToday, formatNumberToRupiah } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

export default function FormTransaction() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ICategory[]>([]);
  const [formTransaction, setFormTransaction] = useState({
    category: "",
    amount: 0,
    date: DateToday(),
    description: "",
  });
  

  const getAllCategory = async () => {
    const data = await fetchCategory();
    setCategory(data);
  };

  const handleBack = () => {
    navigate("/transaction");
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(formTransaction.description === '') {
        toast.error("Description still blank", {
          position: "bottom-right",
        });
        return;
      }

      if(formTransaction.amount === 0 || isNaN(formTransaction.amount)) {
        toast.error("Amount still blank", {
          position: "bottom-right",
        });
        return;
      }

      if(formTransaction.date > DateToday()) {
        toast.error("Date cannot be greater than today", {
          position: "bottom-right",
        });
        return;
      }
      

      const formData = new FormData()
      formData.append('category_id', formTransaction.category)
      formData.append('description', formTransaction.description)
      formData.append('amount', formTransaction.amount.toString())
      formData.append('date_transaction', formTransaction.date)
      await createTransaction(formData)
      toast.success('Success creaete new transaction!')
      setTimeout(() => {
        handleBack()
      }, 3000)
    }catch(err: any) {
      toast.error(err.response.data.message, {
        position: "bottom-right",
      })
    }
  }


  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <h2 className="tw-font-bold tw-mb-4">Buat transaksi baru</h2>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleSubmit}>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="category"
                >
                  Kategori
                </label>
                <select
                  id="category"
                  className="tw-border tw-rounded tw-mt-2 tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  onChange={(e) => setFormTransaction({...formTransaction, category: e.target.value})}
                  value={formTransaction.category}
                >
                  {category.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} | {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="description">
                    Transaksi</label>
                    <textarea id="description"
                    placeholder="Deskripsi transaksi"
                    cols={20}
                    value={formTransaction.description}
                    onChange={(e) => setFormTransaction({...formTransaction, description: e.target.value})}
                    rows={5}
                    maxLength={100}
                    wrap="hard"
                    className="tw-w-[100%] tw-h-[150px] tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"></textarea>
                  
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="date_transaction">Tanggal</label>
                  <Input type="date" value={formTransaction.date} onChange={(e) => setFormTransaction({...formTransaction, date: e.target.value})} />
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label
                  className="tw-text-sm tw-font-bold tw-mb-1"
                  htmlFor="amount">
                    Jumlah</label>
                  <Input 
                    type="number" 
                    min={0} 
                    value={formTransaction.amount}
                    onChange={(e) => setFormTransaction({...formTransaction, amount: parseInt(e.target.value)})}
                    />
                
                  <p className="tw-text-red-500">{formatNumberToRupiah(isNaN(formTransaction.amount) ? 0 : formTransaction.amount)}</p>
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
