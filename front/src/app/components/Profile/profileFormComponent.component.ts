import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { Theme } from 'src/app/interfaces/theme.interface';
import { Subscription } from 'rxjs';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-profile-form-component',
  templateUrl: './profileFormComponent.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  public loading: boolean = false;
  public onError: boolean = false;
  public errorMessage: string = '';
  public submitted: boolean = false;
  public themes: Theme[] = [];
  public user: User = {} as User;
  private subscription: Subscription = new Subscription();

  public form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
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
    this.subscription.add(
      this.userService.getMe().subscribe({
        next: (user: User) => {
          this.handleUserFetchSuccess(user);
        },
        error: (error) => {
          this.handleError(error);
        }
      })
    );
  }

  private handleUserFetchSuccess(user: User): void {
    this.user = user;
    this.themes = user.subscriptions as unknown as Theme[];
    this.form.patchValue({
      username: user.username,
      email: user.email
    });
    this.loading = false;
    this.submitted = false;
  }

  private handleError(error: any): void {
    this.loading = false;
    this.submitted = false;
    this.onError = true;
    this.errorMessage = extractErrorMessage(error);
  }

  public submit(): void {
    this.submitted = true; 
    if (this.form.invalid) return;

    this.loading = true;

    this.subscription.add(
      this.userService.updateMe(this.form.value as User).subscribe({
        next: (user: User) => {
          this.handleUserUpdateSuccess(user);
        },
        error: (error) => {
          this.handleError(error);
        }
      })
    );
  }

  private handleUserUpdateSuccess(user: User): void {
    this.user = user;
    this.loading = false;
    localStorage.setItem('token', user.token!);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
