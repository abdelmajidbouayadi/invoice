import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from '../invoices/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices : Invoice[] =[];
  private invoicesUpdate = new Subject<Invoice[]>();
  private url = 'http://localhost:3000/api/invoices';
  constructor(private http: HttpClient) { }

  saveInvoices(invoice: Invoice){
    this.http.post(this.url, invoice)
      .subscribe(response => {})
  }
  getInvoices(){
    this.http.get(this.url)
          .subscribe((response: any) => {
            this.invoices = response;
            this.invoicesUpdate.next(response);
          });

  }
  invoiceUpdate(){
    return this.invoicesUpdate.asObservable();
  }

  getInvoiceById(id: string|null){
      if(!id) return null;
      return  this.http.get(this.url + '/' + id );
  }

  deleteInvoiceById(id: string){
    this.http.delete(this.url + id).subscribe(
      response => {
        this.getInvoices();
      }
    )
  }


}
