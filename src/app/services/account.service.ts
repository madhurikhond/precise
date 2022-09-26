import { Injectable } from '@angular/core';
import { HttpService } from './common/http.service';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { StorageService } from './common/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private validToken = new BehaviorSubject<boolean>(false);
  $validToken = this.validToken.asObservable();

  constructor(private _httpService: HttpService, private _storageService: StorageService) { }

  
  getValidToken(val: any) {
    debugger
    this.validToken.next(val);
  }
  get isLoggedIn() {
    return !!this._storageService.user;
  }

  get isTokenValid() {
    return !!this._storageService.JWTToken;
  }

  login(loginModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('Account/Login', loginModel, showGlobalLoader);
  }

  forgotPassword(forgotPasswordModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('Account/ForgotPassword', forgotPasswordModel, showGlobalLoader);
  }

  getServiceCompanies(showGlobalLoader: boolean = true) {
    return this._httpService.get('Account/GetServiceCompanyList', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetVersionDetail(showGlobalLoader: boolean = true){
    return this._httpService.get(`MasterValues/GetVersionDetail`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPickupDetails(companyId: string, refNumber: string,pageNumber:any,pageSize:any, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Account/GetPickupStatus?companyId=${companyId}&refNumber=${refNumber}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getSubDetailsById(subId: string, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Account/GetSubDetailBySubId?subId=${subId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPagePermission(groupname: string, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Account/GetPagePermission/${groupname}`, showGlobalLoader).pipe(map((res: ApiResponse) => res));
  }
  requestLogin(modelValue: string, showGlobalLoader: boolean = true) {
    return this._httpService.post(`Account/RequestLogin`, modelValue, showGlobalLoader,true);
  }
  ContactUs(modelValue: string, showGlobalLoader: boolean = true) {
    return this._httpService.post(`Account/ContactUs`, modelValue, showGlobalLoader,true);
  }
  getServiceStateList(showGlobalLoader: boolean = true) {
    return this._httpService.get('Account/GetUSAStates', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

}
