import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

interface AuthResponseData {
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

  private _userIsAuthenticated = false;
  private _userId = null;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) { }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }

  signup(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(`${this.FB_AUTH_URL}/signupNewUser?key=${environment.firebaseAPIKey}`,
            { email: email, password: password, returnSecureToken: true });
  }
}
