import { fetchCategory } from "@/api/fetchCategory";
import { Link, Outlet } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICategory } from "@/lib/interface";
import { formatNumberToRupiah, UtilNextMonth, UtilToday } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const selectType = ["semua", "income", "expenses"];
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [errorState, setErrorState] = useState(null)
  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpenses, setSumExpenses] = useState(0);
  const [today, setToday] = useState(UtilToday);
  const [nextMonth, setNextMonth] = useState(UtilNextMonth);

  const getCategories = async() => {
    try {
      setIsLoading(true)
      setErrorState(null)
      const fetch_category = await fetchCategory({
        type,
        start_date: today,
        end_date: nextMonth
      });
      const sum_expenses = fetch_category
      .filter((c) => c.type === "expenses")
      .reduce<number>((a, b) => a + b.sum_ctg, 0);
    setSumExpenses(sum_expenses);
    const sum_income = fetch_category
      .filter((c) => c.type === "income")
      .reduce<number>((a, b) => a + b.sum_ctg, 0);
    setSumIncome(sum_income);
    setCategories(fetch_category)
    }catch(error: any) {
      setErrorState(error)
    }finally{
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    getCategories()
  }, [type, today, nextMonth]);

  const handleChange = (event: any) => {
    setType(event.target.value); // Update the state with the selected value
  };

  const handleCategoryDetail = (id: string) => {
    navigate(`/category/${id}`);
  };


  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="sm:tw-flex-col md:tw-flex-col tw-flex-col tw-gap-4 tw-flex tw-justify-between tw-mt-4 md:tw-mb-4">
          <select
            className="tw-w-[100%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-ring focus:tw-border-primary"
            value={type}
            onChange={handleChange}
          >
            {selectType.map((t) => (
              <option key={t} value={t == "semua" ? "" : t}>
                {t}
              </option>
            ))}
          </select>
          <Input
            type="date"
            className="tw-mr-2 tw-appearance-none tw-text-foreground tw-border-input tw-bg-background tw-text-sm tw-w-[100%]"
            value={today}
            onChange={(e) => setToday(e.target.value)}
          />
          <Input
            type="date"
            className="tw-mr-2 tw-appearance-none tw-text-foreground tw-border-input tw-bg-background tw-text-sm tw-w-[100%]"
            value={nextMonth}
            onChange={(e) => setNextMonth(e.target.value)}
          />
        </div>

        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-row tw-align-center tw-justify-between">
                <h1 className="tw-text-2xl">List Kategori </h1>

                <Link
                  to="add"
                  className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                >
                  Tambah Kategori
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of categories.</TableCaption>
                <TableHeader>
                  <TableRow className="tw-bg-red-100">
                    <TableHead className="tw-w-[300px]">Name</TableHead>
                    <TableHead>code</TableHead>
                    <TableHead>type</TableHead>
                    <TableHead>qty</TableHead>
                    <TableHead className="tw-text-right">
                      Amount this month
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="tw-text-center">
                        Fetching data...
                      </TableCell>
                    </TableRow>
                  ) : errorState ? (
                    <TableRow>
                      <TableCell colSpan={5} className="tw-text-center">
                        Catetgory not found
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((c) => (
                      <TableRow
                        key={c.id}
                        className="hover:tw-bg-gray-300 tw-cursor-pointer"
                        title={`Lihat detil ${c.name}`}
                        onDoubleClick={() => handleCategoryDetail(c.id)}
                      >
                        <TableCell className="tw-font-medium">
                          {c.name}
                        </TableCell>
                        <TableCell>{c.code}</TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell>{c.total_ctg}</TableCell>
                        <TableCell className="tw-text-right">
                          {formatNumberToRupiah(c.sum_ctg)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow className="tw-bg-gray-400">
                    <TableCell colSpan={4}>Total Expenses</TableCell>
                    <TableCell className="tw-text-right">
                      {isLoading ? 0 : formatNumberToRupiah(sumExpenses)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="tw-bg-gray-200">
                    <TableCell colSpan={4}>Total Income</TableCell>
                    <TableCell className="tw-text-right">
                      {isLoading ? 0 : formatNumberToRupiah(sumIncome)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="tw-bg-gray-400">
                    <TableCell colSpan={4}>Total amount</TableCell>
                    <TableCell className="tw-text-right">
                      {isLoading
                        ? 0
                        : formatNumberToRupiah(sumIncome - sumExpenses)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
};

export default Category;
