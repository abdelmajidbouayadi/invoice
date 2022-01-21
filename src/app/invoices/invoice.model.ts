import { Person } from '../persons/person.model';
import { Product } from './product.model';
export interface Rows {
  price: number;
  quantity: number;
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
  return invoice.rows?.reduce((total,row)=> row?.price*row?.quantity ? total+= row?.price*row?.quantity : total,0)
}
