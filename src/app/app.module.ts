import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from'@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SummaryPipe } from './summary.pipe';
import { NavBarComponent } from './nav-bar/nav-bar.component';
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
import { PaymentsComponent } from './payments/payments.component';
import { EditPaymentComponent } from './payments/edit-payment/edit-payment.component';
import { ViewPersonComponent } from './persons/view-person/view-person.component';
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    SummaryPipe,
    NavBarComponent,
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
    ViewPersonsComponent,
    PaymentsComponent,
    EditPaymentComponent,
    ViewPersonComponent,
    AuthComponent,
    UserComponent,
    ProfileComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgChartsModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
      multi:true,
    useClass: AuthInterceptorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
