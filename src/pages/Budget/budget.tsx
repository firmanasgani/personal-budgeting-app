import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { fetchData } from "@/lib/apiClient";
import { IBudget, ICategory } from "@/lib/interface";
import {
  ApiUrl,
  formatDate,
  formatNumberToRupiah,
  UtilMonthName,
  UtilNextMonth,
  UtilToday,
} from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Budget() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState<IBudget[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [amount, setAmount] = useState(0)
  const [categoryId, setCategoryId] = useState("");
  const urlApi = ApiUrl();
  const fetchBudget = async () => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${urlApi}/budget`, config);
    //const sumAmount = response.data.budget.reduce((a, b) => a + b.amount, 0)
    setAmount(0);
    setBudget(response.data.budget);
  };

  let num = 1
  const fetchCategories = async () => {
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
    fetchCategories();
  }, [categoryId]);
  const handleChange = (event: any) => {
    setCategoryId(event.target.value);
  };
  const date = new Date();

  const handleDetail = (id: string) => {
    navigate(`/budget/${id}`)
  }

  const [dateFrom, setDateFrom] = useState(UtilToday);
  const [dateTo, setDateTo] = useState(UtilNextMonth);
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-row tw-mt-4 tw-mb-4 tw-gap-2 tw-justify-between">
          <select
            className="tw-w-[15%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 sm:tw-w-[50%] md:tw-w-[35%] focus:tw-ring-ring focus:tw-border-primary"
            value={categoryId}
            onChange={handleChange}
          >
            <option value="">Semua</option>
            {category.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Input
            type="date"
            className="tw-mr-2"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            className="tw-mr-2"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          ></Input>
        </div>
        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-row tw-gap-2 tw-align-center tw-justify-between">
                <h1>Budget Bulan {UtilMonthName[date.getMonth()]}</h1>
                <div>
                  <a
                    href="/budget/add"
                    className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                  >
                    Buat budget baru
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table className="rounded">
                <TableCaption>List of Budget.</TableCaption>
                <TableHeader className="tw-bg-blue-300">
                  <TableRow>
                    <TableHead className="tw-w-[100px]  tw-text-black">
                      No
                    </TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End date</TableHead>
                    <TableHead className="tw-text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.map((b) => (
                    <TableRow 
                      key={b.id}
                      className="hover:tw-bg-gray-300 tw-cursor-pointer"
                      title={`Lihat detil ${b.description}`} 
                      onDoubleClick={() => handleDetail(b.id)}>
                      <TableCell className="tw-font-medium">
                        {num++}
                      </TableCell>
                      <TableCell>{b.categoryName}</TableCell>
                      <TableCell>{b.description}</TableCell>
                      <TableCell>{formatDate(b.start_date)}</TableCell>
                      <TableCell>{formatDate(b.end_date)}</TableCell>
                      <TableCell className="tw-text-right">
                        {formatNumberToRupiah(b.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="tw-bg-gray-200">
                  <TableRow>
                    <TableCell colSpan={5}>Total Income</TableCell>
                    <TableCell className="tw-text-right">{formatNumberToRupiah(amount)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
