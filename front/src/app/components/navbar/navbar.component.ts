import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class NavBarComponent implements OnInit {
    public isSmallScreen = false;
    public isLargeScreen = false;
    public isLoginOrRegisterPage: boolean = false;
    public isOtherPage = false;
    public openNavbarModal = false;
    public currentUrl = this.router.url;

    constructor(
        private breakpointService: BreakpointService, 
        private router: Router
    ) {}

    ngOnInit() {
        this.breakpointService.isSmallScreen().subscribe(isSmall => {
        this.isSmallScreen = isSmall;
        });

        this.breakpointService.isLargeScreen().subscribe(isLarge => {
        this.isLargeScreen = isLarge;
        });

        this.checkCurrentRoute();
    }

    checkCurrentRoute() {
        this.isLoginOrRegisterPage = this.router.url === '/login' || this.router.url === '/register';
        this.isOtherPage = !this.isLoginOrRegisterPage;
    }

    toggleNavbarModal() {
        this.openNavbarModal = !this.openNavbarModal;
    }

    redirectToArticlePage() {
        this.router.navigate(['/articles']);
    }
}
