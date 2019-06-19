export class User {
  constructor(
      public id: string,
      public email: string,
      private _token: string,
      private tokenExpirationDate: Date) {}

  get token() {
    return !this.tokenExpirationDate || this.tokenExpirationDate <= new Date() ? null : this._token;
  }
}
