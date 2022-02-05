import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | undefined|null;
  isViewProfile = false;

  constructor(private authService: AuthService) { }
  subscription!:Subscription;
  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  onLogout(){
    this.authService.logout();
  }
  onViewProfile(){
    this.isViewProfile = !this.isViewProfile;
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
    }
}
