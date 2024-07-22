import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { Theme } from 'src/app/interfaces/theme.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = false;
  public onError = false;
  public errorMessage = '';
  public submitted = false;
  public themes: Observable<Theme[]> = this.getAllThemes();

  public form = this.fb.group({
    theme_id: [
      '',
      [
        Validators.required,
      ]
    ],
    title: [
      '',
      [
        Validators.required
      ]
    ],
    content: [
      '',
      [
        Validators.required
      ]
    ]
  });

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) this.router.navigate(['/login']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  public getAllThemes(): Observable<Theme[]> {
    return this.themeService.getAllThemes().pipe(
      mergeMap((themes: Theme[]) => {
        const themeObservables = themes.map((theme: Theme) => {
          return this.themeService.getThemeById(theme.id!).pipe(
            map((theme: Theme) => ({
              ...theme,
            }))
          );
        });
        return forkJoin(themeObservables);
      })
    );
  }

  public submit(): void {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.onError = false;
    this.errorMessage = '';

    const article: Article = {
      theme_id: Number(this.form.get('theme_id')!.value!),
      title: this.form.get('title')!.value!,
      content: this.form.get('content')!.value!,
    };

    this.articleService.createArticle(article).subscribe(
      (response) => {
        this.loading = false;
        this.router.navigate(['/articles']);
      },
      (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error.message;
      }
    );
  }
}

