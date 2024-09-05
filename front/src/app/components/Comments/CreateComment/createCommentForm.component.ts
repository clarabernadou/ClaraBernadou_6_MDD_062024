import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subscription } from 'rxjs';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-create-comment-form',
  templateUrl: './createCommentForm.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class CreateCommentFormComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  public onError: boolean = false;
  public errorMessage: string = '';
  public submitted: boolean = false;
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscription: Subscription = new Subscription();

  @Output() updateComments: EventEmitter<void> = new EventEmitter<void>();

  public form = this.fb.group({
    content: ['', [Validators.required]]
  });

  constructor(
    private commentService: CommentService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.subscribeToBreakpoints();
  }

  private subscribeToBreakpoints(): void {
    this.subscription.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscription.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  public submitComment(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    const articleId = this.getArticleId();
    const comment: Comment = { content: this.form.get('content')!.value! };

    this.commentService.createComment(articleId, comment).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = false;
        this.form.reset();
        this.commentService.notifyCommentUpdate();
      },
      error: (error) => {
        this.loading = false;
        this.submitted = false;
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  private getArticleId(): number {
    return Number(this.activatedRouter.snapshot.paramMap.get('id')!);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}