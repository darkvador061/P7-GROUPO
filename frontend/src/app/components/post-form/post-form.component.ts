import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  public postForm: FormGroup;
  public user: User;
  public userSubscription: Subscription;
  public image: string;
  private imageAsChanged: boolean;
  public showModal: boolean;
  public loading: boolean;

  constructor(private formBuilder: FormBuilder, 
              private auth: AuthService, 
              private post: PostsService, 
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    
    // on souscrit à la valeur du subject "User" en tant qu'observable quand on initialise la page
    this.userSubscription = this.auth.getUser().subscribe((res: User) => {
      if (res !== undefined && res !== null) {
        this.user = res;
        this.loading = false;
        
        // on initialise les données du formulaire pour la publication d'un nouveau post
        this.postForm = this.formBuilder.group({
          title: ['', Validators.required],
          content: ['', Validators.required],
          image: ['']
        });
      }
    });

    // on récupère les informations de l'utilisateur côté serveur
    const userId = this.auth.getUserId();
    if (userId) {
      this.auth.getUserServerId(+userId);
    }

    // le modal est caché
    this.showModal = false;
  }

  // on récupère l'image qui a été selectionné par l'utilisateur
  onSelectFile(imageInput: HTMLInputElement) {
    const file = imageInput.files[0];
    this.postForm.get('image').setValue(file);
    this.postForm.updateValueAndValidity();

    // l'image a été changé
    this.imageAsChanged = true;
  }

  // on ajoute le nouveau post
  onCreatePost() {
    const author = this.user.firstName +' '+ this.user.lastName;
    const title = this.postForm.get('title').value;
    const content = this.postForm.get('content').value;

    if (this.imageAsChanged) {
      const imageUrl: { image: File } = this.postForm.value;
      this.post.createNewPost(this.user.id, author, title, content, imageUrl.image).subscribe((res: { message: string }) => {
        console.log(res.message);
        
        // on recharge les posts
        this.post.getAllPosts();

        // on redirige l'utilisateur vers la page du forum
        this.router.navigateByUrl('/forum');
      });
    } else {
      this.post.createNewPost(this.user.id, author, title, content).subscribe((res: { message: string }) => {
        console.log(res.message);

        // on recharge les posts
        this.post.getAllPosts();

        // on redirige l'utilisateur vers la page du forum
        this.router.navigateByUrl('/forum');
      });
    }
  }

  // on annule la création du post et on redirige l'utilisateur vers la page du forum
  onCancelPost() {
    this.router.navigateByUrl('/forum');
  }

}
