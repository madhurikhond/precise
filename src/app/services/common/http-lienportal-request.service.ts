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

  //  HTTP `POST`
  post(url: string, postData: any,isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    headers = headers.set('Content-Type', 'application/json');
    // if(postData.jwtToken != null && postData.jwtToken != undefined)
    //    headers = headers.set('Authorization', `Bearer ${postData.jwtToken}`);
    return this.http.post(this.apiUrl + url, postData, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `POST`
  postByPass(url: string, postData: any,isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'false');
    headers = headers.set('Content-Type', 'application/json');
    return this._http.post(this.apiUrl + url, postData, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }


  //  HTTP `GET`
  get(url: string, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.get(this.apiUrl + url, { headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `PUT`
  put(url: string, putData: any, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.put(this.apiUrl + url, putData,{ headers: headers }).pipe(map(res => {
      return res;
    }));
  }

  //  HTTP `DELETE`
  delete(url: string, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
    return this.http.delete(this.apiUrl + url).pipe(map(res => {
      return res;
    }));
  }

   //  HTTP `POST` for file download
   export(url: string, postData: any, isShowGlobalLoader:boolean) {
    let headers = new HttpHeaders();
    if(isShowGlobalLoader)
      headers = headers.set('Loader', 'true');
      return this.http.post<Blob>(this.apiUrl + url, postData, { headers: headers, responseType: 'blob' as 'json' }).pipe(map(res => {
        return res;
      }));
  }
}
