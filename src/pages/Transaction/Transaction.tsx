import { fetchCategory } from "@/api/fetchCategory";
import { fetchTransactions } from "@/api/fetchTransaction";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ICategory, ITranscations } from "@/lib/interface";
import { formatDate, formatNumberToRupiah, UtilNextMonth, UtilToday } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Transaction() {
  const [category, setCategory] = useState<ICategory[]>([]);
  const [categoryid, setCategoryId] = useState("");
  const [transaction, setTransaction] = useState<ITranscations[]>([]);
  const [startDate, setStartDate] = useState(UtilToday);
  const [endDate, setEndDate] = useState(UtilNextMonth);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(0)

  const getCategory = async () => {
    try {
      const data = await fetchCategory();
      setCategory(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions({
        category: categoryid,
        start_date: startDate,
        end_date: endDate,
      });
      setTransaction(data);
      const sumAmount = data.reduce((a, b) => a + b.amount, 0);
      setAmount(sumAmount)
    } catch (err: any) {
      toast.error(`Error fetching transaction: ${err.message}`);
      console.log(err.status);
      if (err.status == 401) {
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setCategoryId(e.target.value)
  }

  useEffect(() => {
    getCategory();
    getTransactions();
  }, [categoryid, startDate, endDate]);

  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <ToastContainer autoClose={2500} />
        <div className="tw-flex tw-flex-row tw-justify-between tw-mb-5">
          <h1 className="tw-mt-2 tw-font-bold">List Transaksi</h1>
        </div>
        <div className="tw-flex tw-flex-row tw-justify-start tw-gap-2 tw-mb-5">
          <select 
            className="tw-w-[20%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 sm:tw-w-[50%] md:tw-w-[35%] focus:tw-ring-1 focus:tw-border-primary"
            onChange={handleChange}
            value={categoryid}
            >
            <option value="">Semua</option>
            {category.map((c) => (
              <option value={c.id} key={c.id}>
                {c.code} | {c.name}
              </option>
            ))}
          </select>
          <div className="tw-w-[20%] sm:tw-w-[50%] md:tw-w-[35%]">
            <Input
              className="tw-mr-2 tw-mx-w-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
            />
          </div>
          <div className="tw-w-[20%] sm:tw-w-[50%] md:tw-w-[35%]">
            <Input
              className="tw-mr-2 tw-mx-w-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
            />
          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-justify-between tw-mb-5">
          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-row tw-align-center tw-justify-between">
                <CardTitle>List Transaksi</CardTitle>
                <Link 
                to="add"
                className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                >Buat Transaksi
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of transactions.</TableCaption>
                <TableHeader>
                  <TableRow className="tw-bg-red-100">
                    <TableHead className="tw-w-[50px]">No. </TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tgl. Transaksi</TableHead>
                    <TableHead className="tw-text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="tw-text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) :
                      transaction.map((t, index) => (
                        <TableRow key={t.id}>
                          <TableCell>
                            {index == 0 ? index + 1: index+1}
                          </TableCell>
                          <TableCell>
                            {t.description}
                          </TableCell>
                          <TableCell>
                            {t.categoryName}
                          </TableCell>
                          <TableCell>
                            {formatDate(t.date_transaction)}
                          </TableCell>
                          <TableCell className="tw-text-right">{formatNumberToRupiah(t.amount)}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="tw-bg-gray-400">
                    <TableCell colSpan={4}>Total Pengeluaran</TableCell>
                    <TableCell className="tw-text-right">
                      {isLoading ? 0 : formatNumberToRupiah(amount)}
                    </TableCell>
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
