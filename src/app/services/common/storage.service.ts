import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from 'src/app/models/login';
import { LanguageOption } from 'src/app/models/patient-response';
import { TokenService } from './token.service';

const USER = 'user';
const JWT_TOKEN = 'jwt_t';
const PARTNER_ID = 'p_id';
const PARTNER_JWT_Token = 'p_jwt_t';
const LIEN_JWT_Token = 'l_jwt_t';
const PATIENT_LANGUAGE = 'lang';
const PATIENT_STUDY = 'p_study';
const PATIENT_PREGNANCY = 'p_pregnancy';
const PATIENT_PRESCREENING = 'p_prescreening';
const PATIENT_TIMEOUT = 'p_timeout';
const LIEN_TIMEOUT = 'lien_timeout';
const LAST_PAGE_URL = 'last_page_url';
//const User_Role = 'user_permission';
const EXPAND_ROWS = 'expand_rows';
const ROLES = 'roles';
const FRESH_LOGIN = 'fresh_login'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private loggedInUser: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public fullLanguageName: string = 'english';
  private _permission = null;
  private matches = [];

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
    localStorage.removeItem(PARTNER_JWT_Token);
    localStorage.removeItem(LIEN_JWT_Token);
    localStorage.removeItem(PARTNER_ID);
    localStorage.removeItem(LIEN_TIMEOUT);
    localStorage.removeItem(PATIENT_TIMEOUT);
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

  public set PTimeout(date: string) {
    localStorage.setItem(PATIENT_TIMEOUT, date);
  }

  public get PTimeout():string {
    return localStorage.getItem(PATIENT_TIMEOUT);
  }



  public set LienTimeout(date: string) {
    localStorage.setItem(LIEN_TIMEOUT, date);
  }

  public get LienTimeout():string {
    return localStorage.getItem(LIEN_TIMEOUT);
  }

  public set PartnerId(partnerId: string) {
    localStorage.setItem(PARTNER_ID, partnerId);
  }

  public set PatientPregnancy(patientPregnancy: string) {
    localStorage.setItem(PATIENT_PREGNANCY, patientPregnancy);
  }

  public get PatientPregnancy():string {
    return localStorage.getItem(PATIENT_PREGNANCY);
  }

  public set PatientPreScreening(preScreening: string) {
    localStorage.setItem(PATIENT_PRESCREENING, preScreening);
  }

  public get PatientPreScreening():string {
    return localStorage.getItem(PATIENT_PRESCREENING);
  }

  public set PatientStudy(study: string) {
    localStorage.setItem(PATIENT_STUDY, study);
  }

  public get PatientStudy(): string {
    return localStorage.getItem(PATIENT_STUDY);
  }

  removePatientStudy(){
    localStorage.removeItem(PATIENT_STUDY);
  }

  removePatientPreScreening(){
    localStorage.removeItem(PATIENT_PRESCREENING);
  }

  removePatientPregnancy(){
    localStorage.removeItem(PATIENT_PREGNANCY);
  }

  public set PartnerJWTToken(jwtToken: string) {
    localStorage.setItem(PARTNER_JWT_Token, jwtToken);
  }

  public set LienJWTToken(jwtToken: string) {
    localStorage.setItem(LIEN_JWT_Token, jwtToken);
  }

  setPatientLanguage(language: string) {
    if(language === LanguageOption.ES)
      this.fullLanguageName = 'spanish';
    else
      this.fullLanguageName = 'english';
    localStorage.setItem(PATIENT_LANGUAGE, language);
  }

  getPatientLanguage(): string {
    return localStorage.getItem(PATIENT_LANGUAGE);
  }

  public get JWTToken(): string {
    return JSON.parse(localStorage.getItem(JWT_TOKEN));
  }

  public set LastPageURL(url: string) {
    localStorage.setItem(LAST_PAGE_URL, JSON.stringify(url));
  }

  public get PartnerId(): string {
    return JSON.parse(localStorage.getItem(PARTNER_ID));
  }

  public get PartnerJWTToken(): string {
    return localStorage.getItem(PARTNER_JWT_Token);
  }

  public get LienJWTToken(): string {
    return localStorage.getItem(LIEN_JWT_Token);
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

  LogoutPatient()
  {
    localStorage.removeItem(PARTNER_JWT_Token);
    localStorage.removeItem(PARTNER_ID);
    localStorage.clear();
  }

  LogoutLienPortal()
  {
    localStorage.removeItem(LIEN_JWT_Token);
    localStorage.removeItem(PARTNER_ID);
    localStorage.removeItem(LIEN_TIMEOUT);
    localStorage.clear();
    this.clearAll();
    this.clearAuth();
  }
  // public set UserRole(value: string) {
  //   localStorage.setItem(User_Role, JSON.stringify(value));
  // }

  public get UserRole(): string {
    let roles = this._tokenservice.getDecodedAccessToken(this.JWTTokenRoles);
    if (roles) {
      return roles.Roles;
    }
    else {
      localStorage.removeItem('user');
      localStorage.removeItem('roles');
      localStorage.removeItem('_cr_u_infor');
      localStorage.removeItem('jwt_t');
      if(this.user)
        window.location.reload();

    }
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

  public get isFromPatientPortal():boolean {
    var p_detail = localStorage.getItem("p_detail");
    if(p_detail)
    {
      return true;
    }
    else{
      return false;
    }
  }
  public get pJWTValid():boolean {
    var token = this.PartnerJWTToken;
    if (token != null && token != undefined) {
      var decodedToken = this._tokenservice.getDecodedAccessToken(this.PartnerJWTToken);
      var tokenExpiry = new Date(decodedToken.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        return false;
      }
      else{
        return true;
      }
    }else
      return false;
  }

  public get L_JWTValid():boolean {
    var token = this.LienJWTToken;
    if (token != null && token != undefined) {
      var decodedToken = this._tokenservice.getDecodedAccessToken(this.LienJWTToken);
      var tokenExpiry = new Date(decodedToken.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        return false;
      }
      else{
        return true;
      }
    }else
      return false;
  }

  addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }

  public get permission() {
    return this._permission;
  }

  public set permission(value: string) {
    this._permission = null;
    var data = this.UserRole;
    var routerUrl = value ? value : window.location.pathname;
    if (data) {
      try {
        let list: any = [];
        let responseHierarchy = JSON.parse(data);

        if (responseHierarchy && responseHierarchy.length) {
          responseHierarchy.forEach((value) => {
            if (value && value.hierarchy) {
              list.push(JSON.parse(value.hierarchy));
            }
          });
        }

        if (routerUrl.includes('?')) {
          var check = routerUrl;
          var a = check.split('?');
          routerUrl = a[0];
        }
        this.filter_for_permission(list, routerUrl.toLowerCase());

        if (this.matches.length > 0) {
          this._permission = this.matches;
        }

      } catch (error) {

      }
    }
  }


  private filter_for_permission(arr, term) {
    arr.forEach((i) => {
      var masterUrl = i.MasterUrl.toLowerCase();
      if (term.includes(masterUrl) && masterUrl !== '') {
        this.matches.push(i);
      }
      if (i.Children.length > 0) {
        this.filter_for_permission(i.Children, term);
      }
    });
  }
}
