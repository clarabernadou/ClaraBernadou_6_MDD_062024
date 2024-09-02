import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['../../app.component.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
