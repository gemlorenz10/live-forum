import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FirelibraryModule } from './modules/firelibrary/core';

import { LibService } from './providers/lib.service';

import { AppComponent } from './app.component';

import { AvatarComponent } from './components/avatar/avatar.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { InstallComponent } from './components/install/install.component';
import { PostFormComponent } from './components/post/post-form/post-form.component';
import { PostItemComponent } from './components/post/post-item/post-item.component';
import { CategoryComponent } from './components/category/category.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentItemComponent } from './components/comment/comment-item/comment-item.component';

import { RegisterPage } from './pages/register-page/register-page';
import { ForumPage } from './pages/forum-page/forum-page';
import { LoginPage } from './pages/login-page/login-page';
import { UpdateProfilePage } from './pages/profile-page/update/update-profile-page';
import { AdminPage } from './pages/admin-page/admin-page';
import { PostPage } from './pages/post-page/post-page';

import * as firebase from 'firebase';
import 'firebase/firestore';
import { PostComponent } from './components/post/post.component';



firebase.initializeApp({
  apiKey: 'AIzaSyBICC2AsPPYYxkVmfcCF9fDNSAJov-4TVU',
  authDomain: 'thruthesky-firebase-backend.firebaseapp.com',
  databaseURL: 'https://thruthesky-firebase-backend.firebaseio.com',
  projectId: 'thruthesky-firebase-backend',
  storageBucket: 'thruthesky-firebase-backend.appspot.com',
  messagingSenderId: '918272936330'
});

const appRoutes: Routes = [
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  { path: 'update-profile', component: UpdateProfilePage },
  { path: 'admin', component: AdminPage },
  { path: 'post/:id', component: PostPage },
  { path: '', component: ForumPage }
];


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    AvatarComponent,
    InstallComponent,
    CategoryComponent,
    PostFormComponent,
    PostItemComponent,

    RegisterPage,
    ForumPage,
    LoginPage,
    UpdateProfilePage,
    AdminPage,
    PostPage,
    CommentComponent,
    CommentItemComponent,
    PostComponent

  ],
  imports: [
    FormsModule,
    RouterModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FirelibraryModule.forRoot( { firebaseApp: firebase.app(), functions: true } )
  ],
  providers: [FirelibraryModule, LibService],
  bootstrap: [AppComponent]
})
export class AppModule { }
