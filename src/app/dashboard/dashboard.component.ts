import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { getTotal, Invoice, TypeInvoice } from '../invoices/invoice.model';
import { Payment, TypePayment } from '../payments/payment.model';
import { InvoiceService } from '../services/invoice.service';
import { PaymentService } from '../services/payment.service';

class InvoicesDetails {
  totalNumber?: number;
  totalSales?: number;
  eachMonthSales: number[];
  yearSales?: number;
  constructor() {
    this.eachMonthSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.totalNumber = 0;
    this.totalSales = 0;
    this.yearSales = 0;
  }

  initialize() {
    this.eachMonthSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.totalNumber = 0;
    this.totalSales = 0;
    this.yearSales = 0;
  }
}

class PaymentDetails {
  totalNumber?: number;
  totalPaymentsReceived?: number;
  totalPaymentsMade?: number;
  yearPaymentsReceived?: number;
  yearPaymentsMade?: number;
  eachMonthPaymentsReceived: number[] = [];
  eachMonthPaymentsMade: number[] = [];
  constructor() {
    this.initialize();
  }

  initialize() {
    this.totalNumber = 0;
    this.totalPaymentsReceived = 0;
    this.totalPaymentsMade = 0;
    this.yearPaymentsReceived = 0;
    this.yearPaymentsMade = 0;
    this.eachMonthPaymentsReceived = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.eachMonthPaymentsMade = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  typeInvoice = TypeInvoice;
  invoices: Invoice[] = [];
  bills: Invoice[] = [];
  invoicesDetails = new InvoicesDetails();
  billsDetails = new InvoicesDetails();
  paymentsDetails = new PaymentDetails();
  payments: Payment[] = [];
  constructor(
    private invoiceService: InvoiceService,
    private paymentService: PaymentService
  ) {}
  isReady = false;
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  dataInvoices: ChartData<'bar', number[], unknown> = this.chartBarData();
  dataBills: ChartData<'bar', number[], unknown> = this.chartBarData();
  dataPayments: ChartData<'bar', number[], unknown> = this.chartLineData();

  ngOnInit(): void {
    this.invoiceService
      .getInvoicesByTypeM(TypeInvoice.invoice)
      .subscribe((invoices: any) => {
        this.invoices = invoices;
        this.prepareInvoiceBill(TypeInvoice.invoice);
      });
    this.invoiceService
      .getInvoicesByTypeM(TypeInvoice.bill)
      .subscribe((bills: any) => {
        this.bills = bills;
        this.prepareInvoiceBill(TypeInvoice.bill);
        this.isReady = true;
      });
    this.paymentService.getPaymentsM().subscribe((payments: any) => {
      this.payments = payments;
      this.preparePayment();
    });
  }
  onInsertYear($event: HTMLInputElement, type: TypeInvoice) {
    const year: number = Math.floor(+$event.value);
    this.isReady = false;
    this.prepareInvoiceBill(type, year);
    this.isReady = true;
  }
  onPaymentInsertYear($event: HTMLInputElement){
    const year: number = Math.floor(+$event.value);
    this.isReady = false;
    this.preparePayment(year);
    this.isReady = true;
  }
  preparePayment(year : number = new Date().getFullYear()) {
    this.isReady = false;
    this.calculatePaymentDetails(year);
    this.dataPayments = this.chartLineData(this.paymentsDetails.eachMonthPaymentsReceived,this.paymentsDetails.eachMonthPaymentsMade)
    this.isReady= true;
  }
  calculatePaymentDetails(year: number = new Date().getFullYear()) {
    this.paymentsDetails.initialize();
    this.paymentsDetails.totalNumber = this.payments.length;
    this.paymentsDetails.totalPaymentsMade = this.payments.reduce(
      (total, payment) => {
        if (payment.type === TypePayment.made) return (total = payment.amount);
        return total;
      },
      0
    );
    this.paymentsDetails.totalPaymentsReceived = this.payments.reduce(
      (total, payment) => {
        if (payment.type === TypePayment.received)
          return (total = payment.amount);
        return total;
      },
      0
    );
    this.payments.forEach((payment) => {
      const date = new Date(payment.date);
      const paymentYear = date.getFullYear();
      const paymentMonth = date.getMonth();
      if (year === paymentYear) {
        if (payment.type === TypePayment.made) {
          this.paymentsDetails.yearPaymentsMade! += payment.amount;
          this.paymentsDetails.eachMonthPaymentsMade![paymentMonth] +=
            payment.amount;
        } else {
          this.paymentsDetails.yearPaymentsReceived! += payment.amount;
          this.paymentsDetails.eachMonthPaymentsReceived![paymentMonth] +=
            payment.amount;
        }
      }
    });
  }
  prepareInvoiceBill(
    type: TypeInvoice,
    year: number = new Date().getFullYear()
  ) {
    if (type === TypeInvoice.invoice) {
      this.calculateDetails(this.invoicesDetails, this.invoices, year);
      this.dataInvoices = this.chartBarData(
        this.invoicesDetails.eachMonthSales
      );
    } else {
      this.calculateDetails(this.billsDetails, this.bills, year);
      this.dataBills = this.chartBarData(this.billsDetails.eachMonthSales);
    }
  }

  calculateDetails(
    details: InvoicesDetails,
    invoices: Invoice[],
    year: number = new Date().getFullYear()
  ) {
    details.initialize();
    details.totalNumber = invoices.length;
    details.totalSales = invoices.reduce((total, invoice) => {
      return total + getTotal(invoice);
    }, 0);
    invoices.forEach((invoice) => {
      const date = new Date(invoice.date);
      const invoiceMonth = date.getMonth();
      const invoiceYear = date.getFullYear();
      if (invoiceYear === year) {
        details.eachMonthSales[invoiceMonth] += getTotal(invoice);
        details.yearSales! += getTotal(invoice);
      }
    });
  }

  chartBarData(data: number[] = []) {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'purchases Data',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
          data: data,
        },
      ],
    };
  }

  chartLineData(data1: number[] = [], data2: number[] = []) {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Payment Received',
          data: data1,
          fill: false,
          // borderColor: 'rgb(75, 192, 192)',
          tension: 0,
        },
        {
          label: 'Payment Made',
          data: data2,
          fill: false,
          // borderColor: 'rgb(255, 205, 86)',
          tension: 0,
        },
      ],
    };
  }
}
