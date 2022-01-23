import { Person } from '../persons/person.model';
import { Product } from '../products/product.model';
export interface Rows {
  price: number;
  quantity: number;
  title: string;
  product:Product;
}
export interface Invoice {
  _id: string;
  person: Person;
  num: string;
  date: Date;
  invoiceDueDate: Date;
  rows: Rows[];
  note: string;
}

export function getTotal(invoice:Invoice){
  if(!invoice?.rows) return 0;
  return invoice.rows?.reduce((total,row)=> row?.price*row?.quantity ? total+= row?.price*row?.quantity : total,0)
}
