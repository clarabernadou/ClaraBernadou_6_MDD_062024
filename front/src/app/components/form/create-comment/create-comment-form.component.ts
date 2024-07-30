import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-comment-form',
    templateUrl: './create-comment-form.component.html',
    styleUrls: ['../../../app.component.scss'],
})
export class CreateCommentFormComponent implements OnInit {
  public loading: boolean = false;
  public onError: boolean = false;
  public errorMessage: string = '';
  public submitted: boolean = false;
  public comments: Comment[] = [];
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  @Output() updateComments: EventEmitter<void> = new EventEmitter<void>();

  public form = this.fb.group({
    content: ['', [ Validators.required ]]
  })

  constructor(
    private commentService: CommentService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  public submitComment(): void {
    this.submitted = true; 
    if (this.form.invalid) return;

    this.loading = true;

    const articleId = Number(this.activatedRouter.snapshot.paramMap.get('id')!);
    const comment: Comment = {
      content: this.form.get('content')!.value!,
    };

    this.commentService.createComment(articleId, comment).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.updateComments.emit();
      },
      error: (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'Une erreur est survenue';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

