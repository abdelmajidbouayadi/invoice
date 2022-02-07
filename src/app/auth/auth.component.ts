import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoading = false;
  isError = false;
  errorMessage:string|undefined;
  isLogin =true;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: any){
    this.isLoading = true;
    this.isError = false;
    const {email , password, name}= form.value;

    let handleResponse:any;
    if(this.isLogin)
     handleResponse = this.authService.signIn(email,password);
     else {
       const newUser = {email , password, name};
       handleResponse = this.authService.register(newUser);
     }
     handleResponse.subscribe({
      next: ()=> {
        this.isLoading = false;
      },
      error: (err:Error)=> {
        this.isLoading = false;
        this.isError= true;
        this.errorMessage =err.message;
      }
    });
  }
}
