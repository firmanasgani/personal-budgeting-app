import { deleteBudget, getBudgetById, updateBudget } from "@/api/fetchBudget";
import { fetchCategory } from "@/api/fetchCategory";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/interface";
import { DateFormatInput, formatNumberToRupiah } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function DetailBudget() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(true);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [budget, setBudget] = useState({
    categoryid: "",
    description: "",
    start_date: "",
    end_date: "",
    amount: 0,
  });

  const getAllCategory = async () => {
    try {
      const data = await fetchCategory();
      setCategory(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getBudget = async () => {
    try {
      const budget = await getBudgetById(id ?? "");
      console.log(budget);
      setBudget({
        categoryid: budget?.categoryid ?? "",
        amount: budget?.amount ?? 0,
        description: budget?.description ?? "",
        start_date: DateFormatInput(budget?.start_date) ?? "",
        end_date: DateFormatInput(budget?.end_date) ?? "",
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (budget.description === "") {
        toast.error("Description still blank!", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      if (budget.amount <= 0 || isNaN(budget.amount)) {
        toast.error("Amount still blank or less than zero", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      if (
        DateFormatInput(budget.start_date) > DateFormatInput(budget.end_date)
      ) {
        toast.error("Tanggal mulai tidak boleh lebih dari tanggal selesai", {
          position: "bottom-right",
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const formData = new FormData();
      formData.append("category_id", budget.categoryid);
      formData.append("description", budget.description);
      formData.append("start_date", budget.start_date);
      formData.append("end_date", budget.end_date);
      formData.append("amount", budget.amount.toString());
      await updateBudget(id??"", formData)
      toast.success('Success update budget', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })

      setTimeout(() => {
        handleBack()
      }, 2500)
    } catch (err: any) {
      console.error(err);
      toast.error('Internal server error', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })
    }
  };

  const handleDeleteBudget = async () => {
    try {
      await deleteBudget(id??"") 
      toast.success('Success deleting budget', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })

      setTimeout(() => {
        handleBack()
      }, 2500)
    } catch (err: any) {
      console.error(err);
      toast.error('Internal server error while deleting budget', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })
    }
  };

  useEffect(() => {
    getAllCategory();
    getBudget();
  }, []);

  const handleBack = () => {
    navigate("/budget");
  };

  const handleEditable = () => {
    setIsEdit(!isEdit);
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <div className="tw-flex tw-flex-row tw-justify-between">
              <CardTitle>Budget:</CardTitle>
              <button
                className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                onClick={handleEditable}
              >
                Ubah Budget
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleUpdateBudget}>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="category">Kategori: </label>
                <select
                  className="tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  disabled={isEdit}
                  value={budget?.categoryid}
                  onChange={(e) =>
                    setBudget({ ...budget, categoryid: e.target.value })
                  }
                >
                  {category.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.code} | {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="description">Deskripsi: </label>
                <textarea
                  id="description"
                  disabled={isEdit}
                  placeholder="Deskripsi anggaran"
                  value={budget.description}
                  onChange={(e) =>
                    setBudget({ ...budget, description: e.target.value })
                  }
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
                  htmlFor="amount"
                >
                  Jumlah:
                </label>

                <Input
                  type="number"
                  disabled={isEdit}
                  id="amount"
                  min={0}
                  value={budget.amount}
                  onChange={(e) =>
                    setBudget({ ...budget, amount: parseInt(e.target.value) })
                  }
                />
                <p>
                  {formatNumberToRupiah(
                    isNaN(budget.amount) ? 0 : budget.amount
                  )}
                </p>
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
                  disabled={isEdit}
                  onChange={(e) =>
                    setBudget({ ...budget, start_date: e.target.value })
                  }
                  value={budget.start_date}
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
                  disabled={isEdit}
                  value={budget.end_date}
                  onChange={(e) =>
                    setBudget({ ...budget, end_date: e.target.value })
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
                  disabled={isEdit}
                  type="submit"
                >
                  Simpan
                </button>
                <button
                  className={
                    !isEdit
                      ? "tw-bg-yellow-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-yellow-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                      : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                  }
                  disabled={isEdit}
                  onClick={handleDeleteBudget}
                >
                  Hapus
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
