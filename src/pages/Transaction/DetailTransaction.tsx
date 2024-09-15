import Layout from "@/components/layout/layout";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ICategory } from "@/lib/interface";
import "react-toastify/dist/ReactToastify.css";
import { fetchCategory } from "@/api/fetchCategory";
import { Form, useNavigate, useParams } from "react-router-dom";
import { deleteTransaction, getTransactionById, updateTransaction } from "@/api/fetchTransaction";
import { DateFormatInput, DateToday, formatNumberToRupiah } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function DetailTransaction() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(true);
  const [transaction, setTransaction] = useState({
    category: "",
    amount: 0,
    date: DateToday(),
    description: "",
  });
  const [category, setCategory] = useState<ICategory[]>([]);

  const { id } = useParams();
  const getAllCategory = async () => {
    try {
      const data = await fetchCategory();
      setCategory(data);
    } catch (err: any) {
      toast.error("Error fetching category...", {
        position: "bottom-right",
      });
    }
  };

  const fetchDetailTransaction = async () => {
    try {
      const data = await getTransactionById(id ?? "");
      setTransaction({
        category: data.categoryid,
        amount: data.amount,
        date: data.date_transaction,
        description: data.description,
      });
    } catch (err: any) {
      toast.error("Error fetching transaction...", {
        position: "bottom-right",
      });
      navigate("/transaction");
    }
  };
  const handleEditable = () => {
    setIsEdit(!isEdit);
  };

  const handleUpdateTransaction = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      if (transaction.description === "") {
        toast.error("Description still blank", {
          position: "bottom-right",
          transition: Bounce,
          theme: "colored",
        });
        return;
      }

      if (transaction.amount === 0 || isNaN(transaction.amount)) {
        toast.error("Amount still blank!", {
          position: "bottom-right",
          transition: Bounce,
          theme: "colored",
        });
      }
      if(DateFormatInput(transaction.date) > DateToday()) {
        toast.error("Date cannot be greater than today", {
          position: "bottom-right",
          transition: Bounce,
          theme: "colored",
        });
        return;
      }

      const formData = new FormData()
      formData.append('category_id', transaction.category)
      formData.append('description', transaction.description)
      formData.append('amount', transaction.amount.toString())
      formData.append('date_transaction', transaction.date)
      await updateTransaction(id ?? "", formData)
      
      toast.success("Transaction updated!", {
        position: "bottom-right",
        transition: Bounce,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/transaction");
      }, 3000)
    } catch (err: any) {
      toast.error(err.response.data.message, {
        position: "bottom-right",
        theme: 'colored',
        transition: Bounce
      })
    }
  };

  const handleDeleteTransaction = async() => {
    try {
      await deleteTransaction(id ?? "");
      toast.success("Success deleting transaction", {
        position: "bottom-right",
      });
      setTimeout(() => {
        navigate("/transaction");
      }, 3000);
    } catch (err: any) {
      toast.error("Error deleting transaction", {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    getAllCategory();
    fetchDetailTransaction();
  }, []);

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <div className="tw-flex tw-flex-row tw-justify-between">
              <CardTitle className="tw-text-xl tw-font-bold">
                Transaksi:
              </CardTitle>
              <button
                className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-2 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                onClick={handleEditable}
              >
                Ubah Transaksi
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleUpdateTransaction}>
              <div className="tw-flex tw-flex-col tw-mb-5">
                <label htmlFor="category">Kategori: </label>
                <select
                  id="category"
                  disabled={isEdit}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      category: e.target.value,
                    })
                  }
                  value={transaction.category}
                  className="tw-border tw-rounded tw-mt-2 tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                >
                  {category.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} | {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-5">
                <label htmlFor="description">Deskripsi: </label>
                <textarea
                  id="description"
                  placeholder="Deskripsi transaksi"
                  disabled={isEdit}
                  cols={20}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      description: e.target.value,
                    })
                  }
                  rows={5}
                  maxLength={100}
                  value={transaction.description}
                  wrap="hard"
                  className="tw-w-[100%] tw-h-[150px] tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                ></textarea>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-5">
                <label htmlFor="amount">Jumlah: </label>
                <Input
                  type="number"
                  min={0}
                  disabled={isEdit}
                  value={transaction.amount}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      amount: parseInt(e.target.value),
                    })
                  }
                />
                <p>
                  {formatNumberToRupiah(
                    isNaN(transaction.amount) ? 0 : transaction.amount
                  )}
                </p>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-5">
                <label htmlFor="date_transaction">Tanggal: </label>
                <Input
                  type="date"
                  disabled={isEdit}
                  value={DateFormatInput(transaction.date)}
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="tw-flex tw-flex-row tw-gap-2 tw-mb-2 tw-mt-10">
                <button
                  className={
                    !isEdit
                      ? "tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                      : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                  }
                  type="submit"
                  disabled={isEdit}
                >
                  Simpan
                </button>

                <button
                  className={
                    !isEdit
                      ? "tw-bg-yellow-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-yellow-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                      : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                  }
                  disabled={isEdit}
                  onClick={handleDeleteTransaction}
                >
                  Hapus
                </button>
                <button
                  className="tw-bg-red-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                  onClick={() => navigate("/transaction")}
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
