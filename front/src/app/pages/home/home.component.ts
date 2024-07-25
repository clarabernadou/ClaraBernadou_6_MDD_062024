import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;

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
