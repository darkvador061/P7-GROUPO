import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Comment } from '../models/Comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private router: Router) { }

  // envoie une requête au serveur pour la création d'un nouveau commentaire
  public createNewComment(userId: number, postId: number, author: string, comments: string): Observable<Object> {
    // on créé une nouvelle instance de Comment
    const newComment = new Comment();

    newComment.userId = userId;
    newComment.postId = postId;
    newComment.author = author;
    newComment.comments = comments;

    return this.http.post<Object>('http://localhost:3000/api/comment/create/', { comment: newComment });
  }

  // envoie une requête au serveur pour la récupération des informations de tous les commentaires
  public getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>('http://localhost:3000/api/comment/');
  }

  // envoie une requête au serveur pour la récupération des informations d'un commentaire
  //
  // id: userID
  // commentId: commentId
  public getOneComment(id: number, commentId: number): Observable<Comment> {
    return this.http.get<Comment>('http://localhost:3000/api/comment/'+id+'/'+commentId);
  }

  // envoie une requête au serveur pour la supression du commentaire
  //
  // id: userID
  // commentId: commentId
  public deleteComment(id: number, commentId: number): Observable<Object> {
    return this.http.delete<Object>('http://localhost:3000/api/comment/delete/'+id+'/'+commentId);
  }

  // envoie une requête au serveur pour le like du commentaire
  //
  // id: userId
  // commentId: commentId
  // like: like 1 || 0
  public likeComment(id: number, commentId: number, like: boolean): Observable<Object> {
    return this.http.post<Object>('http://localhost:3000/api/comment/like/', { userId: id, commentId: commentId, like: like ? 1 : 0 });
  }

  // envoie une requête au serveur pour le dislike du commentaire
  //
  // id: userId
  // commentId: commentId
  // like: like -1 || 0
  public dislikeComment(id: number, commentId: number, dislike: boolean): Observable<Object> {
    return this.http.post<Object>('http://localhost:3000/api/comment/like/', { userId: id, commentId: commentId, like: dislike ? -1 : 0 });
  }
}