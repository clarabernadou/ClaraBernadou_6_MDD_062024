import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { Theme } from 'src/app/interfaces/theme.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-create-article-form',
  templateUrl: './createArticleForm.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class CreateArticleFormComponent implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  public loading: boolean = false;
  public onError: boolean = false;
  public errorMessage: string = '';
  public submitted: boolean = false;
  public themes$: Observable<Theme[]> | undefined;
  private subscriptions = new Subscription();

  public form = this.fb.group({
    theme_id: ['', [Validators.required]],
    title: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.themes$ = this.themeService.getAllThemes();
    this.subscribeToBreakpoints();
  }

  private subscribeToBreakpoints(): void {
    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  public submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    const article: Article = {
      theme_id: Number(this.form.get('theme_id')!.value!),
      title: this.form.get('title')!.value!,
      content: this.form.get('content')!.value!,
    };

    this.articleService.createArticle(article).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = false;
        this.router.navigate(['/articles']);
      },
      error: (error) => {
        this.loading = false;
        this.submitted = false;
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}