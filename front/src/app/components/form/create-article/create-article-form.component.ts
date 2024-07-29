import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map, mergeMap, Observable, Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { Theme } from 'src/app/interfaces/theme.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-create-article-form',
  templateUrl: './create-article-form.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class CreateArticleFormComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen:boolean = false;
  public loading: boolean = false;
  public onError: boolean = false;
  public errorMessage: string = '';
  public submitted: boolean = false;
  public themes: Observable<Theme[]> | undefined;
  private subscription: Subscription = new Subscription(); 

  public form = this.fb.group({
    theme_id: [ '', [ Validators.required ] ],
    title: [ '', [ Validators.required ]],
    content: [ '', [ Validators.required ]]
  });

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.themes = this.themeService.getAllThemes();

    this.subscription.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );

    this.subscription.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  public submit(): void {
    this.loading = true;

    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    const article: Article = {
      theme_id: Number(this.form.get('theme_id')!.value!),
      title: this.form.get('title')!.value!,
      content: this.form.get('content')!.value!,
    };

    this.articleService.createArticle(article).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/articles']);
      },
      error: (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error.message;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

