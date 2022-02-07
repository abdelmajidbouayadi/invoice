import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getTotal, Invoice, TypeInvoice } from 'src/app/invoices/invoice.model';
import { Payment, TypePayment } from 'src/app/payments/payment.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PersonService } from 'src/app/services/person.service';
import { Person } from '../person.model';

@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.css'],
})
export class ViewPersonComponent implements OnInit {
  personInvoices: Invoice[] = [];
  personPayments: Payment[] = [];
  typePayment = TypePayment;
  typeInvoice = TypeInvoice;
  remaining = 0;
  constructor(
    private invoiceService: InvoiceService,
    private personService: PersonService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}
  personViewed!: Person;
  invoiceViewed!: Invoice;
  ngOnInit(): void {
    const personId = this.route.snapshot.paramMap.get('id');
    this.personService.getPersonsById(personId).subscribe({
      next: (res: any) => {
        this.personViewed = res;
        console.log(res);
        //get person invoices
        this.invoiceService.getInvoicesByPersonId(personId).subscribe({
          next: (invoicesRes: any) => {
            console.log(invoicesRes);
            this.personInvoices = invoicesRes;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
        //get person payments
        this.paymentService.getPaymentsByPersonId(personId).subscribe({
          next: (paymentRes: any) => {
            console.log(paymentRes);
            this.personPayments = paymentRes;
            this.remaining = this.getRemaining();
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  invoiceTotal(invoice: Invoice) {
    return getTotal(invoice);
  }
  viewInvoice(invoice: Invoice) {
    this.invoiceViewed = invoice;
  }

  getRemaining(){
    const totalInvoiceAmount = this.personInvoices.reduce((total, invoice) => {
      if(invoice.type === TypeInvoice.invoice) return total + getTotal(invoice);
      return total - getTotal(invoice);
    },0);
    const totalPaymentAmount = this.personPayments.reduce((total, payment) => {
      if(payment.type === TypePayment.received) return total + payment?.amount;
      return total - payment?.amount;
    },0);

    return totalInvoiceAmount - totalPaymentAmount;
  }
}
