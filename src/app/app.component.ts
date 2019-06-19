import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {AppState, Capacitor, PluginListenerHandle, Plugins} from '@capacitor/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private prevAuthState = false;
  private appStateListener: PluginListenerHandle;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.prevAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.prevAuthState = isAuth;
    });
    this.appStateListener = Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    this.appStateListener.remove();
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
          .autoLogin()
          .pipe(take(1))
          .subscribe(success => {
            if (!success) {
              this.onLogout();
            }
          });
    }
  }
}
