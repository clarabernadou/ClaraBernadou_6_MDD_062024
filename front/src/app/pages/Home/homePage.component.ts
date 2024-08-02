import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.scss'],
})
export class HomePage implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;

  constructor(
    private breakpointService: BreakpointService, 
    private router: Router
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/articles']);
      return;
    };

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }
}
