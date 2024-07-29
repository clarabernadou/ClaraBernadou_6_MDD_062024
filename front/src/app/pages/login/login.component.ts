import { Component, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class LoginComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem('token')) this.router.navigate(['/articles']);

    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );

    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
