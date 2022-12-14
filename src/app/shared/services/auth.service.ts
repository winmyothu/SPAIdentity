import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Subject } from 'rxjs';
import { Constants } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userManager: UserManager;
  private _user: any;
  private _loginChangedSubject = new Subject<boolean>();
  public loginChanged = this._loginChangedSubject.asObservable();

  private get idpSettings() : UserManagerSettings {
    return {
      authority: Constants.idpAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}/signin-callback`,
      scope: "api2",
      response_type: "code",
      post_logout_redirect_uri: `${Constants.clientRoot}/`
    }
  }

  constructor() { 
    this._userManager = new UserManager(this.idpSettings);
  }

  public login = () => {
    return this._userManager.signinRedirect();
}
public isAuthenticated = (): Promise<boolean> => {
  return this._userManager.getUser()
  .then(user => {
    if(this._user !== user){
      this._loginChangedSubject.next(this.checkUser(user as User));
    }
    this._user = user;
    return this.checkUser(user as User);
  })
}

private checkUser = (user : User): boolean => {
  return !!user && !user.expired;
}

public finishLogin = (): Promise<User> => {
  return this._userManager.signinRedirectCallback()
  .then(user => {
    this._user = user;
    this._loginChangedSubject.next(this.checkUser(user));
    return user;
  })
}
public logout = () => {
  this._userManager.signoutRedirect();
}

public finishLogout = () => {
  this._user = null;
  return this._userManager.signoutRedirectCallback();
}

public getAccessToken = (): Promise<string|null> => {
  return this._userManager.getUser()
    .then(user => {
       return !!user && !user.expired ? user.access_token : null;
  })
}

}
