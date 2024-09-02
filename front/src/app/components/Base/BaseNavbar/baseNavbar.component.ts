import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-base-navbar',
  templateUrl: './baseNavbar.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class BaseNavBarComponent implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  public isLoginOrRegisterPage: boolean = false;
  public isOtherPage: boolean = false;
  public openNavbarModal: boolean = false;
  public currentUrl: string = this.router.url;
  private subscriptions = new Subscription();

  constructor(
    private breakpointService: BreakpointService, 
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscribeToBreakpoints();
    this.updatePageStatus();
  }

  private subscribeToBreakpoints(): void {
    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  private updatePageStatus(): void {
    this.currentUrl = this.router.url;
    this.isLoginOrRegisterPage = this.currentUrl === '/login' || this.currentUrl === '/register';
    this.isOtherPage = !this.isLoginOrRegisterPage;
  }

  public toggleNavbarModal(): void {
    this.openNavbarModal = !this.openNavbarModal;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}