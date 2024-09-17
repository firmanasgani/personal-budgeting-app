import { deleteCategory, getCategoryById, updateCategory } from "@/api/fetchCategory";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify"

export default function DetailCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    type: "",
    code: "",
  });

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const data = await getCategoryById(id ?? "");
      setTitle(data.name);
      setCategory({
        name: data.name,
        type: data.type,
        code: data.code,
      });
      //console.table(category)
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleUpdateCategory = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', category.name)
      formData.append('code', category.code)
      formData.append('type', category.type)

      await updateCategory(id ?? "", formData)
      toast.success('Success update category', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })

      setTimeout(() => {
        navigate('/category')
      }, 2500)
    }catch(err: any) {
      toast.error('Error update category', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })
    }

  }

  const handleEditable = () => {
    setEditable(!editable);
  };

  const handleDeleteCategory = async(id: string) => {
    try {
      const confimrDelete = window.confirm("Anda yakin ingin menghapus kategori?")
      if(!confimrDelete) return
      
       await deleteCategory(id)
       toast.success('Success delete category', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
       })

       setTimeout(() => {
        navigate('/category')
       }, 2500)
        
    }catch(err: any) {
      toast.error('Internal server error!', {
        position: 'bottom-right',
        theme: 'colored',
        transition: Bounce
      })

    }
  }

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10 tw-h-svh">
        <ToastContainer autoClose={2500} />
        <Card>
          <CardHeader>
            <div className="tw-flex tw-flex-row tw-justify-between">
              <CardTitle className="tw-text-xl tw-font-bold">
                Kategori: {isLoading ? "Mengambil data..." : title}
              </CardTitle>
              <div>
                <button
                  className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                  onClick={handleEditable}
                >
                  Ubah Kategori
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="tw-mt-5" onSubmit={handleUpdateCategory}>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  value={isLoading ? "Mengambil data" : category.name}
                  disabled={!editable}
                  onChange={(e) =>
                    setCategory({ ...category, name: e.target.value })
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
                  value={isLoading ? "Mengambil data..." : category.code}
                  disabled={!editable}
                  onChange={(e) =>
                    setCategory({ ...category, code: e.target.value })
                  }
                  className="tw-border tw-rounded tw-mt-2  tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-mb-2">
                <label htmlFor="type">Tipe Kategori</label>
                <select
                  className="tw-border tw-mt-2 tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                  value={category.type}
                  disabled={!editable}
                  onChange={(e) =>
                    setCategory({ ...category, type: e.target.value })
                  }
                  id="type"
                >
                  {isLoading ? <option>Mengambil data...</option> : ""}
                  <option value="expenses">Expenses</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="tw-flex tw-flex-row tw-gap-2 tw-mb-2 tw-mt-10">
                <button
                  className={
                    editable
                      ? "tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                      : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                  }
                  type="submit"
                  disabled={!editable}
                >
                  Simpan
                </button>

                <button
                  className={
                    editable
                      ? "tw-bg-yellow-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-yellow-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                      : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"
                  }
                  disabled={!editable}
                  onClick={() => handleDeleteCategory(id ?? "")}
                >
                  Hapus
                </button>
                <button
                  className="tw-bg-red-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2"
                  onClick={() => navigate("/category")}
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
