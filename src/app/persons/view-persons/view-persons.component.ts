import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PersonService } from 'src/app/services/person.service';
import { Person } from '../person.model';

@Component({
  selector: 'app-view-persons',
  templateUrl: './view-persons.component.html',
  styleUrls: ['./view-persons.component.css']
})
export class ViewPersonsComponent implements OnInit {

  subscription!: Subscription;
  persons: Person[] = [];
  searchPersons: Person[] = [];
  printPersons:Person[] = [];
  isEditMode = false;
  constructor(private personService : PersonService) { }
  page= 1;
  collectionSize = 0;
  maxSize=10;
  ngOnInit(): void {
    this.subscription = this.personService.personChange.subscribe( (res: any) => {
      this.persons = res;
      this.initialization();

    });
    this.personService.getPersons();

  }

  onInput($event: HTMLInputElement){
    let value = $event.value;
    this.searchPersons = this.persons.filter(person =>  person?.name?.includes(value));
    this.page = 1;
    this.collectionSize = this.searchPersons?.length || 0;
    this.onPagination(1);
  }

  onPagination(index: number){
    if(index >0)
    this.printPersons = this.searchPersons.slice((index - 1)*this.maxSize,index*this.maxSize);
  }
  initialization(){
    this.searchPersons = this.persons.slice();
    this.collectionSize= this.searchPersons?.length;
    this.onPagination(1);
  }

  addPerson(){
    this.isEditMode = true;
  }
  addPersonFinished(){
    this.isEditMode = false;
  }

  onDelete(person: Person){
    this.personService.deletePersonById(person._id).subscribe();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
