import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { RegisterPage } from './pages/register-page/register-page';
import { ForumPage } from './pages/forum-page/forum-page';
import { LoginPage } from './pages/login-page/login-page';


const appRoutes: Routes = [
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  { path: '', component: ForumPage }
];


@NgModule({
  declarations: [
    AppComponent,
    RegisterPage,
    ForumPage,
    LoginPage
  ],
  imports: [
    RouterModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
