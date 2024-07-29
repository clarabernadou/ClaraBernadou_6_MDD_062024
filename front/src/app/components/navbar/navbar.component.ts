import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class NavBarComponent implements OnInit {
    public isSmallScreen: boolean = false;
    public isLargeScreen: boolean = false;
    public isLoginOrRegisterPage: boolean = false;
    public isOtherPage: boolean = false;
    public openNavbarModal:boolean = false;
    public currentUrl: string = this.router.url;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private breakpointService: BreakpointService, 
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.breakpointService.isSmallScreen().subscribe(isSmall => {
                this.isSmallScreen = isSmall;
                this.cdr.detectChanges();
            })
        );

        this.subscriptions.add(
            this.breakpointService.isLargeScreen().subscribe(isLarge => {
                this.isLargeScreen = isLarge;
                this.cdr.detectChanges();
            })
        );

        this.subscriptions.add(
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd)
            ).subscribe(() => {
                this.checkCurrentRoute();
                this.cdr.detectChanges();
            })
        );

        this.checkCurrentRoute();
    }

    private checkCurrentRoute(): void {
        const currentUrl = this.router.url;
        this.isLoginOrRegisterPage = currentUrl === '/login' || currentUrl === '/register';
        this.isOtherPage = !this.isLoginOrRegisterPage;
    }

    public toggleNavbarModal(): void {
        this.openNavbarModal = !this.openNavbarModal;
    }

    public navigate(path: string): void {
        this.router.navigate([path]);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
