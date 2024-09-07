import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ApiUrl, formatNumberToRupiah } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
interface ICategory {
  id: string;
  code: string;
  name: string;
  type: string;
  total_ctg: number;
  sum_ctg: number;
}
const Category = () => {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [type, setType] = useState('')
  const [errorState, setErrorState] = useState(false);
  const selectType = [
    'semua',
    'income',
    'expenses'
  ]
  const [sumIncome, setSumIncome] = useState(0)
  const [sumExpenses, setSumExpenses] = useState(0)
  const [isloading, setIsLoading] = useState(true);

  const urlApi = ApiUrl();

  const fetchCategory = async () => {
    setIsLoading(true);
   
    const token = localStorage.getItem("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      setErrorState(false)
      
      const response = await axios.get(`${urlApi}/category?type=${type}`, config);
    
      const sum_expenses = response.data.categories.filter(c => c.type === 'expenses').reduce((a, b) => a + b.sum_ctg, 0);
      setSumExpenses(sum_expenses)
      const sum_income = response.data.categories.filter(c => c.type === 'income').reduce((a, b) => a + b.sum_ctg, 0);
      setSumIncome(sum_income)
      setCategory(response.data.categories.map(c => ({ ...c, sum_expenses, sum_income })));
    } catch (error) {
      setErrorState(true)
    } finally {
      // do nothing
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [type]);

  const handleChange = (event: any) => {
    setType(event.target.value); // Update the state with the selected value
  };
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-row tw-mt-4 tw-mb-4">
          
          <select className="tw-w-[20%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 sm:tw-w-[50%] md:tw-w-[35%] focus:tw-ring-ring focus:tw-border-primary" value={type}  onChange={handleChange}>
            {selectType.map((t) => (
              <option key={t} value={t == 'semua' ? '' : t}>{t}</option>
            ))
            }
          </select> 
          <Button variant={"default"}>Cari</Button>
        </div>

        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>

              <div className="tw-mt-4">
                <a
                  href="/category/add"
                  className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                >
                  Tambah Kategori
                </a>
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
                  {isloading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="tw-text-center">Fetching data...</TableCell>
                    </TableRow>
                  ) :( errorState ? (
                    <TableRow>
                    <TableCell colSpan={5} className="tw-text-center">Catetgory not found</TableCell>
                  </TableRow>
                  ) : (
                    category.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="tw-font-medium">
                          {c.name}
                        </TableCell>
                        <TableCell>{c.code}</TableCell>
                        <TableCell>{c.type}</TableCell>
                        <TableCell>{c.total_ctg}</TableCell>
                        <TableCell className="tw-text-right">{formatNumberToRupiah(c.sum_ctg)}</TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="tw-bg-gray-600 tw-text-white">
                    <TableCell colSpan={4}>Total Expenses</TableCell>
                    <TableCell className="tw-text-right">{isloading ? 0 : formatNumberToRupiah(sumExpenses)}</TableCell>
                  </TableRow>
                  <TableRow className="tw-bg-gray-400">
                    <TableCell colSpan={4}>Total Income</TableCell>
                    <TableCell className="tw-text-right">{isloading ? 0 :formatNumberToRupiah(sumIncome)}</TableCell>
                  </TableRow>
                  <TableRow className="tw-bg-gray-200">
                    <TableCell colSpan={4}>Total amount</TableCell>
                    <TableCell className="tw-text-right">{isloading ? 0 :formatNumberToRupiah(sumIncome-sumExpenses)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Category;
