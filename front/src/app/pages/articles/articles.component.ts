import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticlesComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public articles: any[] = [];

  constructor(
    private breakpointService: BreakpointService, 
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });

    this.getArticles();
  }

  getArticles(): void {
    this.articleService.getAllArticles().subscribe(
      (data: Article[]) => {
        this.articles = data;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    );
  }
}
