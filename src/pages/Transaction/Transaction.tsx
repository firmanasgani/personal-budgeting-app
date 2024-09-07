import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ICategory, ITranscations } from "@/lib/interface";
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


export default function Transaction() {
  const date = new Date();
  const monthName = UtilMonthName;
  const urlApi = ApiUrl();

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(UtilToday);
  const [amount, setAmount] = useState(0)
  const [endDate, setEndDate] = useState(UtilNextMonth);
  const [transactions, setTransactions] = useState<ITranscations[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get<{ transactions: ITranscations[] }>(
        `${urlApi}/transactions?category=${categoryId}&start_date=${startDate}&end_date=${endDate}`,
        config
      );

      const sumAmount = data.transactions.reduce((a, b) => a + b.amount, 0);

      setAmount(sumAmount)
      

      setTransactions(data.transactions);
    } catch (err: any) {
      console.error(err.response.status)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    const { data } = await axios.get<{ categories: ICategory[] }>(
      `${urlApi}/category`,
      config
    );

    setCategory(data.categories.filter((c) => c.type === 'expenses'));
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTransactions()
    }, 500)
  }, [categoryId, startDate, endDate]);

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleCahnge = (event: any) => {
    setCategoryId(event.target.value);
  };

  let nomor = 1;
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-row tw-mt-4 tw-mb-4">
          <select
            className="tw-w-[20%] tw-mr-2 tw-appearance-none tw-bg-background tw-border tw-border-input tw-rounded-md tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-foreground focus:tw-outline-none focus:tw-ring-1 sm:tw-w-[50%] md:tw-w-[35%] focus:tw-ring-ring focus:tw-border-primary"
            value={categoryId}
            onChange={handleCahnge}
          >
            <option value="">Semua</option>
            {category.map((item) => (
              <option value={item.id} key={item.id}>{item.name}</option>
            ))}
          </select>
        
          <Input
            type="date"
            className="tw-mr-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            className="tw-mr-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></Input>
        </div>
        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Pengeluaran Bulan {monthName[date.getMonth()]}
              </CardTitle>
              <div className="tw-mt-4">
                <a
                  href="/transaction/add"
                  className="tw-bg-blue-500 tw-w-min-sm tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                >
                  Buat Transaksi
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of Transaction.</TableCaption>
                <TableHeader>
                  <TableRow className="tw-bg-red-100">
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>catgory</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tanggal Transaksi</TableHead>
                    <TableHead className="tw-text-right">
                      Amount this month
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={5}>
                      <p>Loading</p>
                    </TableCell>
                  </TableRow>
                  ) : transactions.length < 1 ? (
                   <TableRow>
                     <TableCell colSpan={5}>
                      <p className="tw-text-center">Tidak ada data</p>
                    </TableCell>
                   </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="tw-font-medium">
                          {nomor++}
                        </TableCell>
                        <TableCell>{t.categoryName}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>{formatDate(t.date_transaction)}</TableCell>
                        <TableCell className="tw-text-right">
                          {formatNumberToRupiah(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total Income</TableCell>
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
