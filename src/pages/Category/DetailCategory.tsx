import Layout from "@/components/layout/layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiUrl } from "@/lib/utils";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FormCategory = ({
  id,
  name,
  code,
  tipe,
  editable,
}: {
  id: string;
  name?: string;
  code?: string;
  tipe?: string;
  editable: boolean;
}) => {
  const [form, setForm] = useState({
    id,
    name,
    code,
    tipe,
  });

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmEdit = window.confirm("Anda yakin ingin mengubah kategori?")
    if(!confirmEdit) return

    const urlApi = ApiUrl();
    const formData = new FormData()
    formData.append("name", form.name ?? "");
    formData.append("code", form.code ?? "");
    formData.append("type", form.tipe ?? "");
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const response = await axios.put(`${urlApi}/category/${id}`, formData, config)
      if(response.status === 200) {
        alert("Kategori berhasil diubah")
        window.location.reload();
      }
    } catch (error) {
      console.error(error)
      alert("Gagal mengubah kategori")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubah Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="tw-mt-5" onSubmit={handleSubmit}>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              name="name"
              disabled={editable}
              placeholder="Ex: Rumah, Listrik, etc"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="code">Kode</label>
            <input
              type="text"
              name="code"
              disabled={editable}
              placeholder="Ex: R, L, etc"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
              className="tw-border tw-rounded tw-p-2"
            />
          </div>
          <div className="tw-flex tw-flex-col tw-mt-2">
            <label htmlFor="type">tipe</label>

            <select
              value={form.tipe}
              onChange={(e) =>
                setForm({ ...form, tipe: e.target.value })
              }
              disabled={editable}
              className="tw-border tw-rounded tw-p-2 tw-bg-white tw-text-sm focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 focus:tw-border-blue-500"
            >
              <option value="expenses">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="tw-flex tw-flex-col tw-mt-6">
            <button className={
              editable ? "tw-bg-gray-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2" :
              "tw-bg-blue-500 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
            }
              disabled={editable}
              >
              Ubah Kategori
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const DetailCategory = () => {
  const { id } = useParams();
  // use useCategory to fetch data with params
  const urlApi = ApiUrl();
  const [isEdit, setIsEdit] = useState(true);
  const navigate = useNavigate()
  const categories = {}

 

  const handleIsEdit = () => {
    setIsEdit(!isEdit);
  }

  const handleDelete = async() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const confimrDelete = window.confirm("Anda yakin ingin menghapus kategori?")
    if(!confimrDelete) return
    try{
      const response = await axios.delete(`${urlApi}/category/${id}`, config)
      if(response.status === 200) {
        alert("Kategori berhasil di hapus")
        
          navigate("/category")
      
      }
    }catch(err: any) {
      console.error(err)
    }
  }

  const DetailComponent = () => {
    return (
      <>
        {categories.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="tw-line-clamp-3">
                <p>Tipe: {c.type}</p>
                <p>Kode: {c.code}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="tw-flex tw-flex-row tw-gap-4 tw-align-center tw-justify-between">
                <button className="tw-bg-yellow-500 tw-text-black tw-text-sm tw-font-semibold tw-text-black tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-yellow-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2" onClick={handleIsEdit}>
                  Edit
                </button>
                <button 
                  className={isEdit ? "tw-bg-red-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2" : "tw-bg-gray-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded tw-w-[100px] hover:tw-bg-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-2"}
                  disabled={!isEdit}
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </>
    );
  };
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-col tw-flex-wrap tw-gap-4 tw-mt-4 tw-mb-4 sm:tw-gap-2">
          {error ? (errorMsg != '' ?  <>
            <div className="tw-text-center">{errorMsg}. Klik <a href="/category">disini</a> untuk kembali ke kategori</div>
          </> : '') : ""}
          {loading ? (
            <div className="tw-text-center">Sedang mengambil data...</div>
          ) : (
            <DetailComponent />
          )}
            
          {categories.map((c) => (
            <FormCategory key={c.id} id={c.id} name={c.name} code={c.code} tipe={c.type} editable={isEdit} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DetailCategory;
