import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FirelibraryModule } from './modules/firelibrary/core';

import { LibService } from './providers/lib.service';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';

import { RegisterPage } from './pages/register-page/register-page';
import { ForumPage } from './pages/forum-page/forum-page';
import { LoginPage } from './pages/login-page/login-page';
import { InstallPage } from './pages/install-page/install-page';
import { UpdateProfilePage } from './pages/update-profile-page/update-profile-page';

import * as firebase from 'firebase';
import 'firebase/firestore';
import { FileUploadComponent } from './components/file-upload/file-upload.component';


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
  { path: 'install', component: InstallPage },
  { path: 'update-profile', component: UpdateProfilePage },
  { path: '', component: ForumPage }
  // { path: '', component: UpdateProfilePage }
];


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    FileUploadComponent,

    RegisterPage,
    ForumPage,
    LoginPage,
    InstallPage,
    UpdateProfilePage,
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
