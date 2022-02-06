import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Person, TypePerson } from '../persons/person.model';

@Injectable({
  providedIn: 'root',
})
export class PersonService {

  persons: Person[] = [];
  personChange = new Subject();
  private url = 'http://localhost:3000/api/persons';
  constructor(private http: HttpClient) {}

  savePerson(person: Person) {
    return this.http.post(this.url, person).pipe(
      tap((res: any) => {
        this.persons.push(res);
        this.personChange.next([...this.persons]);
      })
    );
  }

  updatePersonById(person: Person, id: string) {
    return this.http.patch(this.url + '/' + id, person).pipe(
      tap((res: any) => {
        const indexUpdatePerson = this.persons.findIndex(person => res._id === person._id );
        this.persons[indexUpdatePerson] = res;
        this.personChange.next([...this.persons]);
      })
    );
  }

  getPersons() {
    this.http.get(this.url).subscribe({
      next: (res: any) => {
        this.persons = res;
        this.personChange.next(res);
      },
    });
  }
  getPersonsByType(typePerson: TypePerson) {
    this.http.get(this.url+'/type/'+typePerson ).subscribe({
      next: (res: any) => {
        this.persons = res;
        this.personChange.next(res);
      },
    });
  }
  getPersonsById(id: string | null) {
    return this.http.get(this.url + '/' + id );
  }
  deletePersonById(id: string) {
    return this.http.delete(this.url + '/' + id).pipe(
      tap((res: any) => {
        let index = this.persons.findIndex((person) => person._id === id);
        this.persons.splice(index, 1);
        this.personChange.next([...this.persons]);
      })
    );
  }
}
