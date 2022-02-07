import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, exhaustMap, take, tap } from 'rxjs';
import { Constants } from '../common/validators/constants';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';
  private registerUrl = 'http://localhost:3000/register';
  user = new BehaviorSubject<User|null>(null);
  constructor(private http: HttpClient) {}
  signIn(email: string, password: string) {
    return this.http
    .post(this.loginUrl, {
      username: email,
      password,
    })
    .pipe(
      tap((userData: any) => {
        this.handleAuthentication(userData);
      })
      );
    }
  register(newUser: { email: string; password: string; name: string; }) {
      return this.http.post(this.registerUrl, newUser).pipe(
        take(1),
        exhaustMap((userInfo:any) => {
          console.log(newUser)
          return this.signIn(userInfo.email, newUser.password);
        }),
        catchError(err => {
          console.log(err);
          if(err.error.message === "Email_Already_Exists") throw new Error('email has already been used');
          throw new Error('Unknown error');
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
    const loadedUser = new User(userData?._token,userData?.name ,userData?.email,+userData?.expirationDate,userData?._id);
    console.log(loadedUser)
    if(loadedUser.token)
      this.user.next(loadedUser);
  }

  handleAuthentication(userData: any) {
    const { _token,name, email, expiresIn, id } = userData;
    const expirationDate =  Date.now() + (+expiresIn)*1000;
    const actualUser = new User(_token,name, email, expirationDate, id);
    localStorage.setItem(Constants.userData,JSON.stringify({ _token,name, email, expirationDate , _id: id }));
    this.user.next(actualUser);
  }
}
