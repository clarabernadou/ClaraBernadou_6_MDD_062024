import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment.interface';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public submitted = false;
  public comments: Comment[] = [];

  public form = this.fb.group({
    content: [
      '',
      [
        Validators.required,
      ]
    ],
  })

  constructor(
    private breakpointService: BreakpointService,
    private commentService: CommentService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  public submitComment(): void {
    const articleId = Number(this.activatedRouter.snapshot.paramMap.get('id')!);

    const comment: Comment = {
      content: this.form.get('content')!.value!,
    };

    this.commentService.createComment(articleId, comment).subscribe();
  }
}

