import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditResponse } from 'src/app/common/validators/edit-response.model';
import { PersonService } from 'src/app/services/person.service';
import { Person, TypePerson } from '../person.model';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css'],
})
export class EditPersonComponent implements OnInit {
  @Input('person') personEdit!: Person;
  @Input('personType') personType! : TypePerson;
  @Output('cancelSave') event = new EventEmitter();
  editResponse = new EditResponse();
  isNewPerson =  false;
  form = this.fb.group({
    _id: '',
    name: ['', Validators.required],
    companyName: '',
    address: '',
    city: '',
    country: '',
    postal: '',
    mobilePhone: '',
    workPhone: '',
    email: '',
    personType: ['', Validators.required],
  });
  constructor(private fb: FormBuilder, private personService: PersonService) {}

  ngOnInit(): void {
    if (!this.personEdit)this.isNewPerson = true;
    else {
      this.form.patchValue(this.personEdit);
      if(!this.personEdit.customer) this.form.get('personType')?.patchValue('vendor');
      else if(!this.personEdit.vendor) this.form.get('personType')?.patchValue('customer');
      else this.form.get('personType')?.patchValue('both');
    }
  }

  onCancel() {
    console.log('from cancel')
    this.event.emit({ cancel: true });
  }

  onSubmit() {
    // don't do anything if the form is invalid
    console.log(this.form)
    if (!this.form.valid  || this.editResponse.save ) return ;
    this.editResponse.save = true;
    // change person
    const person: Person = this.form.value;
    const personType = this.form.get('personType')?.value;
    if (personType === 'customer') {
      person.customer = true;
      person.vendor = false;
    } else if (personType === 'vendor') {
      person.customer = false;
      person.vendor = true;
    } else if (personType === 'both') {
      person.customer = true;
      person.vendor = true;
    } else return;
    // save or update person
    let handleRes: any;
    if(this.isNewPerson)  handleRes = this.personService.savePerson(person);
    else  handleRes = this.personService.updatePersonById(person, person._id);
   handleRes.subscribe({
      next: (res :Person) => {
          this.event.emit({ person: res });
      },
      error: () => {
        this.editResponse.save = false;
        this.editResponse.error = true;
        setTimeout(()=> {this.editResponse.error = false},3000);
      },
    });
  }
}
