import { createCategory } from "@/api/fetchCategory";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function FormCategory() {
  const navigate = useNavigate();
  const [formCategory, setFormCategory] = useState({
    name: "",
    code: "",
    type: "expenses",
  });

  const handleCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formCategory.name === "") {
        toast.error("Name of category still blank", {
          position: "bottom-right",
        });
        return;
      }

      if (formCategory.code === "") {
        toast.error("Code of category still blank", {
          position: "bottom-right",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", formCategory.name);
      formData.append("code", formCategory.code);
      formData.append("type", formCategory.type);

      await createCategory(formData);

      toast.success("Success create new Category!");
      setTimeout(() => {
        navigate("/category");
      });
    } catch (err: any) {
      toast.error(err.response.data.message, {
        position: "bottom-right",
      });
    }
  };

  const handleBack = () => {
    navigate("/category");
  };

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <h1 className="tw-mt-2 tw-font-bold">Buat Kategori Baru</h1>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleCategory}>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  value={formCategory.name}
                  onChange={(e) =>
                    setFormCategory({ ...formCategory, name: e.target.value })
                  }
                  id="name"
                  className="tw-border tw-rounded tw-mt-2 tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="code">Kode</label>
                <input
                  type="text"
                  id="code"
                  value={formCategory.code}
                  onChange={(e) =>
                    setFormCategory({ ...formCategory, code: e.target.value })
                  }
                  className="tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="type">Tipe Kategori</label>
                <select
                  className="tw-border tw-mt-2 tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  value={formCategory.type}
                  onChange={(e) =>
                    setFormCategory({ ...formCategory, type: e.target.value })
                  }
                  id="type"
                >
                  <option value="expenses">Expenses</option>
                  <option value="income">Income</option>
                </select>
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
