import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { getTotal, Invoice } from '../invoice.model';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  constructor(private invoicesService:InvoiceService){}
  invoices :Invoice[]= [];
  subscription!: Subscription;
   ngOnInit() {
    this.subscription = this.invoicesService.invoiceUpdate()
              .subscribe((res: Invoice[]) => {
                this.invoices= res;
              });
    this.invoicesService.getInvoices();
  }
  invoiceTotal(invoice:Invoice ){
    return getTotal(invoice);
  }

  onDelete(invoice: Invoice){
    this.invoicesService.deleteInvoiceById(invoice._id);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
