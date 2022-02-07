import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticate = false;
  subscription!: Subscription;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.autoLogin();
    console.log('ok ng onInit')
    this.subscription = this.authService.user.subscribe((user: User|null) => {
      this.isAuthenticate = !!user;
      console.log(user);
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
