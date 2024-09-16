import { fetchBudget } from "@/api/fetchBudget";
import { fetchCategory } from "@/api/fetchCategory";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IBudget, ICategory } from "@/lib/interface";
import { formatDate, formatNumberToRupiah, UtilNextMonth, UtilToday } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Budget() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ICategory[]>([])
  const [startDate, setStartDate] = useState(UtilToday)
  const [endDate, setEndDate] = useState(UtilNextMonth)
  const [budget, setBudget] = useState<IBudget[]>([])

  const getBudget = async() => {
    try{
      const data =await fetchBudget({
        category: '',
        start_date: startDate,
        end_date: endDate
      })

      setBudget(data)

    }catch(err: any) {
      console.error(err)
    }
  }

  const handleDetailBudget = (id: string) => {
    navigate(`/budget/${id}`)
  }

  const getCategory = async () => {
    try {
      const data = await fetchCategory()
      setCategory(data)
    } catch (err: any) {
      console.error(err)
    }
  }

  useEffect(() => {
    getCategory()
    getBudget()
  }, [])

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <ToastContainer autoClose={2500} />

        <div className="tw-flex sm:tw-flex-row md:tw-flex-col  tw-gap-4 tw-flex tw-justify-between tw-mt-4 md:tw-mb-4">
          <select className="tw-w-[100%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-1 focus:tw-border-primary">
            {category.map((c) => (
              <option key={c.id} value={c.id}>{c.code} | {c.name} </option>
            ))}
          </select>

          <Input
            type="date"
            className="tw-mr-2 tw-appearance-none tw-text-foreground tw-border-input tw-bg-background tw-text-sm tw-w-[100%]"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            className="tw-mr-2 tw-appearance-none tw-text-foreground tw-border-input tw-bg-background tw-text-sm tw-w-[100%]"
            value={endDate}
            onChange={(e) => [setEndDate(e.target.value)]} 
          />
        </div>

        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-row tw-align-center tw-justify-between">
                <h1 className="tw-text-2xl">List Budget</h1>
                <Link
                  to="add"
                  className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                >
                  Buat Anggaran
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  List of budgets.
                </TableCaption>
                <TableHeader>
                  <TableRow className="tw-bg-red-100">
                    <TableHead className="tw-w-[50px]">
                      No.
                    </TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal mulai</TableHead>
                    <TableHead>Tanggal selesai</TableHead>
                    <TableHead className="tw-text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    budget.map((b, index) => (
                      <TableRow 
                        key={b.id} 
                        onDoubleClick={() => {handleDetailBudget(b.id ?? "")}}
                        className="hover:tw-bg-gray-500 hover:tw-text-white hover:tw-cursor-pointer"
                        >
                        <TableCell className="tw-w-[50px]">
                          {index==0? index+1 : index+1}
                        </TableCell>
                        <TableCell>
                          {b.description}
                        </TableCell>
                        <TableCell>
                          {b.categoryName}
                        </TableCell>
                        <TableCell>
                          {formatDate(b.start_date)}
                        </TableCell>
                        <TableCell>
                          {formatDate(b.end_date)}
                        </TableCell>
                        <TableCell className="tw-text-right">
                          {formatNumberToRupiah(b.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
