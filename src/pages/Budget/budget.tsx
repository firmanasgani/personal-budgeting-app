import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter
} from "@/components/ui/table";
import { ApiUrl } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
function formatDate(dateString: string) {
  // Parse the date string
  const date = new Date(dateString);

  // Get the parts of the date
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); // Sat
  const day = date.getDate(); // 24
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase(); // aug
  const year = date.getFullYear(); // 2024

  // Combine into the desired format
  return `${dayOfWeek}, ${day} ${month} ${year}`;
}

function formatNumberToRupiah(number: number) {
  // Use Intl.NumberFormat with Indonesian locale and currency options
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // No decimal places
    maximumFractionDigits: 0, // No decimal places
  }).format(number);
}

export default function Budget() {
  interface IBudget {
    id: string;
    description: string;
    categoryid: string;
    amount: number;
    start_date: string;
    end_date: string;
  }

  const monthName = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const [budget, setBudget] = useState<IBudget[]>([])
  const urlApi = ApiUrl()
  const fetchBudget = async() => {
    const token = localStorage.getItem('authToken')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const response = await axios.get(`${urlApi}/budget`, config)
    setBudget(response.data.budget)
  

  }

  useEffect(() => {
    fetchBudget()
  }, [])

  const date = new Date();
  const month = date.getMonth();
  const monthNow = month < 10 ? `0${month}` : `${month}`;
  const monthNext = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
  const today = `${date.getFullYear()}-${monthNow}-25`;
  const next = `${date.getFullYear()}-${monthNext}-24`;

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(next);
  return (
    <Layout>
      <div className="tw-flex tw-flex-col tw-m-10">
        <div className="tw-flex tw-flex-row tw-mt-4 tw-mb-4 tw-gap-2 tw-flex-wrap">
          <Input
            className="tw-mr-2 tw-max-w-sm"
            placeholder="Cari berdasarkan deskripsi"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            type="date"
            className="tw-mr-2 tw-max-w-sm"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            className="tw-mr-2 tw-max-w-sm"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          ></Input>
          <Button variant={"default"} className="tw-max-w-sm">Cari</Button>
        </div>
        <div className="tw-flex tw-flex-col tw-mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Budget Bulan {monthName[date.getMonth()]}
                <CardDescription>
                  <div className="tw-mt-4">
                    <a
                      href="/budget/add"
                      className="tw-bg-blue-500 tw-text-white tw-text-sm tw-font-semibold tw-py-1 tw-px-2 tw-font-medium tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2"
                    >
                      Buat budget baru
                    </a>
                  </div>
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="rounded">
                <TableCaption>List of Budget.</TableCaption>
                <TableHeader className="tw-bg-blue-300">
                  <TableHead className="tw-w-[100px]  tw-text-black">Name</TableHead>
                  <TableHead>catgory</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End date</TableHead>
                  <TableHead className="tw-text-right">
                    Amount this month
                  </TableHead>
                </TableHeader>
                <TableBody>
                {budget.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="tw-font-medium">
                        {b.description}
                      </TableCell>
                      <TableCell>{b.categoryid}</TableCell>
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
                    <TableCell className="tw-text-right">$2,500.00</TableCell>
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
