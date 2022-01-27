import { Person } from '../persons/person.model';
import { Product } from '../products/product.model';
export interface Rows {
  price: number;
  quantity: number;
  title: string;
  description: string;
  product:string; //id of product
}
export interface Invoice {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  person: string;
  num: number;
  date: Date;
  invoiceDueDate: Date;
  rows: Rows[];
  note: string;
  type: TypeInvoice;
}

export function getTotal(invoice:Invoice){
  if(!invoice?.rows) return 0;
  return invoice.rows?.reduce((total,row)=> row?.price*row?.quantity ? total+= row?.price*row?.quantity : total,0)
}

export enum TypeInvoice{
  bill = "bill",
  invoice = "invoice"

}
