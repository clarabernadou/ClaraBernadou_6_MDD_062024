import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { Theme } from 'src/app/interfaces/theme.interface';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ProfileFormComponent implements OnInit {
    public isSmallScreen = false;
    public isLargeScreen = false;
    public loading = false;
    public onError = false;
    public errorMessage = '';
    public submitted = false;
    public themes: Theme[] = [];
    public user: User = {} as User;

    public form = this.fb.group({
        username: [
        '',
        [
            Validators.required
        ]
        ],
        email: [
        '',
        [
            Validators.required
        ]
        ]
    });

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.getMe();
    }

    public getMe() {
        this.userService.getMe().subscribe((user: User) => {
            this.user = user;
            this.themes = user.subscriptions as unknown as Theme[];
            this.form.patchValue({
                username: user.username,
                email: user.email
            });
        });
    }

    public submit(): void {
        if (this.form.invalid) {
            this.submitted = true;
            this.form.markAllAsTouched();
            return;
        }

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
        });
    }
}