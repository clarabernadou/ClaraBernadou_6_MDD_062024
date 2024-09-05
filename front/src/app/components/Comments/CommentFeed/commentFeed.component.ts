import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, mergeMap, Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/interfaces/comment.interface';

@Component({
  selector: 'app-comment-feed',
  templateUrl: './commentFeed.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class CommentFeedComponent implements OnInit, OnDestroy {
    public loading: boolean = true;
    public onError: boolean = false;
    public errorMessage: string = '';
    public comments: Comment[] = [];
    private subscription: Subscription = new Subscription();

    constructor(
        private userService: UserService,
        private commentService: CommentService,
        private activatedRouter: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loadComments();
        this.commentService.commentCreated.subscribe(() => {
            this.loadComments(); 
        });
    }

    private loadComments(): void {
        this.loading = true;
        const articleId = this.getArticleId();

        if (articleId !== null) {
            this.subscription.add(
                this.commentService.getComments(articleId).pipe(
                    mergeMap((comments: Comment[]) => this.enrichCommentsWithUsernames(comments))
                ).subscribe({
                    next: (comments: Comment[]) => {
                        this.comments = comments;
                        this.loading = false;
                    },
                    error: (error: any) => {
                        this.handleError(error);
                    }
                })
            );
        } else {
            this.handleError(new Error('Invalid article ID'));
        }
    }

    private getArticleId(): number | null {
        const id = this.activatedRouter.snapshot.paramMap.get('id');
        return id ? Number(id) : null;
    }

    private enrichCommentsWithUsernames(comments: Comment[]) {
        const commentObservables = comments.map((comment: Comment) => 
            this.userService.getUserById(comment.user_id!).pipe(
                map((user: User) => ({
                    ...comment,
                    username: user.username,
                }))
            )
        );
        return forkJoin(commentObservables);
    }

    private handleError(error: any): void {
        this.onError = true;
        this.errorMessage = error.message;
        this.loading = false;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}