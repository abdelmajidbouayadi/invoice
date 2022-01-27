import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { getTotal, Invoice, TypeInvoice } from '../invoice.model';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  invoiceType = TypeInvoice.invoice;
  constructor(private invoicesService:InvoiceService, private route: ActivatedRoute){}
  invoices :Invoice[]= [];
  subscription!: Subscription;
  //if we are viewing invoice or not
  modeView = false;
  invoiceView!: Invoice;
   ngOnInit() {
    this.invoiceType = this.route.pathFromRoot.toString().includes("sales") ? TypeInvoice.invoice : TypeInvoice.bill;
    this.subscription = this.invoicesService.invoiceUpdate()
              .subscribe((res: Invoice[]) => {
                this.invoices= res;
              });
    this.invoicesService.getInvoicesByType(this.invoiceType);
  }
  invoiceTotal(invoice:Invoice ){
    return getTotal(invoice);
  }

  viewInvoice(invoice : Invoice){
    this.modeView = true;
    this.invoiceView = invoice;
  }
  cancelViewInvoice(){
    this.modeView = false;
  }

  onDelete(invoice: Invoice){
    this.invoicesService.deleteInvoiceById(invoice._id);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
