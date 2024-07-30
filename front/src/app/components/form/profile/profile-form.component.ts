import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { Theme } from 'src/app/interfaces/theme.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ProfileFormComponent implements OnInit {
    public isSmallScreen: boolean = false;
    public isLargeScreen: boolean = false;
    public loading: boolean = false;
    public onError: boolean = false;
    public errorMessage: string = '';
    public submitted: boolean = false;
    public themes: Theme[] = [];
    public user: User = {} as User;
    private subscriptions: Subscription = new Subscription();

    public form = this.fb.group({
        username: [ '', [ Validators.required ] ],
        email: [ '', [ Validators.required ] ]
    });

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.getMe();
    }

    private getMe(): void {
        this.loading = true;
        this.subscriptions.add(
            this.userService.getMe().subscribe({
                next: (user: User) => {
                    this.user = user;
                    this.themes = user.subscriptions as unknown as Theme[];
                    this.form.patchValue({
                        username: user.username,
                        email: user.email
                    });
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.onError = true;
                    this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
                }
            })
        );
    }

    public submit(): void {
        this.submitted = true; 
        if (this.form.invalid) return;

        this.loading = true;

        this.subscriptions.add(
            this.userService.updateMe(this.form.value as User).subscribe({
                next: (user: User) => {
                    this.user = user;
                    this.loading = false;
                    sessionStorage.setItem('token', user.token!);
                },
                error: (error) => {
                    this.loading = false;
                    this.onError = true;
                    this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}