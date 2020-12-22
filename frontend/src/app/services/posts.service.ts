import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  // on instancie un subject de type "Post" à la valeur null
  public postSubject = new BehaviorSubject<Post[]>(null);

  constructor(private http: HttpClient, private router: Router) { }

  // renvoie tous les posts depuis le serveur
  public getAllPosts() {
    this.http.get('http://localhost:3000/api/posts').subscribe(
      (res: Post[]) => {
        this.setPosts(res);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // envoie une requête au serveur pour la récupération des informations d'un post
  //
  // id: userID
  // postId: postId
  public getOnePost(id: number, postId: number): Observable<Post> {
    return this.http.get<Post>('http://localhost:3000/api/posts/'+id+'/'+postId);
  }

  // envoie une requête au serveur pour la création d'un nouveau post
  public createNewPost(userId: number, author: string, title: string, content: string, imageUrl?: File): Observable<Object> {
    if (imageUrl) {
      // on créé une nouvelle instance de Post
      const newPost = new Post();

      newPost.userId = userId;
      newPost.author = author;
      newPost.title = title;
      newPost.content = content;

      // on formate les données
      const formData = new FormData();
      
      formData.append('post', JSON.stringify(newPost));
      formData.append('image', imageUrl);

      return this.http.post<Object>('http://localhost:3000/api/posts/create/', formData);
    } else {
      // on créé une nouvelle instance de Post
      const newPost = new Post();

      newPost.userId = userId;
      newPost.author = author;
      newPost.title = title;
      newPost.content = content;

      // on formate les données
      const formData = new FormData();

      formData.append('post', JSON.stringify(newPost));

      return this.http.post<Object>('http://localhost:3000/api/posts/create/', formData);
    }
  }

  // envoie une requête au serveur pour la supression du post et de ses commentaires
  //
  // id: userId
  // postId: postId
  public deletePost(id: number, postId: number): Observable<Object> {
    return this.http.delete<Object>('http://localhost:3000/api/posts/delete/'+id+'/'+postId);
  }

  // envoie une requête au serveur pour le like du post
  //
  // id: userId
  // postId: postId
  // like: like 1 || 0
  public likePost(id: number, postId: number, like: boolean): Observable<Object> {
    return this.http.post<Object>('http://localhost:3000/api/posts/like/', { userId: id, postId: postId, like: like ? 1 : 0 });
  }

  // envoie une requête au serveur pour le dislike du post
  //
  // id: userId
  // postId: postId
  // like: like -1 || 0
  public dislikePost(id: number, postId: number, dislike: boolean): Observable<Object> {
    return this.http.post<Object>('http://localhost:3000/api/posts/like/', { userId: id, postId: postId, like: dislike ? -1 : 0 });
  }

  // on transforme le subject "Post" en observable
  public getPosts(): Observable<Post[]> {
    return this.postSubject.asObservable();
  }

  // on met à jour le subject "Post"
  public setPosts(posts: Post[]) {
    this.postSubject.next(posts);
  }
}
