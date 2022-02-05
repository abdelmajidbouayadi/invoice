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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: any){
    this.isLoading = true;
    this.isError = false;
    const email = form.value?.email;
    const password = form.value?.password;
    this.authService.signIn(email,password).subscribe({
      next: ()=> {
        this.isLoading = false;
      },
      error: (err)=> {
        this.isLoading = false;
        this.isError= true;
        console.log(err);
      }
    });
  }
}
