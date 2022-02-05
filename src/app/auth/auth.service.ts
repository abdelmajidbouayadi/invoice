import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Constants } from '../common/validators/constants';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000/login';
  user = new BehaviorSubject<User|null>(null);
  constructor(private http: HttpClient) {}
  signIn(email: string, password: string) {
    return this.http
      .post(this.url, {
        username: email,
        password,
      })
      .pipe(
        tap((userData: any) => {
          this.handleAuthentication(userData);
        })
      );
  }
  logout(){
    this.user.next(null);
    localStorage.removeItem(Constants.jwtStorageName);
  }

  handleAuthentication(userData: any) {
    const { _token, email, expiresIn, id } = userData;
    const expirationDate =  Date.now() + (+expiresIn)*1000;
    const actualUser = new User(_token, email, expirationDate, id);
    localStorage.setItem(Constants.jwtStorageName,_token);
    this.user.next(actualUser);
  }
}
