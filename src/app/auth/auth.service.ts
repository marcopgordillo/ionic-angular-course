import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import {map, tap} from 'rxjs/operators';

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
export class AuthService {

  private FB_AUTH_URL = environment.fbAuthUrl;

  private _user = new BehaviorSubject<User>(null);

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
    this._user.next(null);
  }

  signup(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(`${this.FB_AUTH_URL}/signupNewUser?key=${environment.firebaseAPIKey}`,
            { email, password, returnSecureToken: true })
        .pipe(
            tap(this.setUserData.bind(this))
        );
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime ));
  }
}
