import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from 'src/app/models/login';
import { TokenService } from './token.service';

const USER = 'user';
const JWT_TOKEN = 'jwt_t';
const LAST_PAGE_URL = 'last_page_url';
//const User_Role = 'user_permission';
const EXPAND_ROWS = 'expand_rows';
const ROLES = 'roles';
const FRESH_LOGIN='fresh_login'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private loggedInUser: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private _tokenservice: TokenService) {
    this.loggedInUser = new BehaviorSubject<any>('');
    this.currentUser = this.loggedInUser.asObservable();
  }
  public get currentUserValue(): any {
    return this.loggedInUser.value;
  }
  settCurrentUser(res: any) {
    this.loggedInUser.next(res);
    localStorage.setItem('_cr_u_infor', JSON.stringify(res));
  }
  clearAll() {
    localStorage.removeItem(USER);
    localStorage.removeItem(JWT_TOKEN);
  }
  public set setFreshLogin(isfreshlogin) {
    localStorage.setItem(FRESH_LOGIN, isfreshlogin);
  }
  clearAuth() {
    const token = this.JWTToken;
    this.clearAll();
    this.JWTToken = token;
  }
 
  public set JWTToken(token: string) {
    localStorage.setItem(JWT_TOKEN, JSON.stringify(token));
  }

  public get JWTToken(): string {
    return JSON.parse(localStorage.getItem(JWT_TOKEN));
  }

  public set LastPageURL(url: string) {
    localStorage.setItem(LAST_PAGE_URL, JSON.stringify(url));
  }

  public get LastPageURL(): string {
    return JSON.parse(localStorage.getItem(LAST_PAGE_URL));
  }

  public get user(): AuthUser {
    var tokenData = this._tokenservice.getDecodedAccessToken(this.JWTToken);
    (localStorage.setItem(USER, JSON.stringify(tokenData)));
    return tokenData;
  }

  public set user(user: AuthUser) {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  setExpandRowDetail(data: any) {
    let stringData = JSON.stringify(data);
    localStorage.setItem(EXPAND_ROWS, stringData);
  }

  getExpandRowDetail() {
    let parseData = JSON.parse(localStorage.getItem(EXPAND_ROWS));
    if (parseData)
      return parseData;
    else
      return [];
  }


  // public set UserRole(value: string) {
  //   localStorage.setItem(User_Role, JSON.stringify(value));
  // }

  public get UserRole(): string {
    return this._tokenservice.getDecodedAccessToken(this.JWTTokenRoles).Roles;  
   // return JSON.parse(localStorage.getItem(User_Role));
  }
  setItem(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  public set JWTTokenRoles(token: string) {
    localStorage.setItem(ROLES, JSON.stringify(token));
  }

  public get JWTTokenRoles(): string {
    return JSON.parse(localStorage.getItem(ROLES));
  }

  public get getFreshLogin(): string {
    return JSON.parse(localStorage.getItem(FRESH_LOGIN));
  }
}
