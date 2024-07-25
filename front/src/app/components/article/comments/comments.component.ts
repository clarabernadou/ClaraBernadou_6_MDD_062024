import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, mergeMap } from 'rxjs';
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
    public loading = true;
    public onError = false;
    public errorMessage = '';
    public comments: Comment[] = [];

    ngOnInit(): void {
        this.getAllComments();
    }

    constructor(
        private userService: UserService,
        private commentService: CommentService,
        private activatedRouter: ActivatedRoute,
    ) {}

    public getAllComments(): void {
        const articleId = Number(this.activatedRouter.snapshot.paramMap.get('id')!);
        this.commentService.getComments(articleId).pipe(
            mergeMap((comments: Comment[]) => {
                const commentObservables = comments.map((comment: Comment) => {
                    return this.userService.getUserById(comment.user_id!).pipe(
                        map((user: User) => ({
                        ...comment,
                        username: user.username,
                        }))
                    );
                });
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
            }
        });
    }
}
