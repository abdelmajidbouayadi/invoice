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
    localStorage.removeItem(Constants.userData);
  }
  autoLogin(){
    console.log(String(localStorage.getItem(Constants.userData)));
    const userData:any = JSON.parse(String(localStorage.getItem(Constants.userData)));
    if(!userData)return ;
    const loadedUser = new User(userData?._token, userData?.email,+userData?.expirationDate,userData?._id);
    console.log(loadedUser)
    if(loadedUser.token)
      this.user.next(loadedUser);
  }

  handleAuthentication(userData: any) {
    const { _token, email, expiresIn, id } = userData;
    const expirationDate =  Date.now() + (+expiresIn)*1000;
    const actualUser = new User(_token, email, expirationDate, id);
    localStorage.setItem(Constants.userData,JSON.stringify({ _token, email, expirationDate , _id: id }));
    this.user.next(actualUser);
  }
}
