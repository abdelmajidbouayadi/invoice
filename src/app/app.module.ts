import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from'@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SummaryPipe } from './summary.pipe';
import { InputformatDirective } from './inputformat.directive';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InvoiceComponent } from './invoices/invoice/invoice.component';
import { InvoiceEditComponent } from './invoices/invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './invoices/invoice-view/invoice-view.component';
import { PersonsComponent } from './persons/persons.component';
import { ProductsComponent } from './products/products.component';
import { SearchProductComponent } from './products/search-product/search-product.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { EditPersonComponent } from './persons/edit-person/edit-person.component';
import { HeaderComponent } from './header/header.component';
import { ViewComponent } from './invoices/invoice-view/view/view.component';
import { ViewProductComponent } from './products/view-product/view-product.component';
import { SearchPersonComponent } from './persons/search-person/search-person.component';
import { ViewPersonsComponent } from './persons/view-persons/view-persons.component';

@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    SummaryPipe,
    InputformatDirective,
    NavBarComponent,
    HomeComponent,
    NotFoundComponent,
    InvoiceComponent,
    InvoiceEditComponent,
    InvoiceViewComponent,
    PersonsComponent,
    ProductsComponent,
    SearchProductComponent,
    EditProductComponent,
    EditPersonComponent,
    HeaderComponent,
    ViewComponent,
    ViewProductComponent,
    SearchPersonComponent,
    ViewPersonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }