import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Person } from '../persons/person.model';

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
      map((res: any) => {
        this.persons.push(res);
        this.personChange.next([...this.persons]);
        return res;
      })
    );
  }

  updatePersonById(person: Person){
    return this.http.post(this.url, person).pipe(
      map((res: any) => {
        this.persons.push(res);
        this.personChange.next([...this.persons]);
        return res;
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
}
