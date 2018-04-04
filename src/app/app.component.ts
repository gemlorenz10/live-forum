import { FireService } from './modules/firelibrary/providers/fire.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private systemInstalled;
  constructor(private fire: FireService, private router: Router) {
  }

  ngOnInit() {
    this.systemInstall();
  }

  onFinishInstall(isInstalled: boolean) {
    if (isInstalled) {
      this.systemInstalled = isInstalled;
    } else {
      this.systemInstall();
    }
  }

  onClickLogout() {
    this.fire.user.logout();
  }

  private systemInstall() {
    this.fire.checkInstall()
    .then(res => {
      this.systemInstalled = res.data.installed;
      console.log('Is system installed?', res.data.installed);
    });
  }

  private isLogin(): boolean {
    return this.fire.user.isLogin;
  }

  private isLogout(): boolean {
    return this.fire.user.isLogout;
  }
}
