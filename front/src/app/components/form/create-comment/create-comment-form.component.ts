import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-create-comment-form',
    templateUrl: './create-comment-form.component.html',
    styleUrls: ['../../../app.component.scss'],
})
export class CreateCommentFormComponent implements OnInit {
  public loading = false;
  public onError = false;
  public errorMessage = '';
  public submitted = false;
  public comments: Comment[] = [];
  public isSmallScreen = false;
  public isLargeScreen = false;

  @Output() updateComments = new EventEmitter<void>();

  public form = this.fb.group({
    content: [
      '',
      [
        Validators.required,
      ]
    ],
  })

  constructor(
    private commentService: CommentService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit() {
    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  public submitComment(): void {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.onError = false;
    this.errorMessage = '';

    const articleId = Number(this.activatedRouter.snapshot.paramMap.get('id')!);
    const comment: Comment = {
      content: this.form.get('content')!.value!,
    }

    this.commentService.createComment(articleId, comment).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.updateComments.emit();
      },
      error: (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error.message;
      }
    });
  }
}

