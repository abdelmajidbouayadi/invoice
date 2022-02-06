import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/services/person.service';
import { Person, TypePerson } from '../person.model';

@Component({
  selector: 'app-search-person',
  templateUrl: './search-person.component.html',
  styleUrls: ['./search-person.component.css'],
})
export class SearchPersonComponent implements OnInit {
  @Input('personType') personType!: TypePerson;
  @Input('idSelectedPerson') idSelectedPerson: string | undefined = undefined;
  @Output('person') event = new EventEmitter();
  subscription!: Subscription;
  persons: Person[] = [];
  searchPersons: Person[] = [];
  printPersons: Person[] = [];
  isEditMode = false;
  personSelected!: Person | undefined;
  isSearchPerson = false;
  constructor(private personService: PersonService) {}
  page = 1;
  collectionSize = 0;
  maxSize = 10;
  ngOnInit(): void {
    this.subscription = this.personService.personChange.subscribe(
      (res: any) => {
        if (this.personType) {
          this.persons = res;
          this.initialization();
          if (
            this.idSelectedPerson &&
            this.personService.getPersonsId(this.idSelectedPerson)
          ) {
            this.personSelected = this.personService.getPersonsId(
              this.idSelectedPerson
            );
          }
        }
      }
    );

    this.personService.getPersonsByType(this.personType);
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
  onSend(person: Person) {
    this.personSelected = person;
    this.event.emit({ person });
    this.isSearchPerson = false;
  }
  onAdd($event: any) {
    this.isEditMode = false;
    if ($event.person) this.event.emit({ person: $event.person });
  }
  onAppEdit() {
    this.isEditMode = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
