import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/Post.model';
import { User } from '../../models/User.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  // on recupère les variables user et post du posts.component
  @Input() public posts: Post;
  @Input() public user: User;

  public commentForm: FormGroup;
  public showModal: boolean;
  public showComment: boolean;
  public liked: boolean;
  public disliked: boolean;
  public likeCount: number = 0;
  public dislikeCount: number = 0;

  constructor(private formBuilder: FormBuilder, private comment: CommentService, private post: PostsService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    // on initialise les données du formulaire pour la publication d'un nouveau commentaire
    this.commentForm = this.formBuilder.group({
      comments: ['', Validators.required]
    });

    // on cache le modal
    this.showModal = false;

    // on cache les commentaires
    this.showComment = false;
    
    // on compte le nombre de likes/dislikes par utilisateur pour chaque like ou dislike dans le tableau Posts_Likes
    this.posts.Posts_Likes.forEach(like => {
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
  }

  // on affiche le modal
  onShowModal() {
    this.showModal = true;
  }
  
  // on cache le modal
  onCloseModal() {
    this.showModal = false;
  }

  // on ajoute le nouveau commentaire
  onCreateComment() {
    const author = this.user.firstName +' '+ this.user.lastName;
    const comments = this.commentForm.get('comments').value;

    this.comment.createNewComment(this.user.id, this.posts.id, author, comments).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on ferme le modal
      this.showModal = false;

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // affiche/cache les commentaires
  onShowComment() {
    this.showComment = !this.showComment;
  }

  // on annule la création du commentaire
  onCancelComment(event: Event) {
    event.stopPropagation();
  }

  // on supprime le post
  onDeletePost() {
    this.post.deletePost(this.user.id, this.posts.id).subscribe((res: { message: string }) => {
      console.log(res.message);

      // on recharge les posts
      this.post.getAllPosts();
    });
  }

  // on vérifie s'il s'agit d'une image ou d'une vidéo
  isFileImage(filename) {
    let ext = filename.split('.').pop();

    if (ext === 'mp4') {
      return true
    } else {
      return false 
    }
  }

  // on met au pluriel le mot s'il y a plusieurs commentaires
  isManyComment() {
    if (this.posts.Comments.length < 2) {
      return 'commentaire'
    } else {
      return 'commentaires'
    }
  }

  // on like le post
  onLike() {
    this.post.likePost(this.user.id, this.posts.id, !this.liked).subscribe((res: { message: string }) => {
      console.log(res.message);

      this.liked = !this.liked

      // on met à jour le post
      if (this.liked) {
        this.likeCount++;
      } else {
        this.likeCount--;
      }
    });
  }

  // on dislike le post
  onDislike() {
    this.post.dislikePost(this.user.id, this.posts.id, !this.disliked).subscribe((res: { message: string }) => {
      console.log(res.message);
      
      this.disliked = !this.disliked

      // on met à jour le post
      if (this.disliked) {
        this.dislikeCount++;
      } else {
        this.dislikeCount--;
      }
    });
  }
}