import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Invoice } from '../invoice.model';
import { Product } from '../../products/product.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
})
export class InvoiceEditComponent implements OnInit {
  isSearchPerson = false;
  form = this.fb.group({
    _id: '',
    person: '',
    name: '',
    address: '',
    city: '',
    type: 'invoice',
    country: '',
    postal: '',
    date: new Date(Date.now()).toJSON().slice(0, 19),
    invoiceDueDate: null,
    num: null,
    rows: this.fb.array([]),
    note: null,
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.invoiceService.getInvoiceById(params.get('id'))?.subscribe({
          next: (invoice: any) => this.setInvoice(invoice),
          error: () => this.newInvoice(),
        });
      } else this.newInvoice();
    });
  }
  get rows() {
    return this.form.get('rows') as FormArray;
  }
  get rowsControls() {
    return this.rows.controls as FormGroup[];
  }
  addRow(product?: Product) {
    const rowForm = this.fb.group({
      quantity: ['', Validators.pattern(/[0:9]/)],
      product: '',
      title: '',
      description: '',
      price: ['', Validators.pattern(/[0:9]/)],
    });

    //this code add product to the row
    if (product) {
      rowForm.patchValue(product);
      rowForm.get('product')?.patchValue(product._id);
      rowForm.get('price')?.patchValue(product.sellingPrice);
    }

    this.rows.push(rowForm);
  }
  deleteRow(index: number) {
    this.rows.removeAt(index);
  }

  getTotal() {
    let total = 0;
    for (let row of this.rowsControls) {
      total += row.get('price')?.value * row.get('quantity')?.value;
    }
    return total;
  }

  newInvoice() {
    this.addRow();
    this.addRow();
    this.invoiceService.getInvoiceLastNum().subscribe({
      next: (res) => {
        this.form.get('num')?.patchValue(+res + 1);
      },
    });
  }
  setInvoice(invoice: Invoice) {
    this.form.patchValue(invoice);
    this.form.get('date')?.patchValue(invoice.date.toString().slice(0, 19));
    this.form
      .get('invoiceDueDate')
      ?.patchValue(invoice.invoiceDueDate.toString().slice(0, 19));
    for (let row of invoice.rows) this.addRow();
    this.rows.patchValue(invoice.rows);
  }

  onSearchPerson($event: any) {
    const person = $event.person;
    if (person) {
      const addPerson = {
        name: person.name,
        address: person.address,
        city: person.city,
        country: person.country,
        postal: person.postal,
        person: person._id
      };
      this.form.patchValue(addPerson);
      this.isSearchPerson = false;
    }
  }

  onSubmit() {
    console.log(this.form.value);
    this.invoiceService.saveInvoice(this.form.value).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
