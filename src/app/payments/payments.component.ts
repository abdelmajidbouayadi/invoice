import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentService } from '../services/payment.service';
import { Payment, TypePayment } from './payment.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  subscription!: Subscription;
  payments: Payment[] = [];
  //view payments
  searchPayments: Payment[] = [];
  printPayments: Payment[] = [];

  //edit payment
  paymentEditedIndex: number = NaN;
  paymentEdited!: Payment;

  //type Payment
  paymentType = TypePayment.received;
  //new payment
  newPayment = false;
  constructor(private paymentService: PaymentService, private route: ActivatedRoute, private router: Router) {}
  page = 1;
  collectionSize = 0;
  maxSize = 10;
  deleteError = false;
  ngOnInit(): void {
    this.paymentType = this.route.routeConfig?.path?.split("/").includes('sales') ?  TypePayment.received:TypePayment.made;
    this.subscription = this.paymentService.change().subscribe((res) => {
      this.payments = res;
      this.initialization();
    });
    this.paymentService.getPaymentsByType(this.paymentType);
  }

  onInput($event: HTMLInputElement) {
    let value = $event.value;
    this.searchPayments = this.searchPayment(value);
    this.page = 1;
    this.collectionSize = this.searchPayments?.length || 0;
    this.onPagination(1);
  }
  searchPayment(value: string) {
    return this.payments.filter((payment) =>
      payment?.person?.name.includes(value)
    );
  }

  onPagination(index: number) {
    if (index > 0)
      this.printPayments = this.searchPayments.slice(
        (index - 1) * this.maxSize,
        index * this.maxSize
      );
  }
  initialization() {
    this.searchPayments = this.payments.slice();
    this.collectionSize = this.searchPayments?.length;
    this.page = 1;
    this.onPagination(1);
  }

  //function on click on button edit
  onEdit(index: number, payment: Payment) {
  }
  onEditPaymentFinished($event: any) {
    //change the payment edited in our component
    if ($event?.payment) Object.assign(this.paymentEdited, $event.payment);
    this.paymentEditedIndex = NaN;
  }
  onDelete(payment: Payment, index: number) {
    this.paymentService.deletePayment(payment._id).subscribe({
      next: () => {
        //initialize all payment
        this.deletePaymentInComponent(payment, index);
      },
      error: (err) => {
        this.deleteError = true;
        setTimeout(() => (this.deleteError = false), 3000);
      },
    });
  }
  deletePaymentInComponent(payment: Payment, index: number) {
    this.printPayments.splice(index, 1);
    this.searchPayments = this.searchPayments.filter(
      (pay) => pay !== payment
    );
    this.payments = this.payments.filter((pay) => pay !== payment);
  }

  onAddPayment() {
    this.router.navigate(['./new'] ,{queryParams: {type : this.paymentType} , relativeTo: this.route});
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
