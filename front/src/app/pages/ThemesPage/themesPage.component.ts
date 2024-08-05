import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-themes-page',
  templateUrl: './themesPage.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ThemesPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);
  }
}

