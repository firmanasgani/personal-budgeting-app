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
import { useState } from "react";

export default function Budget() {
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

  let i = 1;
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];
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
        <div className="tw-flex tw-flex-row tw-mt-4 tw-mb-4">
          <Input
            className="tw-mr-2"
            placeholder="Cari berdasarkan deskripsi"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
          <Button variant={"outline"}>Cari</Button>
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
              <Table>
                <TableCaption>List of Budget.</TableCaption>
                <TableHeader>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>catgory</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">
                    Amount this month
                  </TableHead>
                </TableHeader>
                <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">
                        {invoice.invoice}
                      </TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        {invoice.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total Income</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
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
