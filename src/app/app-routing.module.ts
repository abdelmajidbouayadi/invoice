import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './invoices/invoice-view/invoice-view.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditPaymentComponent } from './payments/edit-payment/edit-payment.component';
import { PaymentsComponent } from './payments/payments.component';
import { EditPersonComponent } from './persons/edit-person/edit-person.component';
import { ViewPersonComponent } from './persons/view-person/view-person.component';
import { ViewPersonsComponent } from './persons/view-persons/view-persons.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'sales/invoices',
    component: InvoicesComponent,
    children: [
      { path: ':id/edit', component: InvoiceEditComponent },
      { path: 'new', component: InvoiceEditComponent },
      { path: ':id', component: InvoiceViewComponent },
      { path: '', component: InvoiceViewComponent },
    ],
  },
  { path: 'inventory/products', component: ProductsComponent },
  {
    path: 'sales/customers',
    children: [
      { path: '', component: ViewPersonsComponent },
      { path: ':id', component: ViewPersonComponent },
    ],
  },
  {
    path: 'sales/payments-received',
    component: PaymentsComponent,
    children: [
      { path: 'new', component: EditPaymentComponent },
      { path: ':id/edit', component: EditPaymentComponent },
    ],
  },
  {
    path: 'purchases/payments-made',
    component: PaymentsComponent,
    children: [
      { path: 'new', component: EditPaymentComponent },
      { path: ':id/edit', component: EditPaymentComponent },
    ],
  },
  {
    path: 'purchases/vendors',
    children: [
      { path: '', component: ViewPersonsComponent },
      { path: ':id', component: ViewPersonComponent },
    ],
  },
  {
    path: 'purchases/bills',
    children: [
      { path: ':id/edit', component: InvoiceEditComponent },
      { path: 'new', component: InvoiceEditComponent },
      { path: ':id', component: InvoiceViewComponent },
      { path: '', component: InvoiceViewComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
