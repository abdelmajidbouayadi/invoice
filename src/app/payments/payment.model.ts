import { Person } from "../persons/person.model";

export interface Payment {
  _id: string;
  amount: number;
  num: number;
  date: Date;
  person: Person;
  type: TypePayment;
  createdAt:Date;
}
export enum TypePayment{
  received = 'received',
  made = 'made'
}
