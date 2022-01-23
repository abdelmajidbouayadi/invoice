import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { getTotal, Invoice } from '../../invoice.model';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @Input('invoice') invoice!: Invoice;
  @Output('cancel') event = new EventEmitter();
  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit(): void {
  }
  Total(){
    return getTotal(this.invoice);
  }

  onDelete(){
    if(confirm('do you want to delete this invoice'))
          this.invoiceService.deleteInvoiceById(this.invoice?._id)
            .subscribe({next: () => {
              alert('the invoice has been deleted');
              this.invoiceService.getInvoices();
              this.onCancel();
            }})
  }
  onCancel(){
    this.event.emit({cancel: true});
  }


}
