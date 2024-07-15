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

    constructor(
        private breakpointService: BreakpointService, 
        private router: Router
    ) {}

    checkCurrentRoute() {
        const currentUrl = this.router.url;
        this.isLoginOrRegisterPage = currentUrl === '/login' || currentUrl === '/register';
        this.isOtherPage = !this.isLoginOrRegisterPage;
    }

    ngOnInit() {
        this.breakpointService.isSmallScreen().subscribe(isSmall => {
        this.isSmallScreen = isSmall;
        });

        this.breakpointService.isLargeScreen().subscribe(isLarge => {
        this.isLargeScreen = isLarge;
        });

        this.checkCurrentRoute();
    }
}
