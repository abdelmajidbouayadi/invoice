import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/services/person.service';
import { Person, TypePerson } from '../person.model';

@Component({
  selector: 'app-view-persons',
  templateUrl: './view-persons.component.html',
  styleUrls: ['./view-persons.component.css'],
})
export class ViewPersonsComponent implements OnInit {
  subscription!: Subscription;
  persons: Person[] = [];
  searchPersons: Person[] = [];
  printPersons: Person[] = [];
  isAddMode = false;
  isEditMode = false;
  personEdited!: Person;
  typePerson: TypePerson = TypePerson.customer;
  constructor(
    private personService: PersonService,
    private route: ActivatedRoute
  ) {}
  page = 1;
  collectionSize = 0;
  maxSize = 10;
  ngOnInit(): void {
    this.typePerson = (this.route as any)._routerState.snapshot.url.includes(
      'sales'
    )
      ? TypePerson.customer
      : TypePerson.vendor;
    this.subscription = this.personService.personChange.subscribe(
      (res: any) => {
        this.persons = res;
        this.initialization();
      }
    );
    this.personService.getPersonsByType(this.typePerson);
  }

  onInput($event: HTMLInputElement) {
    let value = $event.value;
    this.searchPersons = this.persons.filter((person) =>
      person?.name?.includes(value)
    );
    this.page = 1;
    this.collectionSize = this.searchPersons?.length || 0;
    this.onPagination(1);
  }

  onPagination(index: number) {
    if (index > 0)
      this.printPersons = this.searchPersons.slice(
        (index - 1) * this.maxSize,
        index * this.maxSize
      );
  }
  initialization() {
    this.searchPersons = this.persons.slice();
    this.collectionSize = this.searchPersons?.length;
    this.onPagination(1);
  }

  addPerson() {
    this.isAddMode = true;
  }
  addPersonFinished() {
    this.isAddMode = false;
    this.isEditMode = false;
  }

  onDelete($event: any, person: Person) {
    $event?.stopPropagation();
    this.personService.deletePersonById(person._id).subscribe();
  }
  onEditPerson($event: any, person: Person) {
    $event?.stopPropagation();
    this.personEdited = person;
    this.isEditMode = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
