import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ProfileComponent {

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);
  }

  public logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
