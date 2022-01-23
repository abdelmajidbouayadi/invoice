import { NgLocaleLocalization } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { Invoice } from '../invoice.model';
import { Product } from '../../products/product.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {


  form =  this.fb.group({
    person:this.fb.group({
    _id: '',
    name: '',
    address: '',
    city: '',
    country: '',
    postal: '',
    }),
    date:  new Date(Date.now()).toJSON().slice(0,10),
    invoiceDueDate:null,
    num: null,
    rows: this.fb.array([]),
    note: null
  });

  constructor(private fb:FormBuilder, private route: ActivatedRoute, private invoiceService: InvoiceService){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        if(params.get('id') ){
          this.invoiceService.getInvoiceById(params.get('id'))?.subscribe({
            next:(invoice: any) => this.setInvoice(invoice),
            error:() => this.newInvoice(),
          });
        }
        else this.newInvoice();
      }
    )

  }
  get rows() {
    return this.form.get("rows") as FormArray;
  }
  get rowsControls(){
    return this.rows.controls as FormGroup[];
  }
  addRow(product?:Product){
    const rowForm = this.fb.group({
      quantity: ['',Validators.pattern(/[0:9]/)],
      product:this.fb.group({
        _id: '',
        description: '',
        price:0,
      }),
      price: ['',Validators.pattern(/[0:9]/)],
    });

    //this code add product to the row
    if(product) {
        rowForm.get('product')?.patchValue(product);
        rowForm.get('price')?.patchValue(product.sellingPrice);
        }


    this.rows.push(rowForm);
  }
  deleteRow(index: number){
    this.rows.removeAt(index);
  }

  getTotal(){
    let total = 0;
    for(let row of this.rowsControls){
      total += row.get('price')?.value * row.get('quantity')?.value;
    }
    return total;
  }

  newInvoice(){
    this.addRow();
    this.addRow()
  }
  setInvoice(invoice : Invoice){
    this.form.patchValue(invoice);
    for(let row of  invoice.rows)this.addRow();
    this.rows.patchValue(invoice.rows);
  }



  onSubmit(){
    const invoice: Invoice ={
      _id:'',
      person: this.form.get('person')?.value || {},
      num:  this.form.get('num')?.value || '',
      date: this.form.get('date')?.value || null,
      invoiceDueDate: this.form.get('invoiceDueDate')?.value || null,
      rows: this.form.get('rows')?.value ||  [],
      note: this.form.get('note')?.value || '',
    };
    // console.log(this.form);
    console.log(invoice);
    // this.invoiceService.saveInvoices(invoice);
  }

}
