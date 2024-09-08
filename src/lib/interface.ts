export interface ICategory {
  id: string;
  code: string;
  name: string;
  type: string;
  total_ctg: number;
  sum_ctg: number;
}

export interface ITranscations {
  id: string;
  userid: string;
  categoryid: string;
  categoryName: string;
  amount: number;
  date_transaction: string;
  description: string;
}

export interface IDetailTransaction {
  id: string;
  categoryid: string;
  categoryName: string;
  date_transaction: string;
  description: string;
  amount: number;
}