import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, mergeMap, Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/interfaces/comment.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class CommentsComponent implements OnInit {
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
        this.getAllComments();
    }

    public getAllComments(): void {
        this.loading = true;

        const articleId = Number(this.activatedRouter.snapshot.paramMap.get('id')!);
        this.subscription.add(
            this.commentService.getComments(articleId).pipe(
                mergeMap((comments: Comment[]) => {
                    const commentObservables = comments.map((comment: Comment) => 
                        this.userService.getUserById(comment.user_id!).pipe(
                            map((user: User) => ({
                                ...comment,
                                username: user.username,
                            }))
                        )
                    );
                    return forkJoin(commentObservables);
                })
            ).subscribe({
                next: (comments: Comment[]) => {
                    this.comments = comments;
                    this.loading = false;
                },
                error: (error: any) => {
                    this.onError = true;
                    this.errorMessage = error.message;
                    this.loading = false;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
