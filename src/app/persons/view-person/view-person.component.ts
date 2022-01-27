import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from 'src/app/invoices/invoice.model';
import { InvoiceService } from 'src/app/services/invoice.service';
import { PersonService } from 'src/app/services/person.service';
import { Person } from '../person.model';

@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.css'],
})
export class ViewPersonComponent implements OnInit {
  personInvoices: Invoice[]  = [];
  constructor(
    private invoiceService: InvoiceService,
    private personService: PersonService,
    private route: ActivatedRoute,
  ) {}
  personViewed! : Person;
  ngOnInit(): void {
    const personId = this.route.snapshot.paramMap.get('id');
    this.personService.getPersonsById(personId).subscribe({
      next: (res: any) => {
        this.personViewed = res;
        console.log(res)
        this.invoiceService.getInvoicesByPersonId(personId).subscribe({
          next: (invoicesRes: any) => {
            console.log(invoicesRes);
            this.personInvoices = invoicesRes;
          },
          error: (err: any) => {
            console.log(err);
          }
        });;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
