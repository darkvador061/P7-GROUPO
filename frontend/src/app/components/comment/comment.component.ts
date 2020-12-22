import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../models/Comment.model';
import { User } from '../../models/User.model';
import { CommentService } from '../../services/comment.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  // on récupère les variables user et comment du post.component
  @Input() public comments: Comment;
  @Input() public user: User;

  public liked: boolean;
  public disliked: boolean;
  public likeCount: number = 0;
  public dislikeCount: number = 0;

  constructor(private comment: CommentService, 
              private post: PostsService) { }

  ngOnInit() {
    // on récupère les likes et dislikes du commentaire
    if (this.comments.Comments_Likes === undefined || this.comments.Comments_Likes === null) {
      this.comment.getOneComment(this.user.id, this.comments.id).subscribe((res: Comment) => {
        // on compte le nombre de likes/dislikes par utilisateur pour chaque like ou dislike dans le tableau Comments_Likes
        res.Comments_Likes.forEach(like => {
          if (like.likes === 1) {
            this.likeCount += 1;
            if (like.userId === this.user.id) {
              this.liked = true;
            }
          } else if (like.dislikes === 1) {
            this.dislikeCount += 1;
            if (like.userId === this.user.id) {
              this.disliked = true;
            }
          }
        })
      });
    }
  }

  // on supprime le commentaire
  onDeleteComment() {    
    this.comment.deleteComment(this.user.id, this.comments.id).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // on like le commentaire
  onLike() {
    this.comment.likeComment(this.user.id, this.comments.id, !this.liked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.liked = !this.liked

      // on met à jour le commentaire
      if (this.liked) {
        this.likeCount++;
      } else {
        this.likeCount--;
      }
    });
  }

  // on dislike le commentaire
  onDislike() {
    this.comment.dislikeComment(this.user.id, this.comments.id, !this.disliked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.disliked = !this.disliked

      // on met à jour le commentaire
      if (this.disliked) {
        this.dislikeCount++;
      } else {
        this.dislikeCount--;
      }
    });
  }
}