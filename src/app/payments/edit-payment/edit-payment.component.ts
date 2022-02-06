import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditResponse } from 'src/app/common/validators/edit-response.model';
import { TypePerson } from 'src/app/persons/person.model';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment, TypePayment } from '../payment.model';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css'],
})
export class EditPaymentComponent implements OnInit {
  editResponse = new EditResponse();
  isNewPayment = false;
  paymentEdit!: Payment;
  paymentType = TypePayment.received;
  enumTypePerson= TypePerson;
  isEditReady = false;
  form = this.fb.group({
    _id: '',
    amount: null,
    num: null,
    date: new Date().toISOString().slice(0,10),
    person: '',
    type: TypePayment,
  });
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paymentType = this.route.pathFromRoot[1].toString().includes('sales')
      ? TypePayment.received
      : TypePayment.made;
    this.route.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.paymentService.getPaymentById(id).subscribe({
          next: (res: any) => {
            this.handleResponse(res);

          }
        })
      } else {
        this.isNewPayment = true;
        this.form.get('type')?.patchValue(this.paymentType);
      }
    });
  }

  onCancel() {
    if(this.isNewPayment)
      this.router.navigate(['../'], { relativeTo: this.route });
      else this.router.navigate(['../../'], { relativeTo: this.route });
  }
  onSearchPerson($event :any){
    if($event.person)
    this.form.get('person')?.patchValue($event.person?._id);
  }
  handleResponse(res: any){
    this.paymentEdit = res;
    const form = {
      _id: res?._id,
      amount: res?.amount,
      num: res?.num,
      date: (res?.date as string).slice(0,10),
      person: res?.person?._id,
      type: res.type,
    } ;
    this.form.patchValue(form);
    this.isEditReady = true;
  }
  onSubmit() {
    // don't do anything if the form is invalid
    if (!this.form.valid || this.editResponse.save) return;
    this.editResponse.save = true;

    // save or update payment
    const payment: Payment = this.form.value;
    let handleRes: any;
    if (this.isNewPayment) handleRes = this.paymentService.savePayment(payment);
    else
      handleRes = this.paymentService.updatePaymentById(payment, payment._id);
    handleRes.subscribe({
      next: (res: Payment) => {
        if(this.isNewPayment) this.router.navigate(['../'], { relativeTo: this.route });
        else this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error: (err: any) => {
        this.editResponse.save = false;
        this.editResponse.error = true;
        setTimeout(() => {
          this.editResponse.error = false;
        }, 3000);
      },
    });
  }
}
