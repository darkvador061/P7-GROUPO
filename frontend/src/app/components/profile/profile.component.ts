import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy, OnInit {

  public profileForm: FormGroup;
  public user: User;
  public userSubscription: Subscription;
  public image: string;
  public imageAsChanged: boolean;
  public showModal: boolean;
  public loading: boolean;

  constructor(private formBuilder: FormBuilder, 
              private auth: AuthService, 
              private router: Router) { }

  ngOnInit() {
    this.loading = true;

    // on souscrit à la valeur du subject "User" en tant qu'observable quand on initialise la page
    this.userSubscription = this.auth.getUser().subscribe((res: User) => {
      if (res !== undefined && res !== null) {
        this.user = res;
        this.loading = false;
        
        // on initialise les données du formulaire de sélection d'une nouvelle image de l'utilisateur
        this.profileForm = this.formBuilder.group({
          image: [this.user.imageUrl, [Validators.required]]
        });
      }
    });

    // on récupère les informations de l'utilisateur côté serveur
    const userId = this.auth.getUserId();
    if (userId) {
      this.auth.getUserServerId(+userId);
    }

    // l'image n'a pas été changé
    this.imageAsChanged = false;

    // le modal est caché
    this.showModal = false;
  }

  // on récupère l'image qui a été selectionné par l'utilisateur
  onSelectFile(imageInput: HTMLInputElement) {
    const file = imageInput.files[0];
    this.profileForm.get('image').setValue(file);
    this.profileForm.updateValueAndValidity();

    // l'image a été changé
    this.imageAsChanged = true;
  }

  // on modifie la nouvelle l'image de l'utilisateur
  onEditProfile() {
    const formValue: { image: File } = this.profileForm.value;
    this.auth.editUserProfile(this.user.id, formValue.image).subscribe((res: { message: string }) => {
      console.log(res.message);
      this.ngOnInit();
    });
  }

  // on affiche le modal
  onShowModal() {
    this.showModal = true;
  }
  
  // on cache le modal
  onCloseModal() {
    this.showModal = false;
  }

  // on supprime l'utilisateur
  onDeleteProfile() {
    this.auth.deleteUserProfile(this.user.id).subscribe((res: { message: string }) => {
      console.log(res.message);
      this.auth.logout();
    });
  }

  // on annule la suppression du profile
  onCancelDelete(event: Event) {
    event.stopPropagation();
  }

  ngOnDestroy() {
    // on se désabonne de la soucription à l'observable User lorsqu'on quitte la page
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}