import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Payment, TypePayment } from '../payments/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  updatePaymentById(payment: Payment, _id: string): any {
    throw new Error('Method not implemented.');
  }
  private payments: Payment[] = [];
  private paymentsChange = new Subject<Payment[]>();
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:3000/api/payments';
  savePayment(payment: Payment) {
    return this.http.post(this.url, payment).pipe(
      map((res: any) => {
        this.payments.push(res);
        this.paymentsChange.next(this.payments);
      })
    );
  }
  addPaymentToService(payment: Payment, newPayment: boolean) {
    if (newPayment) {
      this.payments.push(payment);
      this.paymentsChange.next(this.payments);
    } else {
      const index = this.payments.findIndex((pay) => pay?._id === payment?._id);
      this.payments[index] = payment;
    }
  }

  getPayments() {
    this.http.get(this.url).subscribe((response: any) => {
      this.payments = response;
      this.paymentsChange.next(response);
    });
  }

  getPaymentsByType(type: TypePayment) {
    this.http.get(this.url + '/' + type).subscribe((response: any) => {
      this.payments = response;
      this.paymentsChange.next(response);
    });
  }

  change() {
    return this.paymentsChange.asObservable();
  }

  getPaymentById(id: string) {
    return this.http.get(this.url + '/' + id);
  }

  updatePayment(id: string, payment: Payment) {
    return this.http.patch(this.url + '/' + id, payment);
  }

  deletePayment(id: string) {
    return this.http.delete(this.url + '/' + id);
  }
}
