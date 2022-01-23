import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditResponse } from 'src/app/common/validators/edit-response.model';
import { PersonService } from 'src/app/services/person.service';
import { Person } from '../person.model';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css'],
})
export class EditPersonComponent implements OnInit {
  @Output('cancel&save') event = new EventEmitter();
  editResponse!: EditResponse;
  form = this.fb.group({
    id: '',
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

  ngOnInit(): void {}

  onCancel() {
    this.event.emit({ cancel: true });
  }

  onSubmit() {
    if (!this.form.valid) return;
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
    }

    this.personService.savePerson(person).subscribe({
      next: (res) => {
        this.event.emit({ person: res });
      },
      error: () => {
        this.editResponse.error = true;
        setTimeout(()=> {this.editResponse.error = false},3000);
      },
    });
  }
}
