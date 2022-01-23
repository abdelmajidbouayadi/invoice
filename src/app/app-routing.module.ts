import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './invoices/invoice-view/invoice-view.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditPersonComponent } from './persons/edit-person/edit-person.component';
import { ViewPersonsComponent } from './persons/view-persons/view-persons.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
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
  { path: 'persons', component: ViewPersonsComponent },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
