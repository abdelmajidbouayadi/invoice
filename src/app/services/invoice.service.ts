import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Invoice } from '../invoices/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices : Invoice[] =[];
  private invoicesChange = new Subject<Invoice[]>();
  sendInvoice = new Subject<Invoice>();
  private url = 'http://localhost:3000/api/invoices';
  constructor(private http: HttpClient) { }

  saveInvoice(invoice: Invoice){
    return this.http.post(this.url, invoice)
  }
  updateInvoice(invoice: Invoice, id:string){
    return this.http.patch(this.url+'/'+id, invoice)
  }

  getInvoices(){
    this.http.get(this.url)
          .subscribe((response: any) => {
            this.invoices = response;
            this.invoicesChange.next(response);
          });

  }
  invoiceUpdate(){
    return this.invoicesChange.asObservable();
  }

  getInvoiceById(id: string|null){
      if(!id) return null;
      return  this.http.get(this.url + '/' + id );
  }

  deleteInvoiceById(id: string){
    return this.http.delete(this.url + '/' + id);
  }

  getInvoiceLastNum(){
    return this.http.get(this.url + '/lastnum').pipe(map((x: any) => x.num));
  }


}
