import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, from} from 'rxjs';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean; // optional
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private FB_AUTH_URL = environment.fbAuthUrl;

  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user
        .asObservable()
        .pipe(
            map(user => {
              if (user) {
                return !!user.token; // conversion to boolean
              } else {
                return false;
              }
            })
        );
  }

  get userId() {
    return this._user
        .asObservable()
        .pipe(
            map(user => {
              if (user) {
                return user.id;
              } else {
                return null;
              }
            })
        );
  }

  get token() {
    return this._user
        .asObservable()
        .pipe(
            map(user => {
              if (user) {
                return user.token;
              } else {
                return null;
              }
            })
        );
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(`${this.FB_AUTH_URL}/verifyPassword?key=${environment.firebaseAPIKey}`,
            { email, password, returnSecureToken: true })
        .pipe(
            tap(this.setUserData.bind(this))
        );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  signup(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(`${this.FB_AUTH_URL}/signupNewUser?key=${environment.firebaseAPIKey}`,
            { email, password, returnSecureToken: true })
        .pipe(
            tap(this.setUserData.bind(this))
        );
  }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'}))
        .pipe(
            map(storedData => {
              if (!storedData || !storedData.value) {
                return null;
              }
              const parsedData = JSON.parse(storedData.value) as {
                token: string,
                tokenExpirationDate: string,
                userId: string,
                email: string
              };
              const expirationTime = new Date(parsedData.tokenExpirationDate);
              if (expirationTime <= new Date()) {
                return null;
              }
              return new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
            }),
            tap(user => {
              if (user) {
                this._user.next(user);
                this.autoLogout(user.tokenDuration);
              }
            }),
            map(user => {
              return !!user; // convert to observable
            })
        );
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storageAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storageAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const data = JSON.stringify({userId, token, tokenExpirationDate, email});
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
