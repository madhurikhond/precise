import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpLienPortalRequestService {
  apiUrl: string;
  header: any;
  constructor(private http: HttpClient,private handler: HttpBackend,private _http: HttpClient) {
    this.apiUrl = `${environment.baseLienPortalUrl}`;
    this.header = new HttpHeaders();
    this._http =  new HttpClient(this.handler);
  }

  post(url: string, postData: any,isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.apiUrl + url, postData, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  postByPass(url: string, postData: any,isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'false');
    headers = headers.set('Content-Type', 'application/json');
    return this._http.post(this.apiUrl + url, postData, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

}
